-- =============================================================================
-- V012: Create perfiles_talento table
-- =============================================================================
-- Creates the perfiles_talento table for candidate public profiles
-- Based on product/DATABASE.md §3.6
-- =============================================================================

CREATE TABLE perfiles_talento (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id            UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  titular               VARCHAR(200),
  bio                   TEXT,
  disponibilidad        VARCHAR(20) NOT NULL DEFAULT 'PASIVA',
  visible_publico       BOOLEAN NOT NULL DEFAULT FALSE,
  visible_reclutadores  BOOLEAN NOT NULL DEFAULT TRUE,
  preferencias_contacto JSONB NOT NULL DEFAULT '{}'::jsonb,
  ubicacion             VARCHAR(200),
  cv_url                TEXT,
  linkedin_url          TEXT,
  github_url            TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_perfil_disponibilidad CHECK (disponibilidad IN ('ACTIVA', 'PASIVA', 'NO_DISPONIBLE'))
);

-- Index for recruiter searches
CREATE INDEX idx_perfil_visible_reclutadores ON perfiles_talento(visible_reclutadores)
  WHERE visible_reclutadores = TRUE AND disponibilidad != 'NO_DISPONIBLE';

-- Index for availability
CREATE INDEX idx_perfil_disponibilidad ON perfiles_talento(disponibilidad);

-- Trigger to automatically update updated_at
CREATE TRIGGER trg_perfiles_talento_updated_at
  BEFORE UPDATE ON perfiles_talento
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE perfiles_talento IS 'Public talent profiles for candidates';
COMMENT ON COLUMN perfiles_talento.id IS 'UUID primary key';
COMMENT ON COLUMN perfiles_talento.usuario_id IS 'Reference to user (one-to-one)';
COMMENT ON COLUMN perfiles_talento.titular IS 'Profile headline';
COMMENT ON COLUMN perfiles_talento.bio IS 'Biography text';
COMMENT ON COLUMN perfiles_talento.disponibilidad IS 'Availability: ACTIVA, PASIVA, NO_DISPONIBLE';
COMMENT ON COLUMN perfiles_talento.visible_publico IS 'Visible to public (default FALSE)';
COMMENT ON COLUMN perfiles_talento.visible_reclutadores IS 'Visible to recruiters (default TRUE, opt-out)';
COMMENT ON COLUMN perfiles_talento.preferencias_contacto IS 'Contact preferences (JSONB)';
COMMENT ON COLUMN perfiles_talento.ubicacion IS 'Location';
COMMENT ON COLUMN perfiles_talento.cv_url IS 'CV/Resume URL';
COMMENT ON COLUMN perfiles_talento.linkedin_url IS 'LinkedIn profile URL';
COMMENT ON COLUMN perfiles_talento.github_url IS 'GitHub profile URL';

-- Log successful creation
DO $$
BEGIN
  RAISE NOTICE 'Table perfiles_talento created successfully';
END $$;

-- Made with Bob