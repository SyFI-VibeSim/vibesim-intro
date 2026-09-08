/* Second-generation mover, for sections whose rules are spread across both
   stylesheets and whose selectors mix section classes with global ones.

   A rule is owned when every selector in its list mentions at least one owned
   class. Inside an owned selector, a class that is not owned stays global and
   is wrapped in :global(). Rules are appended to the module in the order the
   sheets load, so the cascade between them is unchanged. */
const postcss = require('postcss');
const fs = require('fs');

const [ownedFile, moduleOut, ...sheets] = process.argv.slice(2);
const owned = new Set(fs.readFileSync(ownedFile, 'utf8').split(/\s+/).filter(Boolean));
const classesIn = (sel) => [...sel.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
const camel = (n) => { const p = n.split(/-+/); return p[0] + p.slice(1).map((x) => x[0].toUpperCase() + x.slice(1)).join(''); };

const rename = new Map();
const out = postcss.root();
let moved = 0, mixed = 0;

/* Rewrite one selector: owned classes get their module name, everything else is
   marked global so the compiler leaves it alone. */
function rewrite(sel) {
  return sel.replace(/\.([a-zA-Z][\w-]*)/g, (_, c) => {
    if (!owned.has(c)) return `:global(.${c})`;
    if (!rename.has(c)) rename.set(c, camel(c));
    return '.' + rename.get(c);
  });
}

function take(container, into) {
  const pending = [];
  for (const node of [...container.nodes]) {
    if (node.type === 'comment') { pending.push(node); continue; }
    if (node.type === 'rule') {
      if (node.parent.type === 'atrule' && /keyframes/.test(node.parent.name)) { pending.length = 0; continue; }
      const flags = node.selectors.map((s) => classesIn(s).some((c) => owned.has(c)));
      if (flags.every(Boolean)) {
        const clone = node.clone();
        clone.selectors = node.selectors.map(rewrite);
        pending.splice(0).forEach((c) => into.append(c.clone()));
        into.append(clone);
        node.remove();
        moved++;
      } else {
        if (flags.some(Boolean)) { mixed++; console.log('  MIXED, left alone: ' + node.selector); }
        pending.length = 0;
      }
    } else if (node.type === 'atrule' && node.nodes) {
      const shell = node.clone(); shell.removeAll();
      take(node, shell);
      if (shell.nodes.length) {
        pending.splice(0).forEach((c) => into.append(c.clone()));
        into.append(shell);
      } else pending.length = 0;
      if (!node.nodes.length) node.remove();
    } else pending.length = 0;
  }
}

for (const sheet of sheets) {
  const root = postcss.parse(fs.readFileSync(sheet, 'utf8'));
  take(root, out);
  fs.writeFileSync(sheet, root.toString() + '\n');
}
fs.writeFileSync(moduleOut, out.toString() + '\n');
fs.writeFileSync(moduleOut + '.map.json', JSON.stringify(Object.fromEntries(rename), null, 1));
console.log(`moved ${moved} rules into ${moduleOut}; ${rename.size} classes renamed; ${mixed} mixed rules left behind`);
