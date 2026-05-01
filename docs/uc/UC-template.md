# UC-NNN: nombre del caso de uso

> Plantilla. Copiar a `UC-NNN-slug.md` con numeración correlativa de `PRODUCT.md` §4.

## metadatos

| campo | valor |
|-------|-------|
| ID | UC-NNN |
| nombre | ... |
| prioridad | crítica / alta / media / baja |
| fase | N (de `ROADMAP.md`) |
| estado | pendiente / en progreso / hecho |
| autor | ... |
| última revisión | YYYY-MM-DD |
| ADRs relacionados | ADR-NNNN |
| usa LLM | sí / no |

---

## 1. contexto

### 1.1 actor
Quién ejecuta el caso de uso (rol del usuario, sistema externo, job programado).

### 1.2 objetivo
Qué quiere lograr el actor en una frase.

### 1.3 precondiciones
Qué debe ser cierto antes de que este UC pueda ejecutarse.

### 1.4 postcondiciones
Qué es cierto después de la ejecución exitosa.

---

## 2. flujo principal

Pasos numerados, sin ambigüedad.

1. El actor ...
2. El sistema valida ...
3. El sistema persiste ...
4. El sistema responde ...
5. El actor ve ...

---

## 3. flujos alternativos y de error

### 3.1 alt: condición X
1. ...

### 3.2 error: condición Y
- código HTTP: 4XX
- mensaje: "..."
- comportamiento del cliente: ...

---

## 4. criterios de aceptación

```gherkin
Funcionalidad: nombre del UC

  Escenario: caso feliz
    Dado que [precondición]
    Cuando [acción]
    Entonces [resultado observable]

  Escenario: error de validación
    Dado que [precondición]
    Cuando [acción inválida]
    Entonces [respuesta de error específica]
```

---

## 5. requisitos no funcionales

| requisito | valor |
|-----------|-------|
| latencia p95 | ... ms |
| tasa de error tolerable | ... % |
| auditoría | sí / no |
| rate limit | ... |
| autorización | rol(es) permitidos |
| **(si usa LLM) tokens máx por request** | input: ... / output: ... |
| **(si usa LLM) costo objetivo por request** | USD ... |

---

## 6. modelo de datos afectado

```
- tabla X: agrega columna Y (nullable hasta backfill)
- tabla Z: nueva tabla con esquema {...}
```

Migración Flyway: `V<n>__<descripcion>.sql`

---

## 7. contrato de API

```http
POST /api/v1/recurso
Content-Type: application/json
Authorization: Bearer <token>

{
  "campo1": "...",
  "campo2": "..."
}
```

Respuestas:
- `201 Created` — `{ "id": "...", ... }`
- `400 Bad Request` — error de validación
- `409 Conflict` — recurso ya existe
- `429 Too Many Requests` — rate limit

---

## 8. (si usa LLM) capa LLM

### 8.1 AiService a usar / crear
Interface `XxxService` en `infrastructure/ai/services/`.
Anotaciones: `@SystemMessage(...)`, `@UserMessage(...)`, parámetros con `@V`.

### 8.2 prompts
- System prompt: ubicación y versión
- User prompt template: ubicación y versión

### 8.3 guardrails
- input: longitud máxima, anti-inyección, PII
- output: formato esperado, validación de citas (si RAG)

### 8.4 modelo y parámetros
- modelo: ...
- temperature: ...
- max tokens: ...

### 8.5 entradas a la suite de evals
Casos de prueba a añadir a `src/test/resources/evals/<capacidad>.yaml`:
- caso 1: ...
- caso 2: ...

---

## 9. consideraciones de seguridad

- Validación de input en servidor: ...
- Datos sensibles que no deben loguearse: ...
- Riesgos de abuso identificados (incluyendo abuso de costo LLM): ...

---

## 10. tests requeridos

- [ ] unitario: lógica de dominio (módulo `domain/`)
- [ ] unitario: AiService con `MockChatModel` (si usa LLM)
- [ ] integración: endpoint completo `@QuarkusTest` con Testcontainers
- [ ] e2e: flujo completo desde UI (si aplica)
- [ ] eval: casos añadidos a la suite (si usa LLM)

---

## 11. definición de hecho (DoD)

- [ ] Implementación cumple flujo principal y alternativos
- [ ] Todos los criterios de aceptación verificados por test
- [ ] Cobertura de módulo dentro del umbral (`ARCHITECTURE.md` §10.2)
- [ ] OpenAPI actualizado y exportado
- [ ] Documentación de UI actualizada (si aplica)
- [ ] PR revisado y aprobado por humano
- [ ] Métricas y logs visibles para este flujo
- [ ] (si usa LLM) métricas de tokens y costo registradas
- [ ] (si usa LLM) suite de evals smoke pasa para esta capacidad
- [ ] Deployado a staging y verificado manualmente
- [ ] Sin deuda técnica nueva sin registrar

---

## 12. dependencias

UCs que deben estar implementados antes:
- UC-...

UCs que dependen de este:
- UC-...

---

## 13. historial

| fecha | cambio | motivo |
|-------|--------|--------|
| YYYY-MM-DD | versión inicial | — |
