import api from './api'
import type { Organization, CreateOrganizationRequest } from '@/types'

export const organizationService = {
  async getAll(): Promise<Organization[]> {
    const response = await api.get<Organization[]>('/organizations')
    return response.data
  },

  async getById(id: string): Promise<Organization> {
    const response = await api.get<Organization>(`/organizations/${id}`)
    return response.data
  },

  async create(data: CreateOrganizationRequest): Promise<Organization> {
    const response = await api.post<Organization>('/organizations', data)
    return response.data
  },

  async update(id: string, data: Partial<CreateOrganizationRequest>): Promise<Organization> {
    const response = await api.put<Organization>(`/organizations/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/organizations/${id}`)
  },
}

// Made with Bob