# Talent Pool — AI-Powered Technical Assessment Platform

> **MVP for IBM Hackathon 2026** | Automated challenge generation and evaluation using LangChain4j

**Stack**: Quarkus + Java 21 + LangChain4j + PostgreSQL + pgvector + React + TypeScript + Vite

---

## Overview

Talent Pool is an AI-powered platform that bridges the gap between technical education and employment by automating the generation and evaluation of technical challenges. It reduces operational overhead for educators, optimizes learning resources for students, and provides companies with access to pre-evaluated talent.

### Core Value Proposition

- **Automated end-to-end assessment**: LLM-powered challenge generation with hidden rubrics and static code analysis
- **Collective knowledge repository**: Centralized AI queries to avoid resource duplication
- **Direct education-to-employment bridge**: Pre-evaluated talent database with real-world workflow simulations
- **Contextualized evaluation**: Open-book challenges that simulate actual work environments

---

## Problem Statement

The disconnect between academic training and the job market creates:

- **For educators**: Countless hours spent on manual grading and correction
- **For students**: Isolated AI tool usage without collaborative learning opportunities
- **For companies**: High onboarding costs (USD 10,000-30,000 per employee) and 3-6 month induction periods

**Current alternatives** (HackerRank, Codility, traditional LMS) lack AI-powered automation and don't personalize content or connect education directly with job placement.

---

## MVP Scope (Hackathon)

### Use Case Overview

The platform implements **26 use cases** organized into functional areas. The MVP (Phase 1) focuses on **11 critical use cases** for the hackathon demo:

#### Phase 1 - MVP (Critical Use Cases)

**Identity & Onboarding**
- **UC-001**: Registrar usuario - Create account with email verification
- **UC-002**: Iniciar sesión - Authenticate and obtain access tokens
- **UC-003**: Completar perfil tras primer login - Complete profile wizard with role selection

**Organization Management**
- **UC-004**: Crear organización - Create company or educational institution

**Corporate Side (Recruiters)**
- **UC-006**: Crear puesto laboral - Register job position
- **UC-007**: Generar desafío técnico desde un puesto - AI-powered challenge generation via LangChain4j
- **UC-008**: Confirmar o regenerar desafío propuesto - Review and refine generated challenges
- **UC-009**: Invitar candidato a un desafío - Send challenge invitations to candidates
- **UC-010**: Ver ranking de candidatos - View candidate rankings and metrics
- **UC-011**: Ver detalle de evaluación de un candidato - Review detailed evaluation reports

**Candidate/Student Side**
- **UC-016**: Aceptar invitación y acceder al desafío - Accept invitation and access challenge
- **UC-017**: Resolver desafío - Solve challenge in integrated editor with AI evaluation
- **UC-018**: Ver feedback de evaluación propia - View detailed feedback and scoring

#### Phase 2 - Academic Module (High Priority)

**Academic Side (Educators)**
- **UC-012**: Crear curso - Create academic course
- **UC-013**: Inscribir alumnos a un curso - Enroll students in courses
- **UC-014**: Generar desafío para curso - Generate challenges for academic context
- **UC-015**: Escribir recomendación a un alumno - Write student recommendations

**Organization & Talent Management**
- **UC-005**: Invitar miembro a organización con rol - Invite members with specific roles
- **UC-019**: Gestionar visibilidad en el pool de talento - Manage talent pool visibility
- **UC-020**: Aceptar o rechazar recomendación recibida - Accept/reject recommendations

**Collaborative Learning (LLM Repository)**
- **UC-021**: Hacer consulta a LLM en contexto de curso - Make AI queries in course context
- **UC-022**: Votar consulta del repositorio - Vote on shared AI queries

### Core MVP Flows

**Flow 1: Recruiter Creates Challenge**
1. Recruiter creates organization (UC-004) and job position (UC-006)
2. System generates AI-powered challenge from job parameters (UC-007)
3. Recruiter reviews and confirms challenge (UC-008)
4. Recruiter invites candidates (UC-009)

**Flow 2: Candidate Solves Challenge**
1. Candidate registers (UC-001) and completes profile (UC-003)
2. Candidate accepts invitation (UC-016)
3. Candidate solves challenge in integrated editor (UC-017)
4. System evaluates via LangChain4j and returns detailed feedback (UC-018)

