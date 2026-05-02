package com.talentpool.infrastructure.security;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Password hashing service using Argon2id algorithm.
 *
 * <p>Argon2id is the recommended password hashing algorithm (OWASP, 2023). It provides resistance
 * against both side-channel and GPU attacks.
 *
 * <p>Configuration from application.yml: app.security.password.*
 */
@ApplicationScoped
public class PasswordHasher {

  private final Argon2 argon2;
  private final int iterations;
  private final int memoryKb;
  private final int parallelism;

  public PasswordHasher(
      @ConfigProperty(name = "app.security.password.iterations", defaultValue = "3")
          int iterations,
      @ConfigProperty(name = "app.security.password.memory-kb", defaultValue = "65536")
          int memoryKb,
      @ConfigProperty(name = "app.security.password.parallelism", defaultValue = "4")
          int parallelism) {
    this.argon2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);
    this.iterations = iterations;
    this.memoryKb = memoryKb;
    this.parallelism = parallelism;
  }

  /**
   * Hash a password using Argon2id.
   *
   * @param password the plain text password
   * @return the hashed password
   */
  public String hash(String password) {
    try {
      return argon2.hash(iterations, memoryKb, parallelism, password.toCharArray());
    } finally {
      // Wipe password from memory for security
      argon2.wipeArray(password.toCharArray());
    }
  }

  /**
   * Verify a password against a hash.
   *
   * @param hash the stored hash
   * @param password the plain text password to verify
   * @return true if password matches hash
   */
  public boolean verify(String hash, String password) {
    if (hash == null || hash.isBlank()) {
      return false;
    }
    try {
      return argon2.verify(hash, password.toCharArray());
    } catch (IllegalArgumentException e) {
      // Corrupt or non-Argon2 hashes must not become HTTP 500 during login
      return false;
    } finally {
      argon2.wipeArray(password.toCharArray());
    }
  }
}

// Made with Bob
