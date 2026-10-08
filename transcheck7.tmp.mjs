import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await p.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });
const seq = async (label, fn) => {
  const vals = await p.evaluate((fnStr) => new Promise((resolve) => {
    const el = document.documentElement;
    const out = [];
    const t0 = performance.now();
    const tick = () => { out.push(getComputedStyle(el).backgroundColor); if (performance.now()-t0 < 650) requestAnimationFrame(tick); else resolve([...new Set(out)]); };
    requestAnimationFrame(() => { (0, eval)(fnStr); requestAnimationFrame(tick); });
  }), fn);
  console.log(label, vals);
};
await seq('classList remove+add+colorScheme:', `el.classList.remove('light','dark'); el.classList.add('dark'); el.style.colorScheme='dark';`);
await p.evaluate(() => document.documentElement.classList.remove('dark'));
await seq('className direct:', `el.className = el.className.replace('light','dark');`);
await seq('add only:', `el.classList.add('dark');`);
await b.close();
