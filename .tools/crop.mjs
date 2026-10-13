// İki görüntüden aynı bölgeyi tam çözünürlükte yan yana keser.
// Kullanım: node crop.mjs <tasarim.jpg> <site.png> <çıktı.png> <x> <y> <w> <h> [siteDy=0]
import fs from 'node:fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const [, , dp, sp, outPath, X, Y, W, H, DY] = process.argv;
const [x, y, w, h, dy] = [X, Y, W, H, DY || 0].map(Number);
const d = jpeg.decode(fs.readFileSync(dp), { useTArray: true });
const s = PNG.sync.read(fs.readFileSync(sp));
const out = new PNG({ width: w * 2 + 8, height: h });
out.data.fill(90);
const copy = (img, ox, oy) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const sx = x + i, sy = oy + j;
    if (sx >= img.width || sy >= img.height || sy < 0) continue;
    const a = (sy * img.width + sx) * 4, b = (j * out.width + ox + i) * 4;
    out.data[b] = img.data[a]; out.data[b + 1] = img.data[a + 1]; out.data[b + 2] = img.data[a + 2]; out.data[b + 3] = 255;
  }
};
copy(d, 0, y);
copy(s, w + 8, y + dy);
fs.writeFileSync(outPath, PNG.sync.write(out));
console.log('yazıldı', outPath);
