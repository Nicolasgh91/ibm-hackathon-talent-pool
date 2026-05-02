package com.talentpool.api;

import com.talentpool.api.dto.DesafioResponse;
import com.talentpool.api.dto.GenerateChallengeRequest;
import com.talentpool.api.dto.InvitacionResponse.InvitacionDetail;
import com.talentpool.api.dto.InvitacionResponse.InvitacionesResponse;
import com.talentpool.api.dto.InviteCandidatesRequest;
import com.talentpool.domain.Desafio;
import com.talentpool.domain.InvitacionDesafio;
import com.talentpool.infrastructure.security.JwtTokenService;
import com.talentpool.service.DesafioService;
import com.talentpool.service.InvitacionService;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
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

@Path("/api/v1/challenges")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Challenges", description = "Challenge generation and candidate invitations")
public class ChallengesResource {

  @Inject DesafioService desafioService;
  @Inject InvitacionService invitacionService;
  @Inject JwtTokenService jwtTokenService;

  @POST
  @Authenticated
  @Operation(summary = "Generate challenge for position")
  @APIResponses({
    @APIResponse(
        responseCode = "201",
        description = "Challenge generated",
        content = @Content(schema = @Schema(implementation = DesafioResponse.class))),
    @APIResponse(responseCode = "400", description = "Invalid request"),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "404", description = "Position not found")
  })
  public Response generate(
      @Valid GenerateChallengeRequest request, @Context SecurityContext securityContext) {
    UUID userId = jwtTokenService.parseUserId(securityContext.getUserPrincipal().getName());
    Desafio desafio = desafioService.generateForPuesto(request, userId);
    return Response.status(Response.Status.CREATED).entity(DesafioResponse.from(desafio)).build();
  }

  @POST
  @Path("/{id}/invitations")
  @Authenticated
  @Operation(summary = "Invite candidates to challenge")
  @APIResponses({
    @APIResponse(
        responseCode = "201",
        description = "Invitations generated",
        content = @Content(schema = @Schema(implementation = InvitacionesResponse.class))),
    @APIResponse(responseCode = "400", description = "Invalid request"),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "404", description = "Challenge not found")
  })
  public Response inviteCandidates(
      @PathParam("id") UUID desafioId,
      @Valid InviteCandidatesRequest request,
      @Context SecurityContext securityContext) {
    UUID userId = jwtTokenService.parseUserId(securityContext.getUserPrincipal().getName());
    List<InvitacionDesafio> invitaciones = invitacionService.inviteCandidates(desafioId, request, userId);
    List<InvitacionDetail> detalles = invitaciones.stream()
        .map(inv -> new InvitacionDetail(
            inv.id,
            inv.emailInvitado,
            inv.token,
            inv.estado,
            inv.expiraEn,
            invitacionService.buildInvitationUrl(inv.token)))
        .toList();
    UUID asignacionId = invitaciones.isEmpty() ? null : invitaciones.get(0).asignacionId;
    InvitacionesResponse response =
        new InvitacionesResponse(asignacionId, detalles, detalles.size(), request.emails().size() - detalles.size());
    return Response.status(Response.Status.CREATED).entity(response).build();
  }
}

