-- =============================================================================
-- V004: Create membresias table
-- =============================================================================
-- Creates the membresias (memberships) table for user-organization relationships
-- Based on product/DATABASE.md §3.1
-- =============================================================================

CREATE TABLE membresias (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  organizacion_id UUID NOT NULL REFERENCES organizaciones(id) ON DELETE CASCADE,
  rol             VARCHAR(30) NOT NULL,
  estado          VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  inicio          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fin             TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_mem_rol CHECK (rol IN ('OWNER', 'RECLUTADOR', 'DOCENTE', 'ALUMNO', 'EMPLEADO', 'ADMIN')),
  CONSTRAINT chk_mem_estado CHECK (estado IN ('ACTIVA', 'SUSPENDIDA', 'REVOCADA')),
  CONSTRAINT chk_mem_fechas CHECK (fin IS NULL OR fin >= inicio)
);

-- A user cannot have two active memberships with the same role in the same organization
CREATE UNIQUE INDEX idx_membresias_unicas_activas
  ON membresias(usuario_id, organizacion_id, rol)
  WHERE estado = 'ACTIVA';

-- Indexes for common queries
CREATE INDEX idx_membresias_usuario ON membresias(usuario_id);
CREATE INDEX idx_membresias_organizacion ON membresias(organizacion_id);
CREATE INDEX idx_membresias_estado ON membresias(estado) WHERE estado = 'ACTIVA';

-- Trigger to automatically update updated_at
CREATE TRIGGER trg_membresias_updated_at
  BEFORE UPDATE ON membresias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE membresias IS 'User-organization memberships with roles';
COMMENT ON COLUMN membresias.id IS 'UUID primary key';
COMMENT ON COLUMN membresias.usuario_id IS 'Reference to user';
COMMENT ON COLUMN membresias.organizacion_id IS 'Reference to organization';
COMMENT ON COLUMN membresias.rol IS 'Role: OWNER, RECLUTADOR, DOCENTE, ALUMNO, EMPLEADO, ADMIN';
COMMENT ON COLUMN membresias.estado IS 'Status: ACTIVA, SUSPENDIDA, REVOCADA';
COMMENT ON COLUMN membresias.inicio IS 'Membership start date';
COMMENT ON COLUMN membresias.fin IS 'Membership end date (null if active)';

-- Log successful creation
DO $$
BEGIN
  RAISE NOTICE 'Table membresias created successfully';
END $$;

-- Made with Bob