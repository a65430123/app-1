import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath, URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { buildContentBundle } from './scripts/content-bundle';

const contentRoot = fileURLToPath(new URL('./content', import.meta.url));
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/** 遠端內容 API：開發時即時提供、建置時輸出到 dist/content-api/ */
function contentApi(): Plugin {
  return {
    name: 'gct-content-api',
    configureServer(server) {
      server.middlewares.use('/content-api/', (req, res, next) => {
        const { manifest, manifestText, bundleText } = buildContentBundle(contentRoot);
        const path = (req.url ?? '').split('?')[0].replace(/^\//, '');
        const body = path === 'manifest.json' ? manifestText : path === manifest.bundle ? bundleText : null;
        if (body === null) return next();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(body);
      });
    },
    generateBundle() {
      const { manifest, manifestText, bundleText } = buildContentBundle(contentRoot);
      this.emitFile({ type: 'asset', fileName: 'content-api/manifest.json', source: manifestText });
      this.emitFile({ type: 'asset', fileName: `content-api/${manifest.bundle}`, source: bundleText });
    },
  };
}

export default defineConfig(({ mode }) => {
  /** 試用版：打包成單一 HTML（npm run build:artifact） */
  const trial = mode === 'artifact';
  return {
  ...(trial && { build: { outDir: 'dist-artifact' } }),
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    react(),
    tailwindcss(),
    !trial && contentApi(),
    trial && viteSingleFile(),
    VitePWA({
      disable: trial,
      registerType: 'prompt', // 有新版程式時由使用者按「重新整理」套用，避免操作到一半被換掉
      injectRegister: false, // 由 src/features/pwa 自行註冊（APP 內不註冊）
      includeAssets: ['icons/icon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: '工程通－工程知識平台',
        short_name: '工程通',
        description: '工序百科、材料庫、工地術語、工程計算機。',
        lang: 'zh-Hant-TW',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F5F5F2',
        theme_color: '#2B2F33',
        categories: ['education', 'utilities', 'productivity'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 程式與內建內容全部預先快取 → 第一次開啟後即可完全離線
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/content-api\//],
        cleanupOutdatedCaches: true,
        // 內容圖片（日後放在 /media/）：先用快取、背景更新
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/media/'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'gct-media', expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 90 } },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
};
});
