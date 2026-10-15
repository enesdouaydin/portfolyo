// Canlı siteyi mobil tarayıcı motorlarıyla açar: sayfa geliyor mu, JS hatası var mı, ne görünüyor?
// Kullanım: node check-live.mjs [adres]   (varsayılan: https://enesdouaydin.github.io/portfolyo/)
// Not: bu ağda TLS araya girdiği için yalnızca bu test istemcisinde sertifika hatası yok sayılır (herkese açık siteyi okuruz).
import { chromium, webkit, devices } from 'playwright';

const url = process.argv[2] || 'https://enesdouaydin.github.io/portfolyo/';
const targets = [
  { name: 'Android Chrome (Pixel 7)', engine: chromium, device: devices['Pixel 7'], args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] },
  { name: 'iPhone Safari (iPhone 13)', engine: webkit, device: devices['iPhone 13'], args: [] },
];

for (const t of targets) {
  console.log(`\n=== ${t.name}`);
  let browser;
  try {
    browser = await t.engine.launch({ args: t.args });
    const ctx = await browser.newContext({ ...t.device, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    const errs = [];
    const bad = [];
    page.on('console', (m) => {
      if (['error', 'warning'].includes(m.type())) errs.push(`[${m.type()}] ${m.text()}`);
    });
    page.on('pageerror', (e) => errs.push(`[pageerror] ${e.message}`));
    page.on('response', (r) => {
      if (r.status() >= 400) bad.push(`${r.status()} ${r.url().replace('https://enesdouaydin.github.io', '')}`);
    });
    page.on('requestfailed', (r) => bad.push(`FAILED ${r.url().replace('https://enesdouaydin.github.io', '')} ${r.failure()?.errorText}`));
    const t0 = Date.now();
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 90000 });
    console.log(`belge durumu: ${resp?.status()}  (${((Date.now() - t0) / 1000).toFixed(1)} sn)`);
    await page.waitForTimeout(8000);
    const info = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim().slice(0, 50) || '(h1 yok)',
      hint: document.querySelector('.hero-hint')?.textContent?.trim() || '(ipucu yok)',
      canvas: !!document.querySelector('canvas'),
      bodyText: document.body.innerText.trim().slice(0, 80).replace(/\n/g, ' | '),
      introVisible: !!document.querySelector('.intro'),
      webgl: (() => {
        try {
          return !!document.createElement('canvas').getContext('webgl2') || !!document.createElement('canvas').getContext('webgl');
        } catch {
          return false;
        }
      })(),
      decompression: typeof DecompressionStream !== 'undefined',
    }));
    console.log('sayfa:', JSON.stringify(info));
    console.log(bad.length ? 'hatalı istekler:\n  ' + [...new Set(bad)].join('\n  ') : 'hatalı istek yok');
    console.log(errs.length ? 'konsol:\n  ' + [...new Set(errs)].slice(0, 8).join('\n  ') : 'konsol temiz');
    await page.screenshot({ path: `/work/out/shots/live-${t.name.split(' ')[0].toLowerCase()}.png` });
  } catch (e) {
    console.log('AÇILAMADI:', e.message.split('\n')[0]);
  } finally {
    await browser?.close();
  }
}
