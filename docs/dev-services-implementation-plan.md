# Quarkus Dev Services - Implementation Plan

> **Status**: ✅ Planning Complete - Ready for Implementation  
> **Next Step**: Switch to Code mode to create actual configuration files  
> **Estimated Implementation Time**: 2-3 hours

---

## Executive Summary

This document provides a complete implementation plan for configuring Quarkus Dev Services for the Talent Pool platform. All planning, design, and documentation is complete. The next step is to switch to Code mode and create the actual configuration files.

---

## What Has Been Completed

### ✅ Planning & Design (100%)

1. **Strategy Document** ([`dev-services-strategy.md`](./dev-services-strategy.md))
   - Complete Dev Services architecture
   - Service dependencies and configurations
   - Performance considerations
   - Cost analysis
   - Migration strategy from Terraform

2. **Configuration Specifications** ([`configuration-files.md`](./configuration-files.md))
   - Base application.yml (shared configuration)
   - Development profile (Dev Services enabled)
   - Test profile (Testcontainers)
   - Production profile (IBM Cloud)
   - Docker Compose fallback
   - Environment variables reference
   - Complete troubleshooting guide

3. **Developer Onboarding** ([`DEVELOPER_ONBOARDING.md`](./DEVELOPER_ONBOARDING.md))
   - Quick start guide (5 minutes)
   - Development workflow
   - Useful commands
   - Troubleshooting
   - FAQ

---

## Implementation Checklist

### Phase 1: Core Configuration Files (1 hour)

- [ ] Create `backend/src/main/resources/application.yml`
- [ ] Create `backend/src/main/resources/application-dev.yml`
- [ ] Create `backend/src/main/resources/application-test.yml`
- [ ] Create `backend/src/main/resources/application-prod.yml`
- [ ] Create `backend/src/main/resources/db/dev-init.sql`
- [ ] Create `backend/src/test/resources/db/test-data/V999__seed_test_data.sql`

### Phase 2: Docker Compose Fallback (30 minutes)

- [ ] Create `infra/compose/docker-compose.dev.yml`
- [ ] Create `infra/compose/.env.example`
- [ ] Create `infra/compose/README.md` (usage instructions)

### Phase 3: Maven Configuration (15 minutes)

- [ ] Update `backend/pom.xml` with required dependencies:
  - `quarkus-jdbc-postgresql`
  - `quarkus-hibernate-orm-panache`
  - `quarkus-flyway`
  - `quarkus-redis-client`
  - `quarkus-langchain4j-ollama`
  - `quarkus-langchain4j-openai`
  - `quarkus-smallrye-health`
  - `quarkus-micrometer-registry-prometheus`
  - `quarkus-opentelemetry`
  - `quarkus-container-image-docker`

### Phase 4: Health Checks & Observability (30 minutes)

- [ ] Create `backend/src/main/java/com/talentpool/health/DatabaseHealthCheck.java`
- [ ] Create `backend/src/main/java/com/talentpool/health/RedisHealthCheck.java`
- [ ] Create `backend/src/main/java/com/talentpool/health/OllamaHealthCheck.java`
- [ ] Create `backend/src/main/java/com/talentpool/metrics/LLMMetrics.java`

### Phase 5: Testing & Validation (30 minutes)

- [ ] Create sample integration test with Testcontainers
- [ ] Test Dev Services startup
- [ ] Verify PostgreSQL + pgvector
- [ ] Verify Redis connection
- [ ] Verify Ollama connection (optional)
- [ ] Test hot reload
- [ ] Test Flyway migrations

### Phase 6: Documentation Updates (15 minutes)

- [ ] Update main README.md with Dev Services instructions
- [ ] Add link to DEVELOPER_ONBOARDING.md
- [ ] Update CONTRIBUTING.md with Dev Services workflow
- [ ] Create `.github/ISSUE_TEMPLATE/dev-services-issue.md`

---

## File Structure After Implementation

