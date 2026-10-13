import '../../styles/project.css';
import { PageShell } from '../../components/PageShell';
import { SiteFooter } from '../../components/SiteFooter';
import { ScrollHint } from '../../components/project/HeroParts';
import { NextProject } from '../../components/project/NextProject';
import { ProjectHeader } from '../../components/project/ProjectHeader';
import { ProjectHero } from '../../components/project/ProjectHero';
import { ProjectMeta } from '../../components/project/ProjectMeta';
import { StorySection } from '../../components/project/StorySection';
import { EV_FIYAT as C } from '../../data/projectPages';
import { usePageTitle } from '../../hooks/usePageTitle';
import { createHousesScene, housesStageOptions } from '../../scenes/housesScene';
import { GUTTER, MONO } from '../../styles/type';

/** Her evin kartı: sahne o eve ulaşınca karar (metin, renk, çerçeve) belirir. */
const VERDICTS = [
  ['%12 pahalı', '#C9C6BE', '#3A3A40'],
  ['Piyasa değerinde', '#C9C6BE', '#3A3A40'],
  ['%12 uygun · bulundu', '#FFD60A', '#FFD60A'],
] as const;

const PHASES = [
  'SOKAĞA GİRİŞ · 3 İLAN',
  'EV 01 · İLAN VE TAHMİN KARŞILAŞTIRILIYOR',
  'EV 02 · İLAN VE TAHMİN KARŞILAŞTIRILIYOR',
  'UYGUN FİYATLI EV BULUNDU',
];

function HeroBottom({ stage, noScroll }: { stage: number; noScroll: boolean }) {
  const houses = [0, 1, 2].map((i) => {
    const on = stage >= i + 1;
    return {
      n: 'EV 0' + (i + 1),
      v: on ? VERDICTS[i][0] : 'inceleniyor…',
      c: on ? VERDICTS[i][1] : '#6A6862',
      bd: on ? VERDICTS[i][2] : '#2A2A2E',
    };
  });
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <span style={{ fontFamily: MONO, fontSize: '12px', color: '#8A877F', letterSpacing: '.04em' }}>
          {PHASES[stage] || PHASES[0]}
        </span>
        <ol
          style={{
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          {houses.map((h) => (
            <li
              key={h.n}
              style={{
                minWidth: '170px',
                border: `1px solid ${h.bd}`,
                background: 'rgba(10,10,10,.72)',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: '11px', color: '#8A877F' }}>{h.n}</span>
              <span style={{ fontSize: '18px', letterSpacing: '-0.02em', color: h.c }}>{h.v}</span>
            </li>
          ))}
        </ol>
      </div>
      <ScrollHint prefix="örnek veri · " hint={noScroll ? 'Otomatik oynatılıyor' : 'Kaydır, evleri gez'} />
    </>
  );
}

export default function EvFiyat() {
  usePageTitle(`${C.title.lead} ${C.title.italic} — Vaka çalışması`);
  return (
    <PageShell>
      <ProjectHeader caseNo={C.caseNo} />
      <ProjectHero
        scene={createHousesScene}
        options={housesStageOptions}
        scrollHeight="2800px"
        label={C.canvasLabel}
        eyebrow={C.eyebrow}
        title={C.title}
        titleMaxWidth={760}
        lead={C.lead}
        bottom={({ stage, noScroll }) => <HeroBottom stage={stage} noScroll={noScroll} />}
      />
      <ProjectMeta items={C.meta} padding={`88px ${GUTTER} 40px`} valueSize="16px" />
      <StorySection items={C.story} />
      <NextProject {...C.next} />
      <SiteFooter variant="page" />
    </PageShell>
  );
}
