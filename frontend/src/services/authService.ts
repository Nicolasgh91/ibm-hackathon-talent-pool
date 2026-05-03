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

/** Persist chosen persona per email — JWT has no role claim yet (backend). */
function roleStorageKey(email: string): string {
  return `tp_role_${encodeURIComponent(email)}`
}

function persistRoleForEmail(email: string, rol: (typeof UserRole)[keyof typeof UserRole]): void {
  try {
    localStorage.setItem(roleStorageKey(email), rol)
  } catch {
    /* ignore quota */
  }
}

function readPersistedRole(email: string): (typeof UserRole)[keyof typeof UserRole] | null {
  try {
    const r = localStorage.getItem(roleStorageKey(email)) as (typeof UserRole)[keyof typeof UserRole] | null
    if (r && Object.values(UserRole).includes(r)) return r
  } catch {
    /* ignore */
  }
  return null
}

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
    const response = await api.post<AuthResponseDto>('/auth/login', credentials)
    const data = response.data
    const email = data.usuario.email
    const persisted = readPersistedRole(email)
    const rolFallback =
      persisted ?? stored?.rol ?? UserRole.CANDIDATO
    const user = mapAuthUsuarioToUser(data.usuario, rolFallback)
    persistRoleForEmail(email, user.rol)
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user,
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
    persistRoleForEmail(data.email, data.rol)
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
    persistRoleForEmail(user.email, user.rol)
  },

  /**
   * Persist the chosen persona for a given email before login. Used by the
   * dev credentials helper so that on a fresh browser the post-login redirect
   * lands on the right home (e.g. ESTUDIANTE -> /student/dashboard).
   */
  saveRoleForEmail(email: string, rol: (typeof UserRole)[keyof typeof UserRole]): void {
    persistRoleForEmail(email, rol)
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
