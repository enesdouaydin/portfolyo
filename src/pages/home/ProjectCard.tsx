import { Link } from 'react-router-dom';
import type { ProjectRow } from '../../data/home';
import { ROUTES } from '../../routes';

export const ArrowRight = () => (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Seçili işler ızgarasındaki kart. Kendi sayfası olmayan işler iletişim bölümüne gider. */
export function ProjectCard({ p }: { p: ProjectRow }) {
  return (
    <Link
      to={p.to}
      className="card"
      title={p.to === ROUTES.contact ? 'Bu iş için ayrı sayfa yok — iletişime geç' : undefined}
    >
      <span className="card-top mono">
        <span>{p.n}</span>
        <span>{p.kind}</span>
      </span>
      <h3 className="display card-title">{p.title}</h3>
      <p className="card-line">{p.line}</p>
      <span className="card-foot">
        <span className="badges">
          {p.hasDemo && <span className="badge">Demo</span>}
          {p.hasVideo && <span className="badge">Video</span>}
          {p.wip && <span className="badge badge--wip">Geliştiriliyor</span>}
        </span>
        <span className="arrow">
          <ArrowRight />
        </span>
      </span>
    </Link>
  );
}
