// Gerçek bir Android telefonu (Samsung benzeri) taklit eder: küçük ekran, yüksek piksel yoğunluğu, yavaş işlemci ve ağ.
// Birkaç zamanda ekran görüntüsü alır ve "siyah ekran" olup olmadığını piksellerden ölçer.
// Kullanım: node check-phone.mjs [adres] [cpu-yavaşlatma] [kbit/sn] [reduce]
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const url = process.argv[2] || 'https://enesdouaydin.github.io/portfolyo/';
const cpu = Number(process.argv[3] || 4);
const kbps = Number(process.argv[4] || 4000);
const reduce = process.argv[5] === 'reduce';
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const ctx = await browser.newContext({
  viewport: { width: 360, height: 780 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36',
  ignoreHTTPSErrors: true,
  reducedMotion: reduce ? 'reduce' : 'no-preference',
});
const page = await ctx.newPage();
const errs = [];
page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) errs.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => errs.push(`[pageerror] ${e.message}`));
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 100,
  downloadThroughput: (kbps * 1000) / 8,
  uploadThroughput: (kbps * 1000) / 16,
});
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

// ekran görüntüsündeki "aydınlık" piksel oranı: tamamen siyah ekranda ~0
const brightShare = (buf) => {
  const png = PNG.sync.read(buf);
  let bright = 0;
  const n = png.width * png.height;
  for (let i = 0; i < n; i += 7) {
    const o = i * 4;
    if (png.data[o] + png.data[o + 1] + png.data[o + 2] > 150) bright++;
  }
  return ((bright / (n / 7)) * 100).toFixed(2);
};

console.log(`Cihaz: Samsung S24 benzeri 360×780 @3x · CPU ${cpu}x yavaş · ${kbps} kbit/sn · hareket azaltma: ${reduce ? 'AÇIK' : 'kapalı'}`);
const t0 = Date.now();
await page.goto(url, { waitUntil: 'commit' });
for (const sec of [1, 2.5, 5, 9, 15, 25]) {
  await page.waitForTimeout(Math.max(0, sec * 1000 - (Date.now() - t0)));
  const shot = await page.screenshot({ path: `/work/out/shots/phone-${reduce ? 'reduce-' : ''}${String(sec).replace('.', '_')}s.png` });
  const info = await page
    .evaluate(() => ({
      header: !!document.querySelector('.site-header'),
      h1: !!document.querySelector('.hero-h1'),
      h1Opacity: document.querySelector('.hero-h1')
        ? getComputedStyle(document.querySelector('.hero-h1').closest('.rise') || document.querySelector('.hero-h1')).opacity
        : '-',
      intro: !!document.querySelector('.intro'),
      hint: document.querySelector('.hero-hint')?.textContent?.trim().slice(0, 40) || '-',
    }))
    .catch(() => ({ header: '?', h1: '?', h1Opacity: '?', intro: '?', hint: 'sayfa meşgul' }));
  console.log(`${String(sec).padStart(4)} sn: aydınlık piksel %${brightShare(shot).padStart(5)} | menü:${info.header} h1:${info.h1} (opaklık ${info.h1Opacity}) açılış perdesi:${info.intro} | ${info.hint}`);
}
console.log(errs.length ? 'KONSOL: ' + [...new Set(errs)].slice(0, 6).join(' | ') : 'konsol temiz');
await browser.close();