**Flow 3: Recruiter Reviews Results**
1. Recruiter views candidate rankings (UC-010)
2. Recruiter reviews detailed evaluations and code (UC-011)
3. Recruiter makes hiring decisions based on objective metrics

### Technical Scope

**Backend (Quarkus + LangChain4j)**
- Automatic challenge generation via LLM
- Hidden evaluation rubrics (JSONB storage)
- Automated static code analysis
- Detailed feedback with numerical scoring (0-100)

**Frontend (React + TypeScript)**
- Role-based dashboard (recruiters and candidates)
- Challenge generation form
- Integrated code editor (Monaco Editor)
- Results and ranking views

**Data Model**
- **20 tables** organized in 7 domains (see `product/DATABASE.md` for complete schema)
- **MVP Core (Phase 1)**: 8 essential tables
  - `usuarios` - User accounts with authentication
  - `organizaciones` - Companies and educational institutions
  - `membresias` - User-organization relationships with roles (OWNER, ADMIN, RECLUTADOR, DOCENTE, ALUMNO)
  - `puestos` - Job positions with technology and seniority
  - `desafios` - AI-generated technical challenges with hidden rubrics
  - `asignaciones_desafio` - Challenge invitations to candidates
  - `evaluaciones` - Challenge evaluations with AI feedback and scoring
  - `prompt_versiones` - Versioned LLM prompts for auditability and A/B testing
- **Phase 2 Additions**: `cursos`, `inscripciones_curso`, `perfiles_talento`, `habilidades_perfil`, `recomendaciones`, `consultas_llm`, `votos_consulta`, `llamadas_llm`, `eventos_auditoria`
- PostgreSQL 16 with JSONB support for structured AI outputs (rubrics, feedback, dimensions)
- pgvector 0.7.x extension (prepared for RAG in Phase 3)
- Multi-tenant architecture via `organizacion_id`
- UUID v7 identifiers for time-ordered IDs with embedded timestamps

---

## Architecture

### Style
**Modular monolith** (backend) + **decoupled SPA** (frontend)

### C4 Diagram - Level 2 (Containers)

```
┌──────────────────────────────────────────────────────────────┐
│                      Frontend Layer                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │  React SPA (TypeScript + Vite)                     │     │
│  │  - Recruiter panel (UC-001, UC-003)                │     │
│  │  - Candidate panel (UC-002, UC-004)                │     │
│  │  - Integrated code editor (Monaco)                 │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTPS / JSON (REST)
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                      Backend Layer                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Quarkus API (Java 21)                             │     │
│  │  ┌──────────────────────────────────────────────┐ │     │
│  │  │ API Layer (JAX-RS / RESTEasy Reactive)      │ │     │
│  │  │  - /api/v1/puestos                           │ │     │
│  │  │  - /api/v1/desafios                          │ │     │
│  │  │  - /api/v1/evaluaciones                      │ │     │
│  │  └──────────────────────────────────────────────┘ │     │
│  │  ┌──────────────────────────────────────────────┐ │     │
│  │  │ Service Layer (Use Cases)                    │ │     │
│  │  │  - GenerarDesafioService (UC-001)            │ │     │
│  │  │  - EvaluarSolucionService (UC-002)           │ │     │
│  │  │  - ConsultarRankingService (UC-003)          │ │     │
│  │  └──────────────────────────────────────────────┘ │     │
│  │  ┌──────────────────────────────────────────────┐ │     │
│  │  │ Infrastructure Layer                         │ │     │
│  │  │  - LangChain4j AI Services                   │ │     │
│  │  │  - Hibernate ORM with Panache                │ │     │
│  │  │  - Flyway Migrations                         │ │     │
│  │  └──────────────────────────────────────────────┘ │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────┬──────────────────────┬───────────────────────┘
                │                      │
                ↓                      ↓
    ┌───────────────────┐    ┌────────────────────┐
    │  PostgreSQL 16    │    │  LLM Providers     │
    │  + pgvector 0.7.x │    │  - OpenAI GPT-4    │
    │  + pgcrypto       │    │  - Anthropic Claude│
    │  + citext         │    │  - Ollama (dev)    │
    │                   │    │                    │
    │  20 Tables:       │    │  via LangChain4j   │
    │  - usuarios       │    └────────────────────┘
    │  - organizaciones │
    │  - membresias     │
    │  - puestos        │
    │  - desafios       │
    │  - asignaciones   │
    │  - evaluaciones   │
    │  - prompt_vers.   │
    │  + 12 more...     │
    │                   │
    │  See DATABASE.md  │
    └───────────────────┘
```

