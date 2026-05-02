package com.talentpool.api.dto;

import com.talentpool.domain.Puesto;
import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for job position details.
 *
 * <p>Used by POST /api/v1/positions and GET /api/v1/positions/{id} endpoints.
 */
public record PuestoResponse(
    UUID id,
    UUID organizacionId,
    UUID reclutadorId,
    String titulo,
    String tecnologiaPrincipal,
    String seniority,
    String descripcion,
    String estado,
    Instant createdAt,
    Instant updatedAt
) {
  public static PuestoResponse from(Puesto puesto) {
    return new PuestoResponse(
        puesto.id,
        puesto.organizacionId,
        puesto.reclutadorId,
        puesto.titulo,
        puesto.tecnologiaPrincipal,
        puesto.seniority,
        puesto.descripcion,
        puesto.estado,
        puesto.createdAt,
        puesto.updatedAt
    );
  }
}

// Made with Bob