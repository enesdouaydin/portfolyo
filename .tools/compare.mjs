// Tasarım ekran görüntüsü (JPG) ile canlı site görüntüsünü (PNG) karşılaştırır.
// Kullanım: node compare.mjs <tasarim.jpg> <site.png> <çıktı öneki> [dilim yüksekliği=1800]
// Üretir: <önek>-fark.png (kırmızı = fark), <önek>-yanyana-NN.png (sol tasarım | sağ site, yarı ölçek).
import fs from 'node:fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [, , designPath, sitePath, prefix, sliceArg] = process.argv;
const slice = Number(sliceArg || 1800);
const d = jpeg.decode(fs.readFileSync(designPath), { useTArray: true });
const s = PNG.sync.read(fs.readFileSync(sitePath));
console.log(`tasarım ${d.width}×${d.height}  site ${s.width}×${s.height}  (yükseklik farkı ${s.height - d.height}px)`);

const w = Math.min(d.width, s.width);
const h = Math.min(d.height, s.height);
const crop = (img, W, H) => {
  const o = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) o.set(img.data.subarray(y * img.width * 4, y * img.width * 4 + W * 4), y * W * 4);
  return o;
};
const A = crop(d, w, h);
const B = crop(s, w, h);
const diff = new PNG({ width: w, height: h });
const bad = pixelmatch(A, B, diff.data, w, h, { threshold: 0.2, includeAA: false });
fs.writeFileSync(`${prefix}-fark.png`, PNG.sync.write(diff));
console.log(`farklı piksel: ${bad} / ${w * h}  (%${((bad / (w * h)) * 100).toFixed(2)})`);

// bantlar halinde fark yoğunluğu: sorunlu yeri bulmak için
const band = 300;
const rows = [];
for (let y0 = 0; y0 < h; y0 += band) {
  let n = 0;
  const y1 = Math.min(h, y0 + band);
  for (let y = y0; y < y1; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    if (diff.data[i] === 255 && diff.data[i + 1] === 0 && diff.data[i + 2] === 0) n++;
  }
  rows.push(`${y0}-${y1}: %${((n / (w * (y1 - y0))) * 100).toFixed(1)}`);
}
console.log('bant başına fark (y aralığı: yüzde): ' + rows.join(' | '));

// yarı ölçekli yan yana dilimler
const half = (data, W, y0, y1, outW) => {
  const o = new Uint8Array(outW * Math.ceil((y1 - y0) / 2) * 4);
  for (let y = 0; y < Math.floor((y1 - y0) / 2); y++) for (let x = 0; x < outW; x++) {
    const sx = x * 2, sy = y0 + y * 2;
    const i = (sy * w + sx) * 4, j = (y * outW + x) * 4;
    o[j] = data[i]; o[j + 1] = data[i + 1]; o[j + 2] = data[i + 2]; o[j + 3] = 255;
  }
  return o;
};
let n = 0;
for (let y0 = 0; y0 < h; y0 += slice) {
  const y1 = Math.min(h, y0 + slice);
  const hh = Math.floor((y1 - y0) / 2);
  const ow = Math.floor(w / 2);
  const png = new PNG({ width: ow * 2 + 6, height: hh });
  png.data.fill(60);
  const a = half(A, w, y0, y1, ow), b = half(B, w, y0, y1, ow);
  for (let y = 0; y < hh; y++) {
    for (let x = 0; x < ow; x++) {
      const i = (y * ow + x) * 4;
      const l = (y * png.width + x) * 4, r = (y * png.width + ow + 6 + x) * 4;
      png.data.set(a.subarray(i, i + 4), l);
      png.data.set(b.subarray(i, i + 4), r);
    }
  }
  fs.writeFileSync(`${prefix}-yanyana-${String(n++).padStart(2, '0')}.png`, PNG.sync.write(png));
}
console.log(`${n} yan yana dilim yazıldı`);
