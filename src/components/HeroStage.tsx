import { useEffect, useRef, useState, type ReactNode } from 'react';
import { startScrollScene } from '../scenes/runtime';
import type { SceneFactory, StageOptions } from '../scenes/types';

interface Props {
  /** Bölümün `id`'si (ana sayfada `top`). */
  id?: string;
  scene: SceneFactory;
  options: StageOptions;
  /** Kaydırmayla oynayan hero'nun toplam yüksekliği (ör. '3000px'). */
  scrollHeight: string;
  /** Tuval için ekran okuyucu açıklaması. */
  label: string;
  /** Sahnenin üstündeki HTML katmanı. `stage` sahnenin döndürdüğü aşama, `noScroll` otomatik oynatma modu. */
  children: (state: { stage: number; noScroll: boolean }) => ReactNode;
}

/**
 * 3D hero kabı: yüksek bir bölüm içinde yapışkan, ekran boyunda bir tuval.
 * Kaydırma ilerlemesini three.js sahnesine (`scene`) verir; kaydırılamıyorsa sahne kendi döngüsünde oynar.
 */
export function HeroStage({ id, scene, options, scrollHeight, label, children }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const [noScroll, setNoScroll] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    try {
      const handle = startScrollScene({
        canvas,
        section,
        factory: scene,
        options,
        onStage: setStage,
        onNoScroll: () => setNoScroll(true),
      });
      return handle.dispose;
    } catch (e) {
      if (window.console) console.warn('3d init failed', e);
    }
  }, [scene, options]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="hero-stage"
      data-noscroll={noScroll || undefined}
      style={{
        position: 'relative',
        height: noScroll ? 'min(100vh,920px)' : scrollHeight,
        background: '#0A0A0A',
        borderBottom: '1px solid #1F1F1F',
      }}
    >
      <div
        className="hero-sticky"
        style={{ position: 'sticky', top: '0', height: 'min(100vh,920px)', overflow: 'hidden' }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={label}
          style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }}
        />
        {children({ stage, noScroll })}
      </div>
    </section>
  );
}
