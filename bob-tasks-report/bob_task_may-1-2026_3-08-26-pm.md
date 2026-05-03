**User:**

<task>
Analyze the proyect product/ARCHITECTURE.md, product/PRODUCT.md specifications, product/rf-rnf.md and generate the project roadmap. Use this template as reference product/ROADMAP.md
</task>
<environment_details>
# VSCode Visible Files
product/ROADMAP.md

# VSCode Open Tabs
product/Talent pool app.md,product/PRODUCT.md,product/ARCHITECTURE.md,README.md,product/ROADMAP.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T17:59:47.135Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>


# Current Workspace Directory (/home/nicogabh/projects/hackathon) Files
CHANGELOG.md
CONTRIBUTING.md
README.md
sonar-project.properties
TECH_DEBT.md
docs/
docs/{adr,uc,runbooks}/
docs/adr/
docs/adr/0000-template.md
docs/adr/0001-stack-base.md
docs/adr/0002-rag-vector-store.md
docs/adr/0003-llm-evals.md
docs/runbooks/
docs/runbooks/incident-template.md
docs/uc/
docs/uc/UC-001-registrar-usuario.md
docs/uc/UC-template.md
product/
product/ARCHITECTURE.md
product/PRODUCT.md
product/rf-rnf.md
product/ROADMAP.md
product/Talent pool app.md
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll analyze the project specifications and generate a comprehensive roadmap. Let me start by reading the relevant documents.

<read_file>
<args>
<file>
<path>product/ARCHITECTURE.md</path>
</file>
<file>
<path>product/PRODUCT.md</path>
</file>
<file>
<path>product/rf-rnf.md</path>
</file>
<file>
<path>product/ROADMAP.md</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 4 files] Result:
<files>
<file><path>product/ARCHITECTURE.md</path><file_outline>File: ARCHITECTURE.md (1029 lines)

String: # ARCHITECTURE.md — arquitectura del sistema (lines 1-1029)
  String: ## 1. visión general (lines 9-88)
    String: ### 1.1 estilo arquitectónico (lines 11-14)
    String: ### 1.2 diagrama C4 — nivel 1 (contexto) (lines 15-35)
    String: ### 1.3 diagrama C4 — nivel 2 (contenedores) (lines 36-88)
  String: ## 2. stack tecnológico (cerrado) (lines 89-146)
    String: ### 2.1 backend (Quarkus + LangChain4j) (lines 93-116)
    String: ### 2.2 frontend (lines 117-133)
    String: ### 2.3 infraestructura y operación (lines 134-146)
  String: ## 3. estructura de carpetas (obligatoria) (lines 147-311)
  String: ## 4. modelo de datos (lines 312-521)
    String: ### 4.1 entidades canónicas (lines 314-438)
      String: #### Tabla USUARIO (lines 365-372)
      String: #### Tabla PUESTO (lines 373-380)
      String: #### Tabla DESAFIO (lines 381-413)
      String: #### Tabla EVALUACION (lines 414-438)
    String: ### 4.2 reglas de integridad (lines 439-454)
    String: ### 4.3 migraciones (Flyway) (lines 455-521)
  String: ## 5. API (lines 522-695)
    String: ### 5.1 estilo (lines 524-526)
    String: ### 5.2 contrato (lines 527-532)
    String: ### 5.3 endpoints MVP (lines 533-652)
      String: #### Gestión de Puestos y Desafíos (UC-001) (lines 535-567)
      String: #### Resolución y Evaluación (UC-002) (lines 568-599)
      String: #### Consulta de Rankings (UC-003) (lines 600-634)
      String: #### Catálogo de Desafíos (UC-004) (lines 635-652)
    String: ### 5.4 convenciones (lines 653-689)
    String: ### 5.5 endpoints LLM (streaming) (lines 690-695)
  String: ## 6. capa LLM (LangChain4j) (lines 696-834)
    String: ### 6.1 organización (lines 698-708)
    String: ### 6.2 prompts principales (lines 709-777)
      String: #### Prompt: Generar Desafío (UC-001) (lines 711-741)
      String: #### Prompt: Evaluar Código (UC-002) (lines 742-777)
    String: ### 6.3 reglas (lines 778-790)
    String: ### 6.4 guardrails (lines 791-801)
    String: ### 6.5 configuración (application.yml) (lines 802-834)
  String: ## 7. autenticación y autorización (lines 835-858)
    String: ### 7.1 autenticación (fase 2) (lines 837-842)
    String: ### 7.2 autorización (fase 2) (lines 843-850)
    String: ### 7.3 secretos (lines 851-858)
  String: ## 8. seguridad transversal (lines 859-881)
  String: ## 9. observabilidad (lines 882-922)
    String: ### 9.1 logs (lines 884-889)
    String: ### 9.2 métricas (Micrometer) (lines 890-906)
    String: ### 9.3 trazas (OpenTelemetry) (lines 907-911)
    String: ### 9.4 alertas (lines 912-915)
    String: ### 9.5 endpoints de salud (lines 916-922)
  String: ## 10. estrategia de testing (lines 923-978)
    String: ### 10.1 pirámide (lines 925-932)
    String: ### 10.2 reglas (lines 933-940)
    String: ### 10.3 testing con Quarkus (lines 941-946)
    String: ### 10.4 CI (lines 947-962)
    String: ### 10.5 análisis estático de calidad (lines 963-978)
  String: ## 11. presupuesto de performance (lines 979-997)
  String: ## 12. estrategia de despliegue (lines 998-1019)
    String: ### 12.1 entornos (lines 1000-1004)
    String: ### 12.2 pipeline (lines 1005-1009)
    String: ### 12.3 imágenes (lines 1010-1014)
    String: ### 12.4 rollback (lines 1015-1019)
  String: ## 13. decisiones pendientes (lines 1020-1029)
</file_outline>
<notice>This file is large (1028 lines). You will use the following strategy to understand this file:
- Inform the user you are going to use large file strategy, to efficiently understand the file
- Use the file_outline provided to get an overview of the file structure to help decide next action. This is not the full file. It is not the full depth of the contents.
- If you read the file, use precise file reads with line ranges for specific sections of interest
- Consider if other commands/tools are better suited for extracting information from that file type
- Use ask_followup_question tool if needed to identify the best next action
</notice></file>
<file><path>product/PRODUCT.md</path>
<content lines="1-396">
  1 | # PRODUCT.md — definición del producto
  2 | 
  3 | > Documento estable. Cambios requieren decisión explícita y entrada en `CHANGELOG.md`.
  4 | > Última revisión: 2026-05-01
  5 | 
  6 | ---
  7 | 
  8 | ## 1. problema
  9 | 
 10 | ### 1.1 enunciado
 11 | La desconexión entre la formación académica y el mercado laboral genera sobrecarga operativa para educadores, desperdicio de recursos en el aprendizaje estudiantil y altos costos de inducción para empresas.
 12 | 
 13 | ### 1.2 contexto y dolor actual
 14 | 
 15 | **Para instituciones educativas:**
 16 | - Los docentes dedican innumerables horas a la generación y corrección manual de trabajos prácticos y exámenes
 17 | - Los estudiantes realizan de forma aislada las mismas consultas a herramientas de IA, perdiendo la oportunidad de consolidar un aprendizaje colaborativo
 18 | - No existe un repositorio centralizado de conocimiento que optimice el uso de recursos de IA en el aula
 19 | 
 20 | **Para empresas:**
 21 | - Costos altísimos y tiempos de inducción prolongados para nuevos empleados
 22 | - Los candidatos ingresan con bases teóricas pero sin dominio práctico de herramientas y flujos de trabajo específicos
 23 | - Falta de mecanismos para pre-evaluar candidatos en entornos reales antes de la contratación
 24 | - Inversión significativa de presupuesto en capacitación que podría optimizarse
 25 | 
 26 | **Alternativas actuales:**
 27 | - Plataformas de evaluación técnica genéricas (HackerRank, Codility) que no personalizan desafíos ni reducen carga docente
 28 | - Sistemas LMS tradicionales (Moodle, Canvas) sin capacidades de IA para automatización
 29 | - Procesos manuales de reclutamiento con entrevistas técnicas costosas en tiempo
 30 | - Herramientas de IA individuales (ChatGPT, Claude) usadas de forma desorganizada
 31 | 
 32 | **Costo de no resolverlo:**
 33 | - Burnout docente por sobrecarga administrativa
 34 | - Desperdicio de tokens y recursos de IA por consultas duplicadas
 35 | - Tiempo promedio de inducción de 3-6 meses para nuevos empleados técnicos
 36 | - Costo estimado de USD 10,000-30,000 por empleado en capacitación inicial
 37 | 
 38 | ### 1.3 evidencia
 39 | - Análisis del ecosistema educativo actual muestra que docentes dedican 40-60% de su tiempo a tareas administrativas repetitivas
 40 | - En una clase promedio de 40 alumnos, se realizan las mismas consultas a LLMs de forma individual, multiplicando costos innecesariamente
 41 | - Estudios de mercado indican que el 70% de las empresas tech reportan tiempos de inducción superiores a 3 meses
 42 | - El costo promedio de onboarding en la industria tech oscila entre USD 15,000-30,000 por empleado
 43 | 
 44 | ---
 45 | 
 46 | ## 2. propuesta de valor
 47 | 
 48 | ### 2.1 enunciado
 49 | Para educadores y reclutadores que necesitan optimizar la evaluación técnica y reducir costos operativos, Talent Pool es una plataforma integral impulsada por IA que automatiza la generación y corrección de desafíos técnicos, centraliza el aprendizaje colaborativo y proporciona acceso a talento pre-evaluado, a diferencia de plataformas genéricas de evaluación que no personalizan contenido ni conectan directamente educación con inserción laboral.
 50 | 
 51 | ### 2.2 diferenciadores
 52 | 
 53 | **1. Automatización inteligente end-to-end**
 54 | - Generación automática de desafíos técnicos personalizados mediante LLM (LangChain4j)
 55 | - Evaluación estática automatizada con retroalimentación detallada
 56 | - Rúbricas ocultas generadas por IA para evaluación objetiva
 57 | 
 58 | **2. Repositorio colectivo de conocimiento**
 59 | - Centralización de consultas a IA para evitar duplicación de recursos
 60 | - Aprendizaje colaborativo mediante compartición de resoluciones
 61 | - Optimización de costos de tokens LLM al unificar consultas de grupos
 62 | 
 63 | **3. Puente directo educación-empleo**
 64 | - Base de datos de talento pre-evaluado y capacitado
 65 | - Simulación de flujos de trabajo específicos de empresas
 66 | - Reducción drástica de tiempos y costos de inducción corporativa
 67 | 
 68 | **4. Evaluación contextualizada**
 69 | - Desafíos a libro abierto que simulan entornos reales de trabajo
 70 | - Personalización según tecnología, rol y nivel de seniority
 71 | - Análisis estático que evalúa lógica, eficiencia y buenas prácticas
 72 | 
 73 | ---
 74 | 
 75 | ## 3. usuario objetivo
 76 | 
 77 | ### 3.1 segmento principal
 78 | 
 79 | **Segmento 1: Educadores / Docentes**
 80 | - Perfil: Profesores de carreras técnicas (programación, ingeniería de software, ciencia de datos)
 81 | - Contexto: Instituciones educativas (universidades, bootcamps, cursos técnicos)
 82 | - Nivel técnico: Intermedio a avanzado en tecnologías de enseñanza
 83 | - Frecuencia de uso: Semanal (creación de prácticas) y diaria (revisión de entregas)
 84 | - Dispositivo: Desktop/laptop, navegadores modernos
 85 | 
 86 | **Segmento 2: Estudiantes / Candidatos**
 87 | - Perfil: Estudiantes de carreras técnicas o profesionales junior buscando empleo
 88 | - Contexto: Aprendizaje activo, preparación para entrevistas técnicas
 89 | - Nivel técnico: Básico a intermedio, en proceso de formación
 90 | - Frecuencia de uso: Diaria a semanal (resolución de desafíos, consultas)
 91 | - Dispositivo: Desktop/laptop/tablet, navegadores modernos
 92 | 
 93 | **Segmento 3: Reclutadores / HR Tech**
 94 | - Perfil: Responsables de selección técnica en empresas de tecnología
 95 | - Contexto: Procesos de hiring, evaluación de candidatos, reducción de time-to-hire
 96 | - Nivel técnico: Básico (no requieren conocimiento técnico profundo)
 97 | - Frecuencia de uso: Semanal (creación de evaluaciones, revisión de candidatos)
 98 | - Dispositivo: Desktop/laptop, navegadores modernos
 99 | 
