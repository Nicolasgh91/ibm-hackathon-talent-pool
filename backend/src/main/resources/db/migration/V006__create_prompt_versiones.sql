-- =============================================================================
-- V006: Create prompt_versiones table
-- =============================================================================
-- Creates the prompt_versiones table for LLM prompt versioning and traceability
-- Based on product/DATABASE.md §3.8
-- Must be created before desafios table (FK dependency)
-- =============================================================================

CREATE TABLE prompt_versiones (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre              VARCHAR(100) NOT NULL,
  version_semver      VARCHAR(20) NOT NULL,
  plantilla           TEXT NOT NULL,
  variables_esperadas JSONB NOT NULL DEFAULT '[]'::jsonb,
  estado              VARCHAR(20) NOT NULL DEFAULT 'EXPERIMENTAL',
  notas_cambio        TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_prompt_estado CHECK (estado IN ('EXPERIMENTAL', 'ACTIVA', 'DEPRECADA'))
);

-- Only ONE active version per prompt name
CREATE UNIQUE INDEX idx_prompt_nombre_version ON prompt_versiones(nombre, version_semver);
CREATE UNIQUE INDEX idx_prompt_activa ON prompt_versiones(nombre)
  WHERE estado = 'ACTIVA';

-- Index for querying by state
CREATE INDEX idx_prompt_estado ON prompt_versiones(estado);

-- Add comments for documentation
COMMENT ON TABLE prompt_versiones IS 'LLM prompt versioning for reproducibility and traceability';
COMMENT ON COLUMN prompt_versiones.id IS 'UUID primary key';
COMMENT ON COLUMN prompt_versiones.nombre IS 'Prompt name (e.g., generador_desafio, evaluador_codigo)';
COMMENT ON COLUMN prompt_versiones.version_semver IS 'Semantic version (e.g., 1.0.0)';
COMMENT ON COLUMN prompt_versiones.plantilla IS 'Prompt template text';
COMMENT ON COLUMN prompt_versiones.variables_esperadas IS 'Expected variables as JSON array';
COMMENT ON COLUMN prompt_versiones.estado IS 'Status: EXPERIMENTAL, ACTIVA, DEPRECADA';
COMMENT ON COLUMN prompt_versiones.notas_cambio IS 'Change notes for this version';

-- Log successful creation
DO $$
BEGIN
  RAISE NOTICE 'Table prompt_versiones created successfully';
END $$;

-- Made with Bob