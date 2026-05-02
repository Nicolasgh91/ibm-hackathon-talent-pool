-- =============================================================================
-- V010: Create evaluaciones table
-- =============================================================================
-- Creates the evaluaciones (candidate evaluations) table
-- Based on product/DATABASE.md §3.4
-- =============================================================================

CREATE TABLE evaluaciones (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desafio_id        UUID NOT NULL REFERENCES desafios(id) ON DELETE RESTRICT,
  candidato_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  asignacion_id     UUID REFERENCES asignaciones_desafio(id) ON DELETE SET NULL,
  codigo_entregado  TEXT,
  lenguaje          VARCHAR(50),
  puntaje_total     DECIMAL(5,2),
  reporte_feedback  JSONB,
  contexto          VARCHAR(20) NOT NULL,
  minutos_empleados INTEGER,
  estado            VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  inicio            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  entrega           TIMESTAMPTZ,
  evaluado_en       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_eval_contexto CHECK (contexto IN ('CORPORATIVO', 'ACADEMICO', 'AUTOEVALUACION')),
  CONSTRAINT chk_eval_estado CHECK (estado IN ('BORRADOR', 'EN_CURSO', 'ENTREGADA', 'EVALUADA', 'ANULADA')),
  CONSTRAINT chk_eval_puntaje CHECK (puntaje_total IS NULL OR (puntaje_total >= 0 AND puntaje_total <= 100)),
  CONSTRAINT chk_eval_fechas CHECK (
    (entrega IS NULL OR entrega >= inicio) AND
    (evaluado_en IS NULL OR (entrega IS NOT NULL AND evaluado_en >= entrega))
  )
);

-- Indexes for common queries
CREATE INDEX idx_evaluaciones_desafio ON evaluaciones(desafio_id);
CREATE INDEX idx_evaluaciones_candidato ON evaluaciones(candidato_id);
CREATE INDEX idx_evaluaciones_asignacion ON evaluaciones(asignacion_id) WHERE asignacion_id IS NOT NULL;
CREATE INDEX idx_evaluaciones_ranking ON evaluaciones(asignacion_id, puntaje_total DESC) WHERE estado = 'EVALUADA';
CREATE INDEX idx_evaluaciones_estado ON evaluaciones(estado);
CREATE INDEX idx_evaluaciones_feedback_gin ON evaluaciones USING GIN (reporte_feedback);

-- Trigger to automatically update updated_at
CREATE TRIGGER trg_evaluaciones_updated_at
  BEFORE UPDATE ON evaluaciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE evaluaciones IS 'Candidate evaluations and submissions';
COMMENT ON COLUMN evaluaciones.id IS 'UUID primary key';
COMMENT ON COLUMN evaluaciones.desafio_id IS 'Reference to challenge';
COMMENT ON COLUMN evaluaciones.candidato_id IS 'Reference to candidate user';
COMMENT ON COLUMN evaluaciones.asignacion_id IS 'Reference to assignment (null for self-evaluation)';
COMMENT ON COLUMN evaluaciones.codigo_entregado IS 'Submitted code';
COMMENT ON COLUMN evaluaciones.lenguaje IS 'Programming language';
COMMENT ON COLUMN evaluaciones.puntaje_total IS 'Total score (0-100)';
COMMENT ON COLUMN evaluaciones.reporte_feedback IS 'Evaluation feedback report (JSONB)';
COMMENT ON COLUMN evaluaciones.contexto IS 'Context: CORPORATIVO, ACADEMICO, AUTOEVALUACION';
COMMENT ON COLUMN evaluaciones.minutos_empleados IS 'Time spent in minutes';
COMMENT ON COLUMN evaluaciones.estado IS 'Status: BORRADOR, EN_CURSO, ENTREGADA, EVALUADA, ANULADA';
COMMENT ON COLUMN evaluaciones.inicio IS 'Start timestamp';
COMMENT ON COLUMN evaluaciones.entrega IS 'Submission timestamp';
COMMENT ON COLUMN evaluaciones.evaluado_en IS 'Evaluation completion timestamp';

-- Log successful creation
DO $$
BEGIN
  RAISE NOTICE 'Table evaluaciones created successfully';
END $$;

-- Made with Bob