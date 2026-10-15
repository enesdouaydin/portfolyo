import { DAY_COLORS, DAY_NAMES, DAY_SHORT, DEMO, ROUTE_LINES, type DemoPoint } from '../../data/dealerDemo';
import { MONO } from '../../styles/type';

interface Props {
  /** Seçili gün (0–5); -1 = tüm günler. */
  day: number;
  /** Seçili bayinin `DEMO.pts` indeksi; -1 = seçim yok. */
  sel: number;
  onPickDay: (day: number) => void;
  onPickPin: (index: number) => void;
}

const pct = (p: DemoPoint) => ({ x: ((p.x / 160) * 100).toFixed(2) + '%', y: p.y.toFixed(2) + '%' });
const pinLabel = (p: DemoPoint) => `Bayi ${p.id}, ${DAY_NAMES[p.day]}, ${p.seq}. durak`;
const smallLabel = { fontFamily: MONO, fontSize: '11px', color: '#8A8A8A' } as const;

/** Haritanın sabit zemini: nehir, ana yollar, semt adları. */
function MapBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 100"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: '0' }}
    >
      <defs>
        <pattern id="dg" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M5 0H0V5" fill="none" stroke="#181818" strokeWidth=".15" />
        </pattern>
      </defs>
      <rect width="160" height="100" fill="url(#dg)" />
      <path
        d="M-5 58 C 25 50, 45 66, 70 60 S 115 40, 165 48"
        fill="none"
        stroke="#1C2A33"
        strokeWidth="2.2"
      />
      <g fill="none" stroke="#262626" strokeLinecap="round">
        <path d="M0 30 L 160 36" strokeWidth=".9" />
        <path d="M10 100 L 70 0" strokeWidth=".9" />
        <path d="M150 100 L 95 0" strokeWidth=".9" />
        <path d="M0 82 C 50 74, 110 92, 160 78" strokeWidth=".7" />
        <path d="M30 0 L 40 100" strokeWidth=".45" />
        <path d="M60 0 L 58 100" strokeWidth=".45" />
        <path d="M120 0 L 128 100" strokeWidth=".45" />
        <path d="M0 14 L 160 18" strokeWidth=".45" />
        <path d="M0 66 L 160 64" strokeWidth=".45" />
      </g>
      <g
        fontFamily="Geist Variable, Geist, sans-serif"
        fontSize="3.2"
        fill="#3C3C3C"
        fontWeight="600"
        letterSpacing=".2"
      >
        <text x="18" y="12">
          KEÇİÖREN
        </text>
        <text x="74" y="9">
          ALTINDAĞ
        </text>
        <text x="128" y="20">
          MAMAK
        </text>
        <text x="8" y="50">
          YENİMAHALLE
        </text>
        <text x="70" y="95">
          ÇANKAYA
        </text>
        <text x="128" y="94">
          GÖLBAŞI
        </text>
      </g>
    </svg>
  );
}

