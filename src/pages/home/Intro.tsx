import { useEffect, useState } from 'react';

const KEY = 'intro-seen';

/**
 * Açılış: kırmızı ışın kılıcı ekranı yatay keser, ekran ikiye ayrılır ve sayfa görünür.
 * Oturum başına bir kez; tıklayınca ya da bir tuşa basınca atlanır; hareket azaltılmışsa hiç gösterilmez.
 */
export function Intro() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      return !sessionStorage.getItem(KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* depolama kapalı: her açılışta gösterilir */
    }
    const done = () => setShow(false);
    const timer = window.setTimeout(done, 1700);
    window.addEventListener('keydown', done, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', done);
    };
  }, [show]);

  if (!show) return null;
  return (
    <div className="intro" aria-hidden="true" onClick={() => setShow(false)}>
      <div className="intro-half intro-half--top">
        <span className="intro-word">ENES</span>
      </div>
      <div className="intro-half intro-half--bottom">
        <span className="intro-word">ENES</span>
      </div>
      <div className="intro-blade" />
    </div>
  );
}
