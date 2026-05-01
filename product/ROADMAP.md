# ROADMAP.md — fases de desarrollo

> Documento vivo. Se actualiza al cierre de cada fase.
> Última revisión: 2026-05-01

---

## principios de avance

1. **Una fase no empieza hasta que la anterior está cerrada con DoD verificada.**
2. **Cada fase termina con una demo y una entrada en `CHANGELOG.md`.**
3. **No se desarrollan UCs hasta haber completado fase 0 y fase 1.**
4. **Deuda técnica detectada se registra en `TECH_DEBT.md` antes de avanzar.**

---

## fase 0 — fundaciones

**Objetivo**: dejar el repo y la infraestructura listos para que el desarrollo de features sea mecánico y seguro.

**Duración estimada**: 3-5 días

**Entregables backend (Quarkus)**:
- [ ] Repo inicializado con la estructura de carpetas de `ARCHITECTURE.md` §3
  - `src/main/java/com/talentpool/` con subcarpetas: domain, application, infrastructure, api
  - `src/main/resources/` con db/migration, prompts, application.yml
  - `src/test/java/` con estructura paralela
- [ ] `pom.xml` con dependencias Quarkus + LangChain4j en versiones fijadas
  - Quarkus 3.x (última LTS)
  - LangChain4j 0.35.x o superior
  - PostgreSQL driver + Flyway
  - Hibernate ORM con Panache
  - RESTEasy Reactive + Jackson
  - Micrometer + OpenTelemetry
- [ ] Maven wrapper (`mvnw`) versionado en el repo
- [ ] `.editorconfig` y plugin Spotless configurado para Java
  - Google Java Style Guide como base
  - Configuración en `pom.xml` con fase `validate`
- [ ] Checkstyle o equivalente para reglas de estilo
  - Archivo `checkstyle.xml` en raíz
  - Integrado en Maven lifecycle
- [ ] Flyway configurado con migración inicial vacía
  - `V001__initial_schema.sql` con comentario placeholder
  - Configuración en `application.yml` con estrategia clean en dev
- [ ] Configuración base en `application.yml` con perfiles dev/test/prod
  - Datasource con Quarkus Dev Services
  - Logging JSON estructurado (formato ECS)
  - Configuración de CORS para frontend local
  - Placeholder para LangChain4j config
- [ ] Quarkus Dev Services levanta Postgres en local sin configuración manual
  - Incluir pgvector extension habilitada
  - Seed data opcional para desarrollo
- [ ] Logging JSON estructurado configurado
  - Formato: timestamp, level, logger, message, context
  - Configuración de niveles por paquete
- [ ] Endpoints `/q/health/live`, `/q/health/ready`, `/q/metrics` respondiendo
  - Health checks personalizados para BD y LLM provider
- [ ] OpenAPI generándose en `/q/openapi`
  - Anotaciones Swagger en recursos REST
  - Esquemas de request/response documentados
- [ ] Test mínimo `@QuarkusTest` funcionando
  - Test de health endpoint
  - Test de inyección CDI básica
- [ ] Configuración de LangChain4j con un proveedor (Ollama para dev, configurable para staging/prod)
  - Bean CDI `ChatLanguageModel` con @ApplicationScoped
  - Configuración externalizada en application.yml
  - Soporte para múltiples providers (OpenAI, Anthropic, Ollama)
- [ ] Bean CDI de ChatModel inyectable y testeado con MockChatModel
  - Test unitario con respuesta mockeada
  - Validación de timeout y retry

**Entregables frontend (React + TypeScript)**:
- [ ] Proyecto Vite + React + TypeScript
  - Estructura de carpetas: src/{components, pages, services, hooks, types, utils}
  - Configuración de path aliases (@/ para src/)
- [ ] eslint, prettier, tsc configurados con perfil estricto
  - ESLint con reglas React + TypeScript recomendadas
  - Prettier con formato consistente (2 espacios, single quotes)
  - Pre-commit hooks con Husky + lint-staged
- [ ] Cliente HTTP tipado generado desde OpenAPI (`openapi-typescript`)
  - Script npm para regenerar tipos desde backend
  - Axios o Fetch wrapper tipado
- [ ] Página vacía que llama a un endpoint trivial del backend (`/health`)
  - Componente de prueba de conectividad
  - Manejo de errores básico
