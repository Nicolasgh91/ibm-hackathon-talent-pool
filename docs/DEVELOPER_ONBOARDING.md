# Developer Onboarding Guide - Quarkus Dev Services

> **Welcome to Talent Pool!** 🎉  
> This guide will get you up and running with the project in under 5 minutes using Quarkus Dev Services.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [What Just Happened?](#what-just-happened)
4. [Development Workflow](#development-workflow)
5. [Useful Commands](#useful-commands)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

---

## Prerequisites

### Required Software

| Software | Version | Installation |
|----------|---------|--------------|
| **JDK** | 21 (Eclipse Temurin) | [Download](https://adoptium.net/) |
| **Maven** | 3.9.x | [Download](https://maven.apache.org/download.cgi) |
| **Docker** | 20.x+ | [Download](https://www.docker.com/products/docker-desktop) |
| **Git** | 2.x+ | [Download](https://git-scm.com/downloads) |

### Optional (for frontend development)

| Software | Version | Installation |
|----------|---------|--------------|
| **Node.js** | 20.x LTS | [Download](https://nodejs.org/) |
| **pnpm** | 9.x | `npm install -g pnpm` |

### System Requirements

- **RAM**: 8GB minimum, 16GB recommended
- **Disk**: 20GB free space (for Docker images and models)
- **CPU**: 4 cores minimum, 8 cores recommended
- **OS**: Windows 10/11, macOS 11+, or Linux

---

## Quick Start (5 Minutes)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd hackathon
```

### Step 2: Start the Backend

```bash
cd backend
mvn quarkus:dev
```

**That's it!** 🎉

On first run, you'll see:

```
[INFO] --- quarkus-maven-plugin:3.17.x:dev (default-cli) @ talent-pool-api ---
[INFO] Pulling container image: pgvector/pgvector:pg16
[INFO] Container pgvector/pgvector:pg16 started in 8.2s
[INFO] PostgreSQL database initialized: talentpool_dev
[INFO] Pulling container image: redis:7-alpine
[INFO] Container redis:7-alpine started in 2.1s
[INFO] Pulling container image: ollama/ollama:latest
[INFO] Container ollama/ollama:latest started in 5.3s
[INFO] Pulling model: llama3.1 (this may take 3-5 minutes on first run)
[INFO] Model llama3.1 downloaded successfully (4.7GB)
[INFO] Running Flyway migrations...
[INFO] Successfully applied 22 migrations
[INFO] Application started in 45.2s
[INFO] 
[INFO] --
[INFO] Listening on: http://localhost:8080
[INFO] 
[INFO] Profile dev activated. Live Coding activated.
[INFO] Installed features: [agroal, cdi, flyway, hibernate-orm, hibernate-orm-panache, 
                            jdbc-postgresql, langchain4j, redis-client, resteasy-reactive, 
                            resteasy-reactive-jackson, smallrye-context-propagation, 
                            smallrye-health, smallrye-openapi, swagger-ui]
```

### Step 3: Verify Everything Works

Open your browser and visit:

- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui
- **Health Check**: http://localhost:8080/q/health
- **Dev UI**: http://localhost:8080/q/dev

You should see:

```json
{
  "status": "UP",
  "checks": [
    {"name": "Database connection", "status": "UP"},
    {"name": "Redis connection", "status": "UP"},
    {"name": "Ollama connection", "status": "UP"}
  ]
}
```

### Step 4: Make Your First Change

1. Open `backend/src/main/java/com/talentpool/api/HealthResource.java`
2. Make a change (add a comment, modify a string)
3. Save the file
4. Watch the console - the app reloads automatically! ⚡

```
[INFO] Changes detected - recompiling the module!
[INFO] Recompilation complete in 1.2s
```

**Congratulations!** You're now ready to develop. 🚀

---

## What Just Happened?

### Automatic Service Provisioning

Quarkus Dev Services automatically:

1. **Downloaded Docker images** (only on first run):
   - PostgreSQL 16 with pgvector extension
   - Redis 7 (Alpine Linux)
   - Ollama for local LLM inference

2. **Started containers** with optimal configurations:
   - PostgreSQL on a random available port
   - Redis on a random available port
   - Ollama on port 11434

3. **Initialized the database**:
   - Created database `talentpool_dev`
   - Installed extensions: pgvector, pgcrypto, citext, uuid-ossp
   - Ran all Flyway migrations (22 scripts)
   - Created tables, indexes, and constraints

4. **Downloaded the LLM model**:
   - Pulled `llama3.1` (8 billion parameters, ~4.7GB)
   - Stored in Docker volume for reuse

5. **Connected everything**:
   - Application → PostgreSQL (via JDBC)
   - Application → Redis (via Quarkus Redis client)
   - Application → Ollama (via LangChain4j)

### No Manual Configuration Required

You didn't need to:
- Install PostgreSQL locally
- Configure database credentials
- Run SQL scripts manually
- Install Redis
- Set up Ollama
- Download LLM models
- Configure connection strings

**Dev Services handled everything automatically!**

---

## Development Workflow

### Daily Workflow

```bash
# Morning: Start development
cd backend
mvn quarkus:dev

# Work on features, make changes
# Hot reload happens automatically on save

# Evening: Stop development
# Press Ctrl+C in the terminal
# Containers stop automatically
```

### Subsequent Runs (Fast!)

After the first run, startup is much faster:

```
[INFO] Container pgvector/pgvector:pg16 started in 2.1s (reused)
[INFO] Container redis:7-alpine started in 0.8s (reused)
[INFO] Container ollama/ollama:latest started in 1.2s (reused)
[INFO] Model llama3.1 already available (skipped download)
[INFO] Application started in 12.3s
```

**Startup time**: ~12-15 seconds (vs. 45+ seconds on first run)

### Hot Reload

Quarkus supports hot reload for:
- ✅ Java source files
- ✅ Configuration files (application.yml)
- ✅ Static resources (HTML, CSS, JS)
- ✅ Templates (Qute templates)
- ❌ Dependencies (requires restart)
- ❌ Database schema (requires Flyway migration)

### Running Tests

```bash
# Run all tests (unit + integration)
mvn verify

# Run only unit tests
mvn test

# Run specific test class
mvn test -Dtest=DesafioServiceTest

# Run tests with coverage
mvn verify jacoco:report
# View coverage: target/site/jacoco/index.html
```

**Note**: Integration tests use Testcontainers, which reuses the same containers as Dev Services for speed.

---

## Useful Commands

### Maven Commands

```bash
# Start development mode
mvn quarkus:dev

# Build the application
mvn clean package

# Build native executable (requires GraalVM)
mvn package -Pnative

# Run tests
mvn verify

# Clean build artifacts
mvn clean

# Update dependencies
mvn versions:display-dependency-updates
```

### Docker Commands

```bash
# List running containers
docker ps

# View container logs
docker logs <container-id>

# Stop all containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -aq)

# Clean up unused images and volumes
docker system prune -a --volumes

# View Docker disk usage
docker system df
```

### Database Commands

```bash
# Connect to PostgreSQL (from host)
docker exec -it <postgres-container-id> psql -U talentpool -d talentpool_dev

# View tables
\dt

# Describe table
\d usuarios

# View Flyway migration history
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC;

# Exit psql
\q
```

### Redis Commands

```bash
# Connect to Redis
docker exec -it <redis-container-id> redis-cli

# View all keys
KEYS *

# Get value
GET key_name

# Flush all data (careful!)
FLUSHALL

# Exit redis-cli
exit
```

### Ollama Commands

```bash
# List available models
docker exec -it <ollama-container-id> ollama list

# Pull a different model
docker exec -it <ollama-container-id> ollama pull llama3.1:70b

# Run a test prompt
docker exec -it <ollama-container-id> ollama run llama3.1 "Hello, world!"

# Remove a model
docker exec -it <ollama-container-id> ollama rm llama3.1
```

---

## Troubleshooting

### Issue: "Port already in use"

**Symptom**: Error message about port 8080, 5432, or 6379 being in use.

**Solution**: Dev Services automatically finds available ports. If you see this error:

```bash
# Find what's using the port
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Stop the conflicting process or change Quarkus port
mvn quarkus:dev -Dquarkus.http.port=8081
```

### Issue: "Out of disk space"

**Symptom**: Docker fails to pull images or start containers.

**Solution**: Clean up Docker resources:

```bash
# Remove unused containers, images, and volumes
docker system prune -a --volumes

# Check disk usage
docker system df

# Remove specific images
docker rmi pgvector/pgvector:pg16
docker rmi redis:7-alpine
docker rmi ollama/ollama:latest
```

### Issue: "Ollama model download is slow"

**Symptom**: First startup takes 10+ minutes downloading the model.

**Solution**: This is normal for the first run (4.7GB download). To speed up:

```bash
# Download model in advance
docker run -v ollama:/root/.ollama ollama/ollama pull llama3.1

# Or use a smaller model
docker run -v ollama:/root/.ollama ollama/ollama pull llama3.1:7b
```

### Issue: "Out of memory"

**Symptom**: Docker containers crash or system becomes unresponsive.

**Solution**: Increase Docker memory limit:

1. **Docker Desktop**: Settings → Resources → Memory → Set to 8GB+
2. **Linux**: Edit `/etc/docker/daemon.json`:
   ```json
   {
     "default-ulimits": {
       "memlock": {
         "Hard": -1,
         "Name": "memlock",
         "Soft": -1
       }
     }
   }
   ```

Or disable Ollama temporarily:

```yaml
# application-dev.yml
langchain4j:
  ollama:
    base-url: ""  # Disable Ollama
```

### Issue: "Flyway migration failed"

**Symptom**: Error during database initialization.

**Solution**: Check migration scripts and database state:

```bash
# View Flyway history
docker exec -it <postgres-container-id> psql -U talentpool -d talentpool_dev \
  -c "SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC;"

# Repair Flyway (if needed)
mvn flyway:repair

# Clean and re-migrate (CAUTION: deletes all data!)
mvn flyway:clean flyway:migrate
```

### Issue: "Cannot connect to Docker daemon"

**Symptom**: Error about Docker not being available.

**Solution**: Ensure Docker is running:

```bash
# Check Docker status
docker ps

# Start Docker Desktop (macOS/Windows)
# Or start Docker service (Linux)
sudo systemctl start docker
```

### Issue: "Hot reload not working"

**Symptom**: Changes don't trigger recompilation.

**Solution**: Check that you're in dev mode and the file is in the right location:

```bash
# Ensure you're running in dev mode
mvn quarkus:dev

# Check that the file is in src/main/java or src/main/resources
# Files in src/test are not watched

# If still not working, restart dev mode
# Press 's' in the terminal to force a restart
```

### Issue: "Tests are slow"

**Symptom**: Integration tests take minutes to run.

**Solution**: Testcontainers reuses containers by default, but you can optimize:

```bash
# Run tests in parallel
mvn verify -T 4  # Use 4 threads

# Skip integration tests during development
mvn test  # Only unit tests

# Reuse containers across test runs
# Add to ~/.testcontainers.properties:
testcontainers.reuse.enable=true
```

---

## Next Steps

### 1. Explore the Codebase

```
backend/src/main/java/com/talentpool/
├── api/                    # REST endpoints (start here!)
│   ├── DesafioResource.java
│   ├── EvaluacionResource.java
│   └── UsuarioResource.java
├── domain/                 # Business entities
│   ├── Desafio.java
│   ├── Evaluacion.java
│   └── Usuario.java
├── service/                # Use case implementations
│   ├── GenerarDesafioService.java
│   └── EvaluarSolucionService.java
└── infrastructure/
    ├── persistence/        # Database repositories
    ├── ai/                 # LangChain4j AI services
    └── llm/                # LLM configuration
```

### 2. Read the Documentation

- **[Architecture](../product/ARCHITECTURE.md)**: System design and patterns
- **[Database Schema](../product/DATABASE.md)**: Complete data model
- **[Use Cases](../docs/uc/)**: Detailed feature specifications
- **[ADRs](../docs/adr/)**: Architecture decisions
- **[Dev Services Strategy](./dev-services-strategy.md)**: Deep dive into Dev Services

### 3. Pick Your First Task

Check the project board for:
- 🟢 **Good First Issue**: Perfect for newcomers
- 🟡 **Help Wanted**: Need extra hands
- 🔴 **Bug**: Something's broken

### 4. Set Up Your IDE

#### IntelliJ IDEA (Recommended)

1. **Import project**: File → Open → Select `backend/pom.xml`
2. **Install plugins**:
   - Quarkus Tools
   - Lombok
   - SonarLint
3. **Configure code style**: Import `backend/.editorconfig`
4. **Enable annotation processing**: Settings → Build → Compiler → Annotation Processors

#### VS Code

1. **Install extensions**:
   - Extension Pack for Java
   - Quarkus
   - Lombok Annotations Support
   - SonarLint
2. **Open workspace**: File → Open Folder → Select `backend/`
3. **Configure Java**: Cmd/Ctrl+Shift+P → "Java: Configure Java Runtime"

### 5. Join the Team

- **Slack**: #talent-pool-dev
- **Daily Standup**: 10:00 AM (your timezone)
- **Code Review**: All PRs require 1 approval
- **Questions**: Ask in Slack or open a discussion on GitHub

---

## Development Best Practices

### Code Style

- **Follow the existing patterns**: Look at similar code before writing new code
- **Use Lombok**: Reduce boilerplate with `@Data`, `@Builder`, etc.
- **Write tests**: Aim for 70%+ coverage
- **Document complex logic**: Add JavaDoc for public APIs

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/UC-007-generate-challenge

# Make changes and commit
git add .
git commit -m "feat(desafio): implement challenge generation via LangChain4j"

# Push and create PR
git push origin feature/UC-007-generate-challenge
```

**Commit message format**: `type(scope): description`
- **type**: feat, fix, docs, style, refactor, test, chore
- **scope**: module or feature name
- **description**: what changed (imperative mood)

### Testing Strategy

```java
// Unit test (fast, no external dependencies)
@Test
void testCalcularPuntaje() {
    var evaluacion = new Evaluacion();
    evaluacion.setPuntajeTotal(85.5);
    
    assertThat(evaluacion.getPuntajeTotal()).isEqualTo(85.5);
}

// Integration test (uses Testcontainers)
@QuarkusTest
class DesafioServiceIT {
    @Inject
    DesafioService service;
    
    @Test
    void testGenerarDesafio() {
        var desafio = service.generar(params);
        assertThat(desafio).isNotNull();
    }
}
```

### LLM Development

**IMPORTANT**: Never make real LLM calls in tests!

```java
// ❌ BAD: Real LLM call in test
@Test
void testEvaluarCodigo() {
    var resultado = llmService.evaluar(codigo);  // Costs money!
    assertThat(resultado).isNotNull();
}

// ✅ GOOD: Mocked LLM call
@Test
void testEvaluarCodigo() {
    when(llmService.evaluar(any())).thenReturn(mockResultado);
    var resultado = service.evaluar(codigo);
    assertThat(resultado).isNotNull();
}
```

---

## FAQ

### Q: Do I need to install PostgreSQL locally?

**A**: No! Dev Services handles it automatically.

### Q: Can I use a different database for development?

**A**: Yes, but not recommended. Disable Dev Services and configure your own connection:

```properties
quarkus.devservices.enabled=false
quarkus.datasource.jdbc.url=jdbc:postgresql://your-host:5432/your-db
```

### Q: How do I reset the database?

**A**: Stop the app, remove the Docker volume, and restart:

```bash
# Stop the app (Ctrl+C)
docker volume rm <volume-name>
mvn quarkus:dev  # Fresh database!
```

### Q: Can I use OpenAI instead of Ollama in development?

**A**: Yes, set your API key:

```bash
export OPENAI_API_KEY="sk-..."
export LLM_PROVIDER="openai"
mvn quarkus:dev
```

### Q: How do I debug the application?

**A**: Dev mode includes debugging by default:

1. **IntelliJ**: Run → Attach to Process → Select Quarkus process
2. **VS Code**: Use the "Attach to Quarkus" debug configuration
3. **Port**: 5005 (default debug port)

### Q: What if I don't have enough RAM for Ollama?

**A**: Disable Ollama and use OpenAI for development:

```yaml
# application-dev.yml
langchain4j:
  ollama:
    base-url: ""
app:
  llm:
    provider: openai
```

### Q: How do I contribute?

**A**: Read [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

---

## Getting Help

### Resources

- **Documentation**: `/docs` directory
- **Slack**: #talent-pool-dev channel
- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bugs and feature requests

### Common Commands Cheat Sheet

```bash
# Development
mvn quarkus:dev              # Start dev mode
mvn verify                   # Run all tests
mvn clean package            # Build JAR

# Docker
docker ps                    # List containers
docker logs <id>             # View logs
docker system prune -a       # Clean up

# Database
docker exec -it <id> psql -U talentpool -d talentpool_dev

# Git
git checkout -b feature/...  # New branch
git commit -m "..."          # Commit
git push origin feature/...  # Push
```

---

**Welcome aboard!** 🚀 If you have any questions, don't hesitate to ask in Slack or open a discussion on GitHub.

Happy coding! 💻