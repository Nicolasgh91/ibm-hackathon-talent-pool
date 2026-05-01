# Plantilla de proyecto para desarrollo asistido por agente

Paquete genérico para iniciar una aplicación de software profesional, escalable, segura y mantenible, trabajando con Claude Code u otro agente de código.

**Stack**: Quarkus + Java 21 + LangChain4j + PostgreSQL + pgvector + React + TypeScript + Vite.

## Estructura

```
project-template/
├── README.md                                      → guía de uso del paquete
├── PRODUCT.md                                     → qué construimos y por qué
├── ARCHITECTURE.md                                → cómo lo construimos (cerrado)
├── ROADMAP.md                                     → fases 0 a 5 con DoD
├── CONTRIBUTING.md                                → reglas para humanos y agentes
├── CHANGELOG.md                                   → bitácora de versiones
├── TECH_DEBT.md                                   → registro de deuda técnica
├── sonar-project.properties                       → configuración de SonarQube
├── .github/
│   ├── pull_request_template.md                   → plantilla de PR
│   └── workflows/
│       ├── ci.yml                                 → maven verify, vitest, e2e, evals smoke, sonar
│       ├── cd.yml                                 → deploy a staging y producción
│       └── codeql.yml                             → análisis de seguridad SAST (Java + TS)
└── docs/
    ├── adr/
    │   ├── 0000-template.md                       → plantilla de ADR
    │   ├── 0001-stack-base.md                     → ADR: Quarkus + LangChain4j + React
    │   ├── 0002-rag-vector-store.md               → ADR: pgvector + LangChain4j RAG
    │   └── 0003-llm-evals.md                      → ADR: estrategia de evals
    ├── uc/
    │   ├── UC-template.md                         → plantilla de caso de uso (incluye sección LLM)
    │   └── UC-001-registrar-usuario.md            → UC ejemplo completo
    └── runbooks/
        └── incident-template.md                   → plantilla operacional
```

## Cómo usar este paquete

1. Copiá el contenido de esta carpeta a la raíz de tu repositorio.
2. Completá `PRODUCT.md` con la idea concreta de tu app.
3. Revisá y ajustá `ARCHITECTURE.md` (especialmente §2 stack y §3 estructura).
4. Ajustá `ROADMAP.md` a tus fases reales.
5. Configurá los secrets de GitHub (ver abajo).
6. Ajustá `sonar-project.properties` con tu `projectKey` y `organization`.
7. Leé `CONTRIBUTING.md` y compartilo con el agente como contexto.
8. Cada UC se desarrolla a partir de su archivo en `docs/uc/`.

## Lo que el agente va a construir en fase 0

A partir de este paquete, el agente puede generar:

- `backend/pom.xml` con Quarkus BOM, LangChain4j BOM y dependencias clave
- `backend/src/main/resources/application.yml` con perfiles dev/test/prod
- Estructura completa de paquetes Java según `ARCHITECTURE.md` §3
- `frontend/package.json`, `vite.config.ts`, `tsconfig.json`
- `infra/compose/docker-compose.yml` con Postgres+pgvector, Redis, Ollama
- `infra/docker/Dockerfile.backend.jvm`, `Dockerfile.backend.native` (perfil avanzado), `Dockerfile.frontend`
- Migración Flyway inicial vacía
- Endpoints `/q/health/*` funcionando
- Test mínimo `@QuarkusTest` y test mínimo Vitest

## Secrets de GitHub a configurar

En `Settings → Secrets and variables → Actions`:

| secret | uso | dónde se obtiene |
|--------|-----|------------------|
| `SONAR_TOKEN` | autenticación con Sonar | sonarcloud.io / sonarqube self-hosted |
| `SONAR_HOST_URL` | URL de Sonar | `https://sonarcloud.io` o tu instancia |
| `STAGING_DB_JDBC_URL` | conexión a BD de staging | tu proveedor cloud |
| `STAGING_DB_USERNAME` / `STAGING_DB_PASSWORD` | credenciales BD staging | tu proveedor cloud |
| `PROD_DB_JDBC_URL` | conexión a BD de producción | tu proveedor cloud |
| `PROD_DB_USERNAME` / `PROD_DB_PASSWORD` | credenciales BD producción | tu proveedor cloud |
| `LLM_API_KEY` | acceso al proveedor LLM | OpenAI / Anthropic / etc. |

Más secrets (registry, cloud, etc.) según tus integraciones.

## Environments de GitHub a configurar

En `Settings → Environments`:

- **staging**: sin restricciones, deploy automático en push a `main`.
- **production**: con `required reviewers` activado para forzar aprobación manual antes del deploy.

## Branch protection

En `Settings → Branches → Add rule` para `main`:

- Require pull request reviews before merging (al menos 1)
- Require status checks to pass: `backend`, `frontend`, `e2e`, `sonar`, `docker-build`
- Require branches to be up to date before merging
- Do not allow bypassing the above settings

## Principios

- **Decisiones cerradas, no abiertas**. El agente no elige stack ni arquitectura: las ejecuta.
- **Tests inmutables**. Si un test falla, se arregla el código, nunca el test.
- **Tests LLM siempre con mock**. Llamadas reales solo en suite de evals controlada.
- **Deuda registrada o no existe**. Atajo no documentado = bug futuro.
- **Sin ambigüedad**. Cada UC tiene criterios verificables; cada PR tiene DoD.
- **Seguridad y observabilidad desde día 1**. No son fases finales.
- **Calidad medida, no asumida**. Linters, tests, evals y Sonar bloquean en CI.
- **Costo controlado**. Cada UC con LLM declara su presupuesto de tokens y costo.
# ibm-hackathon-talent-pool
# ibm-hackathon-talent-pool
