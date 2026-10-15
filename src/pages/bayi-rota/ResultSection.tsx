import { GUTTER, fluid } from '../../styles/type';
export function ResultSection() {
  return (
    <section
      aria-label="Sonuç"
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: `0 ${GUTTER} ${fluid(136)}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '72px',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 64px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span
            style={{
              fontFamily: "'Geist Mono Variable','Geist Mono',ui-monospace,monospace",
              fontSize: '12px',
              color: '#8a7e6e',
              letterSpacing: '.06em',
            }}
          >
            ÖNCE
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '800',
              fontStretch: '75%',
              fontSize: 'clamp(64px,8vw,128px)',
              letterSpacing: '-0.02em',
              lineHeight: '.9',
              color: '#6f6457',
              textDecoration: 'line-through',
              textDecorationThickness: '3px',
            }}
          >
            1 hafta
          </span>
          <span style={{ fontSize: '16px', lineHeight: '1.55', color: '#8a7e6e', maxWidth: '360px' }}>
            Excel'de, konumlar görülmeden, kâğıt üzerinde planlama.
          </span>
        </div>
        <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span
            style={{
              fontFamily: "'Geist Mono Variable','Geist Mono',ui-monospace,monospace",
              fontSize: '12px',
              color: '#F0B54A',
              letterSpacing: '.06em',
            }}
          >
            ŞİMDİ
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '800',
              fontStretch: '75%',
              fontSize: 'clamp(64px,8vw,128px)',
              letterSpacing: '-0.02em',
              lineHeight: '.9',
            }}
          >
            10{' '}
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '600',
                letterSpacing: '-0.02em',
              }}
            >
              saniye
            </span>
          </span>
          <span style={{ fontSize: '16px', lineHeight: '1.55', color: '#ab9f8e', maxWidth: '360px' }}>
            Sonuçlar haritada; kullanıcı geri bildirim verip bölgeleri elle düzenleyebiliyor.
          </span>
        </div>
      </div>
      <dl
        style={{
          margin: '0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))',
        }}
      >
        <div
          style={{
            borderTop: '1px solid #2b241e',
            padding: '24px 24px 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <dt style={{ fontSize: '15px', lineHeight: '1.5', color: '#ab9f8e' }}>
            genel rota mesafesinde azalma
          </dt>
          <dd
            style={{
              order: '-1',
              margin: '0',
              fontFamily: 'var(--font-display)',
              fontWeight: '800',
              fontStretch: '75%',
              fontSize: '60px',
              letterSpacing: '-0.02em',
              lineHeight: '1',
            }}
          >
            <span style={{ color: '#F0B54A' }}>%</span>
            50
          </dd>
        </div>
        <div
          style={{
            borderTop: '1px solid #2b241e',
            padding: '24px 24px 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <dt style={{ fontSize: '15px', lineHeight: '1.5', color: '#ab9f8e' }}>
            örnek bir şehirde toplam rota
          </dt>
          <dd
            style={{
              order: '-1',
              margin: '0',
              fontFamily: 'var(--font-display)',
              fontWeight: '800',
              fontStretch: '75%',
              fontSize: '60px',
              letterSpacing: '-0.02em',
              lineHeight: '1',
            }}
          >
            6.000 → 3.000
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '600',
                letterSpacing: '0',
                color: 'var(--accent)',
              }}
            >
              km
            </span>
          </dd>
        </div>
        <div
          style={{
            borderTop: '1px solid #2b241e',
            padding: '24px 24px 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <dt style={{ fontSize: '15px', lineHeight: '1.5', color: '#ab9f8e' }}>
            1.600 nokta; muadil çözümler 3–5 dakika
          </dt>
          <dd
            style={{
              order: '-1',
              margin: '0',
              fontFamily: 'var(--font-display)',
              fontWeight: '800',
              fontStretch: '75%',
              fontSize: '60px',
              letterSpacing: '-0.02em',
              lineHeight: '1',
            }}
          >
            ~8
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '600',
                letterSpacing: '0',
                color: 'var(--accent)',
              }}
            >
              sn
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
