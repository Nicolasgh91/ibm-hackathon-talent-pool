-- =============================================================================
-- V002: Create usuarios table
-- =============================================================================
-- Creates the core usuarios (users) table for authentication and identity
-- Based on product/DATABASE.md §3.1
-- =============================================================================

CREATE TABLE usuarios (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             CITEXT NOT NULL UNIQUE,
  nombre_completo   VARCHAR(200) NOT NULL,
  password_hash     TEXT NOT NULL,
  foto_url          TEXT,
  email_verificado  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_usuarios_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_usuarios_nombre CHECK (LENGTH(TRIM(nombre_completo)) >= 2)
);

-- Index for email verification queries
CREATE INDEX idx_usuarios_email_verificado ON usuarios(email_verificado) WHERE email_verificado = FALSE;

-- Index for created_at (useful for analytics)
CREATE INDEX idx_usuarios_created_at ON usuarios(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trg_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE usuarios IS 'Core user accounts table for authentication and identity';
COMMENT ON COLUMN usuarios.id IS 'UUID primary key';
COMMENT ON COLUMN usuarios.email IS 'Case-insensitive email address (unique)';
COMMENT ON COLUMN usuarios.nombre_completo IS 'Full name of the user';
COMMENT ON COLUMN usuarios.password_hash IS 'Argon2id password hash';
COMMENT ON COLUMN usuarios.foto_url IS 'Optional profile photo URL';
COMMENT ON COLUMN usuarios.email_verificado IS 'Email verification status';
COMMENT ON COLUMN usuarios.created_at IS 'Account creation timestamp (UTC)';
COMMENT ON COLUMN usuarios.updated_at IS 'Last update timestamp (UTC)';

-- Log successful creation
DO $$
BEGIN
  RAISE NOTICE 'Table usuarios created successfully with:';
  RAISE NOTICE '  - UUID primary key with automatic generation';
  RAISE NOTICE '  - CITEXT email for case-insensitive uniqueness';
  RAISE NOTICE '  - Automatic updated_at trigger';
  RAISE NOTICE '  - Email format validation constraint';
  RAISE NOTICE '  - Indexes for email_verificado and created_at';
END $$;

-- Made with Bob
