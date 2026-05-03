import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err: Error) => {
            const e = err as NodeJS.ErrnoException & {
              errors?: Array<{ code?: string; message?: string }>
            }
            console.warn(
              '[vite] API proxy /api -> http://localhost:8080 failed (%s). Is Quarkus running? e.g. cd backend && ./mvnw quarkus:dev',
              e.code ?? e.message,
            )
          })
        },
      },
    },
  },
})

// Made with Bob
