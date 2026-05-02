package com.talentpool;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

/**
 * Minimal health check test to verify Quarkus setup.
 *
 * <p>Phase 0 requirement: at least one passing @QuarkusTest.
 */
@QuarkusTest
public class HealthCheckTest {

  @Test
  public void testLivenessEndpoint() {
    given().when().get("/q/health/live").then().statusCode(200).body("status", is("UP"));
  }

  @Test
  public void testReadinessEndpoint() {
    given().when().get("/q/health/ready").then().statusCode(200).body("status", is("UP"));
  }

  @Test
  public void testMetricsEndpoint() {
    given().when().get("/q/metrics").then().statusCode(200);
  }
}

// Made with Bob
