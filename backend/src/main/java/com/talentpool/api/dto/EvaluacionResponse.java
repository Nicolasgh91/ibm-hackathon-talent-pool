package com.talentpool.api.dto;

import com.talentpool.domain.DimensionPuntaje;
import com.talentpool.domain.Evaluacion;
import io.vertx.core.json.JsonObject;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Response DTOs for evaluation operations.
 */
public class EvaluacionResponse {

  /**
   * Basic evaluation response (for submission).
   */
  public record EvaluacionBasic(
      UUID id,
      UUID desafioId,
      UUID candidatoId,
      String estado,
      BigDecimal puntajeTotal,
      Instant inicio,
      Instant entrega,
      Instant evaluadoEn
  ) {
    public static EvaluacionBasic from(Evaluacion evaluacion) {
      return new EvaluacionBasic(
          evaluacion.id,
          evaluacion.desafioId,
          evaluacion.candidatoId,
          evaluacion.estado,
          evaluacion.puntajeTotal,
          evaluacion.inicio,
          evaluacion.entrega,
          evaluacion.evaluadoEn
      );
    }
  }

  /**
   * Detailed evaluation response (with dimensions and feedback).
   */
  public record EvaluacionDetail(
      UUID id,
      UUID desafioId,
      String desafioTitulo,
      UUID candidatoId,
      String candidatoEmail,
      String estado,
      BigDecimal puntajeTotal,
      List<DimensionResponse> dimensiones,
      JsonObject reporteFeedback,
      Integer minutosEmpleados,
      Instant inicio,
      Instant entrega,
      Instant evaluadoEn
  ) {}

  /**
   * Dimension score details.
   */
  public record DimensionResponse(
      String nombre,
      BigDecimal puntaje,
      BigDecimal peso,
      String justificacion
  ) {
    public static DimensionResponse from(DimensionPuntaje dimension) {
      return new DimensionResponse(
          dimension.nombre,
          dimension.puntaje,
          dimension.peso,
          dimension.justificacion
      );
    }
  }

  /**
   * Ranking response for a position.
   */
  public record RankingResponse(
      UUID puestoId,
      String puestoTitulo,
      int totalCandidatos,
      List<CandidateRankingEntry> ranking
  ) {}

  /**
   * Individual candidate ranking entry.
   */
  public record CandidateRankingEntry(
      int posicion,
      UUID candidatoId,
      String candidatoEmail,
      String candidatoNombre,
      BigDecimal puntajeTotal,
      List<DimensionResponse> dimensiones,
      Integer minutosEmpleados,
      Instant evaluadoEn
  ) {}
}

// Made with Bob