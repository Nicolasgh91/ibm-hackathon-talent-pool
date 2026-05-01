# UC-001: registrar usuario nuevo

## metadatos

| campo | valor |
|-------|-------|
| ID | UC-001 |
| nombre | registrar usuario nuevo |
| prioridad | crítica |
| fase | 1 (walking skeleton) |
| estado | pendiente |
| autor | equipo fundador |
| última revisión | YYYY-MM-DD |
| ADRs relacionados | ADR-0001 |
| usa LLM | no |

---

## 1. contexto

### 1.1 actor
Visitante anónimo (no autenticado).

### 1.2 objetivo
Crear una cuenta para acceder a la aplicación.

### 1.3 precondiciones
- El visitante no tiene una cuenta con el email que va a usar.
- El servicio de autenticación está disponible.

### 1.4 postcondiciones
- Existe un registro en `users` con el email provisto.
- El usuario queda autenticado (JWT válido emitido).
- Se publica un evento `user.registered` para sistemas downstream (email de bienvenida, analytics).

---

## 2. flujo principal

1. El actor accede a la pantalla de registro.
2. El actor ingresa email y contraseña.
3. El cliente valida formato de email y fortaleza de contraseña; si falla, muestra error y el flujo no avanza.
4. El cliente envía `POST /api/v1/auth/register` con email y contraseña.
5. El servidor valida nuevamente formato y fortaleza (Bean Validation + reglas custom).
6. El servidor verifica que el email no esté registrado.
7. El servidor hashea la contraseña con argon2id.
8. El servidor crea el registro en `users` (Hibernate Panache).
9. El servidor emite un access token + refresh token (SmallRye JWT).
10. El servidor publica el evento `user.registered` en el bus interno (CDI Event).
11. El servidor responde `201 Created` con datos públicos del usuario y los tokens.
12. El cliente almacena los tokens y redirige a la pantalla post-registro.

---

## 3. flujos alternativos y de error

### 3.1 error: email mal formado
- HTTP `422 Unprocessable Entity`
- mensaje: "email inválido"
- el cliente resalta el campo

### 3.2 error: contraseña débil
- HTTP `422 Unprocessable Entity`
- mensaje: "la contraseña no cumple los requisitos mínimos"
- el cliente muestra los requisitos

### 3.3 error: email ya registrado
- HTTP `409 Conflict`
- mensaje: "no se puede crear la cuenta con esos datos"
- **importante**: el mensaje no debe revelar si el email existe o no, para evitar enumeración. La auditoría interna sí registra el motivo real.

### 3.4 error: rate limit
- HTTP `429 Too Many Requests`
- header `Retry-After`
- el cliente muestra mensaje genérico de "demasiados intentos"

### 3.5 error: servicio no disponible
- HTTP `503 Service Unavailable`
- el cliente muestra mensaje de reintento

---

## 4. criterios de aceptación

```gherkin
Funcionalidad: registrar usuario nuevo

  Escenario: registro exitoso
    Dado que el email "alice@example.com" no está registrado
    Cuando envío POST /api/v1/auth/register con email "alice@example.com" y contraseña fuerte "Correct-Horse-Battery-Staple-9"
    Entonces recibo respuesta 201
    Y la respuesta incluye un access_token válido
    Y existe un registro en users con ese email
    Y la contraseña almacenada está hasheada con argon2id
    Y se publicó un evento user.registered

  Escenario: email ya registrado
    Dado que el email "bob@example.com" ya está registrado
    Cuando envío POST /api/v1/auth/register con email "bob@example.com" y contraseña válida
    Entonces recibo respuesta 409
    Y el cuerpo no revela si el email existe
    Y no se crea ningún registro nuevo

  Escenario: contraseña débil
    Cuando envío POST /api/v1/auth/register con contraseña "1234"
    Entonces recibo respuesta 422
    Y la respuesta enumera los requisitos no cumplidos

  Escenario: rate limit superado
    Dado que ya hice 5 intentos en el último minuto desde la misma IP
    Cuando envío un sexto POST /api/v1/auth/register
    Entonces recibo respuesta 429
    Y la respuesta incluye header Retry-After
```

---

## 5. requisitos no funcionales

| requisito | valor |
|-----------|-------|
| latencia p95 | < 400 ms (incluye hashing argon2) |
| tasa de error tolerable | < 1% |
| auditoría | sí (registrar intentos exitosos y fallidos sin contraseñas) |
| rate limit | 5 intentos / minuto / IP |
| autorización | público |

---

## 6. modelo de datos afectado

Migración: `V1__create_users_table.sql`

```sql
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           CITEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_created_at ON users(created_at);
```

---

## 7. contrato de API

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "Correct-Horse-Battery-Staple-9"
}
```

Respuesta exitosa (`201 Created`):
```json
{
  "user": {
    "id": "uuid",
    "email": "alice@example.com",
    "createdAt": "2026-04-30T12:00:00Z"
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```

Implementación:
- Recurso JAX-RS: `AuthResource` en `api/`
- Records DTO: `RegisterRequest`, `AuthResponse` en `api/dto/`
- Servicio: `AuthService` en `service/` (orquesta validación, persistencia, emisión de tokens)
- Repositorio: `UserRepository extends PanacheRepository<UserEntity>` en `infrastructure/persistence/`
- Excepciones: `EmailAlreadyRegisteredException` mapeada a 409 por `ExceptionMapper`

---

## 8. capa LLM

n/a — este UC no usa LLM.

---

## 9. consideraciones de seguridad

- La contraseña jamás se loguea, ni en debug. Filtro de logs configurado para campo `password`.
- El response en caso de email duplicado no diferencia de otros errores de validación a nivel de mensaje, para evitar enumeración.
- argon2id con parámetros: `time_cost=3, memory_cost=64MB, parallelism=4` (revisable según hardware).
- Tokens: access token de 15 min, refresh token de 7 días, ambos firmados con SmallRye JWT.
- Se aplica rate limit por IP y por email mediante extensión Quarkus o filtro custom respaldado en Redis.
- Se considera (futuro): captcha tras N intentos fallidos.

---

## 10. tests requeridos

- [ ] unitario: validador de fortaleza de contraseña (`PasswordPolicyTest`)
- [ ] unitario: `AuthService.register` con repositorio mockeado
- [ ] integración `@QuarkusTest`: `POST /api/v1/auth/register` casos felices y de error
- [ ] integración: rate limit dispara 429 (Testcontainers con Redis)
- [ ] e2e Playwright: flujo completo desde UI hasta dashboard

---

## 11. definición de hecho (DoD)

- [ ] Migración Flyway creada y aplicada
- [ ] Endpoint implementado y documentado en OpenAPI exportado
- [ ] UI de registro implementada
- [ ] Todos los criterios de aceptación verificados por tests
- [ ] Cobertura JaCoCo ≥ 80% en módulos afectados
- [ ] Logs y métricas visibles en staging
- [ ] PR aprobado por humano
- [ ] Verificación manual en staging
- [ ] Sin deuda técnica nueva sin registrar

---

## 12. dependencias

Antes:
- Fase 0 cerrada (infra mínima Quarkus + Postgres + frontend dev)

Después:
- UC-002 (login) usa la tabla `users`
- UC-003 (recuperar contraseña) depende de este

---

## 13. historial

| fecha | cambio | motivo |
|-------|--------|--------|
| YYYY-MM-DD | versión inicial | — |
