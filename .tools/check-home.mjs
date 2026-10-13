// Ana sayfa etkileşim ve mobil kontrolü.
import fs from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://host.docker.internal:5173';
const out = '/work/out/shots';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars', '--disable-lcd-text', '--font-render-hinting=none'],
});
const problems = [];
const watch = (page) => {
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`[${m.type()}] ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));
};

// ---- filtreler ----
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
watch(page);
await page.goto(base + '/', { waitUntil: 'networkidle' });
const expected = { 'Hepsi': '07', 'AI & Agent': '03', 'Optimizasyon': '01', 'Backend': '03', 'Mobil': '03', 'ML & Veri': '01' };
for (const [label, count] of Object.entries(expected)) {
  await page.getByRole('button', { name: label, exact: true }).click();
  const h2 = await page.locator('#isler h2').innerText();
  const rows = await page.locator('#isler ul > li').count();
  const featured = await page.locator('#isler a.feat').count();
  const pressed = await page.getByRole('button', { name: label, exact: true }).getAttribute('aria-pressed');
  console.log(`${label.padEnd(13)} sayaç=${h2.replace(/\s+/g, ' ').trim().split(' ').pop()} (beklenen ${count})  satır=${rows} öne çıkan=${featured} aria-pressed=${pressed}`);
}

// ---- bağlantılar ----
await page.getByRole('button', { name: 'Hepsi', exact: true }).click();
const hrefs = await page.$$eval('#isler a', (as) => as.map((a) => a.getAttribute('href')));
console.log('iş bağlantıları:', hrefs.join(' '));
const anchors = await page.$$eval('header a, #iletisim a', (as) => as.map((a) => a.getAttribute('href')));
console.log('menü/iletişim bağlantıları:', anchors.join(' '));

// ---- mobil ----
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
watch(m);
await m.goto(base + '/', { waitUntil: 'networkidle' });
await m.evaluate(() => document.fonts.ready);
await m.waitForTimeout(2500);
await m.screenshot({ path: `${out}/home-mobil-hero.png` });
const overflow = await m.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
console.log(`mobil yatay taşma: scrollWidth=${overflow.sw} clientWidth=${overflow.cw}`);
await m.screenshot({ path: `${out}/home-mobil-tam.png`, fullPage: true });
console.log(problems.length ? 'KONSOL:\n  ' + [...new Set(problems)].join('\n  ') : 'konsol temiz');
await browser.close();
