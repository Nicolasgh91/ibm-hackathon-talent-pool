import api from './api'
import type { InvitationDetails } from '@/types'

export const invitationService = {
  async getByToken(token: string): Promise<InvitationDetails> {
    const response = await api.get<InvitationDetails>(
      `/invitations/by-token/${encodeURIComponent(token)}`,
    )
    return response.data
  },
}
