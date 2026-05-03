import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Link, Navigate } from 'react-router-dom'
import { UserRole } from '@/types'
import { studentDemoEnabled } from '@/config/demoFlags'

export function Dashboard() {
  const { user } = useAuth()

  if (user?.rol === UserRole.ESTUDIANTE && studentDemoEnabled()) {
    return <Navigate to="/student/dashboard" replace />
  }

  const getQuickActions = () => {
    if (!user) return []

    if (user.rol === UserRole.RECLUTADOR) {
      return [
        {
          title: 'Create Organization',
          description: 'Set up a new organization to manage positions',
          link: '/organizations/new',
          icon: '🏢',
        },
        {
          title: 'Create Position',
          description: 'Define a new job position',
          link: '/positions/new',
          icon: '💼',
        },
        {
          title: 'Generate Challenge',
          description: 'Create AI-powered technical challenges',
          link: '/challenges/generate',
          icon: '🎯',
        },
        {
          title: 'View Rankings',
          description: 'See candidate performance rankings',
          link: '/rankings',
          icon: '📊',
        },
      ]
    }

    if (user.rol === UserRole.CANDIDATO) {
      return [
        {
          title: 'My Invitations',
          description: 'View pending challenge invitations',
          link: '/invitations',
          icon: '📧',
        },
        {
          title: 'My Challenges',
          description: 'Access your active challenges',
          link: '/my-challenges',
          icon: '💻',
        },
      ]
    }

    if (user.rol === UserRole.ESTUDIANTE) {
      return [
        {
          title: 'Student dashboard',
          description: 'Course, practices, collaborative repository (demo)',
          link: '/student/dashboard',
          icon: '🎓',
        },
      ]
    }

    return []
  }

  const quickActions = getQuickActions()

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.nombre}!
          </h1>
          <p className="mt-2 text-gray-600">
            {user?.rol === UserRole.RECLUTADOR && 
              'Manage your technical challenges and evaluate candidates.'}
            {user?.rol === UserRole.CANDIDATO && 
              'Complete challenges and showcase your technical skills.'}
            {user?.rol === UserRole.DOCENTE && 
              'Create courses and manage student progress.'}
            {user?.rol === UserRole.ESTUDIANTE && 
              'Learn and practice with AI-powered challenges.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Card key={action.link} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-3">{action.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {action.description}
                  </p>
                  <Link to={action.link}>
                    <Button variant="primary" size="sm" fullWidth>
                      Go
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary-600">0</p>
                <p className="text-sm text-gray-500 mt-1">No challenges yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {user?.rol === UserRole.RECLUTADOR ? 'Candidates' : 'Completed'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-500 mt-1">
                  {user?.rol === UserRole.RECLUTADOR ? 'No candidates yet' : 'No completions yet'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">-</p>
                <p className="text-sm text-gray-500 mt-1">No data available</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.rol === UserRole.RECLUTADOR && (
                <>
                  <div className="flex items-start">
                    <span className="text-primary-600 font-bold mr-3">1.</span>
                    <p className="text-gray-700">Create an organization to get started</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary-600 font-bold mr-3">2.</span>
                    <p className="text-gray-700">Define job positions with required skills</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary-600 font-bold mr-3">3.</span>
                    <p className="text-gray-700">Generate AI-powered challenges for each position</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary-600 font-bold mr-3">4.</span>
                    <p className="text-gray-700">Invite candidates and review their solutions</p>
                  </div>
                </>
              )}
              {user?.rol === UserRole.CANDIDATO && (
                <>
                  <div className="flex items-start">
                    <span className="text-primary-600 font-bold mr-3">1.</span>
                    <p className="text-gray-700">Wait for challenge invitations from recruiters</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary-600 font-bold mr-3">2.</span>
                    <p className="text-gray-700">Accept invitations and read challenge requirements</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary-600 font-bold mr-3">3.</span>
                    <p className="text-gray-700">Write your solution using the code editor</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary-600 font-bold mr-3">4.</span>
                    <p className="text-gray-700">Submit and receive AI-powered feedback</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

// Made with Bob