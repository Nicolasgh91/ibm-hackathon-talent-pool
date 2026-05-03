import type { CandidateRanking, Evaluation, PositionRankingWire } from '@/types'
import { EvaluationStatus } from '@/types'

function num(v: number | string | undefined | null): number {
  if (v == null) return 0
  return typeof v === 'number' ? v : Number(v)
}

/** Aggregate backend ranking rows (one per completed evaluation) per candidate. */
export function wireRankingToCandidateRankings(wire: PositionRankingWire): CandidateRanking[] {
  const map = new Map<
    string,
    { scores: number[]; nombre: string; email: string; last?: string }
  >()
  for (const e of wire.ranking) {
    const id = e.candidatoId
    const cur = map.get(id) ?? {
      scores: [],
      nombre: e.candidatoNombre,
      email: e.candidatoEmail,
    }
    cur.scores.push(num(e.puntajeTotal))
    const t = e.evaluadoEn ? new Date(e.evaluadoEn).getTime() : 0
    const prev = cur.last ? new Date(cur.last).getTime() : 0
    if (t >= prev) cur.last = e.evaluadoEn ?? undefined
    map.set(id, cur)
  }
  return [...map.entries()]
    .map(([candidatoId, v]) => ({
      candidatoId,
      candidatoNombre: v.nombre,
      candidatoEmail: v.email,
      puntajePromedio:
        v.scores.length > 0 ? Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length) : 0,
      evaluacionesCompletadas: v.scores.length,
      ultimaEvaluacion: v.last,
    }))
    .sort((a, b) => b.puntajePromedio - a.puntajePromedio)
}

/** Map backend evaluation states to UI EvaluationStatus. */
export function mapBackendEstadoToUi(estado: string): EvaluationStatus {
  switch (estado) {
    case 'ENTREGADA':
    case 'EN_CURSO':
      return EvaluationStatus.EVALUANDO
    case 'EVALUADA':
      return EvaluationStatus.COMPLETADO
    case 'ERROR':
    case 'FALLIDA':
      return EvaluationStatus.ERROR
    default:
      return EvaluationStatus.PENDIENTE
  }
}

/** Wire: EvaluacionBasic / EvaluacionDetail from GET /evaluations/:id */
export interface EvaluationDetailWire {
  id: string
  desafioId?: string
  desafioTitulo?: string | null
  candidatoId?: string
  candidatoEmail?: string | null
  estado: string
  puntajeTotal?: number | string | null
  dimensiones?: Array<{
    nombre: string
    puntaje: number | string
    peso?: number | string
    justificacion?: string | null
  }>
  reporteFeedback?: Record<string, unknown> | null
  minutosEmpleados?: number | null
  inicio?: string | null
  entrega?: string | null
  evaluadoEn?: string | null
}

export function wireEvaluationToUi(
  wire: EvaluationDetailWire,
  fallbackAsignacionId = '',
  fallbackCodigo = '',
): Evaluation {
  const estado = mapBackendEstadoToUi(wire.estado)
  const puntaje = num(wire.puntajeTotal)
  let feedback = ''
  if (wire.reporteFeedback && typeof wire.reporteFeedback === 'object') {
    const rf = wire.reporteFeedback as Record<string, unknown>
    if (typeof rf.summary === 'string') feedback = rf.summary
    else if (typeof rf.text === 'string') feedback = rf.text
    else feedback = JSON.stringify(wire.reporteFeedback)
  }
  const dimensiones = (wire.dimensiones ?? []).map((d) => ({
    nombre: d.nombre,
    puntaje: num(d.puntaje),
    comentario: d.justificacion ?? '',
  }))
  const createdAt = wire.inicio ?? wire.evaluadoEn ?? new Date().toISOString()
  const updatedAt = wire.evaluadoEn ?? wire.entrega ?? createdAt

  return {
    id: String(wire.id),
    asignacionId: fallbackAsignacionId,
    codigo: fallbackCodigo,
    puntaje,
    feedback,
    dimensiones,
    estado,
    createdAt,
    updatedAt,
  }
}
