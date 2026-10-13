import { Link } from 'react-router-dom';
import { SITE } from '../../data/site';
import { ROUTES } from '../../routes';
import { MONO } from '../../styles/type';
import { ContactPill, SiteHeader } from '../SiteHeader';

/** Proje sayfalarının üst menüsü: "Tüm işler" geri bağlantısı, vaka numarası ve iletişim. */
export function ProjectHeader({ caseNo }: { caseNo: string }) {
  return (
    <SiteHeader>
      <Link
        className="nl"
        to={ROUTES.home}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <svg
          aria-hidden="true"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Tüm işler
      </Link>
      <span style={{ fontFamily: MONO, fontSize: '12px', color: '#8A8A8A' }}>Vaka {caseNo} / 07</span>
      <ContactPill href={`mailto:${SITE.email}`} />
    </SiteHeader>
  );
}
