// User types
export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: UserRole
  createdAt: string
  updatedAt: string
}

export const UserRole = {
  RECLUTADOR: 'RECLUTADOR',
  CANDIDATO: 'CANDIDATO',
  DOCENTE: 'DOCENTE',
  ESTUDIANTE: 'ESTUDIANTE',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  nombre: string
  apellido: string
  rol: UserRole
}

/** POST /auth/login y /auth/register — coincide con backend AuthResponse */
export interface AuthUsuarioDto {
  id: string
  email: string
  nombreCompleto: string
  emailVerificado: boolean
}

export interface AuthResponseDto {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  usuario: AuthUsuarioDto
}

/** GET /auth/me — coincide con backend UsuarioResponse */
export interface UsuarioMeDto {
  id: string
  email: string
  nombreCompleto: string
  fotoUrl?: string | null
  emailVerificado: boolean
  createdAt: string
}

/** Sesión normalizada en el cliente (usuario mapeado a User para la UI) */
export interface AuthSession {
  accessToken: string
  refreshToken: string
  user: User
}

// Organization types
export interface Organization {
  id: string
  nombre: string
  descripcion?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrganizationRequest {
  nombre: string
  descripcion?: string
}

// Job Position types
export interface JobPosition {
  id: string
  organizacionId: string
  titulo: string
  descripcion: string
  tecnologia: string
  seniority: Seniority
  estado: JobPositionStatus
  createdAt: string
  updatedAt: string
}

export const Seniority = {
  JUNIOR: 'JUNIOR',
  SEMI_SENIOR: 'SEMI_SENIOR',
  SENIOR: 'SENIOR',
} as const

export type Seniority = (typeof Seniority)[keyof typeof Seniority]

export const JobPositionStatus = {
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO',
} as const

export type JobPositionStatus = (typeof JobPositionStatus)[keyof typeof JobPositionStatus]

export interface CreateJobPositionRequest {
  organizacionId: string
  titulo: string
  descripcion: string
  tecnologia: string
  seniority: Seniority
}

// Challenge types
export interface Challenge {
  id: string
  puestoId: string
  titulo: string
  enunciado: string
  rubrica: Rubrica
  minutosEstimados: number
  estado: ChallengeStatus
  createdAt: string
  updatedAt: string
}

export interface Rubrica {
  criterios: Criterio[]
  puntajeMaximo: number
}

export interface Criterio {
  nombre: string
  descripcion: string
  peso: number
}

export const ChallengeStatus = {
  BORRADOR: 'BORRADOR',
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO',
} as const

export type ChallengeStatus = (typeof ChallengeStatus)[keyof typeof ChallengeStatus]

export interface GenerateChallengeRequest {
  puestoId: string
}

export interface ConfirmChallengeRequest {
  desafioId: string
}

// Challenge Assignment types
export interface ChallengeAssignment {
  id: string
  desafioId: string
  candidatoId: string
  estado: AssignmentStatus
  fechaInvitacion: string
  fechaAceptacion?: string
  fechaLimite?: string
  createdAt: string
  updatedAt: string
  desafio?: Challenge
}

export const AssignmentStatus = {
  PENDIENTE: 'PENDIENTE',
  ACEPTADO: 'ACEPTADO',
  RECHAZADO: 'RECHAZADO',
  COMPLETADO: 'COMPLETADO',
  EXPIRADO: 'EXPIRADO',
} as const

export type AssignmentStatus = (typeof AssignmentStatus)[keyof typeof AssignmentStatus]

export interface InviteCandidateRequest {
  desafioId: string
  candidatoEmail: string
  fechaLimite?: string
}

export interface AcceptInvitationRequest {
  asignacionId: string
}

// Evaluation types
export interface Evaluation {
  id: string
  asignacionId: string
  codigo: string
  puntaje: number
  feedback: string
  dimensiones: Dimension[]
  estado: EvaluationStatus
  createdAt: string
  updatedAt: string
  asignacion?: ChallengeAssignment
}

export interface Dimension {
  nombre: string
  puntaje: number
  comentario: string
}

export const EvaluationStatus = {
  PENDIENTE: 'PENDIENTE',
  EVALUANDO: 'EVALUANDO',
  COMPLETADO: 'COMPLETADO',
  ERROR: 'ERROR',
} as const

export type EvaluationStatus = (typeof EvaluationStatus)[keyof typeof EvaluationStatus]

export interface SubmitSolutionRequest {
  asignacionId: string
  codigo: string
  /** Backend POST /evaluations requires invitation token (from email link). */
  invitationToken?: string
  lenguaje?: string
  minutosEmpleados?: number
}

/** Wire: GET /positions/:id/ranking (Quarkus JSON). */
export interface PositionRankingWire {
  puestoId: string
  puestoTitulo: string
  totalCandidatos: number
  ranking: PositionRankingEntryWire[]
}

export interface PositionRankingEntryWire {
  posicion: number
  candidatoId: string
  candidatoEmail: string
  candidatoNombre: string
  puntajeTotal: number | string
  dimensiones: Array<{
    nombre: string
    puntaje: number | string
    peso: number | string
    justificacion?: string | null
  }>
  minutosEmpleados?: number | null
  evaluadoEn?: string | null
}

// Ranking types
export interface CandidateRanking {
  candidatoId: string
  candidatoNombre: string
  candidatoEmail: string
  puntajePromedio: number
  evaluacionesCompletadas: number
  ultimaEvaluacion?: string
}

// Chat types (Phase 1)
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface SendMessageRequest {
  message: string
}

export interface ChatResponse {
  message: string
  timestamp: string
}

/** GET /invitations/by-token/:token (wire; includes asignacionId from backend) */
export interface InvitationDetails {
  invitacionId: string
  asignacionId: string
  emailInvitado: string
  organizacion: string | null
  estado: string
  expiraEn: string
  isValid: boolean
  desafio: {
    id: string
    titulo: string
    enunciado: string
    tecnologia: string
    seniority: string
    minutosEstimados: number
  }
  puesto: { titulo: string; tecnologiaPrincipal: string; seniority: string } | null
}

// API Response types
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// Made with Bob
