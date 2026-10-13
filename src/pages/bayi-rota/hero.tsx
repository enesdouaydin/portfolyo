import { HeroStat, ScrollHint, Unit } from '../../components/project/HeroParts';
import { MONO, SERIF } from '../../styles/type';

const STOPS = 7;

/** Hero'nun alt satırı: ziyaret sayacı, ilerleme çubukları; varışta sonuç rakamları. `visited` sahnenin aşamasıdır. */
export function BayiRotaHeroBottom({ visited, noScroll }: { visited: number; noScroll: boolean }) {
  const arrived = visited >= STOPS;
  const phase =
    visited === 0
      ? 'DEPODAN ÇIKIŞ'
      : arrived
        ? 'VARIŞ · ROTA TAMAMLANDI'
        : 'ROTADA · 2-OPT İLE SIRALANMIŞ DURAKLAR';
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontFamily: MONO, fontSize: '12px', color: '#8A877F', letterSpacing: '.04em' }}>
          {phase}
        </span>
        <span
          style={{
            fontSize: 'clamp(40px,4.4vw,64px)',
            letterSpacing: '-0.045em',
            lineHeight: '1',
            fontWeight: '400',
          }}
        >
          {visited}
          <span style={{ color: '#6A6862' }}> / {STOPS}</span>{' '}
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: '.6em',
              color: '#A8A59D',
              letterSpacing: '-0.01em',
            }}
          >
            bayi ziyaret edildi
          </span>
        </span>
        <div style={{ display: 'flex', gap: '4px', width: 'min(420px,80vw)' }}>
          {Array.from({ length: STOPS }, (_, i) => (
            <span
              key={i}
              style={{
                flex: '1',
                height: '3px',
                borderRadius: '3px',
                background: i < visited ? '#FFD60A' : '#2A2A2E',
              }}
            />
          ))}
        </div>
      </div>
      {arrived ? (
        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
          <HeroStat
            value={
              <>
                10 <Unit>sn</Unit>
              </>
            }
            label="önceden ~1 hafta"
          />
          <HeroStat
            value={
              <>
                <span style={{ color: '#FFD60A' }}>%</span>50
              </>
            }
            label="daha kısa rota"
          />
          <HeroStat
            value={
              <>
                ~8 <Unit>sn</Unit>
              </>
            }
            label="1.600 nokta"
          />
        </div>
      ) : (
        <ScrollHint hint={noScroll ? 'Otomatik oynatılıyor' : 'Kaydır, araç ilerlesin'} />
      )}
    </>
  );
}