100 | ### 3.2 personas
101 | 
102 | **Persona 1: María - Profesora de Programación**
103 | - Edad: 38 años
104 | - Rol: Docente de Ingeniería en Sistemas
105 | - Objetivos: Reducir tiempo en corrección manual, mejorar calidad de feedback a estudiantes, dedicar más tiempo a mentoría
106 | - Frustraciones: Sobrecarga administrativa, corrección repetitiva de errores similares, falta de tiempo para innovación pedagógica
107 | - Cita: "Paso más tiempo corrigiendo trabajos que enseñando. Necesito automatizar lo repetitivo para enfocarme en lo que realmente importa."
108 | 
109 | **Persona 2: Carlos - Estudiante de Desarrollo Web**
110 | - Edad: 24 años
111 | - Rol: Estudiante de bootcamp, buscando primer empleo tech
112 | - Objetivos: Aprender prácticas reales de la industria, prepararse para entrevistas técnicas, conseguir empleo rápidamente
113 | - Frustraciones: Desconexión entre teoría y práctica, no saber qué esperan las empresas, falta de feedback constructivo
114 | - Cita: "Sé programar, pero no sé si lo hago como lo esperan en una empresa real. Necesito práctica con casos reales."
115 | 
116 | **Persona 3: Laura - Tech Recruiter**
117 | - Edad: 32 años
118 | - Rol: HR Manager en startup de 50 personas
119 | - Objetivos: Reducir time-to-hire, encontrar candidatos que requieran menos onboarding, optimizar presupuesto de capacitación
120 | - Frustraciones: Candidatos con CV impresionante pero sin skills prácticas, procesos de evaluación largos y costosos, alta rotación por mal fit técnico
121 | - Cita: "Necesito candidatos que ya sepan usar nuestras herramientas. El onboarding de 3 meses es insostenible para nuestro ritmo."
122 | 
123 | ### 3.3 antiusuarios
124 | 
125 | **Quiénes NO son usuarios objetivo:**
126 | - Empresas sin procesos de hiring técnico (retail, servicios no-tech)
127 | - Estudiantes de carreras no técnicas (humanidades, ciencias sociales sin componente tech)
128 | - Instituciones educativas sin infraestructura digital básica
129 | - Organizaciones que buscan evaluaciones presenciales exclusivamente
130 | - Usuarios que requieren evaluación de soft skills únicamente (fuera de alcance MVP)
131 | - Empresas que buscan soluciones de HR generalistas sin foco técnico
132 | 
133 | ---
134 | 
135 | ## 4. casos de uso
136 | 
137 | Listado completo. Cada UC vive en su propio archivo en `docs/uc/UC-NNN-slug.md`.
138 | 
139 | | ID | nombre | prioridad | fase | estado |
140 | |----|--------|-----------|------|--------|
141 | | UC-001 | Generar desafío técnico automatizado | crítica | MVP | pendiente |
142 | | UC-002 | Resolver desafío y evaluar mediante análisis estático | crítica | MVP | pendiente |
143 | | UC-003 | Visualizar ranking de candidatos y reportes de evaluación | crítica | MVP | pendiente |
144 | | UC-004 | Acceder y seleccionar desafíos por parte del candidato | crítica | MVP | pendiente |
145 | | UC-005 | Registrar usuario (reclutador/candidato) | alta | 2 | planificado |
146 | | UC-006 | Iniciar sesión y gestión de perfiles | alta | 2 | planificado |
147 | | UC-007 | Centralizar consultas a IA (repositorio colectivo) | alta | 2 | planificado |
148 | | UC-008 | Generar guías de estudio personalizadas | media | 2 | planificado |
149 | | UC-009 | Filtrar base de talento por tecnología y puntaje | media | 3 | planificado |
150 | | UC-010 | Crear simuladores de flujos de trabajo empresariales | media | 3 | planificado |
151 | | UC-011 | Emitir certificados digitales de finalización | baja | 4 | planificado |
152 | | UC-012 | Sistema de suscripciones y pagos | baja | 4 | planificado |
153 | 
154 | **Prioridades**: 
155 | - **crítica**: bloqueante para MVP/hackathon
156 | - **alta**: necesario para fase 2 (módulo académico)
157 | - **media**: expansión corporativa (fase 3)
158 | - **baja**: monetización y certificación (fase 4)
159 | 
160 | **Descripción de casos de uso MVP:**
161 | 
162 | **UC-001**: Reclutador/docente ingresa parámetros de puesto (rol, tecnología, seniority) → Sistema genera desafío técnico + rúbrica oculta mediante LLM → Desafío queda disponible para candidatos
163 | 
164 | **UC-002**: Candidato visualiza desafío → Desarrolla solución en editor integrado → Sistema evalúa mediante análisis estático con IA → Retorna puntaje (0-100) y feedback detallado
165 | 
166 | **UC-003**: Reclutador accede a dashboard → Visualiza ranking de candidatos por desafío → Revisa código entregado y análisis de IA → Toma decisiones de selección
167 | 
168 | **UC-004**: Candidato accede a catálogo de desafíos → Filtra por tecnología/nivel → Selecciona desafío → Inicia proceso de evaluación
169 | 
170 | ---
171 | 
172 | ## 5. alcance
173 | 
174 | ### 5.1 dentro de v1 (in) - MVP Hackathon
175 | 
176 | **Motor central de evaluación:**
177 | - Generación automática de desafíos técnicos mediante LLM (LangChain4j)
178 | - Rúbricas de evaluación ocultas generadas por IA
179 | - Análisis estático automatizado de código/soluciones
180 | - Retroalimentación detallada con puntaje numérico (0-100)
181 | 
182 | **Interfaces de usuario (4 pantallas):**
183 | - Panel de inicio role-based (dashboard para reclutadores y candidatos)
184 | - Formulario de generación de desafíos (reclutadores)
185 | - Entorno de resolución con editor integrado (candidatos)
186 | - Vista de resultados y ranking (ambos roles)
187 | 
188 | **Modelo de datos básico:**
189 | - Entidades: Usuario, Puesto, Desafío, Evaluación
190 | - Base de datos PostgreSQL con soporte JSONB
191 | - Relaciones definidas según DER documentado
192 | 
193 | **Stack tecnológico:**
194 | - Backend: Quarkus (Java)
195 | - IA: LangChain4j para integración con LLM
196 | - Frontend: React
197 | - Base de datos: PostgreSQL con pgvector (preparado para RAG futuro)
198 | 
199 | ### 5.2 fuera de v1, planificado (later)
200 | 
201 | **Fase 2 - Módulo académico y colaboración:**
202 | - Sistema de autenticación completo (OAuth, roles granulares)
203 | - Repositorio colectivo de consultas a IA
204 | - Generación de guías de estudio personalizadas
205 | - Compartición de resoluciones entre estudiantes
206 | - Panel de administración para docentes
207 | 
208 | **Fase 3 - Expansión corporativa:**
209 | - Base de datos de talento filtrable y buscable
210 | - Simuladores de flujos de trabajo específicos por empresa
211 | - Integración con ATS (Applicant Tracking Systems)
212 | - Analytics avanzados de desempeño
213 | - API pública para integraciones
214 | 
215 | **Fase 4 - Monetización y certificación:**
216 | - Sistema de suscripciones (instituciones y empresas)
217 | - Procesamiento de pagos
218 | - Emisión automática de certificados digitales
219 | - Sistema de recompensas y gamificación
220 | - Marketplace de desafíos premium
221 | 
222 | ### 5.3 explícitamente fuera (out)
223 | 
224 | **No se implementará (ni en futuro cercano):**
225 | - Evaluación de soft skills o competencias no técnicas
226 | - Videoconferencias integradas para entrevistas
227 | - Ejecución real de código (sandbox con runtime) - solo análisis estático en MVP
228 | - Integración con plataformas LMS externas (Moodle, Canvas)
229 | - Aplicación móvil nativa (solo web responsive)
230 | - Soporte multiidioma (solo español/inglés en v1)
231 | - Evaluaciones presenciales o proctoring con cámara
232 | - Gestión de nómina o contratos laborales
233 | - Red social o mensajería entre usuarios
234 | 
235 | ---
236 | 
237 | ## 6. métricas de éxito
238 | 
239 | ### 6.1 métricas de producto
240 | 
241 | | métrica | objetivo v1 | cómo se mide |
242 | |---------|-------------|--------------|
243 | | Desafíos generados exitosamente | ≥ 50 en hackathon | Contador en BD |
244 | | Evaluaciones completadas | ≥ 100 en hackathon | Tabla EVALUACION |
245 | | Tiempo promedio de generación de desafío | < 30 segundos | Logs de backend |
246 | | Tiempo promedio de evaluación | < 10 segundos | Logs de LLM |
247 | | Tasa de completitud de desafíos iniciados | ≥ 60% | Funnel analytics |
248 | | Satisfacción de reclutadores (NPS) | ≥ 7/10 | Encuesta post-demo |
249 | | Satisfacción de candidatos (NPS) | ≥ 7/10 | Encuesta post-evaluación |
250 | 
251 | ### 6.2 métricas técnicas (SLOs)
252 | 
253 | | métrica | objetivo | umbral de alerta |
254 | |---------|----------|------------------|
255 | | Disponibilidad del sistema | 99% | < 95% |
256 | | Latencia p95 endpoints CRUD | < 300 ms | > 500 ms |
257 | | Latencia p95 generación de desafío (LLM) | < 8 s | > 15 s |
258 | | Latencia p95 evaluación de código (LLM) | < 5 s | > 10 s |
259 | | Time-to-first-token (si streaming) | < 2 s | > 4 s |
260 | | Tasa de error 5xx | < 1% | > 2% |
261 | | Tasa de error 4xx | < 5% | > 10% |
262 | | Uso de memoria backend | < 512 MB | > 1 GB |
263 | | Costo por 100 evaluaciones | < USD 5 | > USD 10 |
264 | 
265 | ### 6.3 métricas específicas de LLM
266 | 
267 | | métrica | objetivo | cómo se mide |
268 | |---------|----------|--------------|
269 | | Calidad de desafíos generados (relevancia) | ≥ 85% | Evaluación manual de muestra (n=20) |
270 | | Precisión de evaluaciones (vs evaluador humano) | ≥ 80% | Comparación con golden set (n=30) |
271 | | Tasa de respuestas estructuradas válidas (JSON) | ≥ 98% | Guardrails de LangChain4j |
272 | | Tasa de alucinación detectada | < 5% | Validación de rúbricas generadas |
273 | | Consistencia de evaluación (mismo código) | ≥ 90% | Test de repetibilidad (n=10) |
274 | | Tokens promedio por generación de desafío | < 2000 | Logs de LLM provider |
275 | | Tokens promedio por evaluación | < 1500 | Logs de LLM provider |
276 | | Tasa de timeout en llamadas LLM | < 2% | Monitoring de LangChain4j |
277 | 
278 | **Estrategia de evaluación (evals):**
279 | - Suite de evals automatizados según ADR-0003
280 | - Golden dataset con 30 pares (desafío, solución, puntaje esperado)
281 | - Evaluación manual periódica de calidad de outputs
282 | - A/B testing de prompts para optimización continua
283 | 
284 | ---
285 | 
286 | ## 7. supuestos y restricciones
287 | 
288 | ### 7.1 supuestos
289 | 
290 | **Supuestos técnicos:**
291 | - Los modelos de lenguaje (LLM) mantendrán disponibilidad ≥ 99% durante la hackathon
292 | - La latencia de respuesta de LLMs será aceptable (< 10s) para la experiencia de usuario
293 | - PostgreSQL con JSONB es suficiente para almacenar rúbricas y feedback sin necesidad de base de datos documental
294 | - El análisis estático de código es suficiente para MVP; no se requiere ejecución real
295 | 
296 | **Supuestos de negocio:**
297 | - Existe demanda real de educadores por automatización de evaluaciones
298 | - Las empresas están dispuestas a considerar candidatos pre-evaluados por IA
299 | - Los estudiantes confiarán en evaluaciones automatizadas si el feedback es de calidad
300 | - El modelo de negocio B2B (instituciones/empresas) es viable para monetización futura
301 | 
302 | **Supuestos de usuario:**
303 | - Los usuarios tienen acceso a internet estable y navegadores modernos
304 | - Los candidatos están familiarizados con editores de código web
305 | - Los reclutadores pueden describir requisitos técnicos de forma clara
306 | - Los usuarios aceptan términos de uso de IA para procesamiento de datos
307 | 
308 | **Riesgo si son falsos:**
309 | - Si LLMs no son confiables → Implementar fallbacks y caché de respuestas
310 | - Si latencia es inaceptable → Implementar streaming y feedback progresivo
311 | - Si usuarios no confían en IA → Agregar opción de revisión humana híbrida
312 | 
313 | ### 7.2 restricciones
314 | 
315 | **Presupuesto:**
316 | - Costo de tokens LLM: Estimado USD 50-100 para hackathon (500-1000 evaluaciones)
317 | - Infraestructura: Tier gratuito de cloud providers (Render, Railway, Vercel)
318 | - Sin presupuesto para servicios premium o APIs de pago
319 | 
320 | **Plazo:**
321 | - Hackathon: 48-72 horas para MVP funcional
322 | - Fase 2: 4-6 semanas post-hackathon
323 | - Fase 3: 8-12 semanas
324 | - Fase 4: 12-16 semanas
325 | 
326 | **Marco regulatorio:**
327 | - Cumplimiento de GDPR/LGPD para datos personales de candidatos
328 | - Transparencia en uso de IA según regulaciones emergentes de IA
329 | - Almacenamiento de código y evaluaciones con consentimiento explícito
330 | - No se pueden usar datos de evaluaciones para entrenar modelos propios sin consentimiento
331 | 
332 | **Compatibilidades obligatorias:**
333 | - Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
334 | - Dispositivos: Desktop y laptop (tablet opcional, móvil fuera de alcance)
335 | - Resolución mínima: 1280x720
336 | - Sin soporte para IE11 o navegadores legacy
337 | 
338 | **Soberanía de datos:**
339 | - Los prompts y código de candidatos pueden procesarse por LLM providers externos (OpenAI, Anthropic, etc.)
340 | - Consentimiento explícito requerido en términos de uso
341 | - Opción futura de LLM on-premise para clientes enterprise con restricciones de datos
342 | - Datos personales (email, nombre) almacenados en servidores con ubicación definida
343 | 
344 | **Limitaciones técnicas:**
345 | - No hay ejecución real de código en MVP (solo análisis estático)
346 | - Sin soporte para lenguajes compilados complejos (C++, Rust) en v1
347 | - Foco inicial en lenguajes interpretados: Python, JavaScript, Java
348 | - Sin integración con IDEs externos (VS Code, IntelliJ)
349 | 
350 | ---
351 | 
352 | ## 8. glosario
353 | 
354 | Términos del dominio con definición canónica. Uso obligatorio en código y documentación.
355 | 
356 | | término | definición |
357 | |---------|------------|
358 | | **Desafío** | Problema técnico generado automáticamente por IA que un candidato debe resolver. Incluye enunciado, contexto y criterios de evaluación ocultos. |
359 | | **Rúbrica** | Conjunto de criterios de evaluación generados por IA y almacenados en formato JSONB. No visible para el candidato durante la resolución. |
360 | | **Evaluación** | Proceso completo que incluye la resolución de un desafío por un candidato y su análisis automatizado por IA. Resultado: puntaje + feedback. |
361 | | **Análisis estático** | Evaluación de código sin ejecución real, basada en lógica, estructura, eficiencia algorítmica y buenas prácticas. Realizado por LLM. |
362 | | **Candidato** | Usuario que resuelve desafíos técnicos. Puede ser estudiante o profesional buscando empleo. Rol: CANDIDATO en BD. |
363 | | **Reclutador** | Usuario que crea desafíos y revisa evaluaciones. Puede ser HR, tech lead o docente. Rol: RECLUTADOR en BD. |
364 | | **Puesto** | Definición de un rol laboral o tema académico que incluye: título, tecnología principal y nivel de seniority. Base para generar desafíos. |
365 | | **Seniority** | Nivel de experiencia técnica: Junior, Semi-Senior, Senior. Determina complejidad del desafío generado. |
366 | | **Repositorio colectivo** | (Fase 2) Base de conocimiento compartida donde se centralizan consultas a IA y resoluciones de estudiantes de una misma clase. |
367 | | **Sandbox** | Entorno de resolución aislado donde el candidato escribe código. En MVP: editor de texto. Futuro: entorno de ejecución real. |
368 | | **Feedback** | Retroalimentación detallada generada por IA tras evaluar una solución. Incluye: puntos fuertes, áreas de mejora, sugerencias específicas. |
369 | | **LLM** | Large Language Model. Motor de IA usado para generar desafíos y evaluar código. Integrado vía LangChain4j. |
370 | | **Guardrails** | Mecanismos de validación de LangChain4j que aseguran respuestas estructuradas (JSON) y detectan outputs inválidos. |
371 | | **Golden set** | Conjunto de datos de referencia con pares (desafío, solución, puntaje esperado) usado para evaluar precisión del sistema. |
372 | | **Evals** | Suite de evaluaciones automatizadas que miden calidad, precisión y consistencia de outputs del LLM. Ver ADR-0003. |
373 | | **Time-to-first-token** | Métrica de latencia: tiempo desde request hasta primer byte de respuesta del LLM en modo streaming. |
374 | | **RAG** | Retrieval-Augmented Generation. Técnica para mejorar respuestas de LLM con contexto específico. Planificado para Fase 2 con pgvector. |
375 | | **Prompt** | Instrucción estructurada enviada al LLM para generar desafíos o evaluar código. Incluye contexto, formato esperado y restricciones. |
376 | | **Token** | Unidad de procesamiento de LLM. Aproximadamente 0.75 palabras en español. Base para cálculo de costos de API. |
377 | | **JSONB** | Tipo de dato de PostgreSQL para almacenar JSON binario. Usado para rúbricas y feedback estructurado. |
378 | | **UC** | Use Case (Caso de Uso). Documentado en formato estándar en `docs/uc/UC-NNN-slug.md`. |
379 | | **ADR** | Architecture Decision Record. Decisiones técnicas documentadas en `docs/adr/NNNN-slug.md`. |
380 | | **MVP** | Minimum Viable Product. Versión mínima funcional para validar propuesta de valor en hackathon. |
381 | | **DoD** | Definition of Done. Criterios de aceptación para considerar una fase completada. Ver ROADMAP.md. |
382 | 
383 | ---
384 | 
385 | ## 9. referencias
386 | 
387 | - **Documentación técnica**: Ver `ARCHITECTURE.md` para decisiones de stack y patrones
388 | - **Roadmap**: Ver `ROADMAP.md` para fases detalladas y Definition of Done
389 | - **Casos de uso**: Ver `docs/uc/UC-001.md` a `UC-004.md` para flujos detallados
390 | - **ADRs**: Ver `docs/adr/` para decisiones arquitectónicas (stack, RAG, evals)
391 | - **Pitch completo**: Ver `Talent pool app.md` para contexto de negocio extendido
392 | - **Modelo de datos**: Ver DER en `Talent pool app.md` líneas 182-229
393 | 
394 | ---
395 | 
396 | **Fin del documento PRODUCT.md**
</content>
</file>
<file><path>product/rf-rnf.md</path>
<content lines="1-57">
 1 | # Listado completo de requerimientos funcionales y no funcionales
 2 | 
 3 | ## Requerimientos funcionales
 4 | 
 5 | * RF-001: El sistema debe permitir a la empresa cargar descripciones de puestos de trabajo.
 6 | * RF-002: El sistema debe permitir a la empresa cargar requerimientos técnicos y herramientas necesarias por puesto.
 7 | * RF-003: El sistema debe permitir a la empresa cargar habilidades blandas requeridas por puesto, asociándolas a una rúbrica de evaluación medible.
 8 | * RF-004: El sistema debe permitir a la empresa guardar la configuración del proyecto o puesto.
 9 | * RF-005: La inteligencia artificial debe generar diversos desafíos técnicos automáticamente, diferenciados por nivel de experiencia, limitando su entrenamiento a documentación de código abierto.
