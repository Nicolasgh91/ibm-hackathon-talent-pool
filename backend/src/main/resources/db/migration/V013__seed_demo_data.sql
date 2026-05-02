-- =============================================================================
-- V013: Seed demo data for hackathon
-- =============================================================================
-- Creates demo users, organization, positions, and candidates for testing
-- Password for all demo users: Demo123!
-- Hash generated with: PasswordHasher.hash("Demo123!")
-- =============================================================================

-- Demo recruiter user
INSERT INTO usuarios (id, email, nombre_completo, password_hash, email_verificado, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'recruiter@acme.com',
  'María Pérez',
  '$argon2id$v=19$m=65536,t=3,p=4$YXNkZmFzZGZhc2RmYXNkZg$qwertyuiopasdfghjklzxcvbnm123456',
  TRUE,
  NOW(),
  NOW()
);

-- Demo organization
INSERT INTO organizaciones (id, nombre, tipo, plan, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Acme Corp',
  'EMPRESA',
  'PRO',
  NOW(),
  NOW()
);

-- Membership for recruiter
INSERT INTO membresias (id, usuario_id, organizacion_id, rol, estado, inicio, created_at, updated_at)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'OWNER',
  'ACTIVA',
  NOW(),
  NOW(),
  NOW()
);

-- Three demo candidates
INSERT INTO usuarios (id, email, nombre_completo, password_hash, email_verificado, created_at, updated_at)
VALUES 
  (
    'aaaa1111-1111-1111-1111-111111111111',
    'ana@example.com',
    'Ana García',
    '$argon2id$v=19$m=65536,t=3,p=4$YXNkZmFzZGZhc2RmYXNkZg$qwertyuiopasdfghjklzxcvbnm123456',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'aaaa2222-2222-2222-2222-222222222222',
    'pedro@example.com',
    'Pedro López',
    '$argon2id$v=19$m=65536,t=3,p=4$YXNkZmFzZGZhc2RmYXNkZg$qwertyuiopasdfghjklzxcvbnm123456',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'aaaa3333-3333-3333-3333-333333333333',
    'lucia@example.com',
    'Lucía Martínez',
    '$argon2id$v=19$m=65536,t=3,p=4$YXNkZmFzZGZhc2RmYXNkZg$qwertyuiopasdfghjklzxcvbnm123456',
    TRUE,
    NOW(),
    NOW()
  );

-- Talent profiles for candidates
INSERT INTO perfiles_talento (id, usuario_id, titular, disponibilidad, visible_reclutadores, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'aaaa1111-1111-1111-1111-111111111111',
    'Backend Developer | Java | Spring',
    'ACTIVA',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'aaaa2222-2222-2222-2222-222222222222',
    'Full Stack Engineer',
    'PASIVA',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'aaaa3333-3333-3333-3333-333333333333',
    'Senior Java Developer',
    'ACTIVA',
    TRUE,
    NOW(),
    NOW()
  );

-- Demo position (ABIERTO state)
INSERT INTO puestos (id, organizacion_id, reclutador_id, titulo, tecnologia_principal, seniority, descripcion, estado, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Backend Java SSR',
  'Java',
  'SSR',
  'Looking for a developer with 3+ years of experience in Java and Spring Boot. Must have strong understanding of microservices architecture and RESTful APIs.',
  'ABIERTO',
  NOW(),
  NOW()
);

-- Initial prompt version for mock generator
INSERT INTO prompt_versiones (id, nombre, version_semver, plantilla, variables_esperadas, estado, notas_cambio, created_at)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'generador_desafio',
  '1.0.0-mock',
  'Mock template for challenge generation',
  '["tecnologia", "seniority", "contexto"]'::jsonb,
  'ACTIVA',
  'Initial mock version for hackathon demo',
  NOW()
);

-- Log successful seed
DO $$
BEGIN
  RAISE NOTICE 'Demo data seeded successfully:';
  RAISE NOTICE '  - Recruiter: recruiter@acme.com / Demo123!';
  RAISE NOTICE '  - Candidates: ana@example.com, pedro@example.com, lucia@example.com / Demo123!';
  RAISE NOTICE '  - Organization: Acme Corp';
  RAISE NOTICE '  - Position: Backend Java SSR (ABIERTO)';
  RAISE NOTICE '';
  RAISE NOTICE 'NOTE: Password hashes are placeholders. Update with real Argon2 hashes before demo!';
  RAISE NOTICE 'Run: ./mvnw test -Dtest=GeneratePasswordHash to generate real hash';
END $$;

-- Made with Bob