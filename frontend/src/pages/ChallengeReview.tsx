import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { LoadingPage, Spinner } from '@/components/ui/Loading'
import { challengeService } from '@/services/challengeService'
import { assignmentService } from '@/services/assignmentService'
import type { Challenge } from '@/types'
import { toast } from 'sonner'

export function ChallengeReview() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [candidateEmail, setCandidateEmail] = useState('')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    if (id) {
      loadChallenge(id)
    }
  }, [id])

  const loadChallenge = async (challengeId: string) => {
    try {
      setLoading(true)
      const data = await challengeService.getById(challengeId)
      setChallenge(data)
    } catch (error) {
      toast.error('Failed to load challenge')
      console.error(error)
      navigate('/challenges')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!id || !confirm('Are you sure you want to regenerate this challenge?')) return

    try {
      setRegenerating(true)
      const newChallenge = await challengeService.regenerate(id)
      setChallenge(newChallenge)
      toast.success('Challenge regenerated successfully!')
    } catch (error) {
      toast.error('Failed to regenerate challenge')
      console.error(error)
    } finally {
      setRegenerating(false)
    }
  }

  const handleConfirm = async () => {
    if (!id) return

    try {
      setConfirming(true)
      await challengeService.confirm({ desafioId: id })
      toast.success('Challenge confirmed and activated!')
      navigate('/challenges')
    } catch (error) {
      toast.error('Failed to confirm challenge')
      console.error(error)
    } finally {
      setConfirming(false)
    }
  }

  const handleInviteCandidate = async () => {
    if (!id || !candidateEmail.trim()) {
      toast.error('Please enter a valid email')
      return
    }

    try {
      setInviting(true)
      await assignmentService.invite({
        desafioId: id,
        candidatoEmail: candidateEmail,
      })
      toast.success('Invitation sent successfully!')
      setShowInviteModal(false)
      setCandidateEmail('')
    } catch (error) {
      toast.error('Failed to send invitation')
      console.error(error)
    } finally {
      setInviting(false)
    }
  }

  if (loading) return <LoadingPage />
  if (!challenge) return null

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Challenge</h1>
            <p className="mt-2 text-gray-600">
              Review the AI-generated challenge and confirm or regenerate
            </p>
          </div>
          <div className="flex gap-2">
            {challenge.estado === 'BORRADOR' && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleRegenerate}
                  disabled={regenerating || confirming}
                >
                  {regenerating ? <Spinner size="sm" /> : '🔄 Regenerate'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirm}
                  disabled={regenerating || confirming}
                >
                  {confirming ? <Spinner size="sm" /> : '✓ Confirm & Activate'}
                </Button>
              </>
            )}
            {challenge.estado === 'ACTIVO' && (
              <Button
                variant="primary"
                onClick={() => setShowInviteModal(true)}
              >
                📧 Invite Candidate
              </Button>
            )}
          </div>
        </div>

        {regenerating && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4 flex items-center gap-3">
              <Spinner />
              <div>
                <p className="font-semibold text-blue-900">Regenerating challenge...</p>
                <p className="text-sm text-blue-700">This may take 15-30 seconds</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Challenge Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{challenge.titulo}</CardTitle>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  challenge.estado === 'ACTIVO'
                    ? 'bg-green-100 text-green-800'
                    : challenge.estado === 'BORRADOR'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {challenge.estado}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Challenge Description</h3>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {challenge.enunciado}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>⏱️ Estimated time: {challenge.minutosEstimados} minutes</span>
                <span>📅 Created: {new Date(challenge.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Rubric */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Rubric (Hidden from candidates)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                🔒 This rubric will be used by AI to evaluate candidate solutions.
                Candidates will not see these criteria.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">Evaluation Criteria</h3>
                <span className="text-sm text-gray-600">
                  Max Score: {challenge.rubrica.puntajeMaximo}
                </span>
              </div>
              <div className="space-y-3">
                {challenge.rubrica.criterios.map((criterio, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{criterio.nombre}</h4>
                      <span className="text-sm font-semibold text-blue-600">
                        Weight: {criterio.peso}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{criterio.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/challenges')}
            fullWidth
          >
            Back to Challenges
          </Button>
        </div>
      </div>

      {/* Invite Candidate Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Candidate"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Send an invitation to a candidate to solve this challenge
          </p>
          <Input
            label="Candidate Email"
            type="email"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
            placeholder="candidate@example.com"
            required
          />
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleInviteCandidate}
              disabled={inviting || !candidateEmail.trim()}
              fullWidth
            >
              {inviting ? <Spinner size="sm" /> : 'Send Invitation'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowInviteModal(false)}
              disabled={inviting}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}

// Made with Bob