- [ ] Test mínimo Vitest funcionando
  - Test de componente simple
  - Configuración de coverage
- [ ] Test mínimo Playwright funcionando contra el dev server
  - Test e2e de carga de página principal
  - Configuración de múltiples navegadores

**Entregables infraestructura**:
- [ ] `docker-compose.yml` para entorno local completo
  - postgres:16-alpine con pgvector
  - redis:7-alpine (para caché y rate limiting)
  - ollama/ollama:latest (LLM local para desarrollo)
  - backend en modo dev (hot reload)
  - frontend en modo dev (hot reload)
  - Volúmenes persistentes para BD y modelos
- [ ] `Dockerfile.backend.jvm` funcional
  - Multi-stage build: Maven build + JRE runtime
  - Imagen base: eclipse-temurin:21-jre-alpine
  - Optimización de capas para caché
- [ ] `Dockerfile.frontend` funcional
  - Multi-stage build: npm build + nginx
  - Configuración nginx para SPA routing
- [ ] (Opcional fase 0, obligatorio antes de fase 3) `Dockerfile.backend.native`
  - GraalVM native-image build
  - Configuración de reflection hints
- [ ] Pipeline de CI mínimo verde (lint + tests placeholder + build)
  - GitHub Actions o GitLab CI
  - Jobs: lint-backend, lint-frontend, test-backend, test-frontend, build
  - Caché de dependencias Maven y npm
- [ ] Pipeline de deploy a entorno staging real
  - Opción 1: Fly.io (recomendado para hackathon)
  - Opción 2: Render o Railway
  - Variables de entorno configuradas
  - Deploy automático en merge a main
- [ ] SonarQube / SonarCloud integrado con quality gate en modo suave (warning)
  - Análisis de código en cada PR
  - Métricas: cobertura, duplicación, code smells
  - Quality gate: cobertura > 70%, sin bugs críticos

**Entregables documentación**:
- [ ] Plantillas en `docs/`: ADR, UC, runbook
  - `docs/adr/0000-template.md` (ya existe)
  - `docs/uc/UC-template.md` (ya existe)
  - `docs/runbooks/incident-template.md` (ya existe)
- [ ] `CONTRIBUTING.md`, `CHANGELOG.md`, `TECH_DEBT.md` creados
  - CONTRIBUTING.md con guía de desarrollo, branching strategy, PR template
  - CHANGELOG.md con formato Keep a Changelog
  - TECH_DEBT.md con template de registro
- [ ] ADR-0001 (stack base) cerrado
  - Justificación de Quarkus + LangChain4j + React
  - Alternativas consideradas
  - Consecuencias y trade-offs
- [ ] ADR-0002 (estrategia RAG y vector store) cerrado
  - Decisión de usar pgvector vs alternativas
  - Estrategia de embeddings y chunking
  - Plan de implementación en Fase 2
- [ ] ADR-0003 (estrategia de evaluación de LLMs) cerrado
  - Framework de evals (LangChain4j evals o custom)
  - Métricas: precisión, consistencia, latencia, costo
  - Golden dataset inicial (30 casos)

**Definición de hecho**:
- ✅ Cualquier desarrollador puede levantar el proyecto local con un comando (`./mvnw quarkus:dev` y `pnpm dev`)
- ✅ CI pasa en verde con todos los checks
- ✅ Deploy a staging exitoso de un "hello world" que responde por API y se renderiza en el frontend
- ✅ Documentación de setup en README.md actualizada y validada
- ✅ Todos los ADRs de fase 0 cerrados y revisados

---

## fase 1 — walking skeleton

**Objetivo**: validar la arquitectura completa de punta a punta con la feature más fina posible, incluyendo una primera capacidad LLM trivial.

**Duración estimada**: 5-7 días

**Alcance**:
- Un usuario puede registrarse, hacer login, y ver una pantalla autenticada con un input que envía un mensaje a un LLM y muestra la respuesta.
- Todo el flujo pasa por: frontend → API → BD → LangChain4j → proveedor LLM → respuesta → render.
- Deployado a staging, observable, con tests, con guardrails básicos, con costo monitoreado.

**Entregables backend**:
- [ ] Migración Flyway con tabla `users`
  - Campos: id, email, password_hash, role (ENUM: RECLUTADOR, CANDIDATO), created_at, updated_at
  - Índices: unique en email, index en role
  - Constraints: email format validation
