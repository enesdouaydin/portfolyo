import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789#%&*+<>/';

/**
 * Üstündeki kart ya da bağlantıya fare gelince yazı karışık harflerden soldan sağa çözülerek yeniden yazılır.
 * Ekran okuyucular hep gerçek metni okur; hareket azaltılmışsa efekt çalışmaz.
 */
export function ScrambleText({ text, trigger = '.card' }: { text: string; trigger?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [chars, setChars] = useState<{ ch: string; hot: boolean }[] | null>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest(trigger);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || !host || reduce) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      const t0 = performance.now();
      const total = 380 + text.length * 18;
      const tick = (now: number) => {
        const k = (now - t0) / total;
        if (k >= 1) {
          setChars(null);
          return;
        }
        const solved = Math.floor(k * text.length * 1.15);
        setChars(
          Array.from(text, (c, i) =>
            i < solved || c === ' '
              ? { ch: c, hot: false }
              : { ch: GLYPHS[(Math.random() * GLYPHS.length) | 0], hot: true },
          ),
        );
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    host.addEventListener('pointerenter', run);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener('pointerenter', run);
    };
  }, [text, trigger]);

  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars
          ? chars.map((c, i) =>
              c.hot ? (
                <span key={i} className="scramble-char">
                  {c.ch}
                </span>
              ) : (
                c.ch
              ),
            )
          : text}
      </span>
    </span>
  );
}
