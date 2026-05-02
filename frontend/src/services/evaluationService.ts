import api from './api'
import type {
  Evaluation,
  SubmitSolutionRequest,
  CandidateRanking,
} from '@/types'

export const evaluationService = {
  async getAll(asignacionId?: string): Promise<Evaluation[]> {
    const params = asignacionId ? { asignacionId } : {}
    const response = await api.get<Evaluation[]>('/evaluations', { params })
    return response.data
  },

  async getById(id: string): Promise<Evaluation> {
    const response = await api.get<Evaluation>(`/evaluations/${id}`)
    return response.data
  },

  async submit(data: SubmitSolutionRequest): Promise<Evaluation> {
    const response = await api.post<Evaluation>('/evaluations/submit', data)
    return response.data
  },

  async getByAssignment(asignacionId: string): Promise<Evaluation> {
    const response = await api.get<Evaluation>(`/evaluations/assignment/${asignacionId}`)
    return response.data
  },

  async getRankings(desafioId?: string): Promise<CandidateRanking[]> {
    const params = desafioId ? { desafioId } : {}
    const response = await api.get<CandidateRanking[]>('/evaluations/rankings', { params })
    return response.data
  },

  async getMyEvaluations(): Promise<Evaluation[]> {
    const response = await api.get<Evaluation[]>('/evaluations/my-evaluations')
    return response.data
  },
}

// Made with Bob