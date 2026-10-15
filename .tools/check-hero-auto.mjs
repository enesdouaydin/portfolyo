// Ana sayfa hero'su: kaydırmadan teknoloji çiftleri kendiliğinden ilerliyor mu; kaydırınca kontrol kaydırmaya geçiyor mu?
// Yazılım render'ında (SwiftShader) kare hızı düşüktür ve benzetim kare başına en fazla 0.05 sn ilerler;
// bu yüzden beklenen ilerleme ölçülen kare hızından hesaplanır.
// Kullanım: node check-hero-auto.mjs   (BASE_URL ile adres verilebilir)
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://host.docker.internal:5173';
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars'],
});
// Küçük pencere: aynı mantık, ama yazılım render'ı daha hızlı (genişlik 760'tan büyük: masaüstü yerleşimi)
const page = await browser.newPage({ viewport: { width: 1000, height: 560 } });
const problems = [];
page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) problems.push(m.text());
});
page.on('pageerror', (e) => problems.push(e.message));
let fails = 0;
const ok = (c, msg) => {
  console.log((c ? 'OK    ' : 'HATA  ') + msg);
  if (!c) fails++;
};

const read = () =>
  page.evaluate(() => {
    const cnt = document.querySelector('.hero-pair-count')?.textContent || '';
    const m = cnt.match(/(\d+)\s*\/\s*(\d+)/);
    return {
      pair: m ? Number(m[1]) : -1,
      total: m ? Number(m[2]) : -1,
      group: document.querySelector('.hero-groups li.on')?.textContent?.trim() || '',
      now: document.querySelector('.hero-pair-now')?.textContent || '',
      y: Math.round(scrollY),
    };
  });
// çift değişene kadar (en çok `maxMs`) bekle
const waitChange = async (from, maxMs) => {
  const t0 = Date.now();
  let r = await read();
  while (r.pair === from && Date.now() - t0 < maxMs) {
    await page.waitForTimeout(1500);
    r = await read();
  }
  return r;
};

await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2500); // açılış perdesi (Intro) bitsin

const fps = await page.evaluate(
  () =>
    new Promise((res) => {
      let n = 0;
      const t0 = performance.now();
      const f = () => {
        n++;
        if (performance.now() - t0 > 2500) res(Math.max(0.3, Math.round((n / 2.5) * 10) / 10));
        else requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    }),
);
const simRate = Math.min(1, fps * 0.05); // gerçek saniye başına benzetim saniyesi
console.log(`(kare hızı ${fps} fps → benzetim hızı ${simRate.toFixed(2)}x; çift başına gerçek cihazda ~0.9 sn)`);

// 1) KAYDIRMADAN
const SAMPLES = 10;
const EVERY = 4000;
const seen = [];
for (let i = 0; i < SAMPLES; i++) {
  seen.push(await read());
  await page.waitForTimeout(EVERY);
}
const pairs = seen.map((s) => s.pair);
const expected = ((SAMPLES * EVERY) / 1000) * simRate * (21 / 18.9); // beklenen çift ilerlemesi
console.log('çift sırası (kaydırmadan):', pairs.join(' → '), `  (beklenen ilerleme ≈ ${expected.toFixed(1)} çift)`);
ok(seen.every((s) => s.y === 0), 'sayfa hiç kaydırılmadı (scrollY = 0)');
ok(seen[0].total >= 21, `toplam çift sayısı ${seen[0].total}`);
const gained = Math.max(...pairs) - pairs[0];
ok(gained >= 1 && gained >= Math.floor(expected * 0.5), `çiftler kendiliğinden ilerledi (+${gained}, beklenen ≈ +${expected.toFixed(1)})`);
ok(pairs.every((p, i) => i === 0 || p >= pairs[i - 1]), 'ilerleme geriye atlamadan düzgün artıyor');

// 2) KAYDIRINCA: kaydırma mevcut ilerlemenin üstüne eklenir (geriye sarma yok); hero'nun yarısı kadar kaydır
const beforeScroll = await read();
await page.evaluate(() => {
  const s = document.querySelector('.hero-stage');
  window.scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * 0.5);
});
await page.waitForTimeout(Math.min(30000, Math.max(2500, (40 / fps) * 1000)));
const mid = await read();
console.log(`kaydırınca: ${beforeScroll.pair} → ${mid.pair}  (${mid.now}, ${mid.group})`);
ok(mid.pair > beforeScroll.pair, `kaydırma ilerlemeyi ileri taşıdı (${beforeScroll.pair} → ${mid.pair})`);
ok(
  mid.pair >= Math.min(mid.total, beforeScroll.pair + 6),
  `ilerleme kaldığı yerden devam etti, başa sarmadı (en az +6 beklenir; ${beforeScroll.pair} → ${mid.pair})`,
);

// 3) bırak: kaldığı yerden ilerlemeye devam etmeli
const later = await waitChange(mid.pair, 60000);
console.log(`bırakınca: ${mid.pair} → ${later.pair}  (${later.now}, ${later.group})`);
ok(later.pair !== mid.pair, 'kaydırmayı bırakınca ilerleme sürdü');
ok(Math.abs(later.pair - mid.pair) <= 2, `kaldığı yerden devam etti, atlama yok (${mid.pair} → ${later.pair})`);
ok(later.y === mid.y, 'sayfa konumu değişmedi (ilerleme kaydırmadan bağımsız sürdü)');

// 4) en başa dönünce de çalışsın
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(Math.min(30000, Math.max(2500, (40 / fps) * 1000)));
const top = await read();
const top2 = await waitChange(top.pair, 60000);
console.log(`başa dönünce: ${top.pair} → ${top2.pair}`);
ok(top2.pair !== top.pair, 'başa dönünce de otomatik ilerliyor');

console.log(problems.length ? 'KONSOL: ' + [...new Set(problems)].join(' | ') : 'konsol temiz');
console.log(fails ? `${fails} HATA` : 'tüm kontroller geçti');
await browser.close();
process.exit(fails ? 1 : 0);
