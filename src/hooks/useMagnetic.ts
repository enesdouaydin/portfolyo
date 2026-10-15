import { useEffect } from 'react';

/**
 * Sayfadaki `.pill` butonları fare yaklaşınca ona doğru hafifçe çekilir, uzaklaşınca yerine döner.
 * Yalnızca fareli cihazlarda ve hareket azaltılmamışsa çalışır.
 */
export function useMagnetic(selector = '.pill', radius = 90, strength = 0.32) {
  useEffect(() => {
    const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const update = () => {
      raf = 0;
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        const r = el.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        const reach = radius + Math.max(r.width, r.height) / 2;
        const d = Math.hypot(dx, dy);
        if (d < reach) {
          const k = (1 - d / reach) * strength;
          el.style.translate = `${(dx * k).toFixed(1)}px ${(dy * k).toFixed(1)}px`;
        } else if (el.style.translate) {
          el.style.translate = '';
        }
      });
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => (el.style.translate = ''));
    };
  }, [selector, radius, strength]);
}
