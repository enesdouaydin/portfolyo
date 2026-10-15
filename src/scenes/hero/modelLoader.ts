/**
 * Hero modelini indirir. `enes.glb` yaklaşık 7 MB'tır ve GitHub Pages bu dosya türünü sıkıştırmaz; derleme sırasında
 * yanına gzip'lenmiş kopyası (`enes.glb.gz`, vite.config.ts) yazılır, burada tarayıcıda açılır (~%53 daha az veri).
 * Tarayıcı `DecompressionStream`'i bilmiyorsa ya da .gz yoksa (geliştirme sunucusu) düz .glb indirilir.
 * İndirme ilerlemesi `HERO_MODEL_EVENT` ile duyurulur; ana sayfa hero'su "yükleniyor %NN" yazısını buradan alır.
 */
export const HERO_MODEL_EVENT = 'hero-model';

export interface HeroModelProgress {
  /** 0–100; toplam bilinmiyorsa null. */
  pct: number | null;
  /** İndirme bitti (ya da başarısız oldu): yazıyı kaldır. */
  done: boolean;
}

function announce(detail: HeroModelProgress) {
  window.dispatchEvent(new CustomEvent<HeroModelProgress>(HERO_MODEL_EVENT, { detail }));
}

const GLB_MAGIC = 0x46546c67; // "glTF"

/** Gövdeyi okurken indirilen bayt sayısını sayan geçiş akışı (`DecompressionStream`'in beklediği bayt dizisi tipiyle). */
function counting(total: number) {
  let loaded = 0;
  let last = -1;
  return new TransformStream<Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>({
    transform(chunk, ctl) {
      loaded += chunk.byteLength;
      const pct = total > 0 ? Math.min(99, Math.floor((loaded / total) * 100)) : null;
      if (pct !== last) {
        last = pct ?? -1;
        announce({ pct, done: false });
      }
      ctl.enqueue(chunk);
    },
  });
}

async function fetchGzipped(url: string): Promise<ArrayBuffer | null> {
  if (typeof DecompressionStream === 'undefined') return null;
  try {
    const res = await fetch(`${url}.gz`);
    // Geliştirme sunucusu bilinmeyen yola index.html döndürür; yalnızca gerçek ikili yanıtı kabul et.
    if (!res.ok || !res.body || (res.headers.get('content-type') || '').includes('text/html')) return null;
    const total = Number(res.headers.get('content-length')) || 0;
    const out = res.body.pipeThrough(counting(total)).pipeThrough(new DecompressionStream('gzip'));
    const buf = await new Response(out).arrayBuffer();
    return buf.byteLength > 12 && new DataView(buf).getUint32(0, true) === GLB_MAGIC ? buf : null;
  } catch {
    return null;
  }
}

async function fetchPlain(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`model indirilemedi (${res.status})`);
  const total = Number(res.headers.get('content-length')) || 0;
  return new Response(res.body.pipeThrough(counting(total))).arrayBuffer();
}

/** Modeli indirip GLB baytlarını döndürür; `GLTFLoader.parse` ile çözülür. */
export async function loadModel(url: string): Promise<ArrayBuffer> {
  announce({ pct: 0, done: false });
  try {
    return (await fetchGzipped(url)) ?? (await fetchPlain(url));
  } finally {
    announce({ pct: 100, done: true });
  }
}
