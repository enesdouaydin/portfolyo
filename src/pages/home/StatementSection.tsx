import { GUTTER, fluid } from '../../styles/type';
import { ACCENT } from '../../theme';

export function StatementSection() {
  return (
    <section
      aria-label="Kısaca"
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: `${fluid(136)} ${GUTTER} ${fluid(120)}`,
        display: 'flex',
        flexDirection: 'column',
        gap: fluid(96),
      }}
    >
      <p
        style={{
          margin: '0',
          fontSize: 'clamp(28px,3.6vw,52px)',
          lineHeight: '1.14',
          letterSpacing: '-0.035em',
          fontWeight: '400',
          color: '#6A6862',
          maxWidth: '1180px',
          textWrap: 'pretty',
        }}
      >
        Gönüllü stajla başlayan üç yıl. Bugün{' '}
        <span style={{ color: '#EDEBE6' }}>sahada her gün kullanılan rota sistemleri</span>,{' '}
        <span style={{ color: '#EDEBE6' }}>gerçek çağrılara yanıt veren sesli ajanlar</span> ve{' '}
        <span style={{ color: '#EDEBE6' }}>yüz sayfalık formları kendi dolduran</span>{' '}
        <span
          style={{
            fontFamily: "'Instrument Serif',Georgia,serif",
            fontStyle: 'italic',
            color: '#EDEBE6',
            letterSpacing: '-0.01em',
          }}
        >
          üretim hatları
        </span>{' '}
        kuruyorum.
      </p>
      <dl
        style={{
          margin: '0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))',
          gap: '0',
        }}
      >
        <div
          style={{
            borderTop: '1px solid #2A2A2E',
            padding: '28px 28px 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <dt style={{ fontSize: '15px', lineHeight: '1.5', color: '#A8A59D' }}>
            bir haftalık rota planlaması artık saniyeler sürüyor
          </dt>
          <dd
            style={{
              order: '-1',
              margin: '0',
              fontSize: 'clamp(48px,5vw,76px)',
              fontWeight: '400',
              letterSpacing: '-0.05em',
              lineHeight: '1',
            }}
          >
            10
            <span
              style={{
                fontFamily: "'Instrument Serif',Georgia,serif",
                fontStyle: 'italic',
                letterSpacing: '0',
                color: '#A8A59D',
              }}
            >
              sn
            </span>
          </dd>
        </div>
        <div
          style={{
            borderTop: '1px solid #2A2A2E',
            padding: '28px 28px 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <dt style={{ fontSize: '15px', lineHeight: '1.5', color: '#A8A59D' }}>
            daha kısa saha rotaları, doğrudan yakıt ve zaman
          </dt>
          <dd
            style={{
              order: '-1',
              margin: '0',
              fontSize: 'clamp(48px,5vw,76px)',
              fontWeight: '400',
              letterSpacing: '-0.05em',
              lineHeight: '1',
            }}
          >
            <span style={{ color: ACCENT }}>%</span>
            50
          </dd>
        </div>
        <div
          style={{
            borderTop: '1px solid #2A2A2E',
            padding: '28px 28px 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <dt style={{ fontSize: '15px', lineHeight: '1.5', color: '#A8A59D' }}>
            STT → agent → TTS, sesli asistanın yanıt süresi
          </dt>
          <dd
            style={{
              order: '-1',
              margin: '0',
              fontSize: 'clamp(48px,5vw,76px)',
              fontWeight: '400',
              letterSpacing: '-0.05em',
              lineHeight: '1',
            }}
          >
            ~2
            <span
              style={{
                fontFamily: "'Instrument Serif',Georgia,serif",
                fontStyle: 'italic',
                letterSpacing: '0',
                color: '#A8A59D',
              }}
            >
              sn
            </span>
          </dd>
        </div>
        <div
          style={{
            borderTop: '1px solid #2A2A2E',
            padding: '28px 28px 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <dt style={{ fontSize: '15px', lineHeight: '1.5', color: '#A8A59D' }}>
            sayfalık proje formu, VLM ve RAG ile otomatik
          </dt>
          <dd
            style={{
              order: '-1',
              margin: '0',
              fontSize: 'clamp(48px,5vw,76px)',
              fontWeight: '400',
              letterSpacing: '-0.05em',
              lineHeight: '1',
            }}
          >
            150
          </dd>
        </div>
      </dl>
    </section>
  );
}
