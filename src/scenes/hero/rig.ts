import * as T from 'three';

/**
 * Enes modelinin iskeleti ve pozlama.
 *
 * Model (public/media/enes.glb) A-pozunda, iskeletli bir GLB. Kemikler:
 * root → spine → head / omuz → dirsek → ön kol (twist) → el → parmaklar,
 * root → kalça → diz → bilek, spine → pelerin1 → pelerin2.
 *
 * Tüm koordinatlar model uzayında (metre, y yukarı, yüz +z yönünde, sağ el -x tarafında).
 */

type V3 = [number, number, number];

/** Kemiklerin dinlenme (A-poz) konumları: omuz S, dirsek E, bilek W, avuç ortası H. */
const ARM_REST: Record<'R' | 'L', { S: V3; E: V3; W: V3; H: V3 }> = {
  R: { S: [-0.24, 1.4, 0.0], E: [-0.37, 1.2, 0.04], W: [-0.465, 1.065, 0.09], H: [-0.505, 0.97, 0.125] },
  L: { S: [0.24, 1.4, 0.0], E: [0.37, 1.2, 0.04], W: [0.465, 1.065, 0.09], H: [0.505, 0.97, 0.125] },
};
/** Kalça H, diz K, ayak bileği A. */
const LEG_REST: Record<'R' | 'L', { H: V3; K: V3; A: V3 }> = {
  R: { H: [-0.1, 0.86, 0.02], K: [-0.115, 0.47, 0.03], A: [-0.15, 0.13, 0.01] },
  L: { H: [0.1, 0.86, 0.02], K: [0.115, 0.47, 0.03], A: [0.15, 0.13, 0.01] },
};
const SPINE_P = new T.Vector3(0, 1.0, 0);

/** Eldivenin dokudaki rengi (doğrusal uzayda), kılıç kabzasını saran yumruk için. */
const fistMat = new T.MeshStandardMaterial({
  color: new T.Color().setRGB(0.017, 0.03, 0.019),
  roughness: 0.7,
  metalness: 0.05,
});

export interface Arm {
  sh: T.Object3D;
  el: T.Object3D;
  tw: T.Object3D | null;
  hd: T.Object3D;
  S: T.Vector3;
  E: T.Vector3;
  W: T.Vector3;
  H: T.Vector3;
  /** Omuz silkince kayan omuz noktası. */
  Sx: T.Vector3;
  shRest: T.Vector3;
  L1: number;
  L2: number;
  HL: number;
  /** Dirseğin hangi yöne bakacağı (kola dik bileşeni kullanılır). */
  pole: T.Vector3;
  pole0: T.Vector3;
  /** Bileğin ileri-geri bükülmesi (radyan). */
  flex: number;
  foreAx: T.Vector3;
  aRest: T.Vector3;
  gRest: T.Vector3;
  mRestT: T.Matrix4;
}

export interface Leg {
  hip: T.Object3D;
  knee: T.Object3D;
  ankle: T.Object3D;
  H: T.Vector3;
  K: T.Vector3;
  A: T.Vector3;
  L1: number;
  L2: number;
}

export interface Rig {
  root: T.Object3D;
  spine: T.Object3D;
  head: T.Object3D;
  cape1: T.Object3D;
  cape2: T.Object3D;
  R: Arm;
  L: Arm;
  RL: Leg;
  LL: Leg;
}

/** Bir karedeki gövde duruşu. */
export interface BodyPose {
  hipYaw: number;
  /** Ağırlığın aktarıldığı taraf (kalçanın yana kayması). */
  hipX: number;
  /** Dizlerin bükülmesiyle kalçanın inmesi. */
  drop: number;
  /** Göğsün kalçaya göre dönüşü, öne ve yana eğilmesi. */
  twist: number;
  lean: number;
  side: number;
  headYaw: number;
  headPitch: number;
  shrugR: number;
  shrugL: number;
}

const v = (a: V3) => new T.Vector3().fromArray(a);

