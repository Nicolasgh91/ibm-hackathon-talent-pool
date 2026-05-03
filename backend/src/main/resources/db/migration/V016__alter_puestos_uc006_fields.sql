-- =============================================================================
-- V016: Extend puestos for UC-006 complete profile
-- =============================================================================
-- Adds the structured profile fields required by UC-006 and consumed by
-- UC-007 (challenge plan) / UC-023 (practice roadmap). The roadmap visibility
-- flag governs whether the public roadmap card shows on the position page.
-- Source: product/DATABASE.md §3.3
-- =============================================================================

ALTER TABLE puestos
  ADD COLUMN IF NOT EXISTS herramientas               JSONB   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS skills_tecnicas            JSONB   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS skills_blandas             JSONB   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS roadmap_publico_habilitado BOOLEAN NOT NULL DEFAULT TRUE;

COMMENT ON COLUMN puestos.herramientas
  IS 'JSONB array of named tools (e.g. ["Spring Boot","PostgreSQL"]); UC-006 requires >=1';
COMMENT ON COLUMN puestos.skills_tecnicas
  IS 'JSONB array of technical skill objects {nombre, nivel}; UC-006 requires >=3';
COMMENT ON COLUMN puestos.skills_blandas
  IS 'JSONB array of soft-skill labels; optional';
COMMENT ON COLUMN puestos.roadmap_publico_habilitado
  IS 'When FALSE the practice roadmap (UC-023) is hidden from the public position page';
