import { stagger } from '../stagger';

export interface MetaItem {
  label: string;
  value: string;
  /** Eski tasarımdan kalan hücre dolgusu; yeni düzende kullanılmıyor. */
  padding?: string;
}

interface Props {
  items: readonly MetaItem[];
  /** Eski tasarımdan kalan bölüm dolgusu; yeni düzende kullanılmıyor. */
  padding?: string;
  /** Eski tasarımdan kalan punto; yeni düzende kullanılmıyor. */
  valueSize?: string;
}

/** Proje künyesi: rol, ekip, dönem, teknoloji gibi etiket + değer kartları. */
export function ProjectMeta({ items }: Props) {
  return (
    <section aria-label="Proje künyesi" className="wrap project-meta">
      <dl className="meta-grid">
        {items.map((it, i) => (
          <div key={it.label} className="meta-item reveal" style={stagger(i, 0.06)}>
            <dt className="mono">{it.label}</dt>
            <dd>{it.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
