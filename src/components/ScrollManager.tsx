import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Rota değişince en üste (ya da #hash varsa o bölüme) kaydırır.
 * Geri/ileri gezintisinde (POP) tarayıcının kendi kaydırma konumunu bozmaz.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    if (navType !== 'POP') window.scrollTo(0, 0);
  }, [pathname, hash, navType]);
  return null;
}
