import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Loading'
import { jobPositionService } from '@/services/jobPositionService'
import { challengeService } from '@/services/challengeService'
import type { JobPosition, Challenge } from '@/types'
import { toast } from 'sonner'

export function GenerateChallenge() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedPositionId = searchParams.get('positionId')

  const [positions, setPositions] = useState<JobPosition[]>([])
  const [selectedPositionId, setSelectedPositionId] = useState(preselectedPositionId || '')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadingPositions, setLoadingPositions] = useState(true)

  useEffect(() => {
    loadPositions()
  }, [])

  useEffect(() => {
    if (generating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev
          return prev + 5
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [generating])

  const loadPositions = async () => {
    try {
      setLoadingPositions(true)
      const data = await jobPositionService.getAll()
      const activePositions = data.filter(p => p.estado === 'ACTIVO')
      setPositions(activePositions)
      
      if (activePositions.length === 0) {
        toast.error('No active positions available')
      }
    } catch (error) {
      toast.error('Failed to load positions')
      console.error(error)
    } finally {
      setLoadingPositions(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedPositionId) {
      toast.error('Please select a position')
      return
    }

    try {
      setGenerating(true)
      setProgress(10)
      
      const challenge = await challengeService.generate({ puestoId: selectedPositionId })
      
      setProgress(100)
      toast.success('Challenge generated successfully!')
      
      setTimeout(() => {
        navigate(`/challenges/${challenge.id}/review`)
      }, 500)
    } catch (error) {
      toast.error('Failed to generate challenge')
      console.error(error)
      setGenerating(false)
      setProgress(0)
    }
  }

  const selectedPosition = positions.find(p => p.id === selectedPositionId)

  if (loadingPositions) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (positions.length === 0) {
    return (
      <Layout>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No active positions available</p>
            <p className="text-sm text-gray-400 mb-6">
              Create and activate a position first to generate challenges
            </p>
            <Button variant="primary" onClick={() => navigate('/positions/new')}>
              Create Position
            </Button>
          </CardContent>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate AI Challenge</h1>
          <p className="mt-2 text-gray-600">
            Create a technical challenge powered by AI based on a job position
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Position</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Job Position"
              value={selectedPositionId}
              onChange={(e) => setSelectedPositionId(e.target.value)}
              options={[
                { value: '', label: 'Select a position' },
                ...positions.map(pos => ({
                  value: pos.id,
                  label: `${pos.titulo} - ${pos.tecnologia} (${pos.seniority.replace('_', ' ')})`
                }))
              ]}
              disabled={generating}
              required
            />

            {selectedPosition && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Position Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-blue-700">Title:</dt>
                    <dd className="font-medium text-blue-900">{selectedPosition.titulo}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-blue-700">Technology:</dt>
                    <dd className="font-medium text-blue-900">{selectedPosition.tecnologia}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-blue-700">Seniority:</dt>
                    <dd className="font-medium text-blue-900">
                      {selectedPosition.seniority.replace('_', ' ')}
                    </dd>
                  </div>
                  <div className="pt-2 border-t border-blue-200">
                    <dt className="text-blue-700 mb-1">Description:</dt>
                    <dd className="text-blue-900">{selectedPosition.descripcion}</dd>
                  </div>
                </dl>
              </div>
            )}
          </CardContent>
        </Card>

        {generating && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <Spinner size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Generating Challenge...
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    AI is creating a personalized technical challenge
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{progress}% complete</p>
                </div>
                <p className="text-xs text-gray-400">
                  This usually takes 15-30 seconds
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!generating && (
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={!selectedPositionId || generating}
              fullWidth
            >
              🎯 Generate Challenge with AI
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/challenges')}
              disabled={generating}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        )}

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-sm">
                <p className="font-semibold text-yellow-900 mb-1">How it works</p>
                <ul className="text-yellow-800 space-y-1 list-disc list-inside">
                  <li>AI analyzes the position requirements</li>
                  <li>Generates a relevant technical challenge</li>
                  <li>Creates evaluation rubric automatically</li>
                  <li>You can review and regenerate if needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

// Made with Bob