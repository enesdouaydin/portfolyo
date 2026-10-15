import { stagger } from '../stagger';

/** "01 / Problem · 02 / Yaklaşım · 03 / Sonuç": çizgili büyük numaralı üç kart. */
export function StorySection({ items }: { items: ReadonlyArray<{ label: string; text: string }> }) {
  return (
    <section aria-label="Hikâye" className="wrap story">
      {items.map((it, i) => {
        const [num, name] = it.label.includes(' / ')
          ? it.label.split(' / ')
          : [String(i + 1).padStart(2, '0'), it.label];
        return (
          <article key={it.label} className="story-item reveal" style={stagger(i, 0.1)}>
            <span className="story-num" aria-hidden="true">
              {num}
            </span>
            <h2 className="display story-title">{name}</h2>
            <p>{it.text}</p>
          </article>
        );
      })}
    </section>
  );
}