export function DemoPanel({ day, sel, onPickDay, onPickPin }: Props) {
  const DM = DEMO;

  let info: { kick: string; title: string; text: string; c: string; bd: string };
  if (sel >= 0) {
    const sp = DM.pts[sel];
    const ord = DM.days[sp.day];
    const ix = sp.seq - 1;
    const prev = ix > 0 ? 'Bayi ' + DM.pts[ord[ix - 1]].id : 'Depo';
    const next = ix < ord.length - 1 ? 'Bayi ' + DM.pts[ord[ix + 1]].id : 'gün sonu';
    info = {
      kick: 'BAYİ ' + sp.id,
      title: DAY_NAMES[sp.day] + ' · ' + sp.seq + '. durak',
      text: prev + ' → buradan → ' + next + '. Bu günün ' + ord.length + ' durağından biri.',
      c: DAY_COLORS[sp.day],
      bd: DAY_COLORS[sp.day],
    };
  } else if (day >= 0) {
    info = {
      kick: DAY_NAMES[day].toUpperCase() + ' ROTASI',
      title: DM.days[day].length + ' durak, sıralı',
      text: 'Numaralar ziyaret sırası. Bir bayiye tıkla, öncesi ve sonrası görünsün.',
      c: '#F2F0EA',
      bd: '#2E2E2E',
    };
  } else {
    info = {
      kick: 'HAZIR PLAN',
      title: DM.pts.length + ' bayi, 6 güne dağıtıldı',
      text: 'Bir gün seç ya da haritada bir bayiye tıkla: hangi gün, kaçıncı sırada gidileceği anında görünür.',
      c: '#F2F0EA',
      bd: '#2E2E2E',
    };
  }

  const dayChips = [{ label: 'Tüm', v: -1 }, ...DAY_SHORT.map((l, i) => ({ label: l, v: i }))];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div
        style={{
          flex: '999 1 640px',
          minWidth: '0',
          position: 'relative',
          aspectRatio: '16/10',
          background: '#121212',
          overflow: 'hidden',
        }}
      >
        <MapBackdrop />
        {/* Gün değişince blok yeniden bağlanır; böylece rota çizimi ve pin animasyonları baştan oynar. */}
        {day === -1 ? (
          <>
            <svg
              aria-hidden="true"
              viewBox="0 0 160 100"
              width="100%"
              height="100%"
              style={{ position: 'absolute', inset: '0' }}
            >
              {ROUTE_LINES.map((r) => (
                <polyline
                  key={r.color}
                  points={r.points}
                  fill="none"
                  stroke={r.color}
                  strokeWidth=".45"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity=".7"
                />
              ))}
            </svg>
            {DM.pts.map((p, k) => {
              const q = pct(p);
              return (
                <button
                  key={k}
                  type="button"
                  className="dpin"
                  onClick={() => onPickPin(k)}
                  aria-label={pinLabel(p)}
                  style={{
                    position: 'absolute',
                    left: q.x,
                    top: q.y,
                    width: '12px',
                    height: '12px',
                    margin: '-6px 0 0 -6px',
                    borderRadius: '99px',
                    border: '2px solid #121212',
                    background: DAY_COLORS[p.day],
                    padding: '0',
                    cursor: 'pointer',
                    animationDelay: k * 8 + 'ms',
                  }}
                />
              );
            })}
          </>
        ) : (
          <DayLayer key={day} d={day} sel={sel} onPickPin={onPickPin} />
        )}
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '52%',
            width: '16px',
            height: '16px',
            margin: '-8px 0 0 -8px',
            borderRadius: '3px',
            background: '#F0B54A',
            boxShadow: '0 0 0 3px #121212,0 0 0 5px #F0B54A',
          }}
        />
        <span style={{ position: 'absolute', left: '12px', bottom: '10px', ...smallLabel }}>
          örnek veri · konumlar gerçek değildir
        </span>
      </div>
      <div
        style={{
          flex: '1 1 340px',
          minWidth: '0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          borderLeft: '1px solid #1F1F1F',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ ...smallLabel, letterSpacing: '.06em' }}>PLASİYER · GK6</span>
          <span style={smallLabel}>{DM.pts.length} bayi · 6 gün</span>
        </div>
        <div role="group" aria-label="Gün seç" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {dayChips.map((c) => {
            const on = day === c.v;
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => onPickDay(c.v)}
                aria-pressed={on}
                style={{
                  minHeight: '38px',
                  minWidth: '44px',
                  padding: '0 10px',
                  borderRadius: '10px',
                  border: `1px solid ${on ? '#F0B54A' : '#2E2E2E'}`,
                  background: on ? '#F0B54A' : 'transparent',
                  color: on ? '#0C0A09' : '#D4D4D4',
                  fontFamily: "'Geist Variable','Geist',sans-serif",
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <ol
          style={{
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {DM.days.map((o, i) => {
            const on = day === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onPickDay(i)}
                  style={{
                    width: '100%',
                    minHeight: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: `1px solid ${on ? DAY_COLORS[i] : '#232323'}`,
                    background: on ? '#1C1C1C' : 'transparent',
                    color: '#F2F0EA',
                    fontFamily: "'Geist Variable','Geist',sans-serif",
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '99px',
                      background: DAY_COLORS[i],
                      flex: '0 0 10px',
                    }}
                  />
                  <span style={{ flex: '1' }}>{DAY_NAMES[i]}</span>
                  <span style={{ fontFamily: MONO, fontSize: '12px', color: '#A3A3A3' }}>
                    {o.length} durak
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div
          style={{
            marginTop: 'auto',
            border: `1px solid ${info.bd}`,
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            background: '#141414',
            minHeight: '112px',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ ...smallLabel, letterSpacing: '.06em' }}>{info.kick}</span>
          <span style={{ fontSize: '22px', letterSpacing: '-0.02em', fontWeight: '500', color: info.c }}>
            {info.title}
          </span>
          <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#A3A3A3' }}>{info.text}</span>
        </div>
      </div>
    </div>
  );
}

/** Tek günün rotası: diğer günler soluk, seçili gün kalın çizilir; seçili günün durakları numaralıdır. */
function DayLayer({ d, sel, onPickPin }: { d: number; sel: number; onPickPin: (index: number) => void }) {
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 160 100"
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: '0' }}
      >
        {ROUTE_LINES.map((r) => (
          <polyline
            key={r.color}
            points={r.points}
            fill="none"
            stroke="#3A3A3A"
            strokeWidth=".35"
            strokeLinejoin="round"
            opacity=".55"
          />
        ))}
        <polyline
          className="rdraw"
          points={ROUTE_LINES[d].points}
          pathLength="1"
          fill="none"
          stroke={DAY_COLORS[d]}
          strokeWidth=".9"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      {DEMO.pts.map((p, k) => {
        const q = pct(p);
        const own = p.day === d;
        return (
          <button
            key={k}
            type="button"
            className="dpin"
            onClick={() => onPickPin(k)}
            aria-label={pinLabel(p)}
            style={{
              position: 'absolute',
              left: q.x,
              top: q.y,
              width: own ? '22px' : '8px',
              height: own ? '22px' : '8px',
              margin: own ? '-11px 0 0 -11px' : '-4px 0 0 -4px',
              borderRadius: '99px',
              border: `2px solid ${k === sel ? '#FFFFFF' : '#121212'}`,
              background: own ? DAY_COLORS[d] : '#3A3A3A',
              color: '#0C0A09',
              padding: '0',
              cursor: 'pointer',
              fontFamily: MONO,
              fontSize: '10px',
              fontWeight: '600',
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: own ? 1 : 0.6,
              animationDelay: own ? p.seq * 70 + 'ms' : '0ms',
            }}
          >
            {own ? String(p.seq) : ''}
          </button>
        );
      })}
    </>
  );
}
