-- Optional marketing/description text for organizations (UC-004, aligns with frontend Organization.descripcion)
ALTER TABLE organizaciones
  ADD COLUMN IF NOT EXISTS descripcion TEXT;

COMMENT ON COLUMN organizaciones.descripcion IS 'Optional description shown in create/edit organization UI';
