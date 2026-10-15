import * as T from 'three';
import { mk, mkLights, projectStageOptions } from './helpers';
import type { SceneContext, SceneController, StageOptions } from './types';

/** Ev Fiyat sahnesi: sokakta 3 ev; kamera evleri gezer, ilan / model tahmini panoları belirir, uygun evin kapısı açılır. */
export const housesStageOptions: StageOptions = { ...projectStageOptions, loop: 18 };

interface HouseOpts {
  wall: number;
  w: number;
  h: number;
  roof: number;
  ask: string;
  est: string;
  verdict: string;
  over?: boolean;
  good?: boolean;
}

export function createHousesScene(ctx: SceneContext): SceneController {
  const { scene, camera: cam } = ctx;
  scene.fog = new T.Fog(0x0a0a0a, 11, 26);
  const key = mkLights(scene, 10);
  key.intensity = 1.2;
  const dark = new T.MeshStandardMaterial({
    color: 0x26262b,
    roughness: 0.6,
    metalness: 0.25,
    flatShading: true,
  });
  const wood = new T.MeshStandardMaterial({ color: 0x4a3a30, roughness: 0.7 });
  const sage = new T.MeshStandardMaterial({ color: 0x6f7d68, roughness: 0.8, flatShading: true });
  const walk = new T.MeshStandardMaterial({ color: 0x232327, roughness: 0.9 });

  const ground = new T.Mesh(
    new T.PlaneGeometry(80, 80),
    new T.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const lawn = new T.Mesh(
    new T.PlaneGeometry(26, 7),
    new T.MeshStandardMaterial({ color: 0x121512, roughness: 1 }),
  );
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(0, 0.004, -1.2);
  lawn.receiveShadow = true;
  scene.add(lawn);
  const road = new T.Mesh(
    new T.PlaneGeometry(40, 2.6),
    new T.MeshStandardMaterial({ color: 0x1c1c20, roughness: 0.95 }),
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.006, 4.2);
  road.receiveShadow = true;
  scene.add(road);
  mk(new T.BoxGeometry(40, 0.08, 0.9), walk, scene, 0, 0.04, 2.45);
  const dm = new T.MeshBasicMaterial({ color: 0x5f5c55 });
  for (let d = -19; d < 20; d += 1.4) {
    const ds = new T.Mesh(new T.BoxGeometry(0.6, 0.01, 0.06), dm);
    ds.position.set(d, 0.012, 4.2);
    scene.add(ds);
  }

  function house(cx: number, opts: HouseOpts) {
    const g = new T.Group();
    g.position.set(cx, 0, -1.4);
    scene.add(g);
    const wall = new T.MeshStandardMaterial({ color: opts.wall, roughness: 0.6, flatShading: true });
    const W = opts.w;
    const H = opts.h;
    const D = 1.9;
    mk(new T.BoxGeometry(W, H, D), wall, g, 0, H / 2, 0);
    const sh = new T.Shape();
    sh.moveTo(-W / 2 - 0.15, 0);
    sh.lineTo(0, opts.roof);
    sh.lineTo(W / 2 + 0.15, 0);
    sh.lineTo(-W / 2 - 0.15, 0);
    const rg = new T.ExtrudeGeometry(sh, { depth: D + 0.3, bevelEnabled: false });
    mk(rg, dark, g, 0, H, -D / 2 - 0.15);
    mk(new T.BoxGeometry(0.22, 0.6, 0.22), dark, g, W * 0.25, H + opts.roof * 0.6, -0.3);
    const win = new T.MeshStandardMaterial({
      color: 0x1a1f28,
      emissive: 0xffd98a,
      emissiveIntensity: 0,
      roughness: 0.2,
      metalness: 0.5,
    });
    const rows = H > 2 ? [0.75, 1.85] : [0.85];
    rows.forEach((y) => {
      [-W * 0.3, W * 0.3].forEach((x) => {
        mk(new T.BoxGeometry(0.42, 0.42, 0.04), win, g, x, y, D / 2 + 0.01);
        mk(new T.BoxGeometry(0.5, 0.05, 0.08), dark, g, x, y - 0.24, D / 2 + 0.02);
      });
    });
    if (H > 2) mk(new T.BoxGeometry(0.42, 0.42, 0.04), win, g, 0, 1.85, D / 2 + 0.01);
    const doorP = new T.Group();
    doorP.position.set(-0.22, 0.02, D / 2 + 0.02);
    g.add(doorP);
    mk(new T.BoxGeometry(0.44, 0.78, 0.05), wood, doorP, 0.22, 0.39, 0);
    mk(new T.BoxGeometry(0.6, 0.06, 0.4), walk, g, 0, 0.03, D / 2 + 0.2);
    mk(new T.BoxGeometry(0.7, 0.04, 0.12), dark, g, 0, 0.86, D / 2 + 0.06);
    const path = new T.Mesh(new T.PlaneGeometry(0.55, 1.9), walk);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.008, D / 2 + 1.25);
    g.add(path);
    for (let f = -W / 2 - 0.4; f <= W / 2 + 0.4; f += 0.25) {
      if (Math.abs(f) < 0.4) continue;
      mk(new T.BoxGeometry(0.05, 0.32, 0.05), wall, g, f, 0.16, D / 2 + 1.9);
    }
    mk(new T.BoxGeometry(W + 0.9, 0.04, 0.04), wall, g, 0, 0.26, D / 2 + 1.9);
    [-1, 1].forEach((s) => {
      const tx = s * (W / 2 + 0.75);
      mk(new T.CylinderGeometry(0.05, 0.07, 0.5, 6), wood, g, tx, 0.25, 0.4);
      mk(new T.IcosahedronGeometry(0.42, 0), sage, g, tx, 0.85, 0.4);
      mk(new T.IcosahedronGeometry(0.3, 0), sage, g, tx + 0.12, 1.2, 0.35);
    });
    const sign = new T.Group();
    sign.position.set(W / 2 + 0.2, 0, D / 2 + 1.5);
    g.add(sign);
    mk(new T.BoxGeometry(0.04, 0.7, 0.04), wood, sign, 0, 0.35, 0);
    mk(
      new T.BoxGeometry(0.5, 0.26, 0.03),
      new T.MeshStandardMaterial({
        color: opts.good ? 0xffd60a : 0xd9d4c9,
        emissive: opts.good ? 0xffc300 : 0,
        emissiveIntensity: opts.good ? 0.4 : 0,
      }),
      sign,
      0.18,
      0.6,
      0,
    );
    // floating price board
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 300;
    const tex = new T.CanvasTexture(c);
    tex.encoding = T.sRGBEncoding;
    tex.anisotropy = 4;
    const sp = new T.Sprite(
      new T.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false }),
    );
    sp.scale.set(1.55, 0.605, 1);
    sp.position.set(W / 2 + 1.35, 1.45, 1.3);
    sp.renderOrder = 20;
    g.add(sp);
    sp.material.opacity = 0;
    function draw() {
      const x = c.getContext('2d')!;
      x.clearRect(0, 0, 768, 300);
      x.fillStyle = 'rgba(10,10,10,0.9)';
      x.strokeStyle = opts.good ? '#FFD60A' : '#3A3A40';
      x.lineWidth = 4;
      x.beginPath();
      x.moveTo(36, 10);
      x.lineTo(732, 10);
      x.quadraticCurveTo(758, 10, 758, 36);
      x.lineTo(758, 264);
      x.quadraticCurveTo(758, 290, 732, 290);
      x.lineTo(36, 290);
      x.quadraticCurveTo(10, 290, 10, 264);
      x.lineTo(10, 36);
      x.quadraticCurveTo(10, 10, 36, 10);
      x.closePath();
      x.fill();
      x.stroke();
      x.textBaseline = 'alphabetic';
      x.fillStyle = '#8A877F';
      x.font = '500 30px "Geist Mono Variable", "Geist Mono", monospace';
      x.fillText('İLAN', 44, 72);
      x.fillText('MODEL TAHMİNİ', 404, 72);
      x.fillStyle = '#EDEBE6';
      x.font = '500 52px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText(opts.ask, 44, 146);
      x.fillText(opts.est, 404, 146);
      x.fillStyle = '#2A2A2E';
      x.fillRect(380, 40, 2, 130);
      x.fillStyle = opts.good ? '#FFD60A' : opts.over ? '#C9C6BE' : '#A8A59D';
      x.font = '600 40px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText(opts.verdict, 44, 238);
      tex.needsUpdate = true;
    }
    draw();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    return { g, door: doorP, win, sp, cx, W, H, top: 1.45 };
  }
  const H1 = house(-6, {
    wall: 0xbdb7aa,
    w: 2.2,
    h: 1.5,
    roof: 0.9,
    ask: '₺4.850.000',
    est: '₺4.310.000',
    verdict: '%12 pahalı',
    over: true,
  });
  const H2 = house(0, {
    wall: 0xd9d4c9,
    w: 2.0,
    h: 2.6,
    roof: 0.8,
    ask: '₺3.950.000',
    est: '₺3.880.000',
    verdict: 'Piyasa değerinde',
  });
  const H3 = house(6, {
    wall: 0xe6e1d6,
    w: 2.6,
    h: 1.6,
    roof: 1.0,
    ask: '₺3.450.000',
    est: '₺3.920.000',
    verdict: '✓  %12 uygun — bulundu',
    good: true,
  });
  const houses = [H1, H2, H3];
  const glow = new T.PointLight(0xffd98a, 0, 4);
  glow.position.set(6, 1.0, 0.2);
  scene.add(glow);

  const camPos = new T.Vector3(-9, 3.2, 9);
  const look = new T.Vector3(-6, 1, -1);
  function sstep(a: number, b: number, x: number) {
    x = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return x * x * (3 - 2 * x);
  }
  const tP = new T.Vector3();
  const tL = new T.Vector3();
  return {
    update(p, t, _dt, narrow) {
      // segments: approach h1 (0-.22), h2 (.22-.45), h3 (.45-.8), overview (.8-1)
      const keys = [
        [0.0, -9.5, 3.4, 9.5, -6, 1.2],
        [0.16, -5.0, 1.8, 6.0, -5.0, 1.4],
        [0.26, -3, 2.4, 6.5, -1.5, 1.6],
        [0.38, 0.9, 2.2, 6.6, 0.9, 1.7],
        [0.5, 3.2, 2.2, 6.3, 4.5, 1.4],
        [0.66, 6.9, 1.5, 5.0, 6.9, 1.2],
        [0.8, 7.2, 2.1, 6.2, 6.9, 1.5],
        [1.0, 1.5, 7.5, 14.5, 1.2, 1.0],
      ];
      let i = 0;
      while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
      const a = keys[i];
      const b = keys[i + 1];
      const k = sstep(a[0], b[0], p);
      tP.set(a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k);
      tL.set(a[4] + (b[4] - a[4]) * k, a[5] + (b[5] - a[5]) * k, -1.2);
      if (narrow) {
        tP.z += 3;
        tP.y += 0.6;
      }
      camPos.lerp(tP, ctx.k || 0.06);
      look.lerp(tL, ctx.k || 0.06);
      cam.position.copy(camPos);
      cam.lookAt(look);
      const vis = [sstep(0.08, 0.16, p), sstep(0.3, 0.38, p), sstep(0.56, 0.64, p)];
      houses.forEach((h, j) => {
        h.sp.material.opacity = vis[j];
        h.sp.position.y = h.top + Math.sin(t * 1.6 + j) * 0.05;
      });
      const open = sstep(0.6, 0.72, p);
      H3.door.rotation.y = -open * 1.6;
      H3.win.emissiveIntensity = open * 1.4;
      glow.intensity = open * 2.2;
      if (p > 0.66) return 3;
      if (p > 0.36) return 2;
      if (p > 0.14) return 1;
      return 0;
    },
  };
}
