import { GUTTER, MONO, fluid, h2Style, serifItalic } from '../../styles/type';

interface Row {
  label: string;
  main: string;
  aside?: string;
  /** Tasarımda yalnızca "SERVİSLER" etiketi tam siyah. */
  strongLabel?: boolean;
}

const ROWS: readonly Row[] = [
  { label: 'İSTEMCİ', main: 'Harita arayüzü', aside: '— bölge ve rotaları görme, düzenleme' },
  { label: 'GİRİŞ', main: 'Nginx', aside: '— CORS, CSP ve HSTS güvenlik katmanları' },
  {
    label: 'SERVİSLER',
    main: 'FastAPI mikroservisleri · SQLAlchemy',
    aside: '— kümeleme, rotalama, bayi verisi',
    strongLabel: true,
  },
  { label: 'MESAJ · ÖNBELLEK', main: 'RabbitMQ · Redis' },
  { label: 'VERİ', main: 'PostgreSQL', aside: '— satış otomasyonu ile senkron' },
  { label: 'İZLEME', main: 'Prometheus · Grafana · Loki' },
];

export function ArchitectureSection() {
  return (
    <section aria-label="Mimari" style={{ background: '#F0B54A', color: '#0C0A09' }}>
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: `${fluid(128)} ${GUTTER}`,
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
            Nasıl <span style={serifItalic}>kurgulandı</span>
          </h2>
          <p
            style={{ margin: '0', maxWidth: '440px', fontSize: '17px', lineHeight: '1.55', color: '#4A4843' }}
          >
            Mikroservisler RabbitMQ üzerinden konuşuyor; satış otomasyonuyla senkron servisler bayi verisini
            güncel tutuyor. Hepsi Docker konteynerlerinde.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #0C0A09' }}>
          {ROWS.map((r) => (
            <div
              key={r.label}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px 32px',
                padding: '24px 0',
                borderBottom: '1px solid rgba(12, 10, 9,.22)',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  flex: '0 0 160px',
                  fontFamily: MONO,
                  fontSize: '12px',
                  color: r.strongLabel ? '#0C0A09' : '#4A4843',
                  letterSpacing: '.06em',
                }}
              >
                {r.label}
              </span>
              <span
                style={{ flex: '1 1 300px', fontSize: 'clamp(22px,2.2vw,30px)', letterSpacing: '-0.025em' }}
              >
                {r.main}
                {r.aside && (
                  <>
                    {' '}
                    <span style={{ color: '#6A6862' }}>{r.aside}</span>
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
