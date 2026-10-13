import { GUTTER } from '../../styles/type';
import '../../styles/project.css';
import './bayi-rota.css';
import { PageShell } from '../../components/PageShell';
import { SiteFooter } from '../../components/SiteFooter';
import { NextProject } from '../../components/project/NextProject';
import { ProjectHeader } from '../../components/project/ProjectHeader';
import { ProjectHero } from '../../components/project/ProjectHero';
import { ProjectMeta } from '../../components/project/ProjectMeta';
import { usePageTitle } from '../../hooks/usePageTitle';
import { ROUTES } from '../../routes';
import { createRouteScene, routeStageOptions } from '../../scenes/routeScene';
import { ArchitectureSection } from './ArchitectureSection';
import { BayiRotaHeroBottom } from './hero';
import { MediaPanel } from './MediaPanel';
import { ResultSection } from './ResultSection';

const SCRIM =
  'linear-gradient(180deg,rgba(10,10,10,.9) 0%,rgba(10,10,10,.45) 26%,rgba(10,10,10,0) 46%,rgba(10,10,10,0) 70%,rgba(10,10,10,.85) 100%)';

export default function BayiRota() {
  usePageTitle('Bayi Rota Optimizasyonu — Vaka çalışması');
  return (
    <PageShell>
      <ProjectHeader caseNo="01" />
      <ProjectHero
        scene={createRouteScene}
        options={routeStageOptions}
        scrollHeight="2800px"
        label="3D şehir modelinde bir aracın rota üzerinden bayileri sırayla ziyaret edip hedefe varması"
        scrim={SCRIM}
        eyebrow="Vaka çalışması 01 · Optimizasyon · Full-stack"
        title={{ lead: 'Bayi Rota', italic: 'Optimizasyonu' }}
        titleMaxWidth={720}
        lead="Saha satış temsilcilerinin bayilerini bölgelere kümeleyip rotalayan sistem. Kâğıt üzerinde bir hafta süren planlama artık 10 saniye."
        bottom={({ stage, noScroll }) => <BayiRotaHeroBottom visited={stage} noScroll={noScroll} />}
      />
      <ProjectMeta
        padding={`72px ${GUTTER} 72px`}
        valueSize="15px"
        items={[
          { label: 'ROL', value: 'Backend, frontend, UI/UX, DevOps' },
          { label: 'EKİP', value: '2 kişi', padding: '16px 0' },
          { label: 'DÖNEM', value: '2025 — bugün' },
        ]}
      />
      <MediaPanel />
      <ResultSection />
      <ArchitectureSection />
      <NextProject
        to={ROUTES.sesliAsistan}
        eyebrow="Sıradaki · 02"
        title={{ lead: 'Sesli Müşteri', italic: 'Asistanı' }}
        borderTop={false}
      />
      <SiteFooter variant="page" />
    </PageShell>
  );
}
