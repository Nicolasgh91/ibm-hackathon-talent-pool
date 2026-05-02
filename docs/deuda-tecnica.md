# Deuda Tecnica de Documentacion

## Pendientes detectados en sprint demo (2026-05-02)

- `backend/src/main/java/com/talentpool/api/PositionsResource.java`: falta documento de subsistema para contratos REST de posiciones/ranking.
- `backend/src/main/java/com/talentpool/api/ChallengesResource.java`: falta documento de subsistema para flujo generar desafio e invitaciones.
- `backend/src/main/java/com/talentpool/api/InvitationsResource.java`: falta documento de subsistema para endpoint publico por token.
- `backend/src/main/java/com/talentpool/api/EvaluationsResource.java`: falta documento de subsistema para submit async y polling.
- `backend/src/main/java/com/talentpool/service/DesafioService.java`: falta guia funcional del switch mock LLM vs proveedor real.
- `backend/src/main/java/com/talentpool/service/EvaluacionService.java`: falta guia de proceso asincrono y reglas de estado.

## Propuesta

Crear `docs/subsistemas/api-rest-demo.md` y `docs/subsistemas/evaluacion-async.md` despues de la demo para formalizar contratos, seguridad y estados.

