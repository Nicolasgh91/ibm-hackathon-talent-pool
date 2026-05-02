package com.talentpool.api;

import com.talentpool.api.dto.InvitacionResponse.DesafioPublicResponse;
import com.talentpool.api.dto.InvitacionResponse.InvitationDetailsResponse;
import com.talentpool.api.dto.InvitacionResponse.PuestoPublicResponse;
import com.talentpool.domain.AsignacionDesafio;
import com.talentpool.domain.Desafio;
import com.talentpool.domain.InvitacionDesafio;
import com.talentpool.domain.Organizacion;
import com.talentpool.domain.Puesto;
import com.talentpool.service.InvitacionService;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.UUID;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("/api/v1/invitations")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Invitations", description = "Public invitation lookup by token")
public class InvitationsResource {

  @Inject InvitacionService invitacionService;

  @GET
  @Path("/by-token/{token}")
  @PermitAll
  @Operation(summary = "Get invitation details by token")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        description = "Invitation retrieved",
        content = @Content(schema = @Schema(implementation = InvitationDetailsResponse.class))),
    @APIResponse(responseCode = "400", description = "Invalid invitation"),
    @APIResponse(responseCode = "404", description = "Related resource not found")
  })
  public Response byToken(@PathParam("token") String token) {
    InvitacionDesafio invitacion = invitacionService.findByToken(token);
    AsignacionDesafio asignacion = AsignacionDesafio.findByIdOptional(invitacion.asignacionId);
    if (asignacion == null) {
      return Response.status(Response.Status.NOT_FOUND).entity("Assignment not found").build();
    }
    Desafio desafio = Desafio.findByIdOptional(asignacion.desafioId);
    if (desafio == null) {
      return Response.status(Response.Status.NOT_FOUND).entity("Challenge not found").build();
    }
    Puesto puesto = asignacion.puestoId != null ? Puesto.findByIdOptional(asignacion.puestoId) : null;
    Organizacion organizacion = desafio.organizacionId != null
        ? Organizacion.findByIdOptional(desafio.organizacionId)
        : null;
    InvitationDetailsResponse response = new InvitationDetailsResponse(
        invitacion.id,
        invitacion.emailInvitado,
        organizacion != null ? organizacion.nombre : null,
        invitacion.estado,
        invitacion.expiraEn,
        invitacion.isValid(),
        new DesafioPublicResponse(
            desafio.id,
            desafio.titulo,
            desafio.enunciado,
            desafio.tecnologia,
            desafio.seniority,
            desafio.minutosEstimados),
        puesto == null ? null : new PuestoPublicResponse(puesto.titulo, puesto.tecnologiaPrincipal, puesto.seniority));
    return Response.ok(response).build();
  }
}

