package com.talentpool.api.dto;

import com.talentpool.domain.InvitacionDesafio;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Response DTOs for invitation operations. */
public class InvitacionResponse {

  /** Response for multiple invitations. */
  public record InvitacionesResponse(
      UUID asignacionId,
      List<InvitacionDetail> invitaciones,
      int totalEnviadas,
      int totalFallidas) {}

  /** Individual invitation details. */
  public record InvitacionDetail(
      UUID id, String email, String token, String estado, Instant expiraEn, String linkInvitacion) {
    public static InvitacionDetail from(InvitacionDesafio invitacion, String baseUrl) {
      String url = String.format("%s/eval?token=%s", baseUrl, invitacion.token);
      return new InvitacionDetail(
          invitacion.id,
          invitacion.emailInvitado,
          invitacion.token,
          invitacion.estado,
          invitacion.expiraEn,
          url);
    }
  }

  /** Public invitation details (for candidates viewing via token). */
  public record InvitationDetailsResponse(
      UUID invitacionId,
      UUID asignacionId,
      String emailInvitado,
      String organizacion,
      String estado,
      Instant expiraEn,
      boolean isValid,
      DesafioPublicResponse desafio,
      PuestoPublicResponse puesto) {}

  /** Public challenge view (no rubrica). */
  public record DesafioPublicResponse(
      UUID id,
      String titulo,
      String enunciado,
      String tecnologia,
      String seniority,
      Integer minutosEstimados) {}

  /** Public position view. */
  public record PuestoPublicResponse(String titulo, String tecnologiaPrincipal, String seniority) {}
}

// Made with Bob
