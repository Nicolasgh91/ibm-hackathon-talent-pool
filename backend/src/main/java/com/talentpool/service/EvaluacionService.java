package com.talentpool.service;

import com.talentpool.api.dto.EvaluacionResponse.CandidateRankingEntry;
import com.talentpool.api.dto.EvaluacionResponse.DimensionResponse;
import com.talentpool.api.dto.SubmitEvaluationRequest;
import com.talentpool.api.exception.InvalidInvitationException;
import com.talentpool.api.exception.ResourceNotFoundException;
import com.talentpool.domain.*;
import com.talentpool.infrastructure.mock.MockEvaluator;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

/**
 * Service for managing code evaluations.
 *
 * <p>Handles submission, async evaluation using mock evaluator, and ranking.
 */
@ApplicationScoped
public class EvaluacionService {

  private static final Logger LOG = Logger.getLogger(EvaluacionService.class);

  @Inject EntityManager em;
  @Inject Instance<MockEvaluator> mockEvaluator;
  @Inject InvitacionService invitacionService;
  @ConfigProperty(name = "app.llm.use-mock-llm", defaultValue = "false")
  boolean useMockLlm;

  /**
   * Submit code for evaluation (async processing).
   *
   * @param request submission request
   * @return created evaluation (estado=EN_CURSO)
   */
  @Transactional
  public Evaluacion submitForEvaluation(SubmitEvaluationRequest request) {
    String tokenPrefix = request.token().length() > 8 ? request.token().substring(0, 8) : request.token();
    LOG.infof("Submitting evaluation for token: %s...", tokenPrefix);

    // Validate invitation token before consuming it.
    InvitacionDesafio invitacion = invitacionService.validateToken(request.token());

    // Get assignment and challenge details
    AsignacionDesafio asignacion = AsignacionDesafio.findByIdOptional(invitacion.asignacionId);
    if (asignacion == null) {
      throw new ResourceNotFoundException("Assignment", invitacion.asignacionId);
    }

    Desafio desafio = Desafio.findByIdOptional(asignacion.desafioId);
    if (desafio == null) {
      throw new ResourceNotFoundException("Challenge", asignacion.desafioId);
    }

    // Check if candidate already submitted (max attempts)
    UUID candidatoId = getCandidateId(invitacion.emailInvitado);
    long attemptCount = Evaluacion.countByAsignacionAndCandidate(asignacion.id, candidatoId);
    if (attemptCount >= asignacion.maxIntentos) {
      throw InvalidInvitationException.maxAttemptsReached();
    }

    invitacionService.markAsAccepted(invitacion.id);

    // Create evaluation entity
    Evaluacion evaluacion = new Evaluacion();
    evaluacion.desafioId = desafio.id;
    evaluacion.candidatoId = candidatoId;
    evaluacion.asignacionId = asignacion.id;
    evaluacion.codigoEntregado = request.codigoEntregado();
    evaluacion.lenguaje = request.lenguaje();
    evaluacion.contexto = desafio.contextoOrigen;
    evaluacion.minutosEmpleados = request.minutosEmpleados();
    evaluacion.estado = "ENTREGADA";
    evaluacion.inicio = Instant.now();
    evaluacion.entrega = Instant.now();

    em.persist(evaluacion);
    em.flush(); // Ensure ID is generated

    LOG.infof("Evaluation created: %s, launching async processing", evaluacion.id);

    // Launch async evaluation
    UUID evaluacionId = evaluacion.id;
    CompletableFuture.runAsync(() -> evaluateAsync(
        evaluacionId,
        request.codigoEntregado(),
        request.lenguaje()
    ));

    return evaluacion;
  }

  /**
   * Find evaluation by ID.
   *
   * @param id evaluation ID
   * @return evaluation
   * @throws ResourceNotFoundException if not found
   */
  public Evaluacion findById(UUID id) {
    Evaluacion evaluacion = Evaluacion.findByIdOptional(id);
    if (evaluacion == null) {
      throw new ResourceNotFoundException("Evaluation", id);
    }
    return evaluacion;
  }

