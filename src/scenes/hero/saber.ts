import * as T from 'three';
import { mk } from '../helpers';

export interface Saber {
  /** Konumu ve yönü her karede koreografi verir. */
  pivot: T.Group;
  /** Kabza + bıçak; yerel +x bıçak yönü, orijin kabzanın ortası (yumruğun içi). */
  body: T.Group;
  /** Bıçağın ucu (iz ve etiket buradan çıkar). */
  tip: T.Object3D;
}

/** Tek bıçaklı kırmızı ışın kılıcı. Bıçak ucu yere değmesin diye 0.6 ölçeğinde. */
export function createSaber(parent: T.Object3D): Saber {
  const metal = new T.MeshStandardMaterial({ color: 0xc9c7c2, roughness: 0.35, metalness: 0.7 });
  const grip = new T.MeshStandardMaterial({ color: 0x1c1c20, roughness: 0.5, metalness: 0.5 });
  const ring = new T.MeshStandardMaterial({
    color: 0xff2a2a,
    emissive: 0xff1010,
    emissiveIntensity: 0.9,
    roughness: 0.4,
  });
  const core = new T.MeshBasicMaterial({ color: 0xffe8e6 });
  const glow = new T.MeshBasicMaterial({
    color: 0xff2a1f,
    transparent: true,
    opacity: 0.55,
    blending: T.AdditiveBlending,
    depthWrite: false,
  });
  const halo = new T.MeshBasicMaterial({
    color: 0xff0a00,
    transparent: true,
    opacity: 0.16,
    blending: T.AdditiveBlending,
    depthWrite: false,
  });

  const pivot = new T.Group();
  parent.add(pivot);
  const body = new T.Group();
  body.scale.setScalar(0.6);
  pivot.add(body);

  // Silindirler y ekseninde üretilir; hepsini x eksenine yatırıyoruz.
  const along = (m: T.Object3D) => {
    m.rotation.z = Math.PI / 2;
    return m;
  };
  along(mk(new T.CylinderGeometry(0.025, 0.027, 0.4, 12), grip, body));
  for (const x of [-0.16, -0.09, 0.1, 0.17])
    along(mk(new T.CylinderGeometry(0.031, 0.031, 0.025, 10), ring, body, x));
  along(mk(new T.CylinderGeometry(0.036, 0.03, 0.06, 10), metal, body, -0.22)); // kabzanın dibi
  along(mk(new T.CylinderGeometry(0.036, 0.03, 0.06, 10), metal, body, 0.22)); // bıçak çıkışı

  const blade = along(mk(new T.CylinderGeometry(0.013, 0.015, 0.95, 8), core, body, 0.73));
  blade.castShadow = false;
  const g1 = along(new T.Mesh(new T.CylinderGeometry(0.036, 0.04, 0.98, 12), glow));
  g1.position.x = 0.73;
  body.add(g1);
  const g2 = along(new T.Mesh(new T.CylinderGeometry(0.085, 0.09, 1.03, 12), halo));
  g2.position.x = 0.73;
  body.add(g2);
  const light = new T.PointLight(0xff3326, 1.4, 1.8);
  light.position.x = 0.7;
  body.add(light);

  const tip = new T.Object3D();
  tip.position.x = 1.22;
  body.add(tip);

  return { pivot, body, tip };
}
