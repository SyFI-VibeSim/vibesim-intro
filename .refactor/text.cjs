/* Every string the page can show, in one list.

   Screenshots prove the layout did not move but nobody reads 25 PNGs looking
   for a sentence that should not be there. Most of the copy is also behind
   something: three tablists and a stage list hide their panels, and the three
   conversations park their tables inside a closed <details>. So this clicks
   every tab and opens every disclosure, collects the text after each one, and
   prints the union with duplicates dropped.

   Use it two ways. Read it, to check the wording. Diff it across a change, to
   prove no visible string moved. */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await p.goto('http://127.0.0.1:5199/', { waitUntil: 'networkidle' });

  const blocks = [];
  const collect = async () => {
    await p.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
    await p.waitForTimeout(120);
    blocks.push(await p.evaluate(() => document.body.innerText));
  };

  await collect();
  const tabs = await p.locator('[role="tab"]').count();
  for (let i = 0; i < tabs; i++) {
    await p.locator('[role="tab"]').nth(i).click();
    await p.waitForTimeout(120);
    await collect();
  }

  const seen = new Set();
  for (const block of blocks) {
    for (const line of block.split('\n')) {
      const text = line.trim();
      if (text && !seen.has(text)) { seen.add(text); console.log(text); }
    }
  }
  console.error(`${seen.size} distinct lines across ${tabs} tabs`);
  await b.close();
})();
