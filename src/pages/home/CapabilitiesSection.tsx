import { CAPABILITY_GROUPS } from '../../data/profile';
import { GUTTER, MONO, fluid, h2Style, serifItalic } from '../../styles/type';

export function CapabilitiesSection() {
  return (
    <section
      id="yetkinlik"
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: `${fluid(136)} ${GUTTER}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '56px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px 64px',
          flexWrap: 'wrap',
        }}
      >
        <h2 style={h2Style}>
          Neyle <span style={serifItalic}>çalışıyorum</span>
        </h2>
        <p style={{ margin: '0', maxWidth: '440px', fontSize: '17px', lineHeight: '1.55', color: '#A8A59D' }}>
          Yapay zekânın her katmanında: veriden modele, modelden sahada çalışan uygulamaya.
        </p>
      </div>
      {CAPABILITY_GROUPS.map((g) => (
        <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              borderTop: '1px solid #2A2A2A',
              paddingTop: '20px',
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: '12px', color: '#FFD60A', letterSpacing: '.06em' }}>
              {g.label}
            </span>
            <span style={{ fontFamily: MONO, fontSize: '12px', color: '#8A8A8A' }}>{g.count}</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
              gap: '16px',
            }}
          >
            {g.cards.map((c) => (
              <div
                key={c.title}
                style={{
                  border: '1px solid #232323',
                  borderRadius: '18px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  background: '#0E0E0E',
                }}
              >
                <span
                  style={{
                    fontWeight: '500',
                    fontSize: `${g.titleSize}px`,
                    letterSpacing: '-0.02em',
                    color: '#F2F0EA',
                  }}
                >
                  {c.title}
                </span>
                {c.desc && (
                  <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#A3A3A3' }}>{c.desc}</span>
                )}
                <ul
                  style={{
                    listStyle: 'none',
                    margin: '0',
                    padding: '0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  {c.tags.map((t) => (
                    <li
                      key={t}
                      style={{
                        fontSize: '14px',
                        lineHeight: '1',
                        padding: '8px 12px',
                        borderRadius: '999px',
                        border: '1px solid #2F2F2F',
                        color: '#E2E0DA',
                        background: '#121212',
                      }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
