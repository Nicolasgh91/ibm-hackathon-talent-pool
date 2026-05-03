import { studentDemoEnabled } from '@/config/demoFlags'

export function StudentDemoBanner() {
  if (!studentDemoEnabled()) return null
  return (
    <div
      className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="status"
    >
      <strong className="font-semibold">Demo</strong> — Datos locales (sin API). Las rutas académicas se conectarán a{' '}
      <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">consultas_llm</code> /{' '}
      <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">votos_consulta</code> en Phase 5.
    </div>
  )
}
