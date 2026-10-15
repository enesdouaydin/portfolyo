// GLB dosyasının içeriğini (ağ gerektirmeden) özetler: görseller (boyut/çözünürlük), geometri, kemikler, animasyonlar.
// Kullanım: node glb-inspect.mjs <dosya.glb>
import fs from 'node:fs';

const file = process.argv[2];
const buf = fs.readFileSync(file);
if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error('GLB değil');
let off = 12;
let json = null;
let bin = null;
while (off < buf.length) {
  const len = buf.readUInt32LE(off);
  const type = buf.readUInt32LE(off + 4);
  const data = buf.subarray(off + 8, off + 8 + len);
  if (type === 0x4e4f534a) json = JSON.parse(data.toString('utf8'));
  else if (type === 0x004e4942) bin = data;
  off += 8 + len;
}
const kb = (n) => (n / 1024).toFixed(0).padStart(7) + ' KB';
console.log(`Dosya: ${(buf.length / 1048576).toFixed(2)} MB  | JSON: ${(JSON.stringify(json).length / 1024).toFixed(0)} KB  | BIN: ${(bin.length / 1048576).toFixed(2)} MB`);
console.log('Eklentiler:', json.extensionsUsed || '(yok)');

// PNG/JPEG çözünürlüğü başlıktan oku
function dims(b, mime) {
  if (mime === 'image/png') return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (mime === 'image/jpeg') {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) return null;
      const m = b[i + 1];
      const l = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + l;
    }
  }
  return null;
}

let imgTotal = 0;
console.log('\nGÖRSELLER (' + (json.images || []).length + '):');
(json.images || []).forEach((im, i) => {
  const bv = json.bufferViews[im.bufferView];
  const data = bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength);
  const d = dims(data, im.mimeType);
  imgTotal += bv.byteLength;
  const users = [];
  (json.materials || []).forEach((m, mi) => {
    const t = (x) => x && json.textures[x.index]?.source;
    const slots = {
      baseColor: t(m.pbrMetallicRoughness?.baseColorTexture),
      metalRough: t(m.pbrMetallicRoughness?.metallicRoughnessTexture),
      normal: t(m.normalTexture),
      occlusion: t(m.occlusionTexture),
      emissive: t(m.emissiveTexture),
    };
    for (const [k, v] of Object.entries(slots)) if (v === i) users.push(`${m.name || 'mat' + mi}.${k}`);
  });
  console.log(`  #${i} ${im.mimeType.padEnd(10)} ${d ? d.join('×').padEnd(10) : '?'.padEnd(10)} ${kb(bv.byteLength)}  ${users.join(', ')}`);
});
console.log(`  toplam görsel: ${(imgTotal / 1048576).toFixed(2)} MB (${((imgTotal / buf.length) * 100).toFixed(0)}% dosyanın)`);

// Geometri
let vtx = 0;
let tri = 0;
let geoBytes = 0;
const seen = new Set();
for (const m of json.meshes || []) {
  for (const p of m.primitives) {
    const pos = json.accessors[p.attributes.POSITION];
    vtx += pos.count;
    if (p.indices !== undefined) tri += json.accessors[p.indices].count / 3;
    for (const a of [...Object.values(p.attributes), ...(p.indices !== undefined ? [p.indices] : [])]) {
      if (seen.has(a)) continue;
      seen.add(a);
      const acc = json.accessors[a];
      const comp = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 }[acc.componentType];
      const n = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 }[acc.type];
      geoBytes += acc.count * comp * n;
    }
  }
}
console.log(`\nGEOMETRİ: ${(json.meshes || []).length} mesh, ${vtx.toLocaleString()} köşe, ${Math.round(tri).toLocaleString()} üçgen, ~${(geoBytes / 1048576).toFixed(2)} MB`);
console.log(`Malzeme: ${(json.materials || []).length}, doku: ${(json.textures || []).length}, kemik takımı (skin): ${(json.skins || []).length}, animasyon: ${(json.animations || []).length}`);
for (const a of json.animations || []) console.log(`  animasyon "${a.name}": ${a.channels.length} kanal`);
const sk = (json.skins || [])[0];
if (sk) console.log(`  skin eklem sayısı: ${sk.joints.length}`);