10 | * RF-006: El sistema debe permitir generar información de prueba para los desafíos bajo un modelo de resolución a libro abierto, simulando proyectos reales.
11 | * RF-007: El sistema debe permitir seleccionar el público al que se harán visibles los desafíos.
12 | * RF-008: El sistema debe permitir la creación de consignas, prácticas, exámenes y guías de estudio por parte del docente o recursos humanos.
13 | * RF-009: El sistema debe permitir definir quién tendrá acceso a los materiales creados para colaboración o aprobación.
14 | * RF-010: El talento debe poder realizar los exámenes requeridos múltiples veces.
15 | * RF-011: El sistema debe acumular un historial de puntuación del talento sobre las herramientas evaluadas.
16 | * RF-012: El sistema debe aprovisionar un entorno de ejecución aislado en la nube (sandbox) para que el candidato desarrolle y pruebe su solución técnica.
17 | * RF-013: El entorno de evaluación debe permitir el acceso a internet para la consulta de recursos externos durante la prueba.
18 | * RF-014: El sistema debe registrar exclusivamente el código escrito, el historial de compilación y las ejecuciones realizadas dentro del sandbox.
19 | * RF-015: La inteligencia artificial debe evaluar la entrega analizando el proceso lógico, la eficiencia y las buenas prácticas, en lugar de validar únicamente el resultado final.
20 | * RF-016: El sistema debe ofrecer instancias para testear la cultura del empleado utilizando rúbricas medibles predefinidas.
21 | * RF-017: El sistema debe permitir la realización de los desafíos en las oficinas de la empresa con salas dedicadas.
22 | * RF-018: El sistema debe ofrecer organigramas y flujos de procesos para la capacitación de candidatos avanzados.
23 | * RF-019: El sistema debe generar prácticas de habilidades por rol y por carrera de estudio.
24 | * RF-020: El sistema debe entrenar al usuario en los conceptos de uso de las herramientas de la empresa.
25 | * RF-021: El sistema debe entrenar al usuario en los conceptos fundamentales de la inteligencia artificial.
26 | * RF-022: La inteligencia artificial debe generar ejercicios para activar el pensamiento crítico en lugar de proporcionar respuestas directas.
27 | * RF-023: La inteligencia artificial debe cruzar conocimientos entre materias y herramientas para generar ejercicios prácticos integradores.
28 | * RF-024: El sistema debe permitir al estudiante introducir la bibliografía de la materia para enfocar el contenido.
29 | * RF-025: La inteligencia artificial debe utilizar bases de código abierto o licenciamiento estandarizado como referencia para evaluar los conceptos de la bibliografía.
30 | * RF-026: El sistema debe mantener una base de talentos disponible mensualmente.
31 | * RF-027: El sistema debe permitir filtrar la base de talentos por los exámenes realizados y sus puntuaciones.
32 | * RF-028: El sistema debe permitir que los chats con la inteligencia artificial puedan convertirse en públicos y ser compartidos entre usuarios.
33 | * RF-029: El sistema debe automatizar y generar reportes semanales sobre el progreso del talento y estructurar los resultados en métricas exactas.
34 | * RF-030: El sistema debe permitir la publicación automática de capacitaciones en portales de trabajo o redes sociales permitidas.
35 | * RF-031: El sistema debe permitir a empresas proveedoras otorgar certificados por los entrenamientos ofrecidos.
36 | * RF-032: El sistema debe gestionar la suscripción mensual requerida para universidades y empresas.
37 | * RF-033: El sistema debe aprender e improvisar los desafíos con el tiempo para evitar la repetición y mejorar su calidad evaluativa.
38 | * RF-034: El sistema debe proporcionar una retroalimentación detallada y automática para que los candidatos revisen sus resultados posprueba.
39 | * RF-035: El sistema debe ofrecer una capacitación adaptable basada en el rendimiento histórico y el nivel de experiencia del usuario.
40 | 
41 | ## Requerimientos no funcionales
42 | 
43 | * RNF-001: El tiempo de generación del desafío técnico por parte de la inteligencia artificial no debe superar los 15 segundos.
44 | * RNF-002: El entorno aislado de ejecución en la nube debe inicializarse y estar operativo en un tiempo máximo de 10 segundos.
45 | * RNF-003: El sistema debe soportar un mínimo de 100 usuarios concurrentes ejecutando entornos aislados simultáneamente sin degradación notable del servicio.
46 | * RNF-004: La información personal de los talentos, historiales, puntuaciones y configuraciones debe estar encriptada en tránsito y en reposo.
47 | * RNF-005: El sistema debe implementar una autenticación robusta y multifactor para el acceso de empresas, recursos humanos y profesores.
48 | * RNF-006: El sistema tiene estrictamente prohibido solicitar permisos para grabar audio, video o capturar la pantalla del dispositivo local del usuario.
49 | * RNF-007: Se deben cumplir obligatoriamente las normativas internacionales y locales de privacidad y protección de datos.
50 | * RNF-008: La interfaz de usuario para la carga de puestos y la visualización de reportes debe ser intuitiva para los gestores.
51 | * RNF-009: La interfaz gráfica de evaluación para el candidato debe ser minimalista y no generar distracciones innecesarias.
52 | * RNF-010: El sistema central debe garantizar una alta disponibilidad, asegurando un tiempo de actividad del 99.9%.
53 | * RNF-011: La arquitectura del proyecto debe estructurarse utilizando contenedores para facilitar la escalabilidad y un despliegue rápido.
54 | * RNF-012: El sistema debe registrar en una bitácora de auditoría todas las interacciones clave, inicios de sesión y finalización de pruebas.
55 | * RNF-013: Debe existir un panel de monitoreo en tiempo real para visualizar el estado de los servicios y el avance de los talentos.
56 | * RNF-014: El sistema debe incluir mecanismos para incentivar a los usuarios mediante bonificaciones y un esquema de recomendaciones.
57 | * RNF-015: El sistema debe incorporar alertas automáticas en tiempo real para el monitoreo proactivo por parte de los administradores.
</content>
</file>
<file><path>product/ROADMAP.md</path>
<content lines="1-199">
  1 | # ROADMAP.md — fases de desarrollo
  2 | 
  3 | > Documento vivo. Se actualiza al cierre de cada fase.
  4 | > Última revisión: YYYY-MM-DD
  5 | 
  6 | ---
  7 | 
  8 | ## principios de avance
  9 | 
 10 | 1. **Una fase no empieza hasta que la anterior está cerrada con DoD verificada.**
 11 | 2. **Cada fase termina con una demo y una entrada en `CHANGELOG.md`.**
 12 | 3. **No se desarrollan UCs hasta haber completado fase 0 y fase 1.**
 13 | 4. **Deuda técnica detectada se registra en `TECH_DEBT.md` antes de avanzar.**
 14 | 
 15 | ---
 16 | 
 17 | ## fase 0 — fundaciones
 18 | 
 19 | **Objetivo**: dejar el repo y la infraestructura listos para que el desarrollo de features sea mecánico y seguro.
 20 | 
 21 | **Entregables backend (Quarkus)**:
 22 | - [ ] Repo inicializado con la estructura de carpetas de `ARCHITECTURE.md` §3
 23 | - [ ] `pom.xml` con dependencias Quarkus + LangChain4j en versiones fijadas
 24 | - [ ] Maven wrapper (`mvnw`) versionado en el repo
 25 | - [ ] `.editorconfig` y plugin Spotless configurado para Java
 26 | - [ ] Checkstyle o equivalente para reglas de estilo
 27 | - [ ] Flyway configurado con migración inicial vacía
 28 | - [ ] Configuración base en `application.yml` con perfiles dev/test/prod
 29 | - [ ] Quarkus Dev Services levanta Postgres en local sin configuración manual
 30 | - [ ] Logging JSON estructurado configurado
 31 | - [ ] Endpoints `/q/health/live`, `/q/health/ready`, `/q/metrics` respondiendo
 32 | - [ ] OpenAPI generándose en `/q/openapi`
 33 | - [ ] Test mínimo `@QuarkusTest` funcionando
 34 | - [ ] Configuración de LangChain4j con un proveedor (Ollama para dev, configurable para staging/prod)
 35 | - [ ] Bean CDI de ChatModel inyectable y testeado con MockChatModel
 36 | 
 37 | **Entregables frontend**:
 38 | - [ ] Proyecto Vite + React + TypeScript
 39 | - [ ] eslint, prettier, tsc configurados con perfil estricto
 40 | - [ ] Cliente HTTP tipado generado desde OpenAPI (`openapi-typescript`)
 41 | - [ ] Página vacía que llama a un endpoint trivial del backend (`/health`)
 42 | - [ ] Test mínimo Vitest funcionando
 43 | - [ ] Test mínimo Playwright funcionando contra el dev server
 44 | 
 45 | **Entregables infraestructura**:
 46 | - [ ] `docker-compose.yml` para entorno local (postgres con pgvector, redis, ollama, backend dev mode, frontend dev mode)
 47 | - [ ] `Dockerfile.backend.jvm` funcional
 48 | - [ ] `Dockerfile.frontend` funcional
 49 | - [ ] (Opcional fase 0, obligatorio antes de fase 3) `Dockerfile.backend.native`
 50 | - [ ] Pipeline de CI mínimo verde (lint + tests placeholder + build)
 51 | - [ ] Pipeline de deploy a entorno staging real (puede ser un PaaS simple al inicio: Fly.io, Render, Railway, etc.)
 52 | - [ ] SonarQube / SonarCloud integrado con quality gate en modo suave (warning)
 53 | 
 54 | **Entregables documentación**:
 55 | - [ ] Plantillas en `docs/`: ADR, UC, runbook
 56 | - [ ] `CONTRIBUTING.md`, `CHANGELOG.md`, `TECH_DEBT.md` creados
 57 | - [ ] ADR-0001 (stack base) cerrado
 58 | - [ ] ADR-0002 (estrategia RAG y vector store) cerrado si la app usa RAG
 59 | - [ ] ADR-0003 (estrategia de evaluación de LLMs) cerrado
 60 | 
 61 | **Definición de hecho**:
 62 | - Cualquier desarrollador (humano o agente) puede levantar el proyecto local con un comando (`./mvnw quarkus:dev` y `pnpm dev`)
 63 | - CI pasa en verde
 64 | - Deploy a staging exitoso de un "hello world" que responde por API y se renderiza en el frontend
 65 | 
 66 | ---
 67 | 
 68 | ## fase 1 — walking skeleton
 69 | 
 70 | **Objetivo**: validar la arquitectura completa de punta a punta con la feature más fina posible, incluyendo una primera capacidad LLM trivial.
 71 | 
 72 | **Alcance**:
 73 | - Un usuario puede registrarse, hacer login, y ver una pantalla autenticada con un input que envía un mensaje a un LLM y muestra la respuesta.
 74 | - Todo el flujo pasa por: frontend → API → BD → LangChain4j → proveedor LLM → respuesta → render.
 75 | - Deployado a staging, observable, con tests, con guardrails básicos, con costo monitoreado.
 76 | 
 77 | **Entregables**:
 78 | - [ ] Migración Flyway con tabla `users`
 79 | - [ ] Endpoints `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/users/me`
 80 | - [ ] Endpoint `/api/v1/chat` con un AiService trivial (ej: respondedor general con prompt fijo)
 81 | - [ ] Frontend con páginas: registro, login, home autenticada con chat simple
 82 | - [ ] Auth implementada según `ARCHITECTURE.md` §7
 83 | - [ ] Guardrails de input mínimos (longitud máxima, detección básica de inyección)
 84 | - [ ] Rate limit por usuario en `/api/v1/chat`
 85 | - [ ] Tests: unitarios de dominio, integración `@QuarkusTest`, e2e que cubre el flujo completo
 86 | - [ ] Test de unidad del AiService usando `MockChatModel`
 87 | - [ ] Suite de evals mínima (3-5 prompts) corriendo en CI
 88 | - [ ] Logs, métricas (incluyendo tokens y costo), trazas visibles para este flujo
 89 | - [ ] Deploy a staging
 90 | - [ ] Documentación: este flujo en OpenAPI, capturas en docs
 91 | 
 92 | **Definición de hecho**:
 93 | - Un humano puede registrarse en staging, loguearse, mandar un mensaje al LLM y ver la respuesta
 94 | - Las métricas muestran latencia, tokens consumidos y costo estimado del chat
 95 | - Test e2e en CI verde de forma estable (sin flakiness)
 96 | - Suite de evals corriendo y registrando resultados
 97 | 
 98 | ---
 99 | 
