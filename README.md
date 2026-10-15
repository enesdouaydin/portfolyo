# Enes Dou Aydın — Portfolyo

`../portfolyo-tasarim/tasarim/*.dc.html` tasarımından üretilmiş Vite + React + TypeScript + three.js sitesi.
Node'u makineye kurmadan, Docker ile çalışır.

## Çalıştırma

```sh
# Geliştirme (HMR): http://localhost:5173
docker compose up dev

# Üretim imajı (nginx): http://localhost:8080
docker compose --profile prod up --build web
```

`dev` servisi ilk açılışta `npm install` çalıştırır; `node_modules` bir Docker volume'ünde durur.
Tek seferlik komutlar için: `docker compose run --rm --no-deps dev npm run typecheck` (ya da `build`).

## Yapı

| Yol | İçerik |
|---|---|
| `src/pages/home`, `bayi-rota`, `sesli-asistan`, `belge-doldurma`, `kdv-iade`, `ev-fiyat` | Sayfalar (rotalar: `src/routes.ts`) |
| `src/components` | Ortak parçalar: `SiteHeader`, `SiteFooter`, `HeroStage` (3D hero kabı), `PageShell`; `components/project/*` proje sayfalarının hero, künye, hikâye ve "Sıradaki" bileşenleri |
| `src/scenes` | three.js sahneleri. `runtime.ts` her sayfada ortak olan render/boyut/kaydırma döngüsünü yürütür; `*Scene.ts` yalnızca sahneyi kurar ve `update(p, t, dt, narrow)` döndürür |
| `src/scenes/hero` | Ana sayfa hero'su: `saber.ts` (ışın kılıcı), `rig.ts` (iskelet, kol/bacak IK'si, pelerin), `choreography.ts` (8 sn'lik kılıç çevirme döngüsü). Model: `public/media/enes.glb` (iskeletli, 7.7 MB) |
| `src/data` | Metin ve veri: ana sayfa listeleri, deneyim/yetkinlikler, proje sayfası içerikleri, Bayi Rota demo verisi (seed 11) |
| `public/media` | `rota_demo.mp4`, `rota_poster.jpg` |

three.js **r149'a sabitlenmiştir** (`three@0.149.0`): tasarımdaki sahneler bu sürümün renk yönetimine göre ayarlı.

## Tasarımla karşılaştırma

`.tools/` içinde Playwright (Docker) ile çalışan kontrol araçları var. Geliştirme sunucusu açıkken:

```sh
docker run --rm -v "$PWD/.tools:/work" -v portfolyo_tools_modules:/work/node_modules \
  -v "$PWD/../portfolyo-tasarim:/design:ro" -w /work mcr.microsoft.com/playwright:v1.63.0-noble sh verify-all.sh
```

Her sayfa için belge yüksekliğini, tasarımdaki metin parçalarının sayfada bulunmasını, konsol hatalarını ve
`ekran-goruntuleri/` ile piksel farkını yazar; görüntüler `.tools/out/shots/` altına düşer.
`check-flows.mjs` Bayi Rota etkileşimlerini ve sayfalar arası gezintiyi sınar.

## Tasarım dili (ana sayfa)

Renk ve yazı değişkenleri `src/styles/global.css` içinde (`--bg`, `--accent`, `--font-display` …); ana sayfanın tüm görünümü
`src/pages/home/home.css` içinde sınıflarla tanımlı, bileşenlerde satır içi stil yok. Her bölüm aynı iskeleti kullanır:
`SectionHead` (çizgili numara + başlık + açıklama). Kaydırınca beliren öğeler `.reveal` sınıfı alır (`useReveal`).
Yazı tipleri (Bricolage Grotesque, Geist, Geist Mono, Instrument Serif) `@fontsource` paketleriyle siteyle birlikte sunulur.

## Duyarlılık

Masaüstü (≥1025px) tasarımla birebir aynı kalır; dar ekran kuralları `src/styles/responsive.css` içindedir.

- Yan boşluk `--gutter` (32px, ≤600px'te 20px); bölüm dikey boşlukları `fluid()` ile (`src/styles/type.ts`) ≥1024px'te tasarım değerinde, daha dar ekranda orantılı küçülür.
- ≤1024px'te yapışkan hero sahnesi üst menünün altında durur (`--hdr`, `SiteHeader` ölçer) ve `svh` kullanır; böylece ilk açılışta alt satır ekran dışında kalmaz. Kaydırma ilerlemesi (`runtime.ts`) bu kaymayı hesaba katar.
- ≤760px'te proje hero'larında okunabilirlik için daha koyu degrade; ≤760px ve ≤760px yüksekliğinde (iPhone SE gibi) başlık/özet biraz sıkılaşır.

Kontrol (geliştirme sunucusu açıkken, yukarıdaki `docker run` ile):

```sh
node check-responsive.mjs 390,768 home,bayi   # yatay taşma + kaydırarak ekran şeritleri → out/resp/
node check-hero-fit.mjs                       # hero metni 360×640 … 1440×900 arası sahneye sığıyor mu
node check-brand.mjs                          # işveren adı geçmiyor mu (adlar .tools/banned-names.txt, repoya girmez)
```

## Yayın (GitHub Pages)

`main`'e her push'ta `.github/workflows/deploy.yml` siteyi derleyip GitHub Pages'e yayınlar. Bir kez yapılacak ayar:
depoda **Settings → Pages → Build and deployment → Source: GitHub Actions**.

- Depo `<kullanıcı>.github.io` adındaysa site kökten, başka bir adsa alt yoldan (`https://<kullanıcı>.github.io/<depo>/`) sunulur.
  Alt yol, derlemeye `VITE_BASE` ile verilir (`vite.config.ts`); verilmezse site kökten çalışır (geliştirme, Docker/nginx).
- GitHub Pages sunucu tarafı yönlendirme yapamaz: iş akışı `index.html`'i `404.html` olarak da kopyalar; yenileme ve doğrudan
  bağlantı (`…/projeler/bayi-rota`) böylece çalışır. Tanımsız adresler ana sayfaya yönlenir.
- Yerel deneme: `node check-ghpages.mjs` (alt yolla derlenmiş siteyi GitHub Pages gibi sunan bir nginx'e karşı çalışır).
