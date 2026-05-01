# ARCHITECTURE.md — arquitectura del sistema

> Decisiones cerradas. El agente NO debe re-decidir lo que está acá.
> Cada cambio requiere un ADR nuevo en `docs/adr/`.
> Última revisión: YYYY-MM-DD

---

## 1. visión general

### 1.1 estilo arquitectónico
**Decisión**: monolito modular en backend + SPA desacoplada en frontend.
**Justificación**: simplicidad operativa, despliegue independiente de UI y API, evolución a microservicios solo si la escala lo exige (ver ADR-0002).

### 1.2 diagrama C4 — nivel 1 (contexto)
```
[ usuario final ]
       ↓ HTTPS
[ aplicación: SPA + API Quarkus ]
       ↓
[ proveedores LLM ]   [ vector store ]   [ servicios externos: email, pagos ]
```

### 1.3 diagrama C4 — nivel 2 (contenedores)
```
[ navegador ]
     ↓ HTTPS
[ frontend SPA (React + Vite, servido por nginx o CDN) ]
     ↓ HTTPS / JSON
[ API Quarkus (JAX-RS / RESTEasy Reactive) ]
     ↓                ↓                  ↓
[ PostgreSQL ]   [ pgvector ]   [ proveedores LLM (OpenAI / Anthropic / Ollama) ]
     ↓
[ object storage ]   [ Redis caché ]
```

Reemplazar con un diagrama real (Mermaid, draw.io, excalidraw exportado) en este archivo o en `docs/diagrams/`.

---

## 2. stack tecnológico (cerrado)

> Una sola opción por capa. Versión fija. Cambios → ADR.

### 2.1 backend (Quarkus + LangChain4j)

| capa | tecnología | versión | ADR |
|------|------------|---------|-----|
| JDK | Eclipse Temurin | 21 LTS | ADR-0001 |
| GraalVM (build nativo) | GraalVM CE for JDK 21 | última estable | ADR-0001 |
| framework | Quarkus | 3.17.x (LTS más reciente) | ADR-0001 |
| build | Maven | 3.9.x | ADR-0001 |
| LLM toolkit | LangChain4j (extensión Quarkus) | 1.x estable | ADR-0001 |
| API REST | RESTEasy Reactive (JAX-RS) | incluida en Quarkus | ADR-0001 |
| ORM | Hibernate ORM with Panache | incluida en Quarkus | ADR-0001 |
| validación | Hibernate Validator (Bean Validation) | incluida | ADR-0001 |
| migraciones | Flyway | incluida (extensión Quarkus) | ADR-0001 |
| auth | Quarkus OIDC + SmallRye JWT | incluidas | ADR-0001 |
| BD relacional | PostgreSQL | 16 | ADR-0001 |
| vector store | pgvector (extensión de PostgreSQL) | 0.7.x+ | ADR-0002 |
| caché | Redis | 7.x | ADR-0001 |
| testing | JUnit 5 + AssertJ + Mockito | últimas | ADR-0001 |
| testing HTTP | REST Assured | última | ADR-0001 |
| testing infra | Testcontainers + Quarkus Dev Services | últimas | ADR-0001 |
| testing LLM | WireMock + LangChain4j MockChatModel | últimas | ADR-0001 |
| evals LLM | suite propia + framework definido en | ADR-0003 |
| observabilidad | Micrometer + OpenTelemetry (extensiones Quarkus) | incluidas | ADR-0001 |

### 2.2 frontend

| capa | tecnología | versión | ADR |
|------|------------|---------|-----|
| lenguaje | TypeScript | 5.x | ADR-0001 |
| framework UI | React | 18.x | ADR-0001 |
| build | Vite | 5.x | ADR-0001 |
| gestor de paquetes | pnpm | 9.x | ADR-0001 |
| router | React Router | 6.x | ADR-0001 |
| state server | TanStack Query | 5.x | ADR-0001 |
| state cliente | Zustand o Context API | última | ADR-0001 |
| cliente HTTP | fetch nativo o openapi-fetch (tipado desde OpenAPI) | última | ADR-0001 |
| testing unitario | Vitest + Testing Library | últimas | ADR-0001 |
| testing e2e | Playwright | última | ADR-0001 |
| servidor estático | nginx (o CDN en producción) | última estable | ADR-0001 |

