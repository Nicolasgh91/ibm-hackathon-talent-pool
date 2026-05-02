package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * AsignacionDesafio entity - Challenge assignment to a specific context.
 *
 * <p>Based on product/DATABASE.md §3.4
 */
@Entity
@Table(name = "asignaciones_desafio")
public class AsignacionDesafio extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(name = "desafio_id", nullable = false, columnDefinition = "UUID")
  public UUID desafioId;

  @Column(name = "puesto_id", columnDefinition = "UUID")
  public UUID puestoId;

  @Column(name = "curso_id", columnDefinition = "UUID")
  public UUID cursoId;

  @Column(nullable = false, length = 20)
  public String tipo; // PUESTO, CURSO, PUBLICO

  @Column(name = "fecha_apertura", nullable = false)
  public Instant fechaApertura;

  @Column(name = "fecha_cierre")
  public Instant fechaCierre;

  @Column(name = "max_intentos", nullable = false)
  public Integer maxIntentos = 1;

  @Column(name = "created_at", nullable = false, updatable = false)
  public Instant createdAt;

  @PrePersist
  protected void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
    if (fechaApertura == null) {
      fechaApertura = Instant.now();
    }
    createdAt = Instant.now();
  }

  public static AsignacionDesafio findByIdOptional(UUID id) {
    return findById(id);
  }

  public static AsignacionDesafio findByPuesto(UUID puestoId) {
    return find("puestoId", puestoId).firstResult();
  }

  public boolean isOpen() {
    Instant now = Instant.now();
    return now.isAfter(fechaApertura) && (fechaCierre == null || now.isBefore(fechaCierre));
  }
}

// Made with Bob