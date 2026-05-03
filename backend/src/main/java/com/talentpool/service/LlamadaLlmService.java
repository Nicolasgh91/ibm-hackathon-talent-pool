package com.talentpool.service;

import com.talentpool.domain.LlamadaLlm;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Insert-only recorder for {@link LlamadaLlm} rows.
 *
 * <p>Single entry point used by Phase B AiService wrappers: {@link #record(Input)}. The service is
 * deliberately minimal so wiring it into a slow LLM call adds at most a microsecond of overhead
 * before the real work, and it never throws to its caller — a failure to write the audit row is
 * logged but must not roll back the user-visible flow (otherwise an outage in Postgres while the
 * LLM is healthy would silently break challenge generation).
 */
@ApplicationScoped
public class LlamadaLlmService {

  private static final Logger LOG = Logger.getLogger(LlamadaLlmService.class);

  private final EntityManager em;

  public LlamadaLlmService(EntityManager em) {
    this.em = em;
  }

  /**
   * Persist a single LLM-call audit row in a fresh transaction. Errors are logged at WARN and
   * swallowed so the caller's main flow is never aborted by an audit-only failure.
   */
  @Transactional(Transactional.TxType.REQUIRES_NEW)
  public void record(Input input) {
    try {
      LlamadaLlm row = new LlamadaLlm();
      row.evaluacionId = input.evaluacionId;
      row.desafioId = input.desafioId;
      row.consultaLlmId = input.consultaLlmId;
      row.promptVersionId = input.promptVersionId;
      row.proveedor = input.proveedor;
      row.modelo = input.modelo;
      row.tokensIn = input.tokensIn;
      row.tokensOut = input.tokensOut;
      row.costoUsd = input.costoUsd == null ? BigDecimal.ZERO : input.costoUsd;
      row.latenciaMs = input.latenciaMs;
      row.estado = input.estado == null ? LlamadaLlm.ESTADO_OK : input.estado;
      row.errorMensaje = input.errorMensaje;
      row.requestId = input.requestId;
      em.persist(row);
    } catch (Exception e) {
      LOG.warnf(
          e,
          "Failed to record llamadas_llm row (estado=%s, prompt=%s, request=%s)",
          input.estado,
          input.promptVersionId,
          input.requestId);
    }
  }

  /**
   * Immutable input record. Builder-light: callers populate all fields explicitly. Nullable
   * resource ids represent the three sources (evaluacion / desafio / consulta_llm); per DATABASE.md
   * §3.8 exactly one should be non-null in MVP scope.
   */
  public static final class Input {
    public UUID evaluacionId;
    public UUID desafioId;
    public UUID consultaLlmId;
    public UUID promptVersionId;
    public String proveedor;
    public String modelo;
    public Integer tokensIn;
    public Integer tokensOut;
    public BigDecimal costoUsd;
    public Integer latenciaMs;
    public String estado;
    public String errorMensaje;
    public UUID requestId;

    public static Input forDesafio(UUID desafioId, UUID promptVersionId) {
      Input i = new Input();
      i.desafioId = desafioId;
      i.promptVersionId = promptVersionId;
      return i;
    }

    public static Input forEvaluacion(UUID evaluacionId, UUID promptVersionId) {
      Input i = new Input();
      i.evaluacionId = evaluacionId;
      i.promptVersionId = promptVersionId;
      return i;
    }

    public Input model(String proveedor, String modelo) {
      this.proveedor = proveedor;
      this.modelo = modelo;
      return this;
    }

    public Input tokens(int in, int out) {
      this.tokensIn = in;
      this.tokensOut = out;
      return this;
    }

    public Input cost(BigDecimal usd) {
      this.costoUsd = usd;
      return this;
    }

    public Input latency(int ms) {
      this.latenciaMs = ms;
      return this;
    }

    public Input ok() {
      this.estado = LlamadaLlm.ESTADO_OK;
      return this;
    }

    public Input error(String message) {
      this.estado = LlamadaLlm.ESTADO_ERROR;
      this.errorMensaje = message;
      return this;
    }

    public Input timeout() {
      this.estado = LlamadaLlm.ESTADO_TIMEOUT;
      return this;
    }

    public Input guardrailBlocked(String reason) {
      this.estado = LlamadaLlm.ESTADO_GUARDRAIL_RECHAZO;
      this.errorMensaje = reason;
      return this;
    }

    public Input request(UUID requestId) {
      this.requestId = requestId;
      return this;
    }
  }
}
