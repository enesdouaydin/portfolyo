// İlk yükleme ölçümü (mobil ağ benzetimi): ne kadar veri iniyor, ilk içerik ve 3D model ne zaman geliyor?
// Kullanım: BASE_URL=http://host.docker.internal:8090/portfolyo node check-perf.mjs [kbit/sn] [gecikme-ms]
// Varsayılan: 4000 kbit/sn, 100 ms (orta seviye 4G). Yavaş 4G için: 1600 150
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://host.docker.internal:8090/portfolyo';
const kbps = Number(process.argv[2] || 4000);
const latency = Number(process.argv[3] || 100);
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars'],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency,
  downloadThroughput: (kbps * 1000) / 8,
  uploadThroughput: (kbps * 1000) / 8 / 2,
});
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

const t0 = Date.now();
await page.goto(base + '/', { waitUntil: 'commit' });
// Hero metni görünene kadar
await page.waitForSelector('.hero-h1', { state: 'visible', timeout: 120000 });
const tText = Date.now() - t0;
// Model gelene kadar (kaynak zamanlaması)
const modelRe = /enes\.glb/;
const waitModel = async () => {
  for (let i = 0; i < 600; i++) {
    const done = await page.evaluate(
      (src) => performance.getEntriesByType('resource').some((e) => new RegExp(src).test(e.name) && e.responseEnd > 0),
      modelRe.source,
    );
    if (done) return Date.now() - t0;
    await page.waitForTimeout(100);
  }
  return -1;
};
const tModel = await waitModel();
await page.waitForTimeout(1500);

const res = await page.evaluate(() =>
  performance
    .getEntriesByType('resource')
    .map((e) => ({ name: e.name.replace(location.origin, ''), kb: Math.round(e.transferSize / 1024), type: e.initiatorType, end: Math.round(e.responseEnd) }))
    .sort((a, b) => b.kb - a.kb),
);
const total = res.reduce((s, r) => s + r.kb, 0);
console.log(`Ağ: ${kbps} kbit/sn, ${latency} ms gecikme (önbellek kapalı)`);
console.log(`Hero metni görünür : ${(tText / 1000).toFixed(1)} sn`);
console.log(`3D model indi      : ${tModel < 0 ? 'inmedi' : (tModel / 1000).toFixed(1) + ' sn'}`);
console.log(`Toplam aktarım     : ${(total / 1024).toFixed(2)} MB  (${res.length} istek)`);
console.log('En büyük 8 kaynak:');
for (const r of res.slice(0, 8)) console.log(`  ${String(r.kb).padStart(6)} KB  ${String(r.end).padStart(6)} ms  ${r.name}`);
await browser.close();
