import { GUTTER } from '../../styles/type';
import '../../styles/project.css';
import { PageShell } from '../../components/PageShell';
import { SiteFooter } from '../../components/SiteFooter';
import { ScrollHint, StageChips } from '../../components/project/HeroParts';
import { NextProject } from '../../components/project/NextProject';
import { ProjectHeader } from '../../components/project/ProjectHeader';
import { ProjectHero } from '../../components/project/ProjectHero';
import { ProjectMeta } from '../../components/project/ProjectMeta';
import { StorySection } from '../../components/project/StorySection';
import { KDV_IADE as C } from '../../data/projectPages';
import { usePageTitle } from '../../hooks/usePageTitle';
import { createInvoiceScene, invoiceStageOptions } from '../../scenes/invoiceScene';

/** Her aşamada hero'nun altında görünen tek cümlelik açıklama. */
const DESCRIPTIONS = [
  'Telefon kamerası faturayı çerçeveye alıyor.',
  'OCR faturayı satır satır okuyor.',
  'Satıcı, tarih, matrah, KDV ve toplam alanları çıkarıldı.',
  'Fatura kestirilen (alış) olduğu için gelen faturalara gitti; KDV’si indirilecek KDV’ye eklendi.',
  'Dönemdeki gelen ve giden faturaların KDV’si karşılaştırılıyor.',
  'İade edilecek tutar hesaplandı, iade dosyası hazır.',
];

const CHIP_LABELS = ['01 OKUT', '02 ALANLAR', '03 GELEN / GİDEN', '04 KDV HESABI', '05 İADE DOSYASI'];

function HeroBottom({ stage, noScroll }: { stage: number; noScroll: boolean }) {
  const act = Math.max(0, stage - 1);
  const chips = CHIP_LABELS.map((lb, i) => {
    const on = stage >= 1 && i === act;
    const done = i < act;
    return { label: lb, state: on ? 'on' : done ? 'done' : undefined } as const;
  });
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '640px' }}>
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
      <ScrollHint
        prefix="örnek veri · "
        hint={noScroll ? 'Otomatik oynatılıyor' : 'Kaydır, fatura işlensin'}
      />
    </>
  );
}

export default function KdvIade() {
  usePageTitle(`${C.title.lead} ${C.title.italic} — Vaka çalışması`);
  return (
    <PageShell>
      <ProjectHeader caseNo={C.caseNo} />
      <ProjectHero
        scene={createInvoiceScene}
        options={invoiceStageOptions}
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
      <NextProject {...C.next} />
      <SiteFooter variant="page" />
    </PageShell>
  );
}
