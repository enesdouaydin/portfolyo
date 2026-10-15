import { EXPERIENCE } from '../../data/profile';
import { SectionHead } from './SectionHead';

/** Deneyim: sarı bant üzerinde zaman çizelgesi. */
export function ExperienceSection() {
  return (
    <section id="deneyim" className="section experience" aria-labelledby="deneyim-baslik">
      <div className="wrap">
        <SectionHead
          id="deneyim-baslik"
          num="02"
          title="Nerelerde çalıştım"
          lead="AI agent sistemlerinden sahada her gün kullanılan optimizasyon sistemlerine."
        />
        <ol className="timeline">
          {EXPERIENCE.map((e) => (
            <li key={e.title} className="reveal">
              <span className="tl-period">{e.period}</span>
              <span className="tl-role">
                <span className="display tl-title">{e.title}</span>
                <span className="tl-org">{e.org}</span>
              </span>
              <p className="tl-text">{e.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
