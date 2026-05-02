-- =============================================================================
-- V003: Create organizaciones table
-- =============================================================================
-- Creates the organizaciones (organizations) table for multi-tenancy
-- Based on product/DATABASE.md §3.1
-- =============================================================================

CREATE TABLE organizaciones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          VARCHAR(200) NOT NULL,
  tipo            VARCHAR(20) NOT NULL,
  plan            VARCHAR(20) NOT NULL DEFAULT 'FREE',
  dominio_email   VARCHAR(255),
  logo_url        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_org_tipo CHECK (tipo IN ('EMPRESA', 'INSTITUCION')),
  CONSTRAINT chk_org_plan CHECK (plan IN ('FREE', 'PRO', 'ENTERPRISE'))
);

-- Unique index for email domain (when not null)
CREATE UNIQUE INDEX idx_organizaciones_dominio
  ON organizaciones(dominio_email)
  WHERE dominio_email IS NOT NULL;

-- Index for organization type
CREATE INDEX idx_organizaciones_tipo ON organizaciones(tipo);

-- Trigger to automatically update updated_at
CREATE TRIGGER trg_organizaciones_updated_at
  BEFORE UPDATE ON organizaciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE organizaciones IS 'Organizations (companies or educational institutions)';
COMMENT ON COLUMN organizaciones.id IS 'UUID primary key';
COMMENT ON COLUMN organizaciones.nombre IS 'Organization name';
COMMENT ON COLUMN organizaciones.tipo IS 'Organization type: EMPRESA or INSTITUCION';
COMMENT ON COLUMN organizaciones.plan IS 'Subscription plan: FREE, PRO, or ENTERPRISE';
COMMENT ON COLUMN organizaciones.dominio_email IS 'Email domain for auto-suggesting membership';
COMMENT ON COLUMN organizaciones.logo_url IS 'Optional logo URL';

-- Log successful creation
DO $$
BEGIN
  RAISE NOTICE 'Table organizaciones created successfully';
END $$;

-- Made with Bob