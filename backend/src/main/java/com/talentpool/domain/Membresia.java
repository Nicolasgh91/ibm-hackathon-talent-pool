package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Membresia entity - User-organization membership with role.
 *
 * <p>Based on product/DATABASE.md §3.1
 */
@Entity
@Table(name = "membresias")
public class Membresia extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(name = "usuario_id", nullable = false, columnDefinition = "UUID")
  public UUID usuarioId;

  @Column(name = "organizacion_id", nullable = false, columnDefinition = "UUID")
  public UUID organizacionId;

  @Column(nullable = false, length = 30)
  public String rol; // OWNER, RECLUTADOR, DOCENTE, ALUMNO, EMPLEADO, ADMIN

  @Column(nullable = false, length = 20)
  public String estado = "ACTIVA"; // ACTIVA, SUSPENDIDA, REVOCADA

  @Column(nullable = false)
  public Instant inicio;

  @Column public Instant fin;

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

  public static Membresia findActiveByUserAndOrg(UUID usuarioId, UUID organizacionId) {
    return find(
            "usuarioId = ?1 and organizacionId = ?2 and estado = 'ACTIVA'",
            usuarioId,
            organizacionId)
        .firstResult();
  }

  public static boolean hasActiveRole(UUID usuarioId, UUID organizacionId, String rol) {
    return count(
            "usuarioId = ?1 and organizacionId = ?2 and rol = ?3 and estado = 'ACTIVA'",
            usuarioId,
            organizacionId,
            rol)
        > 0;
  }
}

// Made with Bob
