package com.talentpool.api;

import com.talentpool.api.dto.AcceptAssignmentRequest;
import com.talentpool.api.dto.AssignmentWireResponse;
import com.talentpool.api.dto.DesafioResponse;
import com.talentpool.api.dto.InviteCandidatesRequest;
import com.talentpool.api.dto.InviteSingleCandidateRequest;
import com.talentpool.api.exception.ResourceNotFoundException;
import com.talentpool.domain.AsignacionDesafio;
import com.talentpool.domain.Desafio;
import com.talentpool.domain.InvitacionDesafio;
import com.talentpool.domain.Usuario;
import com.talentpool.infrastructure.security.JwtTokenService;
import com.talentpool.service.InvitacionService;
import com.talentpool.service.PuestoService;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

/**
 * REST surface aligned with the SPA assignment routes (mock contract). Some list paths return a
 * best-effort projection from {@link AsignacionDesafio} + {@link InvitacionDesafio}.
 */
@Path("/api/v1/assignments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Assignments", description = "Challenge assignments and invitations (BFF-style)")
public class AssignmentsResource {

  @Inject EntityManager em;
  @Inject InvitacionService invitacionService;
  @Inject JwtTokenService jwtTokenService;
  @Inject PuestoService puestoService;

  @GET
  @Authenticated
  @Operation(summary = "List assignments for the recruiter organization")
  public Response list(@QueryParam("candidatoId") UUID candidatoId, @Context SecurityContext ctx) {
    UUID userId = jwtTokenService.parseUserId(ctx.getUserPrincipal().getName());
    UUID orgId = puestoService.primaryOrganizationForUser(userId);
    List<AsignacionDesafio> rows =
        em.createQuery(
                "SELECT a FROM AsignacionDesafio a JOIN Desafio d ON d.id = a.desafioId "
                    + "WHERE d.organizacionId = :org",
                AsignacionDesafio.class)
            .setParameter("org", orgId)
            .getResultList();
    return Response.ok(
            rows.stream()
                .filter(a -> candidatoId == null || candidatoId.equals(resolveCandidatoId(a)))
                .map(this::toWire)
                .toList())
        .build();
  }

  @GET
  @Path("/{id}")
  @Authenticated
  @Operation(summary = "Get assignment by id")
  public Response getById(@PathParam("id") UUID id) {
    AsignacionDesafio a = AsignacionDesafio.findByIdOptional(id);
    if (a == null) {
      throw new ResourceNotFoundException("Assignment", id);
    }
    return Response.ok(toWire(a)).build();
  }

  @POST
  @Path("/invite")
  @Authenticated
  @Operation(summary = "Invite a single candidate (maps to challenge invitations)")
  public Response invite(
      @Valid InviteSingleCandidateRequest body, @Context SecurityContext securityContext) {
    UUID userId = jwtTokenService.parseUserId(securityContext.getUserPrincipal().getName());
    InviteCandidatesRequest req =
        new InviteCandidatesRequest(
            List.of(body.candidatoEmail().trim().toLowerCase()),
            null,
            body.fechaLimite(),
            body.fechaLimite(),
            null);
    List<InvitacionDesafio> invs =
        invitacionService.inviteCandidates(body.desafioId(), req, userId);
    if (invs.isEmpty()) {
      return Response.status(Response.Status.BAD_REQUEST)
          .entity("No invitation was created")
          .build();
    }
    InvitacionDesafio inv = invs.get(0);
    AsignacionDesafio a = AsignacionDesafio.findByIdOptional(inv.asignacionId);
    if (a == null) {
      throw new ResourceNotFoundException("Assignment", inv.asignacionId);
    }
    return Response.status(Response.Status.CREATED).entity(toWire(a, inv)).build();
  }

