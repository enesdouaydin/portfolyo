// Siyah ekran hatasına karşı dayanıklılık testi (dokunmatik telefon taklidi, geliştirme sunucusu):
//  1) normal açılış tekrar tekrar: sayfa hatası olmamalı
//  2) ilk karede zaman damgası geriden gelirse (negatif dt): eskiden çöküyordu, artık çökmemeli
//  3) hero verisi bozulursa: yalnızca hero düşer, sayfanın geri kalanı açık kalır (siyah ekran yok)
//  4) bütün sayfa çökerse: siyah ekran yerine hata paneli + "Tekrar dene"
// Kullanım: node check-resilience.mjs   (BASE_URL ile adres verilebilir; geliştirme sunucusu gerekir: kaynak dosyaları keser)
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://host.docker.internal:5173';
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const phone = { viewport: { width: 360, height: 780 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
let fails = 0;
const ok = (c, msg) => {
  console.log((c ? 'OK    ' : 'HATA  ') + msg);
  if (!c) fails++;
};

async function open({ init, route } = {}, wait = 4500) {
  const ctx = await browser.newContext(phone);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  if (init) await page.addInitScript(init);
  if (route) await route(page);
  await page.goto(base + '/', { waitUntil: 'commit' });
  await page.waitForTimeout(wait);
  const s = await page.evaluate(() => ({
    header: !!document.querySelector('.site-header'),
    sections: !!document.querySelector('#isler'),
    h1: !!document.querySelector('.hero-h1'),
    crash: document.querySelector('.crash')?.innerText?.slice(0, 120) || '',
    pair: document.querySelector('.hero-pair-count')?.textContent || '',
  }));
  return { ctx, page, errs, s };
}

// 1) normal açılış ×4
let bad = 0;
for (let i = 0; i < 4; i++) {
  const r = await open();
  if (r.errs.length || !r.s.header || !r.s.h1) bad++;
  await r.ctx.close();
}
ok(bad === 0, `normal açılış ×4: hepsi hatasız ve içerik görünür (${bad} bozuk)`);

// 2) negatif dt: performance.now() hep 80 ms ileride → ilk karedeki fark negatif
for (let i = 0; i < 2; i++) {
  const r = await open({ init: () => { const n = performance.now.bind(performance); performance.now = () => n() + 80; } });
  ok(r.errs.length === 0 && r.s.header && r.s.h1, `bozuk zamanlamada (negatif dt) sayfa çökmüyor [${r.s.pair.trim() || 'sayaç yok'}]${r.errs.length ? ' → ' + r.errs[0] : ''}`);
  await r.ctx.close();
}

// 3) hero verisi bozuk (PAIRS boş): hero düşebilir ama sayfa açık kalmalı
{
  const r = await open({
    route: async (page) => {
      await page.route('**/src/data/home.ts*', async (route) => {
        const res = await route.fetch();
        const body = (await res.text()).replace(/export const PAIRS[\s\S]*?\n\];/, 'export const PAIRS = [];');
        await route.fulfill({ response: res, body });
      });
    },
  });
  ok(r.s.header && r.s.sections && !r.s.crash, `hero verisi bozukken sayfa açık kalıyor (menü:${r.s.header}, bölümler:${r.s.sections}, hata paneli:${!!r.s.crash})`);
  await r.page.screenshot({ path: '/work/out/shots/resilience-hero.png' });
  await r.ctx.close();
}

// 4) bütün sayfa çökerse (SITE bozuk → menü çizilemez): siyah ekran yerine hata paneli
{
  const r = await open({
    route: async (page) => {
      await page.route('**/src/data/site.ts*', async (route) => {
        const res = await route.fetch();
        await route.fulfill({ response: res, body: (await res.text()).replace(/export const SITE[\s\S]*$/, 'export const SITE = undefined;') });
      });
    },
  });
  ok(r.s.crash.includes('Sayfa yüklenirken bir hata oluştu'), `sayfa tamamen çökünce siyah ekran yerine hata paneli: "${r.s.crash.split('\n')[0]}"`);
  await r.page.screenshot({ path: '/work/out/shots/resilience-crash.png' });
  await r.ctx.close();
}

console.log(fails ? `${fails} HATA` : 'tüm kontroller geçti');
await browser.close();
process.exit(fails ? 1 : 0);
