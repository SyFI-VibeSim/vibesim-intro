const { chromium } = require('/home/kanzhu/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.js');
const AXE = '/tmp/vibesim-lighthouse-cache/_npx/0f94ee7615faf582/node_modules/axe-core/axe.min.js';
const port = process.argv[2] || 5199;
(async () => {
  const b = await chromium.launch();
  for (const width of [390, 1024, 1440]) {
    const p = await b.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    await p.addScriptTag({ path: AXE });
    const r = await p.evaluate(async () => await window.axe.run(document, { resultTypes: ['violations'] }));
    console.log(`${width}: ${r.violations.length} violations`);
    r.violations.forEach((v) => console.log(`   [${v.impact}] ${v.id}: ${v.help}  (${v.nodes.length} nodes)`));
    await p.close();
  }
  await b.close();
})();
