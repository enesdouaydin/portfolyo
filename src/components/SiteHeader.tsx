import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../data/site';
import { GUTTER, MONO } from '../styles/type';

/** Sağdaki sarı "İletişim" hapı. Ana sayfada sayfa içi bağlantı, proje sayfalarında e-posta. */
export function ContactPill({ href }: { href: string }) {
  return (
    <a
      href={href}
      style={{
        color: '#0A0A0A',
        background: '#FFD60A',
        textDecoration: 'none',
        padding: '0 18px',
        minHeight: '40px',
        borderRadius: '999px',
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: '600',
        fontSize: '14px',
      }}
    >
      İletişim
    </a>
  );
}

const logoStyle = {
  textDecoration: 'none',
  color: '#F2F0EA',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: '600',
  fontSize: '15px',
  letterSpacing: '-0.01em',
  minHeight: '44px',
} as const;

const logoContent = (
  <>
    <span
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        background: '#FFD60A',
        color: '#0A0A0A',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: MONO,
        fontSize: '12px',
        fontWeight: '600',
      }}
    >
      E
    </span>
    {SITE.name}
  </>
);

interface Props {
  /** Ana sayfada logo sayfa başına kaydırır (#top); diğer sayfalarda ana sayfaya gider. */
  home?: boolean;
  /** Sağdaki bağlantılar. */
  children: ReactNode;
}

/** Yapışkan üst menü: sarı "E" logosu + isim solda, `children` sağda. */
export function SiteHeader({ home, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  // Menü dar ekranda iki satıra sarılabilir; yapışkan hero sahnesi (responsive.css) yüksekliği `--hdr` ile alır.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty('--hdr', `${el.offsetHeight}px`);
    set();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header
      ref={ref}
      style={{
        position: 'sticky',
        top: '0',
        zIndex: '30',
        background: 'rgba(10,10,10,.78)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid #1F1F1F',
      }}
    >
      <nav
        aria-label="Ana menü"
        className="site-nav"
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: `0 ${GUTTER}`,
          minHeight: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {home ? (
          <a href="#top" style={logoStyle}>
            {logoContent}
          </a>
        ) : (
          <Link to="/" style={logoStyle}>
            {logoContent}
          </Link>
        )}
        <div
          className="site-nav-links"
          style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', fontSize: '14px' }}
        >
          {children}
        </div>
      </nav>
    </header>
  );
}