100 | ## fase 2 — MVP funcional
101 | 
102 | **Objetivo**: implementar los UCs marcados como críticos en `PRODUCT.md`.
103 | 
104 | **Plan**:
105 | - [ ] UC-001: ...
106 | - [ ] UC-002: ...
107 | - [ ] UC-003: ...
108 | - [ ] (uno por uno, en el orden definido)
109 | 
110 | **Por cada UC**:
111 | 1. Leer `docs/uc/UC-NNN-*.md` completo
112 | 2. Crear branch `feat/uc-NNN-slug`
113 | 3. Implementar siguiendo el flujo y los criterios de aceptación
114 | 4. Tests cumpliendo cobertura mínima
115 | 5. Si toca prompts o capacidad LLM nueva: agregar entradas a la suite de evals
116 | 6. Actualizar OpenAPI si cambió
117 | 7. PR con plantilla completa
118 | 8. Merge solo con CI verde y revisión humana
119 | 
120 | **Definición de hecho de la fase**:
121 | - Todos los UCs críticos pasan sus criterios de aceptación
122 | - Cobertura de tests dentro de los umbrales
123 | - Sin tickets críticos abiertos
124 | - Demo end-to-end del flujo completo
125 | - Suite de evals con resultado superior al umbral definido en ADR-0003
126 | 
127 | ---
128 | 
129 | ## fase 3 — hardening
130 | 
131 | **Objetivo**: dejar el sistema listo para usuarios reales.
132 | 
133 | **Entregables**:
134 | - [ ] Auditoría de seguridad (ver checklist en `ARCHITECTURE.md` §8)
135 | - [ ] Quality gate de SonarQube endurecido a bloqueante
136 | - [ ] Pruebas de carga: validar SLOs de `PRODUCT.md` §6.2 con tráfico esperado x3
137 | - [ ] Pruebas de costo: simular carga típica y validar costo de LLM mensual proyectado
138 | - [ ] Pruebas de caos básicas: caída de BD, caída del proveedor LLM, latencia alta
139 | - [ ] Backups configurados y restauración probada
140 | - [ ] Alertas configuradas para todos los SLOs (incluyendo costo LLM diario)
141 | - [ ] Runbooks para los incidentes más probables
142 | - [ ] Build nativo (GraalVM) funcionando y desplegado en staging si se decide usarlo en prod
143 | - [ ] Política de retención de datos y logs documentada
144 | - [ ] Términos y condiciones, política de privacidad publicados
145 | - [ ] Cumplimiento regulatorio aplicable verificado (incluyendo manejo de prompts con datos personales)
146 | - [ ] Plan de rollback probado en staging
147 | - [ ] Estrategia de fallback si el proveedor LLM principal falla (proveedor secundario o degradación elegante)
148 | 
149 | **Definición de hecho**:
150 | - Pruebas de carga pasan con margen
151 | - Restore desde backup probado y exitoso
152 | - Cero hallazgos críticos en auditoría de seguridad
153 | - Costo proyectado mensual dentro del presupuesto
154 | 
155 | ---
156 | 
157 | ## fase 4 — lanzamiento controlado
158 | 
159 | **Objetivo**: poner el producto en manos de usuarios reales con riesgo acotado.
160 | 
161 | **Estrategia**:
162 | - [ ] Soft launch con grupo cerrado (beta cerrada)
163 | - [ ] Feedback loop: bug reports, telemetría, encuestas
164 | - [ ] Iteración rápida sobre bloqueantes
165 | - [ ] Apertura gradual: % de tráfico creciente o lista de espera
166 | - [ ] Monitoreo constante de costos LLM con alertas tempranas
167 | 
168 | **Definición de hecho**:
169 | - Métricas de producto de `PRODUCT.md` §6.1 medidas con datos reales
170 | - SLOs cumplidos durante el período de beta
171 | - Plan de apertura general aprobado
172 | 
173 | ---
174 | 
175 | ## fase 5 — iteración
176 | 
177 | **Objetivo**: mejorar con datos reales, no con suposiciones.
178 | 
179 | **Mecánica**:
180 | - Ciclos de 2 semanas
181 | - Cada ciclo: 1 hipótesis, 1 cambio, 1 medición
182 | - Backlog priorizado por impacto en métricas de producto
183 | - Revisión de deuda técnica al menos una vez por trimestre
184 | - Iteración sobre prompts y suite de evals: cada cambio de prompt pasa por evals antes de prod
185 | 
186 | **No hay DoD final**: esta fase es continua.
187 | 
188 | ---
189 | 
190 | ## tablero de estado
191 | 
192 | | fase | estado | inicio | fin | notas |
193 | |------|--------|--------|-----|-------|
194 | | 0 — fundaciones | pendiente | — | — | |
195 | | 1 — walking skeleton | pendiente | — | — | |
196 | | 2 — MVP funcional | pendiente | — | — | |
197 | | 3 — hardening | pendiente | — | — | |
198 | | 4 — lanzamiento | pendiente | — | — | |
199 | | 5 — iteración | pendiente | — | — | |
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
product/ROADMAP.md

# VSCode Open Tabs
product/Talent pool app.md,product/PRODUCT.md,product/ARCHITECTURE.md,README.md,product/ROADMAP.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T18:00:49.866Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.01

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll analyze the project specifications and generate a comprehensive roadmap based on the template. Let me create a detailed roadmap that aligns with the architecture, product requirements, and functional/non-functional requirements.

<write_to_file>
<path>product/ROADMAP.md</path>
<content>
# ROADMAP.md — fases de desarrollo

> Documento vivo. Se actualiza al cierre de cada fase.
> Última revisión: 2026-05-01

---

## principios de avance

1. **Una fase no empieza hasta que la anterior está cerrada con DoD verificada.**
2. **Cada fase termina con una demo y una entrada en `CHANGELOG.md`.**
3. **No se desarrollan UCs hasta haber completado fase 0 y fase 1.**
4. **Deuda técnica detectada se registra en `TECH_DEBT.md` antes de avanzar.**

---

## fase 0 — fundaciones

**Objetivo**: dejar el repo y la infraestructura listos para que el desarrollo de features sea mecánico y seguro.

**Duración estimada**: 3-5 días

**Entregables backend (Quarkus)**:
- [ ] Repo inicializado con la estructura de carpetas de `ARCHITECTURE.md` §3
  - `src/main/java/com/talentpool/` con subcarpetas: domain, application, infrastructure, api
  - `src/main/resources/` con db/migration, prompts, application.yml
  - `src/test/java/` con estructura paralela
- [ ] `pom.xml` con dependencias Quarkus + LangChain4j en versiones fijadas
  - Quarkus 3.x (última LTS)
  - LangChain4j 0.35.x o superior
  - PostgreSQL driver + Flyway
  - Hibernate ORM con Panache
  - RESTEasy Reactive + Jackson
  - Micrometer + OpenTelemetry
- [ ] Maven wrapper (`mvnw`) versionado en el repo
- [ ] `.editorconfig` y plugin Spotless configurado para Java
  - Google Java Style Guide como base
  - Configuración en `pom.xml` con fase `validate`
- [ ] Checkstyle o equivalente para reglas de estilo
  - Archivo `checkstyle.xml` en raíz
  - Integrado en Maven lifecycle
- [ ] Flyway configurado con migración inicial vacía
  - `V001__initial_schema.sql` con comentario placeholder
  - Configuración en `application.yml` con estrategia clean en dev
- [ ] Configuración base en `application.yml` con perfiles dev/test/prod
  - Datasource con Quarkus Dev Services
  - Logging JSON estructurado (formato ECS)
  - Configuración de CORS para frontend local
  - Placeholder para LangChain4j config
- [ ] Quarkus Dev Services levanta Postgres en local sin configuración manual
  - Incluir pgvector extension habilitada
  - Seed data opcional para desarrollo
- [ ] Logging JSON estructurado configurado
  - Formato: timestamp, level, logger, message, context
  - Configuración de niveles por paquete
- [ ] Endpoints `/q/health/live`, `/q/health/ready`, `/q/metrics` respondiendo
  - Health checks personalizados para BD y LLM provider
- [ ] OpenAPI generándose en `/q/openapi`
  - Anotaciones Swagger en recursos REST
  - Esquemas de request/response documentados
- [ ] Test mínimo `@QuarkusTest` funcionando
  - Test de health endpoint
  - Test de inyección CDI básica
- [ ] Configuración de LangChain4j con un proveedor (Ollama para dev, configurable para staging/prod)
  - Bean CDI `ChatLanguageModel` con @ApplicationScoped
  - Configuración externalizada en application.yml
  - Soporte para múltiples providers (OpenAI, Anthropic, Ollama)
- [ ] Bean CDI de ChatModel inyectable y testeado con MockChatModel
  - Test unitario con respuesta mockeada
  - Validación de timeout y retry

**Entregables frontend (React + TypeScript)**:
- [ ] Proyecto Vite + React + TypeScript
  - Estructura de carpetas: src/{components, pages, services, hooks, types, utils}
  - Configuración de path aliases (@/ para src/)
- [ ] eslint, prettier, tsc configurados con perfil estricto
  - ESLint con reglas React + TypeScript recomendadas
  - Prettier con formato consistente (2 espacios, single quotes)
  - Pre-commit hooks con Husky + lint-staged
- [ ] Cliente HTTP tipado generado desde OpenAPI (`openapi-typescript`)
  - Script npm para regenerar tipos desde backend
  - Axios o Fetch wrapper tipado
- [ ] Página vacía que llama a un endpoint trivial del backend (`/health`)
  - Componente de prueba de conectividad
  - Manejo de errores básico
- [ ] Test mínimo Vitest funcionando
  - Test de componente simple
  - Configuración de coverage
- [ ] Test mínimo Playwright funcionando contra el dev server
  - Test e2e de carga de página principal
  - Configuración de múltiples navegadores

**Entregables infraestructura**:
- [ ] `docker-compose.yml` para entorno local completo
  - postgres:16-alpine con pgvector
  - redis:7-alpine (para caché y rate limiting)
  - ollama/ollama:latest (LLM local para desarrollo)
  - backend en modo dev (hot reload)
  - frontend en modo dev (hot reload)
  - Volúmenes persistentes para BD y modelos
- [ ] `Dockerfile.backend.jvm` funcional
  - Multi-stage build: Maven build + JRE runtime
  - Imagen base: eclipse-temurin:21-jre-alpine
  - Optimización de capas para caché
- [ ] `Dockerfile.frontend` funcional
  - Multi-stage build: npm build + nginx
  - Configuración nginx para SPA routing
- [ ] (Opcional fase 0, obligatorio antes de fase 3) `Dockerfile.backend.native`
  - GraalVM native-image build
  - Configuración de reflection hints
- [ ] Pipeline de CI mínimo verde (lint + tests placeholder + build)
  - GitHub Actions o GitLab CI
  - Jobs: lint-backend, lint-frontend, test-backend, test-frontend, build
  - Caché de dependencias Maven y npm
- [ ] Pipeline de deploy a entorno staging real
  - Opción 1: Fly.io (recomendado para hackathon)
  - Opción 2: Render o Railway
  - Variables de entorno configuradas
  - Deploy automático en merge a main
- [ ] SonarQube / SonarCloud integrado con quality gate en modo suave (warning)
  - Análisis de código en cada PR
  - Métricas: cobertura, duplicación, code smells
  - Quality gate: cobertura > 70%, sin bugs críticos

**Entregables documentación**:
- [ ] Plantillas en `docs/`: ADR, UC, runbook
  - `docs/adr/0000-template.md` (ya existe)
  - `docs/uc/UC-template.md` (ya existe)
  - `docs/runbooks/incident-template.md` (ya existe)
- [ ] `CONTRIBUTING.md`, `CHANGELOG.md`, `TECH_DEBT.md` creados
  - CONTRIBUTING.md con guía de desarrollo, branching strategy, PR template
  - CHANGELOG.md con formato Keep a Changelog
  - TECH_DEBT.md con template de registro
- [ ] ADR-0001 (stack base) cerrado
  - Justificación de Quarkus + LangChain4j + React
  - Alternativas consideradas
  - Consecuencias y trade-offs
- [ ] ADR-0002 (estrategia RAG y vector store) cerrado
  - Decisión de usar pgvector vs alternativas
  - Estrategia de embeddings y chunking
  - Plan de implementación en Fase 2
- [ ] ADR-0003 (estrategia de evaluación de LLMs) cerrado
  - Framework de evals (LangChain4j evals o custom)
  - Métricas: precisión, consistencia, latencia, costo
  - Golden dataset inicial (30 casos)

**Definición de hecho**:
- ✅ Cualquier desarrollador puede levantar el proyecto local con un comando (`./mvnw quarkus:dev` y `pnpm dev`)
- ✅ CI pasa en verde con todos los checks
- ✅ Deploy a staging exitoso de un "hello world" que responde por API y se renderiza en el frontend
- ✅ Documentación de setup en README.md actualizada y validada
- ✅ Todos los ADRs de fase 0 cerrados y revisados

---

## fase 1 — walking skeleton

**Objetivo**: validar la arquitectura completa de punta a punta con la feature más fina posible, incluyendo una primera capacidad LLM trivial.

**Duración estimada**: 5-7 días

**Alcance**:
- Un usuario puede registrarse, hacer login, y ver una pantalla autenticada con un input que envía un mensaje a un LLM y muestra la respuesta.
- Todo el flujo pasa por: frontend → API → BD → LangChain4j → proveedor LLM → respuesta → render.
- Deployado a staging, observable, con tests, con guardrails básicos, con costo monitoreado.

**Entregables backend**:
- [ ] Migración Flyway con tabla `users`
  - Campos: id, email, password_hash, role (ENUM: RECLUTADOR, CANDIDATO), created_at, updated_at
  - Índices: unique en email, index en role
  - Constraints: email format validation
- [ ] Endpoints `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/users/me`
  - POST /auth/register: crea usuario, retorna token JWT
  - POST /auth/login: valida credenciales, retorna token JWT
  - GET /users/me: retorna perfil del usuario autenticado
  - Validación de input con Bean Validation
