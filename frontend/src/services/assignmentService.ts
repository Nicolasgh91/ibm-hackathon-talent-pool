import api from './api'
import type {
  ChallengeAssignment,
  InviteCandidateRequest,
  AcceptInvitationRequest,
} from '@/types'

export const assignmentService = {
  async getAll(candidatoId?: string): Promise<ChallengeAssignment[]> {
    const params = candidatoId ? { candidatoId } : {}
    const response = await api.get<ChallengeAssignment[]>('/assignments', { params })
    return response.data
  },

  async getById(id: string): Promise<ChallengeAssignment> {
    const response = await api.get<ChallengeAssignment>(`/assignments/${id}`)
    return response.data
  },

  async invite(data: InviteCandidateRequest): Promise<ChallengeAssignment> {
    const response = await api.post<ChallengeAssignment>('/assignments/invite', data)
    return response.data
  },

  async accept(data: AcceptInvitationRequest): Promise<ChallengeAssignment> {
    const response = await api.post<ChallengeAssignment>('/assignments/accept', data)
    return response.data
  },

  async reject(asignacionId: string): Promise<ChallengeAssignment> {
    const response = await api.post<ChallengeAssignment>(`/assignments/${asignacionId}/reject`)
    return response.data
  },

  async getMyChallenges(): Promise<ChallengeAssignment[]> {
    const response = await api.get<ChallengeAssignment[]>('/assignments/my-challenges')
    return response.data
  },

  async getMyInvitations(): Promise<ChallengeAssignment[]> {
    const response = await api.get<ChallengeAssignment[]>('/assignments/my-invitations')
    return response.data
  },
}

// Made with Bob