### 2.3 infraestructura y operación

| capa | tecnología | versión | ADR |
|------|------------|---------|-----|
| contenedores | Docker + docker compose | última estable | ADR-0001 |
| imagen runtime backend | JVM o nativa (distroless) | — | ADR-0001 |
| CI/CD | GitHub Actions | — | ADR-0001 |
| análisis estático | SonarQube / SonarCloud | — | ADR-0001 |
| SAST adicional | GitHub CodeQL | — | ADR-0001 |
| cloud | (definir en ADR-00NN) | — | — |

---

## 3. estructura de carpetas (obligatoria)

```
/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/<org>/<app>/
│   │   │   │   ├── api/              # recursos JAX-RS (endpoints)
│   │   │   │   │   ├── dto/          # records de request/response
│   │   │   │   │   └── exception/    # mappers de excepciones
│   │   │   │   ├── domain/           # entidades de negocio, value objects, lógica pura
│   │   │   │   ├── service/          # casos de uso (uno por UC, orquestación)
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/  # repositorios Panache, mapeos JPA
│   │   │   │   │   ├── ai/           # AiServices de LangChain4j, prompts, retrievers
│   │   │   │   │   ├── llm/          # configuración de modelos, guardrails
│   │   │   │   │   └── client/       # clientes REST/MicroProfile a APIs externas
│   │   │   │   ├── config/           # ConfigProperties, beans CDI, producers
│   │   │   │   └── security/         # autorización, filtros, identity providers
│   │   │   └── resources/
│   │   │       ├── application.yml   # configuración Quarkus
│   │   │       ├── application-dev.yml
│   │   │       ├── application-test.yml
│   │   │       ├── db/migration/     # scripts Flyway: V1__init.sql, V2__...
│   │   │       └── prompts/          # plantillas de prompt (.txt o .ftl)
│   │   └── test/
│   │       ├── java/com/<org>/<app>/
│   │       │   ├── unit/
│   │       │   ├── integration/      # @QuarkusTest con Testcontainers
│   │       │   ├── e2e/              # tests REST end-to-end del backend
│   │       │   └── evals/            # evaluaciones de LLM (ver ADR-0003)
│   │       └── resources/
│   │           ├── application-test.yml
│   │           └── fixtures/
│   ├── pom.xml
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/                 # clientes de API generados desde OpenAPI
│   │   ├── store/
│   │   └── main.tsx
│   ├── tests/
│   ├── package.json
│   └── README.md
├── infra/
│   ├── docker/
│   │   ├── Dockerfile.backend.jvm
│   │   ├── Dockerfile.backend.native
│   │   └── Dockerfile.frontend
│   ├── compose/                      # docker-compose para entornos
│   └── terraform/                    # si aplica
├── docs/
│   ├── adr/
│   ├── uc/
│   ├── runbooks/
│   └── diagrams/
├── PRODUCT.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── TECH_DEBT.md
```

**Regla**: el agente no crea carpetas raíz nuevas sin ADR.

---

## 4. modelo de datos

### 4.1 entidades canónicas
Diagrama ER + tabla con:
- nombre
- atributos (con tipo)
- invariantes (qué siempre se cumple)
- estados posibles y transiciones permitidas

### 4.2 reglas de integridad
- Claves foráneas siempre con `ON DELETE` explícito
- Timestamps `created_at` y `updated_at` en toda tabla, manejados por Hibernate (`@CreationTimestamp`, `@UpdateTimestamp`)
- Soft delete sólo si está justificado por UC (`deleted_at` nullable)
- IDs: UUID v7 generado por aplicación o `gen_random_uuid()` desde Postgres
- Snake_case en tablas y columnas
- Tablas en plural

