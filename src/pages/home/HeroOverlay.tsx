import { GROUPS, PAIRS } from '../../data/home';
import { SITE } from '../../data/site';

interface Props {
  /** Kılıcın iki yanında gösterilen teknoloji çiftinin sırası (sahne bunu üretir). */
  stage: number;
  /** Kaydırma olmadan otomatik oynuyorsa true. */
  noScroll: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

const ArrowDown = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

/** 3D sahnenin üstündeki metin katmanı: başlık, düğmeler ve kılıçtaki teknoloji sayacı. */
export function HeroOverlay({ stage, noScroll }: Props) {
  const [left, right, group] = PAIRS[stage];
  return (
    <>
      <div aria-hidden="true" className="hero-scrim" />
      <div className="hero-overlay">
        <div className="hero-copy">
          <span className="eyebrow rise">{SITE.name} · Software Developer · AI Engineer</span>
          <h1 className="display hero-h1 rise d1">
            <span>Konuşan ajanlar,</span>
            <span>kısalan rotalar,</span>
            <span>
              <span className="dim">çalışan</span> <span className="hl">sistemler.</span>
            </span>
          </h1>
          <p className="hero-lead rise d2">
            Go, Python ve TypeScript ile <strong>AI agent sistemleri</strong>, mikroservis backend'ler ve
            uçtan uca ürünler geliştiriyorum.
          </p>
          <div className="hero-actions rise d3">
            <a href="#isler" className="pill pill--accent">
              Seçili işler <ArrowDown />
            </a>
            <a href={SITE.github} className="pill">
              GitHub
            </a>
          </div>
        </div>

        <div className="hero-foot">
          <div className="hero-pair">
            <span className="mono hero-pair-count">
              KILICIN İKİ YANINDA · {pad(stage + 1)} / {PAIRS.length}
            </span>
            <span className="hero-pair-now">
              {left}
              <span className="amp">&amp;</span>
              {right}
            </span>
            <ol className="hero-groups">
              {GROUPS.map((g, i) => (
                <li key={g} className={i === group ? 'on' : i < group ? 'done' : undefined}>
                  {pad(i + 1)} {g}
                </li>
              ))}
            </ol>
          </div>
          <span className="hero-hint">
            {noScroll ? 'Otomatik oynatılıyor' : 'Kaydır, dönsün'}
            <ArrowDown />
          </span>
        </div>
      </div>
    </>
  );
}
