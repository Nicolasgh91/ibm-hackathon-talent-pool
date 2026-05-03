package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * EvaluacionVersion entity - per-evaluation code snapshot used for UC-017 autosave and final
 * delivery reconstruction.
 *
 * <p>Based on product/DATABASE.md §3.4 (table evaluaciones_versiones).
 */
@Entity
@Table(name = "evaluaciones_versiones")
public class EvaluacionVersion extends PanacheEntityBase {

  /** Snapshot taken at the very start of a session. */
  public static final String TIPO_INICIO = "INICIO";

  /** Periodic snapshot (every ~30s or on significant change). */
  public static final String TIPO_AUTOSAVE = "AUTOSAVE";

  /** Snapshot persisted when the candidate hits "submit". */
  public static final String TIPO_ENTREGA = "ENTREGA";

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(name = "evaluacion_id", nullable = false, columnDefinition = "UUID")
  public UUID evaluacionId;

  @Column(name = "codigo_snapshot", nullable = false, columnDefinition = "TEXT")
  public String codigoSnapshot;

  @Column(name = "numero_version", nullable = false)
  public Integer numeroVersion;

  @Column(name = "tipo_evento", nullable = false, length = 20)
  public String tipoEvento;

  @Column(name = "created_at", nullable = false, updatable = false)
  public Instant createdAt;

  @PrePersist
  protected void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
    createdAt = Instant.now();
  }

  // -- queries --------------------------------------------------------------

  public static List<EvaluacionVersion> findByEvaluacionOrderByVersion(UUID evaluacionId) {
    return list("evaluacionId = ?1 order by numeroVersion asc", evaluacionId);
  }

  public static EvaluacionVersion latestByEvaluacion(UUID evaluacionId) {
    return find("evaluacionId = ?1 order by numeroVersion desc", evaluacionId).firstResult();
  }

  /**
   * Compute the next version number for a given evaluation. Caller must hold a transaction; the
   * unique index {@code idx_evver_unico(evaluacion_id, numero_version)} prevents duplicates under
   * concurrent inserts (the loser will see a constraint violation and may retry).
   */
  public static int nextVersionNumber(UUID evaluacionId) {
    Number max =
        getEntityManager()
            .createQuery(
                "SELECT MAX(v.numeroVersion) FROM EvaluacionVersion v WHERE v.evaluacionId = :id",
                Number.class)
            .setParameter("id", evaluacionId)
            .getSingleResult();
    return max == null ? 1 : max.intValue() + 1;
  }
}
