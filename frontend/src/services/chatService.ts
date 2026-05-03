import api from './api'
import type { SendMessageRequest } from '@/types'

/** Wire: POST /chat — backend returns conversationId + tokenUsage; UI keeps minimal fields. */
export interface ChatWireResponse {
  message: string
  conversationId?: string
  timestamp?: string
}

export const chatService = {
  async send(data: SendMessageRequest): Promise<ChatWireResponse> {
    const response = await api.post<ChatWireResponse>('/chat', data)
    return response.data
  },
}