- [ ] Endpoints `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/users/me`
  - POST /auth/register: crea usuario, retorna token JWT
  - POST /auth/login: valida credenciales, retorna token JWT
  - GET /users/me: retorna perfil del usuario autenticado
  - Validación de input con Bean Validation
- [ ] Endpoint `/api/v1/chat` con un AiService trivial
  - POST /chat: recibe mensaje, retorna respuesta del LLM
  - Prompt simple: "Eres un asistente técnico. Responde de forma concisa."
  - Streaming opcional (SSE) para mejor UX
- [ ] Auth implementada según `ARCHITECTURE.md` §7
  - JWT con SmallRye JWT
  - Roles: RECLUTADOR, CANDIDATO
  - Interceptor para validación de roles en endpoints
  - Refresh token strategy (opcional en fase 1)
- [ ] Guardrails de input mínimos
  - Longitud máxima de mensaje: 2000 caracteres
  - Detección básica de inyección de prompts
  - Sanitización de HTML/scripts
- [ ] Rate limit por usuario en `/api/v1/chat`
  - Redis-based rate limiter
  - Límite: 10 requests/minuto por usuario
  - Respuesta 429 con Retry-After header
- [ ] Tests: unitarios de dominio, integración `@QuarkusTest`, e2e
  - Unitarios: lógica de negocio, validaciones
  - Integración: endpoints con BD en memoria (H2 o Testcontainers)
  - E2E: flujo completo registro → login → chat
- [ ] Test de unidad del AiService usando `MockChatModel`
  - Mock de respuestas del LLM
  - Validación de prompts enviados
  - Test de timeout y retry
- [ ] Suite de evals mínima (3-5 prompts) corriendo en CI
  - Eval 1: Respuesta coherente a pregunta técnica simple
  - Eval 2: Rechazo de pregunta fuera de dominio
  - Eval 3: Formato de respuesta estructurado
  - Eval 4: Consistencia en respuestas similares
  - Eval 5: Latencia < 5s
- [ ] Logs, métricas (incluyendo tokens y costo), trazas visibles
  - Logs: JSON estructurado con correlation ID
  - Métricas: Micrometer con contadores de requests, latencia, tokens
  - Trazas: OpenTelemetry con spans para LLM calls
  - Dashboard básico en Grafana o similar
- [ ] Deploy a staging
  - Variables de entorno configuradas (LLM API key, JWT secret)
  - Health checks configurados en load balancer
  - Logs centralizados (Loki, CloudWatch, etc.)

**Entregables frontend**:
- [ ] Páginas: registro, login, home autenticada con chat simple
  - /register: formulario con email, password, confirmación
  - /login: formulario con email, password
  - /home: dashboard con chat interface
  - Navegación con React Router
- [ ] Componentes reutilizables
  - Input con validación
  - Button con estados (loading, disabled)
  - ChatMessage component
  - Layout con header y sidebar
- [ ] Manejo de estado con Context API o Zustand
  - AuthContext: usuario, token, login, logout
  - ChatContext: mensajes, enviar mensaje
- [ ] Integración con API backend
  - Axios instance con interceptors
  - Manejo de tokens en headers
  - Refresh token automático
- [ ] Manejo de errores y loading states
  - Error boundaries
  - Toasts para notificaciones
  - Skeletons para loading

**Entregables observabilidad**:
- [ ] Métricas de negocio
  - Contador de registros exitosos
  - Contador de logins exitosos
  - Contador de mensajes de chat
  - Distribución de latencia de LLM
- [ ] Métricas de costo LLM
  - Tokens de entrada por request
  - Tokens de salida por request
  - Costo estimado por request (según pricing del provider)
  - Costo acumulado diario
- [ ] Alertas básicas
  - Latencia p95 > 10s
  - Error rate > 5%
  - Costo diario > umbral definido
  - Health check fallando

**Definición de hecho**:
- ✅ Un humano puede registrarse en staging, loguearse, mandar un mensaje al LLM y ver la respuesta
- ✅ Las métricas muestran latencia, tokens consumidos y costo estimado del chat
- ✅ Test e2e en CI verde de forma estable (sin flakiness)
- ✅ Suite de evals corriendo y registrando resultados (todos pasando)
- ✅ Logs estructurados visibles en herramienta de observabilidad
- ✅ Documentación de API actualizada en OpenAPI
- ✅ Demo grabada del flujo completo

