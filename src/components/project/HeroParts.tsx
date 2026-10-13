import type { ReactNode } from 'react';
import { MONO, SERIF } from '../../styles/type';

export interface StageChip {
  label: string;
  border: string;
  background: string;
  color: string;
}

/** Hero'nun altındaki aşama hapları (ARAMA → STT → …); aktif olan sarı çerçeveli. */
export function StageChips({ chips }: { chips: readonly StageChip[] }) {
  return (
    <ol
      style={{
        listStyle: 'none',
        margin: '0',
        padding: '0',
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {chips.map((c) => (
        <li
          key={c.label}
          style={{
            fontFamily: MONO,
            fontSize: '11px',
            letterSpacing: '.06em',
            padding: '6px 11px',
            borderRadius: '999px',
            border: `1px solid ${c.border}`,
            background: c.background,
            color: c.color,
          }}
        >
          {c.label}
        </li>
      ))}
    </ol>
  );
}

/** Sayının yanındaki küçük birim ("sn", "saniye"): gri serif italik. */
export function Unit({ children }: { children: ReactNode }) {
  return <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: '#A8A59D' }}>{children}</span>;
}

/** Hero'nun sağ altında, sahne bitince beliren büyük sayı + mono açıklama. */
export function HeroStat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontSize: '36px', letterSpacing: '-0.04em' }}>{value}</span>
      <span style={{ fontFamily: MONO, fontSize: '11px', color: '#A8A59D' }}>{label}</span>
    </div>
  );
}

/** "Kaydır, …" ipucu: mono yazı + aşağı ok. `prefix` varsa ("örnek veri · ") önüne gelir. */
export function ScrollHint({ prefix, hint }: { prefix?: string; hint: string }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: '12px',
        color: '#8A877F',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {prefix}
      {hint}
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M6 13l6 6 6-6" />
      </svg>
    </span>
  );
}
