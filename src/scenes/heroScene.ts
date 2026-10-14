import * as T from 'three';
import { PAIRS } from '../data/home';
import { mk } from './helpers';
import type { SceneContext, SceneController, StageOptions } from './types';

/** Ana sayfa hero sahnesi: çift uçlu ışık kılıçlı karakter (tasarım: Main.dc.html · init3d). */
export const heroStageOptions: StageOptions = {
  fov: 30,
  near: 0.1,
  far: 60,
  loop: 21, // çift başına ~1 sn (21 çift)
  progressAt: (cyc) => (cyc < 0.9 ? cyc / 0.9 : 1 - (cyc - 0.9) / 0.1),
  smooth: () => 0.075,
};

interface Label {
  c: HTMLCanvasElement;
  tex: T.CanvasTexture;
  sp: T.Sprite;
  text: string;
}

export function createHeroScene({ scene, camera: cam, canvas: cv }: SceneContext): SceneController {
  scene.fog = new T.Fog(0x0a0a0a, 6.5, 13);

  scene.add(new T.HemisphereLight(0xf2efe8, 0x0a0a0a, 0.45));
  const key = new T.DirectionalLight(0xfff1e4, 1.5);
  key.position.set(2.6, 4.2, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -3;
  key.shadow.camera.right = 3;
  key.shadow.camera.top = 3;
  key.shadow.camera.bottom = -1;
  key.shadow.radius = 4;
  scene.add(key);
  const rim = new T.DirectionalLight(0x7d93ff, 1.1);
  rim.position.set(-3.5, 2.6, -3);
  scene.add(rim);
  const rim2 = new T.DirectionalLight(0xffe08a, 0.5);
  rim2.position.set(3.5, 1.5, -2.5);
  scene.add(rim2);

  const floor = new T.Mesh(
    new T.CircleGeometry(9, 64),
    new T.MeshStandardMaterial({ color: 0x050506, roughness: 1, metalness: 0 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const ringMat = new T.MeshBasicMaterial({ color: 0xffd60a, transparent: true, opacity: 0.55 });
  const ring = new T.Mesh(new T.RingGeometry(0.92, 0.935, 128), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.003;
  scene.add(ring);
  const ring2 = new T.Mesh(
    new T.RingGeometry(1.7, 1.705, 128),
    new T.MeshBasicMaterial({ color: 0x3a3a40, transparent: true, opacity: 0.8 }),
  );
  ring2.rotation.x = -Math.PI / 2;
  ring2.position.y = 0.003;
  scene.add(ring2);
  const ticks = new T.Group();
  for (let k = 0; k < 48; k++) {
    const tk = new T.Mesh(
      new T.PlaneGeometry(0.012, k % 4 === 0 ? 0.12 : 0.05),
      new T.MeshBasicMaterial({ color: 0x55534e }),
    );
    const a = (k / 48) * Math.PI * 2;
    tk.rotation.x = -Math.PI / 2;
    tk.rotation.z = -a;
    tk.position.set(Math.sin(a) * 1.78, 0.004, Math.cos(a) * 1.78);
    ticks.add(tk);
  }
  scene.add(ticks);

  // dust
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
  const dust = new T.Points(
    dGeo,
    new T.PointsMaterial({
      color: 0x8a877f,
      size: 0.014,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
  );
  scene.add(dust);

  // materials
  const clay = new T.MeshStandardMaterial({
    color: 0xd9d4c9,
    roughness: 0.5,
    metalness: 0.05,
    flatShading: true,
  });
  const dark = new T.MeshStandardMaterial({
    color: 0x2a2a30,
    roughness: 0.55,
    metalness: 0.35,
    flatShading: true,
  });
  const clayS = new T.MeshStandardMaterial({ color: 0xd9d4c9, roughness: 0.48, metalness: 0.05 });
  const darkS = new T.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.5, metalness: 0.35 });
  const trim = new T.MeshStandardMaterial({
    color: 0xffd60a,
    emissive: 0xffc300,
    emissiveIntensity: 0.9,
    roughness: 0.4,
  });
  const visorMat = new T.MeshBasicMaterial({ color: 0xffe066 });

  const fig = new T.Group();
  scene.add(fig);
  // torso
  mk(new T.BoxGeometry(0.34, 0.16, 0.21), dark, fig, 0, 0.99, 0);
  mk(new T.BoxGeometry(0.37, 0.045, 0.23), dark, fig, 0, 1.08, 0);
  const torso = mk(new T.CylinderGeometry(0.17, 0.13, 0.4, 7), clay, fig, 0, 1.25, 0);
  torso.scale.set(1, 1, 0.74);
  mk(new T.BoxGeometry(0.42, 0.22, 0.26), clay, fig, 0, 1.39, 0);
  mk(new T.BoxGeometry(0.07, 0.07, 0.02), trim, fig, 0, 1.41, 0.135);
  mk(new T.BoxGeometry(0.2, 0.016, 0.02), dark, fig, 0, 1.33, 0.132);
  mk(new T.CylinderGeometry(0.05, 0.062, 0.08, 6), dark, fig, 0, 1.54, 0);
  // backpack
  mk(new T.BoxGeometry(0.26, 0.3, 0.1), dark, fig, 0, 1.3, -0.16);
  mk(new T.BoxGeometry(0.03, 0.22, 0.02), trim, fig, 0.08, 1.3, -0.215);
  // head
  const head = new T.Group();
  head.position.set(0, 1.67, 0);
  fig.add(head);
  const helm = mk(new T.IcosahedronGeometry(0.135, 1), clay, head, 0, 0, 0);
  helm.scale.set(1, 1.08, 1.06);
  mk(new T.BoxGeometry(0.2, 0.042, 0.07), visorMat, head, 0, 0.012, 0.105);
  mk(new T.BoxGeometry(0.13, 0.05, 0.08), dark, head, 0, -0.085, 0.07);
  mk(new T.BoxGeometry(0.022, 0.09, 0.18), dark, head, 0, 0.13, -0.01);
  mk(new T.BoxGeometry(0.03, 0.06, 0.06), dark, head, 0.14, 0, 0);
  mk(new T.BoxGeometry(0.03, 0.06, 0.06), dark, head, -0.14, 0, 0);
  const visorLight = new T.PointLight(0xffd34d, 0.35, 0.8);
  visorLight.position.set(0, 0.01, 0.22);
  head.add(visorLight);

  // shoulders + arms
  const arms: { sh: T.Group; el: T.Group; s: number; glove: T.Mesh }[] = [];
  [-1, 1].forEach((s) => {
    const pad = mk(new T.BoxGeometry(0.16, 0.085, 0.19), clay, fig, s * 0.27, 1.48, 0);
    pad.rotation.z = s * -0.32;
    const sh = new T.Group();
    sh.position.set(s * 0.27, 1.43, 0);
    fig.add(sh);
    mk(new T.CapsuleGeometry(0.056, 0.18, 6, 14), clayS, sh, 0, -0.14, 0);
    const el = new T.Group();
    el.position.set(0, -0.29, 0);
    sh.add(el);
    mk(new T.CapsuleGeometry(0.05, 0.19, 6, 14), darkS, el, 0, -0.13, 0);
    mk(new T.BoxGeometry(0.085, 0.06, 0.09), clay, el, 0, -0.06, 0);
    const glove = mk(new T.SphereGeometry(0.058, 14, 10), darkS, el, 0, -0.28, 0);
    arms.push({ sh, el, s, glove });
  });

  // legs
  [-1, 1].forEach((s) => {
    const hip = new T.Group();
    hip.position.set(s * 0.1, 0.95, 0);
    fig.add(hip);
    hip.rotation.z = s * 0.13;
    hip.rotation.x = s * 0.16;
    mk(new T.CapsuleGeometry(0.072, 0.26, 6, 14), darkS, hip, 0, -0.2, 0);
    const knee = new T.Group();
    knee.position.set(0, -0.41, 0);
    hip.add(knee);
    knee.rotation.x = 0.22;
    mk(new T.BoxGeometry(0.11, 0.1, 0.06), clay, knee, 0, 0, 0.06);
    mk(new T.CapsuleGeometry(0.062, 0.26, 6, 14), clayS, knee, 0, -0.2, 0);
    const boot = mk(new T.BoxGeometry(0.13, 0.085, 0.24), dark, knee, 0, -0.42, 0.035);
    boot.rotation.x = -0.22 - s * 0.16;
  });

  // staff
  const staffPivot = new T.Group();
  staffPivot.position.set(0, 1.12, 0.42);
  fig.add(staffPivot);
  const staff = new T.Group();
  staffPivot.add(staff);
  const handle = mk(new T.CylinderGeometry(0.024, 0.024, 0.48, 10), dark, staff, 0, 0, 0);
  handle.rotation.z = Math.PI / 2;
  [-0.2, -0.12, 0.12, 0.2].forEach((x) => {
    const r = mk(new T.CylinderGeometry(0.031, 0.031, 0.025, 10), trim, staff, x, 0, 0);
    r.rotation.z = Math.PI / 2;
  });
  const core = new T.MeshBasicMaterial({ color: 0xfff1e6 });
  const g1 = new T.MeshBasicMaterial({
    color: 0xffd60a,
    transparent: true,
    opacity: 0.5,
    blending: T.AdditiveBlending,
    depthWrite: false,
  });
  const g2 = new T.MeshBasicMaterial({
    color: 0xffc300,
    transparent: true,
    opacity: 0.14,
    blending: T.AdditiveBlending,
    depthWrite: false,
  });
  const tips: T.Object3D[] = [];
  [-1, 1].forEach((s) => {
    const em = mk(new T.CylinderGeometry(0.036, 0.03, 0.06, 10), clay, staff, s * 0.27, 0, 0);
    em.rotation.z = Math.PI / 2;
    const c = mk(new T.CylinderGeometry(0.013, 0.015, 0.9, 8), core, staff, s * 0.75, 0, 0);
    c.rotation.z = Math.PI / 2;
    c.castShadow = false;
    const h1 = new T.Mesh(new T.CylinderGeometry(0.036, 0.04, 0.93, 12), g1);
    h1.rotation.z = Math.PI / 2;
    h1.position.set(s * 0.75, 0, 0);
    staff.add(h1);
    const h2 = new T.Mesh(new T.CylinderGeometry(0.085, 0.09, 0.98, 12), g2);
    h2.rotation.z = Math.PI / 2;
    h2.position.set(s * 0.75, 0, 0);
    staff.add(h2);
    const pl = new T.PointLight(0xffd34d, 1.0, 1.8);
    pl.position.set(s * 0.7, 0, 0);
    staff.add(pl);
    const tip = new T.Object3D();
    tip.position.set(s * 1.2, 0, 0);
    staff.add(tip);
    tips.push(tip);
  });

  // trails
  const TN = 20;
  const trails = tips.map(() => {
    const pos = new Float32Array(TN * 3);
    const col = new Float32Array(TN * 3);
    for (let i = 0; i < TN; i++) {
      const f = Math.pow(1 - i / TN, 1.6);
      col[i * 3] = 0.75 * f;
      col[i * 3 + 1] = 0.27 * f;
      col[i * 3 + 2] = 0.09 * f;
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('color', new T.BufferAttribute(col, 3));
    const line = new T.Line(
      g,
      new T.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: T.AdditiveBlending,
        depthWrite: false,
      }),
    );
    line.frustumCulled = false;
    scene.add(line);
    return { pos, geo: g, init: false };
  });

  // labels
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
    return { c, tex, sp, text: '' };
  }
  function drawLabel(L: Label, text: string) {
    L.text = text;
    const x = L.c.getContext('2d')!;
    x.clearRect(0, 0, 640, 144);
    x.font = '500 54px Geist, "Helvetica Neue", Arial, sans-serif';
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
    x.fillStyle = 'rgba(10,10,10,0.86)';
    x.fill();
    x.lineWidth = 3;
    x.strokeStyle = '#FFD60A';
    x.stroke();
    x.fillStyle = '#FFD60A';
    x.beginPath();
    x.arc(x0 + 42, y0 + 50, 8, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = '#EDEBE6';
    x.textBaseline = 'middle';
    x.fillText(text, x0 + 64, y0 + 53);
    L.tex.needsUpdate = true;
  }
  const labels = [makeLabel(), makeLabel()];
  let curPair = -1;
  function setPair(i: number) {
    if (i === curPair) return;
    curPair = i;
    const p = PAIRS[i];
    drawLabel(labels[0], p[0]);
    drawLabel(labels[1], p[1]);
  }
  setPair(0);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      const p = PAIRS[curPair];
      drawLabel(labels[0], p[0]);
      drawLabel(labels[1], p[1]);
    });
  }

  // layout
  const target = new T.Vector3();

  let mx = 0;
  let my = 0;
  const onPointerMove = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  cv.addEventListener('pointermove', onPointerMove);

  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const wp = new T.Vector3();
  const cpos = new T.Vector3();
  const dir = new T.Vector3();
  const gA = new T.Vector3();
  const gB = new T.Vector3();

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

    update(ps, t, _dt, narrow) {
      fig.rotation.y = -0.55 + ps * Math.PI * 2;
      fig.position.y = Math.sin(t * 1.7) * 0.008;
      const spin = ps * Math.PI * 7 + (reduce ? 0 : t * 0.35);
      staff.rotation.z = spin;
      staffPivot.rotation.y = Math.sin(ps * Math.PI * 5) * 0.55;
      staffPivot.rotation.x = Math.sin(ps * Math.PI * 3) * 0.35 - 0.1;
      arms.forEach((A) => {
        A.sh.rotation.x = -0.95 + Math.sin(ps * Math.PI * 4) * 0.25 + staffPivot.rotation.x * 0.4;
        A.sh.rotation.z = A.s * -0.5;
        A.sh.rotation.y = A.s * 0.1 + staffPivot.rotation.y * 0.4;
        A.el.rotation.x = -0.75;
      });
      head.rotation.y = -staffPivot.rotation.y * 0.35;
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
      arms[0].glove.getWorldPosition(gA);
      arms[1].glove.getWorldPosition(gB);
      gA.add(gB).multiplyScalar(0.5);
      fig.worldToLocal(gA);
      staffPivot.position.copy(gA);
      fig.updateMatrixWorld(true);
      tips.forEach((tip, j) => {
        tip.getWorldPosition(wp);
        const tr = trails[j];
        if (!tr.init) {
          for (let q = 0; q < TN; q++) {
            tr.pos[q * 3] = wp.x;
            tr.pos[q * 3 + 1] = wp.y;
            tr.pos[q * 3 + 2] = wp.z;
          }
          tr.init = true;
        }
        tr.pos.copyWithin(3, 0, (TN - 1) * 3);
        tr.pos[0] = wp.x;
        tr.pos[1] = wp.y;
        tr.pos[2] = wp.z;
        tr.geo.attributes.position.needsUpdate = true;
        staff.getWorldPosition(cpos);
        dir.copy(wp).sub(cpos).normalize();
        labels[j].sp.position.copy(wp).addScaledVector(dir, 0.34);
        labels[j].sp.position.y += 0.06;
      });
      return curPair;
    },

    dispose() {
      cv.removeEventListener('pointermove', onPointerMove);
    },
  };
}
