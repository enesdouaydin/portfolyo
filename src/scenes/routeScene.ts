import * as T from 'three';
import { mk, mkLights, projectStageOptions } from './helpers';
import type { SceneContext, SceneController, StageOptions } from './types';

/** Bayi Rota sahnesi: low-poly şehir, yol boyunca ilerleyen araç, 7 bayi pini, sonda kuşbakışı. */
export const routeStageOptions: StageOptions = { ...projectStageOptions, loop: 16 };

export function createRouteScene(ctx: SceneContext): SceneController {
  const { scene, camera: cam } = ctx;
  scene.fog = new T.Fog(0x0c0a09, 10, 26);
  const keyL = mkLights(scene, 14);
  keyL.intensity = 1.15;
  let seed = 7;
  function rnd() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }
  const clay = new T.MeshStandardMaterial({ color: 0xd9d4c9, roughness: 0.6, flatShading: true });
  const clay2 = new T.MeshStandardMaterial({ color: 0xbdb7aa, roughness: 0.65, flatShading: true });
  const clay3 = new T.MeshStandardMaterial({ color: 0x9e988c, roughness: 0.7, flatShading: true });
  const dark = new T.MeshStandardMaterial({ color: 0x26262b, roughness: 0.6, metalness: 0.3 });
  const sage = new T.MeshStandardMaterial({ color: 0x6f7d68, roughness: 0.8, flatShading: true });
  const orange = new T.MeshStandardMaterial({
    color: 0xf0b54a,
    emissive: 0xd9952b,
    emissiveIntensity: 0.8,
    roughness: 0.4,
  });

  const ground = new T.Mesh(
    new T.PlaneGeometry(80, 80),
    new T.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new T.GridHelper(60, 60, 0x1d1d21, 0x18181b);
  grid.position.y = 0.003;
  scene.add(grid);

  const pts = [
    [-11, 7],
    [-8, 7.2],
    [-6, 5],
    [-5.5, 2.5],
    [-3, 1.5],
    [0, 2.2],
    [2, 0],
    [2.5, -2.5],
    [5, -3.5],
    [8, -2.5],
    [10, -4.5],
    [10.5, -7.5],
  ];
  const curve = new T.CatmullRomCurve3(
    pts.map((q) => new T.Vector3(q[0], 0, q[1])),
    false,
    'centripetal',
  );
  const M = 700;
  const samples = curve.getSpacedPoints(M);
  function strip(width: number, y: number, mat: T.Material) {
    const pos = new Float32Array((M + 1) * 2 * 3);
    const idx: number[] = [];
    for (let i = 0; i <= M; i++) {
      const p = samples[i];
      const tg = curve.getTangentAt(i / M);
      const nx = -tg.z;
      const nz = tg.x;
      pos[i * 6] = p.x + (nx * width) / 2;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = p.z + (nz * width) / 2;
      pos[i * 6 + 3] = p.x - (nx * width) / 2;
      pos[i * 6 + 4] = y;
      pos[i * 6 + 5] = p.z - (nz * width) / 2;
      if (i < M) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const m = new T.Mesh(g, mat);
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }
  strip(1.6, 0.006, new T.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95, side: T.DoubleSide }));
  strip(1.25, 0.012, new T.MeshStandardMaterial({ color: 0x2c2c31, roughness: 0.8, side: T.DoubleSide }));
  const trail = strip(0.2, 0.022, new T.MeshBasicMaterial({ color: 0xf0b54a, side: T.DoubleSide }));
  trail.geometry.setDrawRange(0, 0);
  const dashMat = new T.MeshBasicMaterial({ color: 0x77736b });
  for (let dd = 0; dd < M; dd += 9) {
    const tg = curve.getTangentAt(dd / M);
    const dsh = new T.Mesh(new T.BoxGeometry(0.035, 0.01, 0.28), dashMat);
    dsh.position.copy(samples[dd]);
    dsh.position.y = 0.018;
    dsh.rotation.y = Math.atan2(tg.x, tg.z);
    scene.add(dsh);
  }
  function nearRoad(x: number, z: number, r: number) {
    for (let i = 0; i <= M; i += 6) {
      const s = samples[i];
      const dx = s.x - x;
      const dz = s.z - z;
      if (dx * dx + dz * dz < r * r) return true;
    }
    return false;
  }
  // city blocks
  const mats = [clay, clay2, clay3];
  for (let b = 0; b < 120; b++) {
    const x = (rnd() - 0.5) * 34;
    const z = (rnd() - 0.5) * 26;
    if (nearRoad(x, z, 2.1)) continue;
    const w = 0.45 + rnd() * 0.7;
    const dz2 = 0.45 + rnd() * 0.7;
    const h = 0.25 + Math.pow(rnd(), 2.2) * 1.5;
    const bm = mk(new T.BoxGeometry(w, h, dz2), mats[Math.floor(rnd() * 3)], scene, x, h / 2, z);
    bm.rotation.y = Math.round(rnd() * 3) * 0.06;
    if (h > 0.9 && rnd() > 0.5) mk(new T.BoxGeometry(w * 0.4, 0.18, dz2 * 0.4), dark, scene, x, h + 0.09, z);
  }
  for (let tr = 0; tr < 70; tr++) {
    const tx = (rnd() - 0.5) * 34;
    const tz = (rnd() - 0.5) * 26;
    if (nearRoad(tx, tz, 1.25)) continue;
    const s = 0.6 + rnd() * 0.6;
    mk(new T.CylinderGeometry(0.04 * s, 0.05 * s, 0.3 * s, 6), dark, scene, tx, 0.15 * s, tz);
    mk(new T.ConeGeometry(0.28 * s, 0.7 * s, 7), sage, scene, tx, 0.62 * s, tz);
  }
  // depot + destination
  const start = samples[0];
  mk(new T.BoxGeometry(2.2, 1.0, 1.6), clay, scene, start.x - 0.4, 0.5, start.z - 1.6);
  mk(new T.BoxGeometry(2.3, 0.08, 1.7), dark, scene, start.x - 0.4, 1.04, start.z - 1.6);
  mk(new T.BoxGeometry(0.9, 0.6, 0.04), dark, scene, start.x - 0.4, 0.3, start.z - 0.78);
  // stops
  const stopU = [0.11, 0.25, 0.39, 0.53, 0.67, 0.8, 0.985];
  const stops = stopU.map((u, i) => {
    const p = curve.getPointAt(u);
    const tg = curve.getTangentAt(u);
    const side = i % 2 ? 1 : -1;
    const nx = -tg.z * side;
    const nz = tg.x * side;
    const g = new T.Group();
    g.position.set(p.x + nx * 1.35, 0, p.z + nz * 1.35);
    scene.add(g);
    const last = i === stopU.length - 1;
    mk(
      new T.BoxGeometry(last ? 1.3 : 0.8, last ? 0.8 : 0.5, last ? 1.0 : 0.6),
      clay,
      g,
      0,
      last ? 0.4 : 0.25,
      0,
    );
    mk(new T.BoxGeometry(last ? 1.4 : 0.88, 0.05, last ? 1.1 : 0.68), dark, g, 0, last ? 0.82 : 0.52, 0);
    const awn = mk(new T.BoxGeometry(last ? 1.3 : 0.8, 0.04, 0.22), dark, g, 0, last ? 0.55 : 0.36, 0);
    awn.position.x = 0;
    awn.position.z = 0;
    awn.lookAt(new T.Vector3(g.position.x - nx, awn.position.y, g.position.z - nz));
    const pinMat = new T.MeshStandardMaterial({ color: 0x5a5852, emissive: 0x000000, roughness: 0.5 });
    const pin = new T.Group();
    pin.position.set(0, last ? 1.7 : 1.3, 0);
    g.add(pin);
    mk(new T.SphereGeometry(0.17, 16, 12), pinMat, pin, 0, 0.12, 0);
    const cone = mk(new T.ConeGeometry(0.12, 0.3, 12), pinMat, pin, 0, -0.1, 0);
    cone.rotation.x = Math.PI;
    const ringM = new T.MeshBasicMaterial({ color: 0xf0b54a, transparent: true, opacity: 0 });
    const ring = new T.Mesh(new T.RingGeometry(0.55, 0.62, 48), ringM);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    g.add(ring);
    return { u, pin, mat: pinMat, ring, ringM, on: false, t: 0 };
  });
  // car
  const car = new T.Group();
  scene.add(car);
  const white = new T.MeshStandardMaterial({ color: 0xf1eee7, roughness: 0.35, metalness: 0.1 });
  const glass = new T.MeshStandardMaterial({ color: 0x141821, roughness: 0.15, metalness: 0.7 });
  mk(new T.BoxGeometry(0.52, 0.22, 1.0), white, car, 0, 0.22, 0);
  mk(new T.BoxGeometry(0.5, 0.05, 1.02), orange, car, 0, 0.25, 0);
  mk(new T.BoxGeometry(0.46, 0.22, 0.56), glass, car, 0, 0.43, -0.07);
  mk(new T.BoxGeometry(0.47, 0.035, 0.52), white, car, 0, 0.555, -0.07);
  mk(new T.BoxGeometry(0.54, 0.07, 0.06), dark, car, 0, 0.14, 0.5);
  mk(new T.BoxGeometry(0.54, 0.07, 0.06), dark, car, 0, 0.14, -0.5);
  const hl = new T.MeshBasicMaterial({ color: 0xfff6e8 });
  mk(new T.BoxGeometry(0.1, 0.05, 0.02), hl, car, 0.17, 0.25, 0.505);
  mk(new T.BoxGeometry(0.1, 0.05, 0.02), hl, car, -0.17, 0.25, 0.505);
  const tl = new T.MeshBasicMaterial({ color: 0xff3a1a });
  mk(new T.BoxGeometry(0.1, 0.04, 0.02), tl, car, 0.18, 0.26, -0.505);
  mk(new T.BoxGeometry(0.1, 0.04, 0.02), tl, car, -0.18, 0.26, -0.505);
  const wheels: T.Group[] = [];
  [
    [0.27, 0.32],
    [-0.27, 0.32],
    [0.27, -0.32],
    [-0.27, -0.32],
  ].forEach((w) => {
    const wg = new T.Group();
    wg.position.set(w[0], 0.12, w[1]);
    car.add(wg);
    const wm = mk(new T.CylinderGeometry(0.12, 0.12, 0.09, 18), dark, wg, 0, 0, 0);
    wm.rotation.z = Math.PI / 2;
    const hub = mk(new T.CylinderGeometry(0.05, 0.05, 0.095, 10), white, wg, 0, 0, 0);
    hub.rotation.z = Math.PI / 2;
    wheels.push(wg);
  });
  const beam = new T.SpotLight(0xfff1dd, 2.2, 6, 0.5, 0.6, 1.2);
  beam.position.set(0, 0.3, 0.5);
  car.add(beam);
  const beamT = new T.Object3D();
  beamT.position.set(0, 0, 3);
  car.add(beamT);
  beam.target = beamT;

  const camPos = new T.Vector3(-14, 9, 14);
  const look = new T.Vector3();
  const tmp = new T.Vector3();
  const fwd = new T.Vector3();
  const over = new T.Vector3(0.5, 19, 15);
  const overLook = new T.Vector3(0, 0, 0);
  let lastU = 0;
  function ease(x: number) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }
  function sstep(a: number, b: number, x: number) {
    x = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return x * x * (3 - 2 * x);
  }
  return {
    update(p, t, _dt, narrow) {
      const u = ease(Math.min(1, p / 0.84)) * 0.995;
      const pos = curve.getPointAt(u);
      const tg = curve.getTangentAt(u);
      car.position.set(pos.x, 0.0, pos.z);
      car.lookAt(tmp.set(pos.x + tg.x, 0, pos.z + tg.z));
      const dist = (u - lastU) * curve.getLength();
      lastU = u;
      wheels.forEach((w) => {
        w.rotation.x += dist / 0.12;
      });
      car.position.y = Math.abs(Math.sin(t * 9)) * 0.006 * (p < 0.84 ? 1 : 0);
      trail.geometry.setDrawRange(0, Math.floor(u * M) * 6);
      let visited = 0;
      stops.forEach((s) => {
        const on = u >= s.u - 0.012;
        if (on) visited++;
        if (on !== s.on) {
          s.on = on;
          s.t = t;
          s.mat.color.set(on ? 0xf0b54a : 0x5a5852);
          s.mat.emissive.set(on ? 0xd9952b : 0x000000);
          s.mat.emissiveIntensity = on ? 0.9 : 0;
        }
        const k = on ? Math.min(1, (t - s.t) * 3) : 0;
        const bounce = on ? 1 + Math.sin(Math.min(1, (t - s.t) * 2.5) * Math.PI) * 0.45 : 1;
        s.pin.scale.setScalar(bounce);
        s.pin.position.y = (s === stops[stops.length - 1] ? 1.7 : 1.3) + Math.sin(t * 2 + s.u * 10) * 0.05;
        s.pin.rotation.y = t * 0.8;
        s.ringM.opacity = on ? 0.35 + 0.25 * Math.sin(t * 3) : 0;
        s.ring.scale.setScalar(on ? 1 + k * 0.2 : 1);
      });
      fwd.set(tg.x, 0, tg.z).normalize();
      const chase = tmp.set(
        pos.x - fwd.x * 4.2 + fwd.z * 2.2,
        narrow ? 4.4 : 3.4,
        pos.z - fwd.z * 4.2 - fwd.x * 2.2,
      );
      const w = sstep(0.82, 1.0, p);
      const w0 = 1 - sstep(0.0, 0.06, p);
      const target = chase.clone().lerp(over, Math.max(w, w0 * 0.85));
      camPos.lerp(target, ctx.k || 0.06);
      cam.position.copy(camPos);
      const lk = new T.Vector3(pos.x + fwd.x * 1.6, 0.3, pos.z + fwd.z * 1.6).lerp(
        overLook,
        Math.max(w, w0 * 0.85),
      );
      look.lerp(lk, Math.min(1, (ctx.k || 0.06) * 1.4));
      cam.lookAt(look);
      return visited;
    },
  };
}