```
hackathon/
├── backend/
│   ├── pom.xml                                    # Updated with dependencies
│   └── src/
│       ├── main/
│       │   ├── java/com/talentpool/
│       │   │   ├── health/                        # Health checks
│       │   │   │   ├── DatabaseHealthCheck.java
│       │   │   │   ├── RedisHealthCheck.java
│       │   │   │   └── OllamaHealthCheck.java
│       │   │   └── metrics/                       # Custom metrics
│       │   │       └── LLMMetrics.java
│       │   └── resources/
│       │       ├── application.yml                # Base config
│       │       ├── application-dev.yml            # Dev Services
│       │       ├── application-test.yml           # Testcontainers
│       │       ├── application-prod.yml           # Production
│       │       └── db/
│       │           ├── dev-init.sql               # Dev DB init
│       │           └── migration/                 # Flyway migrations
│       │               ├── V1__create_extensions.sql
│       │               └── ...
│       └── test/
│           ├── java/com/talentpool/
│           │   └── integration/                   # Integration tests
│           │       └── DevServicesIT.java
│           └── resources/
│               └── db/test-data/
│                   └── V999__seed_test_data.sql
├── infra/
│   └── compose/
│       ├── docker-compose.dev.yml                 # Manual fallback
│       ├── .env.example                           # Environment template
│       └── README.md                              # Usage instructions
└── docs/
    ├── dev-services-strategy.md                   # ✅ Complete
    ├── configuration-files.md                     # ✅ Complete
    ├── DEVELOPER_ONBOARDING.md                    # ✅ Complete
    └── dev-services-implementation-plan.md        # ✅ This file
```

---

## Implementation Steps (Detailed)

### Step 1: Create Base Configuration

**File**: `backend/src/main/resources/application.yml`

