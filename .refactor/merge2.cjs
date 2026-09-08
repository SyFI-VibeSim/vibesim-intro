/* Merge duplicate selectors, deciding safety exactly rather than conservatively.

   A merge moves the declarations the earlier rule has and the later one does
   not, forward to the later rule's position. That can only change an outcome
   when some rule in between (a) sets the same property, (b) has the same
   specificity, since a more specific rule already wins and a less specific one
   already loses, and (c) actually matches some of the same elements. The third
   condition is the one that needs a browser, so the selectors are resolved
   against the real document.

   Module class names are hashed in the served CSS, so the served sheet is
   parsed alongside the source; rule order is identical, which pairs them up. */
const postcss = require('postcss');
const fs = require('fs');
const { chromium } = require('playwright');

const [file, servedUrl, apply] = [process.argv[2], process.argv[3], process.argv[4] === '--apply'];

const flatten = (root) => {
  const out = [];
  root.walkRules((r) => {
    if (r.parent.type === 'atrule' && /keyframes/.test(r.parent.name)) return;
    let ctx = [], p = r.parent;
    while (p && p.type === 'atrule') { ctx.unshift(`@${p.name} ${p.params}`); p = p.parent; }
    out.push({ rule: r, ctx: ctx.join('|') });
  });
  return out;
};

const props = (r) => { const s = new Set(); r.walkDecls((d) => s.add(d.prop)); return s; };
const spec = (sel) => {
  const s = sel.replace(/:global\(([^)]*)\)/g, '$1');
  const ids = (s.match(/#[\w-]+/g) || []).length;
  const cls = (s.match(/\.[\w-]+|\[[^\]]*\]|:[a-z-]+(?!\()/g) || []).length;
  const els = (s.replace(/[.#[][^\s>+~]*/g, ' ').match(/\b[a-z][a-z0-9]*\b/g) || []).length;
  return `${ids},${cls},${els}`;
};

(async () => {
  const source = postcss.parse(fs.readFileSync(file, 'utf8'));
  const src = flatten(source);
  /* A plain stylesheet's selectors already match the document; only a module's
     need resolving against the served, hashed copy. */
  let served = src;
  if (servedUrl !== '-') {
    served = flatten(postcss.parse(await (await fetch(servedUrl)).text()));
    if (src.length !== served.length) { console.error(`rule count differs: source ${src.length}, served ${served.length}`); process.exit(1); }
  }

  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await p.goto('http://127.0.0.1:5199/', { waitUntil: 'networkidle' });
  const overlaps = async (s1, s2) => p.evaluate(([x, y]) => {
    const q = (s) => { try { return [...document.querySelectorAll(s.replace(/::?(hover|focus|focus-visible|active)\b/g, ''))]; } catch { return null; } };
    const a = q(x), c = q(y);
    if (a === null || c === null) return true;      // unparseable: assume it overlaps
    return a.some((e) => c.includes(e));
  }, [s1, s2]);

  const byKey = new Map();
  src.forEach((e, i) => {
    const key = e.ctx + '>>>' + e.rule.selector.replace(/\s+/g, ' ');
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(i);
  });

  let merged = 0, refused = 0;
  for (const [key, idxs] of byKey) {
    if (idxs.length < 2) continue;
    for (let k = idxs.length - 1; k > 0; k--) {
      const ai = idxs[k - 1], bi = idxs[k];
      const A = src[ai].rule, B = src[bi].rule;
      const pb = props(B);
      const onlyA = [...props(A)].filter((x) => !pb.has(x));
      const blockers = [];
      for (let i = ai + 1; i < bi; i++) {
        const other = src[i].rule;
        if (src[i].ctx !== src[ai].ctx) continue;
        if (![...props(other)].some((x) => onlyA.includes(x))) continue;
        if (other.selectors.every((s) => spec(s) !== spec(A.selectors[0]))) continue;
        if (await overlaps(served[ai].rule.selector, served[i].rule.selector)) blockers.push(other.selector.replace(/\s+/g, ' '));
      }
      if (blockers.length) { refused++; console.log(`REFUSED ${key}\n   ${onlyA.join(', ')} would move past ${[...new Set(blockers)].join('; ')}`); continue; }
      A.walkDecls((d) => { if (!pb.has(d.prop)) B.prepend(d.clone()); });
      A.remove();
      merged++;
    }
  }
  await b.close();
  console.log(`merged ${merged}; refused ${refused}`);
  if (apply) fs.writeFileSync(file, source.toString() + '\n');
})();
