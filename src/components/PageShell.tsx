import type { ReactNode } from 'react';
import { SANS } from '../styles/type';

/** Her sayfanın kök kabı. `on` sınıfı sayfa içi SVG animasyonlarını (akış, nabız, çizim) açar. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="on"
      style={{
        fontFamily: SANS,
        color: '#EDEBE6',
        background: '#0A0A0A',
        minHeight: '100%',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {children}
    </div>
  );
}
