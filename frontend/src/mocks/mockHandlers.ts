/**
 * Pure router for the in-memory demo backend. Returns the same DTO shapes the
 * real Quarkus API does, so the frontend services do not change.
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
  AuthResponseDto,
  CandidateRanking,
  Challenge,
  ChallengeAssignment,
  CreateJobPositionRequest,
  CreateOrganizationRequest,
  Evaluation,
  InviteCandidateRequest,
  JobPosition,
  Organization,
  PositionRankingWire,
  UsuarioMeDto,
} from '@/types'
import { demoStore, findUserByEmail, findUserById, nextId } from './demoStore'
import type { DemoUser } from './demoStore'

export class MockHttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'MockHttpError'
  }
}

export interface MockResponse {
  status: number
  data: unknown
}

export interface MockRequest {
  method: string
  url: string
  body?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string | undefined>
}

const ROLE_STORAGE_PREFIX = 'tp_role_'

function persistRole(email: string, rol: UserRole): void {
  try {
    localStorage.setItem(ROLE_STORAGE_PREFIX + encodeURIComponent(email), rol)
  } catch {
    /* ignore quota */
  }
}

function jitter(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min))
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

function makeToken(user: DemoUser): string {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ sub: user.id, email: user.email, rol: user.rol }))))
  return `demo.${payload}.signature`
}

function decodeToken(token: string | undefined): { sub: string; email: string; rol: UserRole } | null {
  if (!token) return null
  const raw = token.replace(/^Bearer\s+/i, '').trim()
  if (!raw.startsWith('demo.')) return null
  try {
    const [, payload] = raw.split('.')
    const json = decodeURIComponent(escape(atob(payload)))
    return JSON.parse(json)
  } catch {
    return null
  }
}

function authResponseFor(user: DemoUser): AuthResponseDto {
  return {
    accessToken: makeToken(user),
    refreshToken: 'demo.refresh.' + user.id,
    tokenType: 'Bearer',
    expiresIn: 3600,
    usuario: {
      id: user.id,
      email: user.email,
      nombreCompleto: user.nombreCompleto,
      emailVerificado: user.emailVerificado,
    },
  }
}

function meDto(user: DemoUser): UsuarioMeDto {
  return {
    id: user.id,
    email: user.email,
    nombreCompleto: user.nombreCompleto,
    fotoUrl: null,
    emailVerificado: user.emailVerificado,
    createdAt: user.createdAt,
  }
}

function getCurrentUser(req: MockRequest): DemoUser | null {
  const auth = req.headers?.['authorization'] ?? req.headers?.['Authorization']
  const decoded = decodeToken(auth)
  if (!decoded) return null
  return findUserById(decoded.sub) ?? null
}

function ok(data: unknown, status = 200): MockResponse {
  return { status, data }
}

function notFound(msg = 'Resource not found'): never {
  throw new MockHttpError(404, msg)
}

function bad(msg: string): never {
  throw new MockHttpError(400, msg)
}

function unauthorized(msg = 'Invalid credentials'): never {
  throw new MockHttpError(401, msg)
}

function attachChallenge(a: ChallengeAssignment): ChallengeAssignment {
  if (a.desafio) return a
  const c = demoStore.challenges.find((ch) => ch.id === a.desafioId)
  return c ? { ...a, desafio: c } : a
}

