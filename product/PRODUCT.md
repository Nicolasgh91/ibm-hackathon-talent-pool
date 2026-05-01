# PRODUCT.md — definición del producto

> Documento estable. Cambios requieren decisión explícita y entrada en `CHANGELOG.md`.
> Última revisión: 2026-05-01

---

## 1. problema

### 1.1 enunciado
La desconexión entre la formación académica y el mercado laboral genera sobrecarga operativa para educadores, desperdicio de recursos en el aprendizaje estudiantil y altos costos de inducción para empresas.

### 1.2 contexto y dolor actual

**Para instituciones educativas:**
- Los docentes dedican innumerables horas a la generación y corrección manual de trabajos prácticos y exámenes
- Los estudiantes realizan de forma aislada las mismas consultas a herramientas de IA, perdiendo la oportunidad de consolidar un aprendizaje colaborativo
- No existe un repositorio centralizado de conocimiento que optimice el uso de recursos de IA en el aula

**Para empresas:**
- Costos altísimos y tiempos de inducción prolongados para nuevos empleados
- Los candidatos ingresan con bases teóricas pero sin dominio práctico de herramientas y flujos de trabajo específicos
- Falta de mecanismos para pre-evaluar candidatos en entornos reales antes de la contratación
- Inversión significativa de presupuesto en capacitación que podría optimizarse

**Alternativas actuales:**
- Plataformas de evaluación técnica genéricas (HackerRank, Codility) que no personalizan desafíos ni reducen carga docente
- Sistemas LMS tradicionales (Moodle, Canvas) sin capacidades de IA para automatización
- Procesos manuales de reclutamiento con entrevistas técnicas costosas en tiempo
- Herramientas de IA individuales (ChatGPT, Claude) usadas de forma desorganizada

**Costo de no resolverlo:**
- Burnout docente por sobrecarga administrativa
- Desperdicio de tokens y recursos de IA por consultas duplicadas
- Tiempo promedio de inducción de 3-6 meses para nuevos empleados técnicos
- Costo estimado de USD 10,000-30,000 por empleado en capacitación inicial

### 1.3 evidencia
- Análisis del ecosistema educativo actual muestra que docentes dedican 40-60% de su tiempo a tareas administrativas repetitivas
- En una clase promedio de 40 alumnos, se realizan las mismas consultas a LLMs de forma individual, multiplicando costos innecesariamente
- Estudios de mercado indican que el 70% de las empresas tech reportan tiempos de inducción superiores a 3 meses
- El costo promedio de onboarding en la industria tech oscila entre USD 15,000-30,000 por empleado

---

## 2. propuesta de valor

### 2.1 enunciado
Para educadores y reclutadores que necesitan optimizar la evaluación técnica y reducir costos operativos, Talent Pool es una plataforma integral impulsada por IA que automatiza la generación y corrección de desafíos técnicos, centraliza el aprendizaje colaborativo y proporciona acceso a talento pre-evaluado, a diferencia de plataformas genéricas de evaluación que no personalizan contenido ni conectan directamente educación con inserción laboral.

### 2.2 diferenciadores

**1. Automatización inteligente end-to-end**
- Generación automática de desafíos técnicos personalizados mediante LLM (LangChain4j)
- Evaluación estática automatizada con retroalimentación detallada
- Rúbricas ocultas generadas por IA para evaluación objetiva

**2. Repositorio colectivo de conocimiento**
- Centralización de consultas a IA para evitar duplicación de recursos
- Aprendizaje colaborativo mediante compartición de resoluciones
- Optimización de costos de tokens LLM al unificar consultas de grupos

**3. Puente directo educación-empleo**
- Base de datos de talento pre-evaluado y capacitado
- Simulación de flujos de trabajo específicos de empresas
- Reducción drástica de tiempos y costos de inducción corporativa

**4. Evaluación contextualizada**
- Desafíos a libro abierto que simulan entornos reales de trabajo
- Personalización según tecnología, rol y nivel de seniority
- Análisis estático que evalúa lógica, eficiencia y buenas prácticas

---

## 3. usuario objetivo

### 3.1 segmento principal

**Segmento 1: Educadores / Docentes**
- Perfil: Profesores de carreras técnicas (programación, ingeniería de software, ciencia de datos)
- Contexto: Instituciones educativas (universidades, bootcamps, cursos técnicos)
- Nivel técnico: Intermedio a avanzado en tecnologías de enseñanza
- Frecuencia de uso: Semanal (creación de prácticas) y diaria (revisión de entregas)
- Dispositivo: Desktop/laptop, navegadores modernos

