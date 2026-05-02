-- =============================================================================
-- V005: Create puestos table
-- =============================================================================
-- Creates the puestos (job positions) table for corporate recruiting
-- Based on product/DATABASE.md §3.3
-- =============================================================================

CREATE TABLE puestos (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizacion_id       UUID NOT NULL REFERENCES organizaciones(id) ON DELETE RESTRICT,
  reclutador_id         UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  titulo                VARCHAR(200) NOT NULL,
  tecnologia_principal  VARCHAR(100) NOT NULL,
  seniority             VARCHAR(20) NOT NULL,
  descripcion           TEXT,
  estado                VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_puesto_seniority CHECK (seniority IN ('TRAINEE', 'JR', 'SSR', 'SR', 'LEAD')),
  CONSTRAINT chk_puesto_estado CHECK (estado IN ('BORRADOR', 'ABIERTO', 'PAUSADO', 'CERRADO'))
);

-- Indexes for common queries
CREATE INDEX idx_puestos_organizacion ON puestos(organizacion_id);
CREATE INDEX idx_puestos_reclutador ON puestos(reclutador_id);
CREATE INDEX idx_puestos_estado ON puestos(estado) WHERE estado = 'ABIERTO';
CREATE INDEX idx_puestos_tecnologia ON puestos(tecnologia_principal, seniority);

-- Trigger to automatically update updated_at
CREATE TRIGGER trg_puestos_updated_at
  BEFORE UPDATE ON puestos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE puestos IS 'Job positions for corporate recruiting';
COMMENT ON COLUMN puestos.id IS 'UUID primary key';
COMMENT ON COLUMN puestos.organizacion_id IS 'Reference to organization';
COMMENT ON COLUMN puestos.reclutador_id IS 'Reference to recruiter user';
COMMENT ON COLUMN puestos.titulo IS 'Position title';
COMMENT ON COLUMN puestos.tecnologia_principal IS 'Main technology required';
COMMENT ON COLUMN puestos.seniority IS 'Seniority level: TRAINEE, JR, SSR, SR, LEAD';
COMMENT ON COLUMN puestos.descripcion IS 'Position description';
COMMENT ON COLUMN puestos.estado IS 'Status: BORRADOR, ABIERTO, PAUSADO, CERRADO';

-- Log successful creation
DO $$
BEGIN
  RAISE NOTICE 'Table puestos created successfully';
END $$;

-- Made with Bob