-- =============================================================================
-- V008: Create asignaciones_desafio table
-- =============================================================================
-- Creates the asignaciones_desafio table for challenge assignments to contexts
-- Based on product/DATABASE.md §3.4
-- =============================================================================

CREATE TABLE asignaciones_desafio (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desafio_id      UUID NOT NULL REFERENCES desafios(id) ON DELETE RESTRICT,
  puesto_id       UUID REFERENCES puestos(id) ON DELETE CASCADE,
  curso_id        UUID,
  tipo            VARCHAR(20) NOT NULL,
  fecha_apertura  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_cierre    TIMESTAMPTZ,
  max_intentos    INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_asig_tipo CHECK (tipo IN ('PUESTO', 'CURSO', 'PUBLICO')),
  CONSTRAINT chk_asig_target CHECK (
    (tipo = 'PUESTO' AND puesto_id IS NOT NULL AND curso_id IS NULL) OR
    (tipo = 'CURSO' AND curso_id IS NOT NULL AND puesto_id IS NULL) OR
    (tipo = 'PUBLICO' AND puesto_id IS NULL AND curso_id IS NULL)
  ),
  CONSTRAINT chk_asig_fechas CHECK (fecha_cierre IS NULL OR fecha_cierre > fecha_apertura),
  CONSTRAINT chk_asig_intentos CHECK (max_intentos > 0 AND max_intentos <= 10)
);

-- Indexes for common queries
CREATE INDEX idx_asignaciones_desafio ON asignaciones_desafio(desafio_id);
CREATE INDEX idx_asignaciones_puesto ON asignaciones_desafio(puesto_id) WHERE puesto_id IS NOT NULL;
CREATE INDEX idx_asignaciones_curso ON asignaciones_desafio(curso_id) WHERE curso_id IS NOT NULL;
CREATE INDEX idx_asignaciones_ventana ON asignaciones_desafio(fecha_apertura, fecha_cierre);

-- Add comments for documentation
COMMENT ON TABLE asignaciones_desafio IS 'Challenge assignments to specific contexts (position, course, or public)';
COMMENT ON COLUMN asignaciones_desafio.id IS 'UUID primary key';
COMMENT ON COLUMN asignaciones_desafio.desafio_id IS 'Reference to challenge';
COMMENT ON COLUMN asignaciones_desafio.puesto_id IS 'Reference to position (if tipo=PUESTO)';
COMMENT ON COLUMN asignaciones_desafio.curso_id IS 'Reference to course (if tipo=CURSO)';
COMMENT ON COLUMN asignaciones_desafio.tipo IS 'Assignment type: PUESTO, CURSO, PUBLICO';
COMMENT ON COLUMN asignaciones_desafio.fecha_apertura IS 'Opening date for submissions';
COMMENT ON COLUMN asignaciones_desafio.fecha_cierre IS 'Closing date for submissions';
COMMENT ON COLUMN asignaciones_desafio.max_intentos IS 'Maximum attempts allowed per candidate';

-- Log successful creation
DO $$
BEGIN
  RAISE NOTICE 'Table asignaciones_desafio created successfully';
END $$;

-- Made with Bob