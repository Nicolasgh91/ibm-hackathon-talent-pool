import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { LoadingPage } from '@/components/ui/Loading'
import { challengeService } from '@/services/challengeService'
import type { Challenge } from '@/types'
import { toast } from 'sonner'

export function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    try {
      setLoading(true)
      const data = await challengeService.getAll()
      setChallenges(data)
    } catch (error) {
      toast.error('Failed to load challenges')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return

    try {
      await challengeService.delete(id)
      toast.success('Challenge deleted successfully')
      loadChallenges()
    } catch (error) {
      toast.error('Failed to delete challenge')
      console.error(error)
    }
  }

  const handleToggleStatus = async (challenge: Challenge) => {
    try {
      if (challenge.estado === 'ACTIVO') {
        await challengeService.deactivate(challenge.id)
        toast.success('Challenge deactivated')
      } else {
        await challengeService.activate(challenge.id)
        toast.success('Challenge activated')
      }
      loadChallenges()
    } catch (error) {
      toast.error('Failed to update challenge status')
      console.error(error)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      ACTIVO: 'bg-green-100 text-green-800',
      BORRADOR: 'bg-yellow-100 text-yellow-800',
      INACTIVO: 'bg-gray-100 text-gray-800',
    }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[status as keyof typeof colors] || colors.INACTIVO
        }`}
      >
        {status}
      </span>
    )
  }

  if (loading) return <LoadingPage />

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
            <p className="mt-2 text-gray-600">Manage AI-generated technical challenges</p>
          </div>
          <Link to="/challenges/generate">
            <Button variant="primary">
              🎯 Generate New Challenge
            </Button>
          </Link>
        </div>

        {challenges.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-500 mb-2">No challenges yet</p>
              <p className="text-sm text-gray-400 mb-6">
                Generate your first AI-powered technical challenge
              </p>
              <Link to="/challenges/generate">
                <Button variant="primary">Generate Challenge</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Challenges ({challenges.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Est. Time</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {challenges.map((challenge) => (
                    <TableRow key={challenge.id}>
                      <TableCell className="font-medium max-w-md">
                        <div className="truncate">{challenge.titulo}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(challenge.estado)}</TableCell>
                      <TableCell className="text-gray-600">
                        {challenge.minutosEstimados} min
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(challenge.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link to={`/challenges/${challenge.id}/review`}>
                          <Button variant="primary" size="sm">
                            {challenge.estado === 'BORRADOR' ? 'Review' : 'View'}
                          </Button>
                        </Link>
                        {challenge.estado !== 'BORRADOR' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(challenge)}
                          >
                            {challenge.estado === 'ACTIVO' ? 'Deactivate' : 'Activate'}
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(challenge.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
              <div className="text-2xl font-bold text-green-600">
                {challenges.filter(c => c.estado === 'ACTIVO').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600 mb-1">Draft</div>
              <div className="text-2xl font-bold text-yellow-600">
                {challenges.filter(c => c.estado === 'BORRADOR').length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

// Made with Bob