import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { UserRole } from '@/types'
import type { ReactNode } from 'react'
import { studentDemoEnabled } from '@/config/demoFlags'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getNavigationLinks = () => {
    if (!user) return []

    if (user.rol === UserRole.ESTUDIANTE && studentDemoEnabled()) {
      return [
        { to: '/student/dashboard', label: 'Dashboard' },
        // MVP demo: oculto en nav (curso / repositorio LLM sin backend real). Rutas siguen en App.tsx.
        // { to: `/student/courses/${DEMO_COURSE_SLUG}`, label: 'Mi curso' },
        // { to: `/student/courses/${DEMO_COURSE_SLUG}/repository`, label: 'Repositorio' },
      ]
    }

    const commonLinks = [
      { to: '/dashboard', label: 'Dashboard' },
    ]

    if (user.rol === UserRole.RECLUTADOR) {
      return [
        ...commonLinks,
        { to: '/organizations', label: 'Organizations' },
        { to: '/positions', label: 'Positions' },
        { to: '/challenges', label: 'Challenges' },
        { to: '/rankings', label: 'Rankings' },
      ]
    }

    if (user.rol === UserRole.CANDIDATO) {
      return [
        ...commonLinks,
        { to: '/invitations', label: 'Invitations' },
        { to: '/my-challenges', label: 'My Challenges' },
      ]
    }

    return commonLinks
  }

  const navigationLinks = getNavigationLinks()

  const logoTo =
    user?.rol === UserRole.ESTUDIANTE && studentDemoEnabled()
      ? '/student/dashboard'
      : '/dashboard'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <Link to={logoTo} className="flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-lg font-bold text-white"
                  aria-hidden
                >
                  ✓
                </span>
                <span className="text-2xl font-bold text-primary-700">Talent Pool</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
                {navigationLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{user.nombre} {user.apellido}</span>
                    <span className="ml-2 text-gray-500">({user.rol})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2026 Talent Pool. AI-powered technical challenges.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Made with Bob