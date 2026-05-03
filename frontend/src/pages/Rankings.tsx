import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { LoadingPage } from '@/components/ui/Loading'
import { evaluationService } from '@/services/evaluationService'
import { jobPositionService } from '@/services/jobPositionService'
import type { CandidateRanking, JobPosition } from '@/types'
import { JobPositionStatus } from '@/types'
import { toast } from 'sonner'

export function Rankings() {
  const [rankings, setRankings] = useState<CandidateRanking[]>([])
  const [positions, setPositions] = useState<JobPosition[]>([])
  const [selectedPositionId, setSelectedPositionId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'score' | 'evaluations' | 'recent'>('score')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    loadPositions()
  }, [])

  useEffect(() => {
    loadRankings()
  }, [selectedPositionId])

  const loadPositions = async () => {
    try {
      const data = await jobPositionService.getAll()
      const est = (s: string) => s?.toUpperCase?.() ?? s
      const active = data.filter((p) => {
        const e = est(p.estado as string)
        return (
          e === JobPositionStatus.ACTIVO ||
          e === 'ABIERTO' ||
          e === 'BORRADOR' ||
          e === 'ACTIVO'
        )
      })
      setPositions(active.length > 0 ? active : data)
    } catch (error) {
      toast.error('Failed to load positions')
      console.error(error)
    }
  }

  const loadRankings = async () => {
    if (!selectedPositionId) {
      setRankings([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await evaluationService.getRankings(selectedPositionId)
      setRankings(data)
    } catch (error) {
      toast.error('Failed to load rankings')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: 'score' | 'evaluations' | 'recent') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const sortedRankings = [...rankings].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'score':
        comparison = a.puntajePromedio - b.puntajePromedio
        break
      case 'evaluations':
        comparison = a.evaluacionesCompletadas - b.evaluacionesCompletadas
        break
      case 'recent': {
        const dateA = a.ultimaEvaluacion ? new Date(a.ultimaEvaluacion).getTime() : 0
        const dateB = b.ultimaEvaluacion ? new Date(b.ultimaEvaluacion).getTime() : 0
        comparison = dateA - dateB
        break
      }
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-primary-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-primary-100 text-primary-800'
    if (score >= 40) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getRankMedal = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  if (loading) return <LoadingPage />

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Candidate Rankings</h1>
            <p className="mt-2 text-gray-600">
              View and compare candidate performance by job position (API: GET /positions/:id/ranking)
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Select
                  label="Filter by position"
                  value={selectedPositionId}
                  onChange={(e) => setSelectedPositionId(e.target.value)}
                  options={[
                    { value: '', label: 'Select a position…' },
                    ...positions.map((p) => ({
                      value: p.id,
                      label: p.titulo,
                    })),
                  ]}
                />
              </div>
              {selectedPositionId && (
                <Button variant="ghost" onClick={() => setSelectedPositionId('')}>
                  Clear filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {!selectedPositionId ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 mb-2">Choose a position</p>
              <p className="text-sm text-gray-400 mb-6">
                Rankings are loaded per position from the backend contract.
              </p>
              <Link to="/positions">
                <Button variant="primary">View positions</Button>
              </Link>
            </CardContent>
          </Card>
        ) : rankings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 mb-2">No evaluations yet</p>
              <p className="text-sm text-gray-400 mb-6">
                No completed evaluations for this position yet.
              </p>
              <Link to="/challenges">
                <Button variant="primary">View challenges</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Candidate performance ({sortedRankings.length} candidates)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => handleSort('score')}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Avg score
                        {sortBy === 'score' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => handleSort('evaluations')}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Completed
                        {sortBy === 'evaluations' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => handleSort('recent')}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Last evaluation
                        {sortBy === 'recent' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRankings.map((candidate, index) => (
                    <TableRow key={candidate.candidatoId}>
                      <TableCell className="font-bold text-lg">{getRankMedal(index)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{candidate.candidatoNombre}</div>
                          <div className="text-sm text-gray-500">{candidate.candidatoEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-2xl font-bold ${getScoreColor(candidate.puntajePromedio)}`}
                          >
                            {candidate.puntajePromedio.toFixed(1)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getScoreBadge(
                              candidate.puntajePromedio,
                            )}`}
                          >
                            {candidate.puntajePromedio >= 80
                              ? 'Excellent'
                              : candidate.puntajePromedio >= 60
                                ? 'Good'
                                : candidate.puntajePromedio >= 40
                                  ? 'Fair'
                                  : 'Poor'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {candidate.evaluacionesCompletadas} challenge
                        {candidate.evaluacionesCompletadas !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {candidate.ultimaEvaluacion
                          ? new Date(candidate.ultimaEvaluacion).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View details
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
        {selectedPositionId && rankings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="py-4">
                <div className="text-sm text-gray-600 mb-1">Total candidates</div>
                <div className="text-2xl font-bold text-gray-900">{rankings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-sm text-gray-600 mb-1">Average score</div>
                <div className="text-2xl font-bold text-primary-600">
                  {(rankings.reduce((sum, r) => sum + r.puntajePromedio, 0) / rankings.length).toFixed(1)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-sm text-gray-600 mb-1">Top score</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(...rankings.map((r) => r.puntajePromedio)).toFixed(1)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-sm text-gray-600 mb-1">Total evaluations</div>
                <div className="text-2xl font-bold text-purple-600">
                  {rankings.reduce((sum, r) => sum + r.evaluacionesCompletadas, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}
