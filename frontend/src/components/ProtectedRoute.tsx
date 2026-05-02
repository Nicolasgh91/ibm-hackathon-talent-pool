import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingPage } from '@/components/ui/Loading'
import type { UserRole } from '@/types'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <a
            href="/dashboard"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Made with Bob