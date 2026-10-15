import type { ReactNode } from 'react';

interface Props {
  /** Bölüm sırası, ör. "02". */
  num: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Başlık id'si; bölüm bu id ile etiketlenir. */
  id: string;
}

/** Her bölümün başı: çizgili büyük numara, başlık, kısa açıklama. */
export function SectionHead({ num, title, lead, id }: Props) {
  return (
    <header className="sec-head reveal">
      <span className="sec-num" aria-hidden="true">
        {num}
      </span>
      <h2 id={id} className="display sec-title">
        {title}
      </h2>
      {lead && <p className="sec-lead">{lead}</p>}
    </header>
  );
}
