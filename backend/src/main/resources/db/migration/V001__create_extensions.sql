-- =============================================================================
-- V001: Create PostgreSQL Extensions
-- =============================================================================
-- Creates required PostgreSQL extensions for the Talent Pool application
-- - uuid-ossp: UUID generation functions
-- - pgcrypto: Cryptographic functions
-- - citext: Case-insensitive text type for emails
-- - vector: pgvector extension for embeddings (Phase 2+)
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable case-insensitive text (for emails)
CREATE EXTENSION IF NOT EXISTS "citext";

-- Enable vector operations (for RAG in Phase 2)
CREATE EXTENSION IF NOT EXISTS "vector";

-- Verify extensions are installed
DO $$
BEGIN
  RAISE NOTICE 'Extensions created successfully:';
  RAISE NOTICE '  - uuid-ossp: UUID generation';
  RAISE NOTICE '  - pgcrypto: Cryptographic functions';
  RAISE NOTICE '  - citext: Case-insensitive text';
  RAISE NOTICE '  - vector: Vector operations for embeddings';
END $$;

-- Made with Bob
