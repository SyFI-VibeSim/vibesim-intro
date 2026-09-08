/* Every link beside the heading it actually lands on.

   Written after a round of link fixes: the nav said "Supported systems" and
   went to a section headed "Explore VibeSim's key features", where supported
   systems is one row out of six. Two buttons in different places carried the
   same label word for word. Nothing caught either, because a wrong anchor
   still scrolls somewhere and still renders fine.

   So this prints the pairing, and the pairing is the thing to read. It also
   fails on a link whose target does not exist at all, and on a label used
   twice.

   Usage: node .refactor/links.cjs [port] [base] */
const { chromium } = require('playwright');
const port = process.argv[2] || 5199;
const base = process.argv[3] || '/';

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await p.goto(`http://127.0.0.1:${port}${base}`, { waitUntil: 'networkidle' });

  const collect = () => p.evaluate(() => {
    // Where a link lands: the target's own heading, or the nearest one above it.
    const headingFor = (el) => {
      const own = el.matches('h1,h2,h3') ? el : el.querySelector('h1,h2,h3');
      if (own) return own.textContent.trim().replace(/\s+/g, ' ');
      const all = [...document.querySelectorAll('h1,h2,h3')];
      const top = el.getBoundingClientRect().top + window.scrollY;
      const above = all.filter((h) => h.getBoundingClientRect().top + window.scrollY <= top + 1);
      const near = above[above.length - 1];
      return near ? `(inside) ${near.textContent.trim().replace(/\s+/g, ' ')}` : '(no heading)';
    };
    return [...document.querySelectorAll('a[href]')].map((a) => {
      const href = a.getAttribute('href');
      const text = a.textContent.trim().replace(/\s+/g, ' ');
      // The wordmark is deliberately in both the header and the footer, so it
      // is the one label allowed to appear twice.
      const brand = a.getAttribute('aria-label') === 'VibeSim home';
      if (!href.startsWith('#')) {
        const kind = href.startsWith('data:') ? `${href.slice(0, href.indexOf(','))} …` : href;
        return { text, href: kind, lands: '(off page)', ok: true, brand };
      }
      const target = document.getElementById(href.slice(1));
      return target
        ? { text, href, lands: headingFor(target), ok: true, brand }
        : { text, href, lands: 'TARGET DOES NOT EXIST', ok: false, brand };
    });
  });

  // The three case panels each carry their own download link, and only the
  // selected one is mounted, so every tab has to be opened to see them all.
  const seen = new Map();
  const add = (rows) => rows.forEach((l) => seen.set(`${l.text}|${l.href}`, l));
  add(await collect());
  const tabs = await p.locator('[role="tab"]').count();
  for (let i = 0; i < tabs; i++) {
    await p.locator('[role="tab"]').nth(i).click();
    await p.waitForTimeout(120);
    add(await collect());
  }
  const links = [...seen.values()];

  const w = Math.max(...links.map((l) => l.text.length));
  for (const l of links) {
    console.log(`${l.text.padEnd(w)}  ${l.href.padEnd(12)}  ->  ${l.lands}`);
  }

  const missing = links.filter((l) => !l.ok);
  const counts = links
    .filter((l) => !l.brand)
    .reduce((m, l) => m.set(l.text, (m.get(l.text) || 0) + 1), new Map());
  const repeated = [...counts].filter(([, n]) => n > 1);

  console.log('');
  console.log('broken targets:', missing.length ? missing.map((l) => l.href) : 'none');
  console.log('repeated labels:', repeated.length ? repeated.map(([t, n]) => `${t} ×${n}`) : 'none');
  await b.close();
  if (missing.length || repeated.length) process.exitCode = 1;
})();