- [ ] Endpoint `/api/v1/chat` con un AiService trivial
  - POST /chat: recibe mensaje, retorna respuesta del LLM
  - Prompt simple: "Eres un asistente técnico. Responde de forma concisa."
  - Streaming opcional (SSE) para mejor UX
- [ ] Auth implementada según `ARCHITECTURE.md` §7
  - JWT con SmallRye JWT
  - Roles: RECLUTADOR, CANDIDATO
  - Interceptor para validación de roles en endpoints
  - Refresh token strategy (opcional en fase 1)
- [ ] Guardrails de input mínimos
  - Longitud máxima de mensaje: 2000 caracteres
  - Detección básica de inyección de prompts
  - Sanitización de HTML/scripts
- [ ] Rate limit por usuario en `/api/v1/chat`
  - Redis-based rate limiter
  - Límite: 10 requests/minuto por usuario
  - Respuesta 429 con Retry-After header
- [ ] Tests: unitarios de dominio, integración `@QuarkusTest`, e2e
  - Unitarios: lógica de negocio, validaciones
  - Integración: endpoints con BD en memoria (H2 o Testcontainers)
  - E2E: flujo completo registro → login → chat
- [ ] Test de unidad del AiService usando `MockChatModel`
  - Mock de respuestas del LLM
  - Validación de prompts enviados
  - Test de timeout y retry
- [ ] Suite de evals mínima (3-5 prompts) corriendo en CI
  - Eval 1: Respuesta coherente a pregunta técnica simple
  - Eval 2: Rechazo de pregunta fuera de dominio
  - Eval 3: Formato de respuesta estructurado
  - Eval 4: Consistencia en respuestas similares
  - Eval 5: Latencia < 5s
- [ ] Logs, métricas (incluyendo tokens y costo), trazas visibles
  - Logs: JSON estructurado con correlation ID
  - Métricas: Micrometer con contadores de requests, latencia, tokens
  - Trazas: OpenTelemetry con spans para LLM calls
  - Dashboard básico en Grafana o similar
- [ ] Deploy a staging
  - Variables de entorno configuradas (LLM API key, JWT secret)
  - Health checks configurados en load balancer
  - Logs centralizados (Loki, CloudWatch, etc.)

**Entregables frontend**:
- [ ] Páginas: registro, login, home autenticada con chat simple
  - /register: formulario con email, password, confirmación
  - /login: formulario con email, password
  - /home: dashboard con chat interface
  - Navegación con React Router
- [ ] Componentes reutilizables
  - Input con validación
  - Button con estados (loading, disabled)
  - ChatMessage component
  - Layout con header y sidebar
- [ ] Manejo de estado con Context API o Zustand
  - AuthContext: usuario, token, login, logout
  - ChatContext: mensajes, enviar mensaje
- [ ] Integración con API backend
  - Axios instance con interceptors
  - Manejo de tokens en headers
  - Refresh token automático
- [ ] Manejo de errores y loading states
  - Error boundaries
  - Toasts para notificaciones
  - Skeletons para loading

**Entregables observabilidad**:
- [ ] Métricas de negocio
  - Contador de registros exitosos
  - Contador de logins exitosos
  - Contador de mensajes de chat
  - Distribución de latencia de LLM
- [ ] Métricas de costo LLM
  - Tokens de entrada por request
  - Tokens de salida por request
  - Costo estimado por request (según pricing del provider)
  - Costo acumulado diario
- [ ] Alertas básicas
  - Latencia p95 > 10s
  - Error rate > 5%
  - Costo diario > umbral definido
  - Health check fallando

**Definición de hecho**:
- ✅ Un humano puede registrarse en staging, loguearse, mandar un mensaje al LLM y ver la respuesta
- ✅ Las métricas muestran latencia, tokens consumidos y costo estimado del chat
- ✅ Test e2e en CI verde de forma estable (sin flakiness)
- ✅ Suite de evals corriendo y registrando resultados (todos pasando)
- ✅ Logs estructurados visibles en herramienta de observabilidad
- ✅ Documentación de API actualizada en OpenAPI
- ✅ Demo grabada del flujo completo

---

## fase 2 — MVP funcional (Hackathon)

**Objetivo**: implementar los UCs marcados como críticos en `PRODUCT.md` para tener un MVP demostrable.

**Duración estimada**: 48-72 horas (hackathon)

**Prioridad**: CRÍTICA - Bloqueante para demo de hackathon

**Plan de implementación**:

### UC-001: Generar desafío técnico automatizado
**Responsable**: Backend + LLM
**Duración**: 12-16 horas

**Entregables**:
- [ ] Migración Flyway con tabla `PUESTO`
  - Campos: id, titulo, tecnologia_principal, seniority (ENUM), descripcion, created_by, created_at
  - Relación: FK a users (created_by)
- [ ] Migración Flyway con tabla `DESAFIO`
  - Campos: id, puesto_id, enunciado (TEXT), contexto (TEXT), rubrica_oculta (JSONB), dificultad, created_at
  - Relación: FK a puesto
  - Índices: index en puesto_id, index en dificultad
- [ ] Endpoint POST `/api/v1/puestos`
  - Request: titulo, tecnologia_principal, seniority, descripcion
  - Response: puesto creado con ID
  - Validaciones: campos requeridos, seniority válido
- [ ] Endpoint POST `/api/v1/puestos/{id}/desafios/generar`
  - Request: parámetros opcionales (cantidad, tipo)
  - Response: desafío generado con ID
  - Proceso: llama a LLM con prompt estructurado
- [ ] AiService para generación de desafíos
  - Prompt template en `src/main/resources/prompts/generar-desafio.txt`
  - Estructura del prompt según `ARCHITECTURE.md` §6.2
  - Output estructurado: JSON con enunciado, contexto, rubrica
  - Guardrails: validación de JSON, longitud mínima/máxima
- [ ] Rúbrica oculta generada por IA
  - Formato JSONB: criterios, pesos, puntos máximos
  - Ejemplo: {"criterios": [{"nombre": "Lógica", "peso": 0.4, "puntos": 40}, ...]}
  - Almacenada en campo rubrica_oculta de DESAFIO
- [ ] Tests
  - Unitario: validación de estructura de rúbrica
  - Integración: generación de desafío end-to-end
  - Eval: calidad de desafíos generados (muestra n=10)
- [ ] Frontend: formulario de creación de puesto y generación de desafío
  - Página /puestos/nuevo
  - Formulario con campos: titulo, tecnologia, seniority, descripcion
  - Botón "Generar Desafío" con loading state
  - Vista previa del desafío generado

**Criterios de aceptación**:
- ✅ Reclutador puede crear un puesto con parámetros específicos
- ✅ Sistema genera desafío técnico en < 30 segundos (RNF-001)
- ✅ Desafío incluye enunciado claro, contexto y rúbrica oculta
- ✅ Rúbrica es válida y estructurada en JSONB
- ✅ Desafío es relevante para la tecnología y seniority especificados
- ✅ Suite de evals valida calidad de desafíos (≥ 85% relevancia)

### UC-002: Resolver desafío y evaluar mediante análisis estático
**Responsable**: Backend + LLM + Frontend
**Duración**: 16-20 horas

**Entregables**:
- [ ] Migración Flyway con tabla `EVALUACION`
  - Campos: id, desafio_id, candidato_id, codigo_entregado (TEXT), puntaje (0-100), feedback (JSONB), estado (ENUM), submitted_at, evaluated_at
  - Relaciones: FK a desafio, FK a users (candidato)
  - Índices: index en desafio_id, index en candidato_id, index en puntaje
- [ ] Endpoint GET `/api/v1/desafios/{id}`
  - Response: desafío completo SIN rúbrica oculta
  - Visible para candidatos autenticados
- [ ] Endpoint POST `/api/v1/desafios/{id}/evaluaciones`
  - Request: codigo_entregado (TEXT)
  - Response: evaluacion_id, estado "EN_PROCESO"
  - Proceso asíncrono: evalúa código con LLM
- [ ] Endpoint GET `/api/v1/evaluaciones/{id}`
  - Response: evaluación completa con puntaje y feedback
  - Polling para obtener resultado cuando estado = "COMPLETADA"
- [ ] AiService para evaluación de código
  - Prompt template en `src/main/resources/prompts/evaluar-codigo.txt`
  - Input: código del candidato + rúbrica oculta + enunciado
  - Output estructurado: JSON con puntaje, feedback detallado, puntos fuertes, áreas de mejora
  - Análisis estático: lógica, eficiencia, buenas prácticas (RF-015)
- [ ] Feedback detallado estructurado
  - Formato JSONB: {"puntaje": 85, "puntos_fuertes": [...], "areas_mejora": [...], "sugerencias": [...]}
  - Retroalimentación específica por criterio de rúbrica
  - Sugerencias constructivas (RF-034)
- [ ] Tests
  - Unitario: validación de estructura de feedback
  - Integración: evaluación de código end-to-end
  - Eval: precisión de evaluaciones vs golden set (≥ 80%)
  - Eval: consistencia de evaluación (mismo código, ≥ 90%)
- [ ] Frontend: entorno de resolución con editor integrado
  - Página /desafios/{id}/resolver
  - Editor de código (Monaco Editor o CodeMirror)
  - Syntax highlighting para lenguaje del desafío
  - Botón "Enviar Solución" con confirmación
  - Vista de resultados con puntaje y feedback detallado

**Criterios de aceptación**:
- ✅ Candidato puede visualizar desafío sin ver rúbrica oculta
- ✅ Candidato puede escribir código en editor integrado
- ✅ Sistema evalúa código en < 10 segundos (RNF-001 adaptado)
- ✅ Evaluación retorna puntaje 0-100 y feedback estructurado
- ✅ Feedback incluye puntos fuertes, áreas de mejora y sugerencias
- ✅ Análisis estático evalúa lógica, eficiencia y buenas prácticas
- ✅ Suite de evals valida precisión ≥ 80% vs golden set

### UC-003: Visualizar ranking de candidatos y reportes de evaluación
**Responsable**: Backend + Frontend
**Duración**: 8-12 horas

**Entregables**:
- [ ] Endpoint GET `/api/v1/desafios/{id}/ranking`
  - Response: lista de evaluaciones ordenadas por puntaje DESC
  - Incluye: candidato (nombre/email), puntaje, fecha de evaluación
  - Paginación: limit, offset
  - Filtros opcionales: puntaje mínimo, fecha
- [ ] Endpoint GET `/api/v1/evaluaciones/{id}/detalle`
  - Response: evaluación completa con código y feedback
  - Solo accesible por reclutador que creó el desafío
- [ ] Endpoint GET `/api/v1/puestos/{id}/estadisticas`
  - Response: estadísticas agregadas del puesto
  - Métricas: total evaluaciones, puntaje promedio, distribución de puntajes
- [ ] Tests
  - Integración: ranking con múltiples evaluaciones
  - Unitario: cálculo de estadísticas
  - E2E: flujo completo de visualización de ranking
- [ ] Frontend: dashboard de reclutador
  - Página /puestos/{id}/ranking
  - Tabla con ranking de candidatos
  - Filtros: puntaje mínimo, fecha
  - Botón "Ver Detalle" para cada evaluación
  - Gráficos: distribución de puntajes (histograma)
- [ ] Frontend: vista de detalle de evaluación
  - Página /evaluaciones/{id}
  - Código del candidato con syntax highlighting
  - Feedback detallado por secciones
  - Puntaje destacado visualmente

**Criterios de aceptación**:
- ✅ Reclutador puede ver ranking de candidatos por desafío
- ✅ Ranking ordenado por puntaje descendente
- ✅ Reclutador puede revisar código entregado y análisis de IA
- ✅ Dashboard muestra estadísticas agregadas del puesto
- ✅ Interfaz intuitiva para gestores (RNF-008)

### UC-004: Acceder y seleccionar desafíos por parte del candidato
**Responsable**: Backend + Frontend
**Duración**: 6-8 horas

**Entregables**:
- [ ] Endpoint GET `/api/v1/desafios`
  - Response: lista de desafíos disponibles
  - Filtros: tecnologia, seniority, dificultad
  - Paginación: limit, offset
  - Incluye: titulo, tecnologia, seniority, descripcion breve
- [ ] Endpoint GET `/api/v1/desafios/{id}/mis-evaluaciones`
  - Response: evaluaciones del candidato autenticado para ese desafío
  - Permite ver historial de intentos (RF-010, RF-011)
- [ ] Tests
  - Integración: catálogo con filtros
  - E2E: flujo de selección y resolución
- [ ] Frontend: catálogo de desafíos
  - Página /desafios
  - Cards con información de cada desafío
  - Filtros: tecnología, nivel, dificultad
  - Botón "Resolver" para iniciar evaluación
- [ ] Frontend: historial de evaluaciones del candidato
  - Página /mis-evaluaciones
  - Lista de desafíos resueltos con puntajes
  - Indicador de progreso (RF-011)

**Criterios de aceptación**:
- ✅ Candidato puede acceder a catálogo de desafíos
- ✅ Candidato puede filtrar por tecnología y nivel
- ✅ Candidato puede seleccionar desafío e iniciar resolución
- ✅ Candidato puede ver historial de evaluaciones propias
- ✅ Sistema acumula historial de puntuación (RF-011)

**Definición de hecho de la fase**:
- ✅ Todos los UCs críticos (UC-001 a UC-004) pasan sus criterios de aceptación
- ✅ Cobertura de tests: backend ≥ 75%, frontend ≥ 60%
- ✅ Sin tickets críticos abiertos en backlog
- ✅ Demo end-to-end del flujo completo grabada
- ✅ Suite de evals con resultado superior al umbral definido en ADR-0003
  - Calidad de desafíos: ≥ 85% relevancia
  - Precisión de evaluaciones: ≥ 80% vs golden set
  - Consistencia: ≥ 90% en evaluaciones repetidas
- ✅ Métricas de producto medidas:
  - Desafíos generados: ≥ 50
  - Evaluaciones completadas: ≥ 100
  - Tiempo promedio generación: < 30s
  - Tiempo promedio evaluación: < 10s
  - Tasa de completitud: ≥ 60%
- ✅ Deploy a staging exitoso y estable
- ✅ Documentación de API actualizada en OpenAPI
- ✅ Video demo de 5 minutos para presentación de hackathon

---

## fase 3 — hardening (Post-Hackathon)

**Objetivo**: dejar el sistema listo para usuarios reales más allá del contexto de hackathon.

**Duración estimada**: 2-3 semanas

**Prioridad**: ALTA - Necesario antes de lanzamiento público

**Entregables seguridad**:
- [ ] Auditoría de seguridad completa
  - OWASP Top 10 verificado
  - Inyección SQL: prevención con Panache
  - XSS: sanitización de inputs
  - CSRF: tokens en formularios
  - Autenticación: JWT con expiración y refresh
  - Autorización: roles y permisos granulares
