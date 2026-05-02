package com.talentpool.service;

import com.talentpool.api.dto.GenerateChallengeRequest;
import com.talentpool.api.exception.ResourceNotFoundException;
import com.talentpool.domain.AsignacionDesafio;
import com.talentpool.domain.Desafio;
import com.talentpool.domain.PromptVersion;
import com.talentpool.domain.Puesto;
import com.talentpool.infrastructure.mock.MockChallengeGenerator;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.UUID;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

/**
 * Service for managing technical challenges (Desafios).
 *
 * <p>Handles challenge generation using mock LLM and assignment to positions.
 */
@ApplicationScoped
public class DesafioService {

  private static final Logger LOG = Logger.getLogger(DesafioService.class);

  @Inject EntityManager em;
  @Inject Instance<MockChallengeGenerator> mockGenerator;
  @Inject PuestoService puestoService;
  @ConfigProperty(name = "app.llm.use-mock-llm", defaultValue = "false")
  boolean useMockLlm;

  /**
   * Generate a technical challenge for a position.
   *
   * @param request challenge generation request
   * @param userId ID of the user generating the challenge
   * @return generated challenge
   */
  @Transactional
  public Desafio generateForPuesto(GenerateChallengeRequest request, UUID userId) {
    LOG.infof("Generating challenge for position %s by user %s", request.puestoId(), userId);

    // Validate user has access to the position
    puestoService.validateUserAccess(userId, request.puestoId());

    // Fetch position details
    Puesto puesto = puestoService.findById(request.puestoId());

    // Get active prompt version for challenge generation
    PromptVersion promptVersion = getActivePromptVersion("generador_desafio");

    // Generate challenge using mock generator (simulates 3-8s latency)
    MockChallengeGenerator.ChallengeContent content = generateChallengeContent(
        puesto.tecnologiaPrincipal, puesto.seniority);

    // Create Desafio entity
    Desafio desafio = new Desafio();
    desafio.creadorUsuarioId = userId;
    desafio.organizacionId = puesto.organizacionId;
    desafio.promptVersionId = promptVersion.id;
    desafio.titulo = content.titulo();
    desafio.enunciado = content.enunciado();
    desafio.rubricaOculta = content.rubrica();
    desafio.contextoOrigen = "CORPORATIVO";
    desafio.tecnologia = puesto.tecnologiaPrincipal;
    desafio.seniority = puesto.seniority;
    desafio.minutosEstimados = request.minutosEstimados() != null ? request.minutosEstimados() : 60;
    desafio.esPublico = false;
    desafio.estado = "ACTIVO";

    em.persist(desafio);
    LOG.infof("Challenge created: %s - %s", desafio.id, desafio.titulo);

    // Create AsignacionDesafio linking challenge to position
    AsignacionDesafio asignacion = new AsignacionDesafio();
    asignacion.desafioId = desafio.id;
    asignacion.puestoId = puesto.id;
    asignacion.tipo = "PUESTO";
    asignacion.fechaApertura = Instant.now();
    asignacion.maxIntentos = 1;

    em.persist(asignacion);
    LOG.infof("Challenge assigned to position: asignacion_id=%s", asignacion.id);

    return desafio;
  }

  /**
   * Find challenge by ID.
   *
   * @param id challenge ID
   * @return challenge
   * @throws ResourceNotFoundException if not found
   */
  public Desafio findById(UUID id) {
    Desafio desafio = Desafio.findByIdOptional(id);
    if (desafio == null) {
      throw new ResourceNotFoundException("Challenge", id);
    }
    return desafio;
  }

  /**
   * Get active prompt version for a specific type.
   *
   * @param tipo prompt type
   * @return active prompt version
   * @throws ResourceNotFoundException if no active version found
   */
  private PromptVersion getActivePromptVersion(String nombre) {
    return em.createQuery(
            "SELECT p FROM PromptVersion p WHERE p.nombre = :nombre AND p.estado = 'ACTIVA'",
            PromptVersion.class)
        .setParameter("nombre", nombre)
        .getResultStream()
        .findFirst()
        .orElseThrow(() -> new ResourceNotFoundException(
            "No active prompt version found for name: " + nombre));
  }

  private MockChallengeGenerator.ChallengeContent generateChallengeContent(
      String tecnologia, String seniority) {
    if (useMockLlm && mockGenerator.isResolvable()) {
      return mockGenerator.get().generate(tecnologia, seniority);
    }
    throw new UnsupportedOperationException("Real LLM challenge generation is not enabled yet");
  }
}

// Made with Bob