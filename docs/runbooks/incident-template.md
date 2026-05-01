# Runbook: nombre del incidente

> Plantilla. Copiar a `docs/runbooks/<slug>.md`.
> Cada alerta crítica debe tener un runbook asociado.

---

## metadatos

| campo | valor |
|-------|-------|
| slug | ... |
| severidad por defecto | SEV-1 / SEV-2 / SEV-3 |
| sistema afectado | ... |
| última revisión | YYYY-MM-DD |
| owner | ... |

---

## 1. síntomas

Cómo se manifiesta el problema para el usuario y/o en la observabilidad.

- Síntoma 1
- Síntoma 2

---

## 2. detección

Cómo se detecta automáticamente.

- Alerta: nombre y umbral
- Dashboards relevantes: links

---

## 3. impacto

Qué se rompe y para quién.

- Funcionalidades afectadas
- Usuarios afectados (estimación)
- Riesgo de pérdida de datos: sí/no
- Costo monetario (si aplica, ej: spike de tokens LLM)

---

## 4. diagnóstico

Pasos para confirmar la causa.

```bash
# comandos concretos a ejecutar
```

Preguntas a responder:
- ¿Es un problema de la app o de una dependencia?
- ¿Es regional o global?
- ¿Empezó con un deploy reciente?

---

## 5. mitigación

Acciones para reducir el impacto antes de la corrección definitiva.

```bash
# comandos
```

---

## 6. resolución

Acciones para resolver definitivamente.

1. Paso 1
2. Paso 2

---

## 7. verificación

Cómo confirmar que el problema se resolvió.

- Métrica X bajo umbral durante N minutos
- Endpoint /q/health/ready en verde
- Test sintético en verde

---

## 8. comunicación

Plantilla de mensaje para statuspage y/o stakeholders.

```
Estamos investigando un problema con [funcionalidad].
Hora de inicio: ...
Impacto: ...
Próxima actualización: ...
```

---

## 9. post-mortem

Si el incidente fue SEV-1 o SEV-2, se escribe un post-mortem en `docs/postmortems/`.

Mínimos: cronología, causa raíz, qué funcionó, qué no, acciones de prevención.
