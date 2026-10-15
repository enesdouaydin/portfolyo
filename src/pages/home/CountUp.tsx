import { useEffect, useRef, useState } from 'react';

/**
 * Ekrana girince sıfırdan hedef sayıya sayar ("~2", "150" gibi; baştaki sayı dışı işaretler korunur).
 * JS yoksa, hareket azaltılmışsa ya da sayı okunamazsa doğrudan son değer görünür.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const match = /^(\D*)(\d+)$/.exec(value);
  const target = match ? parseInt(match[2], 10) : NaN;
  const lead = match ? match[1] : '';
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || Number.isNaN(target) || reduce) return;
    setShown(lead + '0');
    let raf = 0;
    let started = false;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - k, 3);
        setShown(lead + Math.round(target * eased));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const check = () => {
      if (started || el.getBoundingClientRect().top > window.innerHeight * 0.9) return;
      started = true;
      window.removeEventListener('scroll', check);
      run();
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', check);
    };
  }, [target, lead, duration]);

  return (
    <span ref={ref} className="countup">
      {shown}
    </span>
  );
}
