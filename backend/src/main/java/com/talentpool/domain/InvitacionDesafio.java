package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * InvitacionDesafio entity - Challenge invitation sent to a candidate.
 *
 * <p>Based on product/DATABASE.md §3.4
 */
@Entity
@Table(name = "invitaciones_desafio")
public class InvitacionDesafio extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(name = "asignacion_id", nullable = false, columnDefinition = "UUID")
  public UUID asignacionId;

  @Column(name = "emisor_usuario_id", nullable = false, columnDefinition = "UUID")
  public UUID emisorUsuarioId;

  @Column(name = "email_invitado", nullable = false, columnDefinition = "CITEXT")
  public String emailInvitado;

  @Column(name = "usuario_invitado_id", columnDefinition = "UUID")
  public UUID usuarioInvitadoId;

  @Column(nullable = false, length = 64, unique = true)
  public String token;

  @Column(nullable = false, length = 20)
  public String estado = "PENDIENTE"; // PENDIENTE, ACEPTADA, EXPIRADA, REVOCADA

  @Column(name = "expira_en", nullable = false)
  public Instant expiraEn;

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

  public static InvitacionDesafio findByToken(String token) {
    return find("token", token).firstResult();
  }

  public static InvitacionDesafio findByIdOptional(UUID id) {
    return findById(id);
  }

  public boolean isValid() {
    return "PENDIENTE".equals(estado) && Instant.now().isBefore(expiraEn);
  }

  public boolean isExpired() {
    return Instant.now().isAfter(expiraEn);
  }
}

// Made with Bob