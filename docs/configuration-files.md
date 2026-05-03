# Quarkus Configuration Files - Complete Reference

> **Document Version**: 1.0  
> **Last Updated**: 2026-05-02  
> **Purpose**: Detailed configuration specifications for all environment profiles

---

## Demo Overrides (Hackathon)

Current demo-oriented runtime settings:
- CORS enabled for local frontend dev on ports **5173** and **3000**, both `localhost` and `127.0.0.1` (distinct browser origins), with credentials allowed. Override via `CORS_ORIGINS` only when needed; avoid setting it to an empty string or the allowlist becomes empty and every browser origin is rejected.
- LLM timeout reduced to `30s` for both Ollama and OpenAI model config.
- Added `app.llm.use-mock-llm` (`true` in dev, `false` in prod).
- Added `quarkus.langchain4j.chat-model.provider` explicit per profile.
- OpenAI: base YAML must not set `quarkus.langchain4j.openai.api-key` to empty (`${VAR:}`); dev uses `quarkus.langchain4j.openai.enable-integration=false`; prod sets `api-key` from `OPENAI_API_KEY`.
- Added `app.invitations.base-url` and `app.invitations.default-expiry-days`.

---

## Table of Contents

1. [File Structure](#file-structure)
2. [Base Configuration (application.yml)](#base-configuration)
3. [Development Profile (application-dev.yml)](#development-profile)
4. [Test Profile (application-test.yml)](#test-profile)
5. [Production Profile (application-prod.yml)](#production-profile)
6. [Docker Compose Fallback](#docker-compose-fallback)
7. [Environment Variables Reference](#environment-variables-reference)

---

## File Structure

```
backend/src/main/resources/
├── application.yml                    # Base configuration (all environments)
├── application-dev.yml                # Dev Services configuration
├── application-test.yml               # Integration test configuration
├── application-prod.yml               # Production configuration
├── application-staging.yml            # Staging configuration
└── db/migration/                      # Flyway migrations
    ├── V1__create_extensions.sql
    ├── V2__create_usuarios.sql
    └── ...
```

---

## Base Configuration

**File**: `backend/src/main/resources/application.yml`

This configuration is shared across all environments and contains common settings.

```yaml
# =============================================================================
# Talent Pool - Base Application Configuration
# =============================================================================
# This is the base configuration shared across all environments.
# Environment-specific overrides are in application-{profile}.yml files.
# =============================================================================

# Application Metadata
quarkus:
  application:
    name: talent-pool-api
    version: ${project.version:1.0.0-SNAPSHOT}
  
  # HTTP Configuration
  http:
    port: 8080
    host: 0.0.0.0
    cors:
      ~: true
      origins: ${CORS_ORIGINS:http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000}
      methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
      headers: accept,authorization,content-type,x-requested-with
      exposed-headers: Content-Disposition
      access-control-allow-credentials: true
      access-control-max-age: 86400
    
    # Request limits
    limits:
      max-body-size: 10M
      max-form-attribute-size: 2048
  
  # Logging Configuration
  log:
    level: INFO
    category:
      "com.talentpool": INFO
      "io.quarkus": INFO
      "org.hibernate": WARN
      "org.flywaydb": INFO
    console:
      enable: true
      format: "%d{yyyy-MM-dd HH:mm:ss,SSS} %-5p [%c{3.}] (%t) %s%e%n"
      color: true
    file:
      enable: false
      path: logs/application.log
      rotation:
        max-file-size: 10M
        max-backup-index: 5
  
  # Database Configuration (Base - overridden per environment)
  datasource:
    db-kind: postgresql
    username: ${DB_USERNAME:talentpool}
    password: ${DB_PASSWORD:changeme}
    jdbc:
      url: ${DB_JDBC_URL:jdbc:postgresql://localhost:5432/talentpool}
      min-size: 5
      max-size: 20
      acquisition-timeout: 10s
      background-validation-interval: 2m
      idle-removal-interval: 5m
      max-lifetime: 30m
      leak-detection-interval: 5m
      transaction-isolation-level: read-committed
  
  # Hibernate Configuration
  hibernate-orm:
    database:
      generation: none  # Flyway handles schema
    log:
      sql: false
      bind-parameters: false
    jdbc:
      statement-batch-size: 20
    fetch:
      batch-size: 16
    query:
      query-plan-cache-max-size: 2048
      default-null-ordering: last
  
  # Flyway Configuration
  flyway:
    migrate-at-start: true
    baseline-on-migrate: true
    baseline-version: 0
    locations: classpath:db/migration
    table: flyway_schema_history
    clean-at-start: false
    clean-disabled: true
    validate-on-migrate: true
    out-of-order: false
    ignore-missing-migrations: false
    placeholder-replacement: true
    placeholders:
      app_user: talentpool
  
  # Redis Configuration (Base - overridden per environment)
  redis:
    hosts: ${REDIS_URL:redis://localhost:6379}
    password: ${REDIS_PASSWORD:}
    database: 0
    timeout: 10s
    client-type: standalone
    max-pool-size: 20
    max-pool-waiting: 50
  
  # Cache Configuration
  cache:
    enabled: true
    type: redis
    redis:
      expire-after-write: 300s
      expire-after-access: 600s
      use-optimistic-locking: true
  
  # OpenAPI / Swagger Configuration
  smallrye-openapi:
    path: /openapi
    info-title: Talent Pool API
    info-version: ${quarkus.application.version}
    info-description: AI-Powered Technical Assessment Platform
    info-contact-name: Talent Pool Team
    info-license-name: TBD
    servers:
      - url: http://localhost:8080
        description: Development server
  
  swagger-ui:
    path: /swagger-ui
    always-include: true
    theme: flattop
    doc-expansion: list
    operations-sorter: alpha
  
  # Health Checks
  smallrye-health:
    root-path: /q/health
    liveness-path: /q/health/live
    readiness-path: /q/health/ready
    startup-path: /q/health/started
    ui:
      enable: true
      root-path: /q/health-ui
  
  # Metrics Configuration
  micrometer:
    enabled: true
    registry-enabled-default: true
    binder-enabled-default: true
    export:
      prometheus:
        enabled: true
        path: /q/metrics
  
  # OpenTelemetry Configuration
  otel:
    enabled: false  # Enable in production
    exporter:
      otlp:
        endpoint: ${OTEL_EXPORTER_OTLP_ENDPOINT:http://localhost:4317}
    service:
      name: ${quarkus.application.name}
    traces:
      sampler: parentbased_always_on

# (En el archivo real, JWT va en raíz, después del bloque app — ver application.yml)
smallrye:
  jwt:
    sign:
      key:
        location: privateKey.pem
    verify:
      publickey:
        location: publicKey.pem

mp:
  jwt:
    verify:
      issuer: talent-pool-api
      publickey:
        location: publicKey.pem

# =============================================================================
# LangChain4j Configuration (see application.yml — uses quarkus.langchain4j.*)
# =============================================================================
langchain4j:
  # OpenAI Configuration (Production)
  openai:
    # Production: use quarkus.langchain4j.openai.api-key=${OPENAI_API_KEY} in application-prod.yml (never empty default).
    base-url: https://api.openai.com/v1
    timeout: 60s
    max-retries: 3
    log-requests: false
    log-responses: false
    chat-model:
      model-name: gpt-4o-mini
      temperature: 0.3
      max-tokens: 2000
      top-p: 1.0
      frequency-penalty: 0.0
      presence-penalty: 0.0
  
  # Ollama Configuration (Development)
  ollama:
    base-url: ${OLLAMA_BASE_URL:http://localhost:11434}
    timeout: 60s
    log-requests: false
    log-responses: false
    chat-model:
      model-name: llama3.1
      temperature: 0.3
      num-predict: 2000
      top-p: 1.0
  
  # Embedding Model Configuration (for RAG - Phase 2)
  embedding-model:
    provider: openai
    model-name: text-embedding-3-small
    dimensions: 384

# =============================================================================
# Application-Specific Configuration
# =============================================================================
app:
  # LLM Cost Tracking
  llm:
    provider: ${LLM_PROVIDER:ollama}  # ollama | openai | anthropic
    cost-per-1k-tokens:
      input: 0.00015   # GPT-4o-mini pricing
      output: 0.0006
    budget:
      daily-limit-usd: 50.0
      alert-threshold-usd: 40.0
      alert-email: ${ALERT_EMAIL:admin@talentpool.io}
  
  # Challenge Generation
  challenge:
    generation:
      timeout-seconds: 30
      max-retries: 2
      cache-ttl-seconds: 3600
    evaluation:
      timeout-seconds: 20
      max-retries: 1
      async-processing: true
  
  # Security
  security:
    password:
      algorithm: argon2id
      iterations: 3
      memory-kb: 65536
      parallelism: 4
      salt-length: 16
      hash-length: 32
    jwt:
      issuer: https://talentpool.io
      access-token-ttl: 900      # 15 minutes
      refresh-token-ttl: 604800  # 7 days
    rate-limiting:
      enabled: true
      requests-per-minute: 60
      burst-size: 10
  
  # Email Configuration
  email:
    provider: ${EMAIL_PROVIDER:smtp}
    from-address: noreply@talentpool.io
    from-name: Talent Pool
    smtp:
      host: ${SMTP_HOST:localhost}
      port: ${SMTP_PORT:587}
      username: ${SMTP_USERNAME:}
      password: ${SMTP_PASSWORD:}
      tls: true
      auth: true
  
  # File Storage
  storage:
    provider: ${STORAGE_PROVIDER:local}  # local | s3 | ibm-cos
    local:
      base-path: ${user.home}/.talentpool/storage
      max-file-size-mb: 10
    s3:
      bucket: ${S3_BUCKET:}
      region: ${S3_REGION:us-east-1}
      access-key: ${S3_ACCESS_KEY:}
      secret-key: ${S3_SECRET_KEY:}
  
  # Feature Flags
  features:
    rag-enabled: false           # Phase 2
    code-execution: false        # Phase 3
    gamification: false          # Phase 4
    payments: false              # Phase 4
    analytics-dashboard: true
    email-notifications: true
    real-time-updates: false     # Phase 2 (WebSocket)

# =============================================================================
# Management Endpoints
# =============================================================================
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info,prometheus
      base-path: /q
  endpoint:
    health:
      show-details: when-authorized
      show-components: when-authorized
    metrics:
      enabled: true
  metrics:
    export:
      prometheus:
        enabled: true
```

---

## Development Profile

**File**: `backend/src/main/resources/application-dev.yml`

This profile extends development defaults. **Dev Services** (PostgreSQL y Redis vía Docker/Testcontainers) está **desactivado por defecto** (`QUARKUS_DEVSERVICES_ENABLED` sin definir o `false`) para que `mvn quarkus:dev` no falle en entornos donde Docker no es usable (p. ej. error `client version 1.32 is too old` / API mínima del daemon).

- **Con Docker compatible**: `export QUARKUS_DEVSERVICES_ENABLED=true` antes de `quarkus:dev` para levantar contenedores automáticos según `application-dev.yml`.
- **Sin Dev Services**: Postgres y Redis deben estar ya disponibles (por ejemplo `docker compose -f infra/compose/docker-compose.dev.yml up -d`) y alinear `DB_JDBC_URL`, `DB_USERNAME`, `DB_PASSWORD`, `REDIS_URL` con ese stack.
- **Logging en dev**: nivel raíz `INFO`; categorías con map anidada `category.<nombre>.level` (no uses el atajo YAML `"paquete": DEBUG`: SmallRye puede emitir claves inválidas tipo `quarkus.log.category."paquete""` y Quarkus las ignora). `min-level: TRACE` en dev permite `BasicBinder` en TRACE. Tras quitar un `ConfigSource` MP o su clase, ejecutá **`./mvnw clean`** para no dejar en `target/` un `META-INF/services/...ConfigSource` obsoleto (Quarkus falla con `ServiceConfigurationError: Provider ... not found`).
- **Ruido `ProcessBuilder` / `stty`**: además del root `INFO`, en `application-dev.yml` se fija la categoría `"java.lang.ProcessBuilder"` a `INFO` (logger puente del JDK con `JBossSystemLogger`).
- **CORS en dev**: `application-dev.yml` fija `quarkus.http.cors.origins` para `localhost` y `127.0.0.1` en los puertos **5173** y **3000**. El navegador envía `Origin` según la URL de la pestaña (`http://localhost:5173` ≠ `http://127.0.0.1:5173`); si falta uno de los dos, aparece `403 CORS Rejected - Invalid origin`.

```yaml
# =============================================================================
# Talent Pool - Development Profile (Dev Services)
# =============================================================================
# This profile is automatically activated when running `mvn quarkus:dev`
# =============================================================================

quarkus:
  http:
    cors:
      origins: http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000
  # Dev Services — opt-in (ver texto arriba)
  devservices:
    enabled: ${QUARKUS_DEVSERVICES_ENABLED:false}

  langchain4j:
    chat-model:
      provider: ollama
    openai:
      enable-integration: false
  
  # PostgreSQL Dev Services
  datasource:
    devservices:
      enabled: true
      image-name: pgvector/pgvector:pg16
      port: 5432
      db-name: talentpool_dev
      username: talentpool
      password: talentpool_dev_pass
      init-script-path: db/dev-init.sql
      volumes:
        "/var/lib/postgresql/data": pgdata-dev
      command: >
        postgres
        -c shared_buffers=256MB
        -c effective_cache_size=1GB
        -c maintenance_work_mem=128MB
        -c checkpoint_completion_target=0.9
        -c wal_buffers=16MB
        -c default_statistics_target=100
        -c random_page_cost=1.1
        -c effective_io_concurrency=200
        -c work_mem=8MB
        -c min_wal_size=1GB
        -c max_wal_size=4GB
      properties:
        "quarkus.datasource.jdbc.additional-jdbc-properties.stringtype": "unspecified"
  
  # Redis Dev Services
  redis:
    devservices:
      enabled: true
      image-name: redis:7-alpine
      port: 6379
      shared: true
  
  # Hibernate - Verbose logging in dev
  hibernate-orm:
    log:
      sql: true
      bind-parameters: true
      format-sql: true
  
  # Flyway - Clean database on restart (dev only!)
  flyway:
    clean-at-start: false  # Set to true if you want fresh DB on each restart
    baseline-on-migrate: true
  
  # Logging - root INFO; categorías con .level (map anidada)
  log:
    level: INFO
    min-level: TRACE
    category:
      com.talentpool:
        level: DEBUG
      org.hibernate.SQL:
        level: DEBUG
      # ... etc.
    console:
      color: true
  
  # Live Reload
  live-reload:
    enabled: true
    instrumentation: true
  
  # Dev UI
  dev-ui:
    enabled: true
  
  # OpenAPI - Include all endpoints in dev
  smallrye-openapi:
    servers:
      - url: http://localhost:8080
        description: Development server (Dev Services)
  
  # Health checks - Show all details in dev
  smallrye-health:
    ui:
      enable: true

# =============================================================================
# LangChain4j - Development Configuration
# =============================================================================
langchain4j:
  # Use Ollama for development (no API costs)
  ollama:
    base-url: http://localhost:11434
    timeout: 60s
    log-requests: true
    log-responses: true
    chat-model:
      model-name: llama3.1
      temperature: 0.3
      num-predict: 2000
  
  # Dev profile sets quarkus.langchain4j.openai.enable-integration=false (see application-dev.yml).

# =============================================================================
# Application - Development Overrides
# =============================================================================
app:
  llm:
    provider: ollama  # Use local Ollama instead of OpenAI
    cost-per-1k-tokens:
      input: 0.0  # Free!
      output: 0.0
  
  security:
    rate-limiting:
      enabled: false  # Disable rate limiting in dev
  
  email:
    provider: console  # Log emails to console instead of sending
  
  storage:
    provider: local
    local:
      base-path: ${user.home}/.talentpool/storage-dev
  
  features:
    email-notifications: false  # Don't send real emails in dev

# =============================================================================
# Dev Services Container Configuration
# =============================================================================
# These are passed to Testcontainers/Dev Services
"%dev":
  quarkus:
    container-image:
      build: false
    
    # Ollama Dev Services (custom configuration)
    # Note: Ollama doesn't have native Dev Services support yet
    # We'll use a custom DevServicesProcessor or docker-compose fallback
    ollama:
      enabled: true
      image: ollama/ollama:latest
      port: 11434
      model: llama3.1
      pull-model-on-start: true
      volumes:
        ollama: /root/.ollama
```

**Additional File**: `backend/src/main/resources/db/dev-init.sql`

```sql
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
```

---

## Test Profile

**File**: `backend/src/main/resources/application-test.yml`

Se activa con `mvn test` y `@QuarkusTest` (perfil `test`). **Por defecto no usa Docker / Dev Services**: hace falta **PostgreSQL** instalado en el host y una base dedicada. Valores por defecto: `jdbc:postgresql://localhost:5432/talentpool_test`, usuario `test`, contraseña `test`. Para crearlos (como superusuario `postgres` en Linux):

```sql
CREATE USER test WITH PASSWORD 'test';
CREATE DATABASE talentpool_test OWNER test;
```

Opcional: `DB_JDBC_URL`, `DB_USERNAME`, `DB_PASSWORD`. Con Docker y Testcontainers de nuevo: `export QUARKUS_DEVSERVICES_ENABLED=true` antes de `mvn test`. Caché desactivada en tests para no requerir Redis.

```yaml
# Resumen; el archivo en el repo es la fuente de verdad
quarkus:
  devservices:
    enabled: ${QUARKUS_DEVSERVICES_ENABLED:false}
  datasource:
    devservices:
      enabled: ${QUARKUS_DEVSERVICES_ENABLED:false}
    jdbc:
      url: ${DB_JDBC_URL:jdbc:postgresql://localhost:5432/talentpool_test}
  redis:
    devservices:
      enabled: ${QUARKUS_DEVSERVICES_ENABLED:false}
  cache:
    enabled: false
  flyway:
    clean-at-start: true
    locations: classpath:db/migration,classpath:db/test-data
```

Las claves JWT (`smallrye.jwt.*` / `mp.jwt.*`) están en la **raíz** de `application.yml`, no hace falta repetirlas en `application-test.yml`.

**Additional File**: `backend/src/test/resources/db/test-data/V999__seed_test_data.sql`

```sql
-- =============================================================================
-- Test Data Seeding
-- =============================================================================
-- This migration runs only in test profile to provide baseline test data
-- =============================================================================

-- Insert test users
INSERT INTO usuarios (id, email, nombre_completo, password_hash, email_verificado, created_at, updated_at)
VALUES 
  ('01234567-89ab-cdef-0123-456789abcdef', 'test.recruiter@example.com', 'Test Recruiter', '$argon2id$v=19$m=1024,t=1,p=1$salt$hash', true, NOW(), NOW()),
  ('11234567-89ab-cdef-0123-456789abcdef', 'test.candidate@example.com', 'Test Candidate', '$argon2id$v=19$m=1024,t=1,p=1$salt$hash', true, NOW(), NOW()),
  ('21234567-89ab-cdef-0123-456789abcdef', 'test.teacher@example.com', 'Test Teacher', '$argon2id$v=19$m=1024,t=1,p=1$salt$hash', true, NOW(), NOW());

-- Insert test organization
INSERT INTO organizaciones (id, nombre, tipo, plan, created_at, updated_at)
VALUES 
  ('31234567-89ab-cdef-0123-456789abcdef', 'Test Company', 'EMPRESA', 'FREE', NOW(), NOW());

-- Insert test memberships
INSERT INTO membresias (id, usuario_id, organizacion_id, rol, estado, created_at, updated_at)
VALUES 
  ('41234567-89ab-cdef-0123-456789abcdef', '01234567-89ab-cdef-0123-456789abcdef', '31234567-89ab-cdef-0123-456789abcdef', 'RECLUTADOR', 'ACTIVA', NOW(), NOW());

-- Insert test prompt version
INSERT INTO prompt_versiones (id, nombre, version_semver, plantilla, variables_esperadas, estado, created_at)
VALUES 
  ('51234567-89ab-cdef-0123-456789abcdef', 'test_prompt', '1.0.0', 'Test prompt template', '[]'::jsonb, 'ACTIVA', NOW());
```

---

## Production Profile

**File**: `backend/src/main/resources/application-prod.yml`

This configuration is for production deployment on IBM Cloud.

```yaml
# =============================================================================
# Talent Pool - Production Profile (IBM Cloud)
# =============================================================================
# This profile is activated with QUARKUS_PROFILE=prod
# All services are managed (PostgreSQL, Redis) or external (OpenAI)
# =============================================================================

quarkus:
  # Dev Services DISABLED in production
  devservices:
    enabled: false
  
  # Production Database (IBM Cloud Databases for PostgreSQL)
  datasource:
    jdbc:
      url: ${DB_JDBC_URL}
      min-size: 10
      max-size: 50
      acquisition-timeout: 30s
      background-validation-interval: 5m
      idle-removal-interval: 10m
      max-lifetime: 60m
      leak-detection-interval: 10m
      transaction-isolation-level: read-committed
      enable-metrics: true
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    # SSL/TLS Configuration
    jdbc-additional-properties:
      ssl: true
      sslmode: require
      sslrootcert: /certs/ibm-cloud-ca.pem
  
  # Production Redis (IBM Cloud Databases for Redis)
  redis:
    hosts: ${REDIS_URL}
    password: ${REDIS_PASSWORD}
    ssl: true
    timeout: 30s
    max-pool-size: 50
    max-pool-waiting: 100
  
  # Hibernate - Production settings
  hibernate-orm:
    log:
      sql: false
      bind-parameters: false
    jdbc:
      statement-batch-size: 50
    fetch:
      batch-size: 32
    query:
      query-plan-cache-max-size: 4096
  
  # Flyway - Production migration settings
  flyway:
    migrate-at-start: true
    clean-at-start: false
    clean-disabled: true
    validate-on-migrate: true
    baseline-on-migrate: false
    out-of-order: false
  
  # Logging - Production settings
  log:
    level: INFO
    category:
      "com.talentpool": INFO
      "io.quarkus": WARN
      "org.hibernate": WARN
      "org.flywaydb": INFO
    console:
      enable: true
      format: "%d{yyyy-MM-dd HH:mm:ss,SSS} %-5p [%c{3.}] (%t) %s%e%n"
      json: true  # JSON logging for log aggregation
      color: false
    file:
      enable: true
      path: /var/log/talentpool/application.log
      rotation:
        max-file-size: 100M
        max-backup-index: 10
  
  # HTTP - Production settings
  http:
    port: ${PORT:8080}
    host: 0.0.0.0
    cors:
      origins: ${CORS_ORIGINS}
    ssl:
      enabled: false  # Handled by load balancer
  
  # Health checks - Limited details in production
  smallrye-health:
    ui:
      enable: false
  
  # OpenTelemetry - Enabled in production
  otel:
    enabled: true
    exporter:
      otlp:
        endpoint: ${OTEL_EXPORTER_OTLP_ENDPOINT}
    service:
      name: talent-pool-api
      version: ${quarkus.application.version}
    traces:
      sampler: parentbased_traceidratio
      sampler-arg: 0.1  # Sample 10% of traces
  
  # Metrics - Production configuration
  micrometer:
    enabled: true
    export:
      prometheus:
        enabled: true
        path: /q/metrics

# =============================================================================
# LangChain4j - Production Configuration
# =============================================================================
langchain4j:
  # Use OpenAI in production
  openai:
    api-key: ${OPENAI_API_KEY}
    base-url: https://api.openai.com/v1
    timeout: 60s
    max-retries: 3
    log-requests: false
    log-responses: false
    chat-model:
      model-name: gpt-4o-mini
      temperature: 0.3
      max-tokens: 2000
  
  # Ollama disabled in production
  ollama:
    base-url: ""

# =============================================================================
# Application - Production Overrides
# =============================================================================
app:
  llm:
    provider: openai
    cost-per-1k-tokens:
      input: 0.00015
      output: 0.0006
    budget:
      daily-limit-usd: 100.0
      alert-threshold-usd: 80.0
      alert-email: ${ALERT_EMAIL}
  
  security:
    password:
      algorithm: argon2id
      iterations: 3
      memory-kb: 65536
      parallelism: 4
    jwt:
      issuer: https://api.talentpool.io
    rate-limiting:
      enabled: true
      requests-per-minute: 60
      burst-size: 10
  
  email:
    provider: smtp
    smtp:
      host: ${SMTP_HOST}
      port: ${SMTP_PORT}
      username: ${SMTP_USERNAME}
      password: ${SMTP_PASSWORD}
      tls: true
  
  storage:
    provider: ibm-cos
    ibm-cos:
      bucket: ${IBM_COS_BUCKET}
      region: ${IBM_COS_REGION}
      api-key: ${IBM_COS_API_KEY}
      service-instance-id: ${IBM_COS_INSTANCE_ID}
  
  features:
    rag-enabled: false
    code-execution: false
    gamification: false
    payments: false
    analytics-dashboard: true
    email-notifications: true
    real-time-updates: false

# =============================================================================
# Production Security Headers
# =============================================================================
quarkus:
  http:
    header:
      "X-Frame-Options":
        value: DENY
      "X-Content-Type-Options":
        value: nosniff
      "X-XSS-Protection":
        value: "1; mode=block"
      "Strict-Transport-Security":
        value: "max-age=31536000; includeSubDomains"
      "Content-Security-Policy":
        value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
```

---

## Docker Compose Fallback

**File**: `infra/compose/docker-compose.dev.yml`

This is a fallback option for developers who cannot use Dev Services (e.g., network restrictions).

```yaml
# =============================================================================
# Docker Compose - Development Services (Manual Fallback)
# =============================================================================
# Use this if you cannot use Quarkus Dev Services
# Start with: docker-compose -f infra/compose/docker-compose.dev.yml up -d
# =============================================================================

version: '3.8'

services:
  # PostgreSQL 16 with pgvector
  postgres:
    image: pgvector/pgvector:pg16
    container_name: talentpool-postgres-dev
    environment:
      POSTGRES_DB: talentpool_dev
      POSTGRES_USER: talentpool
      POSTGRES_PASSWORD: talentpool_dev_pass
      POSTGRES_INITDB_ARGS: "-E UTF8 --locale=en_US.UTF-8"
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ../../backend/src/main/resources/db/dev-init.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
    command: >
      postgres
      -c shared_buffers=256MB
      -c effective_cache_size=1GB
      -c maintenance_work_mem=128MB
      -c checkpoint_completion_target=0.9
      -c wal_buffers=16MB
      -c default_statistics_target=100
      -c random_page_cost=1.1
      -c effective_io_concurrency=200
      -c work_mem=8MB
      -c min_wal_size=1GB
      -c max_wal_size=4GB
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U talentpool -d talentpool_dev"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - talentpool-network
  
  # Redis 7
  redis:
    image: redis:7-alpine
    container_name: talentpool-redis-dev
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - talentpool-network
  
  # Ollama (Local LLM)
  ollama:
    image: ollama/ollama:latest
    container_name: talentpool-ollama-dev
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - talentpool-network
  
  # Ollama Model Puller (runs once to download model)
  ollama-pull:
    image: ollama/ollama:latest
    container_name: talentpool-ollama-pull
    depends_on:
      ollama:
        condition: service_healthy
    volumes:
      - ollama-data:/root/.ollama
    entrypoint: ["/bin/sh", "-c"]
    command:
      - |
        echo "Waiting for Ollama to be ready..."
        sleep 5
        echo "Pulling llama3.1 model..."
        ollama pull llama3.1
        echo "Model pulled successfully!"
    networks:
      - talentpool-network
  
  # pgAdmin (Optional - Database Management UI)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: talentpool-pgadmin-dev
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@talentpool.local
      PGADMIN_DEFAULT_PASSWORD: admin
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin-data:/var/lib/pgadmin
    depends_on:
      - postgres
    networks:
      - talentpool-network
    profiles:
      - tools  # Only start with: docker-compose --profile tools up

volumes:
  postgres-data:
    name: talentpool-postgres-data
  redis-data:
    name: talentpool-redis-data
  ollama-data:
    name: talentpool-ollama-data
  pgadmin-data:
    name: talentpool-pgadmin-data

networks:
  talentpool-network:
    name: talentpool-network
    driver: bridge
```

**Usage Instructions**:

```bash
# Start all services
docker-compose -f infra/compose/docker-compose.dev.yml up -d

# Start with pgAdmin
docker-compose -f infra/compose/docker-compose.dev.yml --profile tools up -d

# View logs
docker-compose -f infra/compose/docker-compose.dev.yml logs -f

# Stop services
docker-compose -f infra/compose/docker-compose.dev.yml down

# Stop and remove volumes (clean slate)
docker-compose -f infra/compose/docker-compose.dev.yml down -v
```

Then configure your application to use these services:

```properties
# application.yml (when using docker-compose)
quarkus.devservices.enabled=false
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/talentpool_dev
quarkus.datasource.username=talentpool
quarkus.datasource.password=talentpool_dev_pass
quarkus.redis.hosts=redis://localhost:6379
langchain4j.ollama.base-url=http://localhost:11434
```

---

## Environment Variables Reference

### Required Environment Variables

#### Development (Optional - Dev Services handles these)
```bash
# None required - Dev Services auto-configures everything
```

#### Production (Required)
```bash
# Database
export DB_JDBC_URL="jdbc:postgresql://hostname:port/database?sslmode=require"
export DB_USERNAME="your-db-username"
export DB_PASSWORD="your-db-password"

# Redis
export REDIS_URL="rediss://hostname:port"
export REDIS_PASSWORD="your-redis-password"

# LLM Provider
export OPENAI_API_KEY="sk-..."
export LLM_PROVIDER="openai"

# Security
export JWT_PRIVATE_KEY_PATH="/keys/privateKey.pem"
export JWT_PUBLIC_KEY_PATH="/keys/publicKey.pem"

# Email
export SMTP_HOST="smtp.sendgrid.net"
export SMTP_PORT="587"
export SMTP_USERNAME="apikey"
export SMTP_PASSWORD="your-sendgrid-api-key"

# Storage
export IBM_COS_BUCKET="talentpool-prod"
export IBM_COS_REGION="us-south"
export IBM_COS_API_KEY="your-cos-api-key"
export IBM_COS_INSTANCE_ID="your-instance-id"

# Observability
export OTEL_EXPORTER_OTLP_ENDPOINT="https://your-otel-collector:4317"

# CORS (production); leave unset locally to use YAML defaults including 127.0.0.1 dev origins
export CORS_ORIGINS="https://app.talentpool.io,https://www.talentpool.io"

# Alerts
export ALERT_EMAIL="ops@talentpool.io"
```

### Optional Environment Variables

```bash
# Feature Flags
export FEATURE_RAG_ENABLED="false"
export FEATURE_CODE_EXECUTION="false"
export FEATURE_GAMIFICATION="false"

# Performance Tuning
export QUARKUS_DATASOURCE_JDBC_MAX_SIZE="50"
export QUARKUS_REDIS_MAX_POOL_SIZE="50"

# Logging
export QUARKUS_LOG_LEVEL="INFO"
export QUARKUS_LOG_CATEGORY_COM_TALENTPOOL_LEVEL="DEBUG"

# LLM Budget
export APP_LLM_BUDGET_DAILY_LIMIT_USD="100.0"
export APP_LLM_BUDGET_ALERT_THRESHOLD_USD="80.0"
```

---

## Configuration Validation

### Startup Validation Checklist

When the application starts, it should validate:

1. ✅ Database connection successful
2. ✅ Required extensions installed (pgvector, pgcrypto, citext)
3. ✅ Flyway migrations up to date
4. ✅ Redis connection successful
5. ✅ LLM provider accessible (OpenAI or Ollama)
6. ✅ JWT keys loaded
7. ✅ Required environment variables present (production only)

### Health Check Endpoints

```bash
# Liveness (is the app running?)
curl http://localhost:8080/q/health/live

# Readiness (is the app ready to serve traffic?)
curl http://localhost:8080/q/health/ready

# Startup (has the app finished starting?)
curl http://localhost:8080/q/health/started

# Full health check
curl http://localhost:8080/q/health
```

Expected response:
```json
{
  "status": "UP",
  "checks": [
    {
      "name": "Database connection health check",
      "status": "UP",
      "data": {
        "database": "PostgreSQL 16.2"
      }
    },
    {
      "name": "Redis connection health check",
      "status": "UP"
    },
    {
      "name": "Ollama health check",
      "status": "UP",
      "data": {
        "model": "llama3.1",
        "version": "0.1.0"
      }
    }
  ]
}
```

---

## Troubleshooting

### Common Issues

#### Issue: "Port 5432 already in use"
**Solution**: Dev Services will automatically find an available port. If using docker-compose, stop existing PostgreSQL:
```bash
docker ps | grep postgres
docker stop <container-id>
```

#### Issue: "pgvector extension not found"
**Solution**: Ensure you're using the `pgvector/pgvector:pg16` image, not plain `postgres:16`

#### Issue: "Ollama model not found"
**Solution**: Pull the model manually:
```bash
docker exec -it talentpool-ollama-dev ollama pull llama3.1
```

#### Issue: "Out of memory when running Ollama"
**Solution**: Increase Docker memory limit to at least 8GB or disable Ollama:
```yaml
langchain4j:
  ollama:
    base-url: ""  # Disable Ollama
```

#### Issue: "Flyway migration failed"
**Solution**: Check migration scripts and database state:
```bash
# View Flyway history
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC;

# Repair Flyway (if needed)
mvn flyway:repair
```

---

## Next Steps

1. **Create the actual configuration files** using the specifications above
2. **Test Dev Services** with a minimal Quarkus application
3. **Verify pgvector** extension is working correctly
4. **Test Ollama integration** with sample prompts
5. **Create integration tests** using Testcontainers
6. **Document developer onboarding** process

---

**Document Status**: ✅ Complete and Ready for Implementation  
**Implementation Mode**: Switch to Code mode to create actual files