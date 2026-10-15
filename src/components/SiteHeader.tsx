import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../data/site';

/** Sağdaki sarı "İletişim" hapı. Ana sayfada sayfa içi bağlantı, proje sayfalarında e-posta. */
export function ContactPill({ href }: { href: string }) {
  return (
    <a href={href} className="pill pill--accent pill--sm">
      İletişim
    </a>
  );
}

const logo = (
  <>
    <span className="site-logo-mark" aria-hidden="true">
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

/** Yapışkan üst menü: logo solda, `children` sağda. */
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
    <header ref={ref} className="site-header">
      <nav aria-label="Ana menü" className="site-nav">
        {home ? (
          <a href="#top" className="site-logo">
            {logo}
          </a>
        ) : (
          <Link to="/" className="site-logo">
            {logo}
          </Link>
        )}
        <div className="site-nav-links">{children}</div>
      </nav>
    </header>
  );
}