---

## fase 2 — MVP funcional (Hackathon)

**Objetivo**: implementar los UCs marcados como críticos en `PRODUCT.md` para tener un MVP demostrable en hackathon.

**Duración estimada**: 48-72 horas

**Prioridad**: CRÍTICA - Bloqueante para demo de hackathon

### UC-001: Generar desafío técnico automatizado
**Duración**: 12-16 horas | **RF**: RF-001 a RF-009 | **RNF**: RNF-001

**Entregables**:
- [ ] Migración Flyway: tabla `PUESTO` (id, titulo, tecnologia_principal, seniority, descripcion, created_by, created_at)
- [ ] Migración Flyway: tabla `DESAFIO` (id, puesto_id, enunciado, contexto, rubrica_oculta JSONB, dificultad, created_at)
- [ ] POST `/api/v1/puestos` - Crear puesto con validaciones
- [ ] POST `/api/v1/puestos/{id}/desafios/generar` - Generar desafío con LLM
- [ ] AiService con prompt template `prompts/generar-desafio.txt`
- [ ] Guardrails: validación JSON, longitud, estructura de rúbrica
- [ ] Tests: unitarios, integración, evals (n=10 desafíos)
- [ ] Frontend: formulario creación puesto + botón generar desafío

**Criterios de aceptación**:
- ✅ Generación en < 30s (RNF-001)
- ✅ Rúbrica JSONB válida y estructurada
- ✅ Relevancia ≥ 85% según evals
- ✅ Desafío personalizado por tecnología y seniority

### UC-002: Resolver desafío y evaluar mediante análisis estático
**Duración**: 16-20 horas | **RF**: RF-010 a RF-015, RF-034 | **RNF**: RNF-001

**Entregables**:
- [ ] Migración Flyway: tabla `EVALUACION` (id, desafio_id, candidato_id, codigo_entregado, puntaje, feedback JSONB, estado, submitted_at, evaluated_at)
- [ ] GET `/api/v1/desafios/{id}` - Ver desafío (sin rúbrica)
- [ ] POST `/api/v1/desafios/{id}/evaluaciones` - Enviar solución
- [ ] GET `/api/v1/evaluaciones/{id}` - Obtener resultado
- [ ] AiService con prompt template `prompts/evaluar-codigo.txt`
- [ ] Análisis estático: lógica, eficiencia, buenas prácticas (RF-015)
- [ ] Feedback estructurado JSONB: puntaje, puntos_fuertes, areas_mejora, sugerencias
- [ ] Tests: unitarios, integración, evals (precisión ≥ 80%, consistencia ≥ 90%)
- [ ] Frontend: editor de código (Monaco/CodeMirror) + vista de resultados

**Criterios de aceptación**:
- ✅ Evaluación en < 10s
- ✅ Puntaje 0-100 con feedback detallado
- ✅ Precisión ≥ 80% vs golden set
- ✅ Consistencia ≥ 90% en evaluaciones repetidas
- ✅ Retroalimentación constructiva (RF-034)

### UC-003: Visualizar ranking de candidatos y reportes
**Duración**: 8-12 horas | **RF**: RF-027, RF-029 | **RNF**: RNF-008

**Entregables**:
- [ ] GET `/api/v1/desafios/{id}/ranking` - Ranking paginado
- [ ] GET `/api/v1/evaluaciones/{id}/detalle` - Detalle completo (solo reclutador)
- [ ] GET `/api/v1/puestos/{id}/estadisticas` - Métricas agregadas
- [ ] Tests: integración, e2e
- [ ] Frontend: dashboard reclutador con tabla ranking + gráficos
- [ ] Frontend: vista detalle evaluación con código y feedback

**Criterios de aceptación**:
- ✅ Ranking ordenado por puntaje DESC
- ✅ Filtros: puntaje mínimo, fecha
- ✅ Estadísticas: total evaluaciones, promedio, distribución
- ✅ Interfaz intuitiva (RNF-008)

### UC-004: Acceder y seleccionar desafíos (candidato)
**Duración**: 6-8 horas | **RF**: RF-010, RF-011

