/* Compare every computed style on every element against the pristine build.

   Screenshots prove what a visitor sees; this proves what the cascade resolved
   to, which is the thing a refactor of stylesheets actually risks. It catches a
   changed value even where nothing overlaps it visually, and it names the
   element and property instead of pointing at a rectangle. */
const { chromium } = require('playwright');

const SKIP = /^(--|animation|transition|webkitAnimation|webkitTransition|perspectiveOrigin|transformOrigin)/;

const grab = async (b, port, width, base = '/') => {
  const p = await b.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
  await p.goto(`http://127.0.0.1:${port}${base}`, { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); }
    window.scrollTo(0, 0);
  });
  await p.mouse.move(2, 2);
  await p.waitForTimeout(200);
  const out = await p.evaluate((skipSrc) => {
    const SKIP = new RegExp(skipSrc);
    const rows = [];
    const walk = (el, path) => {
      const cs = getComputedStyle(el);
      const vals = {};
      for (const prop of cs) { if (!SKIP.test(prop)) vals[prop] = cs.getPropertyValue(prop); }
      rows.push([path, vals]);
      [...el.children].forEach((c, i) => { if (!/^(script|style)$/i.test(c.tagName)) walk(c, `${path}>${c.tagName.toLowerCase()}[${i}]`); });
    };
    walk(document.body, 'body');
    return rows;
  }, SKIP.source);
  await p.close();
  return out;
};

const REF = process.argv[2] || 5197, CUR = process.argv[3] || 5199;
const REF_BASE = process.argv[4] || '/', CUR_BASE = process.argv[5] || '/';

(async () => {
  const b = await chromium.launch();
  let bad = 0, elements = 0;
  for (const width of [390, 1440]) {
    const [a, c] = [await grab(b, REF, width, REF_BASE), await grab(b, CUR, width, CUR_BASE)];
    const cm = new Map(c);
    if (a.length !== c.length) {
      console.log(`${width}: ELEMENT COUNT ${a.length} -> ${c.length}`);
      const am = new Set(a.map((r) => r[0]));
      c.filter((r) => !am.has(r[0])).forEach((r) => console.log(`   only in current: ${r[0]}`));
    }
    for (const [path, va] of a) {
      const vc = cm.get(path);
      elements++;
      if (!vc) { console.log(`${width}: missing element ${path}`); bad++; continue; }
      for (const k of Object.keys(va)) {
        if (va[k] !== vc[k]) {
          if (bad++ < 30) console.log(`${width}  ${k}: ${va[k]}  ->  ${vc[k]}\n      ${path}`);
        }
      }
    }
  }
  console.log(bad ? `\n${bad} computed-value differences over ${elements} elements` : `\nevery computed value matches, over ${elements} elements at 390 and 1440`);
  await b.close();
})();
