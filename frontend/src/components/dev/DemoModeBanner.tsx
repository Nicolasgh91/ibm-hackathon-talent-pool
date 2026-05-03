import { useSyncExternalStore } from 'react'
import {
  disableDemoMode,
  getDemoReason,
  isDemoMode,
  subscribeDemoMode,
} from '@/mocks/demoMode'
import { getApiTransportStats } from '@/mocks/apiTransportStats'

function getSnapshot(): boolean {
  return isDemoMode()
}

function subscribe(cb: () => void): () => void {
  return subscribeDemoMode(cb)
}

export function DemoModeBanner() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, () => false)

  if (!enabled) return null

  const reason = getDemoReason()
  const stats = getApiTransportStats()

  const handleRetry = () => {
    disableDemoMode()
    // Hard reload so axios interceptors and any cached store state reset.
    window.location.reload()
  }

  return (
    <div
      className="sticky top-0 z-40 border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"
            aria-hidden
          />
          <span>
            <strong>Modo demo activo</strong> &mdash; sin backend, los datos son simulados y se reinician al refrescar.
            {reason ? (
              <span className="ml-2 text-amber-700/80">({reason})</span>
            ) : null}
            <span className="ml-3 rounded bg-white/80 px-2 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-300">
              axios demo:{stats.demo} · real:{stats.real}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleRetry}
          className="shrink-0 rounded-md border border-amber-400 bg-white px-3 py-1 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          Reintentar backend
        </button>
      </div>
    </div>
  )
}

// Made with Bob
