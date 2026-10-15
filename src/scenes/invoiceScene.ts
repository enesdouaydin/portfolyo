import * as T from 'three';
import { mk, mkLights, projectStageOptions } from './helpers';
import type { SceneContext, SceneController, StageOptions } from './types';

/** KDV İade sahnesi: telefonla fatura okutan figür, tarama ışını, alan çerçeveleri, "Gelen" tepsisi, ekran paneli. */
export const invoiceStageOptions: StageOptions = { ...projectStageOptions, loop: 20 };

type Ctx2D = CanvasRenderingContext2D;

export function createInvoiceScene(ctx: SceneContext): SceneController {
  const { scene, camera: cam } = ctx;
  scene.fog = new T.Fog(0x0a0a0a, 6, 14);
  const key = mkLights(scene, 4);
  key.intensity = 1.25;
  const Y = 0xffd60a;
  function rr(x: Ctx2D, X: number, y: number, w: number, h: number, r: number) {
    x.beginPath();
    x.moveTo(X + r, y);
    x.lineTo(X + w - r, y);
    x.quadraticCurveTo(X + w, y, X + w, y + r);
    x.lineTo(X + w, y + h - r);
    x.quadraticCurveTo(X + w, y + h, X + w - r, y + h);
    x.lineTo(X + r, y + h);
    x.quadraticCurveTo(X, y + h, X, y + h - r);
    x.lineTo(X, y + r);
    x.quadraticCurveTo(X, y, X + r, y);
    x.closePath();
  }
  const clay = new T.MeshStandardMaterial({ color: 0xd9d4c9, roughness: 0.5, flatShading: true });
  const clayS = new T.MeshStandardMaterial({ color: 0xd9d4c9, roughness: 0.48 });
  const dark = new T.MeshStandardMaterial({
    color: 0x2a2a30,
    roughness: 0.55,
    metalness: 0.35,
    flatShading: true,
  });
  const darkS = new T.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.5, metalness: 0.35 });
  const trim = new T.MeshStandardMaterial({ color: Y, emissive: 0xffc300, emissiveIntensity: 0.9 });

  const floor = new T.Mesh(
    new T.CircleGeometry(12, 64),
    new T.MeshStandardMaterial({ color: 0x060606, roughness: 1 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const ring = new T.Mesh(new T.RingGeometry(0.7, 0.712, 96), new T.MeshBasicMaterial({ color: 0x3a3a3a }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(-1.35, 0.003, 0.2);
  scene.add(ring);

  // ---- figure
  const fig = new T.Group();
  fig.position.set(-1.35, 0, 0.2);
  fig.rotation.y = 1.05;
  scene.add(fig);
  mk(new T.BoxGeometry(0.34, 0.16, 0.21), dark, fig, 0, 0.99, 0);
  mk(new T.BoxGeometry(0.37, 0.045, 0.23), dark, fig, 0, 1.08, 0);
  const torso = mk(new T.CylinderGeometry(0.17, 0.13, 0.4, 7), clay, fig, 0, 1.25, 0);
  torso.scale.set(1, 1, 0.74);
  mk(new T.BoxGeometry(0.42, 0.22, 0.26), clay, fig, 0, 1.39, 0);
  mk(new T.BoxGeometry(0.07, 0.07, 0.02), trim, fig, 0, 1.41, 0.135);
  mk(new T.CylinderGeometry(0.05, 0.062, 0.08, 6), dark, fig, 0, 1.54, 0);
  const head = new T.Group();
  head.position.set(0, 1.67, 0);
  fig.add(head);
  const helm = mk(new T.IcosahedronGeometry(0.135, 1), clay, head, 0, 0, 0);
  helm.scale.set(1, 1.08, 1.06);
  mk(
    new T.BoxGeometry(0.2, 0.042, 0.07),
    new T.MeshBasicMaterial({ color: 0xffe066 }),
    head,
    0,
    0.012,
    0.105,
  );
  mk(new T.BoxGeometry(0.13, 0.05, 0.08), dark, head, 0, -0.085, 0.07);
  mk(new T.BoxGeometry(0.022, 0.09, 0.18), dark, head, 0, 0.13, -0.01);
  head.rotation.x = 0.28;
  const arms: Record<number, { sh: T.Group; el: T.Group }> = {};
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
    mk(new T.SphereGeometry(0.058, 14, 10), darkS, el, 0, -0.28, 0);
    arms[s] = { sh, el };
  });
  [-1, 1].forEach((s) => {
    const hip = new T.Group();
    hip.position.set(s * 0.1, 0.95, 0);
    fig.add(hip);
    hip.rotation.z = s * 0.06;
    mk(new T.CapsuleGeometry(0.072, 0.26, 6, 14), darkS, hip, 0, -0.2, 0);
    const knee = new T.Group();
    knee.position.set(0, -0.41, 0);
    hip.add(knee);
    knee.rotation.x = 0.05;
    mk(new T.BoxGeometry(0.11, 0.1, 0.06), clay, knee, 0, 0, 0.06);
    mk(new T.CapsuleGeometry(0.062, 0.26, 6, 14), clayS, knee, 0, -0.2, 0);
    mk(new T.BoxGeometry(0.13, 0.085, 0.24), dark, knee, 0, -0.42, 0.035);
  });
  const down = new T.Vector3(0, -1, 0);
  function poseArm(A: { sh: T.Group; el: T.Group }, shP: T.Vector3, elP: T.Vector3, hdP: T.Vector3) {
    const d1 = elP.clone().sub(shP).normalize();
    const d2 = hdP.clone().sub(elP).normalize();
    const qS = new T.Quaternion().setFromUnitVectors(down, d1);
    A.sh.quaternion.copy(qS);
    A.el.quaternion.copy(
      new T.Quaternion().setFromUnitVectors(down, d2.clone().applyQuaternion(qS.clone().invert())),
    );
  }
  poseArm(
    arms[-1],
    new T.Vector3(-0.27, 1.43, 0),
    new T.Vector3(-0.3, 1.2, 0.22),
    new T.Vector3(-0.08, 1.3, 0.44),
  );
  poseArm(
    arms[1],
    new T.Vector3(0.27, 1.43, 0),
    new T.Vector3(0.32, 1.18, 0.18),
    new T.Vector3(0.08, 1.28, 0.42),
  );

  // phone (screen shares the big panel texture)
  const sc = document.createElement('canvas');
  sc.width = 450;
  sc.height = 900;
  const stex = new T.CanvasTexture(sc);
  stex.encoding = T.sRGBEncoding;
  stex.anisotropy = 4;
  const phone = new T.Group();
  phone.position.set(0, 1.31, 0.45);
  phone.rotation.set(-0.5, 0, 0);
  fig.add(phone);
  mk(new T.BoxGeometry(0.15, 0.3, 0.018), dark, phone, 0, 0, 0);
  const pscr = new T.Mesh(new T.PlaneGeometry(0.135, 0.27), new T.MeshBasicMaterial({ map: stex }));
  pscr.position.z = -0.0101;
  pscr.rotation.y = Math.PI;
  phone.add(pscr);
  const lens = new T.Object3D();
  lens.position.set(0, 0.1, 0.012);
  phone.add(lens);

  // invoice on a stand
  mk(new T.CylinderGeometry(0.08, 0.12, 0.8, 16), dark, scene, -0.25, 0.4, 0.75);
  const ic = document.createElement('canvas');
  ic.width = 600;
  ic.height = 800;
  const itex = new T.CanvasTexture(ic);
  itex.encoding = T.sRGBEncoding;
  itex.anisotropy = 4;
  (function drawInvoice() {
    const x = ic.getContext('2d')!;
    x.fillStyle = '#F7F5EF';
    x.fillRect(0, 0, 600, 800);
    x.fillStyle = '#0A0A0A';
    x.font = '700 46px "Geist Variable", Geist, Arial, sans-serif';
    x.fillText('FATURA', 40, 80);
    x.font = '400 22px "Geist Mono Variable", "Geist Mono", monospace';
    x.fillStyle = '#55534E';
    x.fillText('No: ÖRN-2026-0412', 360, 60);
    x.fillText('Tarih: 12.10.2026', 360, 92);
    x.fillStyle = '#0A0A0A';
    x.font = '600 24px "Geist Variable", Geist, Arial, sans-serif';
    x.fillText('Satıcı: Örnek Tedarik Ltd.', 40, 160);
    x.font = '400 22px "Geist Variable", Geist, Arial, sans-serif';
    x.fillStyle = '#55534E';
    x.fillText('Alıcı: Firmanız', 40, 196);
    x.fillStyle = '#E3E0D8';
    x.fillRect(40, 240, 520, 2);
    const rows = [
      ['Ürün / hizmet', 'Tutar'],
      ['Ambalaj malzemesi', '₺7.500,00'],
      ['Nakliye', '₺3.000,00'],
      ['Depolama', '₺2.000,00'],
    ];
    rows.forEach((r, i) => {
      x.font = (i ? '400 ' : '600 ') + '22px "Geist Variable", Geist, Arial, sans-serif';
      x.fillStyle = i ? '#2A2A2A' : '#0A0A0A';
      x.fillText(r[0], 40, 290 + i * 48);
      x.fillText(r[1], 430, 290 + i * 48);
    });
    x.fillStyle = '#E3E0D8';
    x.fillRect(40, 470, 520, 2);
    x.fillStyle = '#2A2A2A';
    x.font = '400 24px "Geist Variable", Geist, Arial, sans-serif';
    x.fillText('Matrah', 40, 530);
    x.fillText('₺12.500,00', 410, 530);
    x.fillText('KDV %20', 40, 580);
    x.fillText('₺2.500,00', 420, 580);
    x.fillStyle = '#0A0A0A';
    x.font = '700 30px "Geist Variable", Geist, Arial, sans-serif';
    x.fillText('TOPLAM', 40, 650);
    x.fillText('₺15.000,00', 380, 650);
    x.fillStyle = '#9A978F';
    x.font = '400 18px "Geist Mono Variable", "Geist Mono", monospace';
    x.fillText('örnek fatura', 40, 760);
    itex.needsUpdate = true;
  })();
  const inv = new T.Group();
  scene.add(inv);
  const paper = new T.Mesh(
    new T.PlaneGeometry(0.42, 0.56),
    new T.MeshStandardMaterial({ map: itex, roughness: 0.9, side: T.DoubleSide }),
  );
  paper.castShadow = true;
  inv.add(paper);
  const beam = new T.Mesh(
    new T.PlaneGeometry(0.46, 0.012),
    new T.MeshBasicMaterial({
      color: Y,
      transparent: true,
      opacity: 0,
      blending: T.AdditiveBlending,
      depthWrite: false,
    }),
  );
  beam.position.z = 0.004;
  inv.add(beam);
  const glowBand = new T.Mesh(
    new T.PlaneGeometry(0.46, 0.08),
    new T.MeshBasicMaterial({
      color: Y,
      transparent: true,
      opacity: 0,
      blending: T.AdditiveBlending,
      depthWrite: false,
    }),
  );
  glowBand.position.z = 0.003;
  inv.add(glowBand);
  // field highlight frames (invoice canvas px -> plane units)
  function frame(px: number, py: number, pw: number, ph: number) {
    const w = (pw / 600) * 0.42;
    const h = (ph / 800) * 0.56;
    const cx = ((px + pw / 2) / 600) * 0.42 - 0.21;
    const cy = 0.28 - ((py + ph / 2) / 800) * 0.56;
    const g = new T.BufferGeometry().setFromPoints([
      new T.Vector3(-w / 2, -h / 2, 0),
      new T.Vector3(w / 2, -h / 2, 0),
      new T.Vector3(w / 2, h / 2, 0),
      new T.Vector3(-w / 2, h / 2, 0),
    ]);
    const l = new T.LineLoop(g, new T.LineBasicMaterial({ color: 0xe0a800, transparent: true, opacity: 0 }));
    l.position.set(cx, cy, 0.006);
    inv.add(l);
    return l;
  }
  const frames = [
    frame(30, 130, 380, 44),
    frame(350, 36, 230, 66),
    frame(30, 500, 540, 100),
    frame(30, 616, 540, 50),
  ];
  const invHome = new T.Vector3(-0.25, 1.1, 0.75);
  inv.position.copy(invHome);
  inv.rotation.set(-0.75, -0.35, 0);
  // scan cone from phone lens to beam
  const conePos = new Float32Array(9);
  const coneGeo = new T.BufferGeometry();
  coneGeo.setAttribute('position', new T.BufferAttribute(conePos, 3));
  const cone = new T.Mesh(
    coneGeo,
    new T.MeshBasicMaterial({
      color: Y,
      transparent: true,
      opacity: 0,
      side: T.DoubleSide,
      blending: T.AdditiveBlending,
      depthWrite: false,
    }),
  );
  cone.frustumCulled = false;
  scene.add(cone);

  // trays
  function label(text: string, sub: string) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 160;
    const x = c.getContext('2d')!;
    x.fillStyle = 'rgba(10,10,10,0.88)';
    rr(x, 8, 8, 496, 144, 20);
    x.fill();
    x.strokeStyle = '#3A3A3A';
    x.lineWidth = 3;
    rr(x, 8, 8, 496, 144, 20);
    x.stroke();
    x.fillStyle = '#F2F0EA';
    x.font = '600 52px "Geist Variable", Geist, Arial, sans-serif';
    x.fillText(text, 36, 76);
    x.fillStyle = '#A3A3A3';
    x.font = '400 28px "Geist Mono Variable", "Geist Mono", monospace';
    x.fillText(sub, 36, 124);
    const t = new T.CanvasTexture(c);
    t.encoding = T.sRGBEncoding;
    const sp = new T.Sprite(new T.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
    sp.scale.set(0.62, 0.194, 1);
    return { sp, c, t };
  }
  function tray(x: number, z: number, title: string, sub: string) {
    const g = new T.Group();
    g.position.set(x, 0, z);
    scene.add(g);
    const m = new T.MeshStandardMaterial({
      color: 0x1c1c1f,
      roughness: 0.6,
      metalness: 0.3,
      emissive: Y,
      emissiveIntensity: 0,
    });
    mk(new T.BoxGeometry(0.62, 0.06, 0.46), m, g, 0, 0.32, 0);
    [
      [-0.31, 0],
      [0.31, 0],
    ].forEach((o) => {
      mk(new T.BoxGeometry(0.02, 0.1, 0.46), m, g, o[0], 0.38, 0);
    });
    mk(new T.BoxGeometry(0.62, 0.1, 0.02), m, g, 0, 0.38, -0.23);
    mk(new T.CylinderGeometry(0.04, 0.05, 0.3, 10), dark, g, 0, 0.15, 0);
    const L = label(title, sub);
    L.sp.position.set(0, 0.68, 0);
    g.add(L.sp);
    return { g, m };
  }
  const tIn = tray(0.35, 1.25, 'Gelen', 'alış · kestirilen');
  const tOut = tray(1.15, 1.25, 'Giden', 'satış · kesilen');
  for (let k = 0; k < 3; k++) {
    const sh = mk(
      new T.BoxGeometry(0.36, 0.006, 0.26),
      new T.MeshStandardMaterial({ color: 0xe8e5dd, roughness: 0.9 }),
      tOut.g,
      (k - 1) * 0.01,
      0.36 + k * 0.008,
      k * 0.01,
    );
    sh.rotation.y = (k - 1) * 0.08;
  }

  // magnified phone panel
  const panel = new T.Group();
  panel.position.set(1.25, 1.1, -0.3);
  panel.scale.setScalar(0.85);
  scene.add(panel);
  mk(new T.BoxGeometry(0.72, 1.4, 0.04), dark, panel, 0, 0, -0.025);
  const pm = new T.Mesh(new T.PlaneGeometry(0.66, 1.32), new T.MeshBasicMaterial({ map: stex }));
  pm.position.z = 0.0;
  panel.add(pm);
  const pLight = new T.PointLight(Y, 0.6, 2.5);
  pLight.position.set(0, 0, 0.5);
  panel.add(pLight);
  const linkPos = new Float32Array(6);
  const linkGeo = new T.BufferGeometry();
  linkGeo.setAttribute('position', new T.BufferAttribute(linkPos, 3));
  const link = new T.Line(
    linkGeo,
    new T.LineDashedMaterial({ color: 0x6a6a6a, dashSize: 0.04, gapSize: 0.04 }),
  );
  link.frustumCulled = false;
  scene.add(link);

  let lastStage = -1;
  function drawScreen(st: number) {
    const x = sc.getContext('2d')!;
    const W = 450;
    const H = 900;
    x.fillStyle = '#0F0F10';
    x.fillRect(0, 0, W, H);
    x.fillStyle = '#F2F0EA';
    x.font = '600 34px "Geist Variable", Geist, Arial, sans-serif';
    x.fillText('KDV İade', 32, 80);
    x.fillStyle = '#8A8A8A';
    x.font = '400 20px "Geist Mono Variable", "Geist Mono", monospace';
    x.fillText('Ekim 2026 dönemi', 32, 116);
    const steps = ['Okut', 'Alanlar', 'Tür', 'Hesap', 'Dosya'];
    steps.forEach((_s, i) => {
      x.fillStyle = i < st ? '#FFD60A' : i === st - 1 ? '#FFD60A' : '#2A2A2A';
      x.fillRect(32 + i * 78, 140, 70, 6);
    });
    function row(lbl: string, val: string, y: number, hi: boolean) {
      x.fillStyle = '#8A8A8A';
      x.font = '400 21px "Geist Mono Variable", "Geist Mono", monospace';
      x.fillText(lbl, 32, y);
      x.fillStyle = hi ? '#FFD60A' : '#F2F0EA';
      x.font = '600 30px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText(val, 32, y + 38);
    }
    if (st <= 1) {
      x.strokeStyle = '#FFD60A';
      x.lineWidth = 6;
      [
        [60, 220],
        [390, 220],
        [60, 640],
        [390, 640],
      ].forEach((c, i) => {
        const sx = i % 2 ? -1 : 1;
        const sy = i > 1 ? -1 : 1;
        x.beginPath();
        x.moveTo(c[0], c[1] + sy * 50);
        x.lineTo(c[0], c[1]);
        x.lineTo(c[0] + sx * 50, c[1]);
        x.stroke();
      });
      x.fillStyle = '#1A1A1A';
      x.fillRect(90, 250, 270, 360);
      x.fillStyle = '#2A2A2A';
      for (let i = 0; i < 8; i++) x.fillRect(110, 280 + i * 38, i % 3 === 0 ? 200 : 150, 12);
      x.fillStyle = '#F2F0EA';
      x.font = '600 28px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText(st === 0 ? 'Faturayı çerçeveye al' : 'Okunuyor…', 32, 720);
      x.fillStyle = '#8A8A8A';
      x.font = '400 20px "Geist Mono Variable", "Geist Mono", monospace';
      x.fillText(st === 0 ? 'PDF ya da fotoğraf' : 'OCR · metin çıkarılıyor', 32, 760);
    } else if (st === 2) {
      row('SATICI', 'Örnek Tedarik Ltd.', 210, false);
      row('TARİH · NO', '12.10.2026 · 0412', 310, false);
      row('MATRAH', '₺12.500,00', 410, false);
      row('KDV %20', '₺2.500,00', 510, true);
      row('TOPLAM', '₺15.000,00', 610, false);
      x.fillStyle = '#8A8A8A';
      x.font = '400 20px "Geist Mono Variable", "Geist Mono", monospace';
      x.fillText('5 alan okundu ✓', 32, 760);
    } else if (st === 3) {
      x.fillStyle = '#8A8A8A';
      x.font = '400 21px "Geist Mono Variable", "Geist Mono", monospace';
      x.fillText('FATURA TÜRÜ', 32, 220);
      x.fillStyle = '#FFD60A';
      rr(x, 32, 244, 386, 120, 18);
      x.fill();
      x.fillStyle = '#0A0A0A';
      x.font = '700 40px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText('Gelen fatura', 56, 300);
      x.font = '400 22px "Geist Mono Variable", "Geist Mono", monospace';
      x.fillText('kestirilen · alış', 56, 340);
      x.strokeStyle = '#2E2E2E';
      x.lineWidth = 3;
      rr(x, 32, 384, 386, 100, 18);
      x.stroke();
      x.fillStyle = '#6A6A6A';
      x.font = '600 34px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText('Giden fatura', 56, 444);
      x.fillStyle = '#F2F0EA';
      x.font = '400 24px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText('₺2.500,00 KDV', 32, 560);
      x.fillStyle = '#A3A3A3';
      x.fillText('indirilecek KDV’ye eklendi', 32, 596);
    } else {
      row('İNDİRİLECEK KDV · GELEN', '₺48.200,00', 210, false);
      row('HESAPLANAN KDV · GİDEN', '₺31.750,00', 320, false);
      x.fillStyle = '#2E2E2E';
      x.fillRect(32, 410, 386, 2);
      x.fillStyle = '#8A8A8A';
      x.font = '400 21px "Geist Mono Variable", "Geist Mono", monospace';
      x.fillText('İADE EDİLECEK KDV', 32, 460);
      x.fillStyle = '#FFD60A';
      x.font = '700 58px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText('₺16.450,00', 32, 530);
      if (st >= 5) {
        x.fillStyle = '#FFD60A';
        rr(x, 32, 640, 386, 86, 18);
        x.fill();
        x.fillStyle = '#0A0A0A';
        x.font = '600 30px "Geist Variable", Geist, Arial, sans-serif';
        x.fillText('İade dosyası hazır ✓', 60, 694);
      } else {
        x.fillStyle = '#8A8A8A';
        x.font = '400 20px "Geist Mono Variable", "Geist Mono", monospace';
        x.fillText('dönem faturaları toplanıyor…', 32, 700);
      }
    }
    x.fillStyle = '#5A5A5A';
    x.font = '400 17px "Geist Mono Variable", "Geist Mono", monospace';
    x.fillText('örnek veri', 32, 860);
    stex.needsUpdate = true;
  }
  drawScreen(0);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      drawScreen(Math.max(0, lastStage));
      itex.needsUpdate = true;
    });
  }

  const camPos = new T.Vector3(0.1, 1.6, 6.0);
  const look = new T.Vector3(0.0, 0.88, 0.4);
  const tP = new T.Vector3();
  const lw = new T.Vector3();
  const b1 = new T.Vector3();
  const b2 = new T.Vector3();
  function sstep(a: number, b: number, x: number) {
    x = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return x * x * (3 - 2 * x);
  }
  const inTray = new T.Vector3(0.35, 0.42, 1.25);
  return {
    update(p, t, _dt, narrow) {
      const st = p < 0.12 ? 0 : p < 0.32 ? 1 : p < 0.48 ? 2 : p < 0.66 ? 3 : p < 0.86 ? 4 : 5;
      if (st !== lastStage) {
        lastStage = st;
        drawScreen(st);
      }
      // scanning
      const scanK = (p - 0.12) / 0.2;
      const scanning = st === 1;
      const by = 0.26 - ((scanK * 2) % 1) * 0.52;
      beam.position.y = by;
      glowBand.position.y = by + 0.03;
      beam.material.opacity = scanning ? 1 : 0;
      glowBand.material.opacity = scanning ? 0.25 : 0;
      const fo = sstep(0.32, 0.38, p) * (1 - sstep(0.5, 0.56, p));
      frames.forEach((f, i) => {
        f.material.opacity = fo * (0.6 + 0.4 * Math.sin(t * 4 + i));
      });
      // invoice flies into the "Gelen" tray
      const fly = sstep(0.5, 0.62, p);
      inv.position.lerpVectors(invHome, inTray, fly);
      inv.position.y += Math.sin(fly * Math.PI) * 0.35;
      inv.rotation.set(-0.75 - fly * 0.82, -0.35 * (1 - fly), 0);
      inv.scale.setScalar(1 - fly * 0.15);
      tIn.m.emissiveIntensity = sstep(0.58, 0.64, p) * (0.35 + 0.15 * Math.sin(t * 3));
      // scan cone
      fig.updateMatrixWorld(true);
      inv.updateMatrixWorld(true);
      lens.getWorldPosition(lw);
      b1.set(-0.23, by, 0.004);
      inv.localToWorld(b1);
      b2.set(0.23, by, 0.004);
      inv.localToWorld(b2);
      conePos[0] = lw.x;
      conePos[1] = lw.y;
      conePos[2] = lw.z;
      conePos[3] = b1.x;
      conePos[4] = b1.y;
      conePos[5] = b1.z;
      conePos[6] = b2.x;
      conePos[7] = b2.y;
      conePos[8] = b2.z;
      coneGeo.attributes.position.needsUpdate = true;
      cone.material.opacity = scanning ? 0.12 : 0;
      // panel faces camera; link from phone to panel
      panel.position.y = 1.1 + Math.sin(t * 1.3) * 0.02;
      panel.lookAt(cam.position.x, panel.position.y, cam.position.z);
      linkPos[0] = lw.x;
      linkPos[1] = lw.y;
      linkPos[2] = lw.z;
      linkPos[3] = panel.position.x - 0.31;
      linkPos[4] = panel.position.y - 0.17;
      linkPos[5] = panel.position.z;
      linkGeo.attributes.position.needsUpdate = true;
      link.computeLineDistances();
      pLight.intensity = 0.4 + (st >= 4 ? 0.6 : 0);
      fig.position.y = Math.sin(t * 1.5) * 0.005;
      head.rotation.y = st >= 4 ? 0.5 : 0;
      const orbit = Math.sin(p * Math.PI) * 0.6;
      tP.set(0.15 + orbit, narrow ? 2.0 : 1.55, narrow ? 8.4 : 6.0);
      camPos.lerp(tP, ctx.k || 0.06);
      cam.position.copy(camPos);
      cam.lookAt(look);
      return st;
    },
  };
}
