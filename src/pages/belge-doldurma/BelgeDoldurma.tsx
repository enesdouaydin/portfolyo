import '../../styles/project.css';
import { PageShell } from '../../components/PageShell';
import { SiteFooter } from '../../components/SiteFooter';
import { FlowSection } from '../../components/project/FlowSection';
import { ScrollHint, StageChips } from '../../components/project/HeroParts';
import { NextProject } from '../../components/project/NextProject';
import { ProjectHeader } from '../../components/project/ProjectHeader';
import { ProjectHero } from '../../components/project/ProjectHero';
import { ProjectMeta } from '../../components/project/ProjectMeta';
import { StorySection } from '../../components/project/StorySection';
import { BELGE_DOLDURMA_FLOW } from '../../data/belgeFlow';
import { BELGE_DOLDURMA as C } from '../../data/projectPages';
import { usePageTitle } from '../../hooks/usePageTitle';
import { createDocScene, docStageOptions } from '../../scenes/docScene';
import { GUTTER } from '../../styles/type';

/** Her aşamada hero'nun altında görünen tek cümlelik açıklama (sahnenin `stage` değerine göre). */
const DESCRIPTIONS = [
  'Daha önce doldurulmuş proje belgeleri arşivde duruyor.',
  'VLM belgeyi sayfa sayfa okuyor ve başlıklarına ayırıyor; iş Google Cloud sanal makinelerinde çalışıyor.',
  'Başlıklar, bağlı oldukları başlığa göre Qdrant vektör veritabanına kaydediliyor.',
  'Yeni boş form yükleniyor; sistem kategoriye göre formatı belirleyip proje bilgi kutusunu dolduruyor.',
  'Her soru için konuyla ilgili önceden doldurulmuş belge parçası getirilip yanıt yazılıyor.',
  'Tüm sorular dolunca sayfalar tek tek geçilerek kontrol ediliyor.',
  'Metin kutulu ajan, “şurayı düzelt, bunu ekle” komutlarını soru bazında uyguluyor.',
];

const CHIP_LABELS = [
  '01 VLM OKUMA',
  '02 QDRANT',
  '03 YENİ FORM',
  '04 SORU SORU',
  '05 KONTROL',
  '06 DÜZELTME',
];

function HeroBottom({ stage, noScroll }: { stage: number; noScroll: boolean }) {
  const act = Math.max(0, stage - 1);
  const chips = CHIP_LABELS.map((lb, i) => {
    const on = stage >= 1 && i === act;
    const done = i < act;
    return {
      label: lb,
      border: on ? '#F0B54A' : done ? '#6A6862' : '#2F2F34',
      background: on ? 'rgba(240, 181, 74,.14)' : 'rgba(12, 10, 9,.6)',
      color: on ? '#F2EBDF' : done ? '#C9C6BE' : '#8A877F',
    };
  });
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '780px' }}>
        <StageChips chips={chips} />
        <p
          style={{
            margin: '0',
            fontSize: 'clamp(18px,1.8vw,24px)',
            lineHeight: '1.4',
            letterSpacing: '-0.015em',
            color: '#F2EBDF',
            background: 'rgba(12, 10, 9,.6)',
            padding: '4px 0',
          }}
        >
          {DESCRIPTIONS[stage] || DESCRIPTIONS[0]}
        </p>
      </div>
      <ScrollHint prefix="örnek veri · " hint={noScroll ? 'Otomatik oynatılıyor' : 'Kaydır, form dolsun'} />
    </>
  );
}

export default function BelgeDoldurma() {
  usePageTitle(`${C.title.lead} ${C.title.italic} — Vaka çalışması`);
  return (
    <PageShell>
      <ProjectHeader caseNo={C.caseNo} />
      <ProjectHero
        scene={createDocScene}
        options={docStageOptions}
        scrollHeight="3600px"
        label={C.canvasLabel}
        eyebrow={C.eyebrow}
        title={C.title}
        titleMaxWidth={760}
        lead={C.lead}
        bottom={({ stage, noScroll }) => <HeroBottom stage={stage} noScroll={noScroll} />}
      />
      <ProjectMeta items={C.meta} padding={`88px ${GUTTER} 40px`} valueSize="16px" />
      <StorySection items={C.story} />
      <FlowSection data={BELGE_DOLDURMA_FLOW} />
      <NextProject {...C.next} />
      <SiteFooter variant="page" />
    </PageShell>
  );
}