**Segmento 2: Estudiantes / Candidatos**
- Perfil: Estudiantes de carreras técnicas o profesionales junior buscando empleo
- Contexto: Aprendizaje activo, preparación para entrevistas técnicas
- Nivel técnico: Básico a intermedio, en proceso de formación
- Frecuencia de uso: Diaria a semanal (resolución de desafíos, consultas)
- Dispositivo: Desktop/laptop/tablet, navegadores modernos

**Segmento 3: Reclutadores / HR Tech**
- Perfil: Responsables de selección técnica en empresas de tecnología
- Contexto: Procesos de hiring, evaluación de candidatos, reducción de time-to-hire
- Nivel técnico: Básico (no requieren conocimiento técnico profundo)
- Frecuencia de uso: Semanal (creación de evaluaciones, revisión de candidatos)
- Dispositivo: Desktop/laptop, navegadores modernos

### 3.2 personas

**Persona 1: María - Profesora de Programación**
- Edad: 38 años
- Rol: Docente de Ingeniería en Sistemas
- Objetivos: Reducir tiempo en corrección manual, mejorar calidad de feedback a estudiantes, dedicar más tiempo a mentoría
- Frustraciones: Sobrecarga administrativa, corrección repetitiva de errores similares, falta de tiempo para innovación pedagógica
- Cita: "Paso más tiempo corrigiendo trabajos que enseñando. Necesito automatizar lo repetitivo para enfocarme en lo que realmente importa."

**Persona 2: Carlos - Estudiante de Desarrollo Web**
- Edad: 24 años
- Rol: Estudiante de bootcamp, buscando primer empleo tech
- Objetivos: Aprender prácticas reales de la industria, prepararse para entrevistas técnicas, conseguir empleo rápidamente
- Frustraciones: Desconexión entre teoría y práctica, no saber qué esperan las empresas, falta de feedback constructivo
- Cita: "Sé programar, pero no sé si lo hago como lo esperan en una empresa real. Necesito práctica con casos reales."

**Persona 3: Laura - Tech Recruiter**
- Edad: 32 años
- Rol: HR Manager en startup de 50 personas
- Objetivos: Reducir time-to-hire, encontrar candidatos que requieran menos onboarding, optimizar presupuesto de capacitación
- Frustraciones: Candidatos con CV impresionante pero sin skills prácticas, procesos de evaluación largos y costosos, alta rotación por mal fit técnico
- Cita: "Necesito candidatos que ya sepan usar nuestras herramientas. El onboarding de 3 meses es insostenible para nuestro ritmo."

### 3.3 antiusuarios

**Quiénes NO son usuarios objetivo:**
- Empresas sin procesos de hiring técnico (retail, servicios no-tech)
- Estudiantes de carreras no técnicas (humanidades, ciencias sociales sin componente tech)
- Instituciones educativas sin infraestructura digital básica
- Organizaciones que buscan evaluaciones presenciales exclusivamente
- Usuarios que requieren evaluación de soft skills únicamente (fuera de alcance MVP)
- Empresas que buscan soluciones de HR generalistas sin foco técnico

---

## 4. casos de uso

Listado completo. Cada UC vive en su propio archivo en `docs/uc/UC-NNN-slug.md`.

| ID | nombre | prioridad | fase | estado |
|----|--------|-----------|------|--------|
| UC-001 | Generar desafío técnico automatizado | crítica | MVP | pendiente |
| UC-002 | Resolver desafío y evaluar mediante análisis estático | crítica | MVP | pendiente |
| UC-003 | Visualizar ranking de candidatos y reportes de evaluación | crítica | MVP | pendiente |
| UC-004 | Acceder y seleccionar desafíos por parte del candidato | crítica | MVP | pendiente |
| UC-005 | Registrar usuario (reclutador/candidato) | alta | 2 | planificado |
| UC-006 | Iniciar sesión y gestión de perfiles | alta | 2 | planificado |
| UC-007 | Centralizar consultas a IA (repositorio colectivo) | alta | 2 | planificado |
| UC-008 | Generar guías de estudio personalizadas | media | 2 | planificado |
| UC-009 | Filtrar base de talento por tecnología y puntaje | media | 3 | planificado |
| UC-010 | Crear simuladores de flujos de trabajo empresariales | media | 3 | planificado |
| UC-011 | Emitir certificados digitales de finalización | baja | 4 | planificado |
| UC-012 | Sistema de suscripciones y pagos | baja | 4 | planificado |

