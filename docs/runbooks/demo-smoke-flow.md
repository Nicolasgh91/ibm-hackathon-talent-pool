# Smoke demo (hackathon)

Verifica el flujo REST completo sin frontend: login reclutador, generar desafío, invitar candidato, consultar invitación por token, entregar código (async), polling como candidato y ranking del puesto.

## Prerrequisitos

- API corriendo (por ejemplo `cd backend && ./mvnw quarkus:dev`).
- Base de datos con migraciones aplicadas y seed demo (`V013__seed_demo_data.sql`): usuarios `recruiter@acme.com` y `ana@example.com` con contraseña `Demo123!`, puesto precargado `33333333-3333-3333-3333-333333333333`.
- JDK 21+ y Maven (wrapper incluido en `backend/`).

## Ejecución

Desde el directorio `backend/`:

```bash
./mvnw -q compile exec:java
```

La clase `com.talentpool.tools.DemoSmokeClient` usa `java.net.http.HttpClient` y Jackson (mismos pasos que el antiguo script bash).

Variables de entorno opcionales: `BASE_URL`, `PUESTO_ID`, `RECRUITER_EMAIL`, `RECRUITER_PASSWORD`, `CANDIDATE_EMAIL`, `CANDIDATE_PASSWORD`, `POLL_MAX`, `POLL_SLEEP` (valores por defecto alineados al seed demo; ver Javadoc en `DemoSmokeClient`).

## Qué valida

- HTTP 201 en creación de desafío e invitaciones, 200 en invitación pública, 202 en envío de evaluación, 200 en ranking.
- Polling hasta `estado == EVALUADA` (latencia mock típica ~8–15 s más generación previa del desafío).
