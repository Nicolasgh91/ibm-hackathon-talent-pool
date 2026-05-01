# ROADMAP.md — fases de desarrollo

> Documento vivo. Se actualiza al cierre de cada fase.
> Última revisión: YYYY-MM-DD

---

## principios de avance

1. **Una fase no empieza hasta que la anterior está cerrada con DoD verificada.**
2. **Cada fase termina con una demo y una entrada en `CHANGELOG.md`.**
3. **No se desarrollan UCs hasta haber completado fase 0 y fase 1.**
4. **Deuda técnica detectada se registra en `TECH_DEBT.md` antes de avanzar.**

---

## fase 0 — fundaciones

**Objetivo**: dejar el repo y la infraestructura listos para que el desarrollo de features sea mecánico y seguro.

**Entregables backend (Quarkus)**:
- [ ] Repo inicializado con la estructura de carpetas de `ARCHITECTURE.md` §3
- [ ] `pom.xml` con dependencias Quarkus + LangChain4j en versiones fijadas
- [ ] Maven wrapper (`mvnw`) versionado en el repo
- [ ] `.editorconfig` y plugin Spotless configurado para Java
- [ ] Checkstyle o equivalente para reglas de estilo
- [ ] Flyway configurado con migración inicial vacía
- [ ] Configuración base en `application.yml` con perfiles dev/test/prod
- [ ] Quarkus Dev Services levanta Postgres en local sin configuración manual
- [ ] Logging JSON estructurado configurado
- [ ] Endpoints `/q/health/live`, `/q/health/ready`, `/q/metrics` respondiendo
- [ ] OpenAPI generándose en `/q/openapi`
- [ ] Test mínimo `@QuarkusTest` funcionando
- [ ] Configuración de LangChain4j con un proveedor (Ollama para dev, configurable para staging/prod)
- [ ] Bean CDI de ChatModel inyectable y testeado con MockChatModel

**Entregables frontend**:
- [ ] Proyecto Vite + React + TypeScript
- [ ] eslint, prettier, tsc configurados con perfil estricto
- [ ] Cliente HTTP tipado generado desde OpenAPI (`openapi-typescript`)
- [ ] Página vacía que llama a un endpoint trivial del backend (`/health`)
- [ ] Test mínimo Vitest funcionando
- [ ] Test mínimo Playwright funcionando contra el dev server

**Entregables infraestructura**:
- [ ] `docker-compose.yml` para entorno local (postgres con pgvector, redis, ollama, backend dev mode, frontend dev mode)
- [ ] `Dockerfile.backend.jvm` funcional
- [ ] `Dockerfile.frontend` funcional
- [ ] (Opcional fase 0, obligatorio antes de fase 3) `Dockerfile.backend.native`
- [ ] Pipeline de CI mínimo verde (lint + tests placeholder + build)
- [ ] Pipeline de deploy a entorno staging real (puede ser un PaaS simple al inicio: Fly.io, Render, Railway, etc.)
- [ ] SonarQube / SonarCloud integrado con quality gate en modo suave (warning)

**Entregables documentación**:
- [ ] Plantillas en `docs/`: ADR, UC, runbook
- [ ] `CONTRIBUTING.md`, `CHANGELOG.md`, `TECH_DEBT.md` creados
- [ ] ADR-0001 (stack base) cerrado
- [ ] ADR-0002 (estrategia RAG y vector store) cerrado si la app usa RAG
- [ ] ADR-0003 (estrategia de evaluación de LLMs) cerrado

**Definición de hecho**:
- Cualquier desarrollador (humano o agente) puede levantar el proyecto local con un comando (`./mvnw quarkus:dev` y `pnpm dev`)
- CI pasa en verde
- Deploy a staging exitoso de un "hello world" que responde por API y se renderiza en el frontend

---

## fase 1 — walking skeleton

**Objetivo**: validar la arquitectura completa de punta a punta con la feature más fina posible, incluyendo una primera capacidad LLM trivial.

**Alcance**:
- Un usuario puede registrarse, hacer login, y ver una pantalla autenticada con un input que envía un mensaje a un LLM y muestra la respuesta.
- Todo el flujo pasa por: frontend → API → BD → LangChain4j → proveedor LLM → respuesta → render.
- Deployado a staging, observable, con tests, con guardrails básicos, con costo monitoreado.

**Entregables**:
- [ ] Migración Flyway con tabla `users`
- [ ] Endpoints `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/users/me`
- [ ] Endpoint `/api/v1/chat` con un AiService trivial (ej: respondedor general con prompt fijo)
- [ ] Frontend con páginas: registro, login, home autenticada con chat simple
- [ ] Auth implementada según `ARCHITECTURE.md` §7
- [ ] Guardrails de input mínimos (longitud máxima, detección básica de inyección)
- [ ] Rate limit por usuario en `/api/v1/chat`
- [ ] Tests: unitarios de dominio, integración `@QuarkusTest`, e2e que cubre el flujo completo
- [ ] Test de unidad del AiService usando `MockChatModel`
- [ ] Suite de evals mínima (3-5 prompts) corriendo en CI
- [ ] Logs, métricas (incluyendo tokens y costo), trazas visibles para este flujo
- [ ] Deploy a staging
- [ ] Documentación: este flujo en OpenAPI, capturas en docs

