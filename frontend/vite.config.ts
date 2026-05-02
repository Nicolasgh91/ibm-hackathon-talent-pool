import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'node:fs'

// #region agent log
const DEBUG_LOG = '/home/nicogabh/projects/hackathon/.cursor/debug-86025f.log'
function agentDbg(payload: Record<string, unknown>) {
  try {
    fs.appendFileSync(
      DEBUG_LOG,
      JSON.stringify({
        sessionId: '86025f',
        timestamp: Date.now(),
        ...payload,
      }) + '\n'
    )
  } catch {
    /* ignore */
  }
}
// #endregion

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
          // #region agent log
          agentDbg({
            hypothesisId: 'H2',
            location: 'vite.config.ts:proxy.configure',
            message: 'proxy initialized',
            data: { target: 'http://localhost:8080', apiPrefix: '/api' },
          })
          proxy.on('error', (err: Error, req) => {
            const e = err as NodeJS.ErrnoException & {
              errors?: Array<{ code?: string; message?: string }>
            }
            const aggregateCodes =
              Array.isArray(e.errors) && e.errors.length > 0
                ? e.errors.map((x) => x.code ?? x.message).join(',')
                : null
            agentDbg({
              hypothesisId: 'H1',
              location: 'vite.config.ts:proxy.error',
              message: 'proxy upstream error',
              data: {
                errCode: e.code ?? null,
                errMessage: e.message,
                aggregateCodes,
                reqUrl: req?.url ?? null,
                syscall: e.syscall ?? null,
              },
            })
            console.warn(
              '[vite] API proxy /api -> http://localhost:8080 failed (%s). Is Quarkus running? e.g. cd backend && ./mvnw quarkus:dev',
              e.code ?? e.message
            )
          })
          // #endregion
        },
      },
    },
  },
})

// Made with Bob
