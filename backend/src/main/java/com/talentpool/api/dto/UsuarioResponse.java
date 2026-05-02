package com.talentpool.api.dto;

import com.talentpool.domain.Usuario;
import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for user information (GET /api/v1/users/me).
 *
 * @param id User UUID
 * @param email User email
 * @param nombreCompleto User full name
 * @param fotoUrl Profile photo URL (optional)
 * @param emailVerificado Email verification status
 * @param createdAt Account creation timestamp
 */
public record UsuarioResponse(
    UUID id,
    String email,
    String nombreCompleto,
    String fotoUrl,
    Boolean emailVerificado,
    Instant createdAt) {

  /**
   * Create UsuarioResponse from Usuario entity.
   *
   * @param usuario the usuario entity
   * @return the response DTO
   */
  public static UsuarioResponse from(Usuario usuario) {
    return new UsuarioResponse(
        usuario.id,
        usuario.email,
        usuario.nombreCompleto,
        usuario.fotoUrl,
        usuario.emailVerificado,
        usuario.createdAt);
  }
}

// Made with Bob
