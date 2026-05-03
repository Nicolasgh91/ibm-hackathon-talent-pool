-- =============================================================================
-- V021: Seed canonical prompt_versiones used by Phase B AiServices
-- =============================================================================
-- Adds the two prompt rows that Phase B's real LLM wiring will look up at
-- runtime. `generador_desafio` is intentionally NOT inserted here because
-- V013 already seeds an ACTIVA row for it; promoting the demo seed to a
-- canonical row is left to a future migration that supersedes V013 in prod.
--
-- All inserts are idempotent on (nombre, version_semver) so re-running on a
-- pre-existing database (CI / local dev) is safe.
-- Source: product/DATABASE.md §3.8
-- =============================================================================

INSERT INTO prompt_versiones
  (id, nombre, version_semver, plantilla, variables_esperadas, estado, notas_cambio, created_at)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'evaluador_codigo',
  '1.0.0',
  $PV$You are a senior technical evaluator. Score the submitted code against the
provided rubric and respond with a strict JSON object:
{ "puntaje": <0-100>, "feedback": <string>, "dimensiones": [<{nombre, puntaje, peso, justificacion}>] }
Inputs:
- enunciado: {{enunciado}}
- rubrica: {{rubrica}}
- codigo: {{codigo}}
- lenguaje: {{lenguaje}}
$PV$,
  '["enunciado","rubrica","codigo","lenguaje"]'::jsonb,
  'ACTIVA',
  'Initial canonical evaluator prompt (UC-017).',
  NOW()
)
ON CONFLICT (nombre, version_semver) DO NOTHING;

INSERT INTO prompt_versiones
  (id, nombre, version_semver, plantilla, variables_esperadas, estado, notas_cambio, created_at)
VALUES (
  '66666666-6666-6666-6666-666666666666',
  'juez_evals',
  '1.0.0',
  $PV$You are an LLM-as-judge for the Talent Pool eval suite. Compare the candidate
output to the reference output and return a JSON object:
{ "veredicto": "PASS"|"FAIL", "razon": <string>, "score": <0-1> }
Inputs:
- caso: {{caso}}
- referencia: {{referencia}}
- candidato: {{candidato}}
$PV$,
  '["caso","referencia","candidato"]'::jsonb,
  'EXPERIMENTAL',
  'Initial judge prompt for evals harness (Phase E).',
  NOW()
)
ON CONFLICT (nombre, version_semver) DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE 'Canonical prompt versions seeded (evaluador_codigo, juez_evals)';
END $$;