  /**
   * Get candidate ranking for a position.
   *
   * @param puestoId position ID
   * @return ranking list
   */
  public List<CandidateRankingEntry> getRankingForPuesto(UUID puestoId) {
    LOG.infof("Getting ranking for position: %s", puestoId);

    List<UUID> asignacionIds = em.createQuery(
            "SELECT a.id FROM AsignacionDesafio a WHERE a.puestoId = :puestoId",
            UUID.class)
        .setParameter("puestoId", puestoId)
        .getResultList();
    if (asignacionIds.isEmpty()) {
      return List.of(); // No assignments yet
    }

    // Get all evaluated submissions, ordered by score
    List<Object[]> results = em.createQuery(
            "SELECT e, u.email, u.nombreCompleto " +
            "FROM Evaluacion e JOIN Usuario u ON e.candidatoId = u.id " +
            "WHERE e.asignacionId IN :asignacionIds AND e.estado = 'EVALUADA' " +
            "ORDER BY e.puntajeTotal DESC, e.evaluadoEn ASC",
            Object[].class)
        .setParameter("asignacionIds", asignacionIds)
        .getResultList();

    // Build ranking entries
    List<CandidateRankingEntry> ranking = new ArrayList<>();
    int posicion = 1;

    for (Object[] row : results) {
      Evaluacion evaluacion = (Evaluacion) row[0];
      String email = (String) row[1];
      String nombre = (String) row[2];

      // Get dimension scores
      List<DimensionPuntaje> dimensiones = DimensionPuntaje.findByEvaluacion(evaluacion.id);
      List<DimensionResponse> dimensionResponses = dimensiones.stream()
          .map(DimensionResponse::from)
          .toList();

      ranking.add(new CandidateRankingEntry(
          posicion++,
          evaluacion.candidatoId,
          email,
          nombre,
          evaluacion.puntajeTotal,
          dimensionResponses,
          evaluacion.minutosEmpleados,
          evaluacion.evaluadoEn
      ));
    }

    LOG.infof("Ranking complete: %d candidates", ranking.size());
    return ranking;
  }

  /**
   * Async evaluation processing (runs in background).
   */
  private void evaluateAsync(UUID evaluacionId, String codigo, String lenguaje) {
    try {
      LOG.infof("Starting async evaluation for: %s", evaluacionId);

      MockEvaluator.EvaluationResult result = evaluateCode(codigo, lenguaje);

      // Update evaluation with results (in new transaction)
      updateEvaluacionWithResults(evaluacionId, result);

      LOG.infof("Async evaluation complete for: %s, score: %s", evaluacionId, result.puntaje());

    } catch (Exception e) {
      LOG.errorf(e, "Async evaluation failed for: %s", evaluacionId);
      markEvaluationAsFailed(evaluacionId);
    }
  }

  /**
   * Update evaluation with results (separate transaction).
   */
  @Transactional
  void updateEvaluacionWithResults(UUID evaluacionId, MockEvaluator.EvaluationResult result) {
    Evaluacion evaluacion = em.find(Evaluacion.class, evaluacionId);
    if (evaluacion == null) {
      LOG.errorf("Evaluation not found for update: %s", evaluacionId);
      return;
    }

    // Update evaluation
    evaluacion.puntajeTotal = result.puntaje();
    evaluacion.reporteFeedback = new JsonObject(result.feedbackJson());
    evaluacion.estado = "EVALUADA";
    evaluacion.evaluadoEn = Instant.now();
    em.merge(evaluacion);

    // Create dimension scores
    for (MockEvaluator.Dimension dimension : result.dimensiones()) {
      DimensionPuntaje dimensionPuntaje = new DimensionPuntaje();
      dimensionPuntaje.evaluacionId = evaluacionId;
      dimensionPuntaje.nombre = dimension.nombre();
      dimensionPuntaje.puntaje = dimension.puntaje();
      dimensionPuntaje.peso = dimension.peso();
      dimensionPuntaje.justificacion = dimension.justificacion();
      em.persist(dimensionPuntaje);
    }

    LOG.infof("Evaluation results saved: %s", evaluacionId);
  }

  /**
   * Mark evaluation as failed.
   */
  @Transactional
  void markEvaluationAsFailed(UUID evaluacionId) {
    Evaluacion evaluacion = em.find(Evaluacion.class, evaluacionId);
    if (evaluacion != null) {
      evaluacion.estado = "ANULADA";
      em.merge(evaluacion);
    }
  }

  /**
   * Get or create candidate user ID from email.
   */
  private UUID getCandidateId(String email) {
    // Try to find existing user
    Usuario usuario = em.createQuery(
            "SELECT u FROM Usuario u WHERE u.email = :email",
            Usuario.class)
        .setParameter("email", email.toLowerCase())
        .getResultStream()
        .findFirst()
        .orElse(null);

    if (usuario != null) {
      return usuario.id;
    }

    // Create temporary candidate user
    usuario = new Usuario();
    usuario.email = email.toLowerCase();
    usuario.nombreCompleto = email.split("@")[0]; // Use email prefix as name
    usuario.passwordHash = ""; // No password for invited candidates
    usuario.emailVerificado = false;
    em.persist(usuario);

    LOG.infof("Created temporary candidate user: %s", usuario.id);
    return usuario.id;
  }

  private MockEvaluator.EvaluationResult evaluateCode(String codigo, String lenguaje) {
    if (useMockLlm && mockEvaluator.isResolvable()) {
      return mockEvaluator.get().evaluate(codigo, lenguaje);
    }
    throw new UnsupportedOperationException("Real evaluation engine is not enabled yet");
  }
}

// Made with Bob