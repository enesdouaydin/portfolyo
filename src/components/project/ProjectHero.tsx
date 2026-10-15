import type { ReactNode } from 'react';
import type { SceneFactory, StageOptions } from '../../scenes/types';
import { GUTTER, serifItalic } from '../../styles/type';
import { Eyebrow } from '../Eyebrow';
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
  title: { lead: string; italic: string };
  /** Başlık sütununun en geniş hali (px). */
  titleMaxWidth: number;
  lead: string;
  /** Alt satır: sayaçlar, sohbet satırları, ipucu. */
  bottom: (state: { stage: number; noScroll: boolean }) => ReactNode;
}

const DEFAULT_SCRIM =
  'linear-gradient(180deg,rgba(12, 10, 9,.9) 0%,rgba(12, 10, 9,.4) 24%,rgba(12, 10, 9,0) 42%,rgba(12, 10, 9,0) 66%,rgba(12, 10, 9,.88) 100%)';

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
          <div
            aria-hidden="true"
            className="hero-scrim"
            style={{ position: 'absolute', inset: '0', background: scrim, pointerEvents: 'none' }}
          />
          <div
            className="hero-overlay"
            style={{
              position: 'absolute',
              inset: '0',
              maxWidth: '1360px',
              margin: '0 auto',
              padding: `108px ${GUTTER} 36px`,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '24px 64px',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
              }}
            >
              <div
                className="hero-copy"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  maxWidth: `${titleMaxWidth}px`,
                }}
              >
                <Eyebrow wrap>{eyebrow}</Eyebrow>
                <h1
                  className="hero-h1"
                  style={{
                    margin: '0',
                    fontWeight: '500',
                    fontSize: 'clamp(44px,6vw,96px)',
                    lineHeight: '.94',
                    letterSpacing: '-0.05em',
                  }}
                >
                  {title.lead} <span style={serifItalic}>{title.italic}</span>
                </h1>
              </div>
              <p
                className="hero-lead"
                style={{
                  margin: '0',
                  maxWidth: '380px',
                  fontSize: '16px',
                  lineHeight: '1.55',
                  color: '#A8A59D',
                  paddingTop: '8px',
                }}
              >
                {lead}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              {bottom(state)}
            </div>
          </div>
        </>
      )}
    </HeroStage>
  );
}
