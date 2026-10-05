import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Plugin to ensure server.ws safely handles send calls when HMR is disabled in AI Studio
const safeWsPlugin = (): Plugin => ({
  name: 'safe-ws-plugin',
  configureServer(server) {
    if (!server.ws) {
      server.ws = {
        send: () => {},
        close: () => {},
        on: () => {},
        off: () => {},
        clients: new Set(),
      } as unknown as typeof server.ws;
    } else if (typeof server.ws.send !== 'function') {
      server.ws.send = () => {};
    }
  },
});

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      safeWsPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'manifest.json', 'favicon.ico'],
        manifest: {
          id: '/',
          name: 'Kalender Akademik SMK IT Ibnul Qayyim',
          short_name: 'KaldikSMKIT',
          description: 'Sistem Informasi Kalender Akademik Resmi SMK IT Ibnul Qayyim Makassar Tahun Pelajaran 2026/2027',
          start_url: './',
          scope: './',
          display: 'standalone',
          orientation: 'portrait',
          theme_color: '#143c14',
          background_color: '#143c14',
          icons: [
            {
              src: './icon.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: './icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              // Navigation / App Document Shell (StaleWhileRevalidate for instant offline recovery)
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'app-pages-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // Scripts, Styles & Manifest (StaleWhileRevalidate for synchronization)
              urlPattern: ({ request }) =>
                request.destination === 'script' ||
                request.destination === 'style' ||
                request.destination === 'manifest',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'app-static-resources-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // Image assets & icons
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'app-images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 60, // 60 hari
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