---

## Tech Stack (Closed Decisions)

### Backend
- **JDK**: Eclipse Temurin 21 LTS
- **Framework**: Quarkus 3.17.x
- **LLM Toolkit**: LangChain4j (Quarkus extension)
- **API**: RESTEasy Reactive (JAX-RS)
- **ORM**: Hibernate ORM with Panache
- **Migrations**: Flyway
- **Database**: PostgreSQL 16 + pgvector 0.7.x
- **Cache**: Redis 7.x
- **Testing**: JUnit 5, AssertJ, Mockito, REST Assured, Testcontainers
- **Observability**: Micrometer + OpenTelemetry

### Frontend
- **Language**: TypeScript 5.x
- **Framework**: React 18.x
- **Build**: Vite 5.x
- **Package Manager**: pnpm 9.x
- **Router**: React Router 6.x
- **State Management**: TanStack Query 5.x + Zustand/Context API
- **Code Editor**: Monaco Editor
- **Testing**: Vitest + Testing Library + Playwright

### Infrastructure
- **Containers**: Docker + docker-compose
- **CI/CD**: GitHub Actions
- **Static Analysis**: SonarQube/SonarCloud + GitHub CodeQL
- **Cloud**: Render/Railway (MVP), AWS/GCP (production)

---

## Project Structure

```
/
├── backend/                    # Quarkus API
│   ├── src/main/java/com/talentpool/
│   │   ├── api/               # JAX-RS resources (endpoints)
│   │   ├── domain/            # Business entities
│   │   ├── service/           # Use case implementations
│   │   └── infrastructure/
│   │       ├── persistence/   # Panache repositories
│   │       ├── ai/            # LangChain4j AI services
│   │       └── llm/           # LLM configuration
│   └── src/main/resources/
│       ├── application.yml
│       ├── db/migration/      # Flyway scripts
│       └── prompts/           # LLM prompt templates
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── reclutador/   # Recruiter UI (UC-001, UC-003)
│   │   │   └── candidato/    # Candidate UI (UC-002, UC-004)
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/         # API clients
│   └── tests/
├── infra/
│   ├── docker/               # Dockerfiles
│   └── compose/              # docker-compose files
├── docs/
│   ├── adr/                  # Architecture Decision Records
│   ├── uc/                   # Use Cases
│   └── runbooks/             # Operational guides
└── product/
    ├── PRODUCT.md            # Product definition
    ├── ARCHITECTURE.md       # Technical architecture
    └── ROADMAP.md            # Development phases
```

---

## Getting Started

### Prerequisites
- JDK 21 (Eclipse Temurin recommended)
- Maven 3.9.x
- Node.js 20.x + pnpm 9.x
- Docker + docker-compose
- PostgreSQL 16 (or use docker-compose)

