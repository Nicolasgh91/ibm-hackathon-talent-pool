package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Usuario entity - Core user account for authentication and identity.
 *
 * <p>Represents a physical person in the system. A user can have multiple roles across different
 * organizations through the Membresia entity.
 *
 * <p>Based on product/DATABASE.md §3.1
 */
@Entity
@Table(name = "usuarios")
public class Usuario extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(nullable = false, unique = true, columnDefinition = "CITEXT")
  public String email;

  @Column(name = "nombre_completo", nullable = false, length = 200)
  public String nombreCompleto;

  @Column(name = "password_hash", nullable = false, columnDefinition = "TEXT")
  public String passwordHash;

  @Column(name = "foto_url", columnDefinition = "TEXT")
  public String fotoUrl;

  @Column(name = "email_verificado", nullable = false)
  public Boolean emailVerificado = false;

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

  /**
   * Find user by email (case-insensitive).
   *
   * @param email the email address
   * @return the user or null if not found
   */
  public static Usuario findByEmail(String email) {
    return find("LOWER(email) = LOWER(?1)", email).firstResult();
  }

  /**
   * Check if email already exists (case-insensitive).
   *
   * @param email the email address
   * @return true if email exists
   */
  public static boolean existsByEmail(String email) {
    return count("LOWER(email) = LOWER(?1)", email) > 0;
  }

  /**
   * Find user by ID.
   *
   * @param id the user UUID
   * @return the user or null if not found
   */
  public static Usuario findByIdOptional(UUID id) {
    return findById(id);
  }
}

// Made with Bob
