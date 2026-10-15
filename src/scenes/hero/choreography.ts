import * as T from 'three';
import { CapeSpring, poseRig, type BodyPose, type Rig } from './rig';
import type { Saber } from './saber';

/**
 * Kılıç koreografisi — referans videodaki sopa çevirme, 8 sn'lik döngü:
 *
 *   0.0–2.0  sağ yanda çevirme
 *   2.0–2.6  önde sol ele geçirme
 *   2.6–4.3  sol yanda çevirme
 *   4.3–5.5  sırt arkasından sağ ele geçirme (kılıç durur, yatay taşınır)
 *   5.5–6.3  sağ yanda çevirme
 *   6.3–7.4  havaya atıp aynı elle yakalama
 *   7.4–8.0  sağ yana dönüş
 *
 * Kılıcın merkezi tutan elin içindedir; el her turda küçük bir daire çizerek kılıcı iter,
 * bilek bükülür, dirsek ve omuz da ritme eşlik eder. Gövde ağırlığını kılıcın tarafına verir.
 */

const LOOP = 8;
const SPIN_RATE = 9; // rad/sn
/** Model sahneye bu ölçekle yerleşir (sahnedeki boy ~1.77 m). */
export const MODEL_SCALE = 0.93;

const ez = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

type Hand = 'R' | 'L' | null;

export class Choreography {
  private readonly cape = new CapeSpring();
  private spin = 0;
  private smoothCentre = new T.Vector3();
  private smoothR = new T.Vector3();
  private smoothL = new T.Vector3();
  private started = false;
  private handsReady = false;

  // noktalar (model uzayı)
  private readonly mid = new T.Vector3(0, 1.08, 0.38); // önde el değiştirme
  private readonly tossFrom = new T.Vector3(-0.1, 1.0, 0.36);
  private readonly catchAt = new T.Vector3(-0.14, 1.12, 0.36);
  private readonly freeThumbR = new T.Vector3(-0.1, 0.1, 1).normalize();
  private readonly freeThumbL = new T.Vector3(0.1, 0.1, 1).normalize();

  // kare başına yeniden kullanılan nesneler
  private readonly sideR = new T.Vector3();
  private readonly sideL = new T.Vector3();
  private readonly restR = new T.Vector3();
  private readonly restL = new T.Vector3();
  private readonly centre = new T.Vector3();
  private readonly drive = new T.Vector3();
  private readonly axis = new T.Vector3();
  private readonly thumb = new T.Vector3();
  private readonly handR = new T.Vector3();
  private readonly handL = new T.Vector3();
  private readonly thumbR = new T.Vector3();
  private readonly thumbL = new T.Vector3();
  private readonly tmp = new T.Vector3();
  private readonly tmp2 = new T.Vector3();
  private readonly e = new T.Euler();
  private readonly qPlane = new T.Quaternion();
  private readonly qSpin = new T.Quaternion();
  private readonly qPass = new T.Quaternion();
  private readonly mPass = new T.Matrix4();
  private readonly zAxis = new T.Vector3(0, 0, 1);
  private readonly up = new T.Vector3(0, 1, 0);
  private readonly pose: BodyPose = {
    hipYaw: 0,
    hipX: 0,
    drop: 0,
    twist: 0,
    lean: 0,
    side: 0,
    headYaw: 0,
    headPitch: 0,
    shrugR: 0,
    shrugL: 0,
  };

