-- =============================================================================
-- V017: Extend desafios for UC-007 evaluation plans and UC-026 integrator
-- =============================================================================
-- Adds the columns that turn `desafios` into nodes of an evaluation plan
-- (UC-007: 3-5 challenges per plan_evaluacion_id summing 100% peso) and the
-- two-course link required by UC-026 integrator challenges.
-- Also relaxes contexto_origen to accept ACADEMICO_INTEGRADOR.
-- Source: product/DATABASE.md §3.4
-- =============================================================================

ALTER TABLE desafios
  ADD COLUMN IF NOT EXISTS plan_evaluacion_id UUID,
  ADD COLUMN IF NOT EXISTS tipo_desafio       VARCHAR(30),
  ADD COLUMN IF NOT EXISTS peso               NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS cursos_integrados  JSONB;

ALTER TABLE desafios
  DROP CONSTRAINT IF EXISTS chk_desafio_contexto;

ALTER TABLE desafios
  ADD CONSTRAINT chk_desafio_contexto
    CHECK (contexto_origen IN ('CORPORATIVO', 'ACADEMICO', 'BIBLIOTECA', 'ACADEMICO_INTEGRADOR'));

ALTER TABLE desafios
  ADD CONSTRAINT chk_desafio_tipo
    CHECK (
      tipo_desafio IS NULL
      OR tipo_desafio IN ('TECNICO_PURO', 'TECNICO_CON_STACK', 'COMUNICACION', 'DOCUMENTACION', 'INTEGRACION')
    );

ALTER TABLE desafios
  ADD CONSTRAINT chk_desafio_peso
    CHECK (peso IS NULL OR (peso >= 0 AND peso <= 100));

CREATE INDEX IF NOT EXISTS idx_desafios_plan_evaluacion
  ON desafios(plan_evaluacion_id)
  WHERE plan_evaluacion_id IS NOT NULL;

COMMENT ON COLUMN desafios.plan_evaluacion_id
  IS 'UC-007: shared UUID across the 3-5 desafios of a single evaluation plan; sum of peso must equal 100';
COMMENT ON COLUMN desafios.tipo_desafio
  IS 'UC-007 challenge category: TECNICO_PURO|TECNICO_CON_STACK|COMUNICACION|DOCUMENTACION|INTEGRACION';
COMMENT ON COLUMN desafios.peso
  IS 'UC-007 weight (0-100); sum per plan_evaluacion_id must equal 100 (validated at service layer)';
COMMENT ON COLUMN desafios.cursos_integrados
  IS 'UC-026: JSON array with exactly two cursos.id values when contexto_origen=ACADEMICO_INTEGRADOR';
