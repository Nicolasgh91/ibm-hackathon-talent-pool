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

### Core Use Cases

The MVP implements **4 critical use cases** for the hackathon demo:

| ID | Use Case | Priority | Actor |
|----|----------|----------|-------|
| **UC-001** | Generar desafío técnico automatizado | Crítica | Reclutador/Docente |
| **UC-002** | Resolver desafío y evaluar mediante análisis estático | Crítica | Candidato/Alumno |
| **UC-003** | Visualizar ranking de candidatos y reportes de evaluación | Crítica | Reclutador/Docente |
| **UC-004** | Acceder y seleccionar desafíos por parte del candidato | Crítica | Candidato/Alumno |

**UC-001: Generate Technical Challenge**
- Recruiter/educator inputs job parameters (role, technology, seniority)
- System generates challenge + hidden rubric via LLM (LangChain4j)
- Challenge becomes available for candidates
- **Output**: Challenge with structured rubric stored in JSONB

**UC-002: Solve and Evaluate Challenge**
- Candidate views challenge and develops solution in integrated editor
- System evaluates via AI-powered static analysis
- Returns score (0-100) and detailed feedback with multi-dimensional breakdown
- **Output**: Evaluation with score, feedback, and dimension analysis

**UC-003: View Rankings and Reports**
- Recruiter accesses dashboard with candidate rankings by challenge
- Reviews submitted code and AI analysis
- Filters by score, technology, and seniority
- Makes selection decisions based on objective metrics

**UC-004: Browse Challenge Catalog**
- Candidate accesses challenge catalog
- Filters by technology/level/context (corporate, academic, public)
- Selects challenge and initiates evaluation process
- Tracks personal progress and historical evaluations

### Planned Use Cases (Post-MVP)

| ID | Use Case | Priority | Phase |
|----|----------|----------|-------|
| UC-005 | Registrar usuario (reclutador/candidato) | Alta | 2 |
| UC-006 | Iniciar sesión y gestión de perfiles | Alta | 2 |
| UC-007 | Centralizar consultas a IA (repositorio colectivo) | Alta | 2 |
| UC-008 | Generar guías de estudio personalizadas | Media | 2 |
| UC-009 | Filtrar base de talento por tecnología y puntaje | Media | 3 |
| UC-010 | Crear simuladores de flujos de trabajo empresariales | Media | 3 |
| UC-011 | Emitir certificados digitales de finalización | Baja | 4 |
| UC-012 | Sistema de suscripciones y pagos | Baja | 4 |

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
- **MVP Core**: 8 tables (usuarios, organizaciones, membresias, puestos, desafios, asignaciones_desafio, evaluaciones, prompt_versiones)
- PostgreSQL 16 with JSONB support for structured data (rubrics, feedback)
- pgvector 0.7.x extension (prepared for future RAG)
- Multi-tenant architecture via `organizacion_id`
- UUID v7 identifiers for time-ordered IDs

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

### Challenge Management
- `POST /api/v1/puestos` - Create job position
- `POST /api/v1/desafios/generar` - Generate challenge (UC-001)
- `GET /api/v1/desafios` - List challenges (UC-004)
- `GET /api/v1/desafios/{id}` - Get challenge details

### Evaluation
- `POST /api/v1/evaluaciones` - Submit solution (UC-002)
- `GET /api/v1/evaluaciones/{id}` - Get evaluation result
- `GET /api/v1/evaluaciones/ranking/{desafioId}` - Get rankings (UC-003)

### Health & Monitoring
- `GET /q/health/live` - Liveness probe
- `GET /q/health/ready` - Readiness probe
- `GET /q/metrics` - Prometheus metrics

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

- **Product Definition**: [product/PRODUCT.md](product/PRODUCT.md) - Complete product vision, use cases, and metrics
- **Architecture**: [product/ARCHITECTURE.md](product/ARCHITECTURE.md) - Technical architecture and stack decisions
- **Database Schema**: [product/DATABASE.md](product/DATABASE.md) - Complete 20-table schema with all constraints and rules
- **Roadmap**: [product/ROADMAP.md](product/ROADMAP.md) - Development phases and milestones
- **Use Cases**: [docs/uc/](docs/uc/) - Detailed use case specifications
- **ADRs**: [docs/adr/](docs/adr/) - Architecture Decision Records
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- **Changelog**: [CHANGELOG.md](CHANGELOG.md) - Version history
- **Tech Debt**: [TECH_DEBT.md](TECH_DEBT.md) - Known technical debt

---

## Roadmap

### Phase 0: MVP (Hackathon - 48-72h)
- ✅ Core evaluation engine (UC-001 to UC-004)
- ✅ 4 essential screens
- ✅ Basic data model
- ✅ LLM integration via LangChain4j

### Phase 2: Academic Module (4-6 weeks)
- Authentication system (OAuth, granular roles)
- Collective AI query repository
- Personalized study guides
- Student collaboration features

### Phase 3: Corporate Expansion (8-12 weeks)
- Searchable talent database
- Company-specific workflow simulators
- ATS integrations
- Advanced analytics

### Phase 4: Monetization (12-16 weeks)
- Subscription system
- Payment processing
- Digital certificates
- Premium challenge marketplace

---

## License

[To be defined]

---

## Contact

[To be defined]

---

**Built with ❤️ for IBM Hackathon 2026**
