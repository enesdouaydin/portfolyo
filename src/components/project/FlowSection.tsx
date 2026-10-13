import type { FlowContent } from '../../data/projectPages';
import { ACCENT } from '../../theme';
import { GUTTER, MONO, SERIF, fluid, h2Style, serifItalic } from '../../styles/type';
import { Eyebrow } from '../Eyebrow';

const chip = {
  border: '1px solid #2F2F34',
  color: '#C9C6BE',
  borderRadius: '14px',
  padding: '5px 10px',
  fontFamily: MONO,
  fontSize: '11px',
  lineHeight: '1.5',
} as const;

/** "Nasıl çalışıyor" bölümü: başlık + numaralı adım kartları (koşul → hedef hapları) + üç not sütunu. */
export function FlowSection({ data }: { data: FlowContent }) {
  return (
    <section
      aria-label={data.eyebrow.replace(/^\d+ \/ /, '')}
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: `0 ${GUTTER} ${fluid(128)}`,
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h2 style={h2Style}>
            {data.title.lead} <span style={serifItalic}>{data.title.italic}</span>
          </h2>
        </div>
        <p style={{ margin: '0', maxWidth: '440px', fontSize: '17px', lineHeight: '1.55', color: '#A8A59D' }}>
          {data.lead}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <span style={{ fontFamily: MONO, fontSize: '12px', color: '#8A877F', letterSpacing: '.06em' }}>
          {data.caption}
        </span>
        <ol
          style={{
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))',
            gap: '16px',
          }}
        >
          {data.steps.map((a) => (
            <li
              key={a.n}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: '#111113',
                border: '1px solid #232327',
                borderRadius: '20px',
                padding: '28px',
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: '12px', color: ACCENT, letterSpacing: '.06em' }}>
                {a.n}
              </span>
              <span style={{ fontWeight: '500', fontSize: '22px', letterSpacing: '-0.03em' }}>{a.role}</span>
              <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#A8A59D' }}>{a.does}</p>
              {a.says && (
                <p
                  style={{
                    margin: '0',
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: '20px',
                    lineHeight: '1.3',
                    color: '#EDEBE6',
                  }}
                >
                  “{a.says}”
                </p>
              )}
              {a.exits.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
                  {a.exits.map((e) => (
                    <span key={e.when} style={chip}>
                      {e.when} <span style={{ color: ACCENT }}>→</span> {e.to}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))',
          gap: '48px 40px',
        }}
      >
        {data.notes.map((n) => (
          <div
            key={n.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderTop: '1px solid #2A2A2E',
              paddingTop: '24px',
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: '12px', color: ACCENT, letterSpacing: '.06em' }}>
              {n.label}
            </span>
            <p
              style={{
                margin: '0',
                fontSize: '18px',
                lineHeight: '1.5',
                letterSpacing: '-0.01em',
                color: '#D6D3CB',
                textWrap: 'pretty',
              }}
            >
              {n.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
