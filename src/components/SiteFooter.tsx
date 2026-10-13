import type { CSSProperties } from 'react';
import { SITE } from '../data/site';
import { GUTTER, MONO } from '../styles/type';

const linkStyle = { color: '#A3A3A3', textDecoration: 'none' } as const;

function FooterRow({ color, style }: { color: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        fontFamily: MONO,
        fontSize: '12px',
        color,
        ...style,
      }}
    >
      <span>© 2026 {SITE.name}</span>
      <span style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <a href={`mailto:${SITE.email}`} style={linkStyle}>
          e-posta
        </a>
        <a href={SITE.github} style={linkStyle}>
          GitHub
        </a>
        <a href={SITE.linkedin} style={linkStyle}>
          LinkedIn
        </a>
      </span>
    </div>
  );
}

interface Props {
  /**
   * `page`: proje sayfalarının alt bilgisi (kendi <footer>'ı ve kabı var).
   * `section`: ana sayfada İletişim bölümünün içindeki son satır.
   */
  variant: 'page' | 'section';
}

export function SiteFooter({ variant }: Props) {
  if (variant === 'section') {
    return <FooterRow color="#8A877F" style={{ borderTop: '1px solid #1F1F1F', paddingTop: '28px' }} />;
  }
  return (
    <footer style={{ borderTop: '1px solid #1F1F1F' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: `28px ${GUTTER}` }}>
        <FooterRow color="#8A8A8A" />
      </div>
    </footer>
  );
}
