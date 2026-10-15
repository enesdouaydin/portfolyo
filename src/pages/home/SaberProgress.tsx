import { useEffect, useRef } from 'react';

/** Sayfanın en üstünde kabzalı ışın kılıcı; aşağı kaydırdıkça bıçağı uzar. */
export function SaberProgress() {
  const blade = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = blade.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const k = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${k})`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div className="saber-progress" aria-hidden="true">
      <span className="saber-progress-hilt" />
      <div ref={blade} className="saber-progress-blade" />
    </div>
  );
}
