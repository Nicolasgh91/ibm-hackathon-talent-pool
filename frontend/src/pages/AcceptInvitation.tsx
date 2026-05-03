import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingPage } from '@/components/ui/Loading'
import { invitationService } from '@/services/invitationService'
import { assignmentService } from '@/services/assignmentService'
import type { InvitationDetails } from '@/types'
import { UserRole } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function AcceptInvitation() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [details, setDetails] = useState<InvitationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const data = await invitationService.getByToken(token)
        setDetails(data)
      } catch (e) {
        toast.error('Could not load invitation')
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  const handleAccept = async () => {
    if (!details) return
    try {
      setAccepting(true)
      await assignmentService.accept({ asignacionId: details.asignacionId })
      toast.success('Invitation accepted')
      navigate(
        `/challenges/${details.desafio.id}/solve?assignmentId=${encodeURIComponent(details.asignacionId)}&token=${encodeURIComponent(token ?? '')}`,
      )
    } catch (e) {
      toast.error('Could not accept invitation')
      console.error(e)
    } finally {
      setAccepting(false)
    }
  }

  if (!token) {
    return (
      <Layout>
        <Card>
          <CardContent className="py-8 text-center text-gray-600">
            Missing <code className="rounded bg-gray-100 px-1">token</code> query parameter.
          </CardContent>
        </Card>
      </Layout>
    )
  }

  if (loading) return <LoadingPage />

  if (!details) {
    return (
      <Layout>
        <Card>
          <CardContent className="py-8 text-center">Invitation not found.</CardContent>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Challenge invitation</h1>
          <p className="mt-2 text-gray-600">
            {details.organizacion ? `${details.organizacion} · ` : ''}
            {details.desafio.titulo}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Technology:</span> {details.desafio.tecnologia}
            </p>
            <p>
              <span className="font-medium">Estimated time:</span>{' '}
              {details.desafio.minutosEstimados} min
            </p>
            <p className="text-xs text-gray-500">
              Valid: {details.isValid ? 'yes' : 'no'} · State: {details.estado}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800">
              {details.desafio.enunciado}
            </div>
          </CardContent>
        </Card>

        {!isAuthenticated ? (
          <Card className="border-primary-200 bg-primary-50">
            <CardContent className="py-6">
              <p className="mb-4 text-sm text-primary-900">
                Sign in as the invited candidate ({details.emailInvitado}) to accept.
              </p>
              <Link
                to={`/login?redirect=${encodeURIComponent(`/accept-invitation?token=${encodeURIComponent(token)}`)}`}
              >
                <Button variant="primary">Go to login</Button>
              </Link>
            </CardContent>
          </Card>
        ) : user?.rol !== UserRole.CANDIDATO ? (
          <p className="text-sm text-amber-800">
            This flow is for candidates. Switch to a candidate account to accept.
          </p>
        ) : (
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleAccept} disabled={accepting || !details.isValid}>
              {accepting ? 'Accepting…' : 'Accept & start challenge'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
