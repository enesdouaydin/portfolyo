import type { CSSProperties } from 'react';

export const SANS = "'Geist Variable','Geist',ui-sans-serif,system-ui,sans-serif";
export const MONO = "'Geist Mono Variable','Geist Mono',ui-monospace,monospace";
export const SERIF = "'Instrument Serif',Georgia,serif";
/** Başlık yazı tipi (ana sayfa): Bricolage Grotesque, dar genişlikte. */
export const DISPLAY = "'Bricolage Grotesque Variable','Arial Narrow',ui-sans-serif,sans-serif";

/** Sayfa yan boşluğu: 32px, telefonda 20px (`--gutter`, responsive.css). */
export const GUTTER = 'var(--gutter)';

/** Bölüm dikey boşluğu: ≥1024px genişlikte `px`, daha dar ekranlarda orantılı küçülür (en az %55). */
export const fluid = (px: number) => `clamp(${Math.round(px * 0.55)}px,${(px / 10.24).toFixed(2)}vw,${px}px)`;

/** Başlıklardaki vurgu kelimesi: amber (eski tasarımda Instrument Serif italikti). */
export const serifItalic: CSSProperties = {
  color: 'var(--accent)',
};

/** Bölüm başlığı (h2): Bricolage Grotesque, dar ve kalın; site.css'teki `.display` ile aynı. */
export const h2Style: CSSProperties = {
  margin: '0',
  fontFamily: DISPLAY,
  fontWeight: '700',
  fontStretch: '80%',
  fontSize: 'clamp(48px,7vw,104px)',
  letterSpacing: '-0.02em',
  lineHeight: '.92',
  textWrap: 'balance',
};
