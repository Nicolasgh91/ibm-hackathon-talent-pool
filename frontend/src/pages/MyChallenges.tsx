import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingPage } from '@/components/ui/Loading'
import { assignmentService } from '@/services/assignmentService'
import type { ChallengeAssignment } from '@/types'
import { toast } from 'sonner'

export function MyChallenges() {
  const [challenges, setChallenges] = useState<ChallengeAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active')

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    try {
      setLoading(true)
      const data = await assignmentService.getMyChallenges()
      setChallenges(data)
    } catch (error) {
      toast.error('Failed to load challenges')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      ACEPTADO: 'bg-blue-100 text-blue-800',
      RECHAZADO: 'bg-red-100 text-red-800',
      COMPLETADO: 'bg-green-100 text-green-800',
      EXPIRADO: 'bg-gray-100 text-gray-800',
    }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[status as keyof typeof colors] || colors.PENDIENTE
        }`}
      >
        {status}
      </span>
    )
  }

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'active') {
      return challenge.estado === 'ACEPTADO'
    }
    if (filter === 'completed') {
      return challenge.estado === 'COMPLETADO'
    }
    return true
  })

  if (loading) return <LoadingPage />

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Challenges</h1>
          <p className="mt-2 text-gray-600">
            View and solve your assigned technical challenges
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Active ({challenges.filter(c => c.estado === 'ACEPTADO').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'completed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed ({challenges.filter(c => c.estado === 'COMPLETADO').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({challenges.length})
          </button>
        </div>

        {filteredChallenges.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">💻</div>
              <p className="text-gray-500 mb-2">
                {filter === 'active' && 'No active challenges'}
                {filter === 'completed' && 'No completed challenges yet'}
                {filter === 'all' && 'No challenges yet'}
              </p>
              <p className="text-sm text-gray-400 mb-6">
                {filter === 'active' && 'Accept an invitation to start solving challenges'}
                {filter === 'completed' && 'Complete a challenge to see it here'}
                {filter === 'all' && 'You need to accept invitations first'}
              </p>
              <Link to="/invitations">
                <Button variant="primary">View Invitations</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredChallenges.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {assignment.desafio?.titulo || 'Challenge'}
                        </h3>
                        {getStatusBadge(assignment.estado)}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1 mb-4">
                        <p>
                          ⏱️ Estimated time: {assignment.desafio?.minutosEstimados || 0} minutes
                        </p>
                        <p>
                          📅 Accepted: {new Date(assignment.fechaAceptacion || assignment.fechaInvitacion).toLocaleDateString()}
                        </p>
                        {assignment.fechaLimite && (
                          <p>
                            ⏰ Deadline: {new Date(assignment.fechaLimite).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {assignment.desafio?.enunciado && (
                        <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                          {assignment.desafio.enunciado.substring(0, 200)}...
                        </p>
                      )}
                    </div>

                    <div className="ml-4">
                      {assignment.estado === 'ACEPTADO' ? (
                        <Link to={`/challenges/${assignment.desafioId}/solve?assignmentId=${assignment.id}`}>
                          <Button variant="primary">
                            Start Solving
                          </Button>
                        </Link>
                      ) : assignment.estado === 'COMPLETADO' ? (
                        <Link to={`/evaluations/${assignment.id}/feedback`}>
                          <Button variant="secondary">
                            View Feedback
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600 mb-1">Total Challenges</div>
              <div className="text-2xl font-bold text-gray-900">{challenges.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-2xl font-bold text-blue-600">
                {challenges.filter(c => c.estado === 'ACEPTADO').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600 mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-600">
                {challenges.filter(c => c.estado === 'COMPLETADO').length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

// Made with Bob