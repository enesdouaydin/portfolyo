import type { ReactNode } from 'react';
import { useMagnetic } from '../hooks/useMagnetic';
import { useReveal } from '../hooks/useReveal';
import { CursorGlow } from './CursorGlow';
import { SaberProgress } from './SaberProgress';

/**
 * Her sayfanın kök kabı: kılıç ilerleme çubuğu, imleç parıltısı, kaydırınca beliren öğeler (`.reveal`)
 * ve mıknatıs butonlar burada açılır. `on` sınıfı sayfa içi SVG animasyonlarını (akış, nabız, çizim) açar.
 */
export function PageShell({ children }: { children: ReactNode }) {
  useReveal();
  useMagnetic();
  return (
    <div className="page on">
      <SaberProgress />
      <CursorGlow />
      {children}
    </div>
  );
}
