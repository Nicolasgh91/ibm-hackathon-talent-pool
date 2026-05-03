package com.talentpool.api.dto;

import com.talentpool.domain.Puesto;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.util.List;
import java.util.Map;
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
    List<String> herramientas,
    List<Map<String, Object>> skillsTecnicas,
    List<String> skillsBlandas,
    Boolean roadmapPublicoHabilitado,
    String estado,
    Instant createdAt,
    Instant updatedAt) {

  public static PuestoResponse from(Puesto puesto) {
    return new PuestoResponse(
        puesto.id,
        puesto.organizacionId,
        puesto.reclutadorId,
        puesto.titulo,
        puesto.tecnologiaPrincipal,
        puesto.seniority,
        puesto.descripcion,
        toStringList(puesto.herramientas),
        toMapList(puesto.skillsTecnicas),
        toStringList(puesto.skillsBlandas),
        puesto.roadmapPublicoHabilitado,
        puesto.estado,
        puesto.createdAt,
        puesto.updatedAt);
  }

  private static List<String> toStringList(JsonArray array) {
    if (array == null) {
      return List.of();
    }
    return array.stream().filter(o -> o instanceof String).map(Object::toString).toList();
  }

  @SuppressWarnings("unchecked")
  private static List<Map<String, Object>> toMapList(JsonArray array) {
    if (array == null) {
      return List.of();
    }
    return array.stream().filter(o -> o instanceof Map).map(o -> (Map<String, Object>) o).toList();
  }
}
