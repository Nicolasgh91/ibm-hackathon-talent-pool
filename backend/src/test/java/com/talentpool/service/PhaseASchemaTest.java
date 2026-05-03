package com.talentpool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.talentpool.domain.EvaluacionVersion;
import com.talentpool.domain.EventoAuditoria;
import com.talentpool.domain.LlamadaLlm;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/**
 * Phase A schema and recorder smoke tests.
 *
 * <p>Validates that V016..V021 migrations applied and that the new insert-only services persist
 * rows that round-trip through Hibernate. These tests purposefully do not exercise full UC flows
 * (Phase D will add UC-017 autosave coverage end-to-end); their job is to fail fast if a column was
 * renamed or a CHECK constraint mis-spelled.
 */
@QuarkusTest
class PhaseASchemaTest {

  @Inject EntityManager em;
  @Inject LlamadaLlmService llamadaLlmService;
  @Inject AuditService auditService;

  @Test
  @Transactional
  void llamadaLlmService_persists_audit_row() {
    UUID promptVersionId = activeEvaluatorPromptVersionId();
    UUID requestId = UUID.randomUUID();

    LlamadaLlmService.Input input =
        LlamadaLlmService.Input.forDesafio(null, promptVersionId)
            .model("openai", "gpt-4o-mini")
            .tokens(120, 340)
            .cost(new BigDecimal("0.000204"))
            .latency(842)
            .ok()
            .request(requestId);

    llamadaLlmService.record(input);

    LlamadaLlm row =
        em.createQuery("SELECT l FROM LlamadaLlm l WHERE l.requestId = :req", LlamadaLlm.class)
            .setParameter("req", requestId)
            .getSingleResult();

    assertNotNull(row.id);
    assertEquals(LlamadaLlm.ESTADO_OK, row.estado);
    assertEquals("openai", row.proveedor);
    assertEquals("gpt-4o-mini", row.modelo);
    assertEquals(120, row.tokensIn);
    assertEquals(340, row.tokensOut);
    assertEquals(0, row.costoUsd.compareTo(new BigDecimal("0.000204")));
    assertEquals(842, row.latenciaMs);
    assertEquals(requestId, row.requestId);
  }

  @Test
  @Transactional
  void auditService_writes_canonical_action_with_metadata() {
    // Reuse the recruiter seeded by V013 so the actor_usuario_id FK is satisfied without coupling
    // the test to an arbitrary inserted user (which would force ordering against AuthResourceTest).
    UUID actor = UUID.fromString("11111111-1111-1111-1111-111111111111");
    UUID entidadId = UUID.randomUUID();

    auditService.log(
        actor,
        AuditService.DESAFIO_PUBLICADO,
        "DESAFIO",
        entidadId,
        Map.of("tecnologia", "Java", "seniority", "SSR"));

    EventoAuditoria row =
        em.createQuery(
                "SELECT e FROM EventoAuditoria e WHERE e.entidadId = :id", EventoAuditoria.class)
            .setParameter("id", entidadId)
            .getSingleResult();

    assertEquals(AuditService.DESAFIO_PUBLICADO, row.accion);
    assertEquals("DESAFIO", row.entidadTipo);
    assertEquals(actor, row.actorUsuarioId);
    assertEquals("Java", row.metadataEvento.getString("tecnologia"));
    assertEquals("SSR", row.metadataEvento.getString("seniority"));
  }

  @Test
  @Transactional
  void auditService_accepts_null_actor_for_system_jobs() {
    UUID entidadId = UUID.randomUUID();

    auditService.log(
        null, "sistema.cleanup_invitaciones", "INVITACION", entidadId, Map.of("expiradas", 12));

    EventoAuditoria row =
        em.createQuery(
                "SELECT e FROM EventoAuditoria e WHERE e.entidadId = :id", EventoAuditoria.class)
            .setParameter("id", entidadId)
            .getSingleResult();

    assertEquals(null, row.actorUsuarioId);
    assertEquals(12, row.metadataEvento.getInteger("expiradas"));
  }

  @Test
  void evaluacionVersion_nextVersionNumber_starts_at_one_for_unknown_evaluation() {
    UUID unknownEvaluacionId = UUID.randomUUID();

    int next = EvaluacionVersion.nextVersionNumber(unknownEvaluacionId);

    assertEquals(1, next, "First snapshot of an evaluation must use numero_version = 1");
  }

  @Test
  void canonical_prompt_versions_are_seeded() {
    Long activeEvaluator =
        em.createQuery(
                "SELECT COUNT(p) FROM PromptVersion p "
                    + "WHERE p.nombre = 'evaluador_codigo' AND p.estado = 'ACTIVA'",
                Long.class)
            .getSingleResult();
    Long judge =
        em.createQuery(
                "SELECT COUNT(p) FROM PromptVersion p "
                    + "WHERE p.nombre = 'juez_evals' AND p.estado = 'EXPERIMENTAL'",
                Long.class)
            .getSingleResult();

    assertTrue(activeEvaluator >= 1, "evaluador_codigo ACTIVA prompt must be seeded by V021");
    assertTrue(judge >= 1, "juez_evals EXPERIMENTAL prompt must be seeded by V021");
  }

  // -- helpers --------------------------------------------------------------

  private UUID activeEvaluatorPromptVersionId() {
    return em.createQuery(
            "SELECT p.id FROM PromptVersion p "
                + "WHERE p.nombre = 'evaluador_codigo' AND p.estado = 'ACTIVA'",
            UUID.class)
        .getSingleResult();
  }
}
