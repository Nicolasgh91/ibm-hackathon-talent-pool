import api from './api'
import type { Evaluation, SubmitSolutionRequest, CandidateRanking } from '@/types'
import { EvaluationStatus } from '@/types'
import { isDemoMode } from '@/mocks/demoMode'
import { jobPositionService } from './jobPositionService'
import {
  wireEvaluationToUi,
  wireRankingToCandidateRankings,
  type EvaluationDetailWire,
} from './adapters/evaluationWireAdapter'

function isSubmitAcceptedResponse(data: unknown): data is {
  evaluacionId: string
  estado: string
  estimacionSegundos?: number
} {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return typeof d.evaluacionId === 'string'
}

function isFullEvaluation(data: unknown): data is Evaluation {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return typeof d.id === 'string' && 'asignacionId' in d
}

export const evaluationService = {
  async getAll(asignacionId?: string): Promise<Evaluation[]> {
    const params = asignacionId ? { asignacionId } : {}
    const response = await api.get<Evaluation[] | EvaluationDetailWire[]>('/evaluations', {
      params,
    })
    const rows = response.data
    if (!Array.isArray(rows)) return []
    return rows.map((row) =>
      isFullEvaluation(row)
        ? row
        : wireEvaluationToUi(row as EvaluationDetailWire, '', ''),
    )
  },

  async getById(id: string): Promise<Evaluation> {
    const response = await api.get<Evaluation | EvaluationDetailWire>(`/evaluations/${id}`)
    const data = response.data
    if (isFullEvaluation(data)) return data
    return wireEvaluationToUi(data as EvaluationDetailWire, '', '')
  },

  async submit(data: SubmitSolutionRequest): Promise<Evaluation> {
    const useBackendShape =
      !isDemoMode() &&
      data.invitationToken != null &&
      data.invitationToken !== '' &&
      data.invitationToken.trim() !== ''

    const body = useBackendShape
      ? {
          token: data.invitationToken!.trim(),
          codigoEntregado: data.codigo,
          lenguaje: data.lenguaje ?? 'javascript',
          minutosEmpleados: data.minutosEmpleados ?? 0,
        }
      : { asignacionId: data.asignacionId, codigo: data.codigo }

    const response = await api.post<unknown>('/evaluations', body, {
      validateStatus: (s) => s === 200 || s === 201 || s === 202 || s === 204,
    })

    if (response.status >= 400) {
      const err = new Error('Evaluation submit failed') as Error & { status?: number; data?: unknown }
      err.status = response.status
      err.data = response.data
      throw err
    }

    const payload = response.data
    if (isSubmitAcceptedResponse(payload)) {
      const estadoUi =
        payload.estado === 'EVALUADA'
          ? EvaluationStatus.COMPLETADO
          : EvaluationStatus.EVALUANDO
      return {
        id: payload.evaluacionId,
        asignacionId: data.asignacionId,
        codigo: data.codigo,
        puntaje: 0,
        feedback: '',
        dimensiones: [],
        estado: estadoUi,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    if (isFullEvaluation(payload)) {
      return payload
    }

    throw new Error('Unexpected evaluation submit response')
  },

  async getByAssignment(asignacionId: string): Promise<Evaluation> {
    const response = await api.get<Evaluation | EvaluationDetailWire>(
      `/evaluations/assignment/${asignacionId}`,
    )
    const data = response.data
    if (isFullEvaluation(data)) return data
    return wireEvaluationToUi(data as EvaluationDetailWire, asignacionId, '')
  },

  /**
   * Rankings for a job position (GET /positions/:id/ranking).
   * Pass empty string to get an empty list (backend has no global ranking).
   */
  async getRankings(puestoId?: string): Promise<CandidateRanking[]> {
    if (!puestoId) return []
    const wire = await jobPositionService.getRankingWire(puestoId)
    return wireRankingToCandidateRankings(wire)
  },

  async getMyEvaluations(): Promise<Evaluation[]> {
    const response = await api.get<Evaluation[] | EvaluationDetailWire[]>('/evaluations/my-evaluations')
    const rows = response.data
    if (!Array.isArray(rows)) return []
    return rows.map((row) =>
      isFullEvaluation(row)
        ? row
        : wireEvaluationToUi(row as EvaluationDetailWire, '', ''),
    )
  },
}
