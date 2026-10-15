import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// 3D hero modeli (~7 MB) GitHub Pages'te sıkıştırılmadan gider; derlemede yanına gzip'li kopyası yazılır
// (src/scenes/hero/modelLoader.ts bunu tarayıcıda açar). Düz .glb yedek olarak kalır.
function gzipHeroModel(): Plugin {
  let outDir = 'dist';
  return {
    name: 'gzip-hero-model',
    apply: 'build',
    configResolved(c) {
      outDir = resolve(c.root, c.build.outDir);
    },
    closeBundle() {
      const glb = resolve(outDir, 'media/enes.glb');
      if (existsSync(glb)) writeFileSync(`${glb}.gz`, gzipSync(readFileSync(glb), { level: 9 }));
    },
  };
}

// Docker Desktop (Windows) üzerindeki bind mount'larda dosya olayları gelmediği için
// compose içinde CHOKIDAR_USEPOLLING=true verilir; yerelde normal izleme kullanılır.
const polling = process.env.CHOKIDAR_USEPOLLING === 'true';

// GitHub Pages proje sitesi alt yoldan sunulur (kullanici.github.io/portfolyo/): derlemede VITE_BASE=/portfolyo/ verilir.
// Verilmezse (geliştirme, Docker/nginx) site kökten çalışır.
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react(), gzipHeroModel()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // Playwright konteyneri siteye host.docker.internal üzerinden erişir (ekran görüntüsü karşılaştırması).
    allowedHosts: ['host.docker.internal'],
    watch: polling ? { usePolling: true, interval: 300 } : undefined,
  },
  preview: { host: true, port: 4173 },
});
