-- =============================================================================
-- V018: Create evaluaciones_versiones table for UC-017 autosave
-- =============================================================================
-- Snapshot history of a candidate's code during a challenge evaluation.
-- Enables autosave (every 30s or on significant change), reconstruction of
-- the resolution timeline, and audit / fraud-detection queries.
-- Source: product/DATABASE.md §3.4 (table evaluaciones_versiones)
-- =============================================================================

CREATE TABLE evaluaciones_versiones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluacion_id   UUID NOT NULL REFERENCES evaluaciones(id) ON DELETE CASCADE,
  codigo_snapshot TEXT NOT NULL,
  numero_version  INTEGER NOT NULL,
  tipo_evento     VARCHAR(20) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_evver_tipo CHECK (tipo_evento IN ('AUTOSAVE', 'ENTREGA', 'INICIO')),
  CONSTRAINT chk_evver_num  CHECK (numero_version > 0)
);

CREATE UNIQUE INDEX idx_evver_unico       ON evaluaciones_versiones(evaluacion_id, numero_version);
CREATE        INDEX idx_evver_evaluacion ON evaluaciones_versiones(evaluacion_id, created_at DESC);

COMMENT ON TABLE evaluaciones_versiones
  IS 'Per-evaluation code snapshots (autosave/entrega/inicio) for UC-017 reconstruction';
COMMENT ON COLUMN evaluaciones_versiones.tipo_evento
  IS 'INICIO = first snapshot when starting; AUTOSAVE = periodic; ENTREGA = formal submission';
COMMENT ON COLUMN evaluaciones_versiones.numero_version
  IS 'Monotonically increasing per evaluacion_id; enforced unique with idx_evver_unico';