function makeArm(nm: 'R' | 'L', B: Record<string, T.Object3D | undefined>): Arm {
  const r = ARM_REST[nm];
  const sh = B[`${nm}_shoulder`]!;
  const hd = B[`${nm}_hand`]!;
  const S = v(r.S);
  const E = v(r.E);
  const W = v(r.W);
  const H = v(r.H);
  const aRest = new T.Vector3().subVectors(H, W).normalize();
  const gRest = new T.Vector3(0, 0, 1).addScaledVector(aRest, -aRest.z).normalize();
  const cRest = new T.Vector3().crossVectors(aRest, gRest);
  const pole = new T.Vector3(nm === 'R' ? -0.7 : 0.7, -1, -0.6).normalize();

  // Parmakları yumruk yap; kabzayı saran yumruğu ekle.
  const fg = B[`${nm}_fingers`];
  if (fg) {
    fg.quaternion.setFromAxisAngle(gRest, nm === 'R' ? 1.35 : -1.35);
    fg.scale.setScalar(0.45);
    const fist = new T.Mesh(new T.SphereGeometry(0.045, 20, 14), fistMat);
    fist.scale.set(1.05, 0.9, 1.25);
    fist.position.subVectors(H, W).addScaledVector(aRest, 0.012);
    fist.castShadow = true;
    hd.add(fist);
  }

  return {
    sh,
    el: B[`${nm}_elbow`]!,
    tw: B[`${nm}_twist`] ?? null,
    hd,
    S,
    E,
    W,
    H,
    Sx: S.clone(),
    shRest: sh.position.clone(),
    L1: E.distanceTo(S),
    L2: W.distanceTo(E),
    HL: H.distanceTo(W),
    pole,
    pole0: pole.clone(),
    flex: 0,
    foreAx: new T.Vector3().subVectors(W, E).normalize(),
    aRest,
    gRest,
    mRestT: new T.Matrix4().makeBasis(aRest, gRest, cRest).transpose(),
  };
}

function makeLeg(nm: 'R' | 'L', B: Record<string, T.Object3D | undefined>): Leg {
  const r = LEG_REST[nm];
  const H = v(r.H);
  const K = v(r.K);
  const A = v(r.A);
  return {
    hip: B[`${nm}_hip`]!,
    knee: B[`${nm}_knee`]!,
    ankle: B[`${nm}_ankle`]!,
    H,
    K,
    A,
    L1: K.distanceTo(H),
    L2: A.distanceTo(K),
  };
}

const BONES = [
  'root',
  'spine',
  'head',
  'cape1',
  'cape2',
  'R_shoulder',
  'R_elbow',
  'R_twist',
  'R_hand',
  'R_fingers',
  'L_shoulder',
  'L_elbow',
  'L_twist',
  'L_hand',
  'L_fingers',
  'R_hip',
  'R_knee',
  'R_ankle',
  'L_hip',
  'L_knee',
  'L_ankle',
] as const;

/** Yüklenen GLB sahnesinden iskeleti bulur; kemik eksikse null döner (model yine görünür, sadece kıpırdamaz). */
export function findRig(model: T.Object3D): Rig | null {
  const B: Record<string, T.Object3D | undefined> = {};
  for (const nm of BONES) B[nm] = model.getObjectByName(nm);
  const required = [
    'root',
    'spine',
    'head',
    'cape1',
    'cape2',
    'R_shoulder',
    'R_elbow',
    'R_hand',
    'L_shoulder',
    'L_elbow',
    'L_hand',
    'R_hip',
    'R_knee',
    'R_ankle',
    'L_hip',
    'L_knee',
    'L_ankle',
  ];
  if (required.some((nm) => !B[nm])) return null;
  return {
    root: B.root!,
    spine: B.spine!,
    head: B.head!,
    cape1: B.cape1!,
    cape2: B.cape2!,
    R: makeArm('R', B),
    L: makeArm('L', B),
    RL: makeLeg('R', B),
    LL: makeLeg('L', B),
  };
}

// --- iki kemikli IK ----------------------------------------------------------------------------
const q1 = new T.Quaternion();
const qd = new T.Quaternion();
const qe = new T.Quaternion();
const qh = new T.Quaternion();
const qTw = new T.Quaternion();
const qTwHalf = new T.Quaternion();
const qI = new T.Quaternion();
const m1 = new T.Matrix4();
const a1 = new T.Vector3();
const a2 = new T.Vector3();
const a3 = new T.Vector3();
const a4 = new T.Vector3();
const a5 = new T.Vector3();

