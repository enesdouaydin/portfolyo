import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Docker Desktop (Windows) üzerindeki bind mount'larda dosya olayları gelmediği için
// compose içinde CHOKIDAR_USEPOLLING=true verilir; yerelde normal izleme kullanılır.
const polling = process.env.CHOKIDAR_USEPOLLING === 'true';

export default defineConfig({
  plugins: [react()],
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
