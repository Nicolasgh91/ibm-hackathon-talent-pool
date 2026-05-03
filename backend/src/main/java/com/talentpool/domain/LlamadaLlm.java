package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * LlamadaLlm entity - audit row for a single LLM invocation.
 *
 * <p>Insert-only by contract. Source of truth for cost dashboards, daily spend alerts, and
 * reproducibility (each evaluacion/desafio links back to the exact prompt + model used).
 *
 * <p>Based on product/DATABASE.md §3.8.
 */
@Entity
@Table(name = "llamadas_llm")
public class LlamadaLlm extends PanacheEntityBase {

  public static final String ESTADO_OK = "OK";
  public static final String ESTADO_ERROR = "ERROR";
  public static final String ESTADO_TIMEOUT = "TIMEOUT";
  public static final String ESTADO_GUARDRAIL_RECHAZO = "GUARDRAIL_RECHAZO";

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(name = "evaluacion_id", columnDefinition = "UUID")
  public UUID evaluacionId;

  @Column(name = "desafio_id", columnDefinition = "UUID")
  public UUID desafioId;

  @Column(name = "consulta_llm_id", columnDefinition = "UUID")
  public UUID consultaLlmId;

  @Column(name = "prompt_version_id", nullable = false, columnDefinition = "UUID")
  public UUID promptVersionId;

  @Column(nullable = false, length = 50)
  public String proveedor;

  @Column(nullable = false, length = 100)
  public String modelo;

  @Column(name = "tokens_in", nullable = false)
  public Integer tokensIn;

  @Column(name = "tokens_out", nullable = false)
  public Integer tokensOut;

  @Column(name = "costo_usd", nullable = false, precision = 10, scale = 6)
  public BigDecimal costoUsd;

  @Column(name = "latencia_ms", nullable = false)
  public Integer latenciaMs;

  @Column(nullable = false, length = 20)
  public String estado = ESTADO_OK;

  @Column(name = "error_mensaje", columnDefinition = "TEXT")
  public String errorMensaje;

  @Column(name = "request_id", columnDefinition = "UUID")
  public UUID requestId;

  @Column(name = "created_at", nullable = false, updatable = false)
  public Instant createdAt;

  @PrePersist
  protected void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }
}
