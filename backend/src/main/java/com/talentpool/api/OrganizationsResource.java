package com.talentpool.api;

import com.talentpool.api.dto.CreateOrganizationRequest;
import com.talentpool.api.dto.OrganizationResponse;
import com.talentpool.infrastructure.security.JwtTokenService;
import com.talentpool.service.OrganizacionService;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("/api/v1/organizations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Organizations", description = "Organization CRUD (UC-004)")
public class OrganizationsResource {

  @Inject OrganizacionService organizacionService;

  @Inject JwtTokenService jwtTokenService;

  @Inject JsonWebToken jwt;

  @GET
  @Authenticated
  @Operation(summary = "List organizations for the current user")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        description = "Organizations returned",
        content = @Content(schema = @Schema(implementation = OrganizationResponse.class))),
    @APIResponse(responseCode = "401", description = "Unauthorized")
  })
  public Response list() {
    UUID userId = jwtTokenService.parseUserId(jwt.getSubject());
    List<OrganizationResponse> list =
        organizacionService.listForUser(userId).stream().map(OrganizationResponse::from).toList();
    return Response.ok(list).build();
  }

  @GET
  @Path("/{id}")
  @Authenticated
  @Operation(summary = "Get organization by id")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        description = "Organization found",
        content = @Content(schema = @Schema(implementation = OrganizationResponse.class))),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "403", description = "Forbidden"),
    @APIResponse(responseCode = "404", description = "Not found")
  })
  public Response get(@PathParam("id") UUID id) {
    UUID userId = jwtTokenService.parseUserId(jwt.getSubject());
    return Response.ok(OrganizationResponse.from(organizacionService.getForUser(userId, id)))
        .build();
  }

  @POST
  @Authenticated
  @Operation(summary = "Create organization")
  @APIResponses({
    @APIResponse(
        responseCode = "201",
        description = "Created",
        content = @Content(schema = @Schema(implementation = OrganizationResponse.class))),
    @APIResponse(responseCode = "400", description = "Validation failed"),
    @APIResponse(responseCode = "401", description = "Unauthorized")
  })
  public Response create(@Valid CreateOrganizationRequest request) {
    UUID userId = jwtTokenService.parseUserId(jwt.getSubject());
    var created = organizacionService.create(userId, request);
    return Response.status(Response.Status.CREATED)
        .entity(OrganizationResponse.from(created))
        .build();
  }

  @PUT
  @Path("/{id}")
  @Authenticated
  @Operation(summary = "Update organization")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        description = "Updated",
        content = @Content(schema = @Schema(implementation = OrganizationResponse.class))),
    @APIResponse(responseCode = "400", description = "Validation failed"),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "403", description = "Forbidden"),
    @APIResponse(responseCode = "404", description = "Not found")
  })
  public Response update(@PathParam("id") UUID id, @Valid CreateOrganizationRequest request) {
    UUID userId = jwtTokenService.parseUserId(jwt.getSubject());
    var updated = organizacionService.update(userId, id, request);
    return Response.ok(OrganizationResponse.from(updated)).build();
  }

  @DELETE
  @Path("/{id}")
  @Authenticated
  @Operation(summary = "Delete organization (OWNER only, no job positions)")
  @APIResponses({
    @APIResponse(responseCode = "204", description = "Deleted"),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "403", description = "Forbidden"),
    @APIResponse(responseCode = "404", description = "Not found"),
    @APIResponse(responseCode = "409", description = "Organization still has positions")
  })
  public Response delete(@PathParam("id") UUID id) {
    UUID userId = jwtTokenService.parseUserId(jwt.getSubject());
    organizacionService.delete(userId, id);
    return Response.noContent().build();
  }
}
