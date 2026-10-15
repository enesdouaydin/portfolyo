import { useState, type PointerEvent } from 'react';
import { CATEGORIES, FEATURED_CATS, PROJECTS, type CategoryId } from '../../data/home';
import { FeaturedProject } from './FeaturedProject';
import { ProjectCard } from './ProjectCard';
import { SectionHead } from '../../components/SectionHead';

const inCategory = (cats: readonly CategoryId[], id: CategoryId) => id === 'all' || cats.includes(id);
const countFor = (id: CategoryId) =>
  PROJECTS.filter((p) => inCategory(p.cats, id)).length + (inCategory(FEATURED_CATS, id) ? 1 : 0);

/** Fare hangi kartın üstündeyse ışığı oraya taşır (home.css: .card::after, --mx/--my). */
function moveSpotlight(e: PointerEvent<HTMLUListElement>) {
  const card = (e.target as Element).closest<HTMLElement>('.card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
  // fareye doğru hafif 3D eğim (büyük kartta daha az)
  const max = card.closest('.featured') ? 2 : 6;
  const nx = (e.clientX - r.left) / r.width - 0.5;
  const ny = (e.clientY - r.top) / r.height - 0.5;
  card.style.setProperty('--ry', `${(nx * max).toFixed(2)}deg`);
  card.style.setProperty('--rx', `${(-ny * max).toFixed(2)}deg`);
}

/** Seçili işler: kategori filtresi, öne çıkan Bayi Rota kartı ve proje ızgarası. */
export function WorkSection() {
  const [filter, setFilter] = useState<CategoryId>('all');
  const showFeatured = inCategory(FEATURED_CATS, filter);
  const shown = PROJECTS.filter((p) => inCategory(p.cats, filter));

  return (
    <section id="isler" className="section" aria-labelledby="isler-baslik">
      <div className="wrap">
        <SectionHead
          id="isler-baslik"
          num="01"
          title="Seçili işler"
          lead="Sahada her gün kullanılan sistemlerden deneme projelerine. Sayfası olan işlerde canlı demo ve vaka çalışması var."
        />
        <div role="group" aria-label="Projeleri filtrele" className="filters">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
              <span className="n">{countFor(c.id)}</span>
            </button>
          ))}
        </div>
        <ul className="work-grid" onPointerMove={moveSpotlight}>
          {showFeatured && <FeaturedProject />}
          {shown.map((p) => (
            <li key={p.n} className="reveal">
              <ProjectCard p={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
