import { Link } from 'react-router-dom';
import { DEMO_ROUTES, DEPOT } from '../../data/routeDemo';
import { ROUTES } from '../../routes';
import { ArrowRight } from './ProjectCard';
import { ScrambleText } from '../../components/ScrambleText';

const STACK = ['Python · FastAPI', 'PostgreSQL', 'RabbitMQ · Redis', 'k-means · 2-opt'];
const DISTRICTS: ReadonlyArray<[string, number, number]> = [
  ['KEÇİÖREN', 18, 12],
  ['ALTINDAĞ', 74, 9],
  ['MAMAK', 128, 20],
  ['YENİMAHALLE', 8, 50],
  ['ÇANKAYA', 70, 95],
  ['GÖLBAŞI', 128, 94],
];

/** Haritada günlere ayrılmış bayi rotaları; görünüme girince rotalar çizilir. */
function RouteMap() {
  return (
    <div className="featured-map" aria-hidden="true">
      <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">
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
          <path
            d="M30 0 L 40 100 M60 0 L 58 100 M120 0 L 128 100 M0 14 L 160 18 M0 66 L 160 64"
            strokeWidth=".4"
          />
        </g>
        <g fontFamily="var(--font-sans)" fontSize="3.2" fill="#3A3A3A" fontWeight="600">
          {DISTRICTS.map(([name, x, y]) => (
            <text key={name} x={x} y={y}>
              {name}
            </text>
          ))}
        </g>
        {DEMO_ROUTES.map((r) => (
          <polyline
            key={r.day}
            className="route"
            pathLength={260}
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
                fontFamily="var(--font-mono)"
                fontSize="2"
                fontWeight="600"
                fill="#0C0A09"
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
          fill="#F0B54A"
          stroke="#121212"
          strokeWidth=".8"
        />
      </svg>
      <div className="map-legend">
        {DEMO_ROUTES.map((r) => (
          <span key={r.day}>
            <i style={{ background: r.color }} />
            {r.day}
          </span>
        ))}
      </div>
      <span className="map-note">57 bayi · 6 gün · sıralı duraklar</span>
    </div>
  );
}

/** Seçili işlerin başındaki büyük Bayi Rota kartı. */
export function FeaturedProject() {
  return (
    <li className="featured reveal">
      <Link to={ROUTES.bayiRota} className="card">
        <div className="featured-body">
          <span className="card-top mono">
            <span>01 — Optimizasyon · Full-stack</span>
            <span className="badge badge--live">Sahada kullanımda</span>
          </span>
          <h3 className="display featured-title">
            <ScrambleText text="Bayi Rota Optimizasyonu" />
          </h3>
          <p className="featured-lead">
            Saha satış temsilcilerinin bayilerini bölgelere kümeleyip rotalayan sistem. Kâğıt üzerinde bir
            hafta süren planlama artık 10 saniye, rotalar ortalama yarı yarıya kısa.
          </p>
          <div className="featured-stats">
            <div>
              <b>10 sn</b>
              <span>planlama süresi</span>
            </div>
            <div>
              <b>6.000 → 3.000</b>
              <span>toplam rota, km</span>
            </div>
          </div>
          <span className="badges">
            {STACK.map((s) => (
              <span key={s} className="badge">
                {s}
              </span>
            ))}
          </span>
          <span className="card-foot">
            <span>Vaka çalışması ve canlı demo</span>
            <span className="arrow">
              <ArrowRight />
            </span>
          </span>
        </div>
        <RouteMap />
      </Link>
    </li>
  );
}
