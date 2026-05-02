package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.vertx.core.json.JsonObject;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * PerfilTalento entity - Public talent profile for candidates.
 *
 * <p>Based on product/DATABASE.md §3.6
 */
@Entity
@Table(name = "perfiles_talento")
public class PerfilTalento extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(name = "usuario_id", nullable = false, unique = true, columnDefinition = "UUID")
  public UUID usuarioId;

  @Column(length = 200)
  public String titular;

  @Column(columnDefinition = "TEXT")
  public String bio;

  @Column(nullable = false, length = 20)
  public String disponibilidad = "PASIVA"; // ACTIVA, PASIVA, NO_DISPONIBLE

  @Column(name = "visible_publico", nullable = false)
  public Boolean visiblePublico = false;

  @Column(name = "visible_reclutadores", nullable = false)
  public Boolean visibleReclutadores = true;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "preferencias_contacto", nullable = false, columnDefinition = "jsonb")
  public JsonObject preferenciasContacto = new JsonObject();

  @Column(length = 200)
  public String ubicacion;

  @Column(name = "cv_url", columnDefinition = "TEXT")
  public String cvUrl;

  @Column(name = "linkedin_url", columnDefinition = "TEXT")
  public String linkedinUrl;

  @Column(name = "github_url", columnDefinition = "TEXT")
  public String githubUrl;

  @Column(name = "created_at", nullable = false, updatable = false)
  public Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  public Instant updatedAt;

  @PrePersist
  protected void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
    createdAt = Instant.now();
    updatedAt = Instant.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = Instant.now();
  }

  public static PerfilTalento findByUsuario(UUID usuarioId) {
    return find("usuarioId", usuarioId).firstResult();
  }
}

// Made with Bob