Copy the complete configuration from [`configuration-files.md`](./configuration-files.md#base-configuration) section.

**Key sections**:
- HTTP configuration with CORS
- Logging configuration
- Database connection pool settings
- Hibernate ORM configuration
- Flyway migration settings
- Redis configuration
- Cache configuration
- OpenAPI/Swagger settings
- Health checks
- Metrics (Micrometer + Prometheus)
- OpenTelemetry (disabled by default)
- JWT security configuration
- LangChain4j configuration (OpenAI + Ollama)
- Application-specific settings

### Step 2: Create Development Profile

**File**: `backend/src/main/resources/application-dev.yml`

Copy the complete configuration from [`configuration-files.md`](./configuration-files.md#development-profile) section.

**Key features**:
- Dev Services enabled for PostgreSQL, Redis
- Logging: root `INFO`, categorías clave en `DEBUG`/`TRACE`
- SQL logging enabled
- Hot reload enabled
- Dev UI enabled
- Ollama as default LLM provider
- Rate limiting disabled
- Console email provider

**File**: `backend/src/main/resources/db/dev-init.sql`

Copy the initialization script from [`configuration-files.md`](./configuration-files.md#development-profile) section.

**Purpose**: Automatically creates PostgreSQL extensions on first startup.

### Step 3: Create Test Profile

**File**: `backend/src/main/resources/application-test.yml`

Copy the complete configuration from [`configuration-files.md`](./configuration-files.md#test-profile) section.

**Key features**:
- Testcontainers enabled
- Isolated containers per test
- Clean database before each test suite
- LLM calls always mocked
- Minimal logging
- Fast password hashing

**File**: `backend/src/test/resources/db/test-data/V999__seed_test_data.sql`

Copy the test data script from [`configuration-files.md`](./configuration-files.md#test-profile) section.

**Purpose**: Provides baseline test data for integration tests.

### Step 4: Create Production Profile

**File**: `backend/src/main/resources/application-prod.yml`

Copy the complete configuration from [`configuration-files.md`](./configuration-files.md#production-profile) section.

**Key features**:
- Dev Services disabled
- IBM Cloud managed services
- OpenAI as LLM provider
- TLS/SSL enabled
- JSON logging for aggregation
- OpenTelemetry enabled
- Security headers
- Production-grade connection pooling

### Step 5: Create Docker Compose Fallback

**File**: `infra/compose/docker-compose.dev.yml`

Copy the complete configuration from [`configuration-files.md`](./configuration-files.md#docker-compose-fallback) section.

**Services**:
- PostgreSQL 16 + pgvector
- Redis 7
- Ollama (with automatic model pull)
- pgAdmin (optional, with `--profile tools`)

**Usage**:
```bash
docker-compose -f infra/compose/docker-compose.dev.yml up -d
```

### Step 6: Update Maven Dependencies

**File**: `backend/pom.xml`

Add the following dependencies:

```xml
<dependencies>
    <!-- Quarkus Core -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-arc</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-resteasy-reactive-jackson</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-jdbc-postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-hibernate-orm-panache</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-flyway</artifactId>
    </dependency>
    
    <!-- Redis -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-redis-client</artifactId>
    </dependency>
    
    <!-- LangChain4j -->
    <dependency>
        <groupId>io.quarkiverse.langchain4j</groupId>
        <artifactId>quarkus-langchain4j-ollama</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkiverse.langchain4j</groupId>
        <artifactId>quarkus-langchain4j-openai</artifactId>
    </dependency>
    
    <!-- Observability -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-smallrye-health</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-micrometer-registry-prometheus</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-opentelemetry</artifactId>
    </dependency>
    
    <!-- OpenAPI -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-smallrye-openapi</artifactId>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-junit5</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>postgresql</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Step 7: Create Health Checks

**File**: `backend/src/main/java/com/talentpool/health/DatabaseHealthCheck.java`

```java
package com.talentpool.health;

import io.agroal.api.AgroalDataSource;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;

@Readiness
@ApplicationScoped
public class DatabaseHealthCheck implements HealthCheck {

    @Inject
    AgroalDataSource dataSource;

    @Override
    public HealthCheckResponse call() {
        try (Connection connection = dataSource.getConnection()) {
            var metadata = connection.getMetaData();
            return HealthCheckResponse.up("Database connection")
                .withData("database", metadata.getDatabaseProductName())
                .withData("version", metadata.getDatabaseProductVersion())
                .build();
        } catch (Exception e) {
            return HealthCheckResponse.down("Database connection")
                .withData("error", e.getMessage())
                .build();
        }
    }
}
```

**File**: `backend/src/main/java/com/talentpool/health/RedisHealthCheck.java`

```java
package com.talentpool.health;

import io.quarkus.redis.datasource.RedisDataSource;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@Readiness
@ApplicationScoped
public class RedisHealthCheck implements HealthCheck {

    @Inject
    RedisDataSource redisDataSource;

    @Override
    public HealthCheckResponse call() {
        try {
            redisDataSource.value(String.class).get("health-check");
            return HealthCheckResponse.up("Redis connection").build();
        } catch (Exception e) {
            return HealthCheckResponse.down("Redis connection")
                .withData("error", e.getMessage())
                .build();
        }
    }
}
```

### Step 8: Create Integration Test

**File**: `backend/src/test/java/com/talentpool/integration/DevServicesIT.java`

```java
package com.talentpool.integration;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class DevServicesIT {

    @Test
    public void testHealthEndpoint() {
        given()
            .when().get("/q/health")
            .then()
            .statusCode(200)
            .body("status", is("UP"));
    }

    @Test
    public void testDatabaseConnection() {
        given()
            .when().get("/q/health/ready")
            .then()
            .statusCode(200)
            .body("status", is("UP"));
    }
}
```

---

## Validation Checklist

After implementation, verify:

### ✅ Dev Services Startup

```bash
cd backend
mvn quarkus:dev
```

Expected output:
- PostgreSQL container started
- Redis container started
- Ollama container started (optional)
- Flyway migrations applied
- Application started successfully

### ✅ Health Checks

```bash
curl http://localhost:8080/q/health
```

Expected: All checks return "UP"

### ✅ Database Extensions

```bash
docker exec -it <postgres-container> psql -U talentpool -d talentpool_dev \
  -c "SELECT extname FROM pg_extension WHERE extname IN ('vector', 'pgcrypto', 'citext');"
```

Expected: All 3 extensions listed

### ✅ Redis Connection

```bash
docker exec -it <redis-container> redis-cli PING
```

Expected: "PONG"

### ✅ Ollama Model

```bash
docker exec -it <ollama-container> ollama list
```

Expected: llama3.1 model listed

### ✅ Hot Reload

1. Make a change to any Java file
2. Save the file
3. Check console for "Recompilation complete"

### ✅ Integration Tests

```bash
mvn verify
```

Expected: All tests pass

---

## Rollback Plan

If Dev Services causes issues:

### Option 1: Disable Dev Services

```properties
# application.yml
quarkus.devservices.enabled=false
```

Then use docker-compose fallback:

```bash
docker-compose -f infra/compose/docker-compose.dev.yml up -d
```

### Option 2: Use Terraform (Production Setup)

Continue using the existing Terraform setup for local development:

```bash
cd database
terraform apply
```

Then configure connection strings manually.

---

## Success Criteria

Implementation is successful when:

1. ✅ Developer can run `mvn quarkus:dev` without any manual setup
2. ✅ All services (PostgreSQL, Redis, Ollama) start automatically
3. ✅ Database has all required extensions (pgvector, pgcrypto, citext)
4. ✅ Flyway migrations run successfully
5. ✅ Health checks return "UP" for all services
6. ✅ Hot reload works for code changes
7. ✅ Integration tests pass using Testcontainers
8. ✅ Startup time is under 60 seconds (first run), under 20 seconds (subsequent runs)
9. ✅ Documentation is clear and complete
10. ✅ Troubleshooting guide covers common issues

---

## Next Steps

### Immediate (Switch to Code Mode)

1. **Switch to Code mode**: Use `/mode code` or click the mode switcher
2. **Create configuration files**: Start with `application.yml`
3. **Test incrementally**: Verify each file as you create it
4. **Commit frequently**: Small, focused commits

### Short Term (Next Sprint)

1. **Create Flyway migrations**: Implement the 22 migrations from DATABASE.md
2. **Implement health checks**: Add custom health checks for all services
3. **Add metrics**: Implement LLM cost tracking and performance metrics
4. **Write integration tests**: Cover critical use cases

### Medium Term (Next Month)

1. **Optimize performance**: Tune connection pools and caching
2. **Add monitoring**: Set up Prometheus + Grafana dashboards
3. **Implement RAG**: Add pgvector embeddings for Phase 2
4. **Production deployment**: Deploy to IBM Cloud with Terraform

---

## Resources

### Documentation Created

1. **[Dev Services Strategy](./dev-services-strategy.md)** - Complete architecture and design
2. **[Configuration Files](./configuration-files.md)** - All configuration specifications
3. **[Developer Onboarding](./DEVELOPER_ONBOARDING.md)** - Quick start guide
4. **[Implementation Plan](./dev-services-implementation-plan.md)** - This document

### External Resources

- [Quarkus Dev Services](https://quarkus.io/guides/dev-services)
- [Testcontainers](https://www.testcontainers.org/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Ollama Documentation](https://ollama.ai/docs)
- [LangChain4j Quarkus](https://docs.quarkiverse.io/quarkus-langchain4j/dev/)

---

## Conclusion

All planning and design work is complete. The configuration specifications are detailed and ready for implementation. The next step is to switch to Code mode and create the actual files.

**Estimated implementation time**: 2-3 hours  
**Complexity**: Medium  
**Risk**: Low (can rollback to Terraform if needed)

**Ready to implement!** 🚀

---

**Document Status**: ✅ Complete  
**Last Updated**: 2026-05-01  
**Next Action**: Switch to Code mode and begin implementation