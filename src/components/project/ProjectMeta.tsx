import { MONO } from '../../styles/type';

export interface MetaItem {
  label: string;
  value: string;
  /** Hücre dolgusu; verilmezse sağ ve alt/üst 16px. */
  padding?: string;
}

interface Props {
  items: readonly MetaItem[];
  /** Bölümün dolgusu. */
  padding: string;
  /** Değer yazısının punto boyu. */
  valueSize: string;
}

/** Proje künyesi: etiket + değer çiftlerinden oluşan, üstten çizgili ızgara. */
export function ProjectMeta({ items, padding, valueSize }: Props) {
  return (
    <section aria-label="Proje künyesi" style={{ maxWidth: '1360px', margin: '0 auto', padding }}>
      <dl
        style={{
          margin: '0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))',
          gap: '0',
        }}
      >
        {items.map((it) => (
          <div
            key={it.label}
            style={{
              borderTop: '1px solid #2A2A2E',
              padding: it.padding ?? '16px 16px 16px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <dt style={{ fontFamily: MONO, fontSize: '11px', color: '#8A877F', letterSpacing: '.06em' }}>
              {it.label}
            </dt>
            <dd style={{ margin: '0', fontSize: valueSize }}>{it.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
