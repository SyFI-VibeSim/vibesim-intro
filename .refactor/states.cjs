/* The four state classes became data attributes. A static capture only proves
   the default state; this checks each attribute actually selects something. */
const { chromium } = require('/home/kanzhu/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.js');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await p.goto('http://127.0.0.1:5199/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30));} });
  // the scatter lives in the third tier tab, which is not mounted at load
  const tabs = await p.$$('[role="tab"]');
  for (const t of tabs) {
    const label = (await t.textContent()) || '';
    if (/iteration/i.test(label)) { await t.scrollIntoViewIfNeeded(); await t.click(); break; }
  }
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const g = (el, prop) => getComputedStyle(el)[prop];
    const out = {};
    const legend = document.querySelectorAll('[class*="legend"] i');
    out.prefillLegend = legend.length === 2 && g(legend[0],'backgroundColor') !== g(legend[1],'backgroundColor');
    const dots = [...document.querySelectorAll('[class*="scatter"] i')];
    const pre = dots.filter(d => d.dataset.prefill === 'true'), dec = dots.filter(d => d.dataset.prefill !== 'true');
    out.prefillDots = pre.length > 0 && dec.length > 0 && g(pre[0],'backgroundColor') !== g(dec[0],'backgroundColor');
    const wf = document.querySelector('[class*="waterfall"]');
    out.hasSelection = wf?.dataset.hasSelection === 'true';
    const spans = [...wf.children];
    const nec = spans.filter(s => s.dataset.necessary === 'true');
    out.necessaryBar = nec.length > 0 && g(nec[0],'backgroundColor') !== g(spans.find(s=>s.dataset.necessary!=='true'),'backgroundColor');
    out.dimmedOthers = spans.some(s => s.dataset.highlighted !== 'true' && g(s,'opacity') === '0.4');
    const buckets = [...document.querySelectorAll('[class*="bucket"]')].filter(b => b.dataset.selected !== undefined);
    const sel = buckets.filter(b => b.dataset.selected === 'true');
    out.selectedBucket = sel.length === 1 && g(sel[0],'boxShadow') !== 'none'
      && g(sel[0].querySelector('dt'),'color') !== g(buckets.find(b=>b.dataset.selected!=='true').querySelector('dt'),'color');
    return out;
  });
  console.log(r);
  console.log(Object.values(r).every(Boolean) ? 'all four state attributes select correctly' : 'FAILURE');
  await b.close();
})();
