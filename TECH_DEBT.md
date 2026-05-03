# TECH_DEBT.md — registro de deuda técnica

> Toda deuda detectada se registra acá. Un atajo no documentado es un bug futuro.
> Revisión obligatoria al cierre de cada fase.

---

## abiertos

### TD-007: Validación UC-006 mínimos relajada en POST /positions

- **detectado**: 2026-05-03, sprint Phase A backend MVP closure
- **contexto**: tras V016 los puestos persisten `herramientas`, `skills_tecnicas`, `skills_blandas`. PRODUCT.md UC-006 exige mínimo 1 herramienta, ≥3 skills técnicas, ≥2 skills blandas. `PuestoService.create` actualmente sólo valida los **máximos** (12/8) para mantener compatible el payload corto que envía el frontend de demo (no incluye los nuevos arrays). Los mínimos están encapsulados en `PuestoService.validateProfileForPublish` y serán llamados por el endpoint de transición `BORRADOR → ABIERTO` (Phase D).
- **impacto**: bajo. Permite drafts incompletos durante demo; UC-007 (challenge plan) cuando aterrice exigirá perfil completo de todas formas.
- **esfuerzo estimado**: S (≤2h) cuando el frontend tenga el formulario UC-006 completo.
- **propuesta de resolución**:
  1. Phase D agrega `POST /positions/{id}/publish` que invoca `validateProfileForPublish`.
  2. Cuando el formulario del SPA cubra los 4 grupos de UC-006, mover los mínimos a `PuestoService.create` directamente.
- **estado**: abierto

---

### TD-006: Modo demo del frontend con cobertura parcial de endpoints

- **detectado**: 2026-05-02, sprint MVP demo
- **contexto**: el modo demo automático (`frontend/src/mocks/*` + `services/api.ts`) cubre auth, orgs, positions, challenges, assignments, evaluations. **Actualización 2026-05**: se agregaron handlers demo para `GET /invitations/by-token/:token` y `POST /chat`. Siguen sin cubrirse en demo los endpoints académicos (`TD-004`). El flujo `/student/*` usa `studentCourseMock.ts`.
- **impacto**: bajo para la demo con hackathon flows; académico sigue mock aislado.
- **esfuerzo estimado**: residual S para paridad total con backend si se agregan más recursos.
- **propuesta de resolución**: mantener `docs/api-contract-status.md` actualizado; expandir mock solo cuando exista UI consumidora.
- **estado**: parcialmente mitigado (invitaciones + chat en mock)

---

### TD-005: `npm run lint` falla en todo el frontend (pre-re-theme)

- **detectado**: 2026-05-02, durante verificación DoD del re-theme
- **contexto**: reglas `react-hooks/immutability`, `no-case-declarations` en varias páginas, más avisos en `AuthContext`; no introducidos por cambios de estilo (solo clases Tailwind en páginas tocadas).
- **impacto**: bajo para demo si el equipo valida archivos tocados con ESLint puntual; medio para CI si se exige `eslint .` verde.
- **esfuerzo estimado**: S–M (reordenar loaders sobre `useEffect` o ajustar reglas ESLint de forma acotada).
- **estado**: abierto

---

### TD-004: Páginas académicas sin backend (nav estudiante)

- **detectado**: 2026-05-02, fase MVP / re-theme demo
- **contexto**: el prototipo de UI y rutas `/student/courses/*` contemplan curso, repositorio LLM y consultas IA mock-first. En navegación se ocultaron **Mi curso** y **Repositorio** para el demo; las rutas permanecen por URL directa.
- **impacto**: medio. La UI puede evolucionar en fase 2 cuando existan endpoints reales.
- **esfuerzo estimado**: M (4–8h) para conectar backend y volver a mostrar ítems en el menú.
- **propuesta de resolución**: implementar endpoints académicos en backend; des-ocultar enlaces en `Layout.tsx` (`getNavigationLinks` para `ESTUDIANTE`).
- **estado**: abierto

---

### TD-003: Demo-first security and test gaps in REST flow
- **detectado**: 2026-05-02, hackathon demo sprint
- **contexto**: se priorizó flujo demo funcional. `POST /api/v1/evaluations` quedó público por token y no se ejecutó suite completa de integración por bloqueo de Docker/Testcontainers en entorno actual.
- **impacto**: medio (aceptable para demo; no apto para producción sin hardening y pruebas)
- **esfuerzo estimado**: M (4 a 16h)
- **propuesta de resolución**:
  1. Reforzar autorización fina en evaluaciones/status/ranking.
  2. Agregar tests de integración de los 7 endpoints con entorno estable.
  3. Volver `POST /api/v1/evaluations` a JWT + token como validación adicional.
- **bloqueante para**: salida a producción
- **estado**: abierto

---

## en progreso

(vacío)

---

## resueltos

(vacío — al resolver, mover acá con fecha y PR de cierre)

---

## criterios de impacto

| nivel | criterio |
|-------|----------|
| alto | bloquea escalabilidad, seguridad o estabilidad; o cuesta caro revertir más tarde |
| medio | ralentiza desarrollo, degrada UX o aumenta costo (ej: tokens LLM) en casos no críticos |
| bajo | mejora estética o de mantenibilidad sin impacto funcional |

## criterios de esfuerzo

| talla | horas aproximadas |
|-------|-------------------|
| S | < 4 |
| M | 4 a 16 |
| L | 16 a 40 |
| XL | > 40 (probablemente requiere partirse) |
