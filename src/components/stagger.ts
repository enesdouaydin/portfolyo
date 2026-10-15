import type { CSSProperties } from 'react';

/** Art arda beliren öğeler için kademeli gecikme (site.css: `.reveal` → `--d`). */
export const stagger = (i: number, step = 0.08) => ({ '--d': `${(i * step).toFixed(2)}s` }) as CSSProperties;
