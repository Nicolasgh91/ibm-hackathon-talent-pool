/**
 * Demo mode singleton: persists in sessionStorage so the choice survives
 * route changes inside a tab but not across tabs/sessions. EventTarget pub/sub
 * lets the banner re-render without prop drilling.
 */

const ENABLED_KEY = 'tp_demo_mode'
const REASON_KEY = 'tp_demo_reason'

type Listener = () => void

class DemoModeBus {
  private readonly target = new EventTarget()
  private readonly evt = 'change'

  is(): boolean {
    try {
      return sessionStorage.getItem(ENABLED_KEY) === 'true'
    } catch {
      return false
    }
  }

  reason(): string | null {
    try {
      return sessionStorage.getItem(REASON_KEY)
    } catch {
      return null
    }
  }

  enable(reason: string): void {
    if (this.is()) return
    try {
      sessionStorage.setItem(ENABLED_KEY, 'true')
      sessionStorage.setItem(REASON_KEY, reason)
    } catch {
      /* private browsing / quota: noop */
    }
    this.target.dispatchEvent(new Event(this.evt))
  }

  disable(): void {
    try {
      sessionStorage.removeItem(ENABLED_KEY)
      sessionStorage.removeItem(REASON_KEY)
    } catch {
      /* ignore */
    }
    this.target.dispatchEvent(new Event(this.evt))
  }

  subscribe(listener: Listener): () => void {
    const wrapped = () => listener()
    this.target.addEventListener(this.evt, wrapped)
    return () => this.target.removeEventListener(this.evt, wrapped)
  }
}

const bus = new DemoModeBus()

// Hackathon: skip hitting real backend by bootstrapping demo mode on load.
if (typeof window !== 'undefined' && import.meta.env.VITE_FORCE_DEMO === 'true') {
  bus.enable('VITE_FORCE_DEMO')
}

export function isDemoMode(): boolean {
  return bus.is()
}

export function getDemoReason(): string | null {
  return bus.reason()
}

export function enableDemoMode(reason: string): void {
  bus.enable(reason)
}

export function disableDemoMode(): void {
  bus.disable()
}

export function subscribeDemoMode(listener: Listener): () => void {
  return bus.subscribe(listener)
}

// Made with Bob
