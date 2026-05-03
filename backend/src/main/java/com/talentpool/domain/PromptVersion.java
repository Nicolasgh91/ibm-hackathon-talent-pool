package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.vertx.core.json.JsonArray;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * PromptVersion entity - LLM prompt versioning for reproducibility.
 *
 * <p>Based on product/DATABASE.md §3.8
 */
@Entity
@Table(name = "prompt_versiones")
public class PromptVersion extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(nullable = false, length = 100)
  public String nombre;

  @Column(name = "version_semver", nullable = false, length = 20)
  public String versionSemver;

  @Column(nullable = false, columnDefinition = "TEXT")
  public String plantilla;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "variables_esperadas", nullable = false, columnDefinition = "jsonb")
  public JsonArray variablesEsperadas = new JsonArray();

  @Column(nullable = false, length = 20)
  public String estado = "EXPERIMENTAL"; // EXPERIMENTAL, ACTIVA, DEPRECADA

  @Column(name = "notas_cambio", columnDefinition = "TEXT")
  public String notasCambio;

  @Column(name = "created_at", nullable = false, updatable = false)
  public Instant createdAt;

  @PrePersist
  protected void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
    createdAt = Instant.now();
  }

  public static PromptVersion findActiveByName(String nombre) {
    return find("nombre = ?1 and estado = 'ACTIVA'", nombre).firstResult();
  }

  public static PromptVersion findByIdOptional(UUID id) {
    return findById(id);
  }
}

// Made with Bob
