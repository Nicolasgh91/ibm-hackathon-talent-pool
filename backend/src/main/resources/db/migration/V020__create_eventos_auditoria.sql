-- =============================================================================
-- V020: Create eventos_auditoria table for immutable audit log
-- =============================================================================
-- Append-only log of security-relevant actions. Indispensable for legal
-- disputes, compliance reviews, and post-incident forensics. Per DATABASE.md
-- §3.8 there are NO updates and NO deletes; rotation/retention is a Phase 3
-- concern handled outside the schema.
-- Source: product/DATABASE.md §3.8 (table eventos_auditoria)
-- =============================================================================

CREATE TABLE eventos_auditoria (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  accion           VARCHAR(100) NOT NULL,
  entidad_tipo    VARCHAR(50)  NOT NULL,
  entidad_id      UUID         NOT NULL,
  metadata_evento JSONB        NOT NULL DEFAULT '{}'::jsonb,
  -- VARCHAR(45) covers IPv4-mapped IPv6 ("::ffff:192.0.2.1") plus zone suffix
  -- (e.g. "fe80::1%eth0"). Postgres `inet` would be more precise but requires
  -- a Hibernate custom type and we never use inet-specific operators here.
  ip_origen       VARCHAR(45),
  user_agent      TEXT,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_entidad  ON eventos_auditoria(entidad_tipo, entidad_id);
CREATE INDEX idx_audit_actor    ON eventos_auditoria(actor_usuario_id) WHERE actor_usuario_id IS NOT NULL;
CREATE INDEX idx_audit_accion   ON eventos_auditoria(accion);
CREATE INDEX idx_audit_temporal ON eventos_auditoria(created_at);

COMMENT ON TABLE eventos_auditoria
  IS 'Append-only audit log; NEVER UPDATE/DELETE. Retention policy lives in runbooks.';
COMMENT ON COLUMN eventos_auditoria.actor_usuario_id
  IS 'Nullable so system jobs (no human actor) can still write rows';
COMMENT ON COLUMN eventos_auditoria.accion
  IS 'Canonical dotted action name (e.g. usuario.login_exitoso, desafio.publicado)';
COMMENT ON COLUMN eventos_auditoria.metadata_evento
  IS 'Structured JSON payload; never put raw secrets here (see DATABASE.md §8.1)';
