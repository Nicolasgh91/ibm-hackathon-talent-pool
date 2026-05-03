package com.talentpool.api.dto;

import com.talentpool.domain.Organizacion;
import java.time.Instant;
import java.util.UUID;

/** Response for organization CRUD (matches frontend {@code Organization} shape). */
public record OrganizationResponse(
    UUID id,
    String nombre,
    String descripcion,
    String tipo,
    String plan,
    Instant createdAt,
    Instant updatedAt) {

  public static OrganizationResponse from(Organizacion o) {
    return new OrganizationResponse(
        o.id, o.nombre, o.descripcion, o.tipo, o.plan, o.createdAt, o.updatedAt);
  }
}
