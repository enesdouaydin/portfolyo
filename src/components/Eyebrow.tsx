import type { ReactNode } from 'react';
import { MONO } from '../styles/type';

/** Küçük üst başlık: solda ince çizgi, yanında mono yazı. */
export function Eyebrow({ children, wrap }: { children: ReactNode; wrap?: boolean }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: '13px',
        color: '#A8A59D',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        ...(wrap ? { flexWrap: 'wrap' } : null),
      }}
    >
      <span style={{ width: '24px', height: '1px', background: '#6A6862', display: 'inline-block' }} />
      {children}
    </span>
  );
}
