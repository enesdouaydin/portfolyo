import './home.css';
import { ContactPill, SiteHeader } from '../../components/SiteHeader';
import { HeroStage } from '../../components/HeroStage';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useReveal } from '../../hooks/useReveal';
import { createHeroScene, heroStageOptions } from '../../scenes/heroScene';
import { HeroOverlay } from './HeroOverlay';
import { Ticker } from './Ticker';
import { AboutSection } from './AboutSection';
import { WorkSection } from './WorkSection';
import { ExperienceSection } from './ExperienceSection';
import { CapabilitiesSection } from './CapabilitiesSection';
import { ContactSection } from './ContactSection';
import { CursorGlow } from './CursorGlow';

const HERO_LABEL =
  'Enes’in 3D figürü kırmızı bir ışın kılıcını iki eli arasında çeviriyor; sayfa kaydırıldıkça dönüyor ve kılıcın iki yanında teknolojiler beliriyor';

/**
 * Ana sayfa, yukarıdan aşağıya:
 * hero (3D figür) → teknoloji şeridi → kısaca → 01 işler → 02 deneyim → 03 yetkinlikler → 04 iletişim.
 */
export default function Home() {
  usePageTitle('Enes Dou Aydın — Portfolyo');
  useReveal();
  return (
    <div className="home on">
      <CursorGlow />
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
      <main>
        <HeroStage
          id="top"
          scene={createHeroScene}
          options={heroStageOptions}
          scrollHeight="3500px"
          label={HERO_LABEL}
        >
          {({ stage, noScroll }) => <HeroOverlay stage={stage} noScroll={noScroll} />}
        </HeroStage>
        <Ticker />
        <AboutSection />
        <WorkSection />
        <ExperienceSection />
        <CapabilitiesSection />
        <ContactSection />
      </main>
    </div>
  );
}
