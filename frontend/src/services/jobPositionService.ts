import api from './api'
import type { JobPosition, CreateJobPositionRequest, PositionRankingWire } from '@/types'

export const jobPositionService = {
  async getAll(organizacionId?: string): Promise<JobPosition[]> {
    const params = organizacionId ? { organizacionId } : {}
    const response = await api.get<JobPosition[]>('/positions', { params })
    return response.data
  },

  async getById(id: string): Promise<JobPosition> {
    const response = await api.get<JobPosition>(`/positions/${id}`)
    return response.data
  },

  async create(data: CreateJobPositionRequest): Promise<JobPosition> {
    const response = await api.post<JobPosition>('/positions', data)
    return response.data
  },

  async update(id: string, data: Partial<CreateJobPositionRequest>): Promise<JobPosition> {
    const response = await api.put<JobPosition>(`/positions/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/positions/${id}`)
  },

  async activate(id: string): Promise<JobPosition> {
    const response = await api.post<JobPosition>(`/positions/${id}/activate`)
    return response.data
  },

  async deactivate(id: string): Promise<JobPosition> {
    const response = await api.post<JobPosition>(`/positions/${id}/deactivate`)
    return response.data
  },

  /** GET /positions/:id/ranking (backend + mock). */
  async getRankingWire(puestoId: string): Promise<PositionRankingWire> {
    const response = await api.get<PositionRankingWire>(`/positions/${puestoId}/ranking`)
    return response.data
  },
}

// Made with Bob