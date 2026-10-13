import { GUTTER, fluid } from '../../styles/type';
import { ACCENT } from '../../theme';
import { SiteFooter } from '../../components/SiteFooter';

export function ContactSection() {
  return (
    <section
      id="iletisim"
      style={{ borderTop: '1px solid #1F1F1F', position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: `${fluid(152)} ${GUTTER} 64px`,
          display: 'flex',
          flexDirection: 'column',
          gap: '72px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <span
            style={{
              fontFamily: "'Geist Mono',ui-monospace,monospace",
              fontSize: '13px',
              color: '#A8A59D',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ width: '24px', height: '1px', background: '#6A6862', display: 'inline-block' }} />
            İletişim
          </span>
          <h2
            style={{
              margin: '0',
              fontWeight: '500',
              fontSize: 'clamp(52px,9vw,148px)',
              letterSpacing: '-0.055em',
              lineHeight: '.92',
            }}
          >
            Bir fikrin mi var?
            <br />
            <span
              style={{
                fontFamily: "'Instrument Serif',Georgia,serif",
                fontStyle: 'italic',
                fontWeight: '400',
                letterSpacing: '-0.02em',
                color: ACCENT,
              }}
            >
              Kuralım.
            </span>
          </h2>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="mailto:enesdouaydinn@gmail.com"
            className="mail"
            style={{
              color: '#EDEBE6',
              fontSize: 'clamp(22px,3vw,40px)',
              letterSpacing: '-0.03em',
              paddingBottom: '6px',
              overflowWrap: 'anywhere',
            }}
          >
            enesdouaydinn@gmail.com
          </a>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href="https://linkedin.com/in/enesdouaydin"
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
              }}
            >
              LinkedIn
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
              }}
            >
              GitHub
            </a>
          </div>
        </div>
        <SiteFooter variant="section" />
      </div>
    </section>
  );
}
