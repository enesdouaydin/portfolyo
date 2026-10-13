import { GUTTER, fluid } from '../../styles/type';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { ACCENT } from '../../theme';
import { CATEGORIES, FEATURED_CATS, PROJECTS, type CategoryId } from '../../data/home';
import { FeaturedProject } from './FeaturedProject';

export function WorkSection() {
  const [filter, setFilter] = useState<CategoryId>('all');

  const cats = CATEGORIES.map((c) => {
    const on = filter === c.id;
    return {
      label: c.label,
      pressed: on,
      bg: on ? '#FFD60A' : 'transparent',
      fg: on ? '#0A0A0A' : '#C9C6BE',
      bd: on ? '#FFD60A' : '#2F2F34',
      pick: () => setFilter(c.id),
    };
  });
  const showFeatured = filter === 'all' || FEATURED_CATS.includes(filter);
  const shown = PROJECTS.filter((p) => filter === 'all' || p.cats.includes(filter)).map((p) => ({
    n: p.n,
    title: p.title,
    line: p.line,
    kind: p.kind,
    hasDemo: !!p.hasDemo,
    hasVideo: !!p.hasVideo,
    wip: !!p.wip,
    to: p.to,
  }));
  const total = shown.length + (showFeatured ? 1 : 0);
  const count = (total < 10 ? '0' : '') + total;

  return (
    <section
      id="isler"
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: `40px ${GUTTER} ${fluid(140)}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '28px',
          flexWrap: 'wrap',
        }}
      >
        <h2
          style={{
            margin: '0',
            fontWeight: '500',
            fontSize: 'clamp(44px,6vw,92px)',
            letterSpacing: '-0.05em',
            lineHeight: '.95',
          }}
        >
          Seçili{' '}
          <span
            style={{
              fontFamily: "'Instrument Serif',Georgia,serif",
              fontStyle: 'italic',
              fontWeight: '400',
              letterSpacing: '-0.02em',
            }}
          >
            işler
          </span>
          <span
            style={{
              fontFamily: "'Geist Mono',ui-monospace,monospace",
              fontSize: '14px',
              letterSpacing: '0',
              color: '#A8A59D',
              verticalAlign: 'top',
              marginLeft: '10px',
            }}
          >
            {count}
          </span>
        </h2>
        <div
          role="group"
          aria-label="Projeleri filtrele"
          style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
        >
          {cats.map((c, cIdx) => (
            <button
              key={cIdx}
              type="button"
              className="chip"
              onClick={c.pick}
              aria-pressed={c.pressed}
              style={{
                minHeight: '40px',
                padding: '0 16px',
                borderRadius: '999px',
                border: `1px solid ${c.bd}`,
                background: c.bg,
                color: c.fg,
                fontFamily: "'Geist',sans-serif",
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      {/* Featured */}
      {showFeatured && <FeaturedProject />}
      {/* Index */}
      <ul style={{ listStyle: 'none', margin: '0', padding: '0', borderBottom: '1px solid #232327' }}>
        {shown.map((p, pIdx) => (
          <li key={pIdx} style={{ borderTop: '1px solid #232327' }}>
            <Link
              to={p.to}
              title={p.to === ROUTES.contact ? 'Bu iş için ayrı sayfa yok — iletişime geç' : undefined}
              className="row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px 32px',
                flexWrap: 'wrap',
                padding: '32px 16px',
                textDecoration: 'none',
                color: '#EDEBE6',
                borderRadius: '4px',
              }}
            >
              <span
                style={{
                  flex: '0 0 40px',
                  fontFamily: "'Geist Mono',ui-monospace,monospace",
                  fontSize: '13px',
                  color: '#8A877F',
                }}
              >
                {p.n}
              </span>
              <span
                className="rt"
                style={{
                  flex: '999 1 420px',
                  minWidth: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontWeight: '500',
                    fontSize: 'clamp(26px,2.6vw,38px)',
                    letterSpacing: '-0.035em',
                    lineHeight: '1.08',
                  }}
                >
                  {p.title}
                </span>
                <span style={{ fontSize: '16px', lineHeight: '1.5', color: '#A8A59D', maxWidth: '640px' }}>
                  {p.line}
                </span>
              </span>
              <span
                style={{
                  flex: '1 1 200px',
                  fontFamily: "'Geist Mono',ui-monospace,monospace",
                  fontSize: '12px',
                  color: '#A8A59D',
                  lineHeight: '1.7',
                }}
              >
                {p.kind}
              </span>
              <span
                style={{
                  flex: '0 1 auto',
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                  fontFamily: "'Geist Mono',ui-monospace,monospace",
                  fontSize: '11px',
                }}
              >
                {p.hasDemo && (
                  <>
                    <span
                      style={{
                        border: '1px solid #2F2F34',
                        color: '#C9C6BE',
                        borderRadius: '999px',
                        padding: '5px 10px',
                      }}
                    >
                      Demo
                    </span>
                  </>
                )}
                {p.hasVideo && (
                  <>
                    <span
                      style={{
                        border: '1px solid #2F2F34',
                        color: '#C9C6BE',
                        borderRadius: '999px',
                        padding: '5px 10px',
                      }}
                    >
                      Video
                    </span>
                  </>
                )}
                {p.wip && (
                  <>
                    <span
                      style={{
                        background: ACCENT,
                        color: '#0A0A0A',
                        borderRadius: '999px',
                        padding: '5px 10px',
                      }}
                    >
                      Geliştiriliyor
                    </span>
                  </>
                )}
              </span>
              <span
                className="ra"
                style={{
                  flex: '0 0 48px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '999px',
                  border: '1px solid #2F2F34',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EDEBE6',
                }}
              >
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
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