### 4.3 migraciones (Flyway)
- Toda alteración de esquema pasa por scripts Flyway en `db/migration/`
- Nomenclatura: `V<n>__<descripcion_snake_case>.sql` (ej: `V12__add_index_on_users_email.sql`)
- Nunca editar una migración mergeada; crear una nueva
- Migraciones idempotentes y reversibles cuando sea posible
- Migraciones grandes (backfills) en lotes y separadas de cambios de esquema

---

## 5. API

### 5.1 estilo
REST + JSON. Versionado por path: `/api/v1/...`.

### 5.2 contrato
- OpenAPI 3.1 generado automáticamente por SmallRye OpenAPI (extensión Quarkus)
- Spec versionada en el repo: `backend/src/main/resources/META-INF/openapi.yaml` o exportada a `docs/api/openapi.yaml` por CI
- Cualquier cambio que rompa compatibilidad → nueva versión de path
- El frontend consume la spec con `openapi-typescript` o `openapi-fetch` para generar clientes tipados

### 5.3 convenciones
- Recursos en plural: `/users`, `/conversations`
- Códigos HTTP semánticos (200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500)
- Errores con formato uniforme (`ExceptionMapper` global):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "human readable",
    "details": [...]
  },
  "request_id": "uuid"
}
```
- Paginación: cursor-based por defecto; offset solo para casos justificados
- Idempotencia: header `Idempotency-Key` obligatorio en POST que crean recursos cobrables, externos o que disparan llamadas LLM costosas

### 5.4 endpoints LLM (streaming)
- Usar `Multi<String>` (Mutiny) o SSE (`@RestStreamElementType(MediaType.SERVER_SENT_EVENTS)`) para respuestas streaming
- Cancelación del lado servidor cuando el cliente cierra la conexión (importante: corta el costo del token)

---

## 6. capa LLM (LangChain4j)

### 6.1 organización
- **AiServices** (interfaces anotadas) en `infrastructure/ai/services/`. Una interface por capacidad LLM (ej: `DocumentSummarizer`, `ConversationalAgent`)
- **Prompts** versionados en `resources/prompts/` o como constantes. Nunca prompts hardcodeados dispersos por el código.
- **Retrievers RAG** en `infrastructure/ai/retrieval/`. Cada uno expone una interfaz Java tipada.
- **Tools** en `infrastructure/ai/tools/`. Cada tool es un método anotado con `@Tool` con descripción clara y parámetros tipados.
- **Modelos** configurados como CDI beans en `config/`, parametrizados por `application.yml`.

### 6.2 reglas
- Ningún string de prompt vive en producción sin haber pasado por la suite de evals (ver ADR-0003).
- Cambios en prompts requieren entrada en `CHANGELOG.md` y bump de versión menor.
- Toda llamada a LLM tiene timeout explícito y reintentos con backoff exponencial (`@Retry` de SmallRye Fault Tolerance).
- Toda llamada a LLM tiene límite de tokens de entrada y salida configurado.
- El proveedor LLM se configura por entorno: dev puede usar Ollama local; prod usa el proveedor cloud elegido.

### 6.3 guardrails
- **InputGuardrail**: detección de inyección de prompts, longitud máxima, filtrado de PII
- **OutputGuardrail**: validación de formato (si se espera JSON estructurado), filtrado de contenido tóxico, verificación de citas (en RAG)
- Implementados con la API nativa de LangChain4j 1.x (`@InputGuardrails`, `@OutputGuardrails`)

### 6.4 streaming
- Uso de `TokenStream` o `Multi<String>` para respuestas conversacionales
- Cancelación propagada desde HTTP al cliente LLM

---

## 7. autenticación y autorización

### 7.1 autenticación
- Mecanismo: OIDC con un proveedor externo (Keycloak / Auth0 / Cognito), o JWT firmado propio
- Hashing de contraseñas (si se usa auth local): bcrypt o argon2id
- Recuperación de contraseña: token de un solo uso con expiración corta

### 7.2 autorización
- Modelo: RBAC con anotaciones `@RolesAllowed` o ABAC con `SecurityIdentity` custom
- **Deny by default**: cada endpoint declara explícitamente quién puede acceder
- Verificación adicional en capa de servicio para reglas de negocio (no sólo a nivel de rol)
- Auditoría de accesos sensibles

### 7.3 secretos
- Nunca en el repo
- En desarrollo: `.env.local` (en .gitignore) cargado por `quarkus.config.locations`
- En producción: Vault, secret manager del cloud, o variables de entorno inyectadas por el orquestador
- Rotación documentada en runbook

---

## 8. seguridad transversal

Aplicada a CADA UC, verificada en CI:

- Validación de input en servidor (Bean Validation `@Valid`). No confiar en cliente.
- Sanitización de output donde corresponda
- Protección contra inyección SQL (Hibernate parametrizado, nunca concatenación)
- Rate limiting en endpoints sensibles (login, registro, password reset, búsquedas públicas, **endpoints LLM por costo de token**)
- Headers de seguridad: CSP, HSTS, X-Content-Type-Options, Referrer-Policy (configurables en Quarkus)
- CORS configurado con allowlist explícita
- Auditoría de dependencias en CI: `mvn dependency-check:check` (OWASP) o Snyk; `pnpm audit` para frontend
- Logs sin PII ni secretos (lista negra de campos, sanitización en interceptor)
- Logs **sin contenido sensible de prompts** salvo nivel debug en dev
- Backups cifrados, restauración probada al menos cada release mayor

---

## 9. observabilidad

### 9.1 logs
- Formato JSON estructurado (extensión `quarkus-logging-json`)
- Campos obligatorios: `timestamp`, `level`, `request_id`, `user_id` (si aplica), `service`, `message`
- Niveles: DEBUG (solo dev), INFO (eventos normales), WARNING (recuperable), ERROR (falla), CRITICAL (sistema en riesgo)
- MDC propagado en hilos reactivos

### 9.2 métricas (Micrometer)
Mínimas obligatorias:
- latencia p50/p95/p99 por endpoint
- throughput por endpoint
- tasa de error por endpoint
- saturación del datasource (pool de conexiones)
- consumo de CPU/memoria (JVM exporter)
- **métricas de LLM**: tokens consumidos por modelo, latencia por modelo, costo estimado, tasa de fallos LLM, tokens por request, time-to-first-token

### 9.3 trazas (OpenTelemetry)
- `quarkus-opentelemetry` instrumenta automáticamente HTTP, JDBC, llamadas LangChain4j
- `request_id` propagado de frontend a backend a BD y a servicios externos
- Spans específicos para cada llamada LLM con atributos: modelo, tokens, latencia, costo

### 9.4 alertas
Definidas en función de SLOs (`PRODUCT.md` §6.2). Cada alerta tiene runbook asociado.
Alertas específicas LLM: costo diario excedido, latencia LLM degradada, tasa de error LLM > umbral.

### 9.5 endpoints de salud
- `/q/health/live`: el proceso responde (Quarkus default)
- `/q/health/ready`: dependencias críticas (BD, LLM provider, vector store) responden
- `/q/metrics`: endpoint Prometheus

---

## 10. estrategia de testing

### 10.1 pirámide
```
        evals LLM (calidad de prompts) — ver ADR-0003
        e2e (pocos, críticos)
      integración (cobertura de bordes, @QuarkusTest)
   unitarios (mayoría, rápidos, aislados)
