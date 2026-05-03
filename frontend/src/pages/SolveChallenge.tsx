import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { LoadingPage, Spinner } from '@/components/ui/Loading'
import { challengeService } from '@/services/challengeService'
import { assignmentService } from '@/services/assignmentService'
import { evaluationService } from '@/services/evaluationService'
import type { Challenge, ChallengeAssignment } from '@/types'
import { toast } from 'sonner'

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
]

export function SolveChallenge() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const assignmentId = searchParams.get('assignmentId')
  const invitationToken = searchParams.get('token') ?? undefined

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [assignment, setAssignment] = useState<ChallengeAssignment | null>(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    if (!id || !assignmentId) return
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const [challengeData, assignmentData] = await Promise.all([
          challengeService.getById(id),
          assignmentService.getById(assignmentId),
        ])
        if (cancelled) return
        setChallenge(challengeData)
        setAssignment(assignmentData)
      } catch (error) {
        if (!cancelled) {
          toast.error('Failed to load challenge')
          console.error(error)
          navigate('/my-challenges')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, assignmentId, navigate])

  useEffect(() => {
    if (assignment?.fechaLimite) {
      const interval = setInterval(() => {
        const now = new Date()
        const deadline = new Date(assignment.fechaLimite!)
        const diff = deadline.getTime() - now.getTime()

        if (diff <= 0) {
          setTimeRemaining('Expired')
          clearInterval(interval)
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          
          if (days > 0) {
            setTimeRemaining(`${days}d ${hours}h remaining`)
          } else if (hours > 0) {
            setTimeRemaining(`${hours}h ${minutes}m remaining`)
          } else {
            setTimeRemaining(`${minutes}m remaining`)
          }
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [assignment])

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting')
      return
    }

    if (!confirm('Are you sure you want to submit your solution? This action cannot be undone.')) {
      return
    }

    try {
      setSubmitting(true)
      const evaluation = await evaluationService.submit({
        asignacionId: assignmentId!,
        codigo: code,
        invitationToken,
        lenguaje: language,
        minutosEmpleados: challenge?.minutosEstimados ?? 0,
      })
      
      toast.success('Solution submitted successfully! Evaluating...')
      
      // Navigate to feedback page
      setTimeout(() => {
        navigate(`/evaluations/${evaluation.id}/feedback`)
      }, 1000)
    } catch (error) {
      toast.error('Failed to submit solution')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingPage />
  if (!challenge || !assignment) return null

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{challenge.titulo}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>⏱️ Est. time: {challenge.minutosEstimados} min</span>
              {timeRemaining && (
                <span className={timeRemaining === 'Expired' ? 'text-red-600 font-semibold' : 'text-primary-600'}>
                  ⏰ {timeRemaining}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting || !code.trim()}
          >
            {submitting ? <Spinner size="sm" /> : '✓ Submit Solution'}
          </Button>
        </div>

        {/* Challenge Description */}
        <Card>
          <CardHeader>
            <CardTitle>Challenge Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {challenge.enunciado}
            </div>
          </CardContent>
        </Card>

        {/* Code Editor */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Solution</CardTitle>
              <div className="w-48">
                <Select
                  label=""
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  options={LANGUAGE_OPTIONS}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-teal-200 ring-2 ring-teal-100">
              <Editor
                height="500px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                }}
              />
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <span>💡 Tip: Write clean, well-documented code for better evaluation</span>
              <span>{code.length} characters</span>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        {submitting && (
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="py-4 flex items-center gap-3">
              <Spinner />
              <div>
                <p className="font-semibold text-primary-900">Submitting your solution...</p>
                <p className="text-sm text-primary-700">AI is evaluating your code. This may take up to 10 seconds.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="text-sm">
                <p className="font-semibold text-yellow-900 mb-1">Important Notes</p>
                <ul className="text-yellow-800 space-y-1 list-disc list-inside">
                  <li>You can only submit once - make sure your solution is complete</li>
                  <li>AI will evaluate your code based on correctness, quality, and best practices</li>
                  <li>You'll receive detailed feedback after submission</li>
                  <li>The evaluation rubric is hidden to ensure fair assessment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/my-challenges')}
            disabled={submitting}
            fullWidth
          >
            Back to My Challenges
          </Button>
        </div>
      </div>
    </Layout>
  )
}

// Made with Bob