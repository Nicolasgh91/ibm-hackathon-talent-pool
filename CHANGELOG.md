# CHANGELOG

Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Versionado: [SemVer](https://semver.org/lang/es/).

---

## [no publicado]

### añadido
- Backend (Phase A — schema & domain gaps cierre MVP): migraciones `V016__alter_puestos_uc006_fields.sql` (`herramientas`, `skills_tecnicas`, `skills_blandas`, `roadmap_publico_habilitado`), `V017__alter_desafios_plan_evaluacion.sql` (`plan_evaluacion_id`, `tipo_desafio`, `peso`, `cursos_integrados`, `chk_desafio_contexto` ampliado a `ACADEMICO_INTEGRADOR`), `V018__create_evaluaciones_versiones.sql` (autosave UC-017), `V019__create_llamadas_llm.sql` (audit costo/tokens/latencia LLM, DATABASE.md §1.4), `V020__create_eventos_auditoria.sql` (log inmutable acciones críticas), `V021__seed_canonical_prompt_versiones.sql` (`evaluador_codigo` ACTIVA + `juez_evals` EXPERIMENTAL).
- Backend: entidades Panache `EvaluacionVersion`, `LlamadaLlm`, `EventoAuditoria`; servicios insert-only `LlamadaLlmService` (record con TX `REQUIRES_NEW`, builder fluente, fallback no-throw) y `AuditService` (constantes canónicas para acciones, sobrecarga IP/User-Agent).
- Backend: `Puesto` extendido con `JsonArray` para herramientas/skills + flag `roadmapPublicoHabilitado`; `CreatePuestoRequest` admite `SkillTecnica` estructurado y nuevos arrays opcionales; `PuestoResponse` expone perfil completo.
- Backend: `Desafio` extendido con `planEvaluacionId`, `tipoDesafio`, `peso`, `cursosIntegrados`; `DesafioResponse` lo refleja.
- Backend tests: `PhaseASchemaTest` (5 casos) cubre persistencia round-trip de `LlamadaLlmService`, `AuditService` con/ sin actor, `EvaluacionVersion.nextVersionNumber`, y verifica que las `prompt_versiones` canónicas existen.
- Backend: CRUD `GET/POST/PUT/DELETE /api/v1/organizations` (UC-004), servicio `OrganizacionService`, migración `V015__add_descripcion_to_organizaciones.sql`; prueba de integración `OrganizationsResourceTest`.
- Estructura inicial del proyecto
- Frontend: flujo estudiante bajo `/student/*` (dashboard, curso, repositorio, nueva consulta con similares, detalle) con datos mock; bandera `VITE_ENABLE_STUDENT_DEMO`; persistencia de rol por email en `localStorage` para login sin claim en JWT; identidad visual teal en `Layout`.
- Backend: migración `V014__seed_student_demo.sql` con usuario estudiante demo `estudiante@example.com / Demo123!` (idempotente con `ON CONFLICT DO NOTHING`).
- Frontend: tarjeta de credenciales demo en `/login` (`DevLoginCredentialsCard`) visible sólo en `vite dev`, gateada por `import.meta.env.DEV` y opt-out `VITE_SHOW_DEV_LOGIN_HINTS=false`; precarga formulario y persiste el rol por email para que el redirect post-login lleve a la home correcta. Helper público `authService.saveRoleForEmail`.
- Frontend: modo demo automático con mock adapter sobre axios. Si la primera llamada al backend falla por red o 5xx, `api.ts` activa `tp_demo_mode=true` en sessionStorage y reintenta la request por un router in-memory (`mocks/mockHandlers.ts` + `mocks/demoStore.ts`) que cubre auth + organizations + positions + challenges + assignments + evaluations + rankings con datos seed coherentes para reclutador, candidato y estudiante. Banner sticky `DemoModeBanner` informa al usuario y permite reintentar el backend. Submit de evaluación transiciona EVALUANDO → COMPLETADO en ~6 segundos para mostrar el flujo de feedback.

### cambiado
- `product/PRODUCT.md`: document translated to English (v1.2); content aligned with prior Spanish v1.1.
- `README.md`, `product/USER_FLOWS.md`: references to product use-case count updated (26 UCs, UC-001–UC-026).

### deprecado
- —

### eliminado
- —

### corregido
- —

### seguridad
- —

---

## plantilla de entrada

```
## [X.Y.Z] — YYYY-MM-DD

### añadido
- nuevas funcionalidades

### cambiado
- cambios en funcionalidades existentes (incluyendo cambios de prompts con impacto medible)

### deprecado
- funcionalidades que se quitarán pronto

### eliminado
- funcionalidades quitadas

### corregido
- bugs corregidos

### seguridad
- correcciones de seguridad
```
