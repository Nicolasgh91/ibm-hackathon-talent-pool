package com.talentpool.api.dto;

import java.util.UUID;

/**
 * Response DTO for authentication operations (UC-001, UC-002).
 *
 * <p>Contains JWT tokens and basic user information.
 *
 * @param accessToken JWT access token (short-lived, ~15 minutes)
 * @param refreshToken JWT refresh token (long-lived, ~7 days)
 * @param tokenType Always "Bearer"
 * @param expiresIn Access token expiration time in seconds
 * @param usuario Basic user information
 */
public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    Long expiresIn,
    UsuarioInfo usuario) {

  /**
   * Basic user information included in auth response.
   *
   * @param id User UUID
   * @param email User email
   * @param nombreCompleto User full name
   * @param emailVerificado Email verification status
   */
  public record UsuarioInfo(
      UUID id, String email, String nombreCompleto, Boolean emailVerificado) {}
}

// Made with Bob