```

### 10.2 reglas
- Cada UC requiere: unitarios de su lógica de dominio + integración del endpoint + e2e del flujo crítico
- UCs con LLM requieren además: tests de unidad con `MockChatModel` (LangChain4j) + entrada en suite de evals
- Cobertura mínima por módulo: 80% de líneas en backend (JaCoCo), 70% en frontend
- **Tests inmutables**: si un test falla, se arregla el código, nunca el test, salvo que el test esté demostrablemente mal escrito
- Tests deterministas: nada de `Thread.sleep`, nada de fechas reales (`Clock` inyectable). Tests LLM SIEMPRE con mock, jamás llamando al modelo real.
- Datos de test aislados: Testcontainers + transacción rollback por test (`@TestTransaction`)

### 10.3 testing con Quarkus
- `@QuarkusTest` para tests de integración con CDI completo
- `@QuarkusIntegrationTest` para tests contra el binario compilado (incluye nativo si aplica)
- Quarkus Dev Services levanta automáticamente PostgreSQL y otros servicios en tests
- WireMock para simular APIs externas (incluyendo proveedores LLM en tests de integración cuando se quiere comportamiento determinista pero pasando por la pila HTTP real)

### 10.4 CI
Pipeline obligatorio antes de merge:
1. lint backend (Checkstyle / Spotless)
2. format check backend (Spotless)
3. lint y format frontend (eslint, prettier)
4. type check frontend (tsc)
5. tests unitarios + integración backend (`mvn verify`)
6. tests unitarios + integración frontend
7. tests e2e (al menos los críticos, Playwright contra build)
8. evals LLM (subset rápido, ver ADR-0003)
9. audit de dependencias (OWASP Dependency-Check, pnpm audit)
10. análisis estático SonarQube (ver §10.5)
11. build de imágenes Docker (JVM mode siempre, nativo en pipelines lentos)

Ningún PR mergea sin todos en verde.

### 10.5 análisis estático de calidad

**Herramienta**: SonarQube / SonarCloud.
Alternativa complementaria: GitHub CodeQL (gratis para repos públicos y muchos privados).

**Quality gate**:
- **Fase 0 a 2**: gate suave (warning, no bloqueante)
- **Fase 3 (hardening) en adelante**: gate bloqueante con umbrales:
  - 0 vulnerabilidades nuevas
  - 0 bugs nuevos de severidad alta o crítica
  - cobertura de código nuevo ≥ 80%
  - duplicación de código nuevo < 3%
  - mantenibilidad: ratio de deuda técnica < 5%

---

## 11. presupuesto de performance

| operación | objetivo p95 | bloqueante |
|-----------|--------------|------------|
| login | 300 ms | sí |
| listado paginado típico (sin LLM) | 400 ms | sí |
| flujo CRUD del UC crítico | 600 ms | sí |
| respuesta LLM no streaming (corto) | 5 s | sí |
| time-to-first-token (streaming) | 1.5 s | sí |
| operación batch | 5 s | no |

Tamaño de bundle frontend inicial: < 250 KB gzip. Excedente requiere ADR.
Imagen Docker backend JVM: < 250 MB. Imagen nativa: < 100 MB.
Arranque JVM: < 5 s. Arranque nativo: < 1 s.

---

## 12. estrategia de despliegue

### 12.1 entornos
- `local`: docker compose con Postgres + pgvector + Ollama + backend en dev mode + frontend en dev mode
- `staging`: réplica de producción a menor escala, datos anónimos, proveedor LLM real con presupuesto acotado
- `production`: real

### 12.2 pipeline
- merge a `main` → build, push de imagen, deploy automático a staging
- tag `vX.Y.Z` → deploy a producción con aprobación manual
- Migraciones Flyway: ejecutadas al arranque del backend; deben ser compatibles hacia atrás durante una versión

### 12.3 imágenes
- **Modo JVM** (default): `Dockerfile.backend.jvm` con OpenJDK 21 distroless. Más rápido de construir, soporta hot reload remoto si se desea.
- **Modo nativo** (opcional, recomendado para producción): `Dockerfile.backend.native` con GraalVM. Arranque sub-segundo, RAM mínima, ideal para escalado horizontal y serverless.
- La elección entre JVM y nativo en producción se documenta en ADR.

### 12.4 rollback
Plan documentado en runbook. Tiempo objetivo de rollback: < 10 min.

---

## 13. decisiones pendientes

Lista de decisiones aún no tomadas. Cada una se cierra con un ADR antes de necesitarla.

- [ ] proveedor cloud
- [ ] proveedor LLM principal en producción
- [ ] estrategia de chat memory persistente (Postgres / Redis / in-memory por sesión)
- [ ] envío de emails transaccionales
- [ ] gateway de pagos (si aplica)
