import * as T from 'three';
import { mk, mkLights, projectStageOptions } from './helpers';
import type { SceneContext, SceneController, StageOptions } from './types';

/** Sesli Asistan sahnesi: telefonla konuşan figür + 10 uyduyla dönen AI çekirdeği + aradaki ses çubukları. */
export const voiceStageOptions: StageOptions = { ...projectStageOptions, loop: 20 };

export function createVoiceScene(ctx: SceneContext): SceneController {
  const { scene, camera: cam } = ctx;
  scene.fog = new T.Fog(0x0a0a0a, 7, 16);
  const key = mkLights(scene, 5);
  key.intensity = 1.3;
  const clay = new T.MeshStandardMaterial({ color: 0xd9d4c9, roughness: 0.5, flatShading: true });
  const clayS = new T.MeshStandardMaterial({ color: 0xd9d4c9, roughness: 0.48 });
  const dark = new T.MeshStandardMaterial({
    color: 0x2a2a30,
    roughness: 0.55,
    metalness: 0.35,
    flatShading: true,
  });
  const darkS = new T.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.5, metalness: 0.35 });
  const trim = new T.MeshStandardMaterial({ color: 0xffd60a, emissive: 0xffc300, emissiveIntensity: 0.9 });

  const floor = new T.Mesh(
    new T.CircleGeometry(12, 64),
    new T.MeshStandardMaterial({ color: 0x060607, roughness: 1 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  [
    [-1.7, 0.75],
    [1.9, 0.9],
  ].forEach((r) => {
    const rg = new T.Mesh(
      new T.RingGeometry(r[1], r[1] + 0.012, 96),
      new T.MeshBasicMaterial({ color: 0x3a3a40 }),
    );
    rg.rotation.x = -Math.PI / 2;
    rg.position.set(r[0], 0.003, 0);
    scene.add(rg);
  });

  // caller
  const fig = new T.Group();
  fig.position.set(-1.7, 0, 0);
  fig.rotation.y = 0.55;
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
  const phoneScreen = new T.MeshStandardMaterial({
    color: 0x111111,
    emissive: 0xffd60a,
    emissiveIntensity: 0.3,
  });
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
  // phone in right hand (s = 1 is the figure's left side in local x; use -1 so it faces camera)
  const A0 = arms[-1];
  const phone = new T.Group();
  phone.position.set(0.02, -0.29, 0.02);
  phone.rotation.set(0, 0, 0.2);
  A0.el.add(phone);
  mk(new T.BoxGeometry(0.07, 0.15, 0.015), dark, phone, 0, 0, 0);
  mk(new T.BoxGeometry(0.06, 0.13, 0.002), phoneScreen, phone, 0, 0, 0.009);
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

  // agent core
  const agent = new T.Group();
  agent.position.set(1.9, 1.45, 0);
  scene.add(agent);
  const coreMat = new T.MeshStandardMaterial({
    color: 0xffd60a,
    emissive: 0xffc300,
    emissiveIntensity: 1.2,
    roughness: 0.3,
    flatShading: true,
  });
  const core = mk(new T.IcosahedronGeometry(0.24, 0), coreMat, agent, 0, 0, 0);
  const shell = new T.Mesh(
    new T.IcosahedronGeometry(0.44, 1),
    new T.MeshBasicMaterial({ color: 0xffe066, wireframe: true, transparent: true, opacity: 0.35 }),
  );
  agent.add(shell);
  const halo = new T.Mesh(
    new T.SphereGeometry(0.62, 24, 16),
    new T.MeshBasicMaterial({
      color: 0xffd60a,
      transparent: true,
      opacity: 0.06,
      blending: T.AdditiveBlending,
      depthWrite: false,
    }),
  );
  agent.add(halo);
  const aLight = new T.PointLight(0xffd34d, 1.4, 4);
  agent.add(aLight);
  mk(new T.CylinderGeometry(0.32, 0.42, 0.12, 24), dark, scene, 1.9, 0.06, 0);
  const sats: { m: T.Mesh; mat: T.MeshStandardMaterial; r: number; sp: number; ph: number; tilt: number }[] =
    [];
  for (let i = 0; i < 10; i++) {
    const sm = new T.MeshStandardMaterial({
      color: 0x8a877f,
      emissive: 0xffc300,
      emissiveIntensity: 0,
      roughness: 0.4,
    });
    const sat = mk(new T.SphereGeometry(0.055, 12, 8), sm, agent, 0, 0, 0);
    sats.push({
      m: sat,
      mat: sm,
      r: 0.72 + (i % 3) * 0.12,
      sp: 0.5 + (i % 4) * 0.18,
      ph: i * 0.63,
      tilt: (i % 5) * 0.35 - 0.7,
    });
  }
  const linePos = new Float32Array(10 * 6);
  const lg = new T.BufferGeometry();
  lg.setAttribute('position', new T.BufferAttribute(linePos, 3));
  const lines = new T.LineSegments(
    lg,
    new T.LineBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.25 }),
  );
  agent.add(lines);

  // voice bars between caller and agent
  const NB = 34;
  const bars: T.Mesh[] = [];
  const barMat = new T.MeshBasicMaterial({ color: 0xffd60a });
  const barMat2 = new T.MeshBasicMaterial({ color: 0xedebe6 });
  for (let b = 0; b < NB; b++) {
    const x = -1.15 + (b / (NB - 1)) * 2.55;
    const bar = new T.Mesh(new T.BoxGeometry(0.03, 1, 0.03), barMat2);
    bar.position.set(x, 1.55, 0.25);
    scene.add(bar);
    bars.push(bar);
  }

  const camPos = new T.Vector3(0.2, 1.7, 7);
  const look = new T.Vector3(0.15, 1.25, 0);
  function speaker(p: number) {
    if (p < 0.1) return 'ring';
    if (p < 0.3) return 'cust';
    if (p < 0.42) return 'think';
    if (p < 0.6) return 'agent';
    if (p < 0.75) return 'cust';
    if (p < 0.8) return 'think';
    if (p < 0.92) return 'agent';
    return 'done';
  }
  const tP = new T.Vector3();
  const lv = { c: 0, a: 0, k: 0 };
  const down = new T.Vector3(0, -1, 0);
  const shP = new T.Vector3(-0.27, 1.43, 0);
  const elP = new T.Vector3(-0.43, 1.6, 0.14);
  const hdP = new T.Vector3(-0.16, 1.63, 0.06);
  const d1 = elP.clone().sub(shP).normalize();
  const d2 = hdP.clone().sub(elP).normalize();
  const qS = new T.Quaternion().setFromUnitVectors(down, d1);
  const d2l = d2.clone().applyQuaternion(qS.clone().invert());
  const qE = new T.Quaternion().setFromUnitVectors(down, d2l);
  return {
    update(p, t, _dt, narrow) {
      const sp = speaker(p);
      const kk = ctx.k || 0.06;
      lv.c += ((sp === 'cust' ? 1 : 0) - lv.c) * kk * 2;
      lv.a += ((sp === 'agent' ? 1 : 0) - lv.a) * kk * 2;
      lv.k += ((sp === 'think' ? 1 : 0) - lv.k) * kk * 2;
      // arm pose: phone to ear
      const A = arms[-1];
      const B = arms[1];
      A.sh.quaternion.copy(qS);
      A.el.quaternion.copy(qE);
      B.sh.rotation.set(0.05, 0, -0.12);
      B.el.rotation.set(-0.35 - lv.c * Math.abs(Math.sin(t * 3)) * 0.4, 0, 0);
      head.rotation.y = -0.25 + Math.sin(t * 0.8) * 0.05;
      head.rotation.x = lv.c * Math.sin(t * 6) * 0.05 + lv.a * 0.08;
      fig.position.y = Math.sin(t * 1.5) * 0.006;
      phoneScreen.emissiveIntensity = sp === 'ring' ? 0.4 + Math.abs(Math.sin(t * 8)) * 1.2 : 0.5;
      phone.rotation.z = sp === 'ring' ? Math.sin(t * 40) * 0.08 : 0;
      // agent
      agent.position.y = 1.45 + Math.sin(t * 1.4) * 0.05;
      core.rotation.x = t * 0.6;
      core.rotation.y = t * 0.9;
      shell.rotation.y = -t * (0.25 + lv.k * 1.6);
      shell.rotation.z = t * 0.15;
      const pulse = 1 + lv.a * Math.abs(Math.sin(t * 7)) * 0.18 + lv.k * Math.sin(t * 10) * 0.05;
      core.scale.setScalar(pulse);
      (halo.material as T.MeshBasicMaterial).opacity = 0.05 + lv.a * 0.08 + lv.k * 0.06;
      aLight.intensity = 1.0 + lv.a * 1.5 + lv.k;
      sats.forEach((s, i) => {
        const ang = s.ph + t * s.sp * (1 + lv.k * 2.5);
        s.m.position.set(
          Math.cos(ang) * s.r,
          Math.sin(ang * 1.3) * s.r * Math.sin(s.tilt) * 0.6,
          Math.sin(ang) * s.r * Math.cos(s.tilt),
        );
        const lit = lv.k > 0.3 ? (Math.sin(t * 6 - i * 0.7) > 0.2 ? 1 : 0.15) : 0.1 + lv.a * 0.4;
        s.mat.emissiveIntensity = lit * 1.4;
        linePos[i * 6] = 0;
        linePos[i * 6 + 1] = 0;
        linePos[i * 6 + 2] = 0;
        linePos[i * 6 + 3] = s.m.position.x;
        linePos[i * 6 + 4] = s.m.position.y;
        linePos[i * 6 + 5] = s.m.position.z;
      });
      lg.attributes.position.needsUpdate = true;
      lines.material.opacity = 0.12 + lv.k * 0.4;
      // bars
      bars.forEach((bar, i) => {
        const f = i / (NB - 1);
        const wc = Math.max(0, Math.sin(f * 14 - t * 9)) * (0.5 + 0.5 * Math.sin(i * 1.7 + t * 5));
        const wa = Math.max(0, Math.sin((1 - f) * 14 - t * 9)) * (0.5 + 0.5 * Math.sin(i * 2.3 + t * 6));
        const h =
          0.02 + lv.c * wc * 0.42 + lv.a * wa * 0.42 + lv.k * 0.03 * (0.5 + 0.5 * Math.sin(t * 8 + i));
        bar.scale.y = h;
        bar.material = lv.a > lv.c ? barMat : barMat2;
      });
      const orbit = Math.sin(p * Math.PI * 1.2 - 0.4) * 1.4;
      tP.set(0.2 + orbit, narrow ? 1.9 : 1.75, narrow ? 9.2 : 6.6);
      camPos.lerp(tP, kk);
      cam.position.copy(camPos);
      cam.lookAt(look);
      const stage = p < 0.1 ? 0 : p < 0.3 ? 1 : p < 0.42 ? 2 : p < 0.6 ? 3 : p < 0.75 ? 4 : p < 0.92 ? 5 : 6;
      return stage;
    },
  };
}