**Prioridades**: 
- **crítica**: bloqueante para MVP/hackathon
- **alta**: necesario para fase 2 (módulo académico)
- **media**: expansión corporativa (fase 3)
- **baja**: monetización y certificación (fase 4)

**Descripción de casos de uso MVP:**

**UC-001**: Reclutador/docente ingresa parámetros de puesto (rol, tecnología, seniority) → Sistema genera desafío técnico + rúbrica oculta mediante LLM → Desafío queda disponible para candidatos

**UC-002**: Candidato visualiza desafío → Desarrolla solución en editor integrado → Sistema evalúa mediante análisis estático con IA → Retorna puntaje (0-100) y feedback detallado

**UC-003**: Reclutador accede a dashboard → Visualiza ranking de candidatos por desafío → Revisa código entregado y análisis de IA → Toma decisiones de selección

**UC-004**: Candidato accede a catálogo de desafíos → Filtra por tecnología/nivel → Selecciona desafío → Inicia proceso de evaluación

---

## 5. alcance

### 5.1 dentro de v1 (in) - MVP Hackathon

**Motor central de evaluación:**
- Generación automática de desafíos técnicos mediante LLM (LangChain4j)
- Rúbricas de evaluación ocultas generadas por IA
- Análisis estático automatizado de código/soluciones
- Retroalimentación detallada con puntaje numérico (0-100)

**Interfaces de usuario (4 pantallas):**
- Panel de inicio role-based (dashboard para reclutadores y candidatos)
- Formulario de generación de desafíos (reclutadores)
- Entorno de resolución con editor integrado (candidatos)
- Vista de resultados y ranking (ambos roles)

**Modelo de datos básico:**
- Entidades: Usuario, Puesto, Desafío, Evaluación
- Base de datos PostgreSQL con soporte JSONB
- Relaciones definidas según DER documentado

**Stack tecnológico:**
- Backend: Quarkus (Java)
- IA: LangChain4j para integración con LLM
- Frontend: React
- Base de datos: PostgreSQL con pgvector (preparado para RAG futuro)

### 5.2 fuera de v1, planificado (later)

**Fase 2 - Módulo académico y colaboración:**
- Sistema de autenticación completo (OAuth, roles granulares)
- Repositorio colectivo de consultas a IA
- Generación de guías de estudio personalizadas
- Compartición de resoluciones entre estudiantes
- Panel de administración para docentes

**Fase 3 - Expansión corporativa:**
- Base de datos de talento filtrable y buscable
- Simuladores de flujos de trabajo específicos por empresa
- Integración con ATS (Applicant Tracking Systems)
- Analytics avanzados de desempeño
- API pública para integraciones

**Fase 4 - Monetización y certificación:**
- Sistema de suscripciones (instituciones y empresas)
- Procesamiento de pagos
- Emisión automática de certificados digitales
- Sistema de recompensas y gamificación
- Marketplace de desafíos premium

### 5.3 explícitamente fuera (out)

**No se implementará (ni en futuro cercano):**
- Evaluación de soft skills o competencias no técnicas
- Videoconferencias integradas para entrevistas
- Ejecución real de código (sandbox con runtime) - solo análisis estático en MVP
- Integración con plataformas LMS externas (Moodle, Canvas)
- Aplicación móvil nativa (solo web responsive)
- Soporte multiidioma (solo español/inglés en v1)
- Evaluaciones presenciales o proctoring con cámara
- Gestión de nómina o contratos laborales
- Red social o mensajería entre usuarios

---

## 6. métricas de éxito

### 6.1 métricas de producto

| métrica | objetivo v1 | cómo se mide |
|---------|-------------|--------------|
| Desafíos generados exitosamente | ≥ 50 en hackathon | Contador en BD |
| Evaluaciones completadas | ≥ 100 en hackathon | Tabla EVALUACION |
| Tiempo promedio de generación de desafío | < 30 segundos | Logs de backend |
| Tiempo promedio de evaluación | < 10 segundos | Logs de LLM |
| Tasa de completitud de desafíos iniciados | ≥ 60% | Funnel analytics |
| Satisfacción de reclutadores (NPS) | ≥ 7/10 | Encuesta post-demo |
| Satisfacción de candidatos (NPS) | ≥ 7/10 | Encuesta post-evaluación |

### 6.2 métricas técnicas (SLOs)

