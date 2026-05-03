import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { studentDemoEnabled } from '@/config/demoFlags'

/** When student demo is disabled, hide Phase 5 mock routes. */
export function StudentDemoGate({ children }: { children: ReactNode }) {
  if (!studentDemoEnabled()) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}