**Entregables**:
- [ ] GET `/api/v1/desafios` - Catálogo con filtros (tecnologia, seniority, dificultad)
- [ ] GET `/api/v1/desafios/{id}/mis-evaluaciones` - Historial del candidato
- [ ] Tests: integración, e2e
- [ ] Frontend: catálogo con cards + filtros
- [ ] Frontend: historial de evaluaciones propias

**Criterios de aceptación**:
- ✅ Catálogo filtrable y paginado
- ✅ Historial acumulado de puntuación (RF-011)
- ✅ Múltiples intentos permitidos (RF-010)

**Definición de hecho de fase 2**:
- ✅ UC-001 a UC-004 completados con criterios de aceptación
- ✅ Cobertura: backend ≥ 75%, frontend ≥ 60%
- ✅ Suite de evals: calidad ≥ 85%, precisión ≥ 80%, consistencia ≥ 90%
- ✅ Métricas de producto: ≥ 50 desafíos, ≥ 100 evaluaciones, completitud ≥ 60%
- ✅ Deploy a staging estable
- ✅ Video demo 5 minutos para hackathon

---

## fase 3 — hardening (Post-Hackathon)

**Objetivo**: preparar el sistema para usuarios reales.

**Duración estimada**: 2-3 semanas

**Entregables seguridad**:
- [ ] Auditoría OWASP Top 10
- [ ] Encriptación: passwords (bcrypt), datos sensibles (RNF-004)
- [ ] MFA para reclutadores (RNF-005)
- [ ] Cumplimiento GDPR/LGPD (RNF-007)
- [ ] Política de privacidad y términos de uso

**Entregables calidad**:
- [ ] SonarQube quality gate bloqueante (cobertura ≥ 80%)
- [ ] Pruebas de carga: 100 usuarios concurrentes (RNF-003)
- [ ] Pruebas de costo LLM: proyección mensual < USD 500
- [ ] Pruebas de caos: caída BD, caída LLM, latencia alta

**Entregables operación**:
- [ ] Backups automáticos diarios con restore probado
- [ ] Alertas para todos los SLOs
- [ ] Runbooks: BD caída, LLM caído, latencia alta, costo disparado
- [ ] Build nativo GraalVM (startup < 100ms, memoria < 256MB)
- [ ] Plan de rollback probado (< 5 min)

**Definición de hecho**:
- ✅ Carga: latencia p95 < 400ms con 300 usuarios
- ✅ Restore desde backup exitoso (< 1h)
- ✅ Cero hallazgos críticos de seguridad
- ✅ Disponibilidad ≥ 99.5% durante 1 semana en staging

---

## fase 4 — lanzamiento controlado

**Objetivo**: validar con usuarios reales.

**Duración estimada**: 3-4 semanas

**Estrategia**:
- [ ] Beta cerrada: 30 usuarios (10 reclutadores, 20 candidatos)
- [ ] Onboarding guiado + soporte
- [ ] Feedback loop: encuestas NPS, bug reports, feature requests
- [ ] Telemetría: Mixpanel/Amplitude (eventos, funnels, retención)
- [ ] Monitoreo de costos LLM en tiempo real

**Métricas de éxito**:
- [ ] Desafíos generados: ≥ 50
- [ ] Evaluaciones completadas: ≥ 100
- [ ] NPS: ≥ 7/10 (reclutadores y candidatos)
- [ ] Disponibilidad: ≥ 99%
- [ ] Costo por 100 evaluaciones: < USD 5

**Apertura gradual**:
- Semana 1-2: 30 usuarios
- Semana 3: 100 usuarios
- Semana 4: 500 usuarios
- Post-semana 4: Apertura general

**Definición de hecho**:
- ✅ Métricas de producto cumplidas con datos reales
- ✅ SLOs cumplidos durante 4 semanas
- ✅ NPS ≥ 7/10
- ✅ Cero incidentes críticos

---

## fase 5 — módulo académico y colaboración

**Objetivo**: expansión para instituciones educativas.

**Duración estimada**: 4-6 semanas

**Casos de uso**:
- [ ] UC-005: Registro con roles DOCENTE/ESTUDIANTE
- [ ] UC-006: OAuth (Google, GitHub, LinkedIn) + gestión de perfil
- [ ] UC-007: Repositorio colectivo de consultas IA (RF-028)
- [ ] UC-008: Guías de estudio personalizadas (RF-019 a RF-025)

