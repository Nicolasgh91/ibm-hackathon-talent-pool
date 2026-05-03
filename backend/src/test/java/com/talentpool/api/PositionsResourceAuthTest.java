package com.talentpool.api;

import static io.restassured.RestAssured.given;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

@QuarkusTest
class PositionsResourceAuthTest {

  @Test
  void listPositionsRequiresAuthentication() {
    given().when().get("/api/v1/positions").then().statusCode(Response.Status.UNAUTHORIZED.getStatusCode());
  }

  @Test
  void listChallengesRequiresAuthentication() {
    given().when().get("/api/v1/challenges").then().statusCode(Response.Status.UNAUTHORIZED.getStatusCode());
  }
}
