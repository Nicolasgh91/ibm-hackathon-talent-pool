package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Organizacion entity - Company or educational institution.
 *
 * <p>Based on product/DATABASE.md §3.1
 */
@Entity
@Table(name = "organizaciones")
public class Organizacion extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(nullable = false, length = 200)
  public String nombre;

  @Column(nullable = false, length = 20)
  public String tipo; // EMPRESA, INSTITUCION

  @Column(nullable = false, length = 20)
  public String plan = "FREE"; // FREE, PRO, ENTERPRISE

  @Column(name = "dominio_email", length = 255)
  public String dominioEmail;

  @Column(name = "logo_url", columnDefinition = "TEXT")
  public String logoUrl;

  @Column(columnDefinition = "TEXT")
  public String descripcion;

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

  public static Organizacion findByIdOptional(UUID id) {
    return findById(id);
  }
}

// Made with Bob
