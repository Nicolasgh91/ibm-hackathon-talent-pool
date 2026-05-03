import api from './api'
import type {
  Challenge,
  GenerateChallengeRequest,
  ConfirmChallengeRequest,
} from '@/types'

export const challengeService = {
  async getAll(puestoId?: string): Promise<Challenge[]> {
    const params = puestoId ? { puestoId } : {}
    const response = await api.get<Challenge[]>('/challenges', { params })
    return response.data
  },

  async getById(id: string): Promise<Challenge> {
    const response = await api.get<Challenge>(`/challenges/${id}`)
    return response.data
  },

  async generate(data: GenerateChallengeRequest): Promise<Challenge> {
    const response = await api.post<Challenge>('/challenges', data)
    return response.data
  },

  async regenerate(desafioId: string): Promise<Challenge> {
    const response = await api.post<Challenge>(`/challenges/${desafioId}/regenerate`)
    return response.data
  },

  async confirm(data: ConfirmChallengeRequest): Promise<Challenge> {
    const response = await api.post<Challenge>('/challenges/confirm', data)
    return response.data
  },

  async activate(id: string): Promise<Challenge> {
    const response = await api.post<Challenge>(`/challenges/${id}/activate`)
    return response.data
  },

  async deactivate(id: string): Promise<Challenge> {
    const response = await api.post<Challenge>(`/challenges/${id}/deactivate`)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/challenges/${id}`)
  },
}

// Made with Bob