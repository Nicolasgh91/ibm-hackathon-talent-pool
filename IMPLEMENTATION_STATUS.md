# Implementation Status — Talent Pool

**Last updated**: 2026-05-03

**Canonical phase checklist**: Use [`product/ROADMAP.md`](product/ROADMAP.md) (Phases 0–1) for `[x]` / `[~]` / `[ ]` audit state. This file summarizes implementation highlights and pointers to code.

## MVP closure (in flight)

A phased plan to close ROADMAP Phase 1+2 DoD lives at `.cursor/plans/backend_mvp_closure_*.plan.md`. Status:

- **Phase A — Schema & domain gaps**: complete. V016..V021 applied (`herramientas`/`skills_*`/`roadmap_publico_habilitado` on `puestos`; `plan_evaluacion_id`/`tipo_desafio`/`peso`/`cursos_integrados` on `desafios`; new `evaluaciones_versiones`, `llamadas_llm`, `eventos_auditoria` tables; `evaluador_codigo` and `juez_evals` prompt versions seeded). New Panache entities + insert-only `LlamadaLlmService` and `AuditService`. `PhaseASchemaTest` (5/5 green).
- **Phase B — Real LLM wiring**: pending.
- **Phase C — Auth & identity**: pending.
- **Phase D — Challenge & evaluation flow**: pending.
- **Phase E — Observability & evals**: pending.
- **Phase F — Tests, CI, security gates**: pending.

---

## Phase 0 — Foundations (mostly complete)

What matches the roadmap:

- **Backend**: Quarkus 3.17.x, LangChain4j, Flyway (migrations through demo schema), Maven wrapper, Spotless (Google Java Format), profiles `dev` / `test` / `prod`, SmallRye OpenAPI, health + Prometheus metrics, `@QuarkusTest` (`HealthCheckTest`, `AuthResourceTest`, `ChatResourceTest`).
- **Frontend**: Vite + React + TypeScript, ESLint + Prettier + Husky, axios-based API client; script `npm run openapi:types` genera `frontend/src/types/api.gen.ts` desde [`api/openapi.yaml`](../api/openapi.yaml) (YAML maestro incremental).
- **Compose (dev)**: [`infra/compose/docker-compose.dev.yml`](infra/compose/docker-compose.dev.yml) — PostgreSQL (pgvector), Redis, Ollama (no backend/frontend services).
- **Docs**: [`CHANGELOG.md`](CHANGELOG.md), [`TECH_DEBT.md`](TECH_DEBT.md), ADRs in [`docs/adr/`](docs/adr/).

Still open vs roadmap: **GitHub Actions CI**, **Dockerfiles** for JVM backend / nginx frontend, **full-stack compose** with app containers, **SonarCloud**, **staging** HTTPS, **openapi-typescript** pipeline, **MockChatModel** tests, dedicated **health check page** in the SPA.

**Organizations (UC-004)**: `GET/POST/PUT/DELETE /api/v1/organizations` implemented ([`OrganizationsResource`](backend/src/main/java/com/talentpool/api/OrganizationsResource.java), [`OrganizacionService`](backend/src/main/java/com/talentpool/service/OrganizacionService.java)). JWT user id is read from `JsonWebToken.getSubject()` (same as `GET /auth/me`). Flyway **V015** adds nullable `organizaciones.descripcion` for the SPA form. Delete is **OWNER-only** and blocked with **409** if the org still has job positions.

---

## Phase 1 — Walking Skeleton (partial)

### Authentication (done)

- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, **`GET /api/v1/auth/me`** (roadmap text said `/users/me`; same behavior).
- Argon2id + JWT — see [`AuthResource`](backend/src/main/java/com/talentpool/api/AuthResource.java), [`AuthService`](backend/src/main/java/com/talentpool/service/AuthService.java).

### Chat API (done)

- `POST /api/v1/chat` with LangChain4j, [`InputGuardrailService`](backend/src/main/java/com/talentpool/infrastructure/security/InputGuardrailService.java), Redis [**RedisRateLimiter**](backend/src/main/java/com/talentpool/infrastructure/ratelimit/RedisRateLimiter.java) (10/min), Micrometer + MDC correlation in [`ChatService`](backend/src/main/java/com/talentpool/service/ChatService.java).

### Frontend auth + app shell (done / evolved)

- [`Register.tsx`](frontend/src/pages/Register.tsx), [`Login.tsx`](frontend/src/pages/Login.tsx), [`AuthContext.tsx`](frontend/src/contexts/AuthContext.tsx), [`api.ts`](frontend/src/services/api.ts) interceptors.
- **Student (Phase 5 demo, mock)**: rutas [`/student/dashboard`](frontend/src/App.tsx) → curso → repositorio → nueva consulta / detalle; datos en [`studentCourseMock.ts`](frontend/src/mocks/studentCourseMock.ts); desactivar UI con `VITE_ENABLE_STUDENT_DEMO=false`.
- **No** Phase-1-only **`/home` chat UI** or **`ChatContext`** — product evolved to hackathon flows ([`Dashboard.tsx`](frontend/src/pages/Dashboard.tsx), challenges, evaluations).
- Refresh tokens are **stored**; backend **refresh endpoint not implemented** — 401 clears local session.

### Still open vs Phase 1 roadmap

- **LLM eval suite** at 100% in CI (YAML dataset + Maven `evals` profile exist; executable Java eval tests not complete).
- **Grafana / alerting**, **E2E in CI** (Playwright configured but no committed specs), **JWT refresh API**, **React Error Boundaries**, **loading skeletons** as listed in ROADMAP.

---

## Hackathon demo scope (beyond Phase 1)

REST resources for **organizations**, positions (CRUD + ranking), challenges (list + detail + generate + invitations), **assignments** (`AssignmentsResource`), evaluations (list + rankings + my-evaluations), invitations by token, chat — ver [`docs/api-contract-status.md`](docs/api-contract-status.md). Smoke client: `com.talentpool.tools.DemoSmokeClient` (uses seeded `PUESTO_ID`; does not exercise organization CRUD).

**SPA**: rutas públicas `/accept-invitation?token=` y autenticadas `/chat` conectadas a los endpoints backend (mock cubre ambas en fallback).

---

## Quick commands

```bash
cd infra/compose && docker-compose -f docker-compose.dev.yml up -d
cd backend && ./mvnw quarkus:dev
# frontend: pnpm dev (from frontend/)
```

---

## Definition of Done — Phase 1 (mirror of ROADMAP)

Track completion in [`product/ROADMAP.md`](product/ROADMAP.md) § Phase 1 Definition of Done; rough snapshot:

| Item | State |
|------|--------|
| Register / login (human) | Done |
| Chat with LLM | API yes; dedicated Phase-1 chat UI no |
| Metrics / cost / latency | Partial (Micrometer; no Grafana dashboard in repo) |
| E2E in CI | Open |
| LLM eval 100% | Open |
| Demo video | Open |
