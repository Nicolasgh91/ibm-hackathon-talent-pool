/**
 * In-memory demo dataset. Mutated by mockHandlers; reset on full page reload.
 * Designed to mirror the backend Flyway seed (V013/V014) so the UX feels
 * consistent if the user toggles between real backend and demo mode.
 */
import {
  AssignmentStatus,
  ChallengeStatus,
  EvaluationStatus,
  JobPositionStatus,
  Seniority,
  UserRole,
} from '@/types'
import type {
  CandidateRanking,
  Challenge,
  ChallengeAssignment,
  Evaluation,
  JobPosition,
  Organization,
} from '@/types'

export interface DemoUser {
  id: string
  email: string
  nombreCompleto: string
  rol: UserRole
  password: string
  emailVerificado: boolean
  createdAt: string
}

const NOW = () => new Date().toISOString()

const SEED_USERS: DemoUser[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'recruiter@acme.com',
    nombreCompleto: 'María Pérez',
    rol: UserRole.RECLUTADOR,
    password: 'Demo123!',
    emailVerificado: true,
    createdAt: NOW(),
  },
  {
    id: 'aaaa1111-1111-1111-1111-111111111111',
    email: 'ana@example.com',
    nombreCompleto: 'Ana García',
    rol: UserRole.CANDIDATO,
    password: 'Demo123!',
    emailVerificado: true,
    createdAt: NOW(),
  },
  {
    id: 'aaaa2222-2222-2222-2222-222222222222',
    email: 'pedro@example.com',
    nombreCompleto: 'Pedro López',
    rol: UserRole.CANDIDATO,
    password: 'Demo123!',
    emailVerificado: true,
    createdAt: NOW(),
  },
  {
    id: 'aaaa3333-3333-3333-3333-333333333333',
    email: 'lucia@example.com',
    nombreCompleto: 'Lucía Martínez',
    rol: UserRole.CANDIDATO,
    password: 'Demo123!',
    emailVerificado: true,
    createdAt: NOW(),
  },
  {
    id: 'aaaa4444-4444-4444-4444-444444444444',
    email: 'estudiante@example.com',
    nombreCompleto: 'Sofía Estudiante',
    rol: UserRole.ESTUDIANTE,
    password: 'Demo123!',
    emailVerificado: true,
    createdAt: NOW(),
  },
]

const SEED_ORGS: Organization[] = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    nombre: 'Acme Corp',
    descripcion: 'Empresa de demostración con 200+ ingenieros y stack Java/React.',
    createdAt: NOW(),
    updatedAt: NOW(),
  },
  {
    id: '22222222-2222-2222-2222-222222222223',
    nombre: 'Globex',
    descripcion: 'Consultora regional especializada en data y cloud.',
    createdAt: NOW(),
    updatedAt: NOW(),
  },
]

const SEED_POSITIONS: JobPosition[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    organizacionId: SEED_ORGS[0].id,
    titulo: 'Backend Java SSR',
    descripcion:
      'Buscamos developer con 3+ años en Java/Spring Boot, microservicios y APIs REST.',
    tecnologia: 'Java',
    seniority: Seniority.SEMI_SENIOR,
    estado: JobPositionStatus.ACTIVO,
    createdAt: NOW(),
    updatedAt: NOW(),
  },
  {
    id: '33333333-3333-3333-3333-333333333334',
    organizacionId: SEED_ORGS[0].id,
    titulo: 'Frontend React Junior',
    descripcion:
      'Posición para perfil con 1+ año en React, TypeScript y Tailwind CSS.',
    tecnologia: 'React',
    seniority: Seniority.JUNIOR,
    estado: JobPositionStatus.INACTIVO,
    createdAt: NOW(),
    updatedAt: NOW(),
  },
  {
    id: '33333333-3333-3333-3333-333333333335',
    organizacionId: SEED_ORGS[1].id,
    titulo: 'DevOps Senior',
    descripcion:
      'Responsable de plataforma cloud sobre AWS/Terraform/Kubernetes para clientes enterprise.',
    tecnologia: 'AWS',
    seniority: Seniority.SENIOR,
    estado: JobPositionStatus.ACTIVO,
    createdAt: NOW(),
    updatedAt: NOW(),
  },
]

const RUBRICA_DEFAULT = {
  criterios: [
    { nombre: 'Correctitud', descripcion: 'Cumple los requisitos funcionales.', peso: 40 },
    { nombre: 'Calidad de código', descripcion: 'Legibilidad, naming, modularidad.', peso: 30 },
    { nombre: 'Buenas prácticas', descripcion: 'Manejo de errores, performance, tests.', peso: 30 },
  ],
  puntajeMaximo: 100,
}

const SEED_CHALLENGES: Challenge[] = [
  {
    id: '55555555-5555-5555-5555-555555555551',
    puestoId: SEED_POSITIONS[0].id,
    titulo: 'Diseña un endpoint REST de inventario',
    enunciado:
      'Implementá un endpoint POST /items que reciba { sku, nombre, stock } y devuelva 201 con el item creado. ' +
      'Validá unicidad por SKU y devolvé 409 ante duplicados. Incluí test unitario del happy path.',
    rubrica: RUBRICA_DEFAULT,
    minutosEstimados: 45,
    estado: ChallengeStatus.ACTIVO,
    createdAt: NOW(),
    updatedAt: NOW(),
  },
  {
    id: '55555555-5555-5555-5555-555555555552',
    puestoId: SEED_POSITIONS[0].id,
    titulo: 'Refactor de servicio de notificaciones',
    enunciado:
      'Tomá el snippet provisto y refactorizá para inyectar el proveedor de email (interfaz). ' +
      'Agregá un test que use un mock del proveedor. Justificá decisiones en comentarios.',
    rubrica: RUBRICA_DEFAULT,
    minutosEstimados: 30,
    estado: ChallengeStatus.BORRADOR,
    createdAt: NOW(),
    updatedAt: NOW(),
  },
  {
    id: '55555555-5555-5555-5555-555555555553',
    puestoId: SEED_POSITIONS[2].id,
    titulo: 'Pipeline CI/CD con Terraform',
    enunciado:
      'Diseñá un pipeline que aplique Terraform a un entorno staging y promueva al de prod ' +
      'con aprobación manual. Mostrá los pasos críticos en pseudo-yaml.',
    rubrica: RUBRICA_DEFAULT,
    minutosEstimados: 60,
    estado: ChallengeStatus.ACTIVO,
    createdAt: NOW(),
    updatedAt: NOW(),
  },
]

function inDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

const ANA_ID = SEED_USERS[1].id

const SEED_ASSIGNMENTS: ChallengeAssignment[] = [
  {
    id: '66666666-6666-6666-6666-666666666661',
    desafioId: SEED_CHALLENGES[0].id,
    candidatoId: ANA_ID,
    estado: AssignmentStatus.PENDIENTE,
    fechaInvitacion: inDays(-1),
    fechaLimite: inDays(7),
    createdAt: inDays(-1),
    updatedAt: inDays(-1),
    desafio: SEED_CHALLENGES[0],
  },
  {
    id: '66666666-6666-6666-6666-666666666662',
    desafioId: SEED_CHALLENGES[2].id,
    candidatoId: ANA_ID,
    estado: AssignmentStatus.PENDIENTE,
    fechaInvitacion: inDays(-2),
    fechaLimite: inDays(14),
    createdAt: inDays(-2),
    updatedAt: inDays(-2),
    desafio: SEED_CHALLENGES[2],
  },
  {
    id: '66666666-6666-6666-6666-666666666663',
    desafioId: SEED_CHALLENGES[0].id,
    candidatoId: ANA_ID,
    estado: AssignmentStatus.ACEPTADO,
    fechaInvitacion: inDays(-5),
    fechaAceptacion: inDays(-4),
    fechaLimite: inDays(3),
    createdAt: inDays(-5),
    updatedAt: inDays(-4),
    desafio: SEED_CHALLENGES[0],
  },
  {
    id: '66666666-6666-6666-6666-666666666664',
    desafioId: SEED_CHALLENGES[2].id,
    candidatoId: ANA_ID,
    estado: AssignmentStatus.COMPLETADO,
    fechaInvitacion: inDays(-10),
    fechaAceptacion: inDays(-9),
    fechaLimite: inDays(-2),
    createdAt: inDays(-10),
    updatedAt: inDays(-2),
    desafio: SEED_CHALLENGES[2],
  },
]

const SEED_EVALUATIONS: Evaluation[] = [
  {
    id: '77777777-7777-7777-7777-777777777771',
    asignacionId: SEED_ASSIGNMENTS[3].id,
    codigo: '// (solución mock omitida)',
    puntaje: 82,
    feedback:
      'Solución sólida con manejo de errores explícito y pasos del pipeline bien justificados. ' +
      'Mejorar la cobertura de tests del módulo de promoción a prod.',
    dimensiones: [
      { nombre: 'Correctitud', puntaje: 90, comentario: 'Cumple los requisitos.' },
      { nombre: 'Calidad de código', puntaje: 80, comentario: 'Bien estructurado.' },
      { nombre: 'Buenas prácticas', puntaje: 78, comentario: 'Faltan tests adicionales.' },
    ],
    estado: EvaluationStatus.COMPLETADO,
    createdAt: inDays(-2),
    updatedAt: inDays(-2),
    asignacion: SEED_ASSIGNMENTS[3],
  },
]

const SEED_RANKINGS: CandidateRanking[] = [
  {
    candidatoId: ANA_ID,
    candidatoNombre: 'Ana García',
    candidatoEmail: 'ana@example.com',
    puntajePromedio: 82,
    evaluacionesCompletadas: 1,
    ultimaEvaluacion: SEED_EVALUATIONS[0].updatedAt,
  },
  {
    candidatoId: SEED_USERS[3].id,
    candidatoNombre: 'Lucía Martínez',
    candidatoEmail: 'lucia@example.com',
    puntajePromedio: 91,
    evaluacionesCompletadas: 3,
    ultimaEvaluacion: inDays(-7),
  },
  {
    candidatoId: SEED_USERS[2].id,
    candidatoNombre: 'Pedro López',
    candidatoEmail: 'pedro@example.com',
    puntajePromedio: 67,
    evaluacionesCompletadas: 2,
    ultimaEvaluacion: inDays(-12),
  },
]

interface PendingEvaluation {
  asignacionId: string
  pollsRemaining: number
}

export const demoStore = {
  users: [...SEED_USERS],
  organizations: [...SEED_ORGS],
  positions: [...SEED_POSITIONS],
  challenges: [...SEED_CHALLENGES],
  assignments: [...SEED_ASSIGNMENTS],
  evaluations: [...SEED_EVALUATIONS],
  rankings: [...SEED_RANKINGS],
  pending: new Map<string, PendingEvaluation>(),
}

let counter = 1
export function nextId(prefix = 'demo'): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}`
}

export function findUserByEmail(email: string): DemoUser | undefined {
  return demoStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function findUserById(id: string): DemoUser | undefined {
  return demoStore.users.find((u) => u.id === id)
}

// Made with Bob