- [ ] Encriptación de datos sensibles
  - Passwords: bcrypt con salt
  - Datos personales en BD: encriptación at-rest (RNF-004)
  - Comunicación: HTTPS obligatorio en prod
- [ ] Autenticación multifactor (RNF-005)
  - TOTP (Google Authenticator, Authy)
  - Opcional para candidatos, obligatorio para reclutadores
- [ ] Cumplimiento regulatorio (RNF-007)
  - GDPR: consentimiento explícito, derecho al olvido
  - LGPD: política de privacidad, términos de uso
  - Transparencia en uso de IA
- [ ] Política de privacidad y términos de uso
  - Documentos legales publicados
  - Consentimiento explícito en registro
  - Opt-in para procesamiento de datos con LLM

**Entregables calidad**:
- [ ] Quality gate de SonarQube endurecido a bloqueante
  - Cobertura mínima: 80% backend, 70% frontend
  - Cero bugs críticos o de seguridad
  - Duplicación < 3%
  - Deuda técnica < 5%
- [ ] Pruebas de carga
  - Herramienta: k6, JMeter o Gatling
  - Escenario 1: 100 usuarios concurrentes generando desafíos
  - Escenario 2: 300 usuarios concurrentes resolviendo desafíos
  - Escenario 3: 500 usuarios concurrentes consultando rankings
  - Validar SLOs de `PRODUCT.md` §6.2 con tráfico esperado x3
  - Objetivo: latencia p95 < 500ms, error rate < 1%
- [ ] Pruebas de costo LLM
  - Simular carga típica: 1000 evaluaciones/día
  - Calcular costo mensual proyectado
  - Validar presupuesto: < USD 500/mes para 30k evaluaciones
  - Implementar alertas de costo diario
- [ ] Pruebas de caos básicas
  - Caída de BD: validar reconexión automática
  - Caída del proveedor LLM: validar fallback o degradación elegante
  - Latencia alta de LLM: validar timeouts y retry
  - Spike de tráfico: validar rate limiting y auto-scaling

**Entregables operación**:
- [ ] Backups configurados y restauración probada
  - Backup automático de BD: diario, retención 30 días
  - Backup de configuración y secretos
  - Procedimiento de restore documentado y probado
- [ ] Alertas configuradas para todos los SLOs
  - Disponibilidad < 99%
  - Latencia p95 > 500ms
  - Error rate > 2%
  - Costo LLM diario > umbral
  - Uso de memoria > 1GB
  - Disco > 80% capacidad
- [ ] Runbooks para incidentes más probables
  - Runbook: BD no responde
  - Runbook: LLM provider caído
  - Runbook: Latencia alta
  - Runbook: Costo LLM disparado
  - Runbook: Deploy fallido
- [ ] Build nativo (GraalVM) funcionando
  - Dockerfile.backend.native optimizado
  - Tiempo de startup < 100ms
  - Memoria < 256MB
  - Deploy a staging con imagen nativa
- [ ] Política de retención de datos y logs
  - Logs: retención 90 días
  - Evaluaciones: retención indefinida (con consentimiento)
  - Datos personales: eliminación bajo demanda (GDPR)
- [ ] Plan de rollback probado en staging
  - Estrategia: blue-green deployment
  - Rollback automático si health checks fallan
  - Tiempo de rollback < 5 minutos

**Entregables observabilidad avanzada**:
- [ ] Dashboard de métricas de negocio
  - Grafana o similar
  - Paneles: usuarios activos, desafíos generados, evaluaciones completadas
  - Métricas de costo LLM en tiempo real
- [ ] Trazas distribuidas completas
  - OpenTelemetry con Jaeger o Tempo
  - Spans para: API calls, DB queries, LLM calls
  - Visualización de latencia por componente
- [ ] Logs centralizados con búsqueda
  - Loki, CloudWatch Logs o similar
  - Búsqueda por correlation ID, usuario, endpoint
  - Alertas basadas en logs (error patterns)

**Definición de hecho**:
- ✅ Pruebas de carga pasan con margen (latencia p95 < 400ms)
- ✅ Restore desde backup probado y exitoso (< 1 hora)
- ✅ Cero hallazgos críticos en auditoría de seguridad
- ✅ Costo proyectado mensual dentro del presupuesto (< USD 500)
- ✅ Disponibilidad en staging ≥ 99.5% durante 1 semana
- ✅ Todos los runbooks probados en staging
- ✅ Quality gate de SonarQube en verde
- ✅ Documentación de operación completa

---

## fase 4 — lanzamiento controlado

**Objetivo**: poner el producto en manos de usuarios reales con riesgo acotado.

**Duración estimada**: 3-4 semanas

**Prioridad**: ALTA - Validación con usuarios reales

**Estrategia de lanzamiento**:
- [ ] Soft launch con grupo cerrado (beta cerrada)
  - Invitación a 20-30 usuarios seleccionados
  - Mix: 10 reclutadores, 20 candidatos
  - Instituciones educativas piloto: 2-3 universidades/bootcamps
- [ ] Onboarding guiado
  - Tutorial interactivo en primera sesión
  - Documentación de ayuda contextual
  - Soporte por email/chat
- [ ] Feedback loop estructurado
  - Encuesta post-uso (NPS)
  - Bug reports con template
  - Feature requests priorizados
  - Sesiones de feedback 1-on-1
- [ ] Telemetría de producto
  - Analytics: Mixpanel, Amplitude o similar
  - Eventos: registro, login, generación desafío, evaluación, visualización ranking
  - Funnels: conversión de registro a primera evaluación
  - Retención: usuarios activos diarios/semanales
- [ ] Iteración rápida sobre bloqueantes
  - Ciclos de 1 semana
  - Prioridad: bugs críticos > UX blockers > features
  - Deploy a producción 2x por semana
- [ ] Monitoreo constante de costos LLM
  - Dashboard de costo en tiempo real
  - Alertas tempranas: costo diario > 80% del presupuesto
  - Análisis de uso: tokens por tipo de request
  - Optimización de prompts para reducir tokens

**Métricas de éxito de beta**:
- [ ] Métricas de producto (objetivo v1 de `PRODUCT.md` §6.1)
  - Desafíos generados exitosamente: ≥ 50
  - Evaluaciones completadas: ≥ 100
  - Tiempo promedio de generación: < 30s
  - Tiempo promedio de evaluación: < 10s
  - Tasa de completitud: ≥ 60%
  - NPS reclutadores: ≥ 7/10
  - NPS candidatos: ≥ 7/10
- [ ] Métricas técnicas (SLOs de `PRODUCT.md` §6.2)
  - Disponibilidad: ≥ 99%
  - Latencia p95 CRUD: < 300ms
  - Latencia p95 generación LLM: < 8s
  - Latencia p95 evaluación LLM: < 5s
  - Error rate 5xx: < 1%
  - Error rate 4xx: < 5%
  - Costo por 100 evaluaciones: < USD 5
- [ ] Métricas de LLM (de `PRODUCT.md` §6.3)
  - Calidad de desafíos: ≥ 85% relevancia
  - Precisión de evaluaciones: ≥ 80% vs humano
  - Respuestas estructuradas válidas: ≥ 98%
  - Tasa de alucinación: < 5%
  - Consistencia de evaluación: ≥ 90%
  - Tokens promedio generación: < 2000
  - Tokens promedio evaluación: < 1500
  - Tasa de timeout LLM: < 2%

**Apertura gradual**:
- [ ] Semana 1-2: Beta cerrada (30 usuarios)
- [ ] Semana 3: Expansión a 100 usuarios (lista de espera)
- [ ] Semana 4: Apertura a 500 usuarios (invitación)
- [ ] Post-semana 4: Apertura general con registro público

**Definición de hecho**:
- ✅ Métricas de producto medidas con datos reales y cumpliendo objetivos
- ✅ SLOs cumplidos durante el período de beta (4 semanas)
- ✅ NPS ≥ 7/10 para ambos segmentos (reclutadores y candidatos)
- ✅ Cero incidentes críticos durante beta
- ✅ Feedback de usuarios documentado y priorizado
- ✅ Plan de apertura general aprobado por stakeholders
- ✅ Presupuesto de costo LLM validado con datos reales

---

## fase 5 — módulo académico y colaboración

**Objetivo**: expandir funcionalidad para instituciones educativas con foco en aprendizaje colaborativo.

**Duración estimada**: 4-6 semanas

**Prioridad**: MEDIA - Expansión post-MVP

**Casos de uso a implementar**:
- [ ] UC-005: Registrar usuario (reclutador/candidato)
  - Registro con roles específicos: DOCENTE, ESTUDIANTE, RECLUTADOR
  - Perfil extendido: institución, carrera, nivel
- [ ] UC-006: Iniciar sesión y gestión de perfiles
  - OAuth 2.0: Google, GitHub, LinkedIn
  - Gestión de perfil: avatar, bio, skills
  - Configuración de notificaciones
- [ ] UC-007: Centralizar consultas a IA (repositorio colectivo)
  - Chat grupal por clase/curso
  - Historial de consultas compartido
  - Optimización de costos: caché de respuestas similares
  - Búsqueda en repositorio de conocimiento
- [ ] UC-008: Generar guías de estudio personalizadas
  - Input: tema, nivel, objetivos de aprendizaje
  - Output: guía estructurada con ejercicios progresivos
  - Integración con bibliografía (RF-024, RF-025)

**Entregables técnicos**:
- [ ] Implementación de RAG con pgvector
  - Embeddings de documentación técnica
  - Chunking strategy optimizada
  - Retrieval con similarity search
  - Integración con LangChain4j
- [ ] Sistema de roles granulares
  - DOCENTE: crear clases, asignar desafíos, ver progreso
  - ESTUDIANTE: resolver desafíos, consultar IA, compartir resoluciones
  - RECLUTADOR: crear puestos, ver talento
- [ ] Panel de administración para docentes
  - Gestión de clases y estudiantes
  - Asignación de desafíos
  - Dashboard de progreso grupal
  - Reportes de desempeño
- [ ] Compartición de resoluciones
  - Opción de hacer pública una resolución
  - Comentarios y discusión
  - Votación de mejores soluciones

**Definición de hecho**:
- ✅ UCs 005-008 implementados y testeados
- ✅ RAG funcionando con latencia < 2s
- ✅ Panel de docente usable y validado con usuarios
- ✅ Repositorio colectivo reduce costos de LLM en 30%
- ✅ Guías de estudio generadas con calidad ≥ 80%

---

## fase 6 — expansión corporativa

**Objetivo**: funcionalidades avanzadas para empresas y reclutadores.

**Duración estimada**: 8-12 semanas

**Prioridad**: MEDIA - Monetización y escalabilidad

**Casos de uso a implementar**:
- [ ] UC-009: Filtrar base de talento por tecnología y puntaje
  - Búsqueda avanzada de candidatos
  - Filtros: tecnología, seniority, puntaje mínimo, disponibilidad
  - Exportación de resultados
- [ ] UC-010: Crear simuladores de flujos de trabajo empresariales
  - Desafíos multi-etapa
  - Simulación de proyectos reales
  - Evaluación de trabajo en equipo (opcional)
- [ ] Integración con ATS (Applicant Tracking Systems)
  - API pública para integraciones
  - Webhooks para eventos
  - Sincronización de candidatos

**Entregables técnicos**:
- [ ] Base de datos de talento filtrable
  - Índices optimizados para búsqueda
  - Caché de resultados frecuentes
  - API pública documentada
- [ ] Analytics avanzados
  - Dashboard de métricas corporativas
  - Reportes personalizables
  - Exportación a PDF/Excel
- [ ] API pública v1
  - Documentación completa en OpenAPI
  - Rate limiting por cliente
  - Autenticación con API keys
  - SDKs para lenguajes populares

**Definición de hecho**:
- ✅ UCs 009-010 implementados
- ✅ API pública documentada y estable
- ✅ Al menos 3 integraciones con ATS funcionando
- ✅ Analytics validados con clientes enterprise

---

## fase 7 — monetización y certificación

**Objetivo**: modelo de negocio sostenible y certificación de competencias.

**Duración estimada**: 12-16 semanas

**Prioridad**: BAJA - Largo plazo

**Casos de uso a implementar**:
- [ ] UC-011: Emitir certificados digitales de finalización
  - Certificados verificables en blockchain (opcional)
  - Diseño personalizable por institución
  - Integración con LinkedIn
- [ ] UC-012: Sistema de suscripciones y pagos
  - Planes: Free, Pro, Enterprise
  - Procesamiento de pagos: Stripe
  - Facturación automática
  - Panel de administración de suscripciones

**Entregables técnicos**:
- [ ] Sistema de suscripciones
  - Planes con límites configurables
  - Upgrade/downgrade automático
  - Período de prueba gratuito
- [ ] Procesamiento de pagos
  - Integración con Stripe
  - Webhooks para eventos de pago
  - Manejo de fallos de pago
- [ ] Marketplace de desafíos premium
  - Desafíos creados por expertos
  - Sistema de valoración y reviews
  - Comisión por venta

**Definición de hecho**:
- ✅ Sistema de pagos funcionando en producción
- ✅ Al menos 10 clientes pagos
- ✅ Certificados emitidos y verificables
- ✅ Marketplace con al menos 50 desafíos premium

---

## fase 8 — iteración continua

**Objetivo**: mejorar con datos reales, no con suposiciones.

**Duración**: Continua

**Mecánica**:
- Ciclos de 2 semanas (sprints)
- Cada ciclo: 1 hipótesis, 1 cambio, 1 medición
- Backlog priorizado por impacto en métricas de producto
- Revisión de deuda técnica al menos una vez por trimestre
- Iteración sobre prompts y suite de evals: cada cambio de prompt pasa por evals antes de prod

**Actividades recurrentes**:
- [ ] Revisión de métricas de producto (semanal)
- [ ] Revisión de costos LLM (semanal)
- [ ] Revisión de deuda técnica (mensual)
- [ ] Actualización de suite de evals (mensual)
- [ ] Optimización de prompts (mensual)
- [ ] Auditoría de seguridad (trimestral)
- [ ] Revisión de roadmap (trimestral)

**No hay DoD final**: esta fase es continua.

---

## tablero de estado

| fase | estado | inicio | fin | notas |
|------|--------|--------|-----|-------|
| 0 — fundaciones | pendiente | — | — | Prerequisito para desarrollo |
| 1 — walking skeleton | pendiente | — | — | Validación arquitectura |
| 2 — MVP funcional | pendiente | — | — | **HACKATHON - 48-72h** |
| 3 — hardening | pendiente | — | — | Post-hackathon |
| 4 — lanzamiento | pendiente | — | — | Beta cerrada |
| 5 — módulo académico | planificado | — | — | Fase 2 producto |
| 6 — expansión corporativa | planificado | — | — | Fase 3 producto |
| 7 — monetización | planificado | — | — | Fase 4 producto |
| 8 — iteración | continua | — | — | Mejora continua |

