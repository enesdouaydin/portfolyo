import * as T from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PAIRS } from '../data/home';
import { ACCENT } from '../theme';
import { Choreography, MODEL_SCALE } from './hero/choreography';
import { loadModel } from './hero/modelLoader';
import { findRig, type Rig } from './hero/rig';
import { createSaber } from './hero/saber';
import type { SceneContext, SceneController, StageOptions } from './types';

/**
 * Ana sayfa hero sahnesi: Enes'in iskeletli 3D modeli kırmızı ışın kılıcını çeviriyor.
 * Sayfa kaydırıldıkça figür döner ve kılıcın iki yanında teknoloji çiftleri belirir.
 *
 * Parçalar: `hero/saber.ts` (kılıç), `hero/rig.ts` (iskelet ve IK), `hero/choreography.ts` (hareket).
 */
export const heroStageOptions: StageOptions = {
  fov: 30,
  near: 0.1,
  far: 60,
  loop: 21, // çift başına ~1 sn (21 çift)
  progressAt: (cyc) => (cyc < 0.9 ? cyc / 0.9 : 1 - (cyc - 0.9) / 0.1),
  smooth: () => 0.075,
  idleAutoplay: true, // kaydırmadan da teknolojiler (5 grup, 21 çift) kendiliğinden ilerler
};

const MODEL_URL = `${import.meta.env.BASE_URL}media/enes.glb`;

interface Label {
  c: HTMLCanvasElement;
  tex: T.CanvasTexture;
  sp: T.Sprite;
}

