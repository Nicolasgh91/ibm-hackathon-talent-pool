package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.vertx.core.json.JsonObject;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Evaluacion entity - Candidate evaluation and code submission.
 *
 * <p>Based on product/DATABASE.md §3.4
 */
@Entity
@Table(name = "evaluaciones")
public class Evaluacion extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(name = "desafio_id", nullable = false, columnDefinition = "UUID")
  public UUID desafioId;

  @Column(name = "candidato_id", nullable = false, columnDefinition = "UUID")
  public UUID candidatoId;

  @Column(name = "asignacion_id", columnDefinition = "UUID")
  public UUID asignacionId;

  @Column(name = "codigo_entregado", columnDefinition = "TEXT")
  public String codigoEntregado;

  @Column(length = 50)
  public String lenguaje;

  @Column(name = "puntaje_total", precision = 5, scale = 2)
  public BigDecimal puntajeTotal;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "reporte_feedback", columnDefinition = "jsonb")
  public JsonObject reporteFeedback;

  @Column(nullable = false, length = 20)
  public String contexto; // CORPORATIVO, ACADEMICO, AUTOEVALUACION

  @Column(name = "minutos_empleados")
  public Integer minutosEmpleados;

  @Column(nullable = false, length = 20)
  public String estado = "BORRADOR"; // BORRADOR, EN_CURSO, ENTREGADA, EVALUADA, ANULADA

  @Column(nullable = false)
  public Instant inicio;

  @Column public Instant entrega;

  @Column(name = "evaluado_en")
  public Instant evaluadoEn;

  @Column(name = "created_at", nullable = false, updatable = false)
  public Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  public Instant updatedAt;

  @PrePersist
  protected void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
    if (inicio == null) {
      inicio = Instant.now();
    }
    createdAt = Instant.now();
    updatedAt = Instant.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = Instant.now();
  }

  public static Evaluacion findByIdOptional(UUID id) {
    return findById(id);
  }

  public static List<Evaluacion> findByAsignacion(UUID asignacionId) {
    return list(
        "asignacionId = ?1 and estado = 'EVALUADA' order by puntajeTotal desc", asignacionId);
  }

  public static long countByAsignacionAndCandidate(UUID asignacionId, UUID candidatoId) {
    return count("asignacionId = ?1 and candidatoId = ?2", asignacionId, candidatoId);
  }
}

// Made with Bob
