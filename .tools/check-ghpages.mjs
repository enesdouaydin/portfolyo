// GitHub Pages benzetimi: site alt yolda (/portfolyo/) ve eksik dosyada 404.html ile sunulurken rotalar, yenileme,
// doğrudan bağlantı, video ve #hash çalışıyor mu? Kullanım: BASE_URL=http://host.docker.internal:8090 node check-ghpages.mjs
import { chromium } from 'playwright';

const origin = process.env.BASE_URL || 'http://host.docker.internal:8090';
const base = origin + (process.env.BASE_PATH ?? '/portfolyo');
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) problems.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));
// 404.html ile sunulan derin bağlantıda belge isteği 404 döner; yalnızca alt kaynaklar (js/css/medya) hata sayılır.
page.on('response', (r) => {
  if (r.status() >= 400 && r.request().resourceType() !== 'document') problems.push(`[${r.status()}] ${r.url()}`);
});
let fails = 0;
const ok = (cond, msg) => {
  console.log((cond ? 'OK    ' : 'HATA  ') + msg);
  if (!cond) fails++;
};
// Sondaki eğik çizgi önemsiz: /portfolyo ve /portfolyo/ aynı sayfadır.
const trimSlash = (s) => (s.endsWith('/') ? s.slice(0, -1) : s);
const path = () => {
  const u = new URL(page.url());
  return trimSlash(u.pathname) + u.hash;
};
const titleIs = (t) => page.waitForFunction((x) => document.title === x, t, { timeout: 5000 }).catch(() => {});

await page.goto(base + '/', { waitUntil: 'networkidle' });
await titleIs('Enes Dou Aydın — Portfolyo');
ok((await page.title()) === 'Enes Dou Aydın — Portfolyo', 'ana sayfa açılıyor: ' + (await page.title()));
ok((await page.locator('canvas').count()) > 0, 'ana sayfada 3D tuval var');

await page.locator('a.row', { hasText: 'Belge Doldurma Otomasyonu' }).click();
await page.waitForURL('**/projeler/belge-doldurma');
await titleIs('Belge Doldurma Otomasyonu — Vaka çalışması');
ok(path() === '/portfolyo/projeler/belge-doldurma', 'liste satırı alt yolla gidiyor: ' + path());

await page.reload({ waitUntil: 'networkidle' });
await titleIs('Belge Doldurma Otomasyonu — Vaka çalışması');
ok((await page.title()) === 'Belge Doldurma Otomasyonu — Vaka çalışması', 'yenileme (404.html üzerinden) sayfayı koruyor');
ok((await page.locator('canvas').count()) > 0, 'yenilenen sayfada 3D tuval var');

await page.goto(base + '/projeler/bayi-rota', { waitUntil: 'networkidle' });
const video = page.locator('video');
await video.scrollIntoViewIfNeeded();
await page.waitForFunction(() => document.querySelector('video')?.readyState >= 1, null, { timeout: 8000 }).catch(() => {});
const v = await video.evaluate((el) => ({ src: el.currentSrc, poster: el.poster, dur: el.duration }));
ok(v.src.endsWith('/portfolyo/media/rota_demo.mp4'), 'video alt yoldan yükleniyor: ' + v.src.replace(origin, ''));
ok(v.poster.endsWith('/portfolyo/media/rota_poster.jpg'), 'video posteri alt yolda');
ok(v.dur > 40, `video süresi okundu (${Math.round(v.dur)} sn)`);

await page.getByRole('link', { name: /Sesli Müşteri\s+Asistanı/ }).click();
await page.waitForURL('**/projeler/sesli-asistan');
ok(path() === '/portfolyo/projeler/sesli-asistan', '"Sıradaki" bağlantısı alt yolla çalışıyor');

await page.getByRole('link', { name: 'Tüm işler' }).click();
await page.waitForURL((u) => trimSlash(u.pathname) === '/portfolyo');
ok(path() === '/portfolyo', '"Tüm işler" ana sayfaya dönüyor: ' + path());

await page.locator('a.row', { hasText: 'Merchandising Platformu' }).click();
await page.waitForTimeout(700);
ok(path() === '/portfolyo#iletisim', 'sayfası olmayan iş iletişime gidiyor: ' + path());
const top = await page.evaluate(() => document.getElementById('iletisim').getBoundingClientRect().top);
ok(top < 300, `iletişim bölümü görünür (üst ${Math.round(top)}px)`);

await page.goto(base + '/olmayan-sayfa', { waitUntil: 'networkidle' });
await titleIs('Enes Dou Aydın — Portfolyo');
ok(path() === '/portfolyo' && (await page.title()) === 'Enes Dou Aydın — Portfolyo', 'tanımsız adres ana sayfaya yönleniyor: ' + path());

console.log(problems.length ? 'KONSOL/AĞ:\n  ' + [...new Set(problems)].join('\n  ') : 'konsol ve ağ temiz');
console.log(fails ? `${fails} HATA` : 'tüm kontroller geçti');
await browser.close();
process.exit(fails ? 1 : 0);
