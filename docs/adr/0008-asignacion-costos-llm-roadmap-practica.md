# ADR-0008: asignación de costos LLM del roadmap de práctica (UC-024)

## estado

`aceptado`

Fecha: 2026-05-02

Autor: equipo producto / arquitectura

---

## contexto

UC-024 (*complete practice roadmap as candidate*) ejecuta el modelo de lenguaje por cada módulo entregado para **retroalimentación formativa** (`evaluador_modulo_roadmap`), registrando filas en `llamadas_llm`.

El producto ya establece que esas llamadas **no** descuentan del presupuesto o cuota LLM atribuida al reclutador u organización que publicó el puesto: el reclutador no “paga” la práctica voluntaria del candidato.

Queda abierta la pregunta de **quién absorbe el costo marginal** de esas inferencias: la plataforma, el candidato (modelo freemium/pago), la organización en planes futuros, o una combinación. Sin decisión explícita, ingeniería y finanzas no pueden implementar límites de uso, facturación ni alertas de costo coherentes.

Esta decisión es **ortogonal** al proveedor LLM y tarifas unitarias (ver **ADR-0007** cuando esté documentado): aquí solo se define **asignación contable y de producto** del gasto ya cuantificado.

---

## decisión

1. **Fase actual (MVP / crecimiento)**: la **plataforma subsidia al 100%** el costo LLM de UC-024 para candidatos identificados (sesión iniciada). Objetivo: maximizar uso del roadmap de práctica como diferenciador y embudo de calidad, sin fricción de pago en el flujo del candidato.

2. **Presupuesto reclutador**: permanece **intacto**; las `llamadas_llm` de UC-024 se etiquetan en aplicación como `contexto_costo=ROADMAP_PRACTICA_CANDIDATO` (o campo equivalente en modelo de datos) y **no** incrementan contadores de cuota de la organización del puesto.

3. **Candidato anónimo** (si una política de rol lo permite): mismo subsidio de plataforma con **límites anti-abuso** más estrictos (rate limit por IP / fingerprint / sesión), definidos en implementación.

4. **Post-MVP**: se puede introducir **créditos opcionales** financiados por organización (planes ENTERPRISE) para “patrocinar” mayor volumen de práctica o prioridad; eso será un ADR o extensión comercial posterior sin invalidar el subsidio base para el candidato final.

---

## alternativas consideradas

### alternativa A — cargo al reclutador por módulo practicado

- pros: alinea incentivos con uso real del pipeline.
- contras: contradice el valor de producto “práctica gratuita antes de aplicar”; desincentiva publicar roadmaps ricos.
- descartada para la fase actual.

### alternativa B — pago directo del candidato (pay-per-feedback)

- pros: costo variable cubierto por quien recibe el valor.
- contras: fricción alta; reduce adopción del diferenciador principal.
- descartada para MVP; reevaluar solo si el costo marginal fuera insostenible.

### alternativa C — cupo mensual gratis + excedente pagadero por candidato

- pros: control de gasto predecible.
- contras: complejidad de billing y UX; overhead antes de validar product-market fit.
- pospuesta.

---

## consecuencias

### positivas

- Mensaje de producto simple: práctica formativa sin cargo al candidato en la fase de adopción.
- Separación clara entre costos de **evaluación competitiva** (organización / invitación) y **práctica formativa** (subsidio plataforma).

### negativas

- Costo LLM de UC-024 escala con uso; requiere monitorización de gasto agregado y límites de abuso.

### neutras

- La decisión no fija proveedor ni modelo; solo quién “paga” en reporting interno.

---

## implicancias para el código

- Toda `llamada_llm` originada por UC-024 debe llevar metadata que permita **excluir** el gasto de dashboards de cuota por organización reclutadora.
- Métricas de negocio: series separadas “LLM roadmap práctica (subsidio plataforma)” vs “LLM evaluación / plan reclutador”.
- Futura integración con billing: campo preparado para `fuente_financiamiento` o enum equivalente sin migración conceptual nueva.

---

## referencias

- UCs: UC-023 (generación roadmap), UC-024 (completar práctica), UC-025 (vista reclutador).
- ADR-0003: estrategia de evaluación de prompts LLM.
- ADR-0007: proveedor LLM y costo unitario en producción (prerrequisito para convertir tokens en USD).
- `product/PRODUCT.md` § UC-024 (NFRs de costo por módulo como **objetivo**, no asignación).
