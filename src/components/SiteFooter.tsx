import { SITE } from '../data/site';

function FooterRow() {
  return (
    <div className="footer-row">
      <span>© 2026 {SITE.name}</span>
      <nav aria-label="Bağlantılar">
        <a href={`mailto:${SITE.email}`}>e-posta</a>
        <a href={SITE.github}>GitHub</a>
        <a href={SITE.linkedin}>LinkedIn</a>
      </nav>
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
  if (variant === 'section') return <FooterRow />;
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <FooterRow />
      </div>
    </footer>
  );
}
