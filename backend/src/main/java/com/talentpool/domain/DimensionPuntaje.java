package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * DimensionPuntaje entity - Multi-dimensional score breakdown.
 *
 * <p>Based on product/DATABASE.md §3.4
 */
@Entity
@Table(name = "dimensiones_puntaje")
public class DimensionPuntaje extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(name = "evaluacion_id", nullable = false, columnDefinition = "UUID")
  public UUID evaluacionId;

  @Column(nullable = false, length = 50)
  public String nombre; // LOGICA, EFICIENCIA, ESTILO, PRACTICAS

  @Column(nullable = false, precision = 5, scale = 2)
  public BigDecimal puntaje;

  @Column(nullable = false, precision = 3, scale = 2)
  public BigDecimal peso;

  @Column(columnDefinition = "TEXT")
  public String justificacion;

  @PrePersist
  protected void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
  }

  public static List<DimensionPuntaje> findByEvaluacion(UUID evaluacionId) {
    return list("evaluacionId", evaluacionId);
  }
}

// Made with Bob