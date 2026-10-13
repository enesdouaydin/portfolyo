// Bayi Rota etkileşimleri ve sayfalar arası gezinti kontrolü.
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://host.docker.internal:5173';
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars', '--disable-lcd-text', '--font-render-hinting=none'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));
let fails = 0;
const ok = (cond, msg) => { console.log((cond ? 'OK    ' : 'HATA  ') + msg); if (!cond) fails++; };

// ---------- Bayi Rota ----------
await page.goto(base + '/projeler/bayi-rota', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const panel = page.locator('section[aria-label="Proje medyası"]');
await panel.scrollIntoViewIfNeeded();
ok((await panel.innerText()).includes('ekran kaydı · bölüme tıkla, oraya atla'), 'varsayılan sekme: Gerçek uygulama');

await page.getByRole('tab', { name: 'Canlı demo', exact: true }).click();
ok((await panel.innerText()).includes('tarayıcıda çalışan demo · tüm günler'), 'demo etiketi: tüm günler');
ok((await panel.locator('button.dpin').count()) === 57, 'tüm günler: 57 bayi pini');
ok((await panel.innerText()).includes('57 bayi, 6 güne dağıtıldı'), 'bilgi kutusu: HAZIR PLAN');

await panel.getByRole('button', { name: 'Çar', exact: true }).click();
ok((await panel.innerText()).includes('tarayıcıda çalışan demo · Çarşamba'), 'gün seçimi: Çarşamba');
const numbered = await panel.locator('button.dpin').evaluateAll((bs) => bs.filter((b) => /^\d+$/.test(b.textContent.trim())).length);
ok(numbered === 9, `Çarşamba'da numaralı durak sayısı: ${numbered} (beklenen 9)`);
ok((await panel.innerText()).includes('9 durak, sıralı'), 'bilgi kutusu: 9 durak, sıralı');
ok((await panel.getByRole('button', { name: 'Çar', exact: true }).getAttribute('aria-pressed')) === 'true', 'Çar düğmesi aria-pressed=true');

await panel.locator('button.dpin', { hasText: /^1$/ }).first().click();
const info = await panel.innerText();
ok(/BAYİ \d+/.test(info) && info.includes('Çarşamba · 1. durak') && info.includes('Depo → buradan →'), 'pin tıklanınca bayi bilgisi: ' + (info.match(/BAYİ \d+/) || [''])[0]);

await panel.getByRole('button', { name: 'Tüm', exact: true }).click();
ok((await panel.locator('button.dpin').count()) === 57 && (await panel.innerText()).includes('HAZIR PLAN'), 'Tüm: seçim sıfırlandı');

await page.getByRole('tab', { name: 'Algoritma', exact: true }).click();
ok((await panel.locator('ol > li').count()) === 6, 'algoritma: 6 adım');

await page.getByRole('tab', { name: 'Gerçek uygulama', exact: true }).click();
await panel.getByRole('button', { name: /Bölgeyi çizerek seçme/ }).click();
await page.waitForTimeout(500);
const ct = await page.locator('video').evaluate((v) => v.currentTime);
ok(ct >= 3.5 && ct <= 6, `bölüme tıkla: video ${ct.toFixed(1)} sn'ye atladı`);
ok((await panel.innerText()).includes('0:04 · Bölgeyi çizerek seçme'), 'bölüm etiketi güncellendi');

// ---------- gezinti ----------
await page.getByRole('link', { name: /Sesli Müşteri\s+Asistanı/ }).click();
await page.waitForURL('**/projeler/sesli-asistan');
await page.waitForTimeout(500);
ok((await page.evaluate(() => window.scrollY)) === 0, 'sıradaki projeye geçince sayfa en üstte');
ok((await page.title()) === 'Sesli Müşteri Asistanı — Vaka çalışması', 'başlık güncellendi: ' + (await page.title()));

await page.getByRole('link', { name: 'Tüm işler' }).click();
await page.waitForURL(base + '/');
await page.waitForFunction(() => document.title === 'Enes Dou Aydın — Portfolyo', null, { timeout: 5000 }).catch(() => {});
ok((await page.title()) === 'Enes Dou Aydın — Portfolyo', 'ana sayfaya dönüldü, başlık: ' + (await page.title()));

await page.getByRole('link', { name: 'Yetkinlikler', exact: true }).click();
await page.waitForTimeout(600);
const topOfCaps = await page.evaluate(() => document.getElementById('yetkinlik').getBoundingClientRect().top);
ok(Math.abs(topOfCaps) < 120, `#yetkinlik bölümüne kaydırıldı (üst ${Math.round(topOfCaps)}px)`);

// ---------- ana sayfa liste satırları ----------
const rows = [
  ['Sesli Müşteri Hizmetleri Asistanı', '/projeler/sesli-asistan'],
  ['Belge Doldurma Otomasyonu', '/projeler/belge-doldurma'],
  ['KDV İade Otomasyonu', '/projeler/kdv-iade'],
  ['Merchandising Platformu', '/#iletisim'],
  ['Ortak Gider Takip', '/#iletisim'],
  ['Ev Fiyat Tahmini', '/projeler/ev-fiyat'],
];
for (const [title, dest] of rows) {
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.locator('a.row', { hasText: title }).click();
  await page.waitForTimeout(700);
  const u = new URL(page.url());
  const got = u.pathname + u.hash;
  const extra = dest === '/#iletisim' ? ' (üst ' + Math.round(await page.evaluate(() => document.getElementById('iletisim').getBoundingClientRect().top)) + 'px)' : '';
  ok(got === dest && (dest !== '/#iletisim' || Math.abs(await page.evaluate(() => document.getElementById('iletisim').getBoundingClientRect().top)) < 300), title + ' → ' + got + extra);
}

// doğrudan derin bağlantı (SPA yönlendirmesi)
await page.goto(base + '/projeler/kdv-iade', { waitUntil: 'networkidle' });
ok((await page.title()) === 'KDV İade Otomasyonu — Vaka çalışması', 'derin bağlantı çalışıyor');

console.log(problems.length ? 'KONSOL:\n  ' + [...new Set(problems)].join('\n  ') : 'konsol temiz');
console.log(fails ? `${fails} HATA` : 'tüm kontroller geçti');
await browser.close();
process.exit(fails ? 1 : 0);
