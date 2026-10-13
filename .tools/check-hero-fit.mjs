// Hero metin katmanı, sahne alanına (yapışkan kutu) sığıyor mu? Farklı telefon/tablet boyutlarında ve kaydırma aşamalarında ölçer.
import { chromium } from 'playwright';
const base = process.env.BASE_URL || 'http://host.docker.internal:5173';
const ROUTES = { home: '/', bayi: '/projeler/bayi-rota', sesli: '/projeler/sesli-asistan', belge: '/projeler/belge-doldurma', kdv: '/projeler/kdv-iade', ev: '/projeler/ev-fiyat' };
const SIZES = [[360, 640], [375, 667], [390, 844], [412, 915], [600, 900], [768, 1024], [1024, 768], [1440, 900]];
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars'] });
let bad = 0;
for (const [w, h] of SIZES) {
  for (const [name, route] of Object.entries(ROUTES)) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const worst = { over: 0, at: 0 };
    for (const f of [0, 0.2, 0.4, 0.6, 0.8, 1]) {
      await page.evaluate((frac) => {
        const sec = document.querySelector('.hero-stage');
        const span = sec.offsetHeight - sec.querySelector('.hero-sticky').offsetHeight;
        const stuck = parseFloat(getComputedStyle(sec.querySelector('.hero-sticky')).top) || 0;
        window.scrollTo(0, sec.offsetTop - stuck + span * frac);
      }, f);
      await page.waitForTimeout(450);
      const r = await page.evaluate(() => {
        const st = document.querySelector('.hero-sticky').getBoundingClientRect();
        const ov = document.querySelector('.hero-overlay');
        let bottom = 0, top = 1e9;
        for (const el of ov.querySelectorAll('*')) {
          const b = el.getBoundingClientRect();
          if (!b.width || !b.height) continue;
          bottom = Math.max(bottom, b.bottom); top = Math.min(top, b.top);
        }
        const hdr = document.querySelector('header').getBoundingClientRect().bottom;
        return { over: Math.round(bottom - st.bottom), under: Math.round(hdr - top), vis: Math.round(Math.min(st.bottom, innerHeight) - Math.max(st.top, 0)), stageH: Math.round(st.height) };
      });
      if (r.over > worst.over) { worst.over = r.over; worst.at = f; }
      if (r.under > 0 && w <= 1024) { worst.under = Math.max(worst.under || 0, r.under); }
    }
    const flag = worst.over > 0 || worst.under > 0;
    if (flag) bad++;
    console.log(`${flag ? 'TAŞAR ' : 'sığar '} ${name} @${w}x${h}${flag ? `  alttan +${worst.over}px (aşama ${worst.at})${worst.under ? `, menünün altında ${worst.under}px` : ''}` : ''}`);
    await page.close();
  }
}
await browser.close();
console.log(bad ? `${bad} durumda taşma var` : 'hepsi sığıyor');
