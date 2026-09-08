/* The screenshot harness captures with reduced motion, so it cannot see whether
   an animation still resolves. This checks the thing modules put at risk: that
   every animation-name in use still matches a reachable @keyframes rule. */
const { chromium } = require('/home/kanzhu/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.js');
const port = process.argv[2] || 5199;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30));
    }
  });
  const out = await p.evaluate(() => {
    const defined = new Set();
    for (const sheet of document.styleSheets) {
      let rules; try { rules = sheet.cssRules; } catch { continue; }
      const walk = (rs) => { for (const r of rs) {
        if (r.type === CSSRule.KEYFRAMES_RULE) defined.add(r.name);
        else if (r.cssRules) walk(r.cssRules);
      } };
      walk(rules);
    }
    const used = new Map();
    for (const el of document.querySelectorAll('*')) {
      for (const n of getComputedStyle(el).animationName.split(',').map((s) => s.trim())) {
        if (n && n !== 'none') used.set(n, (used.get(n) || 0) + 1);
      }
    }
    return {
      defined: [...defined].sort(),
      used: [...used.entries()].sort(),
      dangling: [...used.keys()].filter((n) => !defined.has(n)),
    };
  });
  console.log('keyframes defined:', out.defined.join(', ') || 'none');
  out.used.forEach(([n, c]) => console.log(`  ${n}  used by ${c} elements`));
  console.log(out.dangling.length ? `DANGLING: ${out.dangling.join(', ')}` : 'no dangling animation names');
  await b.close();
})();
