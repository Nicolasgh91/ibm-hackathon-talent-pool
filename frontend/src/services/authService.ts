import api from './api'
import {
  UserRole,
  type LoginRequest,
  type RegisterRequest,
  type AuthResponseDto,
  type UsuarioMeDto,
  type AuthSession,
  type User,
} from '@/types'

const REFRESH_STORAGE_KEY = 'auth_refresh_token'

function splitNombreCompleto(nombreCompleto: string): { nombre: string; apellido: string } {
  const trimmed = (nombreCompleto || '').trim()
  const parts = trimmed.split(/\s+/)
  return {
    nombre: parts[0] ?? '',
    apellido: parts.slice(1).join(' ') ?? '',
  }
}

function mapAuthUsuarioToUser(
  u: AuthResponseDto['usuario'],
  rol: (typeof UserRole)[keyof typeof UserRole],
): User {
  const { nombre, apellido } = splitNombreCompleto(u.nombreCompleto ?? '')
  const now = new Date().toISOString()
  return {
    id: String(u.id),
    email: u.email,
    nombre,
    apellido,
    rol,
    createdAt: now,
    updatedAt: now,
  }
}

function mapUsuarioMeToUser(
  u: UsuarioMeDto,
  rol: (typeof UserRole)[keyof typeof UserRole],
): User {
  const { nombre, apellido } = splitNombreCompleto(u.nombreCompleto ?? '')
  const created = u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString()
  return {
    id: String(u.id),
    email: u.email,
    nombre,
    apellido,
    rol,
    createdAt: created,
    updatedAt: created,
  }
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthSession> {
    const stored = this.getUser()
    const rolFallback = stored?.rol ?? UserRole.CANDIDATO
    const response = await api.post<AuthResponseDto>('/auth/login', credentials)
    const data = response.data
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: mapAuthUsuarioToUser(data.usuario, rolFallback),
    }
  },

  async register(data: RegisterRequest): Promise<AuthSession> {
    const body = {
      email: data.email,
      password: data.password,
      nombreCompleto: [data.nombre, data.apellido].filter(Boolean).join(' ').trim(),
    }
    const response = await api.post<AuthResponseDto>('/auth/register', body)
    const d = response.data
    return {
      accessToken: d.accessToken,
      refreshToken: d.refreshToken,
      user: mapAuthUsuarioToUser(d.usuario, data.rol),
    }
  },

  async getCurrentUser(): Promise<User> {
    const stored = this.getUser()
    const rolFallback = stored?.rol ?? UserRole.CANDIDATO
    const response = await api.get<UsuarioMeDto>('/auth/me')
    return mapUsuarioMeToUser(response.data, rolFallback)
  },

  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem(REFRESH_STORAGE_KEY)
    localStorage.removeItem('user')
  },

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token)
  },

  saveRefreshToken(token: string | undefined): void {
    if (token) {
      localStorage.setItem(REFRESH_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(REFRESH_STORAGE_KEY)
    }
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
