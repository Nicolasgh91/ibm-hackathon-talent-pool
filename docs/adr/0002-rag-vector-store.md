# ADR-0002: estrategia de RAG y vector store

## estado
`aceptado` (revisar antes de fase 2 si la app no usa RAG)
Fecha: YYYY-MM-DD
Autor: equipo fundador

---

## contexto

La aplicación incluye (o puede incluir) capacidades que requieren acceder a un corpus propio de información durante la generación de respuestas: documentos del usuario, base de conocimiento interna, normativa, FAQs, etc. Esto se conoce como Retrieval-Augmented Generation (RAG).

Necesitamos definir:
1. Dónde almacenamos los embeddings
2. Qué modelo de embeddings usamos
3. Qué patrón de retrieval seguimos
4. Cómo verificamos la calidad del retrieval

Restricciones:
- Operación simple en etapas tempranas (un solo motor de datos si es posible)
- Soporte para búsqueda híbrida (vectorial + texto) deseable
- Bajo costo de embeddings en desarrollo y QA
- Trazabilidad de citas: el sistema debe poder mostrar de qué documento proviene cada porción de la respuesta

---

## decisión

### vector store
**pgvector** como extensión de PostgreSQL 16, en la misma instancia que la BD relacional principal en etapas tempranas.

### modelo de embeddings
- **Desarrollo y CI**: modelo embebido en proceso `all-MiniLM-L6-v2` (vía `langchain4j-embeddings-all-minilm-l6-v2`). Costo cero, sin red.
- **Producción**: a definir entre OpenAI `text-embedding-3-small` o un modelo Cohere/Voyage. Decisión separada en ADR posterior cuando midamos calidad real con la suite de evals.

### patrón
- Documentos partidos en chunks con `DocumentSplitters` de LangChain4j, parametrizado por tipo de documento
- Almacenamiento con `EmbeddingStoreIngestor`
- Retrieval con `EmbeddingStoreContentRetriever`, parametrizado por k (número de resultados) y umbral de similitud
- Búsqueda híbrida: combinar vectorial con full-text search de Postgres (`tsvector`) cuando aporte
- Cada chunk almacenado conserva metadata: `document_id`, `chunk_index`, `source_url`, `created_at`

### trazabilidad de citas
- Las respuestas generadas con RAG incluyen referencias a los chunks usados
- En el output se exponen IDs de chunks; el frontend los mapea a documentos visibles para el usuario
- Tests de retrieval verifican que las citas son verificables (existen los chunks referenciados)

### organización en código
- `infrastructure/ai/retrieval/`: retrievers tipados por dominio
- `infrastructure/ai/ingestion/`: pipelines de ingestion por tipo de documento
- Tabla `embeddings` con esquema dedicado (`ai`) en Postgres

---

## alternativas consideradas

### alternativa A — Qdrant (servicio aparte)
- **pros**: especializado en búsqueda vectorial, performance excelente, filtros sofisticados
- **contras**: una pieza operativa más, sincronización con Postgres, costo adicional
- **descartada por ahora**: pgvector es suficiente hasta varios millones de embeddings; migrar a Qdrant si se vuelve necesario es un cambio acotado

### alternativa B — Weaviate
- **pros**: muchos features integrados (clasificación, multi-tenant)
- **contras**: complejidad operativa alta, modelo de datos propio
- **descartada**: overkill para nuestra etapa

### alternativa C — solo full-text search de Postgres
- **pros**: no requiere embeddings ni dependencias LLM nuevas
- **contras**: falla en consultas semánticas y sinónimos
- **descartada**: la calidad esperada de las respuestas requiere búsqueda semántica

### alternativa D — embeddings con OpenAI también en dev
- **pros**: paridad con producción
- **contras**: costo en CI (cada test de retrieval cuesta), latencia, dependencia externa para tests
- **descartada**: queremos tests rápidos y deterministas; usamos modelo local en CI

---

## consecuencias

### positivas
- Una sola pieza operativa (Postgres) en etapas tempranas
- Embeddings locales en dev = velocidad de iteración alta y costo cero
- Control total sobre el formato y trazabilidad de chunks
- Backups y replicación heredados de la operación normal de Postgres

### negativas
- Si el corpus crece a decenas de millones de chunks, pgvector puede degradarse y necesitar migración
- Diferencia de calidad entre embeddings de dev (MiniLM) y prod (mejor modelo) puede dar sorpresas: la suite de evals debe correr al menos una vez con el modelo de prod antes de release
- Búsqueda híbrida requiere tuning de pesos entre vectorial y full-text

### neutras
- Necesitamos un script de re-embedding para cuando cambie el modelo de embeddings de prod

---

## implicancias para el código

- Migración Flyway que crea esquema `ai` y tabla `embeddings` con columna `vector(384)` o la dimensión que corresponda al modelo
- Bean CDI `EmbeddingModel` y `EmbeddingStore` configurables por perfil
- Suite de tests de retrieval en `tests/integration/retrieval/`
- Métrica `rag.retrieval.precision` calculada sobre dataset de validación

---

## referencias

- `ARCHITECTURE.md` §2.1 (vector store), §6 (capa LLM)
- ADR-0003: estrategia de evaluación de LLMs
- [pgvector](https://github.com/pgvector/pgvector)
- [LangChain4j RAG](https://docs.langchain4j.dev/tutorials/rag)
