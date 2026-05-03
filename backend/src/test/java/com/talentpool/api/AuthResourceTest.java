package com.talentpool.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

import com.talentpool.api.dto.AuthResponse;
import com.talentpool.api.dto.LoginRequest;
import com.talentpool.api.dto.RegisterRequest;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

/**
 * Integration tests for authentication endpoints.
 *
 * <p>Tests UC-001 (Register) and UC-002 (Login).
 */
@QuarkusTest
public class AuthResourceTest {

  @Test
  public void testRegisterSuccess() {
    RegisterRequest request = new RegisterRequest("test@example.com", "Test User", "password123");

    given()
        .contentType(ContentType.JSON)
        .body(request)
        .when()
        .post("/api/v1/auth/register")
        .then()
        .statusCode(Response.Status.CREATED.getStatusCode())
        .body("accessToken", notNullValue())
        .body("refreshToken", notNullValue())
        .body("tokenType", is("Bearer"))
        .body("expiresIn", notNullValue())
        .body("usuario.email", is("test@example.com"))
        .body("usuario.nombreCompleto", is("Test User"))
        .body("usuario.emailVerificado", is(false));
  }

  @Test
  public void testRegisterDuplicateEmail() {
    RegisterRequest request =
        new RegisterRequest("duplicate@example.com", "Duplicate User", "password123");

    // First registration should succeed
    given()
        .contentType(ContentType.JSON)
        .body(request)
        .when()
        .post("/api/v1/auth/register")
        .then()
        .statusCode(Response.Status.CREATED.getStatusCode());

    // Second registration with same email should fail
    given()
        .contentType(ContentType.JSON)
        .body(request)
        .when()
        .post("/api/v1/auth/register")
        .then()
        .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
  }

  @Test
  public void testRegisterInvalidEmail() {
    RegisterRequest request = new RegisterRequest("invalid-email", "Test User", "password123");

    given()
        .contentType(ContentType.JSON)
        .body(request)
        .when()
        .post("/api/v1/auth/register")
        .then()
        .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
  }

  @Test
  public void testRegisterShortPassword() {
    RegisterRequest request = new RegisterRequest("test2@example.com", "Test User", "short");

    given()
        .contentType(ContentType.JSON)
        .body(request)
        .when()
        .post("/api/v1/auth/register")
        .then()
        .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
  }

  @Test
  public void testLoginSuccess() {
    // First register a user
    RegisterRequest registerRequest =
        new RegisterRequest("login@example.com", "Login User", "password123");

    given()
        .contentType(ContentType.JSON)
        .body(registerRequest)
        .when()
        .post("/api/v1/auth/register")
        .then()
        .statusCode(Response.Status.CREATED.getStatusCode());

    // Then login
    LoginRequest loginRequest = new LoginRequest("login@example.com", "password123");

    given()
        .contentType(ContentType.JSON)
        .body(loginRequest)
        .when()
        .post("/api/v1/auth/login")
        .then()
        .statusCode(Response.Status.OK.getStatusCode())
        .body("accessToken", notNullValue())
        .body("refreshToken", notNullValue())
        .body("tokenType", is("Bearer"))
        .body("usuario.email", is("login@example.com"));
  }

  @Test
  public void testLoginInvalidPassword() {
    // First register a user
    RegisterRequest registerRequest =
        new RegisterRequest("wrongpass@example.com", "Wrong Pass User", "correctpassword");

    given()
        .contentType(ContentType.JSON)
        .body(registerRequest)
        .when()
        .post("/api/v1/auth/register")
        .then()
        .statusCode(Response.Status.CREATED.getStatusCode());

    // Try to login with wrong password
    LoginRequest loginRequest = new LoginRequest("wrongpass@example.com", "wrongpassword");

    given()
        .contentType(ContentType.JSON)
        .body(loginRequest)
        .when()
        .post("/api/v1/auth/login")
        .then()
        .statusCode(Response.Status.UNAUTHORIZED.getStatusCode());
  }

  @Test
  public void testLoginNonExistentUser() {
    LoginRequest loginRequest = new LoginRequest("nonexistent@example.com", "password123");

    given()
        .contentType(ContentType.JSON)
        .body(loginRequest)
        .when()
        .post("/api/v1/auth/login")
        .then()
        .statusCode(Response.Status.UNAUTHORIZED.getStatusCode());
  }

  @Test
  public void testGetCurrentUserAuthenticated() {
    // Register and get token
    RegisterRequest registerRequest =
        new RegisterRequest("currentuser@example.com", "Current User", "password123");

    AuthResponse authResponse =
        given()
            .contentType(ContentType.JSON)
            .body(registerRequest)
            .when()
            .post("/api/v1/auth/register")
            .then()
            .statusCode(Response.Status.CREATED.getStatusCode())
            .extract()
            .as(AuthResponse.class);

    // Get current user with token
    given()
        .header("Authorization", "Bearer " + authResponse.accessToken())
        .when()
        .get("/api/v1/auth/me")
        .then()
        .statusCode(Response.Status.OK.getStatusCode())
        .body("email", is("currentuser@example.com"))
        .body("nombreCompleto", is("Current User"))
        .body("emailVerificado", is(false));
  }

  @Test
  public void testGetCurrentUserUnauthenticated() {
    given()
        .when()
        .get("/api/v1/auth/me")
        .then()
        .statusCode(Response.Status.UNAUTHORIZED.getStatusCode());
  }
}

// Made with Bob
