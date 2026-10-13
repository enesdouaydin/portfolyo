// Tek bir bölümün (aria-label ile) farklı genişliklerdeki ekran görüntüsü.
// Kullanım: node shot-section.mjs <rota> "<aria-label>" <genişlik,genişlik,...> <çıktı-öneki>
import { chromium } from 'playwright';
const [route, label, widths, prefix] = process.argv.slice(2);
const base = process.env.BASE_URL || 'http://host.docker.internal:5173';
const out = process.env.OUT_DIR || '/work/out/resp';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars'] });
for (const w of widths.split(',').map(Number)) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const el = page.locator(`section[aria-label="${label}"]`);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await el.screenshot({ path: `${out}/${prefix}-${w}.png` });
  const ov = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`@${w}: yatay taşma ${ov ? 'VAR' : 'yok'}`);
  await page.close();
}
await browser.close();
