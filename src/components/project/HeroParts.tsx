import type { ReactNode } from 'react';

export interface StageChip {
  label: string;
  /** `on`: şu anki aşama (amber), `done`: geçilmiş aşama. */
  state?: 'on' | 'done';
}

/** Hero'nun altındaki aşama hapları (ARAMA → STT → …). */
export function StageChips({ chips }: { chips: readonly StageChip[] }) {
  return (
    <ol className="stage-chips">
      {chips.map((c) => (
        <li key={c.label} className={c.state}>
          {c.label}
        </li>
      ))}
    </ol>
  );
}

/** Sayının yanındaki küçük birim ("sn", "saniye"). */
export function Unit({ children }: { children: ReactNode }) {
  return <small className="unit">{children}</small>;
}

/** Hero'nun sağ altında, sahne bitince beliren büyük sayı + mono açıklama. */
export function HeroStat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="hero-stat">
      <span className="hero-stat-value">{value}</span>
      <span className="mono">{label}</span>
    </div>
  );
}

/** "Kaydır, …" ipucu: mono yazı + aşağı ok. `prefix` varsa ("örnek veri · ") önüne gelir. */
export function ScrollHint({ prefix, hint }: { prefix?: string; hint: string }) {
  return (
    <span className="hero-hint">
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
