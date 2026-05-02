package com.talentpool.infrastructure.security;

import com.talentpool.domain.Usuario;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * JWT token generation service using SmallRye JWT.
 *
 * <p>Generates access and refresh tokens for authenticated users.
 */
@ApplicationScoped
public class JwtTokenService {

  @ConfigProperty(name = "mp.jwt.verify.issuer", defaultValue = "talent-pool-api")
  String issuer;

  @ConfigProperty(name = "smallrye.jwt.sign.key.location")
  String privateKeyLocation;

  private static final Duration ACCESS_TOKEN_DURATION = Duration.ofMinutes(15);
  private static final Duration REFRESH_TOKEN_DURATION = Duration.ofDays(7);

  /**
   * Generate access token for user.
   *
   * @param usuario the user
   * @return JWT access token
   */
  public String generateAccessToken(Usuario usuario) {
    Instant now = Instant.now();
    return Jwt.issuer(issuer)
        .upn(usuario.email)
        .subject(usuario.id.toString())
        .groups(Set.of("USER"))
        .claim("email", usuario.email)
        .claim("nombre", usuario.nombreCompleto)
        .claim("email_verificado", usuario.emailVerificado)
        .issuedAt(now)
        .expiresAt(now.plus(ACCESS_TOKEN_DURATION))
        .sign();
  }

  /**
   * Generate refresh token for user.
   *
   * @param usuario the user
   * @return JWT refresh token
   */
  public String generateRefreshToken(Usuario usuario) {
    Instant now = Instant.now();
    return Jwt.issuer(issuer)
        .upn(usuario.email)
        .subject(usuario.id.toString())
        .groups(Set.of("REFRESH"))
        .claim("token_type", "refresh")
        .issuedAt(now)
        .expiresAt(now.plus(REFRESH_TOKEN_DURATION))
        .sign();
  }

  /**
   * Get access token expiration time in seconds.
   *
   * @return expiration time in seconds
   */
  public long getAccessTokenExpirationSeconds() {
    return ACCESS_TOKEN_DURATION.getSeconds();
  }

  /**
   * Parse user ID from JWT subject claim.
   *
   * @param subject the JWT subject
   * @return the user UUID
   */
  public UUID parseUserId(String subject) {
    return UUID.fromString(subject);
  }
}

// Made with Bob