**Entregables técnicos**:
- [ ] RAG con pgvector: embeddings, chunking, retrieval
- [ ] Roles granulares: DOCENTE, ESTUDIANTE, RECLUTADOR
- [ ] Panel de administración para docentes
- [ ] Compartición de resoluciones

**Definición de hecho**:
- ✅ UC-005 a UC-008 implementados
- ✅ RAG con latencia < 2s
- ✅ Reducción de costos LLM en 30%

---

## fase 6 — expansión corporativa

**Objetivo**: funcionalidades enterprise.

**Duración estimada**: 8-12 semanas

**Casos de uso**:
- [ ] UC-009: Filtrar base de talento (RF-026, RF-027)
- [ ] UC-010: Simuladores de flujos empresariales (RF-017, RF-018)

**Entregables técnicos**:
- [ ] Base de datos de talento filtrable
- [ ] Analytics avanzados + reportes
- [ ] API pública v1 con documentación
- [ ] Integración con ATS

**Definición de hecho**:
- ✅ UC-009 y UC-010 implementados
- ✅ API pública estable
- ✅ ≥ 3 integraciones ATS funcionando

---

## fase 7 — monetización y certificación

**Objetivo**: modelo de negocio sostenible.

**Duración estimada**: 12-16 semanas

**Casos de uso**:
- [ ] UC-011: Certificados digitales (RF-031)
- [ ] UC-012: Suscripciones y pagos (RF-032)

**Entregables técnicos**:
- [ ] Sistema de suscripciones (Free, Pro, Enterprise)
- [ ] Procesamiento de pagos con Stripe
- [ ] Marketplace de desafíos premium

**Definición de hecho**:
- ✅ Pagos funcionando en producción
- ✅ ≥ 10 clientes pagos
- ✅ Certificados verificables

---

## fase 8 — iteración continua

**Objetivo**: mejora continua basada en datos.

**Mecánica**:
- Sprints de 2 semanas
- Backlog priorizado por impacto
- Revisión de deuda técnica mensual
- Optimización de prompts mensual
- Auditoría de seguridad trimestral

**Actividades recurrentes**:
- [ ] Métricas de producto (semanal)
- [ ] Costos LLM (semanal)
- [ ] Deuda técnica (mensual)
- [ ] Suite de evals (mensual)
- [ ] Auditoría de seguridad (trimestral)

---

## tablero de estado

| fase | estado | inicio | fin | notas |
|------|--------|--------|-----|-------|
| 0 — fundaciones | pendiente | — | — | Prerequisito |
| 1 — walking skeleton | pendiente | — | — | Validación arquitectura |
| 2 — MVP funcional | pendiente | — | — | **HACKATHON 48-72h** |
| 3 — hardening | pendiente | — | — | Post-hackathon |
| 4 — lanzamiento | pendiente | — | — | Beta cerrada |
| 5 — módulo académico | planificado | — | — | Fase 2 producto |
| 6 — expansión corporativa | planificado | — | — | Fase 3 producto |
| 7 — monetización | planificado | — | — | Fase 4 producto |
| 8 — iteración | continua | — | — | Mejora continua |

---

## dependencias críticas

**Fase 0 → Fase 1**: Infraestructura completa + LangChain4j configurado + CI/CD operativo

**Fase 1 → Fase 2**: Walking skeleton validado + suite de evals + observabilidad básica

**Fase 2 → Fase 3**: MVP funcional demostrado + métricas de hackathon cumplidas

**Fase 3 → Fase 4**: Sistema hardened + auditoría de seguridad aprobada + SLOs validados

**Fase 4 → Fase 5**: Lanzamiento exitoso + feedback de usuarios + métricas de producto estables

---

## mapeo de requerimientos a fases

**MVP (Fase 2)**:
- RF: 001-015, 034
- RNF: 001, 008, 009

**Post-MVP (Fases 3-4)**:
- RF: 026, 027, 029
- RNF: 002-007, 010-013, 015

**Expansión (Fases 5-7)**:
- RF: 016-025, 028, 030-033, 035
- RNF: 014

---

**Fin del documento ROADMAP.md**
