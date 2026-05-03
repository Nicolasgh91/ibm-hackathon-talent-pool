package com.talentpool.api;

import com.talentpool.api.dto.CreatePuestoRequest;
import com.talentpool.api.dto.EvaluacionResponse.RankingResponse;
import com.talentpool.api.dto.PuestoResponse;
import com.talentpool.api.dto.UpdatePuestoRequest;
import com.talentpool.domain.Puesto;
import com.talentpool.infrastructure.security.JwtTokenService;
import com.talentpool.service.EvaluacionService;
import com.talentpool.service.PuestoService;
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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import java.util.List;
import java.util.UUID;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("/api/v1/positions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Positions", description = "Job positions and candidate rankings")
public class PositionsResource {

  @Inject PuestoService puestoService;
  @Inject EvaluacionService evaluacionService;
  @Inject JwtTokenService jwtTokenService;

  @GET
  @Authenticated
  @Operation(summary = "List job positions")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        description = "Positions listed",
        content = @Content(schema = @Schema(implementation = PuestoResponse.class))),
    @APIResponse(responseCode = "401", description = "Unauthorized")
  })
  public Response list(
      @QueryParam("organizacionId") UUID organizacionId,
      @Context SecurityContext securityContext) {
    UUID userId = jwtTokenService.parseUserId(securityContext.getUserPrincipal().getName());
    UUID orgFilter = organizacionId != null ? organizacionId : puestoService.primaryOrganizationForUser(userId);
    if (organizacionId != null) {
      puestoService.validateUserOrganizationAccess(userId, organizacionId);
    }
    List<Puesto> list = puestoService.findByOrganizacion(orgFilter);
    return Response.ok(list.stream().map(PuestoResponse::from).toList()).build();
  }

  @GET
  @Path("/{id}")
  @Authenticated
  @Operation(summary = "Get job position by id")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        content = @Content(schema = @Schema(implementation = PuestoResponse.class))),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "404", description = "Position not found")
  })
  public Response getById(@PathParam("id") UUID puestoId, @Context SecurityContext securityContext) {
    UUID userId = jwtTokenService.parseUserId(securityContext.getUserPrincipal().getName());
    puestoService.validateUserAccess(userId, puestoId);
    Puesto puesto = puestoService.findById(puestoId);
    return Response.ok(PuestoResponse.from(puesto)).build();
  }

  @POST
  @Authenticated
  @Operation(summary = "Create job position")
  @APIResponses({
    @APIResponse(
        responseCode = "201",
        description = "Position created",
        content = @Content(schema = @Schema(implementation = PuestoResponse.class))),
    @APIResponse(responseCode = "400", description = "Invalid request"),
    @APIResponse(responseCode = "401", description = "Unauthorized")
  })
  public Response create(
      @Valid CreatePuestoRequest request, @Context SecurityContext securityContext) {
    UUID userId = jwtTokenService.parseUserId(securityContext.getUserPrincipal().getName());
    Puesto puesto = puestoService.create(request, userId);
    return Response.status(Response.Status.CREATED).entity(PuestoResponse.from(puesto)).build();
  }

  @PUT
  @Path("/{id}")
  @Authenticated
  @Operation(summary = "Update job position")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        content = @Content(schema = @Schema(implementation = PuestoResponse.class))),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "404", description = "Position not found")
  })
  public Response update(
      @PathParam("id") UUID puestoId,
      @Valid UpdatePuestoRequest request,
      @Context SecurityContext securityContext) {
    UUID userId = jwtTokenService.parseUserId(securityContext.getUserPrincipal().getName());
    Puesto puesto = puestoService.update(puestoId, request, userId);
    return Response.ok(PuestoResponse.from(puesto)).build();
  }

  @DELETE
  @Path("/{id}")
  @Authenticated
  @Operation(summary = "Delete job position")
  @APIResponses({
    @APIResponse(responseCode = "204", description = "Deleted"),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "404", description = "Position not found")
  })
  public Response delete(@PathParam("id") UUID puestoId, @Context SecurityContext securityContext) {
    UUID userId = jwtTokenService.parseUserId(securityContext.getUserPrincipal().getName());
    puestoService.delete(puestoId, userId);
    return Response.noContent().build();
  }

  @POST
  @Path("/{id}/activate")
  @Authenticated
  @Operation(summary = "Activate / open job position")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        content = @Content(schema = @Schema(implementation = PuestoResponse.class))),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "404", description = "Position not found")
  })
  public Response activate(@PathParam("id") UUID puestoId, @Context SecurityContext securityContext) {
    UUID userId = jwtTokenService.parseUserId(securityContext.getUserPrincipal().getName());
    Puesto puesto = puestoService.activate(puestoId, userId);
    return Response.ok(PuestoResponse.from(puesto)).build();
  }

  @POST
  @Path("/{id}/deactivate")
  @Authenticated
  @Operation(summary = "Pause job position")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        content = @Content(schema = @Schema(implementation = PuestoResponse.class))),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "404", description = "Position not found")
  })
  public Response deactivate(@PathParam("id") UUID puestoId, @Context SecurityContext securityContext) {
    UUID userId = jwtTokenService.parseUserId(securityContext.getUserPrincipal().getName());
    Puesto puesto = puestoService.deactivate(puestoId, userId);
    return Response.ok(PuestoResponse.from(puesto)).build();
  }

  @GET
  @Path("/{id}/ranking")
  @Authenticated
  @Operation(summary = "Get ranking by position")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        description = "Ranking retrieved",
        content = @Content(schema = @Schema(implementation = RankingResponse.class))),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "404", description = "Position not found")
  })
  public Response ranking(@PathParam("id") UUID puestoId) {
    Puesto puesto = puestoService.findById(puestoId);
    var ranking = evaluacionService.getRankingForPuesto(puestoId);
    return Response.ok(new RankingResponse(puesto.id, puesto.titulo, ranking.size(), ranking))
        .build();
  }
}
