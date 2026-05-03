package com.talentpool;

import com.talentpool.infrastructure.security.PasswordHasher;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

/**
 * Utility test to generate Argon2 password hashes for seed data. Run with: ./mvnw test
 * -Dtest=GeneratePasswordHash
 */
@QuarkusTest
public class GeneratePasswordHash {

  @Test
  public void generateDemoPasswordHash() {
    PasswordHasher hasher = new PasswordHasher(3, 65536, 4);
    String hash = hasher.hash("Demo123!");
    System.out.println("\n===========================================");
    System.out.println("Password: Demo123!");
    System.out.println("Hash: " + hash);
    System.out.println("===========================================\n");
  }
}

// Made with Bob
