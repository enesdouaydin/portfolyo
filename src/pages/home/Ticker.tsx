import { TICKER } from '../../data/home';

/** Kırmızı şeritte akan sözler (hero başlığından ve işlerden). */
const SLOGANS = [
  'Konuşan ajanlar',
  'Kısalan rotalar',
  'Çalışan sistemler',
  'Sahada her gün',
  'Uçtan uca ürün',
  'Veriden modele',
  'Modelden sahaya',
];

function Row({
  items,
  variant,
  lang,
}: {
  items: readonly string[];
  variant: 'accent' | 'saber';
  lang?: string;
}) {
  // liste iki kez yazılır ki döngü dikişsiz olsun
  const loop = [...items, ...items];
  return (
    <div className={`ticker ticker--${variant}`} lang={lang}>
      <div className="ticker-track" aria-hidden="true">
        {loop.map((t, i) => (
          <span key={i} className="ticker-item">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Hero'nun altında çapraz kesişen iki şerit: sarıda teknolojiler, kırmızıda sözler; ters yönlere akarlar. */
export function Ticker() {
  return (
    <div className="tickers" role="img" aria-label={`Kullandığım teknolojiler: ${TICKER.join(', ')}`}>
      <Row items={SLOGANS} variant="saber" />
      <Row items={TICKER} variant="accent" lang="en" />
    </div>
  );
}
