import { Link } from 'react-router-dom';
import { GUTTER, fluid, serifItalic } from '../../styles/type';
import { Eyebrow } from '../Eyebrow';

interface Props {
  to: string;
  /** "Sıradaki" ya da "Sıradaki · 02". */
  eyebrow: string;
  title: { lead: string; italic: string };
  /** Üst çizgi (bazı sayfalarda önceki bölüm zaten çizgiyle biter). */
  borderTop?: boolean;
}

/** Sayfa sonundaki dev "Sıradaki proje" bandı. */
export function NextProject({ to, eyebrow, title, borderTop = true }: Props) {
  return (
    <Link
      to={to}
      className="next"
      style={{
        display: 'block',
        textDecoration: 'none',
        color: '#F2EBDF',
        ...(borderTop ? { borderTop: '1px solid #1F1F1F' } : null),
        borderBottom: '1px solid #1F1F1F',
      }}
    >
      <span
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: `${fluid(112)} ${GUTTER}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '32px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <span
            className="nt"
            style={{
              fontWeight: '500',
              fontSize: 'clamp(44px,7vw,112px)',
              letterSpacing: '-0.05em',
              lineHeight: '.95',
            }}
          >
            {title.lead} <span style={serifItalic}>{title.italic}</span>
          </span>
        </span>
        <svg
          className="na"
          aria-hidden="true"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
