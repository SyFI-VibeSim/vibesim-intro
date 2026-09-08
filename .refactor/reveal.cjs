/* The scroll reveal is invisible to every other check here, because the
   captures and the computed-style comparison both run with reduced motion,
   where the effect returns before it marks anything. This loads with motion on
   and counts what the observer actually found. */
const { chromium } = require('/home/kanzhu/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.js');
const port = process.argv[2] || 5199;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
  });
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({
    marked: document.querySelectorAll('.will-reveal').length,
    revealed: document.querySelectorAll('.will-reveal.in-view').length,
    intros: document.querySelectorAll('.section-intro').length,
    rows: document.querySelectorAll('article[class*="row"]').length,
  }));
  console.log(r);
  await b.close();
})();
