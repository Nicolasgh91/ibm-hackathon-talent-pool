-- =============================================================================
-- V014: Seed demo student account (Phase 5 academic flow)
-- =============================================================================
-- Adds an ESTUDIANTE-friendly user so the frontend /student/* demo flow can be
-- exercised without going through /register first. Password is the same as
-- V013 demo accounts: Demo123! (hash reused verbatim from V013).
--
-- Idempotency: ON CONFLICT (email) DO NOTHING so this migration is safe to run
-- on databases where the email already exists (e.g. manual reseed).
-- =============================================================================

INSERT INTO usuarios (id, email, nombre_completo, password_hash, email_verificado, created_at, updated_at)
VALUES (
  'aaaa4444-4444-4444-4444-444444444444',
  'estudiante@example.com',
  'Sofía Estudiante',
  '$argon2id$v=19$m=65536,t=3,p=4$SVB3cgVwJY8otpobRu1gdg$ulDluIb0FtKDH3ai/F6J96t6z2G9LrJRQjG/akxgmOs',
  TRUE,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- The ESTUDIANTE role lives in the frontend (localStorage tp_role_<email>)
-- because the backend has no user-level role yet. No membresia/perfil needed
-- for the mock /student/* flow (see TECH_DEBT.md TD-004).

DO $$
BEGIN
  RAISE NOTICE 'Demo student seeded: estudiante@example.com / Demo123!';
END $$;

-- Made with Bob
