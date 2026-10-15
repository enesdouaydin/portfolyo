import '../../styles/project.css';
import { PageShell } from '../../components/PageShell';
import { SiteFooter } from '../../components/SiteFooter';
import { FlowSection } from '../../components/project/FlowSection';
import { HeroStat, ScrollHint, StageChips, Unit } from '../../components/project/HeroParts';
import { NextProject } from '../../components/project/NextProject';
import { ProjectHeader } from '../../components/project/ProjectHeader';
import { ProjectHero } from '../../components/project/ProjectHero';
import { ProjectMeta } from '../../components/project/ProjectMeta';
import { StorySection } from '../../components/project/StorySection';
import { SESLI_ASISTAN as C } from '../../data/projectPages';
import { usePageTitle } from '../../hooks/usePageTitle';
import { createVoiceScene, voiceStageOptions } from '../../scenes/voiceScene';
import { GUTTER, MONO } from '../../styles/type';
import { SESLI_ASISAN_FLOW } from '../../data/sesliFlow';

/** Örnek görüşme: sahnenin `stage` değeri `at`'e ulaşınca satır görünür; en son iki satır gösterilir. */
const TRANSCRIPT = [
  { who: 'MÜŞTERİ', text: 'Merhaba, dün verdiğim sipariş ne zaman gelir?', at: 1, c: '#ab9f8e' },
  {
    who: 'ASİSTAN',
    text: 'Kontrol ediyorum. Siparişiniz bugün kargoya verildi, yarın teslim edilecek.',
    at: 3,
    c: '#F0B54A',
  },
  { who: 'MÜŞTERİ', text: 'Teslimat adresini değiştirebilir miyim?', at: 4, c: '#ab9f8e' },
  {
    who: 'ASİSTAN',
    text: 'Elbette. Yeni adresinizi söyler misiniz? Kargo firmasına hemen ileteyim.',
    at: 5,
    c: '#F0B54A',
  },
];

const CHIP_LABELS = ['ARAMA', 'STT', 'AGENT · RAG', 'TTS'];

function HeroBottom({ stage, noScroll }: { stage: number; noScroll: boolean }) {
  const lines = TRANSCRIPT.filter((l) => stage >= l.at).slice(-2);
  const act =
    stage === 0 ? 0 : stage === 1 || stage === 4 ? 1 : stage === 2 ? 2 : stage === 3 || stage === 5 ? 3 : -1;
  const chips = CHIP_LABELS.map((lb, i) => {
    const on = i === act;
    return { label: (i ? '→ ' : '') + lb, state: on ? 'on' : undefined } as const;
  });
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '620px' }}>
        <StageChips chips={chips} />
        <ul
          style={{
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {lines.map((l) => (
            <li
              key={l.at}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'baseline',
                background: 'rgba(12, 10, 9,.72)',
                border: '1px solid #2b241e',
                borderRadius: '12px',
                padding: '10px 14px',
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: '11px', color: l.c, flex: '0 0 70px' }}>
                {l.who}
              </span>
              <span style={{ fontSize: '16px', lineHeight: '1.45', color: '#F2EBDF' }}>{l.text}</span>
            </li>
          ))}
        </ul>
      </div>
      {stage >= 6 ? (
        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
          <HeroStat
            value={
              <>
                ~2 <Unit>sn</Unit>
              </>
            }
            label="STT → agent → TTS"
          />
          <HeroStat value="~10" label="ajanlı sistem" />
        </div>
      ) : (
        <ScrollHint
          prefix="örnek görüşme · "
          hint={noScroll ? 'Otomatik oynatılıyor' : 'Kaydır, görüşme ilerlesin'}
        />
      )}
    </>
  );
}

export default function SesliAsistan() {
  usePageTitle(`${C.title.lead} ${C.title.italic} — Vaka çalışması`);
  return (
    <PageShell>
      <ProjectHeader caseNo={C.caseNo} />
      <ProjectHero
        scene={createVoiceScene}
        options={voiceStageOptions}
        scrollHeight="3000px"
        label={C.canvasLabel}
        eyebrow={C.eyebrow}
        title={C.title}
        titleMaxWidth={760}
        lead={C.lead}
        bottom={({ stage, noScroll }) => <HeroBottom stage={stage} noScroll={noScroll} />}
      />
      <ProjectMeta items={C.meta} padding={`88px ${GUTTER} 40px`} valueSize="16px" />
      <StorySection items={C.story} />
      <FlowSection data={SESLI_ASISAN_FLOW} />
      <NextProject {...C.next} />
      <SiteFooter variant="page" />
    </PageShell>
  );
}
