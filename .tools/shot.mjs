// Ekran görüntüsü + metin doğrulaması.
// Kullanım: node shot.mjs <rota> <ad> [--design <dosya.dc.html>] [--scrolls 0,0.14,0.5]
//   <ad>-hero.png, <ad>-tam-sayfa.png (1440 genişlik), isteğe bağlı <ad>-hero-p<N>.png üretir,
//   konsol hatalarını yazar ve tasarım şablonundaki her metin parçasının canlı sayfada bulunduğunu doğrular.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const [route, name] = argv;
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const designFile = opt('--design');
const scrolls = opt('--scrolls', '').split(',').filter(Boolean).map(Number);
// Metin doğrulaması için sırayla tıklanacak düğmeler (sekme adı vb.); her durumun metni birleştirilir.
const clicks = opt('--clicks', '').split(',').filter(Boolean);
const base = process.env.BASE_URL || 'http://host.docker.internal:5173';
const out = process.env.OUT_DIR || '/work/out/shots';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  args: [
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--enable-webgl',
    '--hide-scrollbars',
    // Tasarım ekran görüntüleri gri tonlamalı, ipucusuz (macOS benzeri) metin çizimiyle alınmış.
    '--disable-lcd-text',
    '--font-render-hinting=none',
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const problems = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) => {
  // Video önyüklemesi sayfa kapanırken iptal edilir; bu hata değildir.
  if (!/\.mp4$/.test(r.url())) problems.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`);
});

await page.goto(base + route, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(3000);
const bodies = [];
const grab = async () => bodies.push(await page.evaluate(() => document.body.innerText));
await grab();

await page.screenshot({ path: `${out}/${name}-hero.png` });
const heroSpan = await page.evaluate(() => {
  const s = document.querySelector('section');
  return { scrollHeight: document.documentElement.scrollHeight };
});
for (const p of scrolls) {
  const span = await page.evaluate(() => {
    const sec = document.querySelector('main section, section[id="top"], section');
    return sec ? sec.getBoundingClientRect().height - Math.min(window.innerHeight, 920) : 0;
  });
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(p * span));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/${name}-hero-p${String(p).replace('.', '_')}.png` });
  await grab();
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/${name}-tam-sayfa.png`, fullPage: true });
console.log(`${name}: belge yüksekliği ${heroSpan.scrollHeight}px`);
for (const label of clicks) {
  await page.getByRole('tab', { name: label, exact: true }).click().catch(() => page.getByRole('button', { name: label, exact: true }).click());
  await page.waitForTimeout(800);
  await grab();
}

// ---- metin doğrulaması ----
if (designFile) {
  const src = fs.readFileSync(designFile, 'utf8');
  let tpl = src.slice(src.indexOf('<x-dc>') + 6, src.lastIndexOf('</x-dc>'));
  tpl = tpl.replace(/<helmet>[\s\S]*?<\/helmet>/, '').replace(/<!--[\s\S]*?-->/g, '');
  const dec = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const chunks = new Set();
  for (const raw of tpl.split(/<[^>]*>/)) {
    for (const part of raw.split(/\{\{[^}]*\}\}/)) {
      const t = norm(dec(part));
      if (t && !/^[\s·,.:;|/→—-]*$/.test(t)) chunks.add(t);
    }
  }
  // aria-label ve alt gibi metin öznitelikleri
  const attrs = new Set([...tpl.matchAll(/(?:aria-label|alt|title|placeholder)="([^"{]+)"/g)].map((m) => norm(dec(m[1]))));
  const body = norm(bodies.join(' \n '));
  const html = await page.content();
  const missing = [...chunks].filter((c) => !body.includes(c));
  const missingAttrs = [...attrs].filter((a) => !html.includes(a.replace(/&/g, '&amp;')) && !html.includes(a));
  console.log(`metin parçası: ${chunks.size} (eksik ${missing.length}), öznitelik: ${attrs.size} (eksik ${missingAttrs.length})`);
  missing.slice(0, 40).forEach((c) => console.log('  EKSİK METİN:', JSON.stringify(c)));
  missingAttrs.slice(0, 20).forEach((c) => console.log('  EKSİK ÖZNİTELİK:', JSON.stringify(c)));
}
if (problems.length) {
  console.log('KONSOL:');
  [...new Set(problems)].slice(0, 25).forEach((p) => console.log('  ' + p));
} else console.log('konsol temiz');
await browser.close();
