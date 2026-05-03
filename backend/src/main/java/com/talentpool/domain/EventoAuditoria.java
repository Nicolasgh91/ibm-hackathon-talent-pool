package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.vertx.core.json.JsonObject;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * EventoAuditoria entity - append-only audit log row.
 *
 * <p>Insert-only by contract; the table has no updated_at and no service code calls UPDATE/DELETE.
 *
 * <p>Based on product/DATABASE.md §3.8.
 */
@Entity
@Table(name = "eventos_auditoria")
public class EventoAuditoria extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(name = "actor_usuario_id", columnDefinition = "UUID")
  public UUID actorUsuarioId;

  @Column(nullable = false, length = 100)
  public String accion;

  @Column(name = "entidad_tipo", nullable = false, length = 50)
  public String entidadTipo;

  @Column(name = "entidad_id", nullable = false, columnDefinition = "UUID")
  public UUID entidadId;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "metadata_evento", nullable = false, columnDefinition = "jsonb")
  public JsonObject metadataEvento = new JsonObject();

  @Column(name = "ip_origen", length = 45)
  public String ipOrigen;

  @Column(name = "user_agent", columnDefinition = "TEXT")
  public String userAgent;

  @Column(name = "created_at", nullable = false, updatable = false)
  public Instant createdAt;

  @PrePersist
  protected void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
    if (createdAt == null) {
      createdAt = Instant.now();
    }
    if (metadataEvento == null) {
      metadataEvento = new JsonObject();
    }
  }
}