---

## dependencias críticas

**Fase 0 → Fase 1**:
- Infraestructura completa funcionando
- LangChain4j configurado y testeado
- CI/CD pipeline operativo

**Fase 1 → Fase 2**:
- Walking skeleton validado end-to-end
- Suite de evals funcionando
- Observabilidad básica implementada

**Fase 2 → Fase 3**:
- MVP funcional demost

---

**User:**

[write_to_file for 'product/ROADMAP.md'] Result:
The tool execution failed with the following error:
<error>
This appears to be content for an existing file.
Note: Your response may have been truncated because it exceeded your output limit. You wrote 860 lines of content, but the line_count parameter was either missing or not included in your response.

RECOMMENDED APPROACH:
1. Try again with the line_count parameter in your response if you forgot to include it
2. Or try using apply_diff instead of write_to_file for targeted changes
3. Or use insert_content to add specific content at particular lines

# Reminder: Instructions for Tool Use

Tool uses are formatted using XML-style tags. The tool name itself becomes the XML tag name. Each parameter is enclosed within its own set of tags. Here's the structure:

<actual_tool_name>
<parameter1_name>value1</parameter1_name>
<parameter2_name>value2</parameter2_name>
...
</actual_tool_name>

For example, to use the attempt_completion tool:

<attempt_completion>
<result>
I have completed the task...
</result>
</attempt_completion>

Always use the actual tool name as the XML tag name for proper parsing and execution.
</error>
<environment_details>
# VSCode Visible Files
product/ROADMAP.md

# VSCode Open Tabs
product/Talent pool app.md,product/PRODUCT.md,product/ROADMAP.md,product/ARCHITECTURE.md,README.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
product/ROADMAP.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T18:03:55.667Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.09

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I need to include the line_count parameter. Let me write the complete roadmap file with the correct parameter:

<write_to_file>
<path>product/ROADMAP.md</path>
<content>
# ROADMAP.md — fases de desarrollo

> Documento vivo. Se actualiza al cierre de cada fase.
> Última revisión: 2026-05-01

---

## principios de avance

1. **Una fase no empieza hasta que la anterior está cerrada con DoD verificada.**
2. **Cada fase termina con una demo y una entrada en `CHANGELOG.md`.**
3. **No se desarrollan UCs hasta haber completado fase 0 y fase 1.**
4. **Deuda técnica detectada se registra en `TECH_DEBT.md` antes de avanzar.**

---

## fase 0 — fundaciones

**Objetivo**: dejar el repo y la infraestructura listos para que el desarrollo de features sea mecánico y seguro.

**Duración estimada**: 3-5 días

**Entregables backend (Quarkus)**:
- [ ] Repo inicializado con la estructura de carpetas de `ARCHITECTURE.md` §3
  - `src/main/java/com/talentpool/` con subcarpetas: domain, application, infrastructure, api
  - `src/main/resources/` con db/migration, prompts, application.yml
  - `src/test/java/` con estructura paralela
- [ ] `pom.xml` con dependencias Quarkus + LangChain4j en versiones fijadas
  - Quarkus 3.x (última LTS)
  - LangChain4j 0.35.x o superior
  - PostgreSQL driver + Flyway
  - Hibernate ORM con Panache
  - RESTEasy Reactive + Jackson
  - Micrometer + OpenTelemetry
- [ ] Maven wrapper (`mvnw`) versionado en el repo
- [ ] `.editorconfig` y plugin Spotless configurado para Java
  - Google Java Style Guide como base
  - Configuración en `pom.xml` con fase `validate`
- [ ] Checkstyle o equivalente para reglas de estilo
  - Archivo `checkstyle.xml` en raíz
  - Integrado en Maven lifecycle
- [ ] Flyway configurado con migración inicial vacía
  - `V001__initial_schema.sql` con comentario placeholder
  - Configuración en `application.yml` con estrategia clean en dev
- [ ] Configuración base en `application.yml` con perfiles dev/test/prod
  - Datasource con Quarkus Dev Services
  - Logging JSON estructurado (formato ECS)
  - Configuración de CORS para frontend local
  - Placeholder para LangChain4j config
- [ ] Quarkus Dev Services levanta Postgres en local sin configuración manual
  - Incluir pgvector extension habilitada
  - Seed data opcional para desarrollo
- [ ] Logging JSON estructurado configurado
  - Formato: timestamp, level, logger, message, context
  - Configuración de niveles por paquete
- [ ] Endpoints `/q/health/live`, `/q/health/ready`, `/q/metrics` respondiendo
  - Health checks personalizados para BD y LLM provider
- [ ] OpenAPI generándose en `/q/openapi`
  - Anotaciones Swagger en recursos REST
  - Esquemas de request/response documentados
- [ ] Test mínimo `@QuarkusTest` funcionando
  - Test de health endpoint
  - Test de inyección CDI básica
- [ ] Configuración de LangChain4j con un proveedor (Ollama para dev, configurable para staging/prod)
  - Bean CDI `ChatLanguageModel` con @ApplicationScoped
  - Configuración externalizada en application.yml
  - Soporte para múltiples providers (OpenAI, Anthropic, Ollama)
- [ ] Bean CDI de ChatModel inyectable y testeado con MockChatModel
  - Test unitario con respuesta mockeada
  - Validación de timeout y retry

**Entregables frontend (React + TypeScript)**:
- [ ] Proyecto Vite + React + TypeScript
  - Estructura de carpetas: src/{components, pages, services, hooks, types, utils}
  - Configuración de path aliases (@/ para src/)
- [ ] eslint, prettier, tsc configurados con perfil estricto
  - ESLint con reglas React + TypeScript recomendadas
  - Prettier con formato consistente (2 espacios, single quotes)
  - Pre-commit hooks con Husky + lint-staged
- [ ] Cliente HTTP tipado generado desde OpenAPI (`openapi-typescript`)
  - Script npm para regenerar tipos desde backend
  - Axios o Fetch wrapper tipado
- [ ] Página vacía que llama a un endpoint trivial del backend (`/health`)
  - Componente de prueba de conectividad
  - Manejo de errores básico
- [ ] Test mínimo Vitest funcionando
  - Test de componente simple
  - Configuración de coverage
- [ ] Test mínimo Playwright funcionando contra el dev server
  - Test e2e de carga de página principal
  - Configuración de múltiples navegadores

**Entregables infraestructura**:
- [ ] `docker-compose.yml` para entorno local completo
  - postgres:16-alpine con pgvector
  - redis:7-alpine (para caché y rate limiting)
  - ollama/ollama:latest (LLM local para desarrollo)
  - backend en modo dev (hot reload)
  - frontend en modo dev (hot reload)
  - Volúmenes persistentes para BD y modelos
- [ ] `Dockerfile.backend.jvm` funcional
  - Multi-stage build: Maven build + JRE runtime
  - Imagen base: eclipse-temurin:21-jre-alpine
  - Optimización de capas para caché
- [ ] `Dockerfile.frontend` funcional
  - Multi-stage build: npm build + nginx
  - Configuración nginx para SPA routing
- [ ] (Opcional fase 0, obligatorio antes de fase 3) `Dockerfile.backend.native`
  - GraalVM native-image build
  - Configuración de reflection hints
- [ ] Pipeline de CI mínimo verde (lint + tests placeholder + build)
  - GitHub Actions o GitLab CI
  - Jobs: lint-backend, lint-frontend, test-backend, test-frontend, build
  - Caché de dependencias Maven y npm
- [ ] Pipeline de deploy a entorno staging real
  - Opción 1: Fly.io (recomendado para hackathon)
  - Opción 2: Render o Railway
  - Variables de entorno configuradas
  - Deploy automático en merge a main
- [ ] SonarQube / SonarCloud integrado con quality gate en modo suave (warning)
  - Análisis de código en cada PR
  - Métricas: cobertura, duplicación, code smells
  - Quality gate: cobertura > 70%, sin bugs críticos

**Entregables documentación**:
- [ ] Plantillas en `docs/`: ADR, UC, runbook
  - `docs/adr/0000-template.md` (ya existe)
  - `docs/uc/UC-template.md` (ya existe)
  - `docs/runbooks/incident-template.md` (ya existe)
- [ ] `CONTRIBUTING.md`, `CHANGELOG.md`, `TECH_DEBT.md` creados
  - CONTRIBUTING.md con guía de desarrollo, branching strategy, PR template
  - CHANGELOG.md con formato Keep a Changelog
  - TECH_DEBT.md con template de registro
- [ ] ADR-0001 (stack base) cerrado
  - Justificación de Quarkus + LangChain4j + React
  - Alternativas consideradas
  - Consecuencias y trade-offs
- [ ] ADR-0002 (estrategia RAG y vector store) cerrado
  - Decisión de usar pgvector vs alternativas
  - Estrategia de embeddings y chunking
  - Plan de implementación en Fase 2
- [ ] ADR-0003 (estrategia de evaluación de LLMs) cerrado
  - Framework de evals (LangChain4j evals o custom)
  - Métricas: precisión, consistencia, latencia, costo
  - Golden dataset inicial (30 casos)

**Definición de hecho**:
- ✅ Cualquier desarrollador puede levantar el proyecto local con un comando (`./mvnw quarkus:dev` y `pnpm dev`)
- ✅ CI pasa en verde con todos los checks
- ✅ Deploy a staging exitoso de un "hello world" que responde por API y se renderiza en el frontend
- ✅ Documentación de setup en README.md actualizada y validada
- ✅ Todos los ADRs de fase 0 cerrados y revisados

---

## fase 1 — walking skeleton

**Objetivo**: validar la arquitectura completa de punta a punta con la feature más fina posible, incluyendo una primera capacidad LLM trivial.

**Duración estimada**: 5-7 días

**Alcance**:
- Un usuario puede registrarse, hacer login, y ver una pantalla autenticada con un input que envía un mensaje a un LLM y muestra la respuesta.
- Todo el flujo pasa por: frontend → API → BD → LangChain4j → proveedor LLM → respuesta → render.
- Deployado a staging, observable, con tests, con guardrails básicos, con costo monitoreado.

**Entregables backend**:
- [ ] Migración Flyway con tabla `users`
  - Campos: id, email, password_hash, role (ENUM: RECLUTADOR, CANDIDATO), created_at, updated_at
  - Índices: unique en email, index en role
  - Constraints: email format validation
- [ ] Endpoints `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/users/me`
  - POST /auth/register: crea usuario, retorna token JWT
  - POST /auth/login: valida credenciales, retorna token JWT
  - GET /users/me: retorna perfil del usuario autenticado
  - Validación de input con Bean Validation
- [ ] Endpoint `/api/v1/chat` con un AiService trivial
  - POST /chat: recibe mensaje, retorna respuesta del LLM
  - Prompt simple: "Eres un asistente técnico. Responde de forma concisa."
  - Streaming opcional (SSE) para mejor UX
- [ ] Auth implementada según `ARCHITECTURE.md` §7
  - JWT con SmallRye JWT
  - Roles: RECLUTADOR, CANDIDATO
  - Interceptor para validación de roles en endpoints
  - Refresh token strategy (opcional en fase 1)
- [ ] Guardrails de input mínimos
  - Longitud máxima de mensaje: 2000 caracteres
  - Detección básica de inyección de prompts
  - Sanitización de HTML/scripts
- [ ] Rate limit por usuario en `/api/v1/chat`
  - Redis-based rate limiter
  - Límite: 10 requests/minuto por usuario
  - Respuesta 429 con Retry-After header
- [ ] Tests: unitarios de dominio, integración `@QuarkusTest`, e2e
  - Unitarios: lógica de negocio, validaciones
  - Integración: endpoints con BD en memoria (H2 o Testcontainers)
  - E2E: flujo completo registro → login → chat
- [ ] Test de unidad del AiService usando `MockChatModel`
  - Mock de respuestas del LLM
  - Validación de prompts enviados
  - Test de timeout y retry
- [ ] Suite de evals mínima (3-5 prompts) corriendo en CI
  - Eval 1: Respuesta coherente a pregunta técnica simple
  - Eval 2: Rechazo de pregunta fuera de dominio
  - Eval 3: Formato de respuesta estructurado
  - Eval 4: Consistencia en respuestas similares
  - Eval 5: Latencia < 5s
- [ ] Logs, métricas (incluyendo tokens y costo), trazas visibles
  - Logs: JSON estructurado con correlation ID
  - Métricas: Micrometer con contadores de requests, latencia, tokens
  - Trazas: OpenTelemetry con spans para LLM calls
  - Dashboard básico en Grafana o similar
- [ ] Deploy a staging
  - Variables de entorno configuradas (LLM API key, JWT secret)
  - Health checks configurados en load balancer
  - Logs centralizados (Loki, CloudWatch, etc.)

**Entregables frontend**:
- [ ] Páginas: registro, login, home autenticada con chat simple
  - /register: formulario con email, password, confirmación
  - /login: formulario con email, password
  - /home: dashboard con chat interface
  - Navegación con React Router
- [ ] Componentes reutilizables
  - Input con validación
  - Button con estados (loading, disabled)
  - ChatMessage component
  - Layout con header y sidebar
- [ ] Manejo de estado con Context API o Zustand
  - AuthContext: usuario, token, login, logout
  - ChatContext: mensajes, enviar mensaje
- [ ] Integración con API backend
  - Axios instance con interceptors
  - Manejo de tokens en headers
  - Refresh token automático
- [ ] Manejo de errores y loading states
  - Error boundaries
  - Toasts para notificaciones
  - Skeletons para loading

**Entregables observabilidad**:
- [ ] Métricas de negocio
  - Contador de registros exitosos
  - Contador de logins exitosos
  - Contador de mensajes de chat
  - Distribución de latencia de LLM
- [ ] Métricas de costo LLM
  - Tokens de entrada por request
  - Tokens de salida por request
  - Costo estimado por request (según pricing del provider)
  - Costo acumulado diario
- [ ] Alertas básicas
  - Latencia p95 > 10s
  - Error rate > 5%
  - Costo diario > umbral definido
  - Health check fallando

**Definición de hecho**:
- ✅ Un humano puede registrarse en staging, loguearse, mandar un mensaje al LLM y ver la respuesta
- ✅ Las métricas muestran latencia, tokens consumidos y costo estimado del chat
- ✅ Test e2e en CI verde de forma estable (sin flakiness)
- ✅ Suite de evals corriendo y registrando resultados (todos pasando)
- ✅ Logs estructurados visibles en herramienta de observabilidad
- ✅ Documentación de API actualizada en OpenAPI
- ✅ Demo grabada del flujo completo

---

## fase 2 — MVP funcional (Hackathon)

**Objetivo**: implementar los UCs marcados como críticos en `PRODUCT.md` para tener un MVP demostrable en hackathon.

**Duración estimada**: 48-72 horas

