import { useRef, useState } from 'react';
import { ALGORITHM_STEPS, DAY_NAMES, DEMO, VIDEO_CHAPTERS } from '../../data/dealerDemo';
import { GUTTER, MONO, fluid } from '../../styles/type';
import { DemoPanel } from './DemoPanel';

type Tab = 'video' | 'demo' | 'algo';

const TABS: ReadonlyArray<{ id: Tab; label: string }> = [
  { id: 'video', label: 'Gerçek uygulama' },
  { id: 'demo', label: 'Canlı demo' },
  { id: 'algo', label: 'Algoritma' },
];

/** Proje medyası: gerçek uygulama videosu, tarayıcıda çalışan canlı demo ve algoritma adımları. */
export function MediaPanel() {
  const [tab, setTab] = useState<Tab>('video');
  const [day, setDay] = useState(-1);
  const [sel, setSel] = useState(-1);
  const [chapter, setChapter] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const labels: Record<Tab, string> = {
    demo: 'tarayıcıda çalışan demo · ' + (day >= 0 ? DAY_NAMES[day] : 'tüm günler'),
    video: 'ekran kaydı · bölüme tıkla, oraya atla',
    algo: 'algoritma · 6 adım',
  };

  const pickChapter = (i: number) => {
    const el = videoRef.current;
    if (el) {
      try {
        el.currentTime = VIDEO_CHAPTERS[i].s;
        const pr = el.play();
        if (pr && pr.catch) pr.catch(() => {});
      } catch {
        /* video henüz hazır değil */
      }
    }
    setChapter(i);
  };

  const onTime = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const ct = e.currentTarget.currentTime;
    let idx = 0;
    VIDEO_CHAPTERS.forEach((c, i) => {
      if (ct >= c.s) idx = i;
    });
    if (idx !== chapter) setChapter(idx);
  };

  return (
    <section
      aria-label="Proje medyası"
      style={{ maxWidth: '1360px', margin: '0 auto', padding: `0 ${GUTTER} ${fluid(120)}` }}
    >
      <div
        style={{
          background: '#111113',
          border: '1px solid #232327',
          borderRadius: '24px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            padding: '14px 14px 14px 24px',
            borderBottom: '1px solid #1F1F1F',
          }}
        >
          <span style={{ fontFamily: MONO, fontSize: '12px', color: '#A8A59D' }}>{labels[tab]}</span>
          <div
            role="tablist"
            aria-label="Görünüm"
            style={{
              display: 'flex',
              gap: '4px',
              padding: '4px',
              background: '#0A0A0A',
              border: '1px solid #232327',
              borderRadius: '999px',
              flexWrap: 'wrap',
            }}
          >
            {TABS.map((t) => {
              const on = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  className="tab"
                  aria-selected={on}
                  onClick={() => setTab(t.id)}
                  style={{
                    minHeight: '38px',
                    padding: '0 18px',
                    borderRadius: '999px',
                    border: 'none',
                    background: on ? '#FFD60A' : 'transparent',
                    color: on ? '#0A0A0A' : '#A8A59D',
                    fontFamily: "'Geist',sans-serif",
                    fontWeight: '500',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {tab === 'demo' && (
          <DemoPanel
            day={day}
            sel={sel}
            onPickDay={(d) => {
              setDay(d);
              setSel(-1);
            }}
            onPickPin={(k) => {
              setSel(k);
              setDay(DEMO.pts[k].day);
            }}
          />
        )}

        {tab === 'video' && (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div
              style={{
                flex: '999 1 640px',
                minWidth: '0',
                display: 'flex',
                flexDirection: 'column',
                background: '#0E0E10',
              }}
            >
              <video
                ref={videoRef}
                src="/media/rota_demo.mp4"
                poster="/media/rota_poster.jpg"
                controls
                playsInline
                muted
                preload="metadata"
                onTimeUpdate={onTime}
                aria-label="Bayi rota optimizasyonu uygulamasının ekran kaydı"
                style={{ display: 'block', width: '100%', aspectRatio: '1440/742', background: '#0E0E10' }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  padding: '14px 20px',
                  borderTop: '1px solid #1F1F1F',
                  fontFamily: MONO,
                  fontSize: '12px',
                  color: '#A8A59D',
                  flexWrap: 'wrap',
                }}
              >
                <span>
                  {VIDEO_CHAPTERS[chapter].t} · {VIDEO_CHAPTERS[chapter].label}
                </span>
                <span>gerçek uygulama · ekran kaydı · 0:51</span>
              </div>
            </div>
            <ol
              style={{
                flex: '1 1 320px',
                minWidth: '0',
                listStyle: 'none',
                margin: '0',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                borderLeft: '1px solid #1F1F1F',
              }}
            >
              {VIDEO_CHAPTERS.map((c, i) => {
                const on = chapter === i;
                return (
                  <li key={c.t}>
                    <button
                      type="button"
                      onClick={() => pickChapter(i)}
                      style={{
                        width: '100%',
                        minHeight: '60px',
                        textAlign: 'left',
                        borderRadius: '12px',
                        border: 'none',
                        background: on ? '#1C1C1F' : 'transparent',
                        color: on ? '#EDEBE6' : '#A8A59D',
                        fontFamily: "'Geist',sans-serif",
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '0 16px',
                      }}
                    >
                      <span
                        style={{ fontFamily: MONO, fontSize: '11px', color: '#8A877F', flex: '0 0 44px' }}
                      >
                        {c.t}
                      </span>
                      {c.label}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {tab === 'algo' && (
          <ol
            style={{
              listStyle: 'none',
              margin: '0',
              padding: '0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
            }}
          >
            {ALGORITHM_STEPS.map((s) => (
              <li
                key={s.n}
                style={{
                  padding: '32px',
                  borderRight: '1px solid #1F1F1F',
                  borderBottom: '1px solid #1F1F1F',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  minHeight: '210px',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: '12px', color: '#FFD60A' }}>{s.n}</span>
                <span
                  style={{
                    fontWeight: '500',
                    fontSize: '24px',
                    letterSpacing: '-0.025em',
                    lineHeight: '1.15',
                  }}
                >
                  {s.title}
                </span>
                <span style={{ fontSize: '15px', lineHeight: '1.6', color: '#A8A59D' }}>{s.text}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
