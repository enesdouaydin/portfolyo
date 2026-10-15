import * as T from 'three';
import { mk, mkLights, projectStageOptions } from './helpers';
import type { SceneContext, SceneController, StageOptions } from './types';

/**
 * Belge Doldurma sahnesi: arşivdeki doldurulmuş belge VLM halkasından geçip başlıklarına ayrılır, başlıklar
 * Qdrant'ta vektör noktalarına dönüşür; yeni form soru soru dolar, sayfalar taranır, metin kutulu ajan düzeltir.
 */
export const docStageOptions: StageOptions = { ...projectStageOptions, loop: 24 };

type Ctx2D = CanvasRenderingContext2D;

const Y = 0xf0b54a;
const HEADS = ['Proje özeti', 'Amaç ve hedefler', 'Yöntem', 'Takvim', 'Bütçe', 'Ekip'] as const;
const QUESTIONS = [
  'Projenin amacı nedir?',
  'Hedef kitle kimdir?',
  'Hangi yöntem izlenecek?',
  'Beklenen çıktılar neler?',
  'Riskler ve önlemler?',
] as const;
const CLUSTER_COLORS = [0xf0b54a, 0xf2efe8, 0xb9b5aa, 0xf5cf8c, 0xd6d3cb, 0xd9952b];
const PTS_PER = 36;
/** Aşama sınırları (p): arşiv · VLM okuma · Qdrant · yeni form · soru soru doldurma · kontrol · düzeltme. */
const STAGE_AT = [0.08, 0.24, 0.4, 0.52, 0.78, 0.9];
const AGENT_TEXT = 'Bu metnin şu kısmını düzelt, bunu ekle';

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
function sstep(a: number, b: number, x: number) {
  const k = clamp01((x - a) / (b - a));
  return k * k * (3 - 2 * k);
}
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
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function canvasTex(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const t = new T.CanvasTexture(c);
  t.encoding = T.sRGBEncoding;
  t.anisotropy = 4;
  return { c, t, x: c.getContext('2d')! };
}
/** Noktalar için yumuşak kenarlı yuvarlak sprite dokusu. */
function dotTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  return new T.CanvasTexture(c);
}
function bezier(out: T.Vector3, a: T.Vector3, c: T.Vector3, b: T.Vector3, u: number) {
  const v = 1 - u;
  return out.set(
    v * v * a.x + 2 * v * u * c.x + u * u * b.x,
    v * v * a.y + 2 * v * u * c.y + u * u * b.y,
    v * v * a.z + 2 * v * u * c.z + u * u * b.z,
  );
}

