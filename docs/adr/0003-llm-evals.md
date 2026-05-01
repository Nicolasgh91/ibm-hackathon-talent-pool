# ADR-0003: estrategia de evaluación de LLMs

## estado
`aceptado`
Fecha: YYYY-MM-DD
Autor: equipo fundador

---

## contexto

El comportamiento de un sistema basado en LLMs no se puede validar solo con tests unitarios y de integración tradicionales. Cambios aparentemente menores —un ajuste de prompt, un cambio de modelo, un cambio de chunk size— pueden mejorar o empeorar drásticamente la calidad de las respuestas sin que ningún test tradicional lo detecte.

Necesitamos una estrategia de **evals** (evaluaciones de calidad) que:
1. Detecte regresiones de calidad en cambios
2. Sea suficientemente rápida para correr al menos en pipelines diarios
3. Tenga una versión "smoke" para PRs (subset rápido)
4. No dependa de juicio humano para correr (aunque puede usar LLM-as-judge)
5. Sea reproducible y versionable

---

## decisión

### estructura
- Dataset de evaluación versionado en `backend/src/test/resources/evals/<capacidad>/`. Un YAML/JSON por capacidad LLM (ej: `summarizer.yaml`, `support-agent.yaml`).
- Cada caso de eval contiene: `id`, `input`, `expected` (puede ser exacto, regex, criterio textual o referencia a documentos esperados en RAG), `metadata` (prioridad, tipo).
- Suite ejecutable como tests JUnit en `src/test/java/.../evals/`, marcados con `@Tag("evals")`.

### tipos de evaluación
1. **Asserts deterministas**: cuando hay output estructurado (JSON, enum, número), comparación directa.
2. **Asserts semánticos**: similitud de embeddings entre output y `expected` con umbral.
3. **LLM-as-judge**: un modelo evalúa si el output cumple un criterio textual. Usado solo donde aporta y con prompts de juez versionados.
4. **Asserts de retrieval (RAG)**: validar que los documentos recuperados incluyen los esperados (precisión@k, recall@k).
5. **Asserts de seguridad**: validar que prompts adversariales no rompen guardrails.

### política de ejecución
- **PR**: subset "smoke" (~10-20 casos críticos por capacidad). Bloquea merge si falla.
- **Diario en main**: suite completa. Resultados publicados como comentario en commit y métrica histórica.
- **Pre-release (tag)**: suite completa con el modelo de producción real. Bloquea release si baja del umbral.

### umbrales
Cada capacidad define su umbral mínimo de pass-rate. Default: 90% en suite smoke, 85% en suite completa. Bajadas requieren ADR.

### versionado de prompts
- Cada prompt tiene una versión (semver: `1.0.0`)
- Cambios en prompts entran a evals con la versión nueva antes de mergearse
- Resultados se almacenan asociados a la versión: `prompt v1.2.0 + eval v3 → 92% pass`

### herramientas
- Implementación inicial: tests JUnit propios + utilities de comparación de embeddings + cliente OpenAI/Anthropic para juez (cuando se use)
- Posibilidad futura de integrar Ragas, DeepEval o Langfuse Evals: evaluar al cierre de fase 2 y crear ADR si se decide migrar

---

## alternativas consideradas

### alternativa A — sin evals automatizadas, solo QA manual
- **pros**: cero esfuerzo inicial
- **contras**: regresiones invisibles, no escala, contradice principio de tests inmutables y CI bloqueante
- **descartada**: la calidad LLM es central al producto

### alternativa B — usar Ragas o DeepEval desde el inicio
- **pros**: framework probado, métricas estándar
- **contras**: ambos son Python; requiere proceso aparte, complica el pipeline
- **descartada por ahora**: empezamos con suite propia en Java integrada al pipeline Maven; reevaluar al cierre de fase 2

### alternativa C — Langfuse self-hosted
- **pros**: tracing + evals + analytics en un solo lugar
- **contras**: pieza operativa más, curva de aprendizaje
- **descartada por ahora**: agregar como observabilidad LLM si la complejidad lo justifica

---

## consecuencias

### positivas
- Detección automática de regresiones de calidad
- Cambios de prompt seguros: nadie mergea sin pasar evals
- Histórico de calidad medible por modelo y por versión de prompt
- Suite siempre auditable y reproducible

### negativas
- Costo en tokens: la suite completa consume LLM real cuando se corre con modelo de producción
- Mantener el dataset de evaluación es trabajo continuo
- LLM-as-judge introduce variabilidad; mitigar con temperature 0 y prompts de juez bien especificados

### neutras
- Tiempo de CI aumenta en PRs (smoke) y diariamente (completa)

---

## implicancias para el código

- Carpeta `src/test/resources/evals/` con datasets versionados
- Carpeta `src/test/java/.../evals/` con runners por capacidad
- Profile Maven `evals-full` para ejecutar la suite completa (CI diario y pre-release)
- Variable de entorno `EVAL_MODEL_PROVIDER` para alternar entre Ollama (CI rápido) y proveedor cloud (CI nocturno y pre-release)
- Métricas Micrometer publicadas con `eval.passrate{capability="X", version="Y"}`

---

## referencias

- `ARCHITECTURE.md` §10 (testing)
- `ROADMAP.md` fase 1 (suite mínima de evals)
- ADR-0001, ADR-0002
- [LangChain4j evals-sandbox](https://github.com/langchain4j/evals-sandbox)
