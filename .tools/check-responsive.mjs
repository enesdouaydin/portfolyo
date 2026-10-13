// Duyarlılık denetimi: her sayfayı dar/orta genişliklerde açar, yatay taşmayı ve görünümden taşan öğeleri bulur,
// tam sayfa görüntüyü yan yana dizilmiş şeritlere (contact sheet) böler.
// Kullanım: node check-responsive.mjs [genişlik,genişlik,...] [rota,rota,...]
import fs from 'node:fs';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const widths = (process.argv[2] || '360,390,768,1024').split(',').map(Number);
const ROUTES = {
  home: '/',
  bayi: '/projeler/bayi-rota',
  sesli: '/projeler/sesli-asistan',
  belge: '/projeler/belge-doldurma',
  kdv: '/projeler/kdv-iade',
  ev: '/projeler/ev-fiyat',
};
const names = (process.argv[3] || Object.keys(ROUTES).join(',')).split(',');
const base = process.env.BASE_URL || 'http://host.docker.internal:5173';
const out = process.env.OUT_DIR || '/work/out/resp';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars', '--disable-lcd-text', '--font-render-hinting=none'],
});

function sheet(png, file, tileH, cols) {
  const tiles = Math.ceil(png.height / tileH);
  const rows = Math.ceil(tiles / cols);
  const gap = 12;
  const W = cols * png.width + (cols - 1) * gap;
  const H = rows * tileH + (rows - 1) * gap;
  const o = new PNG({ width: W, height: H });
  o.data.fill(70);
  for (let t = 0; t < tiles; t++) {
    const ox = (t % cols) * (png.width + gap);
    const oy = Math.floor(t / cols) * (tileH + gap);
    for (let y = 0; y < tileH; y++) {
      const sy = t * tileH + y;
      if (sy >= png.height) break;
      png.data.copy(o.data, ((oy + y) * W + ox) * 4, sy * png.width * 4, (sy + 1) * png.width * 4);
    }
  }
  fs.writeFileSync(file, PNG.sync.write(o));
}

let bad = 0;
for (const name of names) {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: w < 600 ? 800 : 900 } });
    const problems = [];
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(m.text()); });
    page.on('pageerror', (e) => problems.push(e.message));
    await page.goto(base + ROUTES[name], { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = [];
      for (const el of document.body.querySelectorAll('*')) {
        const b = el.getBoundingClientRect();
        if (!b.width || !b.height) continue;
        // kendi kaydırma kutusu içindeki öğeleri atla
        let p = el.parentElement, scroller = false;
        while (p && p !== document.body) {
          const cs = getComputedStyle(p);
          if (/(auto|scroll|hidden|clip)/.test(cs.overflowX) && p.getBoundingClientRect().right <= vw + 1) { scroller = true; break; }
          p = p.parentElement;
        }
        if (scroller) continue;
        if (b.right > vw + 1 || b.left < -1) {
          const tag = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '');
          over.push(`${tag} [${Math.round(b.left)}..${Math.round(b.right)}] "${(el.innerText || '').trim().slice(0, 40).replace(/\n/g, ' ')}"`);
        }
      }
      return { vw, sw: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, over: over.slice(0, 12), n: over.length };
    });
    const flag = r.sw > r.vw;
    if (flag || r.n) bad++;
    console.log(`${flag ? 'TAŞMA ' : 'tamam '} ${name} @${w}: scrollWidth ${r.sw}/${r.vw}, yükseklik ${r.h}, taşan öğe ${r.n}`);
    for (const o of r.over) console.log('        ' + o);
    if (problems.length) console.log('        konsol: ' + [...new Set(problems)].join(' | '));
    // Kaydırmalı sticky hero tam sayfa görüntüde bozuk çıkar; sayfayı gerçekten kaydırıp ekran ekran al.
    const vh = page.viewportSize().height;
    const step = Math.round(vh * 0.92);
    const shots = [];
    for (let y = 0; y < r.h - vh + step; y += step) {
      await page.evaluate((yy) => window.scrollTo(0, yy), Math.min(y, r.h - vh));
      await page.waitForTimeout(w < 600 ? 700 : 500);
      shots.push(PNG.sync.read(await page.screenshot()));
    }
    const cols = w < 600 ? 6 : 4;
    const gap = 12;
    const rows = Math.ceil(shots.length / cols);
    const o = new PNG({ width: cols * w + (cols - 1) * gap, height: rows * vh + (rows - 1) * gap });
    o.data.fill(70);
    shots.forEach((s, i) => {
      const ox = (i % cols) * (w + gap);
      const oy = Math.floor(i / cols) * (vh + gap);
      for (let yy = 0; yy < vh; yy++) s.data.copy(o.data, ((oy + yy) * o.width + ox) * 4, yy * w * 4, (yy + 1) * w * 4);
    });
    fs.writeFileSync(`${out}/${name}-${w}-sheet.png`, PNG.sync.write(o));
    await page.close();
  }
}
await browser.close();
console.log(bad ? `${bad} sayfa/genişlikte sorun var` : 'taşma yok');
