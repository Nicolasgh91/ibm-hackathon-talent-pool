# API contract status (frontend ↔ backend ↔ mock)

| Area | Source of truth | Notes |
|------|-----------------|--------|
| Paths & verbs | `api/openapi.yaml` (sketch) + Quarkus `@Path` | Regenerate client types: `cd frontend && npm run openapi:types` |
| Auth / orgs | Backend + mock | **OK** — same URLs |
| Positions | `PositionsResource` + `PuestoService` | **CRUD + ranking** — `GET/PUT/DELETE` and activate/delegate added; wire uses `PuestoResponse` (shape differs from legacy `JobPosition` until domain adapters land) |
| Challenges | `ChallengesResource` + `DesafioService` | **GET list + GET by id + POST generate + POST invitations** |
| Assignments | `AssignmentsResource` (new) | Maps invite/accept to `InvitacionService`; projection `AssignmentWireResponse` |
| Evaluations | `EvaluationsResource` | **List, my-evaluations, assignment lookup, global rankings, submit, by id** |
| Invitations (public) | `InvitationsResource` | `GET /invitations/by-token/{token}` includes `asignacionId` (2026-05) |
| Chat | `ChatResource` | `POST /chat` (JWT) |
| Demo mock | `frontend/src/mocks/mockHandlers.ts` | Aligned: `POST /challenges`, `POST /evaluations`, `GET /positions/:id/ranking`, `GET /invitations/by-token/:token`, `POST /chat` |

**Mismatch bucket (adapters B2)**: `Evaluation` UI type vs `EvaluacionDetail` wire — use `evaluationWireAdapter.ts` in `evaluationService.getById`.

---

## Estado

| Documento | Estado |
|-----------|--------|
| Esta tabla | En uso |