**Prioridad**: CRÍTICA - Bloqueante para demo de hackathon

### UC-001: Generar desafío técnico automatizado
**Duración**: 12-16 horas | **RF**: RF-001 a RF-009 | **RNF**: RNF-001

**Entregables**:
- [ ] Migración Flyway: tabla `PUESTO` (id, titulo, tecnologia_principal, seniority, descripcion, created_by, created_at)
- [ ] Migración Flyway: tabla `DESAFIO` (id, puesto_id, enunciado, contexto, rubrica_oculta JSONB, dificultad, created_at)
- [ ] POST `/api/v1/puestos` - Crear puesto con validaciones
- [ ] POST `/api/v1/puestos/{id}/desafios/generar` - Generar desafío con LLM
- [ ] AiService con prompt template `prompts/generar-desafio.txt`
- [ ] Guardrails: validación JSON, longitud, estructura de rúbrica
- [ ] Tests: unitarios, integración, evals (n=10 desafíos)
- [ ] Frontend: formulario creación puesto + botón generar desafío

**Criterios de aceptación**:
- ✅ Generación en < 30s (RNF-001)
- ✅ Rúbrica JSONB válida y estructurada
- ✅ Relevancia ≥ 85% según evals
- ✅ Desafío personalizado por tecnología y seniority

### UC-002: Resolver desafío y evaluar mediante análisis estático
**Duración**: 16-20 horas | **RF**: RF-010 a RF-015, RF-034 | **RNF**: RNF-001

**Entregables**:
- [ ] Migración Flyway: tabla `EVALUACION` (id, desafio_id, candidato_id, codigo_entregado, puntaje, feedback JSONB, estado, submitted_at, evaluated_at)
- [ ] GET `/api/v1/desafios/{id}` - Ver desafío (sin rúbrica)
- [ ] POST `/api/v1/desafios/{id}/evaluaciones` - Enviar solución
- [ ] GET `/api/v1/evaluaciones/{id}` - Obtener resultado
- [ ] AiService con prompt template `prompts/evaluar-codigo.txt`
- [ ] Análisis estático: lógica, eficiencia, buenas prácticas (RF-015)
- [ ] Feedback estructurado JSONB: puntaje, puntos_fuertes, areas_mejora, sugerencias
- [ ] Tests: unitarios, integración, evals (precisión ≥ 80%, consistencia ≥ 90%)
- [ ] Frontend: editor de código (Monaco/CodeMirror) + vista de resultados

**Criterios de aceptación**:
- ✅ Evaluación en < 10s
- ✅ Puntaje 0-100 con feedback detallado
- ✅ Precisión ≥ 80% vs golden set
- ✅ Consistencia ≥ 90% en evaluaciones repetidas
- ✅ Retroalimentación constructiva (RF-034)

### UC-003: Visualizar ranking de candidatos y reportes
**Duración**: 8-12 horas | **RF**: RF-027, RF-029 | **RNF**: RNF-008

**Entregables**:
- [ ] GET `/api/v1/desafios/{id}/ranking` - Ranking paginado
- [ ] GET `/api/v1/evaluaciones/{id}/detalle` - Detalle completo (solo reclutador)
- [ ] GET `/api/v1/puestos/{id}/estadisticas` - Métricas agregadas
- [ ] Tests: integración, e2e
- [ ] Frontend: dashboard reclutador con tabla ranking + gráficos
- [ ] Frontend: vista detalle evaluación con código y feedback

**Criterios de aceptación**:
- ✅ Ranking ordenado por puntaje DESC
- ✅ Filtros: puntaje mínimo, fecha
- ✅ Estadísticas: total evaluaciones, promedio, distribución
- ✅ Interfaz intuitiva (RNF-008)

### UC-004: Acceder y seleccionar desafíos (candidato)
**Duración**: 6-8 horas | **RF**: RF-010, RF-011

**Entregables**:
- [ ] GET `/api/v1/desafios` - Catálogo con filtros (tecnologia, seniority, dificultad)
- [ ] GET `/api/v1/desafios/{id}/mis-evaluaciones` - Historial del candidato
- [ ] Tests: integración, e2e
- [ ] Frontend: catálogo con cards + filtros
- [ ] Frontend: historial de evaluaciones propias

**Criterios de aceptación**:
- ✅ Catálogo filtrable y paginado
- ✅ Historial acumulado de puntuación (RF-011)
- ✅ Múltiples intentos permitidos (RF-010)

**Definición de hecho de fase 2**:
- ✅ UC-001 a UC-004 completados con criterios de aceptación
- ✅ Cobertura: backend ≥ 75%, frontend ≥ 60%
- ✅ Suite de evals: calidad ≥ 85%, precisión ≥ 80%, consistencia ≥ 90%
- ✅ Métricas de producto: ≥ 50 desafíos, ≥ 100 evaluaciones, completitud ≥ 60%
- ✅ Deploy a staging estable
- ✅ Video demo 5 minutos para hackathon

---

## fase 3 — hardening (Post-Hackathon)

**Objetivo**: preparar el sistema para usuarios reales.

**Duración estimada**: 2-3 semanas

**Entregables seguridad**:
- [ ] Auditoría OWASP Top 10
- [ ] Encriptación: passwords (bcrypt), datos sensibles (RNF-004)
- [ ] MFA para reclutadores (RNF-005)
- [ ] Cumplimiento GDPR/LGPD (RNF-007)
- [ ] Política de privacidad y términos de uso

**Entregables calidad**:
- [ ] SonarQube quality gate bloqueante (cobertura ≥ 80%)
- [ ] Pruebas de carga: 100 usuarios concurrentes (RNF-003)
- [ ] Pruebas de costo LLM: proyección mensual < USD 500
- [ ] Pruebas de caos: caída BD, caída LLM, latencia alta

**Entregables operación**:
- [ ] Backups automáticos diarios con restore probado
- [ ] Alertas para todos los SLOs
- [ ] Runbooks: BD caída, LLM caído, latencia alta, costo disparado
- [ ] Build nativo GraalVM (startup < 100ms, memoria < 256MB)
- [ ] Plan de rollback probado (< 5 min)

**Definición de hecho**:
- ✅ Carga: latencia p95 < 400ms con 300 usuarios
- ✅ Restore desde backup exitoso (< 1h)
- ✅ Cero hallazgos críticos de seguridad
- ✅ Disponibilidad ≥ 99.5% durante 1 semana en staging

---

## fase 4 — lanzamiento controlado

**Objetivo**: validar con usuarios reales.

**Duración estimada**: 3-4 semanas

**Estrategia**:
- [ ] Beta cerrada: 30 usuarios (10 reclutadores, 20 candidatos)
- [ ] Onboarding guiado + soporte
- [ ] Feedback loop: encuestas NPS, bug reports, feature requests
- [ ] Telemetría: Mixpanel/Amplitude (eventos, funnels, retención)
- [ ] Monitoreo de costos LLM en tiempo real

**Métricas de éxito**:
- [ ] Desafíos generados: ≥ 50
- [ ] Evaluaciones completadas: ≥ 100
- [ ] NPS: ≥ 7/10 (reclutadores y candidatos)
- [ ] Disponibilidad: ≥ 99%
- [ ] Costo por 100 evaluaciones: < USD 5

**Apertura gradual**:
- Semana 1-2: 30 usuarios
- Semana 3: 100 usuarios
- Semana 4: 500 usuarios
- Post-semana 4: Apertura general

**Definición de hecho**:
- ✅ Métricas de producto cumplidas con datos reales
- ✅ SLOs cumplidos durante 4 semanas
- ✅ NPS ≥ 7/10
- ✅ Cero incidentes críticos

---

## fase 5 — módulo académico y colaboración

**Objetivo**: expansión para instituciones educativas.

**Duración estimada**: 4-6 semanas

**Casos de uso**:
- [ ] UC-005: Registro con roles DOCENTE/ESTUDIANTE
- [ ] UC-006: OAuth (Google, GitHub, LinkedIn) + gestión de perfil
- [ ] UC-007: Repositorio colectivo de consultas IA (RF-028)
- [ ] UC-008: Guías de estudio personalizadas (RF-019 a RF-025)

**Entregables técnicos**:
- [ ] RAG con pgvector: embeddings, chunking, retrieval
- [ ] Roles granulares: DOCENTE, ESTUDIANTE, RECLUTADOR
- [ ] Panel de administración para docentes
- [ ] Compartición de resoluciones

**Definición de hecho**:
- ✅ UC-005 a UC-008 implementados
- ✅ RAG con latencia < 2s
- ✅ Reducción de costos LLM en 30%

---

## fase 6 — expansión corporativa

**Objetivo**: funcionalidades enterprise.

**Duración estimada**: 8-12 semanas

**Casos de uso**:
- [ ] UC-009: Filtrar base de talento (RF-026, RF-027)
- [ ] UC-010: Simuladores de flujos empresariales (RF-017, RF-018)

**Entregables técnicos**:
- [ ] Base de datos de talento filtrable
- [ ] Analytics avanzados + reportes
- [ ] API pública v1 con documentación
- [ ] Integración con ATS

**Definición de hecho**:
- ✅ UC-009 y UC-010 implementados
- ✅ API pública estable
- ✅ ≥ 3 integraciones ATS funcionando

---

## fase 7 — monetización y certificación

**Objetivo**: modelo de negocio sostenible.

**Duración estimada**: 12-16 semanas

**Casos de uso**:
- [ ] UC-011: Certificados digitales (RF-031)
- [ ] UC-012: Suscripciones y pagos (RF-032)

**Entregables técnicos**:
- [ ] Sistema de suscripciones (Free, Pro, Enterprise)
- [ ] Procesamiento de pagos con Stripe
- [ ] Marketplace de desafíos premium

**Definición de hecho**:
- ✅ Pagos funcionando en producción
- ✅ ≥ 10 clientes pagos
- ✅ Certificados verificables

---

## fase 8 — iteración continua

**Objetivo**: mejora continua basada en datos.

**Mecánica**:
- Sprints de 2 semanas
- Backlog priorizado por impacto
- Revisión de deuda técnica mensual
- Optimización de prompts mensual
- Auditoría de seguridad trimestral

**Actividades recurrentes**:
- [ ] Métricas de producto (semanal)
- [ ] Costos LLM (semanal)
- [ ] Deuda técnica (mensual)
- [ ] Suite de evals (mensual)
- [ ] Auditoría de seguridad (trimestral)

---

## tablero de estado

| fase | estado | inicio | fin | notas |
|------|--------|--------|-----|-------|
| 0 — fundaciones | pendiente | — | — | Prerequisito |
| 1 — walking skeleton | pendiente | — | — | Validación arquitectura |
| 2 — MVP funcional | pendiente | — | — | **HACKATHON 48-72h** |
| 3 — hardening | pendiente | — | — | Post-hackathon |
| 4 — lanzamiento | pendiente | — | — | Beta cerrada |
| 5 — módulo académico | planificado | — | — | Fase 2 producto |
| 6 — expansión corporativa | planificado | — | — | Fase 3 producto |
| 7 — monetización | planificado | — | — | Fase 4 producto |
| 8 — iteración | continua | — | — | Mejora continua |

---

## dependencias críticas

**Fase 0 → Fase 1**: Infraestructura completa + LangChain4j configurado + CI/CD operativo

**Fase 1 → Fase 2**: Walking skeleton validado + suite de evals + observabilidad básica

**Fase 2 → Fase 3**: MVP funcional demostrado + métricas de hackathon cumplidas

**Fase 3 → Fase 4**: Sistema hardened + auditoría de seguridad aprobada + SLOs validados

**Fase 4 → Fase 5**: Lanzamiento exitoso + feedback de usuarios + métricas de producto estables

---

## mapeo de requerimientos a fases

**MVP (Fase 2)**:
- RF: 001-015, 034
- RNF: 001, 008, 009

**Post-MVP (Fases 3-4)**:
- RF: 026, 027, 029
- RNF: 002-007, 010-013, 015

**Expansión (Fases 5-7)**:
- RF: 016-025, 028, 030-033, 035
- RNF: 014

---

**Fin del documento ROADMAP.md**
</content>
<line_count>717</line_count>
</write_to_file>

---

**User:**

[write_to_file for 'product/ROADMAP.md'] Result:
<file_write_result>
<path>product/ROADMAP.md</path>
<operation>modified</operation>
<user_edits>@@ -560,4 +560,4 @@
 
 ---
 
-**Fin del documento ROADMAP.md**
\ No newline at end of file
+**Fin del documento ROADMAP.md**
</user_edits>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
<i>If the user's edits have addressed part of the task or changed the requirements, adjust your approach accordingly.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
product/ROADMAP.md

# VSCode Open Tabs
product/Talent pool app.md,product/PRODUCT.md,product/ROADMAP.md,product/ARCHITECTURE.md,README.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
product/ROADMAP.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T18:08:13.497Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.18

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<attempt_completion>
<result>
Successfully generated comprehensive project roadmap based on ARCHITECTURE.md, PRODUCT.md, and rf-rnf.md specifications.

## Key Highlights:

### **8 Development Phases**:
1. **Fase 0 - Fundaciones** (3-5 días): Infrastructure setup, Quarkus + LangChain4j configuration, CI/CD pipeline
2. **Fase 1 - Walking Skeleton** (5-7 días): End-to-end architecture validation with basic LLM capability
3. **Fase 2 - MVP Funcional** (48-72h HACKATHON): Implementation of 4 critical use cases (UC-001 to UC-004)
4. **Fase 3 - Hardening** (2-3 semanas): Security, load testing, operational readiness
5. **Fase 4 - Lanzamiento Controlado** (3-4 semanas): Beta launch with real users
6. **Fase 5 - Módulo Académico** (4-6 semanas): Educational features with RAG
7. **Fase 6 - Expansión Corporativa** (8-12 semanas): Enterprise features and API
8. **Fase 8 - Iteración Continua**: Ongoing improvement cycles

### **MVP Hackathon Focus (Fase 2)**:
- **UC-001**: Generate technical challenges automatically (12-16h)
- **UC-002**: Solve and evaluate with static analysis (16-20h)
- **UC-003**: View candidate rankings and reports (8-12h)
- **UC-004**: Access and select challenges (6-8h)

### **Mapped Requirements**:
- **Functional**: RF-001 to RF-015, RF-034 for MVP
- **Non-Functional**: RNF-001 (generation < 30s, evaluation < 10s), RNF-008, RNF-009

### **Success Metrics Defined**:
- ≥ 50 challenges generated
- ≥ 100 evaluations completed
- Challenge quality ≥ 85%
- Evaluation precision ≥ 80%
- NPS ≥ 7/10

### **Clear DoD (Definition of Done)** for each phase with specific deliverables, acceptance criteria, and validation steps.

The roadmap provides a structured, incremental approach from hackathon MVP to full production system with monetization.
</result>
</attempt_completion>

