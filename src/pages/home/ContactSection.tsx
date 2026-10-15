import { SiteFooter } from '../../components/SiteFooter';
import { SITE } from '../../data/site';

/** Kapanış: büyük çağrı, e-posta, sosyal bağlantılar ve alt bilgi. */
export function ContactSection() {
  return (
    <section id="iletisim" className="section contact" aria-labelledby="iletisim-baslik">
      <div className="wrap">
        <span className="eyebrow reveal">04 · İletişim</span>
        <h2 id="iletisim-baslik" className="display contact-title reveal">
          Bir fikrin mi var?
          <br />
          <span className="hl">Kuralım.</span>
        </h2>
        <div className="contact-row reveal">
          <a href={`mailto:${SITE.email}`} className="mail">
            {SITE.email}
          </a>
          <div className="contact-links">
            <a href={SITE.linkedin} className="pill">
              LinkedIn
            </a>
            <a href={SITE.github} className="pill">
              GitHub
            </a>
          </div>
        </div>
        <SiteFooter variant="section" />
      </div>
    </section>
  );
}
