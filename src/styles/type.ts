import type { CSSProperties } from 'react';

export const SANS = "'Geist',ui-sans-serif,system-ui,sans-serif";
export const MONO = "'Geist Mono',ui-monospace,monospace";
export const SERIF = "'Instrument Serif',Georgia,serif";

/** Sayfa yan boşluğu: 32px, telefonda 20px (`--gutter`, responsive.css). */
export const GUTTER = 'var(--gutter)';

/** Bölüm dikey boşluğu: ≥1024px genişlikte `px`, daha dar ekranlarda orantılı küçülür (en az %55). */
export const fluid = (px: number) => `clamp(${Math.round(px * 0.55)}px,${(px / 10.24).toFixed(2)}vw,${px}px)`;

/** Başlıklardaki vurgu kelimesi: Instrument Serif italik. */
export const serifItalic: CSSProperties = {
  fontFamily: SERIF,
  fontStyle: 'italic',
  fontWeight: '400',
  letterSpacing: '-0.02em',
};

/** Bölüm başlığı (h2): Geist 500, -0.05em. */
export const h2Style: CSSProperties = {
  margin: '0',
  fontWeight: '500',
  fontSize: 'clamp(44px,6vw,92px)',
  letterSpacing: '-0.05em',
  lineHeight: '.95',
};