/**
 * Kolu, avuç `grip` noktasına gelecek ve başparmak `thumb` yönüne bakacak şekilde poza sokar (omurga çerçevesinde).
 * Bileğin dönüşü ön kola yayılır: ön kol kemiği %65'ini, bilek kalanını alır.
 */
function poseArm(A: Arm, grip: T.Vector3, thumb: T.Vector3) {
  const fingers = a1.subVectors(grip, A.Sx);
  fingers.addScaledVector(thumb, -fingers.dot(thumb)).normalize();
  if (A.flex) fingers.applyAxisAngle(thumb, A.flex);
  const wrist = a2.copy(grip).addScaledVector(fingers, -A.HL);

  const d = a3.subVectors(wrist, A.Sx);
  const dist = Math.min(d.length(), A.L1 + A.L2 - 1e-4);
  d.normalize();
  const a = (A.L1 * A.L1 - A.L2 * A.L2 + dist * dist) / (2 * dist);
  const h = Math.sqrt(Math.max(A.L1 * A.L1 - a * a, 0));
  const p = a4.copy(A.pole).addScaledVector(d, -A.pole.dot(d)).normalize();
  const elbow = a5.copy(A.Sx).addScaledVector(d, a).addScaledVector(p, h);
  wrist.copy(A.Sx).addScaledVector(d, dist);

  q1.setFromUnitVectors(p.subVectors(A.E, A.S).normalize(), d.subVectors(elbow, A.Sx).normalize());
  p.subVectors(A.W, A.E).applyQuaternion(q1).normalize();
  qd.setFromUnitVectors(p, d.subVectors(wrist, elbow).normalize());
  A.sh.quaternion.copy(q1);
  qe.copy(qd).multiply(q1); // dirseğin dünya dönüşü
  A.el.quaternion.copy(q1).invert().multiply(qe);

  const side = d.crossVectors(fingers, thumb);
  m1.makeBasis(fingers, thumb, side).multiply(A.mRestT);
  qh.setFromRotationMatrix(m1); // elin dünya dönüşü
  A.hd.quaternion.copy(qe).invert().multiply(qh);

  if (A.tw) {
    const r = A.hd.quaternion;
    const ax = A.foreAx;
    const dt = r.x * ax.x + r.y * ax.y + r.z * ax.z;
    qTw.set(ax.x * dt, ax.y * dt, ax.z * dt, r.w).normalize();
    if (qTw.w < 0) qTw.set(-qTw.x, -qTw.y, -qTw.z, -qTw.w);
    qTwHalf.copy(qI).slerp(qTw, 0.65);
    A.tw.quaternion.copy(qTwHalf);
    A.hd.quaternion.premultiply(qTwHalf.invert());
  }
}

const lq1 = new T.Quaternion();
const lqd = new T.Quaternion();
const lqk = new T.Quaternion();
/** Diz IK'si: ayak hedefte kalır, diz öne bükülür, taban yere paralel durur. */
function poseLeg(L: Leg, target: T.Vector3, pole: T.Vector3, rootQ: T.Quaternion) {
  const d = a1.subVectors(target, L.H);
  const dist = Math.min(d.length(), L.L1 + L.L2 - 1e-4);
  d.normalize();
  const a = (L.L1 * L.L1 - L.L2 * L.L2 + dist * dist) / (2 * dist);
  const h = Math.sqrt(Math.max(L.L1 * L.L1 - a * a, 0));
  const p = a2.copy(pole).addScaledVector(d, -pole.dot(d)).normalize();
  const knee = a3.copy(L.H).addScaledVector(d, a).addScaledVector(p, h);
  const ankle = a4.copy(L.H).addScaledVector(d, dist);
  lq1.setFromUnitVectors(p.subVectors(L.K, L.H).normalize(), d.subVectors(knee, L.H).normalize());
  p.subVectors(L.A, L.K).applyQuaternion(lq1).normalize();
  lqd.setFromUnitVectors(p, d.subVectors(ankle, knee).normalize());
  L.hip.quaternion.copy(lq1);
  lqk.copy(lqd).multiply(lq1);
  L.knee.quaternion.copy(lq1).invert().multiply(lqk);
  L.ankle.quaternion.copy(rootQ).multiply(lqk).invert();
}

