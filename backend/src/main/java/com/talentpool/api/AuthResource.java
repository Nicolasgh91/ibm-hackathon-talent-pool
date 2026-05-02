package com.talentpool.api;

import com.talentpool.api.dto.AuthResponse;
import com.talentpool.api.dto.LoginRequest;
import com.talentpool.api.dto.RegisterRequest;
import com.talentpool.api.dto.UsuarioResponse;
import com.talentpool.domain.Usuario;
import com.talentpool.infrastructure.security.JwtTokenService;
import com.talentpool.service.AuthService;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import java.util.UUID;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

/**
 * Authentication REST API.
 *
 * <p>Implements: - UC-001: Register user - UC-002: Login - GET /users/me: Get current user info
 */
@Path("/api/v1/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Authentication", description = "User authentication and registration")
public class AuthResource {

  @Inject AuthService authService;

  @Inject JwtTokenService jwtTokenService;

  /**
   * Register a new user (UC-001).
   *
   * @param request registration request
   * @return authentication response with tokens
   */
  @POST
  @Path("/register")
  @PermitAll
  @Operation(summary = "Register new user", description = "Create a new user account (UC-001)")
  @APIResponses({
    @APIResponse(
        responseCode = "201",
        description = "User registered successfully",
        content = @Content(schema = @Schema(implementation = AuthResponse.class))),
    @APIResponse(responseCode = "400", description = "Invalid request or email already exists"),
    @APIResponse(responseCode = "422", description = "Validation error")
  })
  public Response register(@Valid RegisterRequest request) {
    AuthResponse response = authService.register(request);
    return Response.status(Response.Status.CREATED).entity(response).build();
  }

  /**
   * Login user (UC-002).
   *
   * @param request login request
   * @return authentication response with tokens
   */
  @POST
  @Path("/login")
  @PermitAll
  @Operation(summary = "Login user", description = "Authenticate user and generate tokens (UC-002)")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        description = "Login successful",
        content = @Content(schema = @Schema(implementation = AuthResponse.class))),
    @APIResponse(responseCode = "401", description = "Invalid credentials"),
    @APIResponse(responseCode = "422", description = "Validation error")
  })
  public Response login(@Valid LoginRequest request) {
    AuthResponse response = authService.login(request);
    return Response.ok(response).build();
  }

  /**
   * Get current user information.
   *
   * @param securityContext security context with JWT claims
   * @return current user information
   */
  @GET
  @Path("/me")
  @Authenticated
  @Operation(
      summary = "Get current user",
      description = "Get information about the currently authenticated user")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        description = "User information retrieved",
        content = @Content(schema = @Schema(implementation = UsuarioResponse.class))),
    @APIResponse(responseCode = "401", description = "Not authenticated")
  })
  public Response getCurrentUser(@Context SecurityContext securityContext) {
    // Extract user ID from JWT subject claim
    String subject = securityContext.getUserPrincipal().getName();
    UUID userId = jwtTokenService.parseUserId(subject);

    // Find user
    Usuario usuario = Usuario.findByIdOptional(userId);
    if (usuario == null) {
      throw new NotFoundException("User not found");
    }

    return Response.ok(UsuarioResponse.from(usuario)).build();
  }
}

// Made with Bob
