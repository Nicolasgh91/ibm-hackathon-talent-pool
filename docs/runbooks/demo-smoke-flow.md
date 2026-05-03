# Smoke demo (hackathon)

Verifica el flujo REST completo sin frontend: login reclutador, generar desafío, invitar candidato, consultar invitación por token, entregar código (async), polling como candidato y ranking del puesto.

## Prerrequisitos

- API corriendo (por ejemplo `cd backend && ./mvnw quarkus:dev`).
- Base de datos con migraciones aplicadas y seed demo (`V013__seed_demo_data.sql` + `V014__seed_student_demo.sql`): usuarios `recruiter@acme.com`, `ana@example.com`, `pedro@example.com`, `lucia@example.com` y `estudiante@example.com` con contraseña `Demo123!`, puesto precargado `33333333-3333-3333-3333-333333333333`. La cuenta estudiante sirve para probar `/student/*` desde una sesión limpia (rol ESTUDIANTE se persiste en `localStorage` al usar la tarjeta dev del login).
- JDK 21+ y Maven (wrapper incluido en `backend/`).

## Ejecución

Desde el directorio `backend/`:

```bash
./mvnw -q compile exec:java
```

La clase `com.talentpool.tools.DemoSmokeClient` usa `java.net.http.HttpClient` y Jackson (mismos pasos que el antiguo script bash).

Variables de entorno opcionales: `BASE_URL`, `PUESTO_ID`, `RECRUITER_EMAIL`, `RECRUITER_PASSWORD`, `CANDIDATE_EMAIL`, `CANDIDATE_PASSWORD`, `POLL_MAX`, `POLL_SLEEP` (valores por defecto alineados al seed demo; ver Javadoc en `DemoSmokeClient`).

> Si Quarkus no está corriendo, el frontend cae automáticamente a **modo demo** (banner sticky amarillo); en ese modo todas las pantallas funcionan contra un router in-memory (`frontend/src/mocks/*`) y los datos se reinician al refrescar. El smoke HTTP de abajo, en cambio, sí requiere backend real.

## Qué valida

- HTTP 201 en creación de desafío e invitaciones, 200 en invitación pública, 202 en envío de evaluación, 200 en ranking.
- Polling hasta `estado == EVALUADA` (latencia mock típica ~8–15 s más generación previa del desafío).

## Paridad con la SPA (2026-05)

| Recurso Quarkus | Ruta aprox. | Uso en SPA |
|-----------------|------------|------------|
| `PositionsResource` | `GET/PUT/DELETE /positions`, `GET /positions/{id}/ranking` | `jobPositionService`, `Rankings` |
| `ChallengesResource` | `GET /challenges`, `GET /challenges/{id}` | `challengeService` |
| `AssignmentsResource` | `/assignments/*` | `assignmentService` |
| `EvaluationsResource` | `/evaluations`, `/evaluations/rankings`, `/evaluations/my-evaluations` | `evaluationService` |
| `InvitationsResource` | `/invitations/by-token/{token}` | `/accept-invitation` |
| `ChatResource` | `POST /chat` | `/chat` |

Contrato resumido: [`docs/api-contract-status.md`](../api-contract-status.md).
