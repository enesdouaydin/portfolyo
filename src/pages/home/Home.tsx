import './home.css';
import { ContactPill, SiteHeader } from '../../components/SiteHeader';
import { HeroStage } from '../../components/HeroStage';
import { PageShell } from '../../components/PageShell';
import { usePageTitle } from '../../hooks/usePageTitle';
import { createHeroScene, heroStageOptions } from '../../scenes/heroScene';
import { HeroOverlay } from './HeroOverlay';
import { StatementSection } from './StatementSection';
import { WorkSection } from './WorkSection';
import { ExperienceSection } from './ExperienceSection';
import { CapabilitiesSection } from './CapabilitiesSection';
import { ContactSection } from './ContactSection';

const HERO_LABEL =
  'Çift uçlu ışık kılıcı tutan 3D bir karakter; sayfa kaydırıldıkça dönüyor ve kılıç uçlarında teknolojiler beliriyor';

export default function Home() {
  usePageTitle('Enes Dou Aydın — Portfolyo');
  return (
    <PageShell>
      <SiteHeader home>
        <a className="nl" href="#isler">
          İşler
        </a>
        <a className="nl" href="#deneyim">
          Deneyim
        </a>
        <a className="nl" href="#yetkinlik">
          Yetkinlikler
        </a>
        <ContactPill href="#iletisim" />
      </SiteHeader>
      <HeroStage
        id="top"
        scene={createHeroScene}
        options={heroStageOptions}
        scrollHeight="3500px"
        label={HERO_LABEL}
      >
        {({ stage, noScroll }) => <HeroOverlay stage={stage} noScroll={noScroll} />}
      </HeroStage>
      <StatementSection />
      <WorkSection />
      <ExperienceSection />
      <CapabilitiesSection />
      <ContactSection />
    </PageShell>
  );
}