| métrica | objetivo | umbral de alerta |
|---------|----------|------------------|
| Disponibilidad del sistema | 99% | < 95% |
| Latencia p95 endpoints CRUD | < 300 ms | > 500 ms |
| Latencia p95 generación de desafío (LLM) | < 8 s | > 15 s |
| Latencia p95 evaluación de código (LLM) | < 5 s | > 10 s |
| Time-to-first-token (si streaming) | < 2 s | > 4 s |
| Tasa de error 5xx | < 1% | > 2% |
| Tasa de error 4xx | < 5% | > 10% |
| Uso de memoria backend | < 512 MB | > 1 GB |
| Costo por 100 evaluaciones | < USD 5 | > USD 10 |

### 6.3 métricas específicas de LLM

| métrica | objetivo | cómo se mide |
|---------|----------|--------------|
| Calidad de desafíos generados (relevancia) | ≥ 85% | Evaluación manual de muestra (n=20) |
| Precisión de evaluaciones (vs evaluador humano) | ≥ 80% | Comparación con golden set (n=30) |
| Tasa de respuestas estructuradas válidas (JSON) | ≥ 98% | Guardrails de LangChain4j |
| Tasa de alucinación detectada | < 5% | Validación de rúbricas generadas |
| Consistencia de evaluación (mismo código) | ≥ 90% | Test de repetibilidad (n=10) |
| Tokens promedio por generación de desafío | < 2000 | Logs de LLM provider |
| Tokens promedio por evaluación | < 1500 | Logs de LLM provider |
| Tasa de timeout en llamadas LLM | < 2% | Monitoring de LangChain4j |

**Estrategia de evaluación (evals):**
- Suite de evals automatizados según ADR-0003
- Golden dataset con 30 pares (desafío, solución, puntaje esperado)
- Evaluación manual periódica de calidad de outputs
- A/B testing de prompts para optimización continua

---

## 7. supuestos y restricciones

### 7.1 supuestos

**Supuestos técnicos:**
- Los modelos de lenguaje (LLM) mantendrán disponibilidad ≥ 99% durante la hackathon
- La latencia de respuesta de LLMs será aceptable (< 10s) para la experiencia de usuario
- PostgreSQL con JSONB es suficiente para almacenar rúbricas y feedback sin necesidad de base de datos documental
- El análisis estático de código es suficiente para MVP; no se requiere ejecución real

**Supuestos de negocio:**
- Existe demanda real de educadores por automatización de evaluaciones
- Las empresas están dispuestas a considerar candidatos pre-evaluados por IA
- Los estudiantes confiarán en evaluaciones automatizadas si el feedback es de calidad
- El modelo de negocio B2B (instituciones/empresas) es viable para monetización futura

**Supuestos de usuario:**
- Los usuarios tienen acceso a internet estable y navegadores modernos
- Los candidatos están familiarizados con editores de código web
- Los reclutadores pueden describir requisitos técnicos de forma clara
- Los usuarios aceptan términos de uso de IA para procesamiento de datos

**Riesgo si son falsos:**
- Si LLMs no son confiables → Implementar fallbacks y caché de respuestas
- Si latencia es inaceptable → Implementar streaming y feedback progresivo
- Si usuarios no confían en IA → Agregar opción de revisión humana híbrida

### 7.2 restricciones

**Presupuesto:**
- Costo de tokens LLM: Estimado USD 50-100 para hackathon (500-1000 evaluaciones)
- Infraestructura: Tier gratuito de cloud providers (Render, Railway, Vercel)
- Sin presupuesto para servicios premium o APIs de pago

**Plazo:**
- Hackathon: 48-72 horas para MVP funcional
- Fase 2: 4-6 semanas post-hackathon
- Fase 3: 8-12 semanas
- Fase 4: 12-16 semanas

**Marco regulatorio:**
- Cumplimiento de GDPR/LGPD para datos personales de candidatos
- Transparencia en uso de IA según regulaciones emergentes de IA
- Almacenamiento de código y evaluaciones con consentimiento explícito
- No se pueden usar datos de evaluaciones para entrenar modelos propios sin consentimiento

**Compatibilidades obligatorias:**
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Dispositivos: Desktop y laptop (tablet opcional, móvil fuera de alcance)
- Resolución mínima: 1280x720
- Sin soporte para IE11 o navegadores legacy

**Soberanía de datos:**
- Los prompts y código de candidatos pueden procesarse por LLM providers externos (OpenAI, Anthropic, etc.)
- Consentimiento explícito requerido en términos de uso
- Opción futura de LLM on-premise para clientes enterprise con restricciones de datos
- Datos personales (email, nombre) almacenados en servidores con ubicación definida

