import type * as THREE from 'three';

/** Sahne fabrikasına verilen ortak nesneler (tasarımdaki init3d() içinde kurulanlar). */
export interface SceneContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  /** Kare başına üstel sönümleme katsayısı: 1 - exp(-dt * 3.5). Tasarımdaki `self._k`. */
  readonly k: number;
}

export interface SceneController {
  /**
   * Her karede çağrılır. `p` yumuşatılmış kaydırma ilerlemesi (0–1).
   * Dönen sayı "aşama"dır; değişince üstteki HTML katmanı yeniden çizilir.
   */
  update(p: number, t: number, dt: number, narrow: boolean): number | void;
  /** Boyut değişince (renderer.setSize ve kamera en-boy oranı güncellendikten sonra) çağrılır. */
  resize?(width: number, height: number, narrow: boolean): void;
  dispose?(): void;
}

export type SceneFactory = (ctx: SceneContext) => SceneController;

export interface StageOptions {
  fov: number;
  /** Dar ekranda (genişlik < 760px) kullanılacak görüş açısı; verilmezse `fov` sabit kalır. */
  narrowFov?: number;
  near: number;
  far: number;
  /** Kaydırma yokken sahnenin kendi kendine oynadığı döngünün süresi (sn). */
  loop: number;
  /** Döngü içindeki konumdan (0–1) ilerleme `p` üretir. */
  progressAt?: (cycle: number) => number;
  /** Bir karedeki yumuşatma oranı. */
  smooth?: (dt: number) => number;
}