function recomputeRankings(): CandidateRanking[] {
  const byCandidate = new Map<string, { sum: number; count: number; last?: string }>()
  for (const e of demoStore.evaluations) {
    if (e.estado !== EvaluationStatus.COMPLETADO) continue
    const a = demoStore.assignments.find((x) => x.id === e.asignacionId)
    if (!a) continue
    const cur = byCandidate.get(a.candidatoId) ?? { sum: 0, count: 0 }
    cur.sum += e.puntaje
    cur.count += 1
    cur.last = e.updatedAt
    byCandidate.set(a.candidatoId, cur)
  }
  const dynamic: CandidateRanking[] = []
  for (const [candidatoId, agg] of byCandidate.entries()) {
    const u = findUserById(candidatoId)
    if (!u) continue
    dynamic.push({
      candidatoId,
      candidatoNombre: u.nombreCompleto,
      candidatoEmail: u.email,
      puntajePromedio: Math.round(agg.sum / agg.count),
      evaluacionesCompletadas: agg.count,
      ultimaEvaluacion: agg.last,
    })
  }
  // Merge with seed rankings (other candidates) for visual richness
  const merged = new Map<string, CandidateRanking>()
  for (const r of demoStore.rankings) merged.set(r.candidatoId, r)
  for (const r of dynamic) merged.set(r.candidatoId, r)
  return Array.from(merged.values()).sort((a, b) => b.puntajePromedio - a.puntajePromedio)
}

/** Wire aligned with Quarkus GET /positions/:id/ranking (RankingResponse). */
function buildPositionRankingWire(puestoId: string): PositionRankingWire {
  const pos = demoStore.positions.find((p) => p.id === puestoId)
  const challengeIds = new Set(
    demoStore.challenges.filter((c) => c.puestoId === puestoId).map((c) => c.id),
  )
  type Row = NonNullable<PositionRankingWire['ranking']>[number]
  const rows: Row[] = []
  for (const e of demoStore.evaluations) {
    if (e.estado !== EvaluationStatus.COMPLETADO) continue
    const a = demoStore.assignments.find((x) => x.id === e.asignacionId)
    if (!a || !challengeIds.has(a.desafioId)) continue
    const u = findUserById(a.candidatoId)
    if (!u) continue
    rows.push({
      posicion: 0,
      candidatoId: a.candidatoId,
      candidatoEmail: u.email,
      candidatoNombre: u.nombreCompleto,
      puntajeTotal: e.puntaje,
      dimensiones: (e.dimensiones ?? []).map((d) => ({
        nombre: d.nombre,
        puntaje: d.puntaje,
        peso: 33,
        justificacion: d.comentario,
      })),
      minutosEmpleados: null,
      evaluadoEn: e.updatedAt,
    })
  }
  rows.sort((a, b) => num(b.puntajeTotal) - num(a.puntajeTotal))
  const ranking = rows.map((r, i) => ({ ...r, posicion: i + 1 }))
  return {
    puestoId,
    puestoTitulo: pos?.titulo ?? '',
    totalCandidatos: ranking.length,
    ranking,
  }
}

function num(v: number | string): number {
  return typeof v === 'number' ? v : Number(v)
}

function maybeAdvanceEvaluation(id: string): void {
  const pending = demoStore.pending.get(id)
  if (!pending) return
  pending.pollsRemaining -= 1
  if (pending.pollsRemaining > 0) {
    demoStore.pending.set(id, pending)
    return
  }
  const ev = demoStore.evaluations.find((e) => e.id === id)
  if (!ev) {
    demoStore.pending.delete(id)
    return
  }
  ev.estado = EvaluationStatus.COMPLETADO
  ev.puntaje = 60 + Math.floor(Math.random() * 36)
  ev.feedback =
    'Buena solución general. La estructura del código es clara y los nombres son consistentes. ' +
    'Como mejora, agregar tests para los casos de borde y validar entradas inválidas explícitamente.'
  ev.dimensiones = [
    { nombre: 'Correctitud', puntaje: ev.puntaje, comentario: 'Cumple los requisitos principales.' },
    { nombre: 'Calidad de código', puntaje: Math.max(50, ev.puntaje - 5), comentario: 'Legible y modular.' },
    { nombre: 'Buenas prácticas', puntaje: Math.max(40, ev.puntaje - 10), comentario: 'Falta cobertura de tests y manejo de errores.' },
  ]
  ev.updatedAt = new Date().toISOString()

  // Mark assignment as COMPLETADO
  const a = demoStore.assignments.find((x) => x.id === ev.asignacionId)
  if (a) {
    a.estado = AssignmentStatus.COMPLETADO
    a.updatedAt = ev.updatedAt
  }
  demoStore.pending.delete(id)
}