  /**
   * @param ps    yumuşatılmış kaydırma ilerlemesi (0–1); kılıcın açısına eklenir
   * @param omega figürün kendi ekseninde dönme hızı (pelerinin savrulması için)
   */
  update(saber: Saber, rig: Rig | null, t: number, dt: number, ps: number, omega: number, reduce: boolean) {
    const tc = reduce ? 1 : t % LOOP;
    const bob = Math.sin(t * 3);
    this.sideR.set(-0.4, 1.03 + 0.03 * bob, 0.25);
    this.sideL.set(0.4, 1.03 + 0.03 * bob, 0.25);

    // --- kılıcın merkezi nerede, kim tutuyor ---------------------------------------------------
    let holder: Hand = 'R';
    let rate = SPIN_RATE;
    let flight = -1; // havadayken 0–1
    let pass = 0; // sırt arkası geçişinde 0–1 (kılıç durur, yatay taşınır)
    let theta = 0; // geçişte belin etrafındaki açı
    const c = this.centre;
    if (tc < 2.0) c.copy(this.sideR);
    else if (tc < 2.6) c.lerpVectors(this.sideR, this.mid, ez((tc - 2.0) / 0.6));
    else if (tc < 4.3) {
      holder = 'L';
      c.lerpVectors(this.mid, this.sideL, ez((tc - 2.6) / 0.45));
    } else if (tc < 5.5) {
      const k = ez((tc - 4.3) / 1.2);
      theta = 1.15 + k * (2 * Math.PI - 2.3);
      const r = 0.44 - 0.13 * Math.max(0, -Math.cos(theta));
      c.set(r * Math.sin(theta), 1.02, r * Math.cos(theta));
      holder = k < 0.5 ? 'L' : 'R';
      pass = Math.min(ez((tc - 4.3) / 0.25), ez((5.5 - tc) / 0.25));
      rate = SPIN_RATE * (1 - pass);
    } else if (tc < 6.3) c.copy(this.sideR);
    else if (tc < 6.6) c.lerpVectors(this.sideR, this.tossFrom, ez((tc - 6.3) / 0.3));
    else if (tc < 7.4) {
      // havada: doğrusal yol + parabol, dönmeye devam eder
      holder = null;
      flight = (tc - 6.6) / 0.8;
      rate = 12;
      c.lerpVectors(this.tossFrom, this.catchAt, flight);
      c.y += 4 * 0.5 * flight * (1 - flight);
    } else c.lerpVectors(this.catchAt, this.sideR, ez((tc - 7.4) / 0.6));

    // eller ve kılıç zıplamaz, gerçek bir kol gibi yumuşakça yaklaşır
    const sm = 1 - Math.exp(-dt * 14);
    if (flight >= 0 || !this.started) this.smoothCentre.copy(c);
    else this.smoothCentre.lerp(c, sm);
    this.started = true;
    const sc = this.smoothCentre;
    this.spin += reduce ? 0 : dt * rate;
    const spin = ps * Math.PI * 6 + this.spin;

    // --- kılıcın yönü: yanında bir düzlemde döner, geçişte yatay ve arkaya dönük --------------
    this.e.set(-0.06, 1.3 * sc.x, 0);
    this.qPlane.setFromEuler(this.e);
    this.qSpin.setFromAxisAngle(this.zAxis, spin).premultiply(this.qPlane);
    if (pass > 0) {
      const tangent = this.tmp.set(Math.cos(theta), 0, -Math.sin(theta)).negate();
      const side = this.tmp2.crossVectors(this.up, tangent);
      this.mPass.makeBasis(tangent, side, this.up);
      this.qPass.setFromRotationMatrix(this.mPass);
      this.qSpin.slerp(this.qPass, pass);
    }
    saber.pivot.quaternion.copy(this.qSpin);

    // el kılıcı iter: dönüş düzleminde, bıçağın çeyrek tur önünden küçük bir daire
    const drv = (holder ? 1 : 0) * (1 - pass);
    this.drive
      .set(Math.cos(spin + Math.PI / 2), Math.sin(spin + Math.PI / 2), 0)
      .multiplyScalar(0.045 * drv)
      .applyQuaternion(this.qPlane)
      .add(sc);
    saber.pivot.position.copy(this.drive).multiplyScalar(MODEL_SCALE);

    if (!rig) return;

    // --- eller ---------------------------------------------------------------------------------
    this.axis.set(1, 0, 0).applyQuaternion(saber.pivot.quaternion);
    // tutan yumruk kılıçla döner; her yarım turda parmaklar kılıcı yuvarlayıp yeniden kavrar
    const u = (((spin % Math.PI) + Math.PI) % Math.PI) / Math.PI;
    const roll = u < 0.6 ? Math.PI * u : Math.PI * 0.6 * (0.5 + 0.5 * Math.cos((Math.PI * (u - 0.6)) / 0.4));
    const th = spin - Math.PI * u + roll - Math.PI * 0.3;
    this.thumb
      .set(Math.cos(th), Math.sin(th), 0)
      .applyQuaternion(this.qPlane)
      .lerp(this.axis, pass)
      .normalize();

    // boştaki eller bacak yanında gevşekçe sallanır
    const sw = Math.sin(t * 2.2) * 0.03;
    this.restR.set(-0.27, 0.87, 0.07 + sw);
    this.restL.set(0.27, 0.87, 0.07 - sw);
    const hR = this.handR.copy(this.restR);
    const hL = this.handL.copy(this.restL);
    const dR = this.thumbR.copy(this.freeThumbR);
    const dL = this.thumbL.copy(this.freeThumbL);
    if (holder === 'R') {
      hR.copy(this.drive);
      dR.copy(this.thumb);
    }
    if (holder === 'L') {
      hL.copy(this.drive);
      dL.copy(this.thumb);
    }
    const reach = (
      hand: T.Vector3,
      thumb: T.Vector3,
      from: T.Vector3,
      fromThumb: T.Vector3,
      offset: number,
      k: number,
    ) => {
      this.tmp.copy(this.drive).addScaledVector(this.axis, offset);
      hand.lerpVectors(from, this.tmp, k);
      thumb.copy(fromThumb).lerp(this.thumb, k).normalize();
    };
    if (tc >= 2.0 && tc < 2.6) {
      // sol el gelip kılıcı sağ yumruğun hemen yanından alır
      reach(hL, dL, this.restL, this.freeThumbL, 0.1, ez((tc - 2.0) / 0.6));
    } else if (tc >= 2.6 && tc < 3.0) {
      // sağ el bırakıp geri çekilir
      const k = ez((tc - 2.6) / 0.4);
      hR.lerpVectors(this.drive, this.restR, k);
      dR.copy(this.thumb).lerp(this.freeThumbR, k).normalize();
    } else if (tc >= 4.5 && tc < 4.9) {
      // sağ el sırtın arkasına uzanıp kılıcı alır
      reach(hR, dR, this.restR, this.freeThumbR, -0.1, ez((tc - 4.5) / 0.4));
    } else if (tc >= 4.9 && tc < 5.3) {
      // sol el sırtın arkasında bırakıp yerine döner
      const k = ez((tc - 4.9) / 0.4);
      this.tmp.copy(this.drive).addScaledVector(this.axis, 0.1);
      hL.lerpVectors(this.tmp, this.restL, k);
      dL.copy(this.thumb).lerp(this.freeThumbL, k).normalize();
    } else if (flight >= 0) {
      // atan el aşağı iner, sonra yakalamak için kılıca uzanır
      hR.lerpVectors(this.tmp.copy(this.tossFrom).setY(0.95), this.drive, ez((flight - 0.35) / 0.65));
      dR.copy(this.freeThumbR)
        .lerp(this.thumb, ez((flight - 0.5) / 0.5))
        .normalize();
    }
    if (!this.handsReady) {
      this.smoothR.copy(hR);
      this.smoothL.copy(hL);
      this.handsReady = true;
    }
    this.smoothR.lerp(hR, holder === 'R' ? 1 : sm);
    this.smoothL.lerp(hL, holder === 'L' ? 1 : sm);

    // --- gövde ---------------------------------------------------------------------------------
    // ağırlık kılıcın tarafına, kalça biraz döner, göğüs daha çok; baş bakışını önde tutar
    const ax = Math.max(-0.45, Math.min(0.45, sc.x));
    const behind = pass > 0 ? Math.max(0, -Math.cos(theta)) : 0;
    const o = this.pose;
    o.hipYaw = 0.32 * ax;
    o.hipX = 0.09 * ax;
    o.drop = 0.05 + 0.015 * bob + 0.02 * behind;
    o.twist = 0.5 * ax;
    o.lean = 0.1 + 0.1 * behind;
    o.side = -0.14 * ax;
    o.headYaw = -(o.hipYaw + o.twist) * 0.6;
    o.headPitch = flight >= 0 ? -0.4 * Math.sin(Math.PI * flight) : 0;
    // kılıcı tutan kol ritme eşlik eder: omuz kalkıp iner, bilek bükülür, dirsek daire çizer
    const dRm = holder === 'R' ? drv : 0;
    const dLm = holder === 'L' ? drv : 0;
    o.shrugR = (holder === 'R' ? 0.02 : 0) + 0.012 * dRm * Math.sin(spin);
    o.shrugL = (holder === 'L' ? 0.02 : 0) + 0.012 * dLm * Math.sin(spin);
    rig.R.flex = 0.38 * dRm * Math.sin(spin + 0.6);
    rig.L.flex = -0.38 * dLm * Math.sin(spin + 0.6);
    rig.R.pole
      .copy(rig.R.pole0)
      .add(this.tmp.set(0.25 * Math.cos(spin), 0.22 * Math.sin(spin), 0).multiplyScalar(dRm))
      .normalize();
    rig.L.pole
      .copy(rig.L.pole0)
      .add(this.tmp.set(-0.25 * Math.cos(spin), 0.22 * Math.sin(spin), 0).multiplyScalar(dLm))
      .normalize();

    poseRig(rig, this.smoothR, dR, this.smoothL, dL, o);
    this.cape.step(
      rig,
      dt,
      (pass > 0 ? 0.01 : 0.04) + (flight >= 0 ? 0.05 * Math.sin(Math.PI * flight) : 0),
      Math.min(0.12, Math.abs(omega) * 0.12 + 0.05 * Math.abs(ax)),
    );
  }
}
