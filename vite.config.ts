/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Запросы /api уходят в API Gateway: браузер видит один origin, CORS не нужен.
  // Работает и в dev (`vite`), и в `vite preview`, которым админка запускается на Amvera.
  const apiProxy = {
    '/api': {
      target: env.API_PROXY_TARGET || 'https://mpi.notme.work.gd',
      changeOrigin: true,
    },
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: apiProxy,
    },
    // `npm run start` (Amvera): раздаёт собранный dist на порту 3000.
    preview: {
      host: true,
      port: 3000,
      strictPort: true,
      // Домен выдаёт Amvera, заранее он неизвестен.
      allowedHosts: true,
      proxy: apiProxy,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      css: false,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/shared/api/generated/**',
          'src/shared/mocks/**',
          'src/test/**',
          'src/**/*.{test,spec}.{ts,tsx}',
          'src/main.tsx',
        ],
      },
    },
  }
})