export function createHeroScene({ scene, camera: cam, canvas: cv }: SceneContext): SceneController {
  // --- ortam ---------------------------------------------------------------------------------
  scene.fog = new T.Fog(0x0c0a09, 6.5, 13);
  scene.add(new T.HemisphereLight(0xf2efe8, 0x0c0a09, 0.45));
  const fill = new T.DirectionalLight(0xfff4ea, 0.9);
  fill.position.set(0.6, 1.4, 5);
  scene.add(fill);
  const key = new T.DirectionalLight(0xfff1e4, 1.5);
  key.position.set(2.6, 4.2, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -1 });
  key.shadow.radius = 4;
  scene.add(key);
  const rim = new T.DirectionalLight(0x7d93ff, 1.1);
  rim.position.set(-3.5, 2.6, -3);
  scene.add(rim);
  const rim2 = new T.DirectionalLight(0xf2d2a2, 0.5);
  rim2.position.set(3.5, 1.5, -2.5);
  scene.add(rim2);

  const floor = new T.Mesh(
    new T.CircleGeometry(9, 64),
    new T.MeshStandardMaterial({ color: 0x050506, roughness: 1, metalness: 0 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const ringMat = new T.MeshBasicMaterial({ color: 0xf0b54a, transparent: true, opacity: 0.55 });
  const ring = new T.Mesh(new T.RingGeometry(0.92, 0.935, 128), ringMat);
  const ring2 = new T.Mesh(
    new T.RingGeometry(1.7, 1.705, 128),
    new T.MeshBasicMaterial({ color: 0x3a3a40, transparent: true, opacity: 0.8 }),
  );
  for (const r of [ring, ring2]) {
    r.rotation.x = -Math.PI / 2;
    r.position.y = 0.003;
    scene.add(r);
  }
  const ticks = new T.Group();
  const tickMat = new T.MeshBasicMaterial({ color: 0x55534e });
  for (let k = 0; k < 48; k++) {
    const tk = new T.Mesh(new T.PlaneGeometry(0.012, k % 4 === 0 ? 0.12 : 0.05), tickMat);
    const a = (k / 48) * Math.PI * 2;
    tk.rotation.x = -Math.PI / 2;
    tk.rotation.z = -a;
    tk.position.set(Math.sin(a) * 1.78, 0.004, Math.cos(a) * 1.78);
    ticks.add(tk);
  }
  scene.add(ticks);

  // toz
  const dN = 260;
  const dPos = new Float32Array(dN * 3);
  for (let d = 0; d < dN; d++) {
    const rr = 0.6 + Math.random() * 3.6;
    const aa = Math.random() * Math.PI * 2;
    dPos[d * 3] = Math.sin(aa) * rr;
    dPos[d * 3 + 1] = Math.random() * 3;
    dPos[d * 3 + 2] = Math.cos(aa) * rr;
  }
  const dGeo = new T.BufferGeometry();
  dGeo.setAttribute('position', new T.BufferAttribute(dPos, 3));
  scene.add(
    new T.Points(
      dGeo,
      new T.PointsMaterial({
        color: 0x8a877f,
        size: 0.014,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    ),
  );

  // --- figür ---------------------------------------------------------------------------------
  const fig = new T.Group();
  scene.add(fig);
  const body = new T.Group();
  body.scale.setScalar(MODEL_SCALE);
  fig.add(body);
  const saber = createSaber(fig);
  const choreo = new Choreography();
  let rig: Rig | null = null;
  let disposed = false;

  const onModel = (gltf: GLTF) => {
    if (disposed) return;
    gltf.scene.traverse((o) => {
      const mesh = o as T.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if ((o as T.SkinnedMesh).isSkinnedMesh) o.frustumCulled = false;
      const m = mesh.material as T.MeshStandardMaterial;
      if (m && 'metalness' in m) {
        m.metalness = Math.min(m.metalness, 0.3);
        m.roughness = Math.max(m.roughness, 0.55);
        m.needsUpdate = true;
      }
    });
    rig = findRig(gltf.scene);
    body.add(gltf.scene);
  };
  const onModelError = (err: unknown) => console.warn('hero model failed to load', err);
  // Önce indir (sıkıştırılmış kopya varsa onu aç, ilerlemeyi duyur), sonra çöz
  loadModel(MODEL_URL)
    .then((buf) => {
      if (!disposed) new GLTFLoader().parse(buf, '', onModel, onModelError);
    })
    .catch(onModelError);

  // --- iz: yalnızca bıçağın ucu --------------------------------------------------------------
  const TN = 20;
  const trailPos = new Float32Array(TN * 3);
  const trailCol = new Float32Array(TN * 3);
  for (let i = 0; i < TN; i++) {
    const f = Math.pow(1 - i / TN, 1.6);
    trailCol[i * 3] = 0.9 * f;
    trailCol[i * 3 + 1] = 0.08 * f;
    trailCol[i * 3 + 2] = 0.05 * f;
  }
  const trailGeo = new T.BufferGeometry();
  trailGeo.setAttribute('position', new T.BufferAttribute(trailPos, 3));
  trailGeo.setAttribute('color', new T.BufferAttribute(trailCol, 3));
  const trail = new T.Line(
    trailGeo,
    new T.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: T.AdditiveBlending,
      depthWrite: false,
    }),
  );
  trail.frustumCulled = false;
  scene.add(trail);
  let trailInit = false;

  // --- teknoloji etiketleri: kılıcın dönüş çemberinde karşılıklı iki nokta ------------------------
  function makeLabel(): Label {
    const c = document.createElement('canvas');
    c.width = 640;
    c.height = 144;
    const tex = new T.CanvasTexture(c);
    tex.encoding = T.sRGBEncoding;
    tex.anisotropy = 4;
    const sp = new T.Sprite(
      new T.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false }),
    );
    sp.scale.set(0.74, 0.1665, 1);
    sp.renderOrder = 20;
    scene.add(sp);
    return { c, tex, sp };
  }
  function drawLabel(L: Label, text: string) {
    const x = L.c.getContext('2d')!;
    x.clearRect(0, 0, 640, 144);
    x.font = '500 54px "Geist Variable", Geist, "Helvetica Neue", Arial, sans-serif';
    const w = Math.min(600, x.measureText(text).width + 92);
    const x0 = (640 - w) / 2;
    const y0 = 22;
    const h = 100;
    const r = 50;
    x.beginPath();
    x.moveTo(x0 + r, y0);
    x.lineTo(x0 + w - r, y0);
    x.arc(x0 + w - r, y0 + r, r, -Math.PI / 2, Math.PI / 2);
    x.lineTo(x0 + r, y0 + h);
    x.arc(x0 + r, y0 + r, r, Math.PI / 2, Math.PI * 1.5);
    x.closePath();
    x.fillStyle = 'rgba(12, 10, 9,0.86)';
    x.fill();
    x.lineWidth = 3;
    x.strokeStyle = ACCENT;
    x.stroke();
    x.fillStyle = ACCENT;
    x.beginPath();
    x.arc(x0 + 42, y0 + 50, 8, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = '#F2EBDF';
    x.textBaseline = 'middle';
    x.fillText(text, x0 + 64, y0 + 53);
    L.tex.needsUpdate = true;
  }
  const labels = [makeLabel(), makeLabel()];
  let curPair = -1;
  const setPair = (i: number) => {
    if (i === curPair) return;
    curPair = i;
    drawLabel(labels[0], PAIRS[i][0]);
    drawLabel(labels[1], PAIRS[i][1]);
  };
  setPair(0);
  document.fonts?.ready.then(() => {
    const p = PAIRS[curPair];
    drawLabel(labels[0], p[0]);
    drawLabel(labels[1], p[1]);
  });

  // --- kamera ve fare ------------------------------------------------------------------------
  const target = new T.Vector3();
  let mx = 0;
  let my = 0;
  const onPointerMove = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  cv.addEventListener('pointermove', onPointerMove);

  const reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const tipW = new T.Vector3();
  const centreW = new T.Vector3();
  const wp = new T.Vector3();
  const dir = new T.Vector3();
  let lastRot: number | null = null;

  return {
    resize(_w, _h, narrow) {
      if (narrow) {
        fig.position.x = 0;
        target.set(0, 0.95, 0);
        cam.position.set(0, 1.2, 8.2);
      } else {
        fig.position.x = 1.05;
        target.set(0.6, 1.0, 0);
        cam.position.set(0.6, 1.22, 6.3);
      }
      ring.position.x = ring2.position.x = ticks.position.x = fig.position.x;
      cam.lookAt(target);
    },

    update(ps, t, dt, narrow) {
      const step = Math.max(0.001, dt);
      // kaydırınca döner, kendi kendine de yavaşça döner
      const rotY = -0.55 + ps * Math.PI * 2 + (reduce ? 0 : t * 0.45);
      const omega = lastRot === null ? 0 : (rotY - lastRot) / step;
      lastRot = rotY;
      fig.rotation.y = rotY;

      ring.rotation.z = t * 0.2;
      ringMat.opacity = 0.35 + 0.25 * Math.sin(t * 2.2);
      for (let i = 1; i < dPos.length; i += 3) {
        dPos[i] += 0.0016;
        if (dPos[i] > 3) dPos[i] = 0;
      }
      dGeo.attributes.position.needsUpdate = true;

      const n = PAIRS.length;
      setPair(Math.min(n - 1, Math.floor(ps * n * 0.999)));

      cam.position.x += ((narrow ? 0 : 0.6) + mx * 0.2 - cam.position.x) * 0.05;
      cam.position.y += ((narrow ? 1.2 : 1.22) - my * 0.1 - cam.position.y) * 0.05;
      cam.lookAt(target);

      fig.updateMatrixWorld(true);
      choreo.update(saber, rig, t, step, ps, omega, reduce);
      fig.updateMatrixWorld(true);

      // iz ve etiketler
      saber.tip.getWorldPosition(tipW);
      saber.body.getWorldPosition(centreW);
      if (!trailInit) {
        for (let q = 0; q < TN; q++) tipW.toArray(trailPos, q * 3);
        trailInit = true;
      }
      trailPos.copyWithin(3, 0, (TN - 1) * 3);
      tipW.toArray(trailPos, 0);
      trailGeo.attributes.position.needsUpdate = true;
      labels.forEach((L, j) => {
        if (j === 0) wp.copy(tipW);
        else wp.copy(centreW).multiplyScalar(2).sub(tipW);
        dir.copy(wp).sub(centreW).normalize();
        L.sp.position.copy(wp).addScaledVector(dir, 0.34);
        L.sp.position.y += 0.06;
      });
      return curPair;
    },

    dispose() {
      disposed = true;
      cv.removeEventListener('pointermove', onPointerMove);
    },
  };
}