function matchPath(pattern: string, url: string): Record<string, string> | null {
  const pa = pattern.split('/').filter(Boolean)
  const ua = url.split('?')[0].split('/').filter(Boolean)
  if (pa.length !== ua.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < pa.length; i += 1) {
    if (pa[i].startsWith(':')) {
      params[pa[i].slice(1)] = decodeURIComponent(ua[i])
    } else if (pa[i] !== ua[i]) {
      return null
    }
  }
  return params
}

function handlePostChallengeGenerate(req: MockRequest): MockResponse {
  const body = (req.body ?? {}) as { puestoId: string }
  const pos = demoStore.positions.find((p) => p.id === body.puestoId)
  const titulo = pos ? `Desafío generado: ${pos.titulo}` : 'Desafío generado (mock)'
  const enunciado = pos
    ? `Implementá una solución acorde a "${pos.titulo}" usando ${pos.tecnologia}. ` +
      'Incluí tests y documentación breve de decisiones.'
    : 'Implementá la solución pedida e incluí tests.'
  const ch: Challenge = {
    id: nextId('ch'),
    puestoId: body.puestoId,
    titulo,
    enunciado,
    rubrica: {
      criterios: [
        { nombre: 'Correctitud', descripcion: 'Cumple requisitos.', peso: 40 },
        { nombre: 'Calidad', descripcion: 'Legibilidad y diseño.', peso: 30 },
        { nombre: 'Tests', descripcion: 'Cobertura razonable.', peso: 30 },
      ],
      puntajeMaximo: 100,
    },
    minutosEstimados: 45,
    estado: ChallengeStatus.BORRADOR,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  demoStore.challenges.push(ch)
  return ok(ch, 201)
}

function handlePostEvaluationSubmit(req: MockRequest): MockResponse {
  const body = (req.body ?? {}) as {
    asignacionId?: string
    codigo?: string
    codigoEntregado?: string
  }
  const asignacionId = body.asignacionId
  const codigo = (body.codigo ?? body.codigoEntregado ?? '').toString()
  if (!asignacionId) bad('asignacionId is required for evaluation submit (demo)')
  const a = demoStore.assignments.find((x) => x.id === asignacionId)
  if (!a) notFound('Assignment not found')
  const ev: Evaluation = {
    id: nextId('ev'),
    asignacionId: a.id,
    codigo,
    puntaje: 0,
    feedback: 'Procesando evaluación...',
    dimensiones: [],
    estado: EvaluationStatus.EVALUANDO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    asignacion: a,
  }
  demoStore.evaluations.push(ev)
  demoStore.pending.set(ev.id, { asignacionId: a.id, pollsRemaining: 2 })
  return ok(ev, 202)
}

interface Route {
  method: string
  pattern: string
  handler: (req: MockRequest, params: Record<string, string>) => Promise<MockResponse> | MockResponse
}

const routes: Route[] = [
  // ---- Invitations (public) & Chat (demo parity with backend-only routes) ----
  {
    method: 'GET',
    pattern: '/invitations/by-token/:token',
    handler: (_req, params) => {
      const ch = demoStore.challenges[0]
      const asg = demoStore.assignments[0]
      const org = demoStore.organizations[0]
      const pos = demoStore.positions[0]
      if (!ch || !asg) notFound('No seed invitation data')
      return ok({
        invitacionId: nextId('inv'),
        asignacionId: asg.id,
        emailInvitado: 'candidate@demo.com',
        organizacion: org?.nombre ?? 'Demo Org',
        estado: 'PENDIENTE',
        expiraEn: new Date(Date.now() + 7 * 86400000).toISOString(),
        isValid: true,
        desafio: {
          id: ch.id,
          titulo: ch.titulo,
          enunciado: ch.enunciado,
          tecnologia: pos?.tecnologia ?? 'TypeScript',
          seniority: pos?.seniority ?? 'JUNIOR',
          minutosEstimados: ch.minutosEstimados,
        },
        puesto: pos
          ? {
              titulo: pos.titulo,
              tecnologiaPrincipal: pos.tecnologia,
              seniority: pos.seniority,
            }
          : null,
      })
    },
  },
  {
    method: 'POST',
    pattern: '/chat',
    handler: (req) => {
      const body = (req.body ?? {}) as { message?: string }
      return ok({
        message: `Echo (demo): ${(body.message ?? '').slice(0, 200)}`,
        conversationId: 'mock-conv',
        timestamp: new Date().toISOString(),
      })
    },
  },
  // ---- Auth ----
  {
    method: 'POST',
    pattern: '/auth/register',
    handler: (req) => {
      const body = (req.body ?? {}) as {
        email?: string
        password?: string
        nombreCompleto?: string
      }
      const email = (body.email ?? '').toLowerCase().trim()
      if (!email || !body.password || !body.nombreCompleto) bad('Missing fields')
      if (findUserByEmail(email)) bad('Email already registered')

      // Role is persisted on the frontend before this request (Register.tsx
      // calls authService.register with the chosen rol, which writes the
      // localStorage key). We honor it; default to CANDIDATO.
      const persisted =
        (() => {
          try {
            return localStorage.getItem(ROLE_STORAGE_PREFIX + encodeURIComponent(email))
          } catch {
            return null
          }
        })() as UserRole | null
      const rol: UserRole =
        persisted && Object.values(UserRole).includes(persisted) ? persisted : UserRole.CANDIDATO

      const user: DemoUser = {
        id: nextId('user'),
        email,
        nombreCompleto: body.nombreCompleto.trim(),
        rol,
        password: body.password,
        emailVerificado: false,
        createdAt: new Date().toISOString(),
      }
      demoStore.users.push(user)
      persistRole(email, rol)
      return ok(authResponseFor(user))
    },
  },
  {
    method: 'POST',
    pattern: '/auth/login',
    handler: (req) => {
      const body = (req.body ?? {}) as { email?: string; password?: string }
      const email = (body.email ?? '').toLowerCase().trim()
      const user = findUserByEmail(email)
      if (!user || user.password !== body.password) unauthorized('Invalid email or password')
      persistRole(user.email, user.rol)
      return ok(authResponseFor(user))
    },
  },
  {
    method: 'GET',
    pattern: '/auth/me',
    handler: (req) => {
      const user = getCurrentUser(req)
      if (!user) unauthorized()
      return ok(meDto(user))
    },
  },

  // ---- Organizations ----
  {
    method: 'GET',
    pattern: '/organizations',
    handler: () => ok([...demoStore.organizations]),
  },
  {
    method: 'GET',
    pattern: '/organizations/:id',
    handler: (_req, params) => {
      const org = demoStore.organizations.find((o) => o.id === params.id)
      if (!org) notFound('Organization not found')
      return ok(org)
    },
  },
  {
    method: 'POST',
    pattern: '/organizations',
    handler: (req) => {
      const body = (req.body ?? {}) as CreateOrganizationRequest
      if (!body.nombre) bad('Name is required')
      const org: Organization = {
        id: nextId('org'),
        nombre: body.nombre,
        descripcion: body.descripcion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      demoStore.organizations.push(org)
      return ok(org, 201)
    },
  },
  {
    method: 'PUT',
    pattern: '/organizations/:id',
    handler: (req, params) => {
      const idx = demoStore.organizations.findIndex((o) => o.id === params.id)
      if (idx < 0) notFound('Organization not found')
      const body = (req.body ?? {}) as Partial<CreateOrganizationRequest>
      const updated = {
        ...demoStore.organizations[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      }
      demoStore.organizations[idx] = updated
      return ok(updated)
    },
  },
  {
    method: 'DELETE',
    pattern: '/organizations/:id',
    handler: (_req, params) => {
      demoStore.organizations = demoStore.organizations.filter((o) => o.id !== params.id)
      return ok(null, 204)
    },
  },

  // ---- Positions ----
  {
    method: 'GET',
    pattern: '/positions',
    handler: (req) => {
      const orgId = req.params?.organizacionId as string | undefined
      const list = orgId
        ? demoStore.positions.filter((p) => p.organizacionId === orgId)
        : [...demoStore.positions]
      return ok(list)
    },
  },
  {
    method: 'GET',
    pattern: '/positions/:id',
    handler: (_req, params) => {
      const p = demoStore.positions.find((x) => x.id === params.id)
      if (!p) notFound('Position not found')
      return ok(p)
    },
  },
  {
    method: 'GET',
    pattern: '/positions/:id/ranking',
    handler: (_req, params) => ok(buildPositionRankingWire(params.id)),
  },
  {
    method: 'POST',
    pattern: '/positions',
    handler: (req) => {
      const body = (req.body ?? {}) as CreateJobPositionRequest
      const pos: JobPosition = {
        id: nextId('pos'),
        organizacionId: body.organizacionId,
        titulo: body.titulo,
        descripcion: body.descripcion,
        tecnologia: body.tecnologia,
        seniority: body.seniority ?? Seniority.JUNIOR,
        estado: JobPositionStatus.ACTIVO,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      demoStore.positions.push(pos)
      return ok(pos, 201)
    },
  },
  {
    method: 'PUT',
    pattern: '/positions/:id',
    handler: (req, params) => {
      const idx = demoStore.positions.findIndex((p) => p.id === params.id)
      if (idx < 0) notFound('Position not found')
      const body = (req.body ?? {}) as Partial<CreateJobPositionRequest>
      const updated: JobPosition = {
        ...demoStore.positions[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      }
      demoStore.positions[idx] = updated
      return ok(updated)
    },
  },
  {
    method: 'DELETE',
    pattern: '/positions/:id',
    handler: (_req, params) => {
      demoStore.positions = demoStore.positions.filter((p) => p.id !== params.id)
      return ok(null, 204)
    },
  },
  {
    method: 'POST',
    pattern: '/positions/:id/activate',
    handler: (_req, params) => {
      const p = demoStore.positions.find((x) => x.id === params.id)
      if (!p) notFound('Position not found')
      p.estado = JobPositionStatus.ACTIVO
      p.updatedAt = new Date().toISOString()
      return ok(p)
    },
  },
  {
    method: 'POST',
    pattern: '/positions/:id/deactivate',
    handler: (_req, params) => {
      const p = demoStore.positions.find((x) => x.id === params.id)
      if (!p) notFound('Position not found')
      p.estado = JobPositionStatus.INACTIVO
      p.updatedAt = new Date().toISOString()
      return ok(p)
    },
  },

  // ---- Challenges ----
  {
    method: 'GET',
    pattern: '/challenges',
    handler: (req) => {
      const puestoId = req.params?.puestoId as string | undefined
      const list = puestoId
        ? demoStore.challenges.filter((c) => c.puestoId === puestoId)
        : [...demoStore.challenges]
      return ok(list)
    },
  },
  {
    method: 'GET',
    pattern: '/challenges/:id',
    handler: (_req, params) => {
      const c = demoStore.challenges.find((x) => x.id === params.id)
      if (!c) notFound('Challenge not found')
      return ok(c)
    },
  },
  {
    method: 'POST',
    pattern: '/challenges',
    handler: (req) => handlePostChallengeGenerate(req),
  },
  {
    method: 'POST',
    pattern: '/challenges/generate',
    handler: (req) => handlePostChallengeGenerate(req),
  },
  {
    method: 'POST',
    pattern: '/challenges/:id/regenerate',
    handler: (_req, params) => {
      const c = demoStore.challenges.find((x) => x.id === params.id)
      if (!c) notFound('Challenge not found')
      c.titulo = `${c.titulo} (revisado)`
      c.enunciado += '\n\nRefinamiento: agregar manejo de concurrencia y un caso adicional de error.'
      c.updatedAt = new Date().toISOString()
      return ok(c)
    },
  },
  {
    method: 'POST',
    pattern: '/challenges/confirm',
    handler: (req) => {
      const body = (req.body ?? {}) as { desafioId: string }
      const c = demoStore.challenges.find((x) => x.id === body.desafioId)
      if (!c) notFound('Challenge not found')
      c.estado = ChallengeStatus.ACTIVO
      c.updatedAt = new Date().toISOString()
      return ok(c)
    },
  },
  {
    method: 'POST',
    pattern: '/challenges/:id/activate',
    handler: (_req, params) => {
      const c = demoStore.challenges.find((x) => x.id === params.id)
      if (!c) notFound('Challenge not found')
      c.estado = ChallengeStatus.ACTIVO
      c.updatedAt = new Date().toISOString()
      return ok(c)
    },
  },
  {
    method: 'POST',
    pattern: '/challenges/:id/deactivate',
    handler: (_req, params) => {
      const c = demoStore.challenges.find((x) => x.id === params.id)
      if (!c) notFound('Challenge not found')
      c.estado = ChallengeStatus.INACTIVO
      c.updatedAt = new Date().toISOString()
      return ok(c)
    },
  },
  {
    method: 'DELETE',
    pattern: '/challenges/:id',
    handler: (_req, params) => {
      demoStore.challenges = demoStore.challenges.filter((c) => c.id !== params.id)
      return ok(null, 204)
    },
  },

  // ---- Assignments ----
  {
    method: 'GET',
    pattern: '/assignments',
    handler: (req) => {
      const candidatoId = req.params?.candidatoId as string | undefined
      const list = candidatoId
        ? demoStore.assignments.filter((a) => a.candidatoId === candidatoId)
        : [...demoStore.assignments]
      return ok(list.map(attachChallenge))
    },
  },
  {
    method: 'GET',
    pattern: '/assignments/my-invitations',
    handler: (req) => {
      const user = getCurrentUser(req)
      if (!user) unauthorized()
      const list = demoStore.assignments.filter(
        (a) => a.candidatoId === user.id,
      )
      return ok(list.map(attachChallenge))
    },
  },
  {
    method: 'GET',
    pattern: '/assignments/my-challenges',
    handler: (req) => {
      const user = getCurrentUser(req)
      if (!user) unauthorized()
      const list = demoStore.assignments.filter(
        (a) =>
          a.candidatoId === user.id &&
          (a.estado === AssignmentStatus.ACEPTADO || a.estado === AssignmentStatus.COMPLETADO),
      )
      return ok(list.map(attachChallenge))
    },
  },
  {
    method: 'GET',
    pattern: '/assignments/:id',
    handler: (_req, params) => {
      const a = demoStore.assignments.find((x) => x.id === params.id)
      if (!a) notFound('Assignment not found')
      return ok(attachChallenge(a))
    },
  },
  {
    method: 'POST',
    pattern: '/assignments/invite',
    handler: (req) => {
      const body = (req.body ?? {}) as InviteCandidateRequest
      const ch = demoStore.challenges.find((c) => c.id === body.desafioId)
      if (!ch) notFound('Challenge not found')
      let candidate = findUserByEmail(body.candidatoEmail)
      if (!candidate) {
        candidate = {
          id: nextId('user'),
          email: body.candidatoEmail.toLowerCase(),
          nombreCompleto: body.candidatoEmail.split('@')[0],
          rol: UserRole.CANDIDATO,
          password: 'Demo123!',
          emailVerificado: false,
          createdAt: new Date().toISOString(),
        }
        demoStore.users.push(candidate)
      }
      const a: ChallengeAssignment = {
        id: nextId('asg'),
        desafioId: ch.id,
        candidatoId: candidate.id,
        estado: AssignmentStatus.PENDIENTE,
        fechaInvitacion: new Date().toISOString(),
        fechaLimite: body.fechaLimite,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        desafio: ch,
      }
      demoStore.assignments.push(a)
      return ok(a, 201)
    },
  },
  {
    method: 'POST',
    pattern: '/assignments/accept',
    handler: (req) => {
      const body = (req.body ?? {}) as { asignacionId: string }
      const a = demoStore.assignments.find((x) => x.id === body.asignacionId)
      if (!a) notFound('Assignment not found')
      a.estado = AssignmentStatus.ACEPTADO
      a.fechaAceptacion = new Date().toISOString()
      a.updatedAt = a.fechaAceptacion
      return ok(attachChallenge(a))
    },
  },
  {
    method: 'POST',
    pattern: '/assignments/:id/reject',
    handler: (_req, params) => {
      const a = demoStore.assignments.find((x) => x.id === params.id)
      if (!a) notFound('Assignment not found')
      a.estado = AssignmentStatus.RECHAZADO
      a.updatedAt = new Date().toISOString()
      return ok(attachChallenge(a))
    },
  },

  // ---- Evaluations ----
  {
    method: 'GET',
    pattern: '/evaluations',
    handler: (req) => {
      const asignacionId = req.params?.asignacionId as string | undefined
      const list = asignacionId
        ? demoStore.evaluations.filter((e) => e.asignacionId === asignacionId)
        : [...demoStore.evaluations]
      return ok(list)
    },
  },
  {
    method: 'GET',
    pattern: '/evaluations/rankings',
    handler: () => ok(recomputeRankings()),
  },
  {
    method: 'GET',
    pattern: '/evaluations/my-evaluations',
    handler: (req) => {
      const user = getCurrentUser(req)
      if (!user) unauthorized()
      const myAsg = new Set(
        demoStore.assignments.filter((a) => a.candidatoId === user.id).map((a) => a.id),
      )
      return ok(demoStore.evaluations.filter((e) => myAsg.has(e.asignacionId)))
    },
  },
  {
    method: 'GET',
    pattern: '/evaluations/assignment/:asignacionId',
    handler: (_req, params) => {
      const e = demoStore.evaluations.find((x) => x.asignacionId === params.asignacionId)
      if (!e) notFound('Evaluation not found for assignment')
      return ok(e)
    },
  },
  {
    method: 'GET',
    pattern: '/evaluations/:id',
    handler: (_req, params) => {
      const e = demoStore.evaluations.find((x) => x.id === params.id)
      if (!e) notFound('Evaluation not found')
      // Each poll while EVALUANDO drains the pending counter; once 0, completes.
      if (e.estado === EvaluationStatus.EVALUANDO) maybeAdvanceEvaluation(e.id)
      return ok(e)
    },
  },
  {
    method: 'POST',
    pattern: '/evaluations',
    handler: (req) => handlePostEvaluationSubmit(req),
  },
  {
    method: 'POST',
    pattern: '/evaluations/submit',
    handler: (req) => handlePostEvaluationSubmit(req),
  },
]

export const mockHandlers = {
  async handle(req: MockRequest): Promise<MockResponse> {
    await sleep(jitter(120, 320))
    for (const route of routes) {
      if (route.method !== req.method) continue
      const params = matchPath(route.pattern, req.url)
      if (!params) continue
      return route.handler(req, params)
    }
    throw new MockHttpError(404, `Mock route not found: ${req.method} ${req.url}`)
  },
}

// Made with Bob