export function createDocScene(ctx: SceneContext): SceneController {
  const { scene, camera: cam } = ctx;
  scene.fog = new T.Fog(0x0c0a09, 7, 16);
  const key = mkLights(scene, 5);
  key.intensity = 1.3;
  const dark = new T.MeshStandardMaterial({
    color: 0x2a2a30,
    roughness: 0.55,
    metalness: 0.35,
    flatShading: true,
  });
  const darkS = new T.MeshStandardMaterial({ color: 0x1c1c1f, roughness: 0.5, metalness: 0.4 });
  const additive = (color: number, opacity = 0) =>
    new T.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });

  // ---- yerleşim (x): arşiv · VLM · Qdrant · form
  const X_ARCHIVE = -1.8;
  const RING = new T.Vector3(-0.7, 1.05, 0);
  const X_DB = 0.55;
  const X_FORM = 1.75;
  const Y_FORM = 1.28;

  const floor = new T.Mesh(
    new T.CircleGeometry(12, 64),
    new T.MeshStandardMaterial({ color: 0x060607, roughness: 1 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  [
    [X_ARCHIVE, 0.62],
    [X_DB, 0.58],
    [X_FORM, 0.7],
  ].forEach((r) => {
    const rg = new T.Mesh(
      new T.RingGeometry(r[1], r[1] + 0.012, 96),
      new T.MeshBasicMaterial({ color: 0x3a3a40 }),
    );
    rg.rotation.x = -Math.PI / 2;
    rg.position.set(r[0], 0.003, 0);
    scene.add(rg);
  });

  // ---- etiketler (zeminde, ön sırada)
  function label(title: string, sub: string) {
    const { c, t, x } = canvasTex(512, 160);
    const paint = () => {
      x.clearRect(0, 0, 512, 160);
      x.fillStyle = 'rgba(12, 10, 9,0.88)';
      rr(x, 8, 8, 496, 144, 20);
      x.fill();
      x.strokeStyle = '#3A3A3A';
      x.lineWidth = 3;
      rr(x, 8, 8, 496, 144, 20);
      x.stroke();
      x.fillStyle = '#F2F0EA';
      x.font = '600 52px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText(title, 36, 76);
      x.fillStyle = '#A3A3A3';
      x.font = '400 28px "Geist Mono Variable", "Geist Mono", monospace';
      x.fillText(sub, 36, 124);
      t.needsUpdate = true;
    };
    paint();
    void c;
    const sp = new T.Sprite(
      new T.SpriteMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0 }),
    );
    sp.scale.set(0.62, 0.194, 1);
    return { sp, paint };
  }
  const labels = [
    { ...label('Arşiv', 'doldurulmuş belgeler'), x: X_ARCHIVE, at: 0 },
    { ...label('VLM', 'sayfa okuma'), x: RING.x, at: 0.08 },
    { ...label('Qdrant', 'vektör veritabanı'), x: X_DB, at: 0.22 },
    { ...label('Yeni form', '~150 sayfa'), x: X_FORM, at: 0.38 },
  ];
  labels.forEach((l) => {
    l.sp.position.set(l.x, 0.17, 0.78);
    scene.add(l.sp);
  });
  const agentLabel = label('Düzeltme ajanı', 'metin kutusu');
  agentLabel.sp.scale.set(0.66, 0.206, 1);
  agentLabel.sp.position.set(X_FORM + 0.62, 0.17, 1.1);
  scene.add(agentLabel.sp);

  // ---- arşiv: doldurulmuş belgeler rafı + öndeki belge
  const sheetTex = canvasTex(500, 680);
  const rowK = HEADS.map((_h, i) => (70 + i * 98 + 20) / 680);
  function drawSheet() {
    const x = sheetTex.x;
    x.fillStyle = '#F7F5EF';
    x.fillRect(0, 0, 500, 680);
    x.fillStyle = '#0C0A09';
    x.font = '700 30px "Geist Variable", Geist, Arial, sans-serif';
    x.fillText('PROJE BAŞVURU FORMU', 30, 50);
    x.fillStyle = '#E3E0D8';
    x.fillRect(30, 62, 440, 2);
    const rnd = mulberry32(7);
    HEADS.forEach((h, i) => {
      const y = 70 + i * 98;
      x.fillStyle = '#0C0A09';
      x.font = '600 22px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText(`${i + 1}. ${h}`, 30, y + 28);
      for (let k = 0; k < 3; k++) {
        const w = k === 2 ? 110 + rnd() * 120 : 330 + rnd() * 110;
        x.fillStyle = k === 0 && i % 2 === 0 ? '#E0A800' : '#B9B5AA';
        x.fillRect(30, y + 42 + k * 16, w, 9);
      }
    });
    x.fillStyle = '#9A978F';
    x.font = '400 16px "Geist Mono Variable", "Geist Mono", monospace';
    x.fillText('örnek belge', 30, 660);
    sheetTex.t.needsUpdate = true;
  }
  drawSheet();
  const sheetMat = new T.MeshStandardMaterial({ map: sheetTex.t, roughness: 0.9, side: T.DoubleSide });

  mk(new T.BoxGeometry(0.9, 0.1, 0.5), dark, scene, X_ARCHIVE, 0.05, 0);
  for (let i = 0; i < 6; i++) {
    const s = new T.Mesh(new T.PlaneGeometry(0.34, 0.46), sheetMat);
    s.castShadow = true;
    s.position.set(X_ARCHIVE - 0.3 + i * 0.1, 0.33, -0.03 * i + 0.05);
    s.rotation.set(-0.06, 0.5, 0);
    scene.add(s);
  }
  const sheet = new T.Group();
  scene.add(sheet);
  const sheetMesh = new T.Mesh(new T.PlaneGeometry(0.5, 0.68), sheetMat);
  sheetMesh.castShadow = true;
  sheet.add(sheetMesh);
  const beam = new T.Mesh(new T.PlaneGeometry(0.56, 0.012), additive(Y));
  beam.position.z = 0.004;
  sheet.add(beam);
  const glowBand = new T.Mesh(new T.PlaneGeometry(0.56, 0.09), additive(Y));
  glowBand.position.z = 0.003;
  sheet.add(glowBand);
  const rackPos = new T.Vector3(X_ARCHIVE + 0.32, 0.34, 0.12);

  // ---- VLM halkası
  const vlm = new T.Group();
  vlm.position.copy(RING);
  scene.add(vlm);
  const ringMat = new T.MeshStandardMaterial({ color: Y, emissive: 0xd9952b, emissiveIntensity: 0.9 });
  vlm.add(new T.Mesh(new T.TorusGeometry(0.55, 0.018, 12, 80), ringMat));
  const lensFill = new T.Mesh(new T.CircleGeometry(0.54, 48), additive(Y, 0.035));
  lensFill.position.z = -0.01;
  vlm.add(lensFill);
  [0, 1, 2, 3].forEach((i) => {
    const tick = mk(new T.BoxGeometry(0.02, 0.1, 0.02), ringMat, vlm, 0, 0, 0);
    const a = (i * Math.PI) / 2 + Math.PI / 4;
    tick.position.set(Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0);
    tick.rotation.z = a;
  });
  mk(new T.CylinderGeometry(0.05, 0.08, 0.5, 12), dark, scene, RING.x, 0.25, 0);

  // ---- başlık kartları (belgeden çıkıp Qdrant'a uçar)
  const tiles = HEADS.map((h, i) => {
    const { c, t, x } = canvasTex(300, 80);
    const paint = () => {
      x.clearRect(0, 0, 300, 80);
      x.fillStyle = 'rgba(12, 10, 9,0.94)';
      rr(x, 4, 4, 292, 72, 14);
      x.fill();
      x.strokeStyle = '#F0B54A';
      x.lineWidth = 3;
      rr(x, 4, 4, 292, 72, 14);
      x.stroke();
      x.fillStyle = '#F0B54A';
      x.font = '400 20px "Geist Mono Variable", "Geist Mono", monospace';
      x.fillText(String(i + 1).padStart(2, '0'), 20, 46);
      x.fillStyle = '#F2F0EA';
      x.font = '600 28px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText(h, 62, 49);
      t.needsUpdate = true;
    };
    paint();
    void c;
    const m = new T.Mesh(
      new T.PlaneGeometry(0.3, 0.08),
      new T.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }),
    );
    m.scale.setScalar(0.01);
    scene.add(m);
    return { m, paint };
  });
  const appear = rowK.map((k) => 0.12 + 0.1 * k);
  const flyStart = appear.map((a) => a + 0.015);
  const FLY = 0.11;
  const tileS = rowK.map((k) => new T.Vector3(RING.x, RING.y + 0.34 - k * 0.68, 0.03));
  const DB_TOP = new T.Vector3(X_DB, 0.98, 0.04);
  const tileE = HEADS.map((_h, i) => DB_TOP.clone().add(new T.Vector3((i - 2.5) * 0.025, 0, 0)));
  const tileC = tileS.map((s, i) =>
    s
      .clone()
      .lerp(tileE[i], 0.5)
      .add(new T.Vector3(0, 0.55 + i * 0.04, 0.3)),
  );

  // ---- Qdrant: veritabanı gövdesi + vektör bulutu
  const db = new T.Group();
  db.position.set(X_DB, 0, 0);
  scene.add(db);
  const dbGlow = new T.MeshStandardMaterial({ color: Y, emissive: 0xd9952b, emissiveIntensity: 0.25 });
  mk(new T.CylinderGeometry(0.52, 0.56, 0.06, 40), dark, db, 0, 0.03, 0);
  [0.22, 0.46, 0.7].forEach((yy) => {
    mk(new T.CylinderGeometry(0.34, 0.34, 0.2, 40), darkS, db, 0, yy + 0.08, 0);
    mk(new T.TorusGeometry(0.345, 0.007, 8, 64), dbGlow, db, 0, yy - 0.02, 0).rotation.x = Math.PI / 2;
  });
  const cloud = new T.Group();
  cloud.position.set(X_DB, 1.5, 0);
  scene.add(cloud);
  const N = PTS_PER * HEADS.length;
  const rnd = mulberry32(21);
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
  const centers = HEADS.map((_h, i) => {
    const a = (i / HEADS.length) * Math.PI * 2;
    return new T.Vector3(Math.cos(a) * 0.3, Math.sin(i * 1.7) * 0.16, Math.sin(a) * 0.3);
  });
  const finalPos = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const col = new T.Color();
  for (let i = 0; i < N; i++) {
    const ci = Math.floor(i / PTS_PER);
    finalPos[i * 3] = centers[ci].x + gauss() * 0.09;
    finalPos[i * 3 + 1] = centers[ci].y + gauss() * 0.09;
    finalPos[i * 3 + 2] = centers[ci].z + gauss() * 0.09;
    col.setHex(CLUSTER_COLORS[ci]);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  const curPos = new Float32Array(N * 3);
  const ptsGeo = new T.BufferGeometry();
  ptsGeo.setAttribute('position', new T.BufferAttribute(curPos, 3));
  ptsGeo.setAttribute('color', new T.BufferAttribute(colors, 3));
  ptsGeo.setDrawRange(0, 0);
  const pts = new T.Points(
    ptsGeo,
    new T.PointsMaterial({
      size: 0.1,
      map: dotTexture(),
      alphaTest: 0.01,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: T.AdditiveBlending,
    }),
  );
  pts.frustumCulled = false;
  cloud.add(pts);
  const shell = new T.Mesh(
    new T.IcosahedronGeometry(0.52, 1),
    new T.MeshBasicMaterial({ color: 0xf5cf8c, wireframe: true, transparent: true, opacity: 0 }),
  );
  cloud.add(shell);
  const dbLight = new T.PointLight(Y, 0, 2.6);
  dbLight.position.set(0, -0.2, 0.3);
  cloud.add(dbLight);
  const arrive = flyStart.map((s) => s + FLY);
  const START = new T.Vector3(0, -0.52, 0);

  // ---- yeni form
  const formTex = canvasTex(600, 840);
  const form = new T.Group();
  form.position.set(3.6, Y_FORM, 0);
  form.visible = false;
  form.scale.setScalar(1.2);
  scene.add(form);
  const paperMat = new T.MeshBasicMaterial({ map: formTex.t, color: 0xeceae3 });
  const paper = new T.Mesh(new T.PlaneGeometry(0.9, 1.26), paperMat);
  form.add(paper);
  mk(new T.BoxGeometry(0.94, 1.3, 0.02), dark, form, 0, 0, -0.014);
  for (let k = 0; k < 4; k++) {
    const b = new T.Mesh(
      new T.PlaneGeometry(0.9, 1.26),
      new T.MeshStandardMaterial({ color: 0xdedbd2, roughness: 0.9, side: T.DoubleSide }),
    );
    b.position.set(0.012 * (k + 1), -0.006 * (k + 1), -0.03 - k * 0.012);
    b.castShadow = true;
    form.add(b);
  }
  mk(new T.BoxGeometry(0.03, 1.3, 0.09), dark, form, -0.47, 0, -0.045);
  const checkBeam = new T.Mesh(new T.PlaneGeometry(0.94, 0.012), additive(Y));
  checkBeam.position.z = 0.006;
  form.add(checkBeam);
  const checkBand = new T.Mesh(new T.PlaneGeometry(0.94, 0.12), additive(Y));
  checkBand.position.z = 0.005;
  form.add(checkBand);

  // formdaki cevap kutularının sol kenarı (soru başına bir tane): canvas px → düzlem birimi
  const qTop = (i: number) => 196 + i * 126;
  const ansAnchor = QUESTIONS.map((_q, i) => {
    const px = 36;
    const py = qTop(i) + 34 + 39;
    return new T.Vector3((px / 600 - 0.5) * 0.9, 0.63 - (py / 840) * 1.26, 0.01);
  });

  interface FormState {
    page: number;
    info: number;
    q: number[];
    active: number;
    checks: number;
    edit: number;
  }
  let formSig = '';
  function drawForm(s: FormState) {
    const x = formTex.x;
    x.fillStyle = '#F7F5EF';
    x.fillRect(0, 0, 600, 840);
    x.fillStyle = '#0C0A09';
    x.font = '700 28px "Geist Variable", Geist, Arial, sans-serif';
    x.fillText('PROJE BAŞVURU FORMU', 36, 52);
    x.fillStyle = '#6A6862';
    x.font = '400 18px "Geist Mono Variable", "Geist Mono", monospace';
    x.textAlign = 'right';
    x.fillText(`Sayfa ${s.page} / 150`, 564, 50);
    x.textAlign = 'left';
    x.fillStyle = '#E3E0D8';
    x.fillRect(36, 70, 528, 2);
    // proje bilgi kutusu
    x.strokeStyle = s.info > 0 ? '#E0A800' : '#CFCBBF';
    x.lineWidth = 2;
    x.setLineDash(s.info > 0.98 ? [] : [8, 6]);
    rr(x, 36, 86, 528, 92, 14);
    x.stroke();
    x.setLineDash([]);
    x.fillStyle = '#8A877F';
    x.font = '400 14px "Geist Mono Variable", "Geist Mono", monospace';
    x.fillText('PROJE BİLGİSİ', 54, 110);
    x.fillStyle = '#2A2A2A';
    x.fillRect(54, 124, 470 * clamp01(s.info * 2), 9);
    x.fillRect(54, 146, 330 * clamp01(s.info * 2 - 1), 9);
    // sorular + cevap kutuları
    QUESTIONS.forEach((q, i) => {
      const y = qTop(i);
      const f = s.q[i];
      const act = s.active === i;
      const edited = s.edit > 0 && i === 2;
      x.fillStyle = '#0C0A09';
      x.font = '600 21px "Geist Variable", Geist, Arial, sans-serif';
      x.fillText(`S${i + 1}. ${q}`, 36, y + 20);
      if (f > 0) {
        x.fillStyle = '#8A877F';
        x.font = '400 14px "Geist Mono Variable", "Geist Mono", monospace';
        x.textAlign = 'right';
        x.fillText(`↳ ${HEADS[i]}`, 564, y + 20);
        x.textAlign = 'left';
      }
      x.strokeStyle = act || edited ? '#E0A800' : '#CFCBBF';
      x.lineWidth = act || edited ? 3 : 2;
      x.setLineDash(f === 0 ? [8, 6] : []);
      rr(x, 36, y + 34, 528, 78, 12);
      x.stroke();
      x.setLineDash([]);
      const widths = [470, 430, 260];
      for (let k = 0; k < 3; k++) {
        const lf = clamp01(f * 3 - k);
        if (lf <= 0) continue;
        x.fillStyle = '#2A2A2A';
        x.fillRect(54, y + 54 + k * 20, widths[k] * lf, 9);
        if (act && lf < 1) {
          x.fillStyle = '#F0B54A';
          x.fillRect(54 + widths[k] * lf, y + 50 + k * 20, 8, 17);
        }
      }
      if (edited) {
        // düzeltilen paragraf: ilk satır yeniden yazılır (sarı vurgu), sona eklenen yeni satır
        x.fillStyle = 'rgba(240, 181, 74,0.55)';
        x.fillRect(54, y + 49, 470 * clamp01(s.edit * 1.4), 18);
        x.fillStyle = '#2A2A2A';
        x.fillRect(54, y + 54, 470, 9);
        x.fillStyle = '#E0A800';
        x.fillRect(54, y + 94, 200 * clamp01(s.edit * 2 - 0.6), 9);
      }
      if (i < s.checks) {
        x.fillStyle = '#F0B54A';
        x.beginPath();
        x.arc(542, y + 56, 13, 0, Math.PI * 2);
        x.fill();
        x.strokeStyle = '#0C0A09';
        x.lineWidth = 3;
        x.beginPath();
        x.moveTo(535, y + 56);
        x.lineTo(540, y + 61);
        x.lineTo(549, y + 50);
        x.stroke();
      }
    });
    x.fillStyle = '#9A978F';
    x.font = '400 14px "Geist Mono Variable", "Geist Mono", monospace';
    x.fillText('örnek form', 36, 822);
    formTex.t.needsUpdate = true;
  }

  // ---- düzeltme ajanı: metin kutulu panel + ajan çekirdeği
  const agentTex = canvasTex(640, 200);
  let agentSig = '';
  function drawAgent(typed: number, done: boolean) {
    const x = agentTex.x;
    x.clearRect(0, 0, 640, 200);
    x.fillStyle = '#0F0F10';
    rr(x, 4, 4, 632, 192, 22);
    x.fill();
    x.strokeStyle = '#3A3A3A';
    x.lineWidth = 3;
    rr(x, 4, 4, 632, 192, 22);
    x.stroke();
    x.fillStyle = '#8A8A8A';
    x.font = '400 20px "Geist Mono Variable", "Geist Mono", monospace';
    x.fillText('DÜZELTME AJANI', 32, 46);
    x.fillStyle = '#F7F5EF';
    rr(x, 28, 66, 500, 64, 14);
    x.fill();
    x.fillStyle = '#0C0A09';
    x.font = '400 25px "Geist Variable", Geist, Arial, sans-serif';
    x.fillText(AGENT_TEXT.slice(0, typed) + (typed < AGENT_TEXT.length ? '|' : ''), 46, 108);
    x.fillStyle = '#F0B54A';
    x.beginPath();
    x.arc(580, 98, 32, 0, Math.PI * 2);
    x.fill();
    x.strokeStyle = '#0C0A09';
    x.lineWidth = 5;
    x.beginPath();
    x.moveTo(566, 98);
    x.lineTo(594, 98);
    x.moveTo(584, 86);
    x.lineTo(596, 98);
    x.lineTo(584, 110);
    x.stroke();
    x.fillStyle = done ? '#F0B54A' : '#6A6A6A';
    x.font = '400 21px "Geist Mono Variable", "Geist Mono", monospace';
    x.fillText(done ? 'S3 güncellendi ✓' : 'soru bazında uygulanır…', 32, 168);
    agentTex.t.needsUpdate = true;
  }
  const agentPanel = new T.Group();
  agentPanel.position.set(X_FORM, 0.36, 0.5);
  agentPanel.rotation.x = -0.55;
  agentPanel.scale.setScalar(0.001);
  scene.add(agentPanel);
  agentPanel.add(
    new T.Mesh(
      new T.PlaneGeometry(1.0, 0.3125),
      new T.MeshBasicMaterial({ map: agentTex.t, transparent: true }),
    ),
  );
  const agentCore = new T.Group();
  agentCore.position.set(X_FORM + 0.92, 0.95, 0.25);
  agentCore.scale.setScalar(0.001);
  scene.add(agentCore);
  agentCore.add(
    new T.Mesh(
      new T.IcosahedronGeometry(0.11, 0),
      new T.MeshStandardMaterial({
        color: Y,
        emissive: 0xd9952b,
        emissiveIntensity: 1.2,
        roughness: 0.3,
        flatShading: true,
      }),
    ),
  );
  agentCore.add(
    new T.Mesh(
      new T.IcosahedronGeometry(0.2, 1),
      new T.MeshBasicMaterial({ color: 0xf5cf8c, wireframe: true, transparent: true, opacity: 0.35 }),
    ),
  );
  agentCore.add(new T.Mesh(new T.SphereGeometry(0.3, 20, 14), additive(Y, 0.06)));

  // ---- erişim iplikleri: Qdrant kümesinden formdaki cevap kutusuna
  const THREAD_N = 32;
  const threads = QUESTIONS.map(() => {
    const arr = new Float32Array((THREAD_N + 1) * 3);
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(arr, 3));
    const l = new T.Line(g, new T.LineBasicMaterial({ color: Y, transparent: true, opacity: 0 }));
    l.frustumCulled = false;
    scene.add(l);
    const pulse = new T.Mesh(
      new T.SphereGeometry(0.028, 12, 8),
      new T.MeshBasicMaterial({ color: 0xf5cf8c, transparent: true, opacity: 0 }),
    );
    scene.add(pulse);
    return { arr, g, l, pulse };
  });
  // ajan → düzeltilen cevap
  const editLineArr = new Float32Array((THREAD_N + 1) * 3);
  const editLineGeo = new T.BufferGeometry();
  editLineGeo.setAttribute('position', new T.BufferAttribute(editLineArr, 3));
  const editLine = new T.Line(
    editLineGeo,
    new T.LineBasicMaterial({ color: Y, transparent: true, opacity: 0 }),
  );
  editLine.frustumCulled = false;
  scene.add(editLine);

  const v0 = new T.Vector3();
  const v1 = new T.Vector3();
  const vc = new T.Vector3();
  const vp = new T.Vector3();
  function setCurve(arr: Float32Array, a: T.Vector3, c: T.Vector3, b: T.Vector3) {
    for (let i = 0; i <= THREAD_N; i++) {
      bezier(vp, a, c, b, i / THREAD_N);
      arr[i * 3] = vp.x;
      arr[i * 3 + 1] = vp.y;
      arr[i * 3 + 2] = vp.z;
    }
  }

  // yazı tipleri geç yüklenirse dokuları yeniden çiz
  const redrawAll = () => {
    drawSheet();
    tiles.forEach((tl) => tl.paint());
    labels.forEach((l) => l.paint());
    agentLabel.paint();
    formSig = '';
    agentSig = '';
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redrawAll);

  const camPos = new T.Vector3(0.2, 1.7, 6.6);
  const look = new T.Vector3(0.1, 1.0, 0.1);
  const tP = new T.Vector3();
  const tL = new T.Vector3();
  const q = (v: number) => Math.round(v * 24) / 24;

  return {
    update(p, t, _dt, narrow) {
      const st = STAGE_AT.filter((a) => p >= a).length;

      // etiketler
      labels.forEach((l) => {
        l.sp.material.opacity = sstep(l.at, l.at + 0.04, p) * 0.95;
      });
      agentLabel.sp.material.opacity = sstep(0.86, 0.9, p) * 0.95;

      // belge: raftan halkaya, tarama, geri
      const f = sstep(0.06, 0.12, p) * (1 - sstep(0.27, 0.33, p));
      sheet.position.lerpVectors(rackPos, RING, f);
      sheet.position.y += Math.sin(f * Math.PI) * 0.3;
      sheet.rotation.set(-0.06 * (1 - f), 0.5 * (1 - f), 0);
      sheet.scale.setScalar(0.68 + 0.32 * f);
      const scanK = clamp01((p - 0.12) / 0.1);
      const scanning = p > 0.12 && p < 0.225;
      beam.position.y = 0.34 - scanK * 0.68;
      glowBand.position.y = beam.position.y + 0.03;
      (beam.material as T.MeshBasicMaterial).opacity = scanning ? 1 : 0;
      (glowBand.material as T.MeshBasicMaterial).opacity = scanning ? 0.25 : 0;
      ringMat.emissiveIntensity = 0.7 + (scanning ? 0.8 + 0.3 * Math.sin(t * 9) : 0.15 * Math.sin(t * 2));

      // başlık kartları: belgeden çıkıp Qdrant'a
      tiles.forEach((tl, i) => {
        const pop = sstep(appear[i], appear[i] + 0.012, p);
        const u = sstep(flyStart[i], flyStart[i] + FLY, p);
        bezier(tl.m.position, tileS[i], tileC[i], tileE[i], u);
        const sc = (0.25 + 0.75 * pop) * (1 - 0.85 * sstep(0.8, 1, u));
        tl.m.scale.setScalar(Math.max(0.001, sc));
        (tl.m.material as T.MeshBasicMaterial).opacity = pop * (1 - sstep(0.93, 1, u));
        tl.m.quaternion.copy(cam.quaternion);
      });

      // Qdrant bulutu: kartlar vardıkça kümeler oluşur
      let reveal = 0;
      for (let i = 0; i < HEADS.length; i++) {
        const r = sstep(arrive[i] - 0.04, arrive[i] + 0.04, p);
        reveal += r;
        for (let k = 0; k < PTS_PER; k++) {
          const j = (i * PTS_PER + k) * 3;
          curPos[j] = START.x + (finalPos[j] - START.x) * r;
          curPos[j + 1] = START.y + (finalPos[j + 1] - START.y) * r;
          curPos[j + 2] = START.z + (finalPos[j + 2] - START.z) * r;
        }
      }
      ptsGeo.attributes.position.needsUpdate = true;
      ptsGeo.setDrawRange(0, Math.floor(reveal * PTS_PER));
      cloud.rotation.y = t * 0.18;
      cloud.position.y = 1.5 + Math.sin(t * 1.1) * 0.015;
      (shell.material as T.MeshBasicMaterial).opacity = sstep(0.3, 0.4, p) * 0.14;
      const dbOn = sstep(0.22, 0.34, p);
      dbGlow.emissiveIntensity = 0.25 + dbOn * 0.9 + (st === 2 ? 0.2 * Math.sin(t * 5) : 0);
      dbLight.intensity = dbOn * 0.7;

      // yeni form: sağdan kayarak gelir
      const slide = sstep(0.37, 0.46, p);
      form.visible = p > 0.365;
      form.position.x = 3.6 + (X_FORM - 3.6) * slide;
      form.position.y = Y_FORM + Math.sin(t * 1.2) * 0.012;
      form.scale.setScalar(narrow ? 1.05 : 1.2);
      form.rotation.y = -0.6 * (1 - slide) - 0.14 * slide;
      const info = sstep(0.44, 0.52, p);
      const qf = QUESTIONS.map((_qq, i) => sstep(0.54 + i * 0.04, 0.54 + i * 0.04 + 0.05, p));
      const active = qf.findIndex((v) => v > 0.001 && v < 0.999);
      const chk = sstep(0.79, 0.89, p);
      const checks = Math.floor(chk * 5.999);
      const page = p < 0.79 ? 1 : p >= 0.89 ? 150 : 1 + Math.floor(chk * 149);
      const edit = sstep(0.95, 0.98, p);
      const sig = [page, q(info), qf.map(q).join(','), active, checks, q(edit)].join('|');
      if (form.visible && sig !== formSig) {
        formSig = sig;
        drawForm({ page, info: q(info), q: qf.map(q), active, checks, edit: q(edit) });
      }

      // kontrol: tarama çubuğu formu yukarıdan aşağı tekrar tekrar süpürür (sayfa sayfa)
      const sweeping = p > 0.79 && p < 0.89;
      const by = 0.65 - ((chk * 8) % 1) * 1.3;
      checkBeam.position.y = by;
      checkBand.position.y = by + 0.04;
      (checkBeam.material as T.MeshBasicMaterial).opacity = sweeping ? 1 : 0;
      (checkBand.material as T.MeshBasicMaterial).opacity = sweeping ? 0.22 : 0;

      // erişim iplikleri
      form.updateMatrixWorld(true);
      cloud.updateMatrixWorld(true);
      threads.forEach((th, i) => {
        const w0 = 0.54 + i * 0.04;
        const on = sstep(w0 - 0.01, w0 + 0.01, p) * (1 - sstep(w0 + 0.05, w0 + 0.07, p));
        const mat = th.l.material as T.LineBasicMaterial;
        mat.opacity = on * 0.85;
        const pm = th.pulse.material as T.MeshBasicMaterial;
        pm.opacity = on;
        if (on > 0.001) {
          v0.copy(centers[i]);
          cloud.localToWorld(v0);
          v1.copy(ansAnchor[i]);
          form.localToWorld(v1);
          vc.copy(v0).lerp(v1, 0.5);
          vc.y += 0.4;
          vc.z += 0.35;
          setCurve(th.arr, v0, vc, v1);
          th.g.attributes.position.needsUpdate = true;
          bezier(th.pulse.position, v0, vc, v1, sstep(w0, w0 + 0.04, p));
        }
      });

      // düzeltme ajanı
      const ap = sstep(0.88, 0.92, p);
      agentPanel.scale.setScalar(Math.max(0.001, ap * 1.15));
      agentCore.scale.setScalar(Math.max(0.001, ap));
      agentCore.rotation.y = t * 0.8;
      agentCore.rotation.x = t * 0.4;
      agentCore.position.y = 0.95 + Math.sin(t * 1.4) * 0.03;
      const typed = Math.floor(AGENT_TEXT.length * sstep(0.905, 0.95, p));
      const aDone = p > 0.975;
      const aSig = `${typed}|${aDone}`;
      if (aSig !== agentSig) {
        agentSig = aSig;
        drawAgent(typed, aDone);
      }
      const editOn = sstep(0.945, 0.955, p) * (1 - sstep(0.975, 0.99, p));
      (editLine.material as T.LineBasicMaterial).opacity = editOn * 0.85;
      if (editOn > 0.001) {
        v0.copy(agentCore.position);
        v1.copy(ansAnchor[2]);
        v1.x = 0.3;
        form.localToWorld(v1);
        vc.copy(v0).lerp(v1, 0.5);
        vc.z += 0.3;
        setCurve(editLineArr, v0, vc, v1);
        editLineGeo.attributes.position.needsUpdate = true;
      }

      // kamera: geniş ekranda hafif yörünge; dar ekranda etkin istasyonu izler
      const fx = -1.25 + 1.15 * sstep(0.22, 0.3, p) + 1.3 * sstep(0.36, 0.44, p);
      const orbit = Math.sin(p * Math.PI) * 0.4;
      if (narrow) {
        tP.set(fx, 2.2, 9.0);
        tL.set(fx, 0.95, 0.1);
      } else {
        tP.set(0.2 + orbit + fx * 0.12, 1.7, 6.6);
        tL.set(0.1 + fx * 0.12, 1.0, 0.1);
      }
      camPos.lerp(tP, ctx.k || 0.06);
      look.lerp(tL, ctx.k || 0.06);
      cam.position.copy(camPos);
      cam.lookAt(look);
      return st;
    },
    dispose() {
      scene.traverse((o) => {
        const m = o as T.Mesh;
        m.geometry?.dispose();
        const mat = m.material as T.Material | T.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => {
          (x as T.MeshBasicMaterial).map?.dispose();
          x.dispose();
        });
      });
    },
  };
}