### Local Development

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd hackathon
   ```

2. **Start infrastructure**
   ```bash
   cd infra/compose
   docker-compose up -d  # PostgreSQL + pgvector + Redis + Ollama
   ```

3. **Backend**
   ```bash
   cd backend
   mvn quarkus:dev  # Runs on http://localhost:8080
   ```

4. **Frontend**
   ```bash
   cd frontend
   pnpm install
   pnpm dev  # Runs on http://localhost:5173
   ```

### Environment Variables

Create `.env` files or configure in `application.yml`:

```yaml
# Backend (application.yml)
quarkus:
  langchain4j:
    openai:
      api-key: ${LLM_API_KEY}
  datasource:
    jdbc:
      url: ${DB_JDBC_URL:jdbc:postgresql://localhost:5432/talentpool}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
```

---

## Key Endpoints (MVP)

### Authentication & Identity (UC-001, UC-002, UC-003)
- `POST /api/v1/auth/register` - Register new user with email verification
- `POST /api/v1/auth/login` - Authenticate and obtain JWT tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `PATCH /api/v1/usuarios/{id}/perfil` - Complete user profile

### Organization Management (UC-004, UC-005)
- `POST /api/v1/organizaciones` - Create organization (company or institution)
- `GET /api/v1/organizaciones/{id}` - Get organization details
- `POST /api/v1/organizaciones/{id}/invitaciones` - Invite member with role
- `GET /api/v1/organizaciones/{id}/miembros` - List organization members

### Job Positions & Challenges (UC-006, UC-007, UC-008)
- `POST /api/v1/puestos` - Create job position
- `GET /api/v1/puestos` - List positions
- `POST /api/v1/desafios/generar` - Generate AI-powered challenge from position
- `PUT /api/v1/desafios/{id}/confirmar` - Confirm or regenerate challenge
- `GET /api/v1/desafios/{id}` - Get challenge details (rubric hidden for candidates)

### Challenge Invitations (UC-009, UC-016)
- `POST /api/v1/asignaciones` - Invite candidate to challenge
- `GET /api/v1/asignaciones/mis-invitaciones` - List my pending invitations
- `POST /api/v1/asignaciones/{id}/aceptar` - Accept challenge invitation

### Evaluation & Solving (UC-017, UC-018)
- `POST /api/v1/evaluaciones` - Submit solution for AI evaluation
- `GET /api/v1/evaluaciones/{id}` - Get evaluation result with feedback
- `GET /api/v1/evaluaciones/mis-evaluaciones` - List my evaluations

### Rankings & Reports (UC-010, UC-011)
- `GET /api/v1/evaluaciones/ranking/{desafioId}` - Get candidate rankings by challenge
- `GET /api/v1/evaluaciones/{id}/detalle-reclutador` - Get detailed evaluation (recruiter view with rubric)

### Health & Monitoring
- `GET /q/health/live` - Liveness probe
- `GET /q/health/ready` - Readiness probe
- `GET /q/metrics` - Prometheus metrics
- `GET /q/openapi` - OpenAPI 3.0 specification

---

## Success Metrics

### Product Metrics (Hackathon)
- ≥ 50 challenges generated successfully
- ≥ 100 completed evaluations
- < 30s average challenge generation time
- < 10s average evaluation time
- ≥ 60% challenge completion rate
- ≥ 7/10 user satisfaction (NPS)

### Technical SLOs
- 99% system availability
- < 300ms p95 latency for CRUD endpoints
- < 8s p95 latency for LLM challenge generation
- < 5s p95 latency for code evaluation
- < 1% 5xx error rate
- < USD 5 cost per 100 evaluations

### LLM-Specific Metrics
- ≥ 85% challenge relevance quality
- ≥ 80% evaluation accuracy (vs human evaluator)
- ≥ 98% valid structured responses (JSON)
- < 5% hallucination rate
- ≥ 90% evaluation consistency

---

## Testing Strategy

### Test Pyramid
- **Unit tests**: 70% coverage (domain logic, services)
- **Integration tests**: 20% coverage (@QuarkusTest with Testcontainers)
- **E2E tests**: 10% coverage (Playwright for critical flows)
- **LLM evals**: Dedicated suite with golden dataset (see ADR-0003)

### Testing Rules
- **Immutable tests**: If a test fails, fix the code, never the test
- **LLM tests always mocked**: Real calls only in controlled eval suite
- **No flaky tests**: Retry logic only for external dependencies

### CI Pipeline
```yaml
# .github/workflows/ci.yml
- Backend: mvn verify (unit + integration tests)
- Frontend: pnpm test (Vitest + Playwright)
- LLM Evals: Smoke tests only in CI
- SonarQube: Quality gate enforcement
- Docker: Build verification
```

---

## GitHub Configuration

### Required Secrets
Configure in `Settings → Secrets and variables → Actions`:

| Secret | Purpose | Source |
|--------|---------|--------|
| `SONAR_TOKEN` | SonarCloud authentication | sonarcloud.io |
| `SONAR_HOST_URL` | Sonar instance URL | `https://sonarcloud.io` |
| `LLM_API_KEY` | LLM provider access | OpenAI/Anthropic/etc. |
| `STAGING_DB_*` | Staging database credentials | Cloud provider |
| `PROD_DB_*` | Production database credentials | Cloud provider |

### Environments
- **staging**: Auto-deploy on push to `main`
- **production**: Manual approval required

### Branch Protection (main)
- Require PR reviews (≥ 1 approval)
- Require status checks: `backend`, `frontend`, `e2e`, `sonar`, `docker-build`
- Require branches up to date
- No bypass allowed

---

## Development Principles

1. **Closed decisions, not open**: Agent executes architecture, doesn't choose it
2. **Immutable tests**: Fix code, never tests
3. **LLM tests always mocked**: Real calls only in eval suite
4. **Documented debt or it doesn't exist**: Undocumented shortcuts = future bugs
5. **No ambiguity**: Every UC has verifiable criteria, every PR has DoD
6. **Security and observability from day 1**: Not final phases
7. **Measured quality, not assumed**: Linters, tests, evals, and Sonar block in CI
8. **Controlled costs**: Every LLM UC declares token budget and cost

---

## Documentation

### Product & Strategy
- **[product/PRODUCT.md](product/PRODUCT.md)** - Complete product vision with all use cases (UC-001–UC-026), user personas, and success metrics
- **[product/ROADMAP.md](product/ROADMAP.md)** - Development phases with Definition of Done for each milestone
- **[product/DATABASE.md](product/DATABASE.md)** - Complete 24-table schema organized in 7 domains with constraints and business rules

### Technical Architecture
- **[product/ARCHITECTURE.md](product/ARCHITECTURE.md)** - Closed technical decisions, stack, folder structure, and patterns
- **[docs/adr/](docs/adr/)** - Architecture Decision Records (ADR-0001–0003: stack, RAG, LLM evals; ADR-0008: roadmap practice LLM cost allocation)
- **[docs/uc/](docs/uc/)** - Detailed use case specifications with acceptance criteria and LLM considerations

### Development & Operations
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Development guidelines for humans and AI agents
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes
- **[TECH_DEBT.md](TECH_DEBT.md)** - Registered technical debt with priority and remediation plans
- **[docs/runbooks/](docs/runbooks/)** - Operational runbooks for incident response

---

## Roadmap

### Phase 1: MVP (Hackathon - 48-72h)
**11 Critical Use Cases** - Complete end-to-end flows for both recruiters and candidates

**Identity & Onboarding** (UC-001 to UC-003)
- User registration with email verification (argon2id password hashing)
- JWT-based authentication (access + refresh tokens)
- Profile completion wizard with role selection

**Organization & Job Management** (UC-004, UC-006)
- Create organizations (companies/institutions)
- Create job positions with technology and seniority

**AI-Powered Challenge Generation** (UC-007, UC-008)
- Generate challenges from job parameters via LangChain4j
- Confirm or regenerate with versioned prompts
- Hidden rubrics stored in JSONB

**Challenge Assignment & Solving** (UC-009, UC-016, UC-017, UC-018)
- Invite candidates to challenges
- Accept invitations and access challenges
- Solve in integrated Monaco editor
- AI-powered evaluation with detailed feedback

**Recruiter Analytics** (UC-010, UC-011)
- View candidate rankings by challenge
- Review detailed evaluations with code and rubric analysis

**Technical Deliverables**
- 8-table PostgreSQL schema with multi-tenancy
- Quarkus backend with LangChain4j integration
- React frontend with Monaco editor
- Full CI/CD pipeline with quality gates

### Phase 2: Academic Module (4-6 weeks)
**11 Additional Use Cases** - Expand to educational institutions

**Academic Features** (UC-012 to UC-015)
- Course creation and student enrollment
- Generate challenges for academic context
- Teacher recommendations for students

**Enhanced Organization** (UC-005)
- Invite members with granular roles (DOCENTE, ALUMNO, RECLUTADOR, etc.)

**Talent Pool Management** (UC-019, UC-020)
- Manage visibility in talent pool
- Accept/reject recommendations

**Collaborative Learning** (UC-021, UC-022)
- Centralized LLM query repository per course
- Vote on shared queries to surface best answers
- Reduce token costs through query deduplication

**Technical Additions**
- 12 additional tables (cursos, perfiles_talento, consultas_llm, etc.)
- RAG implementation with pgvector for context-aware responses
- Advanced analytics dashboard for educators

### Phase 3: Corporate Expansion (8-12 weeks)
- Searchable talent database with advanced filters
- Company-specific workflow simulators
- ATS integrations (Greenhouse, Lever, BambooHR)
- Advanced analytics and reporting
- API for third-party integrations

### Phase 4: Monetization & Scale (12-16 weeks)
- Subscription tiers (Free, Pro, Enterprise)
- Payment processing (Stripe/MercadoPago)
- Digital certificate issuance with blockchain verification
- Premium challenge marketplace
- White-label solutions for enterprises

---

## License

[To be defined]

---

## Contact

[To be defined]

---

**Built with ❤️ for IBM Hackathon 2026**
