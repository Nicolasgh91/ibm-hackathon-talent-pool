-- =============================================================================
-- V019: Create llamadas_llm table for cost / latency / reproducibility audit
-- =============================================================================
-- Every LLM invocation that consumed tokens registers one row here. This is
-- the data source for cost dashboards, daily-spend alerts, and reproducibility
-- queries that link an evaluation/desafio/consulta back to the exact prompt
-- version and model that produced it.
-- Source: product/DATABASE.md §3.8 (table llamadas_llm) and §1.4
-- =============================================================================

CREATE TABLE llamadas_llm (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluacion_id     UUID REFERENCES evaluaciones(id)  ON DELETE SET NULL,
  desafio_id        UUID REFERENCES desafios(id)      ON DELETE SET NULL,
  consulta_llm_id   UUID,                                       -- consultas_llm not in MVP scope
  prompt_version_id UUID NOT NULL REFERENCES prompt_versiones(id) ON DELETE RESTRICT,
  proveedor         VARCHAR(50)  NOT NULL,
  modelo            VARCHAR(100) NOT NULL,
  tokens_in         INTEGER      NOT NULL,
  tokens_out        INTEGER      NOT NULL,
  costo_usd         DECIMAL(10,6) NOT NULL,
  latencia_ms       INTEGER      NOT NULL,
  estado            VARCHAR(20)  NOT NULL DEFAULT 'OK',
  error_mensaje     TEXT,
  request_id        UUID,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_llm_estado   CHECK (estado IN ('OK', 'ERROR', 'TIMEOUT', 'GUARDRAIL_RECHAZO')),
  CONSTRAINT chk_llm_tokens   CHECK (tokens_in >= 0 AND tokens_out >= 0),
  CONSTRAINT chk_llm_costo    CHECK (costo_usd >= 0),
  CONSTRAINT chk_llm_latencia CHECK (latencia_ms >= 0)
);

CREATE INDEX idx_llm_evaluacion       ON llamadas_llm(evaluacion_id)   WHERE evaluacion_id  IS NOT NULL;
CREATE INDEX idx_llm_desafio          ON llamadas_llm(desafio_id)      WHERE desafio_id     IS NOT NULL;
CREATE INDEX idx_llm_consulta         ON llamadas_llm(consulta_llm_id) WHERE consulta_llm_id IS NOT NULL;
CREATE INDEX idx_llm_prompt           ON llamadas_llm(prompt_version_id);
CREATE INDEX idx_llm_costos_diarios   ON llamadas_llm(created_at, proveedor, modelo);
CREATE INDEX idx_llm_request_id       ON llamadas_llm(request_id) WHERE request_id IS NOT NULL;

COMMENT ON TABLE llamadas_llm
  IS 'Audit row per LLM invocation: tokens, cost, latency, status, link to source artifact';
COMMENT ON COLUMN llamadas_llm.consulta_llm_id
  IS 'FK to consultas_llm (Phase 5); intentionally not declared as REFERENCES until that table exists';
COMMENT ON COLUMN llamadas_llm.request_id
  IS 'Mirrors HTTP correlationId for cross-stack debugging; nullable for system jobs';
COMMENT ON COLUMN llamadas_llm.estado
  IS 'OK | ERROR | TIMEOUT | GUARDRAIL_RECHAZO (input/output guardrail aborted the call)';
