# Deuda Tecnica de Documentacion

## Pendientes detectados en sprint demo (2026-05-02)

- `backend/src/test/java/com/talentpool/api/ChatResourceTest.java`: el `user` de `@TestSecurity` debe ser un UUID (subject JWT). Los fallos 500 restantes en `mvn test` vienen de `ChatService` / proveedor LLM mock en el perfil de test, no del subject.
- `backend/src/main/java/com/talentpool/api/OrganizationsResource.java` y `OrganizacionService`: falta guía en `docs/subsistemas/` para contrato `GET/POST/PUT/DELETE /api/v1/organizations` (membresía, roles OWNER, 409 con puestos).
- Tokens y estilo UI post re-theme: referencia en [`frontend/DESIGN_TOKENS.md`](../frontend/DESIGN_TOKENS.md); deuda de rutas estudiante/nav en [`TECH_DEBT.md`](../TECH_DEBT.md) (TD-004).
- `frontend/src/pages/student/*.tsx` y `frontend/src/mocks/studentCourseMock.ts`: UI académica (repositorio colaborativo) en modo **mock**; falta `docs/subsistemas/frontend-student-demo.md` o ampliar subsistema API cuando existan `consultas_llm` / `votos_consulta` en backend.
- **Contrato REST agregado** en [`docs/api-contract-status.md`](api-contract-status.md) (posiciones, challenges, assignments, evaluaciones, invitaciones). Pendiente profundizar guías dedicadas por subsistema (`api-rest-demo.md`, etc.) cuando se estabilice Phase D.
- `backend/src/main/java/com/talentpool/service/DesafioService.java`: falta guia funcional del switch mock LLM vs proveedor real.
- `backend/src/main/java/com/talentpool/service/EvaluacionService.java`: falta guia de proceso asincrono y reglas de estado.
- `frontend/src/pages/Login.tsx` y `frontend/src/components/dev/DevLoginCredentialsCard.tsx`: no existen documentos de componente formales para páginas/componentes auxiliares de auth; mismo criterio que el resto de páginas del SPA. Documentar cuando se cree `docs/componentes/` o `docs/subsistemas/frontend-auth.md`.
- `frontend/src/pages/AcceptInvitation.tsx`, `frontend/src/pages/Chat.tsx`: páginas nuevas sin `docs/componentes/` dedicados (flujo candidato + `/chat`); enlazan contratos en `docs/api-contract-status.md`.
- `backend/src/main/java/com/talentpool/service/LlamadaLlmService.java` y `AuditService.java` (Phase A, 2026-05-03): nuevos servicios insert-only de auditoría LLM y eventos críticos. Falta `docs/subsistemas/observabilidad-llm.md` cuando Phase B/E aterricen el wiring real (cost dashboard + spans).
- `backend/src/main/java/com/talentpool/domain/EvaluacionVersion.java` (Phase A): tabla `evaluaciones_versiones` para autosave; documentar reglas de uso (frecuencia, snapshot vs diff) cuando Phase D agregue el endpoint `POST /evaluations/{id}/snapshot`.

## Propuesta

Crear `docs/subsistemas/api-rest-demo.md` y `docs/subsistemas/evaluacion-async.md` despues de la demo para formalizar contratos, seguridad y estados.

