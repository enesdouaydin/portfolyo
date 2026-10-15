import { GUTTER, MONO, fluid } from '../../styles/type';

/** "01 / Problem · 02 / Yaklaşım · 03 / Sonuç" sütunları. */
export function StorySection({ items }: { items: ReadonlyArray<{ label: string; text: string }> }) {
  return (
    <section
      aria-label="Hikâye"
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: `56px ${GUTTER} ${fluid(128)}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))',
        gap: '48px 40px',
      }}
    >
      {items.map((it) => (
        <div
          key={it.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            borderTop: '1px solid #2A2A2E',
            paddingTop: '24px',
          }}
        >
          <span style={{ fontFamily: MONO, fontSize: '12px', color: '#F0B54A', letterSpacing: '.06em' }}>
            {it.label}
          </span>
          <p
            style={{
              margin: '0',
              fontSize: '20px',
              lineHeight: '1.5',
              letterSpacing: '-0.01em',
              color: '#D6D3CB',
              textWrap: 'pretty',
            }}
          >
            {it.text}
          </p>
        </div>
      ))}
    </section>
  );
}
