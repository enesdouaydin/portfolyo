import { Link } from 'react-router-dom';
import { ScrambleText } from '../ScrambleText';

interface Props {
  to: string;
  /** "Sıradaki" ya da "Sıradaki · 02". */
  eyebrow: string;
  title: { lead: string; italic: string };
  /** Eski tasarımdan kalan üst çizgi seçeneği; yeni düzende hep çizgili. */
  borderTop?: boolean;
}

/** Sayfa sonundaki dev "Sıradaki proje" bandı: üstüne gelince başlık çözülerek yazılır, ok kayar. */
export function NextProject({ to, eyebrow, title }: Props) {
  return (
    <Link to={to} className="next">
      <span className="wrap next-inner">
        <span className="next-text">
          <span className="eyebrow">{eyebrow}</span>
          <span className="display next-title">
            <ScrambleText text={title.lead} trigger=".next" /> <span className="hl">{title.italic}</span>
          </span>
        </span>
        <span className="next-arrow" aria-hidden="true">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </span>
    </Link>
  );
}
