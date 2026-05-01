-- =============================================================================
-- Development Database Initialization Script
-- =============================================================================
-- This script runs automatically when Dev Services starts PostgreSQL
-- It creates necessary extensions and initial setup
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Verify extensions
SELECT extname, extversion FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto', 'citext', 'vector');

-- Create application user (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'talentpool') THEN
    CREATE USER talentpool WITH PASSWORD 'talentpool_dev_pass';
  END IF;
END
$$;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE talentpool_dev TO talentpool;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO talentpool;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO talentpool;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO talentpool;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO talentpool;

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'Development database initialized successfully';
  RAISE NOTICE 'Extensions: uuid-ossp, pgcrypto, citext, vector';
  RAISE NOTICE 'User: talentpool';
END
$$;

-- Made with Bob