**Limitaciones técnicas:**
- No hay ejecución real de código en MVP (solo análisis estático)
- Sin soporte para lenguajes compilados complejos (C++, Rust) en v1
- Foco inicial en lenguajes interpretados: Python, JavaScript, Java
- Sin integración con IDEs externos (VS Code, IntelliJ)

---

## 8. glosario

Términos del dominio con definición canónica. Uso obligatorio en código y documentación.

| término | definición |
|---------|------------|
| **Desafío** | Problema técnico generado automáticamente por IA que un candidato debe resolver. Incluye enunciado, contexto y criterios de evaluación ocultos. |
| **Rúbrica** | Conjunto de criterios de evaluación generados por IA y almacenados en formato JSONB. No visible para el candidato durante la resolución. |
| **Evaluación** | Proceso completo que incluye la resolución de un desafío por un candidato y su análisis automatizado por IA. Resultado: puntaje + feedback. |
| **Análisis estático** | Evaluación de código sin ejecución real, basada en lógica, estructura, eficiencia algorítmica y buenas prácticas. Realizado por LLM. |
| **Candidato** | Usuario que resuelve desafíos técnicos. Puede ser estudiante o profesional buscando empleo. Rol: CANDIDATO en BD. |
| **Reclutador** | Usuario que crea desafíos y revisa evaluaciones. Puede ser HR, tech lead o docente. Rol: RECLUTADOR en BD. |
| **Puesto** | Definición de un rol laboral o tema académico que incluye: título, tecnología principal y nivel de seniority. Base para generar desafíos. |
| **Seniority** | Nivel de experiencia técnica: Junior, Semi-Senior, Senior. Determina complejidad del desafío generado. |
| **Repositorio colectivo** | (Fase 2) Base de conocimiento compartida donde se centralizan consultas a IA y resoluciones de estudiantes de una misma clase. |
| **Sandbox** | Entorno de resolución aislado donde el candidato escribe código. En MVP: editor de texto. Futuro: entorno de ejecución real. |
| **Feedback** | Retroalimentación detallada generada por IA tras evaluar una solución. Incluye: puntos fuertes, áreas de mejora, sugerencias específicas. |
| **LLM** | Large Language Model. Motor de IA usado para generar desafíos y evaluar código. Integrado vía LangChain4j. |
| **Guardrails** | Mecanismos de validación de LangChain4j que aseguran respuestas estructuradas (JSON) y detectan outputs inválidos. |
| **Golden set** | Conjunto de datos de referencia con pares (desafío, solución, puntaje esperado) usado para evaluar precisión del sistema. |
| **Evals** | Suite de evaluaciones automatizadas que miden calidad, precisión y consistencia de outputs del LLM. Ver ADR-0003. |
| **Time-to-first-token** | Métrica de latencia: tiempo desde request hasta primer byte de respuesta del LLM en modo streaming. |
| **RAG** | Retrieval-Augmented Generation. Técnica para mejorar respuestas de LLM con contexto específico. Planificado para Fase 2 con pgvector. |
| **Prompt** | Instrucción estructurada enviada al LLM para generar desafíos o evaluar código. Incluye contexto, formato esperado y restricciones. |
| **Token** | Unidad de procesamiento de LLM. Aproximadamente 0.75 palabras en español. Base para cálculo de costos de API. |
| **JSONB** | Tipo de dato de PostgreSQL para almacenar JSON binario. Usado para rúbricas y feedback estructurado. |
| **UC** | Use Case (Caso de Uso). Documentado en formato estándar en `docs/uc/UC-NNN-slug.md`. |
| **ADR** | Architecture Decision Record. Decisiones técnicas documentadas en `docs/adr/NNNN-slug.md`. |
| **MVP** | Minimum Viable Product. Versión mínima funcional para validar propuesta de valor en hackathon. |
| **DoD** | Definition of Done. Criterios de aceptación para considerar una fase completada. Ver ROADMAP.md. |

---

## 9. referencias

- **Documentación técnica**: Ver `ARCHITECTURE.md` para decisiones de stack y patrones
- **Modelo de datos**: Ver `DATABASE.md` para esquema completo de 20 tablas con constraints, índices y migraciones
- **Roadmap**: Ver `ROADMAP.md` para fases detalladas y Definition of Done
- **Casos de uso**: Ver `docs/uc/UC-001.md` a `UC-012.md` para flujos detallados (MVP: UC-001 a UC-004)
- **ADRs**: Ver `docs/adr/` para decisiones arquitectónicas (stack, RAG, evals)
- **Pitch completo**: Ver `Talent pool app.md` para contexto de negocio extendido

---

**Fin del documento PRODUCT.md**
