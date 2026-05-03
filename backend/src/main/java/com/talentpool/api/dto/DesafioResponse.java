package com.talentpool.api.dto;

import com.talentpool.domain.Desafio;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for challenge details.
 *
 * <p>Used by POST /api/v1/challenges endpoint.
 */
public record DesafioResponse(
    UUID id,
    UUID creadorUsuarioId,
    UUID organizacionId,
    String titulo,
    String enunciado,
    String tecnologia,
    String seniority,
    Integer minutosEstimados,
    String contextoOrigen,
    Boolean esPublico,
    UUID planEvaluacionId,
    String tipoDesafio,
    BigDecimal peso,
    String estado,
    Instant createdAt) {

  public static DesafioResponse from(Desafio desafio) {
    return new DesafioResponse(
        desafio.id,
        desafio.creadorUsuarioId,
        desafio.organizacionId,
        desafio.titulo,
        desafio.enunciado,
        desafio.tecnologia,
        desafio.seniority,
        desafio.minutosEstimados,
        desafio.contextoOrigen,
        desafio.esPublico,
        desafio.planEvaluacionId,
        desafio.tipoDesafio,
        desafio.peso,
        desafio.estado,
        desafio.createdAt);
  }
}
