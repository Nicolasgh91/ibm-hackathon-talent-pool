package com.talentpool.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;

@QuarkusTest
class OrganizationsResourceTest {

  @Test
  void testCreateListGetDeleteOrganization() {
    String email = "org-" + UUID.randomUUID() + "@example.com";
    String token = registerAndGetToken(email);

    String id =
        given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + token)
            .body(Map.of("nombre", "Test Org Inc", "descripcion", "For integration test"))
            .when()
            .post("/api/v1/organizations")
            .then()
            .statusCode(201)
            .body("nombre", is("Test Org Inc"))
            .extract()
            .path("id");

    given()
        .header("Authorization", "Bearer " + token)
        .when()
        .get("/api/v1/organizations")
        .then()
        .statusCode(200)
        .body("size()", equalTo(1));

    given()
        .header("Authorization", "Bearer " + token)
        .when()
        .get("/api/v1/organizations/" + id)
        .then()
        .statusCode(200)
        .body("nombre", is("Test Org Inc"));

    given()
        .header("Authorization", "Bearer " + token)
        .when()
        .delete("/api/v1/organizations/" + id)
        .then()
        .statusCode(204);

    given()
        .header("Authorization", "Bearer " + token)
        .when()
        .get("/api/v1/organizations")
        .then()
        .statusCode(200)
        .body("size()", equalTo(0));
  }

  @Test
  void testListOrganizationsRequiresAuth() {
    given().when().get("/api/v1/organizations").then().statusCode(401);
  }

  private static String registerAndGetToken(String email) {
    return given()
        .contentType(ContentType.JSON)
        .body(Map.of("email", email, "nombreCompleto", "Org Tester", "password", "password123"))
        .when()
        .post("/api/v1/auth/register")
        .then()
        .statusCode(201)
        .extract()
        .path("accessToken");
  }
}
