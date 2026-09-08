/* Capture the page in every state the refactor could disturb.
   Usage: node .refactor/shoot.cjs <outdir> <port> */
const { chromium } = require('playwright');
const out = process.argv[2], port = process.argv[3] || 5198, base = process.argv[4] || '/';
const WIDTHS = [320, 390, 768, 1024, 1440, 1920, 2560];

(async () => {
  const b = await chromium.launch();
  const errs = [], overflow = [];
  for (const w of WIDTHS) {
    const p = await b.newPage({ viewport: { width: w, height: 1000 }, reducedMotion: 'reduce' });
    p.on('pageerror', e => errs.push(`${w}: ${e}`));
    p.on('console', m => m.type() === 'error' && errs.push(`${w}: ${m.text()}`));
    await p.goto(`http://127.0.0.1:${port}${base}`, { waitUntil: 'networkidle' });
    // settle every scroll-reveal before capturing
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await p.mouse.move(2, 2);
    await p.waitForTimeout(900);
    const s = await p.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    if (s[0] > s[1]) overflow.push(`${w}: scrollWidth ${s[0]} > ${s[1]}`);
    await p.screenshot({ path: `${out}/page-${w}.png`, fullPage: true });
    await p.close();
  }
  // interactive states at one representative width
  const p = await b.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
  p.on('pageerror', e => errs.push(`states: ${e}`));
  await p.goto(`http://127.0.0.1:${port}${base}`, { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40));
    }
  });
  await p.waitForTimeout(600);
  const groups = [
    ['wf', '[role=tablist][aria-label="Optimization workflow"] button', '.wf-panel'],
    ['tier', '.why-tier-tabs button', '.why-tier-panel'],
    ['case', '.case-selector button', '.conversation-demo'],
  ];
  for (const [name, sel, shot] of groups) {
    const tabs = await p.$$(sel);
    for (let i = 0; i < tabs.length; i++) {
      await tabs[i].scrollIntoViewIfNeeded();
      await tabs[i].click();
      await p.waitForTimeout(500);
      await p.mouse.move(2, 2);
      await p.waitForTimeout(120);
      const el = await p.$(shot);
      if (el) await el.screenshot({ path: `${out}/${name}-${i + 1}.png` });
    }
  }
  // every why row, since the figures are what we are protecting
  const rows = await p.$$('.why-row');
  for (let i = 0; i < rows.length; i++) {
    await rows[i].scrollIntoViewIfNeeded();
    await p.mouse.move(2, 2);
    await p.waitForTimeout(700);
    await rows[i].screenshot({ path: `${out}/why-${i + 1}.png` });
  }
  await b.close();
  console.log('overflow:', overflow.length ? overflow : 'none');
  console.log('errors:', errs.length ? [...new Set(errs)].slice(0, 6) : 'none');
})();
