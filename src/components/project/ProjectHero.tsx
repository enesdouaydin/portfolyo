import type { ReactNode } from 'react';
import type { SceneFactory, StageOptions } from '../../scenes/types';
import { HeroStage } from '../HeroStage';

interface Props {
  scene: SceneFactory;
  options: StageOptions;
  scrollHeight: string;
  /** Tuval için ekran okuyucu açıklaması. */
  label: string;
  /** Üstte ve altta metni okunur kılan dikey degrade. */
  scrim?: string;
  /** "Vaka çalışması 01 · …" satırı. */
  eyebrow: string;
  /** `lead` beyaz, `italic` amber vurgu olarak yazılır. */
  title: { lead: string; italic: string };
  /** Başlık sütununun en geniş hali (px). */
  titleMaxWidth: number;
  lead: string;
  /** Alt satır: sayaçlar, sohbet satırları, ipucu. */
  bottom: (state: { stage: number; noScroll: boolean }) => ReactNode;
}

const DEFAULT_SCRIM =
  'linear-gradient(180deg,rgba(12,10,9,.92) 0%,rgba(12,10,9,.45) 24%,rgba(12,10,9,0) 42%,rgba(12,10,9,0) 64%,rgba(12,10,9,.9) 100%)';

/** Proje sayfalarının 3D hero'su: sahne + degrade + başlık/özet bloğu + sahneye bağlı alt satır. */
export function ProjectHero({
  scene,
  options,
  scrollHeight,
  label,
  scrim = DEFAULT_SCRIM,
  eyebrow,
  title,
  titleMaxWidth,
  lead,
  bottom,
}: Props) {
  return (
    <HeroStage scene={scene} options={options} scrollHeight={scrollHeight} label={label}>
      {(state) => (
        <>
          <div aria-hidden="true" className="hero-scrim" style={{ background: scrim }} />
          <div className="hero-overlay hero-overlay--project">
            <div className="project-hero-top">
              <div className="hero-copy" style={{ maxWidth: `${titleMaxWidth}px` }}>
                <span className="eyebrow rise">{eyebrow}</span>
                <h1 className="display hero-h1 project-h1 rise d1">
                  {title.lead} <span className="hl">{title.italic}</span>
                </h1>
              </div>
              <p className="hero-lead project-lead rise d2">{lead}</p>
            </div>
            <div className="hero-foot">{bottom(state)}</div>
          </div>
        </>
      )}
    </HeroStage>
  );
}
