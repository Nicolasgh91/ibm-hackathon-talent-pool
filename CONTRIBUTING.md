# CONTRIBUTING.md — convenciones y reglas de trabajo

> Lectura obligatoria antes de tocar el código. Aplica a humanos y agentes.

---

## 1. reglas para agentes de código

Estas reglas son inmutables salvo decisión explícita del responsable humano del proyecto.

1. **Tests inmutables**. Si un test falla, está mal el código, no el test. Solo se reescribe un test si está demostrablemente mal redactado, y la justificación va en el mensaje de commit.
2. **Sin decisiones de arquitectura sin ADR**. Si te encontrás eligiendo entre alternativas no triviales (librería, patrón, modelo de datos, prompt nuevo), parás y creás el ADR antes de codear.
3. **Sin dependencias nuevas sin justificación**. Toda dependencia añadida en `pom.xml` o `package.json` se justifica en el PR: por qué, alternativas consideradas, impacto en tamaño y arranque.
4. **Toda atajo se registra**. Si tomás un shortcut por tiempo, lo anotás en `TECH_DEBT.md` con ID, impacto, esfuerzo estimado y propuesta. Atajo no documentado = bug futuro.
5. **OpenAPI siempre actualizado**. Si tocaste la API, exportá `openapi.yaml` actualizado en el mismo PR.
6. **Tests con cada feature**. PR sin tests = PR rechazado, salvo cambio puramente cosmético.
7. **Ante ambigüedad, parás y preguntás**. No asumás. Si el UC no es claro, no inventes el flujo: pedí aclaración.
8. **PRs auto-contenidos**. Cada PR es mergeable y deja el repo en estado verde. Nada de "lo arreglo en el siguiente PR".
9. **Sin secretos en código ni en logs**. Nunca. Ni en tests. Ni en ejemplos. Ni en commits aunque después se borren.
10. **Sin modificaciones a migraciones Flyway mergeadas**. Las migraciones son inmutables una vez en `main`. Cambios = nueva migración.
11. **Respeto al alcance**. No agregues funcionalidad fuera del UC asignado. Si la ves necesaria, la proponés en `PRODUCT.md` o como UC nueva.
12. **Sin llamadas reales a LLM en tests**. Tests unitarios y de integración usan `MockChatModel` o WireMock. Llamadas reales solo en la suite de evals, controlada por flag y nunca por defecto en CI.
13. **Sin prompts hardcodeados dispersos**. Todo prompt vive en `infrastructure/ai/prompts/` o como constante en una clase dedicada, versionado y revisable.
14. **Idioma de código**: inglés. **Idioma de documentación y prompts de negocio**: español (o lo que defina el proyecto). Comentarios en código: español si aclaran negocio, inglés si aclaran técnica.

---

## 2. flujo de trabajo

### 2.1 antes de empezar una tarea
1. Leer el UC correspondiente en `docs/uc/`
2. Leer ADRs relevantes
3. Verificar que la fase de `ROADMAP.md` correspondiente está activa
4. Crear branch desde `main`

### 2.2 durante el desarrollo
1. Commits frecuentes y pequeños
2. Tests al mismo tiempo que el código (TDD recomendado, no obligatorio)
3. Si surge una decisión arquitectónica, ADR antes de seguir
4. Si surge un atajo, entrada en `TECH_DEBT.md`
5. Si tocás prompts, agregás casos a la suite de evals

### 2.3 antes de abrir el PR
- [ ] `./mvnw verify` en verde local (lint + format + tests + cobertura)
- [ ] Frontend: `pnpm lint && pnpm typecheck && pnpm test` en verde
- [ ] OpenAPI exportado y actualizado si aplica
- [ ] Documentación actualizada (UC, README, runbook si aplica)
- [ ] Sin TODOs sin ticket asociado

---

## 3. branching

**Estrategia**: trunk-based con feature branches cortos.

- `main`: siempre desplegable
- `feat/uc-NNN-slug`: feature
- `fix/slug`: bugfix
- `chore/slug`: mantenimiento, sin cambio de comportamiento
- `docs/slug`: solo documentación

