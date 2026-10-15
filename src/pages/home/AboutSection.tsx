import { METRICS } from '../../data/home';
import { CountUp } from './CountUp';
import { stagger } from '../../components/stagger';

/** Kısa tanıtım cümlesi ve dört büyük sayı. */
export function AboutSection() {
  return (
    <section className="section" aria-label="Kısaca">
      <div className="wrap">
        <p className="about-text reveal">
          Gönüllü stajla başlayan üç yıl. Bugün <em>sahada her gün kullanılan rota sistemleri</em>,{' '}
          <em>gerçek çağrılara yanıt veren sesli ajanlar</em> ve{' '}
          <em>yüz sayfalık formları kendi dolduran üretim hatları</em> kuruyorum.
        </p>
        <dl className="metrics">
          {METRICS.map((m, i) => (
            <div key={m.label} className="metric reveal" style={stagger(i)}>
              <dt>{m.label}</dt>
              <dd>
                {m.prefix && <small className="pre">{m.prefix}</small>}
                <CountUp value={m.value} />
                {m.unit && <small>{m.unit}</small>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