// --- tüm gövde ---------------------------------------------------------------------------------
const e = new T.Euler();
const rQi = new T.Quaternion();
const sQi = new T.Quaternion();
const rPos = new T.Vector3();
const legPole = new T.Vector3();
const foot = new T.Vector3();
const hR = new T.Vector3();
const hL = new T.Vector3();
const dR = new T.Vector3();
const dL = new T.Vector3();

function toRoot(out: T.Vector3, p: T.Vector3) {
  return out.copy(p).sub(rPos).applyQuaternion(rQi);
}
function toSpine(out: T.Vector3, p: T.Vector3) {
  return toRoot(out, p).sub(SPINE_P).applyQuaternion(sQi).add(SPINE_P);
}

/**
 * Tüm iskeleti poza sokar.
 * `handR`/`handL`: avuçların model uzayındaki hedefi, `thumbR`/`thumbL`: başparmak (kabza) yönü.
 */
export function poseRig(
  rig: Rig,
  handR: T.Vector3,
  thumbR: T.Vector3,
  handL: T.Vector3,
  thumbL: T.Vector3,
  o: BodyPose,
) {
  // kalça: döner, yana kayar, iner; ayaklar yerde kalır
  rPos.set(o.hipX, -o.drop, 0);
  rig.root.position.copy(rPos);
  e.set(0, o.hipYaw, 0);
  rig.root.quaternion.setFromEuler(e);
  rQi.copy(rig.root.quaternion).invert();
  legPole.set(0, 0, 1).applyQuaternion(rQi);
  poseLeg(rig.RL, toRoot(foot, rig.RL.A), legPole, rig.root.quaternion);
  poseLeg(rig.LL, toRoot(foot, rig.LL.A), legPole, rig.root.quaternion);

  // göğüs ve baş
  e.set(o.lean, o.twist, o.side);
  rig.spine.quaternion.setFromEuler(e);
  e.set(o.headPitch - o.lean * 0.6, o.headYaw, -o.side * 0.7);
  rig.head.quaternion.setFromEuler(e);
  sQi.copy(rig.spine.quaternion).invert();

  // omuzlar
  rig.R.sh.position.copy(rig.R.shRest);
  rig.R.sh.position.y += o.shrugR;
  rig.L.sh.position.copy(rig.L.shRest);
  rig.L.sh.position.y += o.shrugL;
  rig.R.Sx.copy(rig.R.S);
  rig.R.Sx.y += o.shrugR;
  rig.L.Sx.copy(rig.L.S);
  rig.L.Sx.y += o.shrugL;

  // kollar
  toSpine(hR, handR);
  toSpine(hL, handL);
  dR.copy(thumbR).applyQuaternion(rQi).applyQuaternion(sQi).normalize();
  dL.copy(thumbL).applyQuaternion(rQi).applyQuaternion(sQi).normalize();
  poseArm(rig.R, hR, dR);
  poseArm(rig.L, hL, dL);
}

/** Pelerin: sönümlü yay. Yalnızca dışarı doğru savrulur, gövdenin içine girmez. */
export class CapeSpring {
  private a = 0.08;
  private v = 0;
  private f = 0.05;
  private fv = 0;

  step(rig: Rig, dt: number, lift: number, flare: number) {
    const k = 60;
    const c = 7;
    this.v += (k * (0.08 + lift - this.a) - c * this.v) * dt;
    this.a = Math.min(0.32, Math.max(0.02, this.a + this.v * dt));
    this.fv += (k * (0.05 + flare - this.f) - c * this.fv) * dt;
    this.f = Math.min(0.16, Math.max(0, this.f + this.fv * dt));
    rig.cape1.rotation.set(this.a * 0.55, 0, this.f * 0.6);
    rig.cape2.rotation.set(this.a * 0.6, 0, this.f * 0.5);
  }
}
