import { useState } from 'react';
import { CATEGORIES, FEATURED_CATS, PROJECTS, type CategoryId } from '../../data/home';
import { FeaturedProject } from './FeaturedProject';
import { ProjectCard } from './ProjectCard';
import { SectionHead } from './SectionHead';

const inCategory = (cats: readonly CategoryId[], id: CategoryId) => id === 'all' || cats.includes(id);
const countFor = (id: CategoryId) =>
  PROJECTS.filter((p) => inCategory(p.cats, id)).length + (inCategory(FEATURED_CATS, id) ? 1 : 0);

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
        <ul className="work-grid">
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