**Definición de hecho**:
- Un humano puede registrarse en staging, loguearse, mandar un mensaje al LLM y ver la respuesta
- Las métricas muestran latencia, tokens consumidos y costo estimado del chat
- Test e2e en CI verde de forma estable (sin flakiness)
- Suite de evals corriendo y registrando resultados

---

## fase 2 — MVP funcional

**Objetivo**: implementar los UCs marcados como críticos en `PRODUCT.md`.

**Plan**:
- [ ] UC-001: ...
- [ ] UC-002: ...
- [ ] UC-003: ...
- [ ] (uno por uno, en el orden definido)

**Por cada UC**:
1. Leer `docs/uc/UC-NNN-*.md` completo
2. Crear branch `feat/uc-NNN-slug`
3. Implementar siguiendo el flujo y los criterios de aceptación
4. Tests cumpliendo cobertura mínima
5. Si toca prompts o capacidad LLM nueva: agregar entradas a la suite de evals
6. Actualizar OpenAPI si cambió
7. PR con plantilla completa
8. Merge solo con CI verde y revisión humana

**Definición de hecho de la fase**:
- Todos los UCs críticos pasan sus criterios de aceptación
- Cobertura de tests dentro de los umbrales
- Sin tickets críticos abiertos
- Demo end-to-end del flujo completo
- Suite de evals con resultado superior al umbral definido en ADR-0003

---

## fase 3 — hardening

**Objetivo**: dejar el sistema listo para usuarios reales.

**Entregables**:
- [ ] Auditoría de seguridad (ver checklist en `ARCHITECTURE.md` §8)
- [ ] Quality gate de SonarQube endurecido a bloqueante
- [ ] Pruebas de carga: validar SLOs de `PRODUCT.md` §6.2 con tráfico esperado x3
- [ ] Pruebas de costo: simular carga típica y validar costo de LLM mensual proyectado
- [ ] Pruebas de caos básicas: caída de BD, caída del proveedor LLM, latencia alta
- [ ] Backups configurados y restauración probada
- [ ] Alertas configuradas para todos los SLOs (incluyendo costo LLM diario)
- [ ] Runbooks para los incidentes más probables
- [ ] Build nativo (GraalVM) funcionando y desplegado en staging si se decide usarlo en prod
- [ ] Política de retención de datos y logs documentada
- [ ] Términos y condiciones, política de privacidad publicados
- [ ] Cumplimiento regulatorio aplicable verificado (incluyendo manejo de prompts con datos personales)
- [ ] Plan de rollback probado en staging
- [ ] Estrategia de fallback si el proveedor LLM principal falla (proveedor secundario o degradación elegante)

**Definición de hecho**:
- Pruebas de carga pasan con margen
- Restore desde backup probado y exitoso
- Cero hallazgos críticos en auditoría de seguridad
- Costo proyectado mensual dentro del presupuesto

---

## fase 4 — lanzamiento controlado

**Objetivo**: poner el producto en manos de usuarios reales con riesgo acotado.

**Estrategia**:
- [ ] Soft launch con grupo cerrado (beta cerrada)
- [ ] Feedback loop: bug reports, telemetría, encuestas
- [ ] Iteración rápida sobre bloqueantes
- [ ] Apertura gradual: % de tráfico creciente o lista de espera
- [ ] Monitoreo constante de costos LLM con alertas tempranas

**Definición de hecho**:
- Métricas de producto de `PRODUCT.md` §6.1 medidas con datos reales
- SLOs cumplidos durante el período de beta
- Plan de apertura general aprobado

---

## fase 5 — iteración

**Objetivo**: mejorar con datos reales, no con suposiciones.

**Mecánica**:
- Ciclos de 2 semanas
- Cada ciclo: 1 hipótesis, 1 cambio, 1 medición
- Backlog priorizado por impacto en métricas de producto
- Revisión de deuda técnica al menos una vez por trimestre
- Iteración sobre prompts y suite de evals: cada cambio de prompt pasa por evals antes de prod

**No hay DoD final**: esta fase es continua.

---

## tablero de estado

| fase | estado | inicio | fin | notas |
|------|--------|--------|-----|-------|
| 0 — fundaciones | pendiente | — | — | |
| 1 — walking skeleton | pendiente | — | — | |
| 2 — MVP funcional | pendiente | — | — | |
| 3 — hardening | pendiente | — | — | |
| 4 — lanzamiento | pendiente | — | — | |
| 5 — iteración | pendiente | — | — | |
