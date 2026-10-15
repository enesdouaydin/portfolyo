/**
 * Telefonda sorun ayıklama: adrese `?debug` eklenince (ör. …/portfolyo/?debug) ekranın üstünde canlı bir kayıt paneli çıkar.
 * Cihaz/GPU bilgisi, açılış adımları, model indirme/çözme, WebGL bağlam kaybı, uzun görevler, hatalar ve saniyelik
 * "hayattayım" satırı yazılır. Sayfa donarsa satırların akması durur; panelin ekran görüntüsü sorunu gösterir.
 */
type Logger = (message: string) => void;

declare global {
  interface Window {
    __debugLog?: Logger;
  }
}

/** Sahne/arayüz kodunun panele yazması için: panel kapalıysa hiçbir şey yapmaz. */
export const dbg: Logger = (message) => window.__debugLog?.(message);

export function debugRequested() {
  return /[?&]debug(\b|=)/.test(window.location.search);
}

function gpuName() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl');
    if (!gl) return 'WebGL YOK';
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    return info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : 'gizli';
  } catch (e) {
    return `hata: ${String(e)}`;
  }
}

export function startDebug() {
  const t0 = performance.now();
  const lines: string[] = [];
  const box = document.createElement('pre');
  box.style.cssText =
    'position:fixed;left:0;right:0;top:0;max-height:60vh;overflow:hidden;margin:0;padding:8px;z-index:2147483647;' +
    'font:11px/1.35 ui-monospace,Menlo,Consolas,monospace;color:#9f9;background:rgba(0,0,0,.9);white-space:pre-wrap;' +
    'word-break:break-word;pointer-events:none';
  document.documentElement.appendChild(box);

  const log: Logger = (message) => {
    const ms = String(Math.round(performance.now() - t0)).padStart(6);
    lines.push(`${ms} ms  ${message}`);
    while (lines.length > 28) lines.splice(2, 1); // ilk iki satır (cihaz bilgisi) hep kalsın
    box.textContent = lines.join('\n');
  };
  window.__debugLog = log;

  const nav = navigator as Navigator & { deviceMemory?: number };
  log(`DEBUG · ${navigator.userAgent.replace(/^Mozilla\/5\.0 /, '').slice(0, 90)}`);
  log(
    `ekran ${innerWidth}×${innerHeight} @${devicePixelRatio} · RAM ${nav.deviceMemory ?? '?'} GB · çekirdek ${navigator.hardwareConcurrency} · ` +
      `dokunmatik ${matchMedia('(pointer: coarse)').matches} · hareket-azalt ${matchMedia('(prefers-reduced-motion: reduce)').matches}`,
  );
  log(`GPU: ${gpuName()}`);
  log('JS başladı (paket çalışıyor)');

  window.addEventListener('error', (e) => log(`HATA: ${e.message}${e.filename ? ` [${e.filename.split('/').pop()}:${e.lineno}]` : ''}`), true);
  window.addEventListener('unhandledrejection', (e) => log(`SÖZ HATASI: ${(e.reason && e.reason.message) || String(e.reason)}`));
  document.addEventListener('webglcontextlost', () => log('!!! WebGL bağlamı KAYBOLDU'), true);
  document.addEventListener('webglcontextrestored', () => log('WebGL bağlamı geri geldi'), true);
  document.addEventListener('visibilitychange', () => log(`görünürlük: ${document.visibilityState}`));
  window.addEventListener('DOMContentLoaded', () => log('DOMContentLoaded'));
  window.addEventListener('load', () => log('load (tüm kaynaklar bitti)'));

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (entry.duration > 250) log(`uzun görev: ${Math.round(entry.duration)} ms`);
    }).observe({ entryTypes: ['longtask'] });
  } catch {
    /* longtask desteklenmiyor */
  }

  // saniyelik kalp atışı: kare hızı. Ana iş parçacığı donarsa bu satırlar durur.
  let frames = 0;
  const count = () => {
    frames++;
    requestAnimationFrame(count);
  };
  requestAnimationFrame(count);
  let beat = 0;
  setInterval(() => {
    beat++;
    if (beat <= 6 || beat % 5 === 0) log(`hayatta · ${frames} kare/sn`);
    frames = 0;
  }, 1000);
}
