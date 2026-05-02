import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingPage, Spinner } from '@/components/ui/Loading'
import { evaluationService } from '@/services/evaluationService'
import type { Evaluation } from '@/types'
import { toast } from 'sonner'

export function EvaluationFeedback() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadEvaluation(id)
    }
  }, [id])

  const loadEvaluation = async (evalId: string) => {
    try {
      setLoading(true)
      const data = await evaluationService.getById(evalId)
      setEvaluation(data)

      // If still evaluating, poll for updates
      if (data.estado === 'EVALUANDO' || data.estado === 'PENDIENTE') {
        setTimeout(() => loadEvaluation(evalId), 3000) // Poll every 3 seconds
      }
    } catch (error) {
      toast.error('Failed to load evaluation')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-blue-100'
    if (score >= 40) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  if (loading && !evaluation) return <LoadingPage />
  if (!evaluation) return null

  const isEvaluating = evaluation.estado === 'EVALUANDO' || evaluation.estado === 'PENDIENTE'

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evaluation Feedback</h1>
            <p className="mt-2 text-gray-600">
              {isEvaluating ? 'AI is evaluating your solution...' : 'Review your performance and feedback'}
            </p>
          </div>
          {!isEvaluating && (
            <Button variant="secondary" onClick={() => navigate('/my-challenges')}>
              Back to Challenges
            </Button>
          )}
        </div>

        {/* Evaluating State */}
        {isEvaluating && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <Spinner size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Evaluation in Progress
                  </h3>
                  <p className="text-sm text-blue-700">
                    AI is analyzing your code. This usually takes less than 10 seconds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Score Card */}
        {!isEvaluating && (
          <Card className={getScoreBgColor(evaluation.puntaje)}>
            <CardContent className="py-8">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(evaluation.puntaje)} mb-2`}>
                  {evaluation.puntaje}
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">
                  {getScoreLabel(evaluation.puntaje)}
                </div>
                <div className="text-sm text-gray-600">
                  Out of 100 points
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Feedback */}
        {!isEvaluating && evaluation.feedback && (
          <Card>
            <CardHeader>
              <CardTitle>Overall Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {evaluation.feedback}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dimension Breakdown */}
        {!isEvaluating && evaluation.dimensiones && evaluation.dimensiones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evaluation.dimensiones.map((dimension, index) => (
                <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{dimension.nombre}</h3>
                    <span className={`text-lg font-bold ${getScoreColor(dimension.puntaje)}`}>
                      {dimension.puntaje}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        dimension.puntaje >= 80
                          ? 'bg-green-600'
                          : dimension.puntaje >= 60
                          ? 'bg-blue-600'
                          : dimension.puntaje >= 40
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${dimension.puntaje}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-700">{dimension.comentario}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Submitted Code */}
        {!isEvaluating && evaluation.codigo && (
          <Card>
            <CardHeader>
              <CardTitle>Your Submitted Code</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{evaluation.codigo}</code>
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        {!isEvaluating && (
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-600 mb-1">Status</dt>
                  <dd className="font-medium text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        evaluation.estado === 'COMPLETADO'
                          ? 'bg-green-100 text-green-800'
                          : evaluation.estado === 'ERROR'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {evaluation.estado}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 mb-1">Submitted</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(evaluation.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 mb-1">Evaluated</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(evaluation.updatedAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 mb-1">Code Length</dt>
                  <dd className="font-medium text-gray-900">
                    {evaluation.codigo.length} characters
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        {!isEvaluating && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">What's Next?</p>
                  <ul className="text-blue-800 space-y-1 list-disc list-inside">
                    <li>Review the feedback to understand your strengths and areas for improvement</li>
                    <li>Use this experience to improve your coding skills</li>
                    <li>Check for new challenge invitations</li>
                    <li>Keep practicing to achieve higher scores</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}

// Made with Bob