import api from './api'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '@/types'

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/users/me')
    return response.data
  },

  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token)
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}

// Made with Bob
