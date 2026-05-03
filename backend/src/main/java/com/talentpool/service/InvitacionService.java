package com.talentpool.service;

import com.talentpool.api.dto.InviteCandidatesRequest;
import com.talentpool.api.exception.InvalidInvitationException;
import com.talentpool.domain.AsignacionDesafio;
import com.talentpool.domain.Desafio;
import com.talentpool.domain.InvitacionDesafio;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

/**
 * Service for managing challenge invitations.
 *
 * <p>Handles invitation creation, token generation, and email notifications (mocked).
 */
@ApplicationScoped
public class InvitacionService {

  private static final Logger LOG = Logger.getLogger(InvitacionService.class);
  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  @Inject EntityManager em;
  @Inject DesafioService desafioService;

  @ConfigProperty(name = "app.invitations.default-expiry-days", defaultValue = "7")
  int defaultExpiryDays;

  @ConfigProperty(name = "app.invitations.base-url", defaultValue = "http://localhost:5173")
  String frontendBaseUrl;

  /**
   * Invite candidates to take a challenge.
   *
   * @param desafioId challenge ID
   * @param request invitation request
   * @param emisorId ID of user sending invitations
   * @return list of created invitations
   */
  @Transactional
  public List<InvitacionDesafio> inviteCandidates(
      UUID desafioId, InviteCandidatesRequest request, UUID emisorId) {
    LOG.infof("Inviting %d candidates to challenge %s", request.emails().size(), desafioId);

    // Validate challenge exists
    Desafio desafio = desafioService.findById(desafioId);

    // Get or create assignment for this challenge
    AsignacionDesafio asignacion = getOrCreateAsignacion(desafioId);
    if (request.maxIntentos() != null) {
      asignacion.maxIntentos = request.maxIntentos();
    }
    if (request.fechaApertura() != null) {
      asignacion.fechaApertura = request.fechaApertura();
    }
    Instant fechaCierre =
        request.fechaCierre() != null ? request.fechaCierre() : request.expiraEn();
    if (fechaCierre != null) {
      asignacion.fechaCierre = fechaCierre;
    }
    em.merge(asignacion);

    // Determine expiration date
    Instant expiraEn =
        fechaCierre != null
            ? fechaCierre
            : request.expiraEn() != null
                ? request.expiraEn()
                : Instant.now().plus(defaultExpiryDays, ChronoUnit.DAYS);

    // Create invitations
    List<InvitacionDesafio> invitaciones = new ArrayList<>();
    for (String email : request.emails()) {
      try {
        InvitacionDesafio invitacion = createInvitation(asignacion.id, emisorId, email, expiraEn);
        invitaciones.add(invitacion);

        // Mock send email
        mockSendEmail(email, invitacion.token, desafio.titulo);

      } catch (Exception e) {
        LOG.errorf(e, "Failed to create invitation for %s", email);
      }
    }

    LOG.infof("Created %d invitations for challenge %s", invitaciones.size(), desafioId);
    return invitaciones;
  }

  /**
   * Find invitation by token.
   *
   * @param token invitation token
   * @return invitation details
   * @throws InvalidInvitationException if not found or invalid
   */
  public InvitacionDesafio findByToken(String token) {
    InvitacionDesafio invitacion = InvitacionDesafio.findByToken(token);
    if (invitacion == null) {
      throw InvalidInvitationException.notFound();
    }
    return invitacion;
  }

  /**
   * Validate and mark invitation as accepted.
   *
   * @param token invitation token
   * @return validated invitation
   * @throws InvalidInvitationException if invalid
   */
  public InvitacionDesafio validateToken(String token) {
    InvitacionDesafio invitacion = findByToken(token);

    // Check if expired
    if (invitacion.isExpired()) {
      throw InvalidInvitationException.expired();
    }

    // Check if already used
    if (!"PENDIENTE".equals(invitacion.estado)) {
      throw InvalidInvitationException.alreadyUsed();
    }

    return invitacion;
  }

  @Transactional
  public void markAsAccepted(UUID invitacionId) {
    InvitacionDesafio invitacion = InvitacionDesafio.findByIdOptional(invitacionId);
    if (invitacion != null && "PENDIENTE".equals(invitacion.estado)) {
      invitacion.estado = "ACEPTADA";
      em.merge(invitacion);
    }
  }

  public String buildInvitationUrl(String token) {
    return String.format("%s/eval?token=%s", frontendBaseUrl, token);
  }

  /** Create a single invitation. */
  private InvitacionDesafio createInvitation(
      UUID asignacionId, UUID emisorId, String email, Instant expiraEn) {
    InvitacionDesafio invitacion = new InvitacionDesafio();
    invitacion.asignacionId = asignacionId;
    invitacion.emisorUsuarioId = emisorId;
    invitacion.emailInvitado = email.toLowerCase();
    invitacion.token = generateSecureToken();
    invitacion.estado = "PENDIENTE";
    invitacion.expiraEn = expiraEn;

    em.persist(invitacion);
    return invitacion;
  }

  /** Get or create assignment for a challenge. */
  private AsignacionDesafio getOrCreateAsignacion(UUID desafioId) {
    // Try to find existing assignment
    AsignacionDesafio asignacion =
        em.createQuery(
                "SELECT a FROM AsignacionDesafio a WHERE a.desafioId = :desafioId",
                AsignacionDesafio.class)
            .setParameter("desafioId", desafioId)
            .getResultStream()
            .findFirst()
            .orElse(null);

    if (asignacion == null) {
      // Create new assignment
      asignacion = new AsignacionDesafio();
      asignacion.desafioId = desafioId;
      asignacion.tipo = "PUBLICO";
      asignacion.fechaApertura = Instant.now();
      asignacion.maxIntentos = 1;
      em.persist(asignacion);
      LOG.infof("Created new assignment for challenge %s", desafioId);
    }

    return asignacion;
  }

  /** Generate a secure random token (64 characters). */
  private String generateSecureToken() {
    byte[] bytes = new byte[48]; // 48 bytes = 64 base64 chars
    SECURE_RANDOM.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }

  /** Mock email sending (logs to console). */
  private void mockSendEmail(String email, String token, String challengeTitle) {
    String url = String.format("%s/challenges/accept/%s", frontendBaseUrl, token);
    LOG.infof(
        "📧 [MOCK EMAIL] To: %s | Subject: Challenge Invitation - %s | URL: %s",
        email, challengeTitle, url);
  }
}

// Made with Bob
