# Docker Compose - Development Services

This directory contains Docker Compose configuration for manual service orchestration. Use this as a fallback if you cannot use Quarkus Dev Services.

## Quick Start

```bash
# Start all services
docker-compose -f infra/compose/docker-compose.dev.yml up -d

# View logs
docker-compose -f infra/compose/docker-compose.dev.yml logs -f

# Stop services
docker-compose -f infra/compose/docker-compose.dev.yml down

# Stop and remove volumes (clean slate)
docker-compose -f infra/compose/docker-compose.dev.yml down -v
```

## Services Included

### PostgreSQL 16 + pgvector
- **Port**: 5432
- **Database**: talentpool_dev
- **User**: talentpool
- **Password**: talentpool_dev_pass
- **Extensions**: uuid-ossp, pgcrypto, citext, vector

### Redis 7
- **Port**: 6379
- **No password** (development only)
- **Max memory**: 256MB with LRU eviction

### pgAdmin (Optional)
- **Port**: 5050
- **Email**: admin@talentpool.local
- **Password**: admin
- **Start with**: `docker-compose --profile tools up`

## LLM (chat) in development

The stack does **not** include a local inference server. By default the dev profile uses `app.llm.use-mock-llm=true` (stub chat responses). For real OpenAI calls, set `app.llm.use-mock-llm=false`, `quarkus.langchain4j.openai.enable-integration=true`, and a valid `OPENAI_API_KEY`.

## Configuration

After starting services, configure your application:

```properties
# backend/src/main/resources/application.yml
quarkus.devservices.enabled=false
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/talentpool_dev
quarkus.datasource.username=talentpool
quarkus.datasource.password=talentpool_dev_pass
quarkus.redis.hosts=redis://localhost:6379
```

## Useful Commands

### PostgreSQL

```bash
# Connect to database
docker exec -it talentpool-postgres-dev psql -U talentpool -d talentpool_dev

# View tables
\dt

# View extensions
SELECT extname, extversion FROM pg_extension;

# Exit
\q
```

### Redis

```bash
# Connect to Redis
docker exec -it talentpool-redis-dev redis-cli

# View all keys
KEYS *

# Get value
GET key_name

# Flush all data
FLUSHALL

# Exit
exit
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find what's using the port
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows

# Stop the conflicting service or change the port in docker-compose.dev.yml
```

### Out of Disk Space

```bash
# Clean up Docker resources
docker system prune -a --volumes

# Check disk usage
docker system df
```

## When to Use This

Use Docker Compose instead of Dev Services when:
- You have network restrictions that prevent Testcontainers from working
- You need to inspect or modify service configurations
- You want services to persist between application restarts
- You're working in an air-gapped environment

**Recommendation**: Use Quarkus Dev Services for primary development. Use Docker Compose only as a fallback.

## Cleanup

To completely remove all services and data:

```bash
# Stop and remove containers, networks, and volumes
docker-compose -f infra/compose/docker-compose.dev.yml down -v

# Remove images (optional)
docker rmi pgvector/pgvector:pg16 redis:7-alpine
