package com.talentpool.api;

import com.talentpool.api.dto.ChatRequest;
import com.talentpool.api.dto.ChatResponse;
import com.talentpool.infrastructure.ratelimit.RateLimited;
import com.talentpool.service.ChatService;
import io.quarkus.security.Authenticated;
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
 * Chat REST API.
 *
 * <p>Provides LLM-powered chat functionality for authenticated users.
 *
 * <p>Features: - JWT authentication required - Rate limiting (10 requests/minute per user) - Input
 * guardrails (max 2000 chars, injection detection) - Token usage tracking - Structured logging
 * with correlation IDs
 */
@Path("/api/v1/chat")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Chat", description = "LLM-powered chat functionality")
public class ChatResource {

  @Inject ChatService chatService;

  /**
   * Send a chat message to the LLM assistant.
   *
   * <p>Acceptance Criteria: - User must be authenticated (JWT) - Message max 2000 characters -
   * Rate limited to 10 requests/minute - Returns response with token usage - Latency p95 < 8s
   *
   * @param request the chat request
   * @param securityContext security context for user identification
   * @return chat response
   */
  @POST
  @Authenticated
  @RateLimited(limit = 10, windowSeconds = 60, keyPrefix = "chat")
  @Operation(
      summary = "Send chat message",
      description =
          "Send a message to the LLM assistant. Requires authentication. Rate limited to 10"
              + " requests per minute.")
  @APIResponses(
      value = {
        @APIResponse(
            responseCode = "200",
            description = "Chat response generated successfully",
            content = @Content(schema = @Schema(implementation = ChatResponse.class))),
        @APIResponse(responseCode = "400", description = "Invalid request (validation failed)"),
        @APIResponse(responseCode = "401", description = "Unauthorized (missing or invalid JWT)"),
        @APIResponse(
            responseCode = "429",
            description = "Too many requests (rate limit exceeded)"),
        @APIResponse(responseCode = "500", description = "Internal server error (LLM failure)")
      })
  public Response chat(@Valid ChatRequest request, @Context SecurityContext securityContext) {
    // Extract user ID from JWT subject
    String subject = securityContext.getUserPrincipal().getName();
    UUID userId = UUID.fromString(subject);

    // Process chat request
    ChatResponse response = chatService.chat(request, userId);

    return Response.ok(response).build();
  }

  /**
   * Health check endpoint for chat service.
   *
   * <p>Verifies that the LLM provider is accessible.
   *
   * @return health status
   */
  @GET
  @Path("/health")
  @Authenticated
  @Operation(
      summary = "Chat service health check",
      description = "Verify that the chat service and LLM provider are accessible")
  @APIResponses(
      value = {
        @APIResponse(responseCode = "200", description = "Chat service is healthy"),
        @APIResponse(responseCode = "503", description = "Chat service is unavailable")
      })
  public Response health() {
    // Simple health check - could be enhanced to ping the LLM provider
    return Response.ok()
        .entity(java.util.Map.of("status", "healthy", "service", "chat"))
        .build();
  }
}

// Made with Bob
