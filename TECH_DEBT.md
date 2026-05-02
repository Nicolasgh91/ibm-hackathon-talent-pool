# TECH_DEBT.md — registro de deuda técnica

> Toda deuda detectada se registra acá. Un atajo no documentado es un bug futuro.
> Revisión obligatoria al cierre de cada fase.

---

## abiertos

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
