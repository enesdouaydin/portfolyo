import { CAPABILITY_GROUPS } from '../../data/profile';
import { SectionHead } from '../../components/SectionHead';
import { stagger } from '../../components/stagger';

/** Yetkinlikler: iki grup, her alan bir satır; araçlar düz metin olarak okunur. */
export function CapabilitiesSection() {
  return (
    <section id="yetkinlik" className="section" aria-labelledby="yetkinlik-baslik">
      <div className="wrap">
        <SectionHead
          id="yetkinlik-baslik"
          num="03"
          title="Neyle çalışıyorum"
          lead="Yapay zekânın her katmanında: veriden modele, modelden sahada çalışan uygulamaya."
        />
        <div className="skills">
          {CAPABILITY_GROUPS.map((g, gi) => (
            <article key={g.label} className="skill-group reveal" style={stagger(gi, 0.12)}>
              <header className="skill-group-head">
                <h3 className="display">{g.title}</h3>
                <span className="mono">{g.count}</span>
              </header>
              <ul className="skill-list">
                {g.cards.map((c) => (
                  <li key={c.title}>
                    <span className="skill-name">
                      {c.title}
                      {c.desc && <small>{c.desc}</small>}
                    </span>
                    <p className="skill-tags">
                      {c.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
