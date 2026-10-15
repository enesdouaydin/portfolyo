import type { ReactNode } from 'react';

/** Küçük üst başlık: solda ince çizgi, yanında mono yazı (site.css: .eyebrow). */
export function Eyebrow({ children, wrap }: { children: ReactNode; wrap?: boolean }) {
  return <span className={wrap ? 'eyebrow eyebrow--wrap' : 'eyebrow'}>{children}</span>;
}
