import { useEffect } from 'react';

/**
 * `.reveal` sınıflı öğeler ekranın alt kısmına ulaşınca (ya da çoktan geçilmişse) `.is-in` alır
 * ve home.css'te yumuşakça belirir. Hızlı kaydırmada ya da menüden bir bölüme atlayınca
 * arada kalan öğeler de açılır; hiçbir şey gizli kalmaz.
 *
 * Gizleme yalnızca bu hook çalışınca `<html>`'e eklenen `.js-reveal` ile devreye girer;
 * JS yoksa her şey baştan görünür. Sonradan eklenen öğeler (ör. filtreyle gelen kartlar) de yakalanır.
 */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js-reveal');

    let pending: Element[] = [];
    let raf = 0;
    const collect = () => {
      pending = Array.from(document.querySelectorAll('.reveal:not(.is-in)'));
    };
    const check = () => {
      raf = 0;
      const line = window.innerHeight * 0.92;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top > line) return true;
        el.classList.add('is-in');
        return false;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    collect();
    check();
    const mo = new MutationObserver(() => {
      collect();
      schedule();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      root.classList.remove('js-reveal');
    };
  }, []);
}
