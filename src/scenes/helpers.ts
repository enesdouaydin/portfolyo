import * as T from 'three';

/** Mesh oluşturup `parent`'a ekler; gölge atar ve alır. Tüm sahnelerde aynı yardımcı. */
export function mk(
  geo: T.BufferGeometry,
  mat: T.Material,
  parent: T.Object3D,
  x?: number,
  y?: number,
  z?: number,
) {
  const m = new T.Mesh(geo, mat);
  m.position.set(x || 0, y || 0, z || 0);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

/** Proje sayfalarının ortak ışıkları: yarım küre + gölge düşüren anahtar ışık + mavi kenar ışığı. */
export function mkLights(scene: T.Scene, size: number) {
  scene.add(new T.HemisphereLight(0xf2efe8, 0x0a0a0a, 0.5));
  const key = new T.DirectionalLight(0xfff1e4, 1.5);
  key.position.set(size * 0.5, size * 0.9, size * 0.6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const c = key.shadow.camera;
  c.left = -size;
  c.right = size;
  c.top = size;
  c.bottom = -size;
  c.near = 0.5;
  c.far = size * 4;
  key.shadow.bias = -0.0005;
  key.shadow.radius = 3;
  scene.add(key);
  const rim = new T.DirectionalLight(0x7d93ff, 0.7);
  rim.position.set(-size, size * 0.5, -size);
  scene.add(rim);
  return key;
}

/** Proje sayfalarının ortak kamera/render ayarı: dar ekranda geniş görüş açısı. */
export const projectStageOptions = {
  fov: 32,
  narrowFov: 44,
  near: 0.1,
  far: 200,
} as const;
