import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingPage } from '@/components/ui/Loading'
import { UserRole } from '@/types'
import type { ReactNode } from 'react'
import { studentDemoEnabled } from '@/config/demoFlags'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: import('@/types').UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    const home =
      user.rol === UserRole.ESTUDIANTE && studentDemoEnabled()
        ? '/student/dashboard'
        : '/dashboard'
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">Access Denied</h1>
          <p className="mb-6 text-slate-600">
            You don't have permission to access this page.
          </p>
          <a href={home} className="font-medium text-teal-600 hover:text-teal-500">
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Made with Bob