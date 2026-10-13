import { Link } from 'react-router-dom';
import { ACCENT } from '../../theme';
import { DEMO_ROUTES, DEPOT } from '../../data/routeDemo';
import { ROUTES } from '../../routes';

/** Seçili işler listesinin üstündeki büyük Bayi Rota kartı. */
export function FeaturedProject() {
  return (
    <Link
      className="feat"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        textDecoration: 'none',
        color: '#EDEBE6',
        background: '#111113',
        border: '1px solid #232327',
        borderRadius: '24px',
        overflow: 'hidden',
      }}
      to={ROUTES.bayiRota}
    >
      <div
        style={{
          flex: '1 1 420px',
          minWidth: '0',
          padding: '44px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            fontFamily: "'Geist Mono',ui-monospace,monospace",
            fontSize: '12px',
            color: '#A8A59D',
            letterSpacing: '.02em',
          }}
        >
          <span>01 — Optimizasyon · Full-stack</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#EDEBE6' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '99px',
                background: ACCENT,
                display: 'inline-block',
              }}
            />
            Sahada kullanımda
          </span>
        </div>
        <h3
          style={{
            margin: '0',
            fontWeight: '500',
            fontSize: 'clamp(40px,4.4vw,68px)',
            letterSpacing: '-0.045em',
            lineHeight: '.98',
          }}
        >
          Bayi Rota{' '}
          <span
            style={{
              fontFamily: "'Instrument Serif',Georgia,serif",
              fontStyle: 'italic',
              fontWeight: '400',
              letterSpacing: '-0.015em',
            }}
          >
            Optimizasyonu
          </span>
        </h3>
        <p
          style={{
            margin: '0',
            fontSize: '18px',
            lineHeight: '1.55',
            color: '#A8A59D',
            maxWidth: '520px',
            textWrap: 'pretty',
          }}
        >
          Saha satış temsilcilerinin bayilerini bölgelere kümeleyip rotalayan sistem. Kâğıt üzerinde bir hafta
          süren planlama artık 10 saniye, rotalar ortalama yarı yarıya kısa.
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: "'Geist Mono',ui-monospace,monospace",
              fontSize: '12px',
              color: '#C9C6BE',
              border: '1px solid #2A2A2E',
              borderRadius: '999px',
              padding: '6px 12px',
            }}
          >
            Python · FastAPI
          </span>
          <span
            style={{
              fontFamily: "'Geist Mono',ui-monospace,monospace",
              fontSize: '12px',
              color: '#C9C6BE',
              border: '1px solid #2A2A2E',
              borderRadius: '999px',
              padding: '6px 12px',
            }}
          >
            PostgreSQL
          </span>
          <span
            style={{
              fontFamily: "'Geist Mono',ui-monospace,monospace",
              fontSize: '12px',
              color: '#C9C6BE',
              border: '1px solid #2A2A2E',
              borderRadius: '999px',
              padding: '6px 12px',
            }}
          >
            RabbitMQ · Redis
          </span>
          <span
            style={{
              fontFamily: "'Geist Mono',ui-monospace,monospace",
              fontSize: '12px',
              color: '#C9C6BE',
              border: '1px solid #2A2A2E',
              borderRadius: '999px',
              padding: '6px 12px',
            }}
          >
            k-means · 2-opt
          </span>
        </div>
        <span
          style={{
            marginTop: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '500',
            fontSize: '16px',
          }}
        >
          Vaka çalışması ve canlı demo
          <svg
            className="fa"
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      <div
        style={{
          flex: '1.3 1 460px',
          minWidth: '0',
          minHeight: '460px',
          position: 'relative',
          background: '#0E0E10',
          borderLeft: '1px solid #1F1F1F',
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 160 100"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
        >
          <rect width="160" height="100" fill="#121212" />
          <path
            d="M-5 58 C 25 50, 45 66, 70 60 S 115 40, 165 48"
            fill="none"
            stroke="#1C2A33"
            strokeWidth="2.2"
          />
          <g fill="none" stroke="#242424" strokeLinecap="round">
            <path d="M0 30 L 160 36" strokeWidth=".9" />
            <path d="M10 100 L 70 0" strokeWidth=".9" />
            <path d="M150 100 L 95 0" strokeWidth=".9" />
            <path d="M0 82 C 50 74, 110 92, 160 78" strokeWidth=".7" />
            <path d="M30 0 L 40 100" strokeWidth=".4" />
            <path d="M60 0 L 58 100" strokeWidth=".4" />
            <path d="M120 0 L 128 100" strokeWidth=".4" />
            <path d="M0 14 L 160 18" strokeWidth=".4" />
            <path d="M0 66 L 160 64" strokeWidth=".4" />
          </g>
          <g fontFamily="Geist, sans-serif" fontSize="3.2" fill="#3A3A3A" fontWeight="600">
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
          {DEMO_ROUTES.map((r) => (
            <polyline
              key={r.day}
              points={[DEPOT.join(','), ...r.stops.map((s) => s.join(','))].join(' ')}
              fill="none"
              stroke={r.color}
              strokeWidth=".7"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {DEMO_ROUTES.map((r) =>
            r.stops.map((s, i) => (
              <g key={`${r.day}-${i}`}>
                <circle cx={s[0]} cy={s[1]} r="1.9" fill={r.color} stroke="#121212" strokeWidth=".5" />
                <text
                  x={s[0]}
                  y={(parseFloat(s[1]) + 0.7).toFixed(2)}
                  fontFamily="Geist Mono, monospace"
                  fontSize="2"
                  fontWeight="600"
                  fill="#0A0A0A"
                  textAnchor="middle"
                >
                  {i + 1}
                </text>
              </g>
            )),
          )}
          <rect
            x="77.5"
            y="49.5"
            width="5"
            height="5"
            rx="1"
            fill="#FFD60A"
            stroke="#121212"
            strokeWidth=".8"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '20px',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            fontFamily: "'Geist Mono',ui-monospace,monospace",
            fontSize: '11px',
          }}
        >
          {DEMO_ROUTES.map((r) => (
            <span
              key={r.day}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(10,10,10,.8)',
                border: '1px solid #2A2A2E',
                color: '#D4D4D4',
                borderRadius: '999px',
                padding: '5px 10px',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '9px',
                  background: r.color,
                  display: 'inline-block',
                }}
              />
              {r.day}
            </span>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '20px',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
            fontFamily: "'Geist Mono',ui-monospace,monospace",
            fontSize: '12px',
          }}
        >
          <span
            style={{
              background: 'rgba(10,10,10,.8)',
              border: '1px solid #2A2A2E',
              color: '#EDEBE6',
              borderRadius: '999px',
              padding: '7px 12px',
            }}
          >
            57 bayi · 6 gün · sıralı duraklar
          </span>
          <span
            style={{
              background: 'rgba(10,10,10,.8)',
              border: '1px solid #2A2A2E',
              color: '#A8A59D',
              borderRadius: '999px',
              padding: '7px 12px',
            }}
          >
            6.000 → 3.000 km
          </span>
        </div>
      </div>
    </Link>
  );
}