  @POST
  @Path("/accept")
  @Authenticated
  @Operation(summary = "Accept invitation for an assignment (matches SPA body)")
  public Response accept(@Valid AcceptAssignmentRequest body, @Context SecurityContext ctx) {
    UUID userId = jwtTokenService.parseUserId(ctx.getUserPrincipal().getName());
    Usuario me = Usuario.findByIdOptional(userId);
    if (me == null) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }
    InvitacionDesafio inv =
        em.createQuery(
                "SELECT i FROM InvitacionDesafio i WHERE i.asignacionId = :aid AND LOWER(i.emailInvitado) = LOWER(:email)",
                InvitacionDesafio.class)
            .setParameter("aid", body.asignacionId())
            .setParameter("email", me.email)
            .getResultStream()
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Invitation", body.asignacionId()));
    inv.usuarioInvitadoId = userId;
    inv.estado = "ACEPTADA";
    em.merge(inv);
    AsignacionDesafio a = AsignacionDesafio.findByIdOptional(body.asignacionId());
    return Response.ok(toWire(a, inv)).build();
  }

  @POST
  @Path("/{id}/reject")
  @Authenticated
  @Operation(summary = "Reject assignment")
  public Response reject(@PathParam("id") UUID id, @Context SecurityContext ctx) {
    UUID userId = jwtTokenService.parseUserId(ctx.getUserPrincipal().getName());
    Usuario me = Usuario.findByIdOptional(userId);
    InvitacionDesafio inv =
        em.createQuery(
                "SELECT i FROM InvitacionDesafio i WHERE i.asignacionId = :aid AND LOWER(i.emailInvitado) = LOWER(:email)",
                InvitacionDesafio.class)
            .setParameter("aid", id)
            .setParameter("email", me != null ? me.email : "")
            .getResultStream()
            .findFirst()
            .orElse(null);
    if (inv != null) {
      inv.estado = "REVOCADA";
      em.merge(inv);
    }
    AsignacionDesafio a = AsignacionDesafio.findByIdOptional(id);
    if (a == null) {
      throw new ResourceNotFoundException("Assignment", id);
    }
    return Response.ok(toWire(a, inv)).build();
  }

  @GET
  @Path("/my-challenges")
  @Authenticated
  @Operation(summary = "Assignments for the current user as candidate")
  public Response myChallenges(@Context SecurityContext ctx) {
    UUID userId = jwtTokenService.parseUserId(ctx.getUserPrincipal().getName());
    Usuario me = Usuario.findByIdOptional(userId);
    if (me == null) {
      return Response.ok(List.of()).build();
    }
    List<AsignacionDesafio> rows =
        em.createQuery(
                "SELECT a FROM AsignacionDesafio a JOIN InvitacionDesafio i ON i.asignacionId = a.id "
                    + "WHERE (i.usuarioInvitadoId = :uid OR LOWER(i.emailInvitado) = LOWER(:email))",
                AsignacionDesafio.class)
            .setParameter("uid", userId)
            .setParameter("email", me.email)
            .getResultList();
    return Response.ok(rows.stream().map(this::toWire).toList()).build();
  }

  @GET
  @Path("/my-invitations")
  @Authenticated
  @Operation(summary = "Pending invitations for the current user")
  public Response myInvitations(@Context SecurityContext ctx) {
    return myChallenges(ctx);
  }

  private UUID resolveCandidatoId(AsignacionDesafio a) {
    InvitacionDesafio inv = latestInvitation(a.id);
    if (inv == null) {
      return a.id;
    }
    if (inv.usuarioInvitadoId != null) {
      return inv.usuarioInvitadoId;
    }
    Usuario u = Usuario.findByEmail(inv.emailInvitado);
    return u != null ? u.id : guestId(inv.emailInvitado);
  }

  private InvitacionDesafio latestInvitation(UUID asignacionId) {
    return em.createQuery(
            "SELECT i FROM InvitacionDesafio i WHERE i.asignacionId = :aid ORDER BY i.createdAt DESC",
            InvitacionDesafio.class)
        .setParameter("aid", asignacionId)
        .setMaxResults(1)
        .getResultStream()
        .findFirst()
        .orElse(null);
  }

  private AssignmentWireResponse toWire(AsignacionDesafio a) {
    return toWire(a, latestInvitation(a.id));
  }

  private AssignmentWireResponse toWire(AsignacionDesafio a, InvitacionDesafio inv) {
    Desafio d = Desafio.findByIdOptional(a.desafioId);
    UUID candidatoId =
        inv != null && inv.usuarioInvitadoId != null
            ? inv.usuarioInvitadoId
            : (inv != null ? guestId(inv.emailInvitado) : a.id);
    String estado =
        inv != null
            ? ("ACEPTADA".equals(inv.estado) ? "ACEPTADO" : "PENDIENTE")
            : "PENDIENTE";
    Instant fechaInv = inv != null ? inv.createdAt : a.createdAt;
    Instant fechaAcc = "ACEPTADA".equals(inv != null ? inv.estado : "") ? inv.updatedAt : null;
    return new AssignmentWireResponse(
        a.id,
        a.desafioId,
        candidatoId,
        estado,
        fechaInv,
        fechaAcc,
        inv != null ? inv.expiraEn : a.fechaCierre,
        a.createdAt,
        a.createdAt,
        d != null ? DesafioResponse.from(d) : null);
  }

  private static UUID guestId(String email) {
    return UUID.nameUUIDFromBytes(("guest:" + email.toLowerCase()).getBytes(StandardCharsets.UTF_8));
  }
}
