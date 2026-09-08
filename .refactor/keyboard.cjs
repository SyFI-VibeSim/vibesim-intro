/* All three tablists now share one implementation, so this checks the thing
   that unification puts at risk: that arrow keys, Home and End still move the
   selection and the focus together, and that tabIndex stays roving. */
const { chromium } = require('playwright');
const port = process.argv[2] || 5199;

const GROUPS = [
  { name: 'case selector  (horizontal)', label: 'Serving examples', keys: ['ArrowRight', 'ArrowLeft'] },
  { name: 'level of detail (horizontal)', label: 'Level of detail', keys: ['ArrowRight', 'ArrowLeft'] },
  { name: 'workflow stages (vertical)', label: 'Optimization workflow', keys: ['ArrowDown', 'ArrowUp'] },
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  let ok = true;
  for (const g of GROUPS) {
    const list = p.locator(`[role="tablist"][aria-label="${g.label}"]`);
    const tabs = list.locator('button[role="tab"]');
    const n = await tabs.count();
    await tabs.nth(0).scrollIntoViewIfNeeded();
    await tabs.nth(0).focus();
    const state = async () => ({
      selected: await list.locator('button[aria-selected="true"]').evaluateAll((e) => e.length && e[0].textContent),
      focused: await p.evaluate(() => document.activeElement.textContent),
      roving: await tabs.evaluateAll((els) => els.filter((e) => e.tabIndex === 0).length),
    });
    const checks = [];
    for (const [key, expect] of [[g.keys[0], 1], [g.keys[0], 2], [g.keys[1], 1], ['End', n - 1], ['Home', 0]]) {
      await p.keyboard.press(key);
      await p.waitForTimeout(120);
      const s = await state();
      const want = await tabs.nth(expect).textContent();
      const pass = s.selected === want && s.focused === want && s.roving === 1;
      if (!pass) ok = false;
      checks.push(`${key}${pass ? '' : ` FAILED (selected=${s.selected}, focused=${s.focused}, roving=${s.roving})`}`);
    }
    console.log(`${n} tabs  ${g.name}: ${checks.join(', ')}`);
  }
  console.log(ok ? 'selection and focus move together in all three, tabIndex roving' : 'FAILURE');
  await b.close();
})();
