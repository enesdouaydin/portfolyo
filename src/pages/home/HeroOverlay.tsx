import { GUTTER } from '../../styles/type';
import { ACCENT } from '../../theme';
import { GROUPS, PAIRS } from '../../data/home';

interface Props {
  /** Kılıç uçlarında gösterilen teknoloji çiftinin sırası (sahne bunu üretir). */
  stage: number;
  /** Kaydırma olmadan otomatik oynuyorsa true. */
  noScroll: boolean;
}

/** Hero üzerindeki metin katmanı: scrim + başlık + sayaçlar. */
export function HeroOverlay({ stage, noScroll }: Props) {
  const pr = PAIRS[stage];
  const pairNo = (stage + 1 < 10 ? '0' : '') + (stage + 1);
  const pairTotal = String(PAIRS.length);
  const groups = GROUPS.map((g, i) => {
    const on = i === pr[2];
    const done = i < pr[2];
    return {
      n: '0' + (i + 1),
      label: g,
      bar: on ? ACCENT : done ? '#6A6862' : '#2A2A2E',
      fg: on ? '#EDEBE6' : '#8A877F',
    };
  });
  const hint = noScroll ? 'Otomatik oynatılıyor' : 'Kaydır, dönsün';
  return (
    <>
      <div
        aria-hidden="true"
        className="scrim"
        style={{
          position: 'absolute',
          inset: '0',
          background:
            'linear-gradient(90deg,rgba(10,10,10,.92) 0%,rgba(10,10,10,.55) 34%,rgba(10,10,10,0) 58%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="heroin hero-overlay"
        style={{
          position: 'absolute',
          inset: '0',
          maxWidth: '1360px',
          margin: '0 auto',
          padding: `128px ${GUTTER} 40px`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <div
          className="hero-copy"
          style={{ display: 'flex', flexDirection: 'column', gap: '26px', maxWidth: '600px' }}
        >
          <span
            className="rise"
            style={{
              fontFamily: "'Geist Mono',ui-monospace,monospace",
              fontSize: '13px',
              color: '#A8A59D',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '.02em',
            }}
          >
            <span style={{ width: '24px', height: '1px', background: '#6A6862', display: 'inline-block' }} />
            Enes Dou Aydın · Software Developer · AI Engineer
          </span>
          <h1
            className="rise d1 hero-h1"
            style={{
              margin: '0',
              fontWeight: '500',
              fontSize: 'clamp(44px,5.8vw,92px)',
              lineHeight: '.96',
              letterSpacing: '-0.05em',
            }}
          >
            <span style={{ display: 'block' }}>
              Konuşan{' '}
              <span
                style={{
                  fontFamily: "'Instrument Serif',Georgia,serif",
                  fontStyle: 'italic',
                  fontWeight: '400',
                  letterSpacing: '-0.02em',
                }}
              >
                ajanlar,
              </span>
            </span>
            <span style={{ display: 'block' }}>
              kısalan{' '}
              <span
                style={{
                  fontFamily: "'Instrument Serif',Georgia,serif",
                  fontStyle: 'italic',
                  fontWeight: '400',
                  letterSpacing: '-0.02em',
                }}
              >
                rotalar,
              </span>
            </span>
            <span style={{ display: 'block', color: '#6A6862' }}>
              çalışan{' '}
              <span
                style={{
                  fontFamily: "'Instrument Serif',Georgia,serif",
                  fontStyle: 'italic',
                  fontWeight: '400',
                  letterSpacing: '-0.02em',
                  color: '#EDEBE6',
                }}
              >
                sistemler
              </span>
              <span style={{ color: ACCENT }}>.</span>
            </span>
          </h1>
          <p
            className="rise d2 hero-lead"
            style={{
              margin: '0',
              fontSize: '18px',
              lineHeight: '1.55',
              color: '#A8A59D',
              maxWidth: '480px',
              textWrap: 'pretty',
            }}
          >
            Go, Python ve TypeScript ile <span style={{ color: '#EDEBE6' }}>AI agent sistemleri</span>,
            mikroservis backend'ler ve uçtan uca ürünler geliştiriyorum.
          </p>
          <div
            className="rise d3"
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', pointerEvents: 'auto' }}
          >
            <a
              href="#isler"
              style={{
                color: '#0A0A0A',
                background: '#FFD60A',
                textDecoration: 'none',
                padding: '0 22px',
                minHeight: '48px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: '500',
                fontSize: '15px',
              }}
            >
              Seçili işler
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
            <a
              href="https://github.com/enesdouaydin"
              style={{
                color: '#EDEBE6',
                textDecoration: 'none',
                padding: '0 22px',
                minHeight: '48px',
                borderRadius: '999px',
                border: '1px solid #3A3A40',
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: '500',
                fontSize: '15px',
                background: 'rgba(10,10,10,.4)',
              }}
            >
              GitHub
            </a>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span
              style={{
                fontFamily: "'Geist Mono',ui-monospace,monospace",
                fontSize: '12px',
                color: '#8A877F',
                letterSpacing: '.04em',
              }}
            >
              KILICIN UÇLARINDA · {pairNo} / {pairTotal}
            </span>
            <span style={{ fontSize: 'clamp(22px,2.4vw,32px)', letterSpacing: '-0.03em', fontWeight: '500' }}>
              {pr[0]}{' '}
              <span
                style={{
                  fontFamily: "'Instrument Serif',Georgia,serif",
                  fontStyle: 'italic',
                  fontWeight: '400',
                  color: ACCENT,
                }}
              >
                &amp;
              </span>{' '}
              {pr[1]}
            </span>
            <ol
              style={{
                listStyle: 'none',
                margin: '0',
                padding: '0',
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
              }}
            >
              {groups.map((g, gIdx) => (
                <li
                  key={gIdx}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '96px' }}
                >
                  <span style={{ height: '2px', borderRadius: '2px', background: g.bar }} />
                  <span
                    style={{
                      fontFamily: "'Geist Mono',ui-monospace,monospace",
                      fontSize: '11px',
                      color: g.fg,
                      letterSpacing: '.04em',
                    }}
                  >
                    {g.n} {g.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <span
            className="hint"
            style={{
              fontFamily: "'Geist Mono',ui-monospace,monospace",
              fontSize: '12px',
              color: '#8A877F',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {hint}
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
}
