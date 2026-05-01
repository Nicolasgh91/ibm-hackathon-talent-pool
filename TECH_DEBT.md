# TECH_DEBT.md — registro de deuda técnica

> Toda deuda detectada se registra acá. Un atajo no documentado es un bug futuro.
> Revisión obligatoria al cierre de cada fase.

---

## abiertos

### TD-NNN: título corto
- **detectado**: YYYY-MM-DD, fase N, PR #NNN
- **contexto**: qué se hizo y por qué se tomó el atajo
- **impacto**: alto / medio / bajo (con criterio: a quién afecta y cuándo)
- **esfuerzo estimado**: horas / talla (S, M, L, XL)
- **propuesta de resolución**: cómo se resolvería idealmente
- **bloqueante para**: fase N / feature X / nada
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
