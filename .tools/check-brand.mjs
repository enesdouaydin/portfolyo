// Yayınlanan sayfalarda işveren adı geçmediğini doğrular (README kuralı).
// Yasaklı adlar `.tools/banned-names.txt` dosyasından okunur (satır başına bir ad); dosya repoya girmez.
import fs from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://host.docker.internal:5173';
const routes = [
  '/',
  '/projeler/bayi-rota',
  '/projeler/sesli-asistan',
  '/projeler/belge-doldurma',
  '/projeler/kdv-iade',
  '/projeler/ev-fiyat',
];
const names = fs.existsSync('banned-names.txt')
  ? fs
      .readFileSync('banned-names.txt', 'utf8')
      .split('\n')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  : [];
if (!names.length) {
  console.error('banned-names.txt yok ya da boş: satır başına bir ad yazın.');
  process.exit(2);
}

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
let fails = 0;
for (const r of routes) {
  await page.goto(base + r, { waitUntil: 'networkidle' });
  const html = (await page.content()).toLowerCase();
  const hit = names.find((n) => html.includes(n));
  console.log((hit ? 'HATA  ' : 'OK    ') + r + (hit ? ' → ' + hit : ''));
  if (hit) fails++;
}
await browser.close();
process.exit(fails ? 1 : 0);
