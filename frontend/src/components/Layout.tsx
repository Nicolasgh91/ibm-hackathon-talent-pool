import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { UserRole } from '@/types'
import type { ReactNode } from 'react'

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">Talent Pool</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
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
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                {link.label}
              </Link>
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