Vida máxima de una rama: **5 días**. Si tarda más, se parte.

---

## 4. commits

**Conventional Commits** obligatorio:

```
<tipo>(<scope opcional>): <descripción imperativa, minúscula, sin punto>

[cuerpo opcional explicando el porqué, no el qué]

[footer opcional con refs: Closes #123, ADR-0007, UC-005]
```

Tipos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`.

Ejemplos:
```
feat(auth): registrar usuario con email y contraseña

implementa UC-001. usa argon2id para hashing.

Refs: UC-001, ADR-0003
```

```
fix(api): devolver 409 en email duplicado en lugar de 500
```

---

## 5. pull requests

### 5.1 plantilla
Cada PR usa la plantilla en `.github/pull_request_template.md`.

### 5.2 tamaño
- Ideal: < 400 líneas de diff
- Máximo: 800 líneas, excepto migraciones generadas y archivos auto-generados
- Más grande → partir, salvo justificación clara

### 5.3 revisión
- Mínimo 1 revisor humano antes de merge
- Si el autor es un agente, el revisor humano es obligatorio y no puede ser otro agente
- Comentarios resueltos antes de merge

---

## 6. estilo de código

### 6.1 backend (Java + Quarkus)

**Herramientas obligatorias**:
- **Spotless** con perfil Google Java Format o Palantir (definido en `pom.xml`)
- **Checkstyle** o **PMD** para reglas adicionales
- **Error Prone** opcional pero recomendado
- **JaCoCo** para cobertura

**Convenciones**:
- Java 21 features cuando aporten claridad: `record`, `sealed`, pattern matching, `var` en locales obvias
- DTOs como `record`s siempre que sea posible
- Inmutabilidad por defecto: `final` en parámetros y locales que no cambian
- `Optional` solo en retornos, nunca en parámetros
- Sin uso de `null` como valor de retorno; usar `Optional` o lanzar excepción
- Excepciones de dominio tipadas (no `RuntimeException` genérica). Mapeadas a HTTP por `ExceptionMapper`.
- Sin `System.out.println`; usar SLF4J / JBoss Logging
- Sin lógica de negocio en recursos JAX-RS; estos solo orquestan
- Beans CDI con scopes explícitos (`@ApplicationScoped`, `@RequestScoped`)
- Configuración por `@ConfigMapping` (preferido) o `@ConfigProperty`
- Async con Mutiny (`Uni`, `Multi`) cuando se justifique; sin mezclar bloqueante y reactivo en la misma cadena

**Nombres**:
- `PascalCase` para clases, interfaces, records, enums
- `camelCase` para métodos y variables
- `UPPER_SNAKE_CASE` para constantes
- Paquetes en minúscula sin guiones bajos

**Estructura de un módulo típico**:
```
service/
├── UserService.java          # @ApplicationScoped, orquesta el caso de uso
api/
├── UserResource.java         # @Path, solo orquesta
├── dto/
│   ├── UserCreateRequest.java   # record
│   └── UserResponse.java        # record
domain/
├── User.java                 # entidad de dominio (puede o no ser JPA)
├── UserId.java               # value object
infrastructure/persistence/
├── UserRepository.java       # PanacheRepository
├── UserEntity.java           # @Entity JPA si está separada del dominio
```

### 6.2 frontend (TypeScript / React)
- Formatter: `prettier`
- Linter: `eslint` con `typescript-eslint`
- Type check: `tsc --noEmit`
- Componentes: funcionales con hooks
- Sin `any` (usar `unknown` y refinar)
- Cliente HTTP tipado generado desde OpenAPI; no escribir tipos de API a mano
- Nombres: `camelCase` para funciones/variables, `PascalCase` para componentes y tipos

### 6.3 SQL
- Snake_case en tablas y columnas
- Tablas en plural: `users`, `conversations`
- Claves foráneas: `<tabla_singular>_id`
- Timestamps: `created_at`, `updated_at`
- Booleans: prefijo `is_` o `has_`
- Migraciones Flyway: `V<n>__<descripcion>.sql`, una migración = un cambio cohesivo

---

## 7. manejo de deuda técnica

Toda deuda va en `TECH_DEBT.md` con este formato:

```markdown
## TD-NNN: título corto
- detectado: YYYY-MM-DD, fase N, PR #NNN
- contexto: qué se hizo y por qué
- impacto: alto / medio / bajo (con criterio)
- esfuerzo estimado: en horas o tallas (S/M/L)
- propuesta de resolución: cómo se resolvería
- bloqueante para: fase N / feature X / nada
- estado: abierto / en progreso / resuelto (con PR de cierre)
```

**Revisión periódica**: al cierre de cada fase, se revisa la lista y se decide qué resolver antes de avanzar.

---

## 8. ADRs (architecture decision records)

Cuándo crear uno:
- Elección de librería o framework no trivial
- Cambio en modelo de datos canónico
- Cambio en convención que afecta a más de un módulo
- Decisión que afecta seguridad, performance o costos (especialmente costo de LLM)
- Decisión sobre prompts críticos del sistema
- Estrategia de RAG o vector store
- Estrategia de evaluación de LLMs
- Decisión que será costosa de revertir

Cuándo NO hace falta:
- Decisiones locales a una función o módulo pequeño
- Aplicación de una convención ya documentada

Ubicación: `docs/adr/NNNN-titulo-en-kebab-case.md`. Numeración correlativa, sin saltos.

---

## 9. casos de uso (UC)

Cada UC vive en `docs/uc/UC-NNN-slug.md` y se completa con la plantilla `UC-template.md`.

Reglas:
- Un UC se desarrolla en un PR (o una serie corta de PRs encadenados)
- Si el UC necesita partirse, se crean sub-UCs (UC-005a, UC-005b)
- El UC se actualiza si la implementación reveló diferencias respecto a lo escrito originalmente; el cambio se documenta al final del archivo en una sección "historial"

---

## 10. trabajo con LangChain4j

### 10.1 AiServices
- Una interface por capacidad LLM (ej: `DocumentSummarizer`, `ConversationalAgent`)
- Anotaciones claras: `@SystemMessage`, `@UserMessage`, `@V` para variables, `@Tool` para tools
- Devolver tipos estructurados (records, enums) cuando sea posible, no `String` libre

### 10.2 prompts
- Versionados en `resources/prompts/` o como constantes
- Documentados con su propósito, variables esperadas, ejemplos de input/output esperado
- Cada cambio significativo a un prompt incrementa su versión y entra a la suite de evals

### 10.3 tests
- Tests unitarios de AiServices con `MockChatModel`: validan que la interfaz arma bien los mensajes y procesa la respuesta
- Tests de integración con WireMock simulando el provider HTTP: validan retries, timeouts, manejo de errores
- Suite de evals (`src/test/java/.../evals/`): valida calidad real con un modelo real, corre en CI con flag o en pipeline aparte

### 10.4 guardrails
- Toda capacidad expuesta a usuarios externos debe tener `@InputGuardrails` y `@OutputGuardrails`
- Guardrails personalizados de PII implementados como CDI beans

---

## 11. comunicación con el agente

Al asignar una tarea al agente, el prompt incluye:
1. Referencia al UC: "implementá UC-005 según `docs/uc/UC-005-slug.md`"
2. Restricciones extra si las hay
3. Aclaración de que rige `CONTRIBUTING.md`

Si el agente devuelve un plan de acción, el humano lo revisa **antes** de autorizar la implementación. El humano puede pedir cambios estructurales (no solo cosméticos) en el plan; el agente itera hasta tener visto bueno.

---

## 12. cómo cerrar una fase

1. Verificar todos los entregables de `ROADMAP.md` para la fase
2. Demo en vivo del estado del sistema
3. Entrada en `CHANGELOG.md` con los cambios significativos
4. Tag de versión si corresponde
5. Revisión de `TECH_DEBT.md`
6. Actualización de `ROADMAP.md` con fechas reales y notas
7. Retro: qué funcionó, qué no, qué cambiar para la próxima fase
