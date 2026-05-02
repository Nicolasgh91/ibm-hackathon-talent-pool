-- =============================================================================
-- V009: Create invitaciones_desafio table
-- =============================================================================
-- Creates the invitaciones_desafio table for candidate invitations
-- Based on product/DATABASE.md §3.4
-- =============================================================================

CREATE TABLE invitaciones_desafio (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asignacion_id         UUID NOT NULL REFERENCES asignaciones_desafio(id) ON DELETE CASCADE,
  emisor_usuario_id     UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  email_invitado        CITEXT NOT NULL,
  usuario_invitado_id   UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  token                 VARCHAR(64) NOT NULL UNIQUE,
  estado                VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  expira_en             TIMESTAMPTZ NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_inv_estado CHECK (estado IN ('PENDIENTE', 'ACEPTADA', 'EXPIRADA', 'REVOCADA')),
  CONSTRAINT chk_inv_expira CHECK (expira_en > created_at)
);

-- Indexes for common queries
CREATE INDEX idx_invitaciones_asignacion ON invitaciones_desafio(asignacion_id);
CREATE INDEX idx_invitaciones_email ON invitaciones_desafio(email_invitado);
CREATE INDEX idx_invitaciones_usuario ON invitaciones_desafio(usuario_invitado_id) WHERE usuario_invitado_id IS NOT NULL;
CREATE INDEX idx_invitaciones_pendientes ON invitaciones_desafio(estado, expira_en) WHERE estado = 'PENDIENTE';
CREATE INDEX idx_invitaciones_token ON invitaciones_desafio(token);

-- Trigger to automatically update updated_at
CREATE TRIGGER trg_invitaciones_updated_at
  BEFORE UPDATE ON invitaciones_desafio
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE invitaciones_desafio IS 'Challenge invitations sent to candidates';
COMMENT ON COLUMN invitaciones_desafio.id IS 'UUID primary key';
COMMENT ON COLUMN invitaciones_desafio.asignacion_id IS 'Reference to challenge assignment';
COMMENT ON COLUMN invitaciones_desafio.emisor_usuario_id IS 'User who sent the invitation';
COMMENT ON COLUMN invitaciones_desafio.email_invitado IS 'Email address of invited candidate';
COMMENT ON COLUMN invitaciones_desafio.usuario_invitado_id IS 'User ID if candidate has registered';
COMMENT ON COLUMN invitaciones_desafio.token IS 'Unique 64-char token for invitation link';
COMMENT ON COLUMN invitaciones_desafio.estado IS 'Status: PENDIENTE, ACEPTADA, EXPIRADA, REVOCADA';
COMMENT ON COLUMN invitaciones_desafio.expira_en IS 'Expiration timestamp';

-- Log successful creation
DO $$
BEGIN
  RAISE NOTICE 'Table invitaciones_desafio created successfully';
END $$;

-- Made with Bob