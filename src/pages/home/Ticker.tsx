import { TICKER } from '../../data/home';

/** Hero'nun altında sarı, sürekli kayan teknoloji şeridi. Liste iki kez yazılır ki döngü dikişsiz olsun. */
export function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="ticker" aria-label={`Kullandığım teknolojiler: ${TICKER.join(', ')}`}>
      <div className="ticker-track" aria-hidden="true">
        {items.map((t, i) => (
          <span key={i} className="ticker-item">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
