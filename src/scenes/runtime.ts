import * as THREE from 'three';
import type { SceneController, SceneFactory, StageOptions } from './types';

interface StartArgs {
  canvas: HTMLCanvasElement;
  section: HTMLElement;
  factory: SceneFactory;
  options: StageOptions;
  onStage: (stage: number) => void;
  onNoScroll: () => void;
}

const defaultProgressAt = (cycle: number) => (cycle < 0.88 ? cycle / 0.88 : 1);
const defaultSmooth = (dt: number) => 1 - Math.exp(-dt * 4.5);

/**
 * Tasarımdaki her sayfada tekrar eden init3d() gövdesi:
 * renderer ayarları, yeniden boyutlandırma, kaydırmaya bağlı ilerleme ve çizim döngüsü.
 */
export function startScrollScene({ canvas, section, factory, options, onStage, onNoScroll }: StartArgs) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x0a0a0a, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(options.fov, 1, options.near, options.far);

  let k = 0;
  const controller: SceneController = factory({
    renderer,
    scene,
    camera,
    canvas,
    get k() {
      return k;
    },
  });

  let narrow = false;
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    narrow = w < 760;
    if (options.narrowFov !== undefined) camera.fov = narrow ? options.narrowFov : options.fov;
    controller.resize?.(w, h, narrow);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  ro?.observe(canvas);

  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const progressAt = options.progressAt ?? defaultProgressAt;
  const smooth = options.smooth ?? defaultSmooth;

  let ps = 0;
  let stage = 0;
  let noScroll = false;
  const t0 = performance.now();
  let last = t0;
  let raf = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 900;
    if (rect.bottom < -50 || rect.top > vh + 50) return;
    const span = rect.height - canvas.clientHeight;
    const scrollable = document.documentElement.scrollHeight - vh > 80;
    let p: number;
    if (vh > 1600 || !scrollable || span < 60) {
      if (!noScroll) {
        noScroll = true;
        onNoScroll();
      }
      p = progressAt((t % options.loop) / options.loop);
    } else {
      // Yapışkan kutu `top` kadar aşağıda duruyorsa (dar ekranda menünün altı) ilerleme o kadar erken başlar.
      const stuckTop = parseFloat(getComputedStyle(canvas.parentElement!).top) || 0;
      p = Math.min(1, Math.max(0, (stuckTop - rect.top) / span));
    }
    ps += (p - ps) * (reduce ? 1 : smooth(dt));
    k = 1 - Math.exp(-dt * 3.5);
    const next = controller.update(ps, t, dt, narrow);
    if (next !== undefined && next !== stage) {
      stage = next;
      onStage(next);
    }
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ro?.disconnect();
      controller.dispose?.();
      renderer.dispose();
    },
  };
}
