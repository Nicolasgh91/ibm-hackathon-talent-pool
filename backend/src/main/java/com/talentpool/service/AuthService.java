package com.talentpool.service;

import com.talentpool.api.dto.AuthResponse;
import com.talentpool.api.dto.LoginRequest;
import com.talentpool.api.dto.RegisterRequest;
import com.talentpool.domain.Usuario;
import com.talentpool.infrastructure.security.JwtTokenService;
import com.talentpool.infrastructure.security.PasswordHasher;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotAuthorizedException;

/**
 * Authentication service implementing UC-001 (Register) and UC-002 (Login).
 *
 * <p>Handles user registration with Argon2id password hashing and JWT-based authentication.
 */
@ApplicationScoped
public class AuthService {

  @Inject PasswordHasher passwordHasher;

  @Inject JwtTokenService jwtTokenService;

  /**
   * Register a new user (UC-001).
   *
   * <p>Acceptance Criteria: - Email must be unique (case-insensitive) - Password hashed with
   * Argon2id - Returns JWT tokens - User created with email_verificado = false
   *
   * @param request registration request
   * @return authentication response with tokens
   * @throws BadRequestException if email already exists
   */
  @Transactional
  public AuthResponse register(RegisterRequest request) {
    Log.infof("Attempting to register user with email: %s", request.email());

    // Check if email already exists (case-insensitive)
    if (Usuario.existsByEmail(request.email())) {
      Log.warnf("Registration failed: email already exists: %s", request.email());
      throw new BadRequestException("Email already registered");
    }

    // Create new user
    Usuario usuario = new Usuario();
    usuario.email = request.email().toLowerCase().trim();
    usuario.nombreCompleto = request.nombreCompleto().trim();
    usuario.passwordHash = passwordHasher.hash(request.password());
    usuario.emailVerificado = false; // Email verification in Phase 3

    // Persist user
    usuario.persist();

    Log.infof("User registered successfully: %s (ID: %s)", usuario.email, usuario.id);

    // Generate tokens
    String accessToken = jwtTokenService.generateAccessToken(usuario);
    String refreshToken = jwtTokenService.generateRefreshToken(usuario);

    return new AuthResponse(
        accessToken,
        refreshToken,
        "Bearer",
        jwtTokenService.getAccessTokenExpirationSeconds(),
        new AuthResponse.UsuarioInfo(
            usuario.id, usuario.email, usuario.nombreCompleto, usuario.emailVerificado));
  }

  /**
   * Authenticate user and generate tokens (UC-002).
   *
   * <p>Acceptance Criteria: - Email lookup is case-insensitive - Password verified with Argon2id -
   * Returns JWT tokens on success - Throws 401 on invalid credentials
   *
   * @param request login request
   * @return authentication response with tokens
   * @throws NotAuthorizedException if credentials are invalid
   */
  @Transactional
  public AuthResponse login(LoginRequest request) {
    Log.infof("Login attempt for email: %s", request.email());

    // Find user by email (case-insensitive)
    Usuario usuario = Usuario.findByEmail(request.email());

    if (usuario == null) {
      Log.warnf("Login failed: user not found: %s", request.email());
      throw new NotAuthorizedException("Invalid email or password");
    }

    // Verify password
    if (!passwordHasher.verify(usuario.passwordHash, request.password())) {
      Log.warnf("Login failed: invalid password for user: %s", request.email());
      throw new NotAuthorizedException("Invalid email or password");
    }

    Log.infof("User logged in successfully: %s (ID: %s)", usuario.email, usuario.id);

    // Generate tokens
    String accessToken = jwtTokenService.generateAccessToken(usuario);
    String refreshToken = jwtTokenService.generateRefreshToken(usuario);

    return new AuthResponse(
        accessToken,
        refreshToken,
        "Bearer",
        jwtTokenService.getAccessTokenExpirationSeconds(),
        new AuthResponse.UsuarioInfo(
            usuario.id, usuario.email, usuario.nombreCompleto, usuario.emailVerificado));
  }
}

// Made with Bob
