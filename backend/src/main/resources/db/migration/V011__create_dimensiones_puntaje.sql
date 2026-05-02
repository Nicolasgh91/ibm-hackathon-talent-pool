-- =============================================================================
-- V011: Create dimensiones_puntaje table
-- =============================================================================
-- Creates the dimensiones_puntaje table for multi-dimensional scoring
-- Based on product/DATABASE.md §3.4
-- =============================================================================

CREATE TABLE dimensiones_puntaje (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluacion_id   UUID NOT NULL REFERENCES evaluaciones(id) ON DELETE CASCADE,
  nombre          VARCHAR(50) NOT NULL,
  puntaje         DECIMAL(5,2) NOT NULL,
  peso            DECIMAL(3,2) NOT NULL,
  justificacion   TEXT,
  
  CONSTRAINT chk_dim_puntaje CHECK (puntaje >= 0 AND puntaje <= 100),
  CONSTRAINT chk_dim_peso CHECK (peso > 0 AND peso <= 1)
);

-- Unique constraint: one dimension per name per evaluation
CREATE UNIQUE INDEX idx_dim_unica ON dimensiones_puntaje(evaluacion_id, nombre);

-- Index for querying dimensions by evaluation
CREATE INDEX idx_dim_evaluacion ON dimensiones_puntaje(evaluacion_id);

-- Add comments for documentation
COMMENT ON TABLE dimensiones_puntaje IS 'Multi-dimensional score breakdown for evaluations';
COMMENT ON COLUMN dimensiones_puntaje.id IS 'UUID primary key';
COMMENT ON COLUMN dimensiones_puntaje.evaluacion_id IS 'Reference to evaluation';
COMMENT ON COLUMN dimensiones_puntaje.nombre IS 'Dimension name (e.g., LOGICA, EFICIENCIA, ESTILO, PRACTICAS)';
COMMENT ON COLUMN dimensiones_puntaje.puntaje IS 'Score for this dimension (0-100)';
COMMENT ON COLUMN dimensiones_puntaje.peso IS 'Weight of this dimension (0-1, sum should be 1.0)';
COMMENT ON COLUMN dimensiones_puntaje.justificacion IS 'Justification text for the score';

-- Log successful creation
DO $$
BEGIN
  RAISE NOTICE 'Table dimensiones_puntaje created successfully';
END $$;

-- Made with Bob