import type { PointerEvent } from 'react';
import type { FlowContent } from '../../data/projectPages';
import { SectionHead } from '../SectionHead';
import { stagger } from '../stagger';

/** Fare hangi kartın üstündeyse ışığı ve eğimi oraya taşır (site.css: .card::after, --mx/--my/--rx/--ry). */
export function moveSpotlight(e: PointerEvent<HTMLElement>) {
  const card = (e.target as Element).closest<HTMLElement>('.card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
  const nx = (e.clientX - r.left) / r.width - 0.5;
  const ny = (e.clientY - r.top) / r.height - 0.5;
  card.style.setProperty('--ry', `${(nx * 5).toFixed(2)}deg`);
  card.style.setProperty('--rx', `${(-ny * 5).toFixed(2)}deg`);
}

/** "Nasıl çalışıyor" bölümü: başlık + numaralı adım kartları (koşul → hedef hapları) + üç not. */
export function FlowSection({ data }: { data: FlowContent }) {
  const [num = '02', name = data.eyebrow] = data.eyebrow.split(' / ');
  const id = `akis-${num}`;
  return (
    <section className="section flow" aria-labelledby={id}>
      <div className="wrap">
        <SectionHead
          id={id}
          num={num}
          title={
            <>
              {data.title.lead} <span className="hl">{data.title.italic}</span>
            </>
          }
          lead={data.lead}
        />
        <span className="mono flow-caption">
          {name} · {data.caption}
        </span>
        <ol className="flow-steps" onPointerMove={moveSpotlight}>
          {data.steps.map((a, i) => (
            <li key={a.n} className="reveal" style={stagger(i, 0.06)}>
              <div className="card flow-step">
                <span className="card-top mono">
                  <span className="hl">{a.n}</span>
                </span>
                <h3 className="display flow-role">{a.role}</h3>
                <p className="card-line">{a.does}</p>
                {a.says && <p className="flow-says">“{a.says}”</p>}
                {a.exits.length > 0 && (
                  <span className="badges flow-exits">
                    {a.exits.map((e) => (
                      <span key={e.when} className="badge">
                        {e.when} <span className="hl">→</span> {e.to}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
        <div className="story flow-notes">
          {data.notes.map((n, i) => {
            const [nn, label] = n.label.includes(' / ')
              ? n.label.split(' / ')
              : [String(i + 1).padStart(2, '0'), n.label];
            return (
              <article key={n.label} className="story-item reveal" style={stagger(i, 0.1)}>
                <span className="story-num" aria-hidden="true">
                  {nn}
                </span>
                <h3 className="display story-title">{label}</h3>
                <p>{n.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
