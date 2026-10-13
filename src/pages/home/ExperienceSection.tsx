import { EXPERIENCE } from '../../data/profile';
import { GUTTER, MONO, SERIF, fluid, h2Style, serifItalic } from '../../styles/type';

const rule = '1px solid rgba(10,10,10,.22)';

export function ExperienceSection() {
  return (
    <section id="deneyim" style={{ background: '#FFD60A', color: '#0A0A0A' }}>
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: `${fluid(136)} ${GUTTER}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '56px 80px',
        }}
      >
        <div
          style={{ flex: '1 1 340px', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <h2 style={h2Style}>
            Nerelerde <span style={serifItalic}>çalıştım</span>
          </h2>
          <p
            style={{
              margin: '0',
              fontSize: '18px',
              lineHeight: '1.55',
              color: '#4A4843',
              maxWidth: '400px',
              textWrap: 'pretty',
            }}
          >
            AI agent sistemlerinden sahada her gün kullanılan optimizasyon sistemlerine.
          </p>
        </div>
        <ol
          style={{
            flex: '999 1 620px',
            minWidth: '0',
            listStyle: 'none',
            margin: '0',
            padding: '0',
            borderBottom: rule,
          }}
        >
          {EXPERIENCE.map((e) => (
            <li
              key={e.title}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px 40px',
                padding: '32px 0',
                borderTop: rule,
              }}
            >
              <span
                style={{
                  flex: '0 0 150px',
                  fontFamily: MONO,
                  fontSize: '13px',
                  color: '#4A4843',
                  paddingTop: '8px',
                }}
              >
                {e.period}
              </span>
              <div
                style={{
                  flex: '1 1 320px',
                  minWidth: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <span style={{ fontWeight: '500', fontSize: '28px', letterSpacing: '-0.03em' }}>
                  {e.title}
                </span>
                {e.org && (
                  <span
                    style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '22px', color: '#4A4843' }}
                  >
                    {e.org}
                  </span>
                )}
                <span style={{ fontSize: '16px', lineHeight: '1.55', color: '#33312D', maxWidth: '560px' }}>
                  {e.text}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
