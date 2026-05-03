import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { LoadingPage } from '@/components/ui/Loading'
import { assignmentService } from '@/services/assignmentService'
import type { ChallengeAssignment } from '@/types'
import { toast } from 'sonner'

export function Invitations() {
  const navigate = useNavigate()
  const [invitations, setInvitations] = useState<ChallengeAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadInvitations()
  }, [])

  const loadInvitations = async () => {
    try {
      setLoading(true)
      const data = await assignmentService.getMyInvitations()
      setInvitations(data)
    } catch (error) {
      toast.error('Failed to load invitations')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id: string) => {
    try {
      setProcessingId(id)
      await assignmentService.accept({ asignacionId: id })
      toast.success('Invitation accepted! You can now solve the challenge')
      loadInvitations()
      navigate('/my-challenges')
    } catch (error) {
      toast.error('Failed to accept invitation')
      console.error(error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this invitation?')) return

    try {
      setProcessingId(id)
      await assignmentService.reject(id)
      toast.success('Invitation rejected')
      loadInvitations()
    } catch (error) {
      toast.error('Failed to reject invitation')
      console.error(error)
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      ACEPTADO: 'bg-green-100 text-green-800',
      RECHAZADO: 'bg-red-100 text-red-800',
      COMPLETADO: 'bg-primary-100 text-primary-800',
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

  const isExpired = (fechaLimite?: string) => {
    if (!fechaLimite) return false
    return new Date(fechaLimite) < new Date()
  }

  if (loading) return <LoadingPage />

  const pendingInvitations = invitations.filter(inv => inv.estado === 'PENDIENTE')

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Challenge Invitations</h1>
          <p className="mt-2 text-gray-600">
            Review and accept invitations to solve technical challenges
          </p>
        </div>

        {invitations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">📧</div>
              <p className="text-gray-500 mb-2">No invitations yet</p>
              <p className="text-sm text-gray-400">
                You'll receive invitations from recruiters here
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Pending Invitations */}
            {pendingInvitations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Invitations ({pendingInvitations.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Challenge</TableHead>
                        <TableHead>Invited</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingInvitations.map((invitation) => {
                        const expired = isExpired(invitation.fechaLimite)
                        return (
                          <TableRow key={invitation.id}>
                            <TableCell className="font-medium">
                              {invitation.desafio?.titulo || 'Challenge'}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {new Date(invitation.fechaInvitacion).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {invitation.fechaLimite ? (
                                <span className={expired ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                  {new Date(invitation.fechaLimite).toLocaleDateString()}
                                  {expired && ' (Expired)'}
                                </span>
                              ) : (
                                <span className="text-gray-400">No deadline</span>
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(invitation.estado)}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleAccept(invitation.id)}
                                disabled={processingId === invitation.id || expired}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleReject(invitation.id)}
                                disabled={processingId === invitation.id}
                              >
                                Reject
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* All Invitations History */}
            <Card>
              <CardHeader>
                <CardTitle>All Invitations ({invitations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Accepted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">
                          {invitation.desafio?.titulo || 'Challenge'}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(invitation.fechaInvitacion).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(invitation.estado)}</TableCell>
                        <TableCell className="text-gray-600">
                          {invitation.fechaAceptacion
                            ? new Date(invitation.fechaAceptacion).toLocaleDateString()
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600 mb-1">Total</div>
              <div className="text-2xl font-bold text-gray-900">{invitations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {invitations.filter(i => i.estado === 'PENDIENTE').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600 mb-1">Accepted</div>
              <div className="text-2xl font-bold text-green-600">
                {invitations.filter(i => i.estado === 'ACEPTADO').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600 mb-1">Completed</div>
              <div className="text-2xl font-bold text-primary-600">
                {invitations.filter(i => i.estado === 'COMPLETADO').length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

// Made with Bob