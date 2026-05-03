**User:**

<task>
Update the attached README.md template using the PRODUCT.md and ARCHITECTURE.md specifications. Ensure the copy reflects our MVP scope, the Quarkus + LangChain4j stack, and the core user flows defined[cite: 1, 2]. Keep it professional, technical, and concise.
</task>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
product/Talent pool app.md,product/PRODUCT.md,product/ARCHITECTURE.md,README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T17:13:21.339Z
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

I'll help you update the README.md using the specifications from PRODUCT.md and ARCHITECTURE.md. Let me start by reading these files to understand the requirements.

<read_file>
<args>
<file>
<path>README.md</path>
</file>
<file>
<path>product/PRODUCT.md</path>
</file>
<file>
<path>product/ARCHITECTURE.md</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'README.md', 'product/PRODUCT.md', 'product/ARCHITECTURE.md'] Result:
<files>
<file><path>README.md</path>
<content lines="1-106">
  1 | # Plantilla de proyecto para desarrollo asistido por agente
  2 | 
  3 | Paquete genérico para iniciar una aplicación de software profesional, escalable, segura y mantenible, trabajando con Claude Code u otro agente de código.
  4 | 
  5 | **Stack**: Quarkus + Java 21 + LangChain4j + PostgreSQL + pgvector + React + TypeScript + Vite.
  6 | 
  7 | ## Estructura
  8 | 
  9 | ```
 10 | project-template/
 11 | ├── README.md                                      → guía de uso del paquete
 12 | ├── PRODUCT.md                                     → qué construimos y por qué
 13 | ├── ARCHITECTURE.md                                → cómo lo construimos (cerrado)
 14 | ├── ROADMAP.md                                     → fases 0 a 5 con DoD
 15 | ├── CONTRIBUTING.md                                → reglas para humanos y agentes
 16 | ├── CHANGELOG.md                                   → bitácora de versiones
 17 | ├── TECH_DEBT.md                                   → registro de deuda técnica
 18 | ├── sonar-project.properties                       → configuración de SonarQube
 19 | ├── .github/
 20 | │   ├── pull_request_template.md                   → plantilla de PR
 21 | │   └── workflows/
 22 | │       ├── ci.yml                                 → maven verify, vitest, e2e, evals smoke, sonar
 23 | │       ├── cd.yml                                 → deploy a staging y producción
 24 | │       └── codeql.yml                             → análisis de seguridad SAST (Java + TS)
 25 | └── docs/
 26 |     ├── adr/
 27 |     │   ├── 0000-template.md                       → plantilla de ADR
 28 |     │   ├── 0001-stack-base.md                     → ADR: Quarkus + LangChain4j + React
 29 |     │   ├── 0002-rag-vector-store.md               → ADR: pgvector + LangChain4j RAG
 30 |     │   └── 0003-llm-evals.md                      → ADR: estrategia de evals
 31 |     ├── uc/
 32 |     │   ├── UC-template.md                         → plantilla de caso de uso (incluye sección LLM)
 33 |     │   └── UC-001-registrar-usuario.md            → UC ejemplo completo
 34 |     └── runbooks/
 35 |         └── incident-template.md                   → plantilla operacional
 36 | ```
 37 | 
 38 | ## Cómo usar este paquete
 39 | 
 40 | 1. Copiá el contenido de esta carpeta a la raíz de tu repositorio.
 41 | 2. Completá `PRODUCT.md` con la idea concreta de tu app.
 42 | 3. Revisá y ajustá `ARCHITECTURE.md` (especialmente §2 stack y §3 estructura).
 43 | 4. Ajustá `ROADMAP.md` a tus fases reales.
 44 | 5. Configurá los secrets de GitHub (ver abajo).
 45 | 6. Ajustá `sonar-project.properties` con tu `projectKey` y `organization`.
 46 | 7. Leé `CONTRIBUTING.md` y compartilo con el agente como contexto.
 47 | 8. Cada UC se desarrolla a partir de su archivo en `docs/uc/`.
 48 | 
 49 | ## Lo que el agente va a construir en fase 0
 50 | 
 51 | A partir de este paquete, el agente puede generar:
 52 | 
 53 | - `backend/pom.xml` con Quarkus BOM, LangChain4j BOM y dependencias clave
 54 | - `backend/src/main/resources/application.yml` con perfiles dev/test/prod
 55 | - Estructura completa de paquetes Java según `ARCHITECTURE.md` §3
 56 | - `frontend/package.json`, `vite.config.ts`, `tsconfig.json`
 57 | - `infra/compose/docker-compose.yml` con Postgres+pgvector, Redis, Ollama
 58 | - `infra/docker/Dockerfile.backend.jvm`, `Dockerfile.backend.native` (perfil avanzado), `Dockerfile.frontend`
 59 | - Migración Flyway inicial vacía
 60 | - Endpoints `/q/health/*` funcionando
 61 | - Test mínimo `@QuarkusTest` y test mínimo Vitest
 62 | 
 63 | ## Secrets de GitHub a configurar
 64 | 
 65 | En `Settings → Secrets and variables → Actions`:
 66 | 
 67 | | secret | uso | dónde se obtiene |
 68 | |--------|-----|------------------|
 69 | | `SONAR_TOKEN` | autenticación con Sonar | sonarcloud.io / sonarqube self-hosted |
 70 | | `SONAR_HOST_URL` | URL de Sonar | `https://sonarcloud.io` o tu instancia |
 71 | | `STAGING_DB_JDBC_URL` | conexión a BD de staging | tu proveedor cloud |
 72 | | `STAGING_DB_USERNAME` / `STAGING_DB_PASSWORD` | credenciales BD staging | tu proveedor cloud |
 73 | | `PROD_DB_JDBC_URL` | conexión a BD de producción | tu proveedor cloud |
 74 | | `PROD_DB_USERNAME` / `PROD_DB_PASSWORD` | credenciales BD producción | tu proveedor cloud |
 75 | | `LLM_API_KEY` | acceso al proveedor LLM | OpenAI / Anthropic / etc. |
 76 | 
 77 | Más secrets (registry, cloud, etc.) según tus integraciones.
 78 | 
 79 | ## Environments de GitHub a configurar
 80 | 
 81 | En `Settings → Environments`:
 82 | 
 83 | - **staging**: sin restricciones, deploy automático en push a `main`.
 84 | - **production**: con `required reviewers` activado para forzar aprobación manual antes del deploy.
 85 | 
 86 | ## Branch protection
 87 | 
 88 | En `Settings → Branches → Add rule` para `main`:
 89 | 
 90 | - Require pull request reviews before merging (al menos 1)
 91 | - Require status checks to pass: `backend`, `frontend`, `e2e`, `sonar`, `docker-build`
 92 | - Require branches to be up to date before merging
 93 | - Do not allow bypassing the above settings
 94 | 
 95 | ## Principios
 96 | 
 97 | - **Decisiones cerradas, no abiertas**. El agente no elige stack ni arquitectura: las ejecuta.
 98 | - **Tests inmutables**. Si un test falla, se arregla el código, nunca el test.
 99 | - **Tests LLM siempre con mock**. Llamadas reales solo en suite de evals controlada.
100 | - **Deuda registrada o no existe**. Atajo no documentado = bug futuro.
101 | - **Sin ambigüedad**. Cada UC tiene criterios verificables; cada PR tiene DoD.
102 | - **Seguridad y observabilidad desde día 1**. No son fases finales.
103 | - **Calidad medida, no asumida**. Linters, tests, evals y Sonar bloquean en CI.
104 | - **Costo controlado**. Cada UC con LLM declara su presupuesto de tokens y costo.
105 | # ibm-hackathon-talent-pool
106 | # ibm-hackathon-talent-pool
</content>
</file>
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
</files>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
product/Talent pool app.md,product/PRODUCT.md,product/ARCHITECTURE.md,README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T17:13:29.031Z
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

I'll update the README.md to reflect the Talent Pool MVP specifications. Let me read specific sections from ARCHITECTURE.md to get the complete technical details.

<read_file>
<args>
<file>
<path>product/ARCHITECTURE.md</path>
<line_range>1-88</line_range>
<line_range>89-146</line_range>
<line_range>147-311</line_range>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'product/ARCHITECTURE.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>product/ARCHITECTURE.md</path>
<content lines="1-88">
 1 | # ARCHITECTURE.md — arquitectura del sistema
 2 | 
 3 | > Decisiones cerradas. El agente NO debe re-decidir lo que está acá.
 4 | > Cada cambio requiere un ADR nuevo en `docs/adr/`.
 5 | > Última revisión: 2026-05-01
 6 | 
 7 | ---
 8 | 
 9 | ## 1. visión general
10 | 
11 | ### 1.1 estilo arquitectónico
12 | **Decisión**: monolito modular en backend + SPA desacoplada en frontend.
13 | **Justificación**: simplicidad operativa para MVP de hackathon, despliegue independiente de UI y API, evolución a microservicios solo si la escala lo exige post-fase 3 (ver ADR-0001).
14 | 
15 | ### 1.2 diagrama C4 — nivel 1 (contexto)
16 | ```
17 | ┌─────────────────┐
18 | │  Reclutador     │
19 | │  (Docente)      │
20 | └────────┬────────┘
21 |          │ HTTPS
22 |          ↓
23 | ┌─────────────────┐         ┌──────────────────┐
24 | │   Candidato     │────────→│  Talent Pool     │
25 | │  (Estudiante)   │  HTTPS  │   Platform       │
26 | └─────────────────┘         └────────┬─────────┘
27 |                                      │
28 |                     ┌────────────────┼────────────────┐
29 |                     ↓                ↓                ↓
30 |             ┌───────────────┐ ┌──────────┐  ┌──────────────┐
31 |             │ LLM Providers │ │PostgreSQL│  │ Email Service│
32 |             │(OpenAI/Claude)│ │+ pgvector│  │   (futuro)   │
33 |             └───────────────┘ └──────────┘  └──────────────┘
34 | ```
35 | 
36 | ### 1.3 diagrama C4 — nivel 2 (contenedores)
37 | ```
38 | ┌──────────────────────────────────────────────────────────────┐
39 | │                      Frontend Layer                          │
40 | │  ┌────────────────────────────────────────────────────┐     │
41 | │  │  React SPA (TypeScript + Vite)                     │     │
42 | │  │  - Panel reclutador (UC-001, UC-003)               │     │
43 | │  │  - Panel candidato (UC-002, UC-004)                │     │
44 | │  │  - Editor de código integrado (Monaco)             │     │
45 | │  └────────────────────────────────────────────────────┘     │
46 | └───────────────────────────┬──────────────────────────────────┘
47 |                             │ HTTPS / JSON (REST)
48 |                             ↓
49 | ┌──────────────────────────────────────────────────────────────┐
50 | │                      Backend Layer                           │
51 | │  ┌────────────────────────────────────────────────────┐     │
52 | │  │  Quarkus API (Java 21)                             │     │
53 | │  │  ┌──────────────────────────────────────────────┐ │     │
54 | │  │  │ API Layer (JAX-RS / RESTEasy Reactive)      │ │     │
55 | │  │  │  - /api/v1/puestos                           │ │     │
56 | │  │  │  - /api/v1/desafios                          │ │     │
57 | │  │  │  - /api/v1/evaluaciones                      │ │     │
58 | │  │  └──────────────────────────────────────────────┘ │     │
59 | │  │  ┌──────────────────────────────────────────────┐ │     │
60 | │  │  │ Service Layer (Casos de Uso)                 │ │     │
61 | │  │  │  - GenerarDesafioService (UC-001)            │ │     │
62 | │  │  │  - EvaluarSolucionService (UC-002)           │ │     │
63 | │  │  │  - ConsultarRankingService (UC-003)          │ │     │
64 | │  │  └──────────────────────────────────────────────┘ │     │
65 | │  │  ┌──────────────────────────────────────────────┐ │     │
66 | │  │  │ Infrastructure Layer                         │ │     │
67 | │  │  │  - LangChain4j AI Services                   │ │     │
68 | │  │  │  - Hibernate ORM with Panache                │ │     │
69 | │  │  │  - Flyway Migrations                         │ │     │
70 | │  │  └──────────────────────────────────────────────┘ │     │
71 | │  └────────────────────────────────────────────────────┘     │
72 | └───────────────┬──────────────────────┬───────────────────────┘
73 |                 │                      │
74 |                 ↓                      ↓
75 |     ┌───────────────────┐    ┌────────────────────┐
76 |     │  PostgreSQL 16    │    │  LLM Providers     │
77 |     │  + pgvector 0.7.x │    │  - OpenAI GPT-4    │
78 |     │                   │    │  - Anthropic Claude│
79 |     │  Entidades:       │    │  - Ollama (dev)    │
80 |     │  - usuarios       │    │                    │
81 |     │  - puestos        │    │  via LangChain4j   │
82 |     │  - desafios       │    └────────────────────┘
83 |     │  - evaluaciones   │
84 |     └───────────────────┘
85 | ```
86 | 
87 | ---
88 | 
</content>
<content lines="89-146">
 89 | ## 2. stack tecnológico (cerrado)
 90 | 
 91 | > Una sola opción por capa. Versión fija. Cambios → ADR.
 92 | 
 93 | ### 2.1 backend (Quarkus + LangChain4j)
 94 | 
 95 | | capa | tecnología | versión | ADR |
 96 | |------|------------|---------|-----|
 97 | | JDK | Eclipse Temurin | 21 LTS | ADR-0001 |
 98 | | GraalVM (build nativo) | GraalVM CE for JDK 21 | última estable | ADR-0001 |
 99 | | framework | Quarkus | 3.17.x (LTS más reciente) | ADR-0001 |
100 | | build | Maven | 3.9.x | ADR-0001 |
101 | | LLM toolkit | LangChain4j (extensión Quarkus) | 1.x estable | ADR-0001 |
102 | | API REST | RESTEasy Reactive (JAX-RS) | incluida en Quarkus | ADR-0001 |
103 | | ORM | Hibernate ORM with Panache | incluida en Quarkus | ADR-0001 |
104 | | validación | Hibernate Validator (Bean Validation) | incluida | ADR-0001 |
105 | | migraciones | Flyway | incluida (extensión Quarkus) | ADR-0001 |
106 | | auth | Quarkus OIDC + SmallRye JWT | incluidas | ADR-0001 |
107 | | BD relacional | PostgreSQL | 16 | ADR-0001 |
108 | | vector store | pgvector (extensión de PostgreSQL) | 0.7.x+ | ADR-0002 |
109 | | caché | Redis | 7.x | ADR-0001 |
110 | | testing | JUnit 5 + AssertJ + Mockito | últimas | ADR-0001 |
111 | | testing HTTP | REST Assured | última | ADR-0001 |
112 | | testing infra | Testcontainers + Quarkus Dev Services | últimas | ADR-0001 |
113 | | testing LLM | WireMock + LangChain4j MockChatModel | últimas | ADR-0001 |
114 | | evals LLM | suite propia + framework definido en | ADR-0003 |
115 | | observabilidad | Micrometer + OpenTelemetry (extensiones Quarkus) | incluidas | ADR-0001 |
116 | 
117 | ### 2.2 frontend
118 | 
119 | | capa | tecnología | versión | ADR |
120 | |------|------------|---------|-----|
121 | | lenguaje | TypeScript | 5.x | ADR-0001 |
122 | | framework UI | React | 18.x | ADR-0001 |
123 | | build | Vite | 5.x | ADR-0001 |
124 | | gestor de paquetes | pnpm | 9.x | ADR-0001 |
125 | | router | React Router | 6.x | ADR-0001 |
126 | | state server | TanStack Query | 5.x | ADR-0001 |
127 | | state cliente | Zustand o Context API | última | ADR-0001 |
128 | | editor de código | Monaco Editor (VS Code) | última | ADR-0001 |
129 | | cliente HTTP | fetch nativo o openapi-fetch (tipado desde OpenAPI) | última | ADR-0001 |
130 | | testing unitario | Vitest + Testing Library | últimas | ADR-0001 |
131 | | testing e2e | Playwright | última | ADR-0001 |
132 | | servidor estático | nginx (o CDN en producción) | última estable | ADR-0001 |
133 | 
134 | ### 2.3 infraestructura y operación
135 | 
136 | | capa | tecnología | versión | ADR |
137 | |------|------------|---------|-----|
138 | | contenedores | Docker + docker compose | última estable | ADR-0001 |
139 | | imagen runtime backend | JVM o nativa (distroless) | — | ADR-0001 |
140 | | CI/CD | GitHub Actions | — | ADR-0001 |
141 | | análisis estático | SonarQube / SonarCloud | — | ADR-0001 |
142 | | SAST adicional | GitHub CodeQL | — | ADR-0001 |
143 | | cloud | Render / Railway (MVP), AWS/GCP (prod) | — | pendiente ADR |
144 | 
145 | ---
146 | 
</content>
<content lines="147-311">
147 | ## 3. estructura de carpetas (obligatoria)
148 | 
149 | ```
150 | /
151 | ├── backend/
152 | │   ├── src/
153 | │   │   ├── main/
154 | │   │   │   ├── java/com/talentpool/
155 | │   │   │   │   ├── api/              # recursos JAX-RS (endpoints)
156 | │   │   │   │   │   ├── dto/          # records de request/response
157 | │   │   │   │   │   │   ├── PuestoRequest.java
158 | │   │   │   │   │   │   ├── DesafioResponse.java
159 | │   │   │   │   │   │   ├── EvaluacionRequest.java
160 | │   │   │   │   │   │   └── RankingResponse.java
161 | │   │   │   │   │   ├── exception/    # mappers de excepciones
162 | │   │   │   │   │   │   ├── GlobalExceptionMapper.java
163 | │   │   │   │   │   │   └── LLMTimeoutExceptionMapper.java
164 | │   │   │   │   │   ├── PuestoResource.java
165 | │   │   │   │   │   ├── DesafioResource.java
166 | │   │   │   │   │   └── EvaluacionResource.java
167 | │   │   │   │   ├── domain/           # entidades de negocio, value objects, lógica pura
168 | │   │   │   │   │   ├── Usuario.java
169 | │   │   │   │   │   ├── Puesto.java
170 | │   │   │   │   │   ├── Desafio.java
171 | │   │   │   │   │   ├── Evaluacion.java
172 | │   │   │   │   │   └── vo/           # value objects
173 | │   │   │   │   │       ├── TipoUsuario.java (enum)
174 | │   │   │   │   │       ├── NivelSeniority.java (enum)
175 | │   │   │   │   │       └── Puntaje.java
176 | │   │   │   │   ├── service/          # casos de uso (uno por UC, orquestación)
177 | │   │   │   │   │   ├── GenerarDesafioService.java    # UC-001
178 | │   │   │   │   │   ├── EvaluarSolucionService.java   # UC-002
179 | │   │   │   │   │   ├── ConsultarRankingService.java  # UC-003
180 | │   │   │   │   │   └── ListarDesafiosService.java    # UC-004
181 | │   │   │   │   ├── infrastructure/
182 | │   │   │   │   │   ├── persistence/  # repositorios Panache, mapeos JPA
183 | │   │   │   │   │   │   ├── UsuarioRepository.java
184 | │   │   │   │   │   │   ├── PuestoRepository.java
185 | │   │   │   │   │   │   ├── DesafioRepository.java
186 | │   │   │   │   │   │   └── EvaluacionRepository.java
187 | │   │   │   │   │   ├── ai/           # AiServices de LangChain4j, prompts, retrievers
188 | │   │   │   │   │   │   ├── services/
189 | │   │   │   │   │   │   │   ├── DesafioGeneratorAiService.java
190 | │   │   │   │   │   │   │   └── CodigoEvaluadorAiService.java
191 | │   │   │   │   │   │   ├── prompts/
192 | │   │   │   │   │   │   │   ├── DesafioPromptBuilder.java
193 | │   │   │   │   │   │   │   └── EvaluacionPromptBuilder.java
194 | │   │   │   │   │   │   └── guardrails/
195 | │   │   │   │   │   │       ├── InputSanitizationGuardrail.java
196 | │   │   │   │   │   │       └── OutputValidationGuardrail.java
197 | │   │   │   │   │   ├── llm/          # configuración de modelos, guardrails
198 | │   │   │   │   │   │   ├── LLMConfig.java
199 | │   │   │   │   │   │   └── ModelProvider.java
200 | │   │   │   │   │   └── client/       # clientes REST/MicroProfile a APIs externas
201 | │   │   │   │   ├── config/           # ConfigProperties, beans CDI, producers
202 | │   │   │   │   │   ├── ApplicationConfig.java
203 | │   │   │   │   │   └── LangChain4jConfig.java
204 | │   │   │   │   └── security/         # autorización, filtros, identity providers
205 | │   │   │   │       └── RoleBasedAccessControl.java
206 | │   │   │   └── resources/
207 | │   │   │       ├── application.yml   # configuración Quarkus
208 | │   │   │       ├── application-dev.yml
209 | │   │   │       ├── application-test.yml
210 | │   │   │       ├── db/migration/     # scripts Flyway: V1__init.sql, V2__...
211 | │   │   │       │   ├── V1__create_initial_schema.sql
212 | │   │   │       │   └── V2__add_indexes.sql
213 | │   │   │       └── prompts/          # plantillas de prompt (.txt o .ftl)
214 | │   │   │           ├── generar-desafio.txt
215 | │   │   │           └── evaluar-codigo.txt
216 | │   │   └── test/
217 | │   │       ├── java/com/talentpool/
218 | │   │       │   ├── unit/
219 | │   │       │   │   ├── service/
220 | │   │       │   │   └── domain/
221 | │   │       │   ├── integration/      # @QuarkusTest con Testcontainers
222 | │   │       │   │   ├── api/
223 | │   │       │   │   └── persistence/
224 | │   │       │   ├── e2e/              # tests REST end-to-end del backend
225 | │   │       │   │   └── DesafioFlowE2ETest.java
226 | │   │       │   └── evals/            # evaluaciones de LLM (ver ADR-0003)
227 | │   │       │       ├── DesafioGenerationEvalTest.java
228 | │   │       │       └── CodigoEvaluacionEvalTest.java
229 | │   │       └── resources/
230 | │   │           ├── application-test.yml
231 | │   │           └── fixtures/
232 | │   │               ├── golden-dataset.json
233 | │   │               └── mock-responses.json
234 | │   ├── pom.xml
235 | │   └── README.md
236 | ├── frontend/
237 | │   ├── src/
238 | │   │   ├── components/
239 | │   │   │   ├── common/
240 | │   │   │   │   ├── Button.tsx
241 | │   │   │   │   ├── Card.tsx
242 | │   │   │   │   └── LoadingSpinner.tsx
243 | │   │   │   ├── reclutador/
244 | │   │   │   │   ├── FormularioDesafio.tsx      # UC-001
245 | │   │   │   │   ├── TablaRanking.tsx           # UC-003
246 | │   │   │   │   └── DetalleEvaluacion.tsx
247 | │   │   │   └── candidato/
248 | │   │   │       ├── CatalogoDesafios.tsx       # UC-004
249 | │   │   │       ├── EditorCodigo.tsx           # UC-002
250 | │   │   │       └── ResultadoEvaluacion.tsx
251 | │   │   ├── pages/
252 | │   │   │   ├── DashboardReclutador.tsx
253 | │   │   │   ├── DashboardCandidato.tsx
254 | │   │   │   ├── GenerarDesafio.tsx
255 | │   │   │   ├── ResolverDesafio.tsx
256 | │   │   │   └── VerResultados.tsx
257 | │   │   ├── hooks/
258 | │   │   │   ├── useDesafios.ts
259 | │   │   │   ├── useEvaluaciones.ts
260 | │   │   │   └── useAuth.ts
261 | │   │   ├── services/                 # clientes de API generados desde OpenAPI
262 | │   │   │   ├── api-client.ts
263 | │   │   │   └── types.ts
264 | │   │   ├── store/
265 | │   │   │   └── authStore.ts
266 | │   │   ├── App.tsx
267 | │   │   └── main.tsx
268 | │   ├── tests/
269 | │   │   ├── unit/
270 | │   │   ├── integration/
271 | │   │   └── e2e/
272 | │   │       └── flujo-completo.spec.ts
273 | │   ├── package.json
274 | │   ├── vite.config.ts
275 | │   └── README.md
276 | ├── infra/
277 | │   ├── docker/
278 | │   │   ├── Dockerfile.backend.jvm
279 | │   │   ├── Dockerfile.backend.native
280 | │   │   └── Dockerfile.frontend
281 | │   ├── compose/                      # docker-compose para entornos
282 | │   └── terraform/                    # si aplica
283 | ├── docs/
284 | │   ├── adr/
285 | │   │   ├── 0000-template.md
286 | │   │   ├── 0001-stack-base.md
287 | │   │   ├── 0002-rag-vector-store.md
288 | │   │   └── 0003-llm-evals.md
289 | │   ├── uc/
290 | │   │   ├── UC-template.md
291 | │   │   └── UC-001-generar-desafio.md
292 | │   ├── runbooks/
293 | │   │   └── incident-template.md
294 | │   └── diagrams/
295 | │       └── architecture-c4.png
296 | ├── product/
297 | │   ├── PRODUCT.md
298 | │   ├── ARCHITECTURE.md
299 | │   ├── ROADMAP.md
300 | │   └── rf-rnf.md
301 | ├── CONTRIBUTING.md
302 | ├── CHANGELOG.md
303 | ├── TECH_DEBT.md
304 | ├── README.md
305 | └── sonar-project.properties
306 | ```
307 | 
308 | **Regla**: el agente no crea carpetas raíz nuevas sin ADR.
309 | 
310 | ---
311 | 
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
product/Talent pool app.md,product/PRODUCT.md,product/ARCHITECTURE.md,README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T17:14:02.879Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.05

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

Now I'll update the README.md with the complete information from the PRODUCT.md and ARCHITECTURE.md specifications, focusing on the MVP scope, Quarkus + LangChain4j stack, and core user flows.

<write_to_file>
<path>README.md</path>
<content>
# Talent Pool — AI-Powered Technical Assessment Platform

> **MVP for IBM Hackathon 2026** | Automated challenge generation and evaluation using LangChain4j

**Stack**: Quarkus + Java 21 + LangChain4j + PostgreSQL + pgvector + React + TypeScript + Vite

---

## Overview

Talent Pool is an AI-powered platform that bridges the gap between technical education and employment by automating the generation and evaluation of technical challenges. It reduces operational overhead for educators, optimizes learning resources for students, and provides companies with access to pre-evaluated talent.

### Core Value Proposition

- **Automated end-to-end assessment**: LLM-powered challenge generation with hidden rubrics and static code analysis
- **Collective knowledge repository**: Centralized AI queries to avoid resource duplication
- **Direct education-to-employment bridge**: Pre-evaluated talent database with real-world workflow simulations
- **Contextualized evaluation**: Open-book challenges that simulate actual work environments

---

## Problem Statement

The disconnect between academic training and the job market creates:

- **For educators**: Countless hours spent on manual grading and correction
- **For students**: Isolated AI tool usage without collaborative learning opportunities
- **For companies**: High onboarding costs (USD 10,000-30,000 per employee) and 3-6 month induction periods

**Current alternatives** (HackerRank, Codility, traditional LMS) lack AI-powered automation and don't personalize content or connect education directly with job placement.

---

## MVP Scope (Hackathon)

### Core Features

**UC-001: Generate Technical Challenge**
- Recruiter/educator inputs job parameters (role, technology, seniority)
- System generates challenge + hidden rubric via LLM
- Challenge becomes available for candidates

**UC-002: Solve and Evaluate Challenge**
- Candidate views challenge and develops solution in integrated editor
- System evaluates via AI-powered static analysis
- Returns score (0-100) and detailed feedback

**UC-003: View Rankings and Reports**
- Recruiter accesses dashboard with candidate rankings
- Reviews submitted code and AI analysis
- Makes selection decisions

**UC-004: Browse Challenge Catalog**
- Candidate accesses challenge catalog
- Filters by technology/level
- Initiates evaluation process

### Technical Scope

**Backend (Quarkus + LangChain4j)**
- Automatic challenge generation via LLM
- Hidden evaluation rubrics (JSONB storage)
- Automated static code analysis
- Detailed feedback with numerical scoring (0-100)

**Frontend (React + TypeScript)**
- Role-based dashboard (recruiters and candidates)
- Challenge generation form
- Integrated code editor (Monaco Editor)
- Results and ranking views

**Data Model**
- Entities: Usuario, Puesto, Desafio, Evaluacion
- PostgreSQL with JSONB support
- pgvector extension (prepared for future RAG)

---

## Architecture

### Style
**Modular monolith** (backend) + **decoupled SPA** (frontend)

### C4 Diagram - Level 2 (Containers)

```
┌──────────────────────────────────────────────────────────────┐
│                      Frontend Layer                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │  React SPA (TypeScript + Vite)                     │     │
│  │  - Recruiter panel (UC-001, UC-003)                │     │
│  │  - Candidate panel (UC-002, UC-004)                │     │
│  │  - Integrated code editor (Monaco)                 │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTPS / JSON (REST)
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                      Backend Layer                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Quarkus API (Java 21)                             │     │
│  │  ┌──────────────────────────────────────────────┐ │     │
│  │  │ API Layer (JAX-RS / RESTEasy Reactive)      │ │     │
│  │  │  - /api/v1/puestos                           │ │     │
│  │  │  - /api/v1/desafios                          │ │     │
│  │  │  - /api/v1/evaluaciones                      │ │     │
│  │  └──────────────────────────────────────────────┘ │     │
│  │  ┌──────────────────────────────────────────────┐ │     │
│  │  │ Service Layer (Use Cases)                    │ │     │
│  │  │  - GenerarDesafioService (UC-001)            │ │     │
│  │  │  - EvaluarSolucionService (UC-002)           │ │     │
│  │  │  - ConsultarRankingService (UC-003)          │ │     │
│  │  └──────────────────────────────────────────────┘ │     │
│  │  ┌──────────────────────────────────────────────┐ │     │
│  │  │ Infrastructure Layer                         │ │     │
│  │  │  - LangChain4j AI Services                   │ │     │
│  │  │  - Hibernate ORM with Panache                │ │     │
│  │  │  - Flyway Migrations                         │ │     │
│  │  └──────────────────────────────────────────────┘ │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────┬──────────────────────┬───────────────────────┘
                │                      │
                ↓                      ↓
    ┌───────────────────┐    ┌────────────────────┐
    │  PostgreSQL 16    │    │  LLM Providers     │
    │  + pgvector 0.7.x │    │  - OpenAI GPT-4    │
    │                   │    │  - Anthropic Claude│
    │  Entities:        │    │  - Ollama (dev)    │
    │  - usuarios       │    │                    │
    │  - puestos        │    │  via LangChain4j   │
    │  - desafios       │    └────────────────────┘
    │  - evaluaciones   │
    └───────────────────┘
```

---

## Tech Stack (Closed Decisions)

### Backend
- **JDK**: Eclipse Temurin 21 LTS
- **Framework**: Quarkus 3.17.x
- **LLM Toolkit**: LangChain4j (Quarkus extension)
- **API**: RESTEasy Reactive (JAX-RS)
- **ORM**: Hibernate ORM with Panache
- **Migrations**: Flyway
- **Database**: PostgreSQL 16 + pgvector 0.7.x
- **Cache**: Redis 7.x
- **Testing**: JUnit 5, AssertJ, Mockito, REST Assured, Testcontainers
- **Observability**: Micrometer + OpenTelemetry

### Frontend
- **Language**: TypeScript 5.x
- **Framework**: React 18.x
- **Build**: Vite 5.x
- **Package Manager**: pnpm 9.x
- **Router**: React Router 6.x
- **State Management**: TanStack Query 5.x + Zustand/Context API
- **Code Editor**: Monaco Editor
- **Testing**: Vitest + Testing Library + Playwright

### Infrastructure
- **Containers**: Docker + docker-compose
- **CI/CD**: GitHub Actions
- **Static Analysis**: SonarQube/SonarCloud + GitHub CodeQL
- **Cloud**: Render/Railway (MVP), AWS/GCP (production)

---

## Project Structure

```
/
├── backend/                    # Quarkus API
│   ├── src/main/java/com/talentpool/
│   │   ├── api/               # JAX-RS resources (endpoints)
│   │   ├── domain/            # Business entities
│   │   ├── service/           # Use case implementations
│   │   └── infrastructure/
│   │       ├── persistence/   # Panache repositories
│   │       ├── ai/            # LangChain4j AI services
│   │       └── llm/           # LLM configuration
│   └── src/main/resources/
│       ├── application.yml
│       ├── db/migration/      # Flyway scripts
│       └── prompts/           # LLM prompt templates
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── reclutador/   # Recruiter UI (UC-001, UC-003)
│   │   │   └── candidato/    # Candidate UI (UC-002, UC-004)
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/         # API clients
│   └── tests/
├── infra/
│   ├── docker/               # Dockerfiles
│   └── compose/              # docker-compose files
├── docs/
│   ├── adr/                  # Architecture Decision Records
│   ├── uc/                   # Use Cases
│   └── runbooks/             # Operational guides
└── product/
    ├── PRODUCT.md            # Product definition
    ├── ARCHITECTURE.md       # Technical architecture
    └── ROADMAP.md            # Development phases
```

---

## Getting Started

### Prerequisites
- JDK 21 (Eclipse Temurin recommended)
- Maven 3.9.x
- Node.js 20.x + pnpm 9.x
- Docker + docker-compose
- PostgreSQL 16 (or use docker-compose)

### Local Development

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd hackathon
   ```

2. **Start infrastructure**
   ```bash
   cd infra/compose
   docker-compose up -d  # PostgreSQL + pgvector + Redis + Ollama
   ```

3. **Backend**
   ```bash
   cd backend
   mvn quarkus:dev  # Runs on http://localhost:8080
   ```

4. **Frontend**
   ```bash
   cd frontend
   pnpm install
   pnpm dev  # Runs on http://localhost:5173
   ```

### Environment Variables

Create `.env` files or configure in `application.yml`:

```yaml
# Backend (application.yml)
quarkus:
  langchain4j:
    openai:
      api-key: ${LLM_API_KEY}
  datasource:
    jdbc:
      url: ${DB_JDBC_URL:jdbc:postgresql://localhost:5432/talentpool}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
```

---

## Key Endpoints (MVP)

### Challenge Management
- `POST /api/v1/puestos` - Create job position
- `POST /api/v1/desafios/generar` - Generate challenge (UC-001)
- `GET /api/v1/desafios` - List challenges (UC-004)
- `GET /api/v1/desafios/{id}` - Get challenge details

### Evaluation
- `POST /api/v1/evaluaciones` - Submit solution (UC-002)
- `GET /api/v1/evaluaciones/{id}` - Get evaluation result
- `GET /api/v1/evaluaciones/ranking/{desafioId}` - Get rankings (UC-003)

### Health & Monitoring
- `GET /q/health/live` - Liveness probe
- `GET /q/health/ready` - Readiness probe
- `GET /q/metrics` - Prometheus metrics

---

## Success Metrics

### Product Metrics (Hackathon)
- ≥ 50 challenges generated successfully
- ≥ 100 completed evaluations
- < 30s average challenge generation time
- < 10s average evaluation time
- ≥ 60% challenge completion rate
- ≥ 7/10 user satisfaction (NPS)

### Technical SLOs
- 99% system availability
- < 300ms p95 latency for CRUD endpoints
- < 8s p95 latency for LLM challenge generation
- < 5s p95 latency for code evaluation
- < 1% 5xx error rate
- < USD 5 cost per 100 evaluations

### LLM-Specific Metrics
- ≥ 85% challenge relevance quality
- ≥ 80% evaluation accuracy (vs human evaluator)
- ≥ 98% valid structured responses (JSON)
- < 5% hallucination rate
- ≥ 90% evaluation consistency

---

## Testing Strategy

### Test Pyramid
- **Unit tests**: 70% coverage (domain logic, services)
- **Integration tests**: 20% coverage (@QuarkusTest with Testcontainers)
- **E2E tests**: 10% coverage (Playwright for critical flows)
- **LLM evals**: Dedicated suite with golden dataset (see ADR-0003)

### Testing Rules
- **Immutable tests**: If a test fails, fix the code, never the test
- **LLM tests always mocked**: Real calls only in controlled eval suite
- **No flaky tests**: Retry logic only for external dependencies

### CI Pipeline
```yaml
# .github/workflows/ci.yml
- Backend: mvn verify (unit + integration tests)
- Frontend: pnpm test (Vitest + Playwright)
- LLM Evals: Smoke tests only in CI
- SonarQube: Quality gate enforcement
- Docker: Build verification
```

---

## GitHub Configuration

### Required Secrets
Configure in `Settings → Secrets and variables → Actions`:

| Secret | Purpose | Source |
|--------|---------|--------|
| `SONAR_TOKEN` | SonarCloud authentication | sonarcloud.io |
| `SONAR_HOST_URL` | Sonar instance URL | `https://sonarcloud.io` |
| `LLM_API_KEY` | LLM provider access | OpenAI/Anthropic/etc. |
| `STAGING_DB_*` | Staging database credentials | Cloud provider |
| `PROD_DB_*` | Production database credentials | Cloud provider |

### Environments
- **staging**: Auto-deploy on push to `main`
- **production**: Manual approval required

### Branch Protection (main)
- Require PR reviews (≥ 1 approval)
- Require status checks: `backend`, `frontend`, `e2e`, `sonar`, `docker-build`
- Require branches up to date
- No bypass allowed

---

## Development Principles

1. **Closed decisions, not open**: Agent executes architecture, doesn't choose it
2. **Immutable tests**: Fix code, never tests
3. **LLM tests always mocked**: Real calls only in eval suite
4. **Documented debt or it doesn't exist**: Undocumented shortcuts = future bugs
5. **No ambiguity**: Every UC has verifiable criteria, every PR has DoD
6. **Security and observability from day 1**: Not final phases
7. **Measured quality, not assumed**: Linters, tests, evals, and Sonar block in CI
8. **Controlled costs**: Every LLM UC declares token budget and cost

---

## Documentation

- **Product Definition**: [product/PRODUCT.md](product/PRODUCT.md)
- **Architecture**: [product/ARCHITECTURE.md](product/ARCHITECTURE.md)
- **Roadmap**: [product/ROADMAP.md](product/ROADMAP.md)
- **Use Cases**: [docs/uc/](docs/uc/)
- **ADRs**: [docs/adr/](docs/adr/)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **Tech Debt**: [TECH_DEBT.md](TECH_DEBT.md)

---

## Roadmap

### Phase 0: MVP (Hackathon - 48-72h)
- ✅ Core evaluation engine (UC-001 to UC-004)
- ✅ 4 essential screens
- ✅ Basic data model
- ✅ LLM integration via LangChain4j

### Phase 2: Academic Module (4-6 weeks)
- Authentication system (OAuth, granular roles)
- Collective AI query repository
- Personalized study guides
- Student collaboration features

### Phase 3: Corporate Expansion (8-12 weeks)
- Searchable talent database
- Company-specific workflow simulators
- ATS integrations
- Advanced analytics

### Phase 4: Monetization (12-16 weeks)
- Subscription system
- Payment processing
- Digital certificates
- Premium challenge marketplace

---

## License

[To be defined]

---

## Contact

[To be defined]

---

**Built with ❤️ for IBM Hackathon 2026**
</content>
<line_count>449</line_count>
</write_to_file>

---

**User:**

[write_to_file for 'README.md'] Result:
<file_write_result>
<path>README.md</path>
<operation>modified</operation>
<user_edits>@@ -426,4 +426,4 @@
 
 ---
 
-**Built with ❤️ for IBM Hackathon 2026**
\ No newline at end of file
+**Built with ❤️ for IBM Hackathon 2026**
</user_edits>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
<i>If the user's edits have addressed part of the task or changed the requirements, adjust your approach accordingly.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
product/Talent pool app.md,product/PRODUCT.md,product/ARCHITECTURE.md,README.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T17:15:42.791Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.11

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
README.md successfully updated with comprehensive MVP specifications:

**Key Updates:**
- ✅ Clear overview of Talent Pool platform and value proposition
- ✅ Problem statement with concrete pain points and costs
- ✅ MVP scope with all 4 core use cases (UC-001 to UC-004) detailed
- ✅ Complete architecture diagram (C4 Level 2) showing Quarkus + LangChain4j stack
- ✅ Closed tech stack decisions (backend, frontend, infrastructure)
- ✅ Project structure aligned with ARCHITECTURE.md specifications
- ✅ Getting started guide with local development setup
- ✅ Key API endpoints for MVP
- ✅ Success metrics (product, technical SLOs, LLM-specific)
- ✅ Testing strategy with pyramid and CI pipeline
- ✅ GitHub configuration (secrets, environments, branch protection)
- ✅ Development principles emphasizing closed decisions and quality
- ✅ Roadmap with Phase 0 (MVP) through Phase 4
- ✅ Professional, technical, and concise tone throughout

The README now serves as a comprehensive technical guide that reflects the MVP scope, the Quarkus + LangChain4j stack, and the core user flows for recruiters and candidates.
</result>
</attempt_completion>

---

**User:**



New instructions for task continuation:
<user_message>
The product/PRODUCT.md has been updated with all the use cases for the project. Review the main readme file and make the necessary adjustments
</user_message>
<environment_details>
# VSCode Visible Files
product/PRODUCT.md

# VSCode Open Tabs
product/PRODUCT.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:07:37.086Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.18

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
product/DATABASE.md
product/PRODUCT.md
product/rf-rnf.md
product/ROADMAP.md
product/Talent pool app.md
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll review the updated PRODUCT.md to see what use cases have been added or changed, then adjust the README accordingly.

<read_file>
<args>
<file>
<path>product/PRODUCT.md</path>
<line_range>134-170</line_range>
</file>
<file>
<path>README.md</path>
<line_range>1-100</line_range>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'product/PRODUCT.md', 'README.md'] Result:
<files>
<file><path>product/PRODUCT.md</path>
<content lines="134-170">
134 | 1. El visitante accede a la pantalla de registro
135 | 2. Ingresa nombre completo, email y contraseña
136 | 3. El cliente valida formato y fortaleza
137 | 4. El sistema valida en servidor (Bean Validation)
138 | 5. El sistema verifica que el email no esté registrado
139 | 6. El sistema hashea la contraseña con argon2id y persiste el usuario
140 | 7. El sistema crea un `perfil_talento` con valores default
141 | 8. El sistema envía email de verificación
142 | 9. El sistema emite tokens y redirige a UC-003 (completar perfil)
143 | 
144 | **Flujos de error**:
145 | - Email duplicado → 409 con mensaje genérico (anti-enumeración)
146 | - Contraseña débil → 422 con criterios faltantes
147 | - Rate limit → 429 con `Retry-After`
148 | 
149 | **Criterios de aceptación**:
150 | ```gherkin
151 | Escenario: registro exitoso
152 |   Dado que el email "ana@example.com" no está registrado
153 |   Cuando envío POST /api/v1/auth/register con datos válidos
154 |   Entonces recibo 201 con tokens
155 |   Y existe un perfil_talento con visible_reclutadores=true
156 |   Y se envió email de verificación
157 | 
158 | Escenario: email ya registrado
159 |   Dado que existe un usuario con "bob@example.com"
160 |   Cuando intento registrarme con ese email
161 |   Entonces recibo 409 con mensaje genérico
162 |   Y no se crea ningún registro nuevo
163 | ```
164 | 
165 | **RNFs**: latencia p95 < 400 ms · rate limit 5/min/IP · auditoría obligatoria
166 | 
167 | **Tablas afectadas**: `usuarios`, `perfiles_talento`, `eventos_auditoria`
168 | 
169 | ---
170 | 
</content>
</file>
<file><path>README.md</path>
<content lines="1-100">
  1 | # Talent Pool — AI-Powered Technical Assessment Platform
  2 | 
  3 | > **MVP for IBM Hackathon 2026** | Automated challenge generation and evaluation using LangChain4j
  4 | 
  5 | **Stack**: Quarkus + Java 21 + LangChain4j + PostgreSQL + pgvector + React + TypeScript + Vite
  6 | 
  7 | ---
  8 | 
  9 | ## Overview
 10 | 
 11 | Talent Pool is an AI-powered platform that bridges the gap between technical education and employment by automating the generation and evaluation of technical challenges. It reduces operational overhead for educators, optimizes learning resources for students, and provides companies with access to pre-evaluated talent.
 12 | 
 13 | ### Core Value Proposition
 14 | 
 15 | - **Automated end-to-end assessment**: LLM-powered challenge generation with hidden rubrics and static code analysis
 16 | - **Collective knowledge repository**: Centralized AI queries to avoid resource duplication
 17 | - **Direct education-to-employment bridge**: Pre-evaluated talent database with real-world workflow simulations
 18 | - **Contextualized evaluation**: Open-book challenges that simulate actual work environments
 19 | 
 20 | ---
 21 | 
 22 | ## Problem Statement
 23 | 
 24 | The disconnect between academic training and the job market creates:
 25 | 
 26 | - **For educators**: Countless hours spent on manual grading and correction
 27 | - **For students**: Isolated AI tool usage without collaborative learning opportunities
 28 | - **For companies**: High onboarding costs (USD 10,000-30,000 per employee) and 3-6 month induction periods
 29 | 
 30 | **Current alternatives** (HackerRank, Codility, traditional LMS) lack AI-powered automation and don't personalize content or connect education directly with job placement.
 31 | 
 32 | ---
 33 | 
 34 | ## MVP Scope (Hackathon)
 35 | 
 36 | ### Core Use Cases
 37 | 
 38 | The MVP implements **4 critical use cases** for the hackathon demo:
 39 | 
 40 | | ID | Use Case | Priority | Actor |
 41 | |----|----------|----------|-------|
 42 | | **UC-001** | Generar desafío técnico automatizado | Crítica | Reclutador/Docente |
 43 | | **UC-002** | Resolver desafío y evaluar mediante análisis estático | Crítica | Candidato/Alumno |
 44 | | **UC-003** | Visualizar ranking de candidatos y reportes de evaluación | Crítica | Reclutador/Docente |
 45 | | **UC-004** | Acceder y seleccionar desafíos por parte del candidato | Crítica | Candidato/Alumno |
 46 | 
 47 | **UC-001: Generate Technical Challenge**
 48 | - Recruiter/educator inputs job parameters (role, technology, seniority)
 49 | - System generates challenge + hidden rubric via LLM (LangChain4j)
 50 | - Challenge becomes available for candidates
 51 | - **Output**: Challenge with structured rubric stored in JSONB
 52 | 
 53 | **UC-002: Solve and Evaluate Challenge**
 54 | - Candidate views challenge and develops solution in integrated editor
 55 | - System evaluates via AI-powered static analysis
 56 | - Returns score (0-100) and detailed feedback with multi-dimensional breakdown
 57 | - **Output**: Evaluation with score, feedback, and dimension analysis
 58 | 
 59 | **UC-003: View Rankings and Reports**
 60 | - Recruiter accesses dashboard with candidate rankings by challenge
 61 | - Reviews submitted code and AI analysis
 62 | - Filters by score, technology, and seniority
 63 | - Makes selection decisions based on objective metrics
 64 | 
 65 | **UC-004: Browse Challenge Catalog**
 66 | - Candidate accesses challenge catalog
 67 | - Filters by technology/level/context (corporate, academic, public)
 68 | - Selects challenge and initiates evaluation process
 69 | - Tracks personal progress and historical evaluations
 70 | 
 71 | ### Planned Use Cases (Post-MVP)
 72 | 
 73 | | ID | Use Case | Priority | Phase |
 74 | |----|----------|----------|-------|
 75 | | UC-005 | Registrar usuario (reclutador/candidato) | Alta | 2 |
 76 | | UC-006 | Iniciar sesión y gestión de perfiles | Alta | 2 |
 77 | | UC-007 | Centralizar consultas a IA (repositorio colectivo) | Alta | 2 |
 78 | | UC-008 | Generar guías de estudio personalizadas | Media | 2 |
 79 | | UC-009 | Filtrar base de talento por tecnología y puntaje | Media | 3 |
 80 | | UC-010 | Crear simuladores de flujos de trabajo empresariales | Media | 3 |
 81 | | UC-011 | Emitir certificados digitales de finalización | Baja | 4 |
 82 | | UC-012 | Sistema de suscripciones y pagos | Baja | 4 |
 83 | 
 84 | ### Technical Scope
 85 | 
 86 | **Backend (Quarkus + LangChain4j)**
 87 | - Automatic challenge generation via LLM
 88 | - Hidden evaluation rubrics (JSONB storage)
 89 | - Automated static code analysis
 90 | - Detailed feedback with numerical scoring (0-100)
 91 | 
 92 | **Frontend (React + TypeScript)**
 93 | - Role-based dashboard (recruiters and candidates)
 94 | - Challenge generation form
 95 | - Integrated code editor (Monaco Editor)
 96 | - Results and ranking views
 97 | 
 98 | **Data Model**
 99 | - **20 tables** organized in 7 domains (see `product/DATABASE.md` for complete schema)
100 | - **MVP Core**: 8 tables (usuarios, organizaciones, membresias, puestos, desafios, asignaciones_desafio, evaluaciones, prompt_versiones)
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
product/PRODUCT.md

# VSCode Open Tabs
product/PRODUCT.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:07:42.296Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.25

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

I need to read more of the PRODUCT.md to see all the use cases that have been added.

<read_file>
<args>
<file>
<path>product/PRODUCT.md</path>
<line_range>134-396</line_range>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'product/PRODUCT.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>product/PRODUCT.md</path>
<content lines="134-396">
134 | 1. El visitante accede a la pantalla de registro
135 | 2. Ingresa nombre completo, email y contraseña
136 | 3. El cliente valida formato y fortaleza
137 | 4. El sistema valida en servidor (Bean Validation)
138 | 5. El sistema verifica que el email no esté registrado
139 | 6. El sistema hashea la contraseña con argon2id y persiste el usuario
140 | 7. El sistema crea un `perfil_talento` con valores default
141 | 8. El sistema envía email de verificación
142 | 9. El sistema emite tokens y redirige a UC-003 (completar perfil)
143 | 
144 | **Flujos de error**:
145 | - Email duplicado → 409 con mensaje genérico (anti-enumeración)
146 | - Contraseña débil → 422 con criterios faltantes
147 | - Rate limit → 429 con `Retry-After`
148 | 
149 | **Criterios de aceptación**:
150 | ```gherkin
151 | Escenario: registro exitoso
152 |   Dado que el email "ana@example.com" no está registrado
153 |   Cuando envío POST /api/v1/auth/register con datos válidos
154 |   Entonces recibo 201 con tokens
155 |   Y existe un perfil_talento con visible_reclutadores=true
156 |   Y se envió email de verificación
157 | 
158 | Escenario: email ya registrado
159 |   Dado que existe un usuario con "bob@example.com"
160 |   Cuando intento registrarme con ese email
161 |   Entonces recibo 409 con mensaje genérico
162 |   Y no se crea ningún registro nuevo
163 | ```
164 | 
165 | **RNFs**: latencia p95 < 400 ms · rate limit 5/min/IP · auditoría obligatoria
166 | 
167 | **Tablas afectadas**: `usuarios`, `perfiles_talento`, `eventos_auditoria`
168 | 
169 | ---
170 | 
171 | #### UC-002: iniciar sesión
172 | 
173 | - **Actor principal**: usuario registrado
174 | - **Objetivo**: obtener acceso autenticado a la plataforma
175 | - **Precondiciones**: usuario existe en `usuarios`
176 | 
177 | **Flujo principal**:
178 | 1. El usuario ingresa email y contraseña
179 | 2. El sistema busca el usuario por email
180 | 3. El sistema verifica el hash de contraseña con argon2id
181 | 4. El sistema emite access token (15 min) y refresh token (7 días)
182 | 5. El sistema registra `usuario.login_exitoso` en auditoría
183 | 6. El cliente redirige al dashboard según contexto
184 | 
185 | **Flujos de error**:
186 | - Credenciales inválidas → 401 con mensaje genérico (no revelar si existe email)
187 | - Cuenta no verificada → 403 con código `EMAIL_NOT_VERIFIED`
188 | - Rate limit superado → 429 con `Retry-After`
189 | 
190 | **Criterios de aceptación**:
191 | ```gherkin
192 | Escenario: login exitoso
193 |   Dado que existe un usuario verificado con email "ana@example.com"
194 |   Cuando envío POST /api/v1/auth/login con credenciales correctas
195 |   Entonces recibo 200 con accessToken y refreshToken
196 |   Y queda registrado el evento usuario.login_exitoso
197 | 
198 | Escenario: contraseña incorrecta
199 |   Cuando envío POST /api/v1/auth/login con contraseña errónea
200 |   Entonces recibo 401 con mensaje genérico
201 |   Y queda registrado el evento usuario.login_fallido
202 | ```
203 | 
204 | **RNFs**: latencia p95 < 400 ms · rate limit 5/min/IP · auditoría obligatoria
205 | 
206 | **Tablas afectadas**: `usuarios` (lectura), `eventos_auditoria`
207 | 
208 | ---
209 | 
210 | #### UC-003: completar perfil tras primer login
211 | 
212 | - **Actor principal**: usuario recién registrado
213 | - **Objetivo**: cargar datos mínimos para usar la plataforma efectivamente
214 | - **Precondiciones**: usuario logueado sin perfil completo
215 | 
216 | **Flujo principal**:
217 | 1. El sistema detecta perfil incompleto y muestra wizard de 3 pasos
218 | 2. Paso 1: confirmar nombre y datos básicos
219 | 3. Paso 2: elegir contexto inicial (reclutador, docente, alumno/candidato, mixto)
220 | 4. Paso 3: si eligió rol corporativo o docente, sugiere crear/unirse a organización (deriva a UC-004 o UC-005)
221 | 5. Si eligió rol candidato, ofrece cargar 3-5 habilidades iniciales en `habilidades_perfil`
222 | 6. El sistema marca el perfil como completo
223 | 7. Redirige al dashboard
224 | 
225 | **Flujos alternativos**:
226 | - El usuario salta el wizard → puede volver más tarde desde "configuración de perfil"
227 | - El usuario es invitado vía UC-009 → ya tiene contexto inferido
228 | 
229 | **Criterios de aceptación**:
230 | ```gherkin
231 | Escenario: completar perfil como candidato
232 |   Dado que soy un usuario recién registrado
233 |   Cuando completo el wizard eligiendo rol "candidato"
234 |   Y agrego 3 habilidades iniciales
235 |   Entonces mi perfil_talento queda marcado como completo
236 |   Y existen 3 filas en habilidades_perfil
237 | ```
238 | 
239 | **RNFs**: completitud >= 70% en cohorte de nuevos usuarios
240 | 
241 | **Tablas afectadas**: `usuarios`, `perfiles_talento`, `habilidades_perfil`
242 | 
243 | ---
244 | 
245 | #### UC-004: crear organización
246 | 
247 | - **Actor principal**: usuario con cuenta verificada
248 | - **Objetivo**: crear una empresa o institución para gestionar puestos o cursos
249 | - **Precondiciones**: usuario logueado y verificado
250 | - **Postcondiciones**: existe una organización con el usuario como `OWNER` en `membresias`
251 | 
252 | **Flujo principal**:
253 | 1. El usuario accede a "crear organización"
254 | 2. Elige tipo: `EMPRESA` o `INSTITUCION`
255 | 3. Completa nombre, dominio de email opcional, plan (default `FREE`)
256 | 4. El sistema crea la organización
257 | 5. El sistema crea membresía `OWNER` para el usuario
258 | 6. Redirige al dashboard de la organización
259 | 
260 | **Flujos alternativos**:
261 | - Si el dominio de email del usuario coincide con una organización existente → sugiere unirse en lugar de crear
262 | 
263 | **Criterios de aceptación**:
264 | ```gherkin
265 | Escenario: crear empresa
266 |   Dado que soy un usuario verificado
267 |   Cuando creo una organización tipo "EMPRESA" llamada "Acme"
268 |   Entonces existe la organización
269 |   Y tengo membresía OWNER activa en ella
270 | ```
271 | 
272 | **Tablas afectadas**: `organizaciones`, `membresias`, `eventos_auditoria`
273 | 
274 | ---
275 | 
276 | #### UC-005: invitar miembro a organización con rol
277 | 
278 | - **Actor principal**: `OWNER` o `ADMIN` de una organización
279 | - **Objetivo**: agregar nuevos miembros con roles específicos
280 | - **Precondiciones**: actor tiene rol `OWNER` o `ADMIN` activo
281 | 
282 | **Flujo principal**:
283 | 1. El actor accede a "miembros" en su organización
284 | 2. Hace clic en "invitar"
285 | 3. Ingresa email, rol (`RECLUTADOR`, `DOCENTE`, `ALUMNO`, `EMPLEADO`, `ADMIN`)
286 | 4. El sistema valida que el rol sea coherente con el `tipo` de la organización
287 | 5. El sistema envía email con link de aceptación (token único, expira en 7 días)
288 | 6. Si el email corresponde a un usuario existente, al loguearse ve la invitación pendiente
289 | 7. Si no, debe registrarse primero (UC-001) y luego ve la invitación
290 | 8. Al aceptar, se crea membresía `ACTIVA`
291 | 
292 | **Flujos de error**:
293 | - Rol incompatible (ej: `DOCENTE` en empresa) → 422 con explicación
294 | - Usuario ya tiene membresía activa → 409
295 | - Token expirado al aceptar → 410 con opción de pedir nueva invitación
296 | 
297 | **Criterios de aceptación**:
298 | ```gherkin
299 | Escenario: invitar reclutador a empresa
300 |   Dado que soy OWNER de la empresa "Acme"
301 |   Cuando invito a "juan@example.com" con rol "RECLUTADOR"
302 |   Entonces se envía email con token único
303 |   Y existe una invitación pendiente
304 |   Cuando Juan acepta dentro de 7 días
305 |   Entonces tiene membresía RECLUTADOR ACTIVA en Acme
306 | ```
307 | 
308 | **RNFs**: link de invitación expira en 7 días · auditoría de aceptación obligatoria
309 | 
310 | **Tablas afectadas**: `membresias`, `eventos_auditoria`, sistema de invitaciones por email
311 | 
312 | ---
313 | 
314 | #### UC-006: crear puesto laboral
315 | 
316 | - **Actor principal**: reclutador
317 | - **Objetivo**: registrar una vacante para luego asociarla a desafíos y candidatos
318 | - **Precondiciones**: actor tiene membresía `RECLUTADOR` activa en una organización tipo `EMPRESA`
319 | 
320 | **Flujo principal**:
321 | 1. El reclutador accede a "puestos" → "crear nuevo"
322 | 2. Completa: título, tecnología principal, seniority, descripción
323 | 3. El estado inicial es `BORRADOR`
324 | 4. El reclutador puede pasar a `ABIERTO` cuando quiera empezar a recibir candidatos
325 | 
326 | **Flujos de error**:
327 | - Falta tecnología principal → 422
328 | - Reclutador no tiene membresía activa → 403
329 | 
330 | **Criterios de aceptación**:
331 | ```gherkin
332 | Escenario: crear puesto en borrador
333 |   Dado que soy reclutador en "Acme"
334 |   Cuando creo un puesto "Backend Java SSR"
335 |   Entonces existe el puesto en estado BORRADOR
336 |   Y soy su reclutador asignado
337 | ```
338 | 
339 | **Tablas afectadas**: `puestos`, `eventos_auditoria`
340 | 
341 | ---
342 | 
343 | #### UC-007: generar desafío técnico desde un puesto
344 | 
345 | - **Actor principal**: reclutador
346 | - **Objetivo**: generar un desafío técnico para evaluar candidatos al puesto
347 | - **Precondiciones**: existe un puesto del actor en estado `BORRADOR` o `ABIERTO`
348 | 
349 | **Flujo principal**:
350 | 1. El reclutador navega al puesto
351 | 2. Hace clic en "generar desafío"
352 | 3. El sistema toma los parámetros del puesto (tecnología, seniority) más opcionalmente:
353 |    - Tiempo estimado del desafío
354 |    - Énfasis específico (ej: "priorizar lógica sobre estilo")
355 | 4. El sistema busca el `prompt_versiones.estado='ACTIVA'` con `nombre='generador_desafio'`
356 | 5. El sistema construye el prompt y llama al LLM vía LangChain4j
357 | 6. El LLM devuelve respuesta JSON estructurada (validada por OutputGuardrail) con: enunciado, rúbrica oculta, dimensiones de evaluación
358 | 7. El sistema persiste el desafío en estado `BORRADOR` con `prompt_version_id`
359 | 8. El sistema registra `LLAMADA_LLM` con tokens y costo
360 | 9. El sistema redirige a UC-008 (confirmar/regenerar)
361 | 
362 | **Flujos de error**:
363 | - LLM timeout → 504 con opción de reintento
364 | - Salida del LLM no cumple esquema JSON → guardrail dispara reintento; si vuelve a fallar, muestra error genérico
365 | - Rate limit por costo (reclutador excedió presupuesto diario) → 429
366 | - Detección de inyección de prompts en el input del reclutador → 400 con mensaje de seguridad
367 | 
368 | **Criterios de aceptación**:
369 | ```gherkin
370 | Escenario: generar desafío exitoso
371 |   Dado un puesto "Backend Java SSR"
372 |   Cuando solicito generar desafío
373 |   Entonces se invoca el prompt activo "generador_desafio"
374 |   Y se persiste un desafío en estado BORRADOR
375 |   Y se registra una LLAMADA_LLM con tokens y costo
376 |   Y soy redirigido a la pantalla de confirmación
377 | 
378 | Escenario: timeout del LLM
379 |   Cuando el LLM tarda más de 30 segundos
380 |   Entonces el sistema aborta y devuelve 504
381 |   Y NO se persiste un desafío parcial
382 |   Y la LLAMADA_LLM queda registrada con estado TIMEOUT
383 | ```
384 | 
385 | **RNFs**:
386 | - Latencia p95 < 8 segundos (incluye llamada LLM)
387 | - Costo objetivo por generación < USD 0.10
388 | - Rate limit: 20 generaciones/hora/usuario
389 | - Tokens máximos: input 1500, output 3000
390 | - Temperature 0.3 para consistencia
391 | 
392 | **Consideraciones de seguridad**:
393 | - Input del reclutador (descripción adicional) pasa por `InputGuardrail` que detecta inyección de prompts
394 | - La rúbrica oculta jamás se devuelve al endpoint del candidato
395 | 
396 | **Tablas afectadas**: `desafios`, `llamadas_llm`, `eventos_auditoria`
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
product/PRODUCT.md

# VSCode Open Tabs
product/PRODUCT.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:07:45.682Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.33

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

I need to continue reading to see all the use cases in PRODUCT.md.

<search_files>
<path>product/PRODUCT.md</path>
<regex>^#### UC-\d+:</regex>
</search_files>

---

**User:**

[search_files for '^#### UC-\d+:'] Result:
Found 22 results.

# product/PRODUCT.md
125 | 
126 | #### UC-001: registrar usuario
127 | 
----
170 | 
171 | #### UC-002: iniciar sesión
172 | 
----
209 | 
210 | #### UC-003: completar perfil tras primer login
211 | 
----
244 | 
245 | #### UC-004: crear organización
246 | 
----
275 | 
276 | #### UC-005: invitar miembro a organización con rol
277 | 
----
313 | 
314 | #### UC-006: crear puesto laboral
315 | 
----
342 | 
343 | #### UC-007: generar desafío técnico desde un puesto
344 | 
----
401 | 
402 | #### UC-008: confirmar o regenerar desafío propuesto
403 | 
----
439 | 
440 | #### UC-009: invitar candidato a un desafío
441 | 
----
482 | 
483 | #### UC-010: ver ranking de candidatos
484 | 
----
522 | 
523 | #### UC-011: ver detalle de evaluación de un candidato
524 | 
----
558 | 
559 | #### UC-012: crear curso
560 | 
----
583 | 
584 | #### UC-013: inscribir alumnos a un curso
585 | 
----
616 | 
617 | #### UC-014: generar desafío para curso
618 | 
----
657 | 
658 | #### UC-015: escribir recomendación a un alumno
659 | 
----
693 | 
694 | #### UC-016: aceptar invitación y acceder al desafío
695 | 
----
736 | 
737 | #### UC-017: resolver desafío
738 | 
----
816 | 
817 | #### UC-018: ver feedback de evaluación propia
818 | 
----
864 | 
865 | #### UC-019: gestionar visibilidad en el pool de talento
866 | 
----
903 | 
904 | #### UC-020: aceptar o rechazar recomendación recibida
905 | 
----
938 | 
939 | #### UC-021: hacer consulta a LLM en contexto de curso
940 | 
----
984 | 
985 | #### UC-022: votar consulta del repositorio
986 | 
----
<environment_details>
# VSCode Visible Files
product/PRODUCT.md

# VSCode Open Tabs
product/PRODUCT.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:07:50.511Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.41

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

Now I can see there are 22 use cases in total. Let me read the section that lists all use cases in a table format to understand the complete picture.

<read_file>
<args>
<file>
<path>product/PRODUCT.md</path>
<line_range>1-170</line_range>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'product/PRODUCT.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>product/PRODUCT.md</path>
<content lines="1-170">
  1 | # PRODUCT.md — Talent Pool
  2 | 
  3 | > Documento estable. Cambios requieren decisión explícita y entrada en `CHANGELOG.md`.
  4 | > Última revisión: YYYY-MM-DD
  5 | > Versión del documento: 1.0
  6 | 
  7 | ---
  8 | 
  9 | ## 1. problema
 10 | 
 11 | ### 1.1 enunciado
 12 | La conexión entre la formación técnica y el mercado laboral es ineficiente: docentes invierten tiempo desproporcionado en generar y corregir prácticas; alumnos consultan a la IA de forma aislada perdiendo el aprendizaje colaborativo; empresas contratan personas sin dominio práctico de las herramientas y flujos específicos que necesitan.
 13 | 
 14 | ### 1.2 contexto y dolor actual
 15 | - **Docentes**: dedican horas a redactar enunciados y corregir entregas que se repiten año tras año. La calidad de la corrección es desigual y sin métricas comparables.
 16 | - **Alumnos**: usan herramientas LLM individualmente, repiten consultas que sus compañeros ya hicieron y no consolidan aprendizaje grupal. Llegan al mercado con teoría pero sin práctica en flujos reales.
 17 | - **Reclutadores**: filtran CVs sin garantía de habilidades reales. Las pruebas técnicas son caras de armar y de corregir, y no están alineadas a las herramientas internas. La inducción de un junior cuesta semanas.
 18 | - **Empresas**: alta rotación temprana porque el candidato "se ve bien en la entrevista" pero no opera con eficiencia en los flujos internos desde el día 1.
 19 | 
 20 | ### 1.3 evidencia
 21 | - Estudios de mercado sobre tiempo de docentes en evaluación (rellenar con fuentes argentinas/latam concretas)
 22 | - Costo promedio de inducción reportado por consultoras de RR.HH. (rellenar)
 23 | - Encuestas a alumnos universitarios sobre uso de IA (rellenar)
 24 | - Entrevistas piloto con docentes y reclutadores (a realizar antes de fase 2)
 25 | 
 26 | ---
 27 | 
 28 | ## 2. propuesta de valor
 29 | 
 30 | ### 2.1 enunciado
 31 | **Para docentes y reclutadores que necesitan evaluar habilidades técnicas reales, Talent Pool es una plataforma de evaluación y descubrimiento de talento asistida por IA que automatiza la generación y corrección de desafíos prácticos y conecta la formación académica con el reclutamiento, a diferencia de los assessments tradicionales que requieren armado manual y no permiten comparar candidatos académicos con corporativos en una misma vara.**
 32 | 
 33 | ### 2.2 diferenciadores
 34 | - **Una sola evaluación, dos audiencias**: el mismo desafío resuelto por un alumno en clase puede mostrarse, con su consentimiento, a reclutadores. La capacitación se convierte en pre-screening sin esfuerzo adicional.
 35 | - **Recomendaciones de docentes visibles para reclutadores**: el feedback de un profesor que conoce al alumno acompaña su perfil técnico.
 36 | - **Repositorio colectivo de consultas LLM**: las preguntas de los alumnos a la IA se vuelven recurso compartido del curso. Reduce duplicación, acelera aprendizaje grupal.
 37 | - **Trazabilidad y auditoría**: todo prompt y toda evaluación queda versionada y registrada. Reproducible, defendible legalmente.
 38 | 
 39 | ### 2.3 dos clientes primarios
 40 | A diferencia de productos similares que eligen un solo cliente, Talent Pool atiende a **dos clientes primarios** que se retroalimentan:
 41 | 
 42 | 1. **Instituciones educativas y docentes**: pagan por automatización de prácticas, repositorio colectivo, y dashboard de progreso del curso.
 43 | 2. **Empresas y reclutadores**: pagan por acceso al pool de talento preevaluado, generación de desafíos custom alineados a sus stacks, y métricas comparables.
 44 | 
 45 | El alumno/candidato no paga; es el activo que conecta ambos lados.
 46 | 
 47 | ---
 48 | 
 49 | ## 3. usuario objetivo
 50 | 
 51 | ### 3.1 segmentos primarios
 52 | 
 53 | #### segmento A: docentes universitarios o de bootcamps técnicos
 54 | - **Perfil**: profesores de carreras de IT/sistemas, instructores de bootcamps, capacitadores corporativos
 55 | - **Contexto de uso**: planificación semanal o cuatrimestral, corrección de prácticas, seguimiento de cursos de 20-150 alumnos
 56 | - **Necesidades clave**: generar variantes de prácticas, corregir entregas con criterio uniforme, ver progreso individual y grupal, dar recomendaciones a sus alumnos sobresalientes
 57 | - **Nivel técnico**: alto en su disciplina, medio-bajo en herramientas digitales modernas
 58 | 
 59 | #### segmento B: reclutadores técnicos y líderes técnicos
 60 | - **Perfil**: HR técnico, talent acquisition, líderes que reclutan para su propio equipo
 61 | - **Contexto de uso**: armado de procesos de búsqueda, screening, decisiones de contratación
 62 | - **Necesidades clave**: filtrar candidatos por habilidades demostradas, evaluar a libro abierto sin armar el assessment desde cero, validar contra herramientas internas
 63 | - **Nivel técnico**: técnico o semi-técnico
 64 | 
 65 | ### 3.2 usuarios secundarios (consumidores del valor, no clientes)
 66 | 
 67 | #### segmento C: alumnos universitarios o de bootcamps
 68 | - **Perfil**: estudiantes en carreras técnicas (sistemas, ingeniería, ciencia de datos), alumnos de bootcamps
 69 | - **Necesidades**: practicar con feedback inmediato, conseguir trabajo, mostrar habilidades reales
 70 | - **Nivel técnico**: en formación
 71 | 
 72 | #### segmento D: candidatos profesionales
 73 | - **Perfil**: desarrolladores buscando trabajo o pasivos abiertos a oportunidades
 74 | - **Necesidades**: demostrar capacidades sin tener que hacer 5 entrevistas técnicas distintas
 75 | - **Nivel técnico**: profesional
 76 | 
 77 | ### 3.3 antiusuarios (NO objetivo)
 78 | - Empresas que prefieren entrevistas en vivo sin componente técnico automatizado
 79 | - Docentes de áreas no técnicas (humanidades, derecho)
 80 | - Niños o menores de edad como alumnos (compliance no contemplado en v1)
 81 | - Empresas que requieren on-premise o aislamiento de datos sin internet
 82 | 
 83 | ---
 84 | 
 85 | ## 4. casos de uso
 86 | 
 87 | ### 4.1 índice completo
 88 | 
 89 | | ID | nombre | actor | prioridad | fase |
 90 | |----|--------|-------|-----------|------|
 91 | | **identidad y onboarding** | | | | |
 92 | | UC-001 | registrar usuario | visitante | crítica | 1 |
 93 | | UC-002 | iniciar sesión | usuario | crítica | 1 |
 94 | | UC-003 | completar perfil tras primer login | usuario | alta | 1 |
 95 | | **gestión de organizaciones** | | | | |
 96 | | UC-004 | crear organización | usuario | crítica | 1 |
 97 | | UC-005 | invitar miembro a organización con rol | owner/admin | alta | 2 |
 98 | | **lado corporativo** | | | | |
 99 | | UC-006 | crear puesto laboral | reclutador | crítica | 1 |
100 | | UC-007 | generar desafío técnico desde un puesto | reclutador | crítica | 1 |
101 | | UC-008 | confirmar o regenerar desafío propuesto | reclutador/docente | crítica | 1 |
102 | | UC-009 | invitar candidato a un desafío | reclutador | crítica | 1 |
103 | | UC-010 | ver ranking de candidatos | reclutador | crítica | 1 |
104 | | UC-011 | ver detalle de evaluación de un candidato | reclutador | crítica | 1 |
105 | | **lado académico** | | | | |
106 | | UC-012 | crear curso | docente | crítica | 2 |
107 | | UC-013 | inscribir alumnos a un curso | docente | alta | 2 |
108 | | UC-014 | generar desafío para curso | docente | crítica | 2 |
109 | | UC-015 | escribir recomendación a un alumno | docente | alta | 2 |
110 | | **candidato / alumno** | | | | |
111 | | UC-016 | aceptar invitación y acceder al desafío | candidato | crítica | 1 |
112 | | UC-017 | resolver desafío | candidato/alumno | crítica | 1 |
113 | | UC-018 | ver feedback de evaluación propia | candidato/alumno | crítica | 1 |
114 | | UC-019 | gestionar visibilidad en el pool de talento | usuario | alta | 2 |
115 | | UC-020 | aceptar o rechazar recomendación recibida | alumno | alta | 2 |
116 | | **colaboración (repositorio LLM)** | | | | |
117 | | UC-021 | hacer consulta a LLM en contexto de curso | alumno | alta | 2 |
118 | | UC-022 | votar consulta del repositorio | alumno | media | 2 |
119 | 
120 | ### 4.2 detalle de cada UC
121 | 
122 | Cada UC se desarrolla en archivo separado en `docs/uc/UC-NNN-slug.md` siguiendo `UC-template.md`. Acá se incluye el detalle completo de cada uno para referencia centralizada.
123 | 
124 | ---
125 | 
126 | #### UC-001: registrar usuario
127 | 
128 | - **Actor principal**: visitante anónimo
129 | - **Objetivo**: crear una cuenta para acceder a la plataforma
130 | - **Precondiciones**: el visitante no tiene cuenta con el email a usar
131 | - **Postcondiciones**: existe registro en `usuarios` con email verificado pendiente; se crea automáticamente un `perfil_talento` asociado con `visible_reclutadores=true` por default
132 | 
133 | **Flujo principal**:
134 | 1. El visitante accede a la pantalla de registro
135 | 2. Ingresa nombre completo, email y contraseña
136 | 3. El cliente valida formato y fortaleza
137 | 4. El sistema valida en servidor (Bean Validation)
138 | 5. El sistema verifica que el email no esté registrado
139 | 6. El sistema hashea la contraseña con argon2id y persiste el usuario
140 | 7. El sistema crea un `perfil_talento` con valores default
141 | 8. El sistema envía email de verificación
142 | 9. El sistema emite tokens y redirige a UC-003 (completar perfil)
143 | 
144 | **Flujos de error**:
145 | - Email duplicado → 409 con mensaje genérico (anti-enumeración)
146 | - Contraseña débil → 422 con criterios faltantes
147 | - Rate limit → 429 con `Retry-After`
148 | 
149 | **Criterios de aceptación**:
150 | ```gherkin
151 | Escenario: registro exitoso
152 |   Dado que el email "ana@example.com" no está registrado
153 |   Cuando envío POST /api/v1/auth/register con datos válidos
154 |   Entonces recibo 201 con tokens
155 |   Y existe un perfil_talento con visible_reclutadores=true
156 |   Y se envió email de verificación
157 | 
158 | Escenario: email ya registrado
159 |   Dado que existe un usuario con "bob@example.com"
160 |   Cuando intento registrarme con ese email
161 |   Entonces recibo 409 con mensaje genérico
162 |   Y no se crea ningún registro nuevo
163 | ```
164 | 
165 | **RNFs**: latencia p95 < 400 ms · rate limit 5/min/IP · auditoría obligatoria
166 | 
167 | **Tablas afectadas**: `usuarios`, `perfiles_talento`, `eventos_auditoria`
168 | 
169 | ---
170 | 
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
product/PRODUCT.md

# VSCode Open Tabs
product/PRODUCT.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:07:54.767Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.50

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

Now I understand the complete picture. The PRODUCT.md has been significantly expanded with 22 use cases organized into different categories. I need to update the README.md to reflect this comprehensive structure while maintaining clarity about what's in the MVP vs. future phases.

<apply_diff>
<path>README.md</path>
<diff>
<<<<<<< SEARCH
## MVP Scope (Hackathon)

### Core Use Cases

The MVP implements **4 critical use cases** for the hackathon demo:

| ID | Use Case | Priority | Actor |
|----|----------|----------|-------|
| **UC-001** | Generar desafío técnico automatizado | Crítica | Reclutador/Docente |
| **UC-002** | Resolver desafío y evaluar mediante análisis estático | Crítica | Candidato/Alumno |
| **UC-003** | Visualizar ranking de candidatos y reportes de evaluación | Crítica | Reclutador/Docente |
| **UC-004** | Acceder y seleccionar desafíos por parte del candidato | Crítica | Candidato/Alumno |

**UC-001: Generate Technical Challenge**
- Recruiter/educator inputs job parameters (role, technology, seniority)
- System generates challenge + hidden rubric via LLM (LangChain4j)
- Challenge becomes available for candidates
- **Output**: Challenge with structured rubric stored in JSONB

**UC-002: Solve and Evaluate Challenge**
- Candidate views challenge and develops solution in integrated editor
- System evaluates via AI-powered static analysis
- Returns score (0-100) and detailed feedback with multi-dimensional breakdown
- **Output**: Evaluation with score, feedback, and dimension analysis

**UC-003: View Rankings and Reports**
- Recruiter accesses dashboard with candidate rankings by challenge
- Reviews submitted code and AI analysis
- Filters by score, technology, and seniority
- Makes selection decisions based on objective metrics

**UC-004: Browse Challenge Catalog**
- Candidate accesses challenge catalog
- Filters by technology/level/context (corporate, academic, public)
- Selects challenge and initiates evaluation process
- Tracks personal progress and historical evaluations

### Planned Use Cases (Post-MVP)

| ID | Use Case | Priority | Phase |
|----|----------|----------|-------|
| UC-005 | Registrar usuario (reclutador/candidato) | Alta | 2 |
| UC-006 | Iniciar sesión y gestión de perfiles | Alta | 2 |
| UC-007 | Centralizar consultas a IA (repositorio colectivo) | Alta | 2 |
| UC-008 | Generar guías de estudio personalizadas | Media | 2 |
| UC-009 | Filtrar base de talento por tecnología y puntaje | Media | 3 |
| UC-010 | Crear simuladores de flujos de trabajo empresariales | Media | 3 |
| UC-011 | Emitir certificados digitales de finalización | Baja | 4 |
| UC-012 | Sistema de suscripciones y pagos | Baja | 4 |
=======
## MVP Scope (Hackathon)

### Use Case Overview

The platform implements **22 use cases** organized into 6 functional areas. The MVP (Phase 1) focuses on **11 critical use cases** for the hackathon demo:

#### Phase 1 - MVP (Critical Use Cases)

**Identity & Onboarding**
- **UC-001**: Registrar usuario - Create account with email verification
- **UC-002**: Iniciar sesión - Authenticate and obtain access tokens
- **UC-003**: Completar perfil tras primer login - Complete profile wizard with role selection

**Organization Management**
- **UC-004**: Crear organización - Create company or educational institution

**Corporate Side (Recruiters)**
- **UC-006**: Crear puesto laboral - Register job position
- **UC-007**: Generar desafío técnico desde un puesto - AI-powered challenge generation via LangChain4j
- **UC-008**: Confirmar o regenerar desafío propuesto - Review and refine generated challenges
- **UC-009**: Invitar candidato a un desafío - Send challenge invitations to candidates
- **UC-010**: Ver ranking de candidatos - View candidate rankings and metrics
- **UC-011**: Ver detalle de evaluación de un candidato - Review detailed evaluation reports

**Candidate/Student Side**
- **UC-016**: Aceptar invitación y acceder al desafío - Accept invitation and access challenge
- **UC-017**: Resolver desafío - Solve challenge in integrated editor with AI evaluation
- **UC-018**: Ver feedback de evaluación propia - View detailed feedback and scoring

#### Phase 2 - Academic Module (High Priority)

**Academic Side (Educators)**
- **UC-012**: Crear curso - Create academic course
- **UC-013**: Inscribir alumnos a un curso - Enroll students in courses
- **UC-014**: Generar desafío para curso - Generate challenges for academic context
- **UC-015**: Escribir recomendación a un alumno - Write student recommendations

**Organization & Talent Management**
- **UC-005**: Invitar miembro a organización con rol - Invite members with specific roles
- **UC-019**: Gestionar visibilidad en el pool de talento - Manage talent pool visibility
- **UC-020**: Aceptar o rechazar recomendación recibida - Accept/reject recommendations

**Collaborative Learning (LLM Repository)**
- **UC-021**: Hacer consulta a LLM en contexto de curso - Make AI queries in course context
- **UC-022**: Votar consulta del repositorio - Vote on shared AI queries

### Core MVP Flows

**Flow 1: Recruiter Creates Challenge**
1. Recruiter creates organization (UC-004) and job position (UC-006)
2. System generates AI-powered challenge from job parameters (UC-007)
3. Recruiter reviews and confirms challenge (UC-008)
4. Recruiter invites candidates (UC-009)

**Flow 2: Candidate Solves Challenge**
1. Candidate registers (UC-001) and completes profile (UC-003)
2. Candidate accepts invitation (UC-016)
3. Candidate solves challenge in integrated editor (UC-017)
4. System evaluates via LangChain4j and returns detailed feedback (UC-018)

**Flow 3: Recruiter Reviews Results**
1. Recruiter views candidate rankings (UC-010)
2. Recruiter reviews detailed evaluations and code (UC-011)
3. Recruiter makes hiring decisions based on objective metrics
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'README.md'] Result:
<file_write_result>
<path>README.md</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<notice>Making multiple related changes in a single apply_diff is more efficient. If other changes are needed in this file, please include them as additional SEARCH/REPLACE blocks.</notice>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:08:34.888Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.61

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

Now I need to update the data model section and the roadmap to reflect the expanded scope.

<apply_diff>
<path>README.md</path>
<diff>
<<<<<<< SEARCH
**Data Model**
- **20 tables** organized in 7 domains (see `product/DATABASE.md` for complete schema)
- **MVP Core**: 8 tables (usuarios, organizaciones, membresias, puestos, desafios, asignaciones_desafio, evaluaciones, prompt_versiones)
- PostgreSQL with JSONB support
- pgvector extension (prepared for future RAG)
=======
**Data Model**
- **20 tables** organized in 7 domains (see `product/DATABASE.md` for complete schema)
- **MVP Core (Phase 1)**: 8 essential tables
  - `usuarios` - User accounts with authentication
  - `organizaciones` - Companies and educational institutions
  - `membresias` - User-organization relationships with roles
  - `puestos` - Job positions
  - `desafios` - AI-generated technical challenges
  - `asignaciones_desafio` - Challenge invitations to candidates
  - `evaluaciones` - Challenge evaluations with AI feedback
  - `prompt_versiones` - Versioned LLM prompts for auditability
- **Phase 2 Additions**: `cursos`, `inscripciones_curso`, `perfiles_talento`, `habilidades_perfil`, `recomendaciones`, `consultas_llm`, `votos_consulta`
- PostgreSQL 16 with JSONB for structured AI outputs
- pgvector 0.7.x extension (prepared for RAG in Phase 3)
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'README.md'] Result:
<error_details>
No sufficiently similar match found (87% similar, needs 100%)

Debug Info:
- Similarity Score: 87%
- Required Threshold: 100%
- Search Range: start to end
- Tried both standard and aggressive line number stripping
- Tip: Use the read_file tool to get the latest content of the file before attempting to use the apply_diff tool again, as the file content may have changed

Search Content:
**Data Model**
- **20 tables** organized in 7 domains (see `product/DATABASE.md` for complete schema)
- **MVP Core**: 8 tables (usuarios, organizaciones, membresias, puestos, desafios, asignaciones_desafio, evaluaciones, prompt_versiones)
- PostgreSQL with JSONB support
- pgvector extension (prepared for future RAG)

Best Match Found:
112 | 
113 | **Data Model**
114 | - **20 tables** organized in 7 domains (see `product/DATABASE.md` for complete schema)
115 | - **MVP Core**: 8 tables (usuarios, organizaciones, membresias, puestos, desafios, asignaciones_desafio, evaluaciones, prompt_versiones)
116 | - PostgreSQL 16 with JSONB support for structured data (rubrics, feedback)


Original Content:
 1 | # Talent Pool — AI-Powered Technical Assessment Platform
 2 | 
 3 | > **MVP for IBM Hackathon 2026** | Automated challenge generation and evaluation using LangChain4j
 4 | 
 5 | **Stack**: Quarkus + Java 21 + LangChain4j + PostgreSQL + pgvector + React + TypeScript + Vite
 6 | 
 7 | ---
 8 | 
 9 | ## Overview
10 | 
11 | Talent Pool is an AI-powered platform that bridges the gap between technical education and employment by automating the generation and evaluation of technical challenges. It reduces operational overhead for educators, optimizes learning resources for students, and provides companies with access to pre-evaluated talent.
12 | 
13 | ### Core Value Proposition
14 | 
15 | - **Automated end-to-end assessment**: LLM-powered challenge generation with hidden rubrics and static code analysis
16 | - **Collective knowledge repository**: Centralized AI queries to avoid resource duplication
17 | - **Direct education-to-employment bridge**: Pre-evaluated talent database with real-world workflow simulations
18 | - **Contextualized evaluation**: Open-book challenges that simulate actual work environments
19 | 
20 | ---
21 | 
22 | ## Problem Statement
23 | 
24 | The disconnect between academic training and the job market creates:
25 | 
26 | - **For educators**: Countless hours spent on manual grading and correction
27 | - **For students**: Isolated AI tool usage without collaborative learning opportunities
28 | - **For companies**: High onboarding costs (USD 10,000-30,000 per employee) and 3-6 month induction periods
29 | 
30 | **Current alternatives** (HackerRank, Codility, traditional LMS) lack AI-powered automation and don't personalize content or connect education directly with job placement.
31 | 
32 | ---
33 | 
34 | ## MVP Scope (Hackathon)
35 | 
36 | ### Use Case Overview
37 | 
38 | The platform implements **22 use cases** organized into 6 functional areas. The MVP (Phase 1) focuses on **11 critical use cases** for the hackathon demo:
39 | 
40 | #### Phase 1 - MVP (Critical Use Cases)
41 | 
42 | **Identity & Onboarding**
43 | - **UC-001**: Registrar usuario - Create account with email verification
44 | - **UC-002**: Iniciar sesión - Authenticate and obtain access tokens

</error_details>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:08:44.747Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.71

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

Let me read the current state of the file to see the exact content.

<read_file>
<args>
<file>
<path>README.md</path>
<line_range>110-120</line_range>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'README.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>README.md</path>
<content lines="110-120">
110 | - Integrated code editor (Monaco Editor)
111 | - Results and ranking views
112 | 
113 | **Data Model**
114 | - **20 tables** organized in 7 domains (see `product/DATABASE.md` for complete schema)
115 | - **MVP Core**: 8 tables (usuarios, organizaciones, membresias, puestos, desafios, asignaciones_desafio, evaluaciones, prompt_versiones)
116 | - PostgreSQL 16 with JSONB support for structured data (rubrics, feedback)
117 | - pgvector 0.7.x extension (prepared for future RAG)
118 | - Multi-tenant architecture via `organizacion_id`
119 | - UUID v7 identifiers for time-ordered IDs
120 | 
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:08:48.747Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.82

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

<apply_diff>
<path>README.md</path>
<diff>
<<<<<<< SEARCH
**Data Model**
- **20 tables** organized in 7 domains (see `product/DATABASE.md` for complete schema)
- **MVP Core**: 8 tables (usuarios, organizaciones, membresias, puestos, desafios, asignaciones_desafio, evaluaciones, prompt_versiones)
- PostgreSQL 16 with JSONB support for structured data (rubrics, feedback)
- pgvector 0.7.x extension (prepared for future RAG)
- Multi-tenant architecture via `organizacion_id`
- UUID v7 identifiers for time-ordered IDs
=======
**Data Model**
- **20 tables** organized in 7 domains (see `product/DATABASE.md` for complete schema)
- **MVP Core (Phase 1)**: 8 essential tables
  - `usuarios` - User accounts with authentication
  - `organizaciones` - Companies and educational institutions
  - `membresias` - User-organization relationships with roles (OWNER, ADMIN, RECLUTADOR, DOCENTE, ALUMNO)
  - `puestos` - Job positions with technology and seniority
  - `desafios` - AI-generated technical challenges with hidden rubrics
  - `asignaciones_desafio` - Challenge invitations to candidates
  - `evaluaciones` - Challenge evaluations with AI feedback and scoring
  - `prompt_versiones` - Versioned LLM prompts for auditability and A/B testing
- **Phase 2 Additions**: `cursos`, `inscripciones_curso`, `perfiles_talento`, `habilidades_perfil`, `recomendaciones`, `consultas_llm`, `votos_consulta`, `llamadas_llm`, `eventos_auditoria`
- PostgreSQL 16 with JSONB support for structured AI outputs (rubrics, feedback, dimensions)
- pgvector 0.7.x extension (prepared for RAG in Phase 3)
- Multi-tenant architecture via `organizacion_id`
- UUID v7 identifiers for time-ordered IDs with embedded timestamps
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'README.md'] Result:
<file_write_result>
<path>README.md</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<notice>Making multiple related changes in a single apply_diff is more efficient. If other changes are needed in this file, please include them as additional SEARCH/REPLACE blocks.</notice>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:08:58.576Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$0.93

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

Now let me update the Key Endpoints section to reflect the expanded use cases and the Roadmap section.

<read_file>
<args>
<file>
<path>README.md</path>
<line_range>280-330</line_range>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'README.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>README.md</path>
<content lines="280-330">
280 | - PostgreSQL 16 (or use docker-compose)
281 | 
282 | ### Local Development
283 | 
284 | 1. **Clone and setup**
285 |    ```bash
286 |    git clone <repository-url>
287 |    cd hackathon
288 |    ```
289 | 
290 | 2. **Start infrastructure**
291 |    ```bash
292 |    cd infra/compose
293 |    docker-compose up -d  # PostgreSQL + pgvector + Redis + Ollama
294 |    ```
295 | 
296 | 3. **Backend**
297 |    ```bash
298 |    cd backend
299 |    mvn quarkus:dev  # Runs on http://localhost:8080
300 |    ```
301 | 
302 | 4. **Frontend**
303 |    ```bash
304 |    cd frontend
305 |    pnpm install
306 |    pnpm dev  # Runs on http://localhost:5173
307 |    ```
308 | 
309 | ### Environment Variables
310 | 
311 | Create `.env` files or configure in `application.yml`:
312 | 
313 | ```yaml
314 | # Backend (application.yml)
315 | quarkus:
316 |   langchain4j:
317 |     openai:
318 |       api-key: ${LLM_API_KEY}
319 |   datasource:
320 |     jdbc:
321 |       url: ${DB_JDBC_URL:jdbc:postgresql://localhost:5432/talentpool}
322 |     username: ${DB_USERNAME:postgres}
323 |     password: ${DB_PASSWORD:postgres}
324 | ```
325 | 
326 | ---
327 | 
328 | ## Key Endpoints (MVP)
329 | 
330 | ### Challenge Management
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:09:02.131Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$1.04

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

<read_file>
<args>
<file>
<path>README.md</path>
<line_range>328-360</line_range>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'README.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>README.md</path>
<content lines="328-360">
328 | ## Key Endpoints (MVP)
329 | 
330 | ### Challenge Management
331 | - `POST /api/v1/puestos` - Create job position
332 | - `POST /api/v1/desafios/generar` - Generate challenge (UC-001)
333 | - `GET /api/v1/desafios` - List challenges (UC-004)
334 | - `GET /api/v1/desafios/{id}` - Get challenge details
335 | 
336 | ### Evaluation
337 | - `POST /api/v1/evaluaciones` - Submit solution (UC-002)
338 | - `GET /api/v1/evaluaciones/{id}` - Get evaluation result
339 | - `GET /api/v1/evaluaciones/ranking/{desafioId}` - Get rankings (UC-003)
340 | 
341 | ### Health & Monitoring
342 | - `GET /q/health/live` - Liveness probe
343 | - `GET /q/health/ready` - Readiness probe
344 | - `GET /q/metrics` - Prometheus metrics
345 | 
346 | ---
347 | 
348 | ## Success Metrics
349 | 
350 | ### Product Metrics (Hackathon)
351 | - ≥ 50 challenges generated successfully
352 | - ≥ 100 completed evaluations
353 | - < 30s average challenge generation time
354 | - < 10s average evaluation time
355 | - ≥ 60% challenge completion rate
356 | - ≥ 7/10 user satisfaction (NPS)
357 | 
358 | ### Technical SLOs
359 | - 99% system availability
360 | - < 300ms p95 latency for CRUD endpoints
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:09:05.474Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$1.16

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

<apply_diff>
<path>README.md</path>
<diff>
<<<<<<< SEARCH
## Key Endpoints (MVP)

### Challenge Management
- `POST /api/v1/puestos` - Create job position
- `POST /api/v1/desafios/generar` - Generate challenge (UC-001)
- `GET /api/v1/desafios` - List challenges (UC-004)
- `GET /api/v1/desafios/{id}` - Get challenge details

### Evaluation
- `POST /api/v1/evaluaciones` - Submit solution (UC-002)
- `GET /api/v1/evaluaciones/{id}` - Get evaluation result
- `GET /api/v1/evaluaciones/ranking/{desafioId}` - Get rankings (UC-003)

### Health & Monitoring
- `GET /q/health/live` - Liveness probe
- `GET /q/health/ready` - Readiness probe
- `GET /q/metrics` - Prometheus metrics
=======
## Key Endpoints (MVP)

### Authentication & Identity (UC-001, UC-002, UC-003)
- `POST /api/v1/auth/register` - Register new user with email verification
- `POST /api/v1/auth/login` - Authenticate and obtain JWT tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `PATCH /api/v1/usuarios/{id}/perfil` - Complete user profile

### Organization Management (UC-004, UC-005)
- `POST /api/v1/organizaciones` - Create organization (company or institution)
- `GET /api/v1/organizaciones/{id}` - Get organization details
- `POST /api/v1/organizaciones/{id}/invitaciones` - Invite member with role
- `GET /api/v1/organizaciones/{id}/miembros` - List organization members

### Job Positions & Challenges (UC-006, UC-007, UC-008)
- `POST /api/v1/puestos` - Create job position
- `GET /api/v1/puestos` - List positions
- `POST /api/v1/desafios/generar` - Generate AI-powered challenge from position
- `PUT /api/v1/desafios/{id}/confirmar` - Confirm or regenerate challenge
- `GET /api/v1/desafios/{id}` - Get challenge details (rubric hidden for candidates)

### Challenge Invitations (UC-009, UC-016)
- `POST /api/v1/asignaciones` - Invite candidate to challenge
- `GET /api/v1/asignaciones/mis-invitaciones` - List my pending invitations
- `POST /api/v1/asignaciones/{id}/aceptar` - Accept challenge invitation

### Evaluation & Solving (UC-017, UC-018)
- `POST /api/v1/evaluaciones` - Submit solution for AI evaluation
- `GET /api/v1/evaluaciones/{id}` - Get evaluation result with feedback
- `GET /api/v1/evaluaciones/mis-evaluaciones` - List my evaluations

### Rankings & Reports (UC-010, UC-011)
- `GET /api/v1/evaluaciones/ranking/{desafioId}` - Get candidate rankings by challenge
- `GET /api/v1/evaluaciones/{id}/detalle-reclutador` - Get detailed evaluation (recruiter view with rubric)

### Health & Monitoring
- `GET /q/health/live` - Liveness probe
- `GET /q/health/ready` - Readiness probe
- `GET /q/metrics` - Prometheus metrics
- `GET /q/openapi` - OpenAPI 3.0 specification
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'README.md'] Result:
<file_write_result>
<path>README.md</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<notice>Making multiple related changes in a single apply_diff is more efficient. If other changes are needed in this file, please include them as additional SEARCH/REPLACE blocks.</notice>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:09:20.402Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$1.28

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

Now let me update the Roadmap section to reflect the new phase structure.

<read_file>
<args>
<file>
<path>README.md</path>
<line_range>440-470</line_range>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'README.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>README.md</path>
<content lines="440-470">
440 | ### Branch Protection (main)
441 | - Require PR reviews (≥ 1 approval)
442 | - Require status checks: `backend`, `frontend`, `e2e`, `sonar`, `docker-build`
443 | - Require branches up to date
444 | - No bypass allowed
445 | 
446 | ---
447 | 
448 | ## Development Principles
449 | 
450 | 1. **Closed decisions, not open**: Agent executes architecture, doesn't choose it
451 | 2. **Immutable tests**: Fix code, never tests
452 | 3. **LLM tests always mocked**: Real calls only in eval suite
453 | 4. **Documented debt or it doesn't exist**: Undocumented shortcuts = future bugs
454 | 5. **No ambiguity**: Every UC has verifiable criteria, every PR has DoD
455 | 6. **Security and observability from day 1**: Not final phases
456 | 7. **Measured quality, not assumed**: Linters, tests, evals, and Sonar block in CI
457 | 8. **Controlled costs**: Every LLM UC declares token budget and cost
458 | 
459 | ---
460 | 
461 | ## Documentation
462 | 
463 | - **Product Definition**: [product/PRODUCT.md](product/PRODUCT.md) - Complete product vision, use cases, and metrics
464 | - **Architecture**: [product/ARCHITECTURE.md](product/ARCHITECTURE.md) - Technical architecture and stack decisions
465 | - **Database Schema**: [product/DATABASE.md](product/DATABASE.md) - Complete 20-table schema with all constraints and rules
466 | - **Roadmap**: [product/ROADMAP.md](product/ROADMAP.md) - Development phases and milestones
467 | - **Use Cases**: [docs/uc/](docs/uc/) - Detailed use case specifications
468 | - **ADRs**: [docs/adr/](docs/adr/) - Architecture Decision Records
469 | - **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
470 | - **Changelog**: [CHANGELOG.md](CHANGELOG.md) - Version history
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:09:23.900Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$1.40

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

<read_file>
<args>
<file>
<path>README.md</path>
<line_range>470-510</line_range>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'README.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>README.md</path>
<content lines="470-510">
470 | - **Changelog**: [CHANGELOG.md](CHANGELOG.md) - Version history
471 | - **Tech Debt**: [TECH_DEBT.md](TECH_DEBT.md) - Known technical debt
472 | 
473 | ---
474 | 
475 | ## Roadmap
476 | 
477 | ### Phase 0: MVP (Hackathon - 48-72h)
478 | - ✅ Core evaluation engine (UC-001 to UC-004)
479 | - ✅ 4 essential screens
480 | - ✅ Basic data model
481 | - ✅ LLM integration via LangChain4j
482 | 
483 | ### Phase 2: Academic Module (4-6 weeks)
484 | - Authentication system (OAuth, granular roles)
485 | - Collective AI query repository
486 | - Personalized study guides
487 | - Student collaboration features
488 | 
489 | ### Phase 3: Corporate Expansion (8-12 weeks)
490 | - Searchable talent database
491 | - Company-specific workflow simulators
492 | - ATS integrations
493 | - Advanced analytics
494 | 
495 | ### Phase 4: Monetization (12-16 weeks)
496 | - Subscription system
497 | - Payment processing
498 | - Digital certificates
499 | - Premium challenge marketplace
500 | 
501 | ---
502 | 
503 | ## License
504 | 
505 | [To be defined]
506 | 
507 | ---
508 | 
509 | ## Contact
510 | 
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:09:26.679Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$1.52

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

<apply_diff>
<path>README.md</path>
<diff>
<<<<<<< SEARCH
## Roadmap

### Phase 0: MVP (Hackathon - 48-72h)
- ✅ Core evaluation engine (UC-001 to UC-004)
- ✅ 4 essential screens
- ✅ Basic data model
- ✅ LLM integration via LangChain4j

### Phase 2: Academic Module (4-6 weeks)
- Authentication system (OAuth, granular roles)
- Collective AI query repository
- Personalized study guides
- Student collaboration features

### Phase 3: Corporate Expansion (8-12 weeks)
- Searchable talent database
- Company-specific workflow simulators
- ATS integrations
- Advanced analytics

### Phase 4: Monetization (12-16 weeks)
- Subscription system
- Payment processing
- Digital certificates
- Premium challenge marketplace
=======
## Roadmap

### Phase 1: MVP (Hackathon - 48-72h)
**11 Critical Use Cases** - Complete end-to-end flows for both recruiters and candidates

**Identity & Onboarding** (UC-001 to UC-003)
- User registration with email verification (argon2id password hashing)
- JWT-based authentication (access + refresh tokens)
- Profile completion wizard with role selection

**Organization & Job Management** (UC-004, UC-006)
- Create organizations (companies/institutions)
- Create job positions with technology and seniority

**AI-Powered Challenge Generation** (UC-007, UC-008)
- Generate challenges from job parameters via LangChain4j
- Confirm or regenerate with versioned prompts
- Hidden rubrics stored in JSONB

**Challenge Assignment & Solving** (UC-009, UC-016, UC-017, UC-018)
- Invite candidates to challenges
- Accept invitations and access challenges
- Solve in integrated Monaco editor
- AI-powered evaluation with detailed feedback

**Recruiter Analytics** (UC-010, UC-011)
- View candidate rankings by challenge
- Review detailed evaluations with code and rubric analysis

**Technical Deliverables**
- 8-table PostgreSQL schema with multi-tenancy
- Quarkus backend with LangChain4j integration
- React frontend with Monaco editor
- Full CI/CD pipeline with quality gates

### Phase 2: Academic Module (4-6 weeks)
**11 Additional Use Cases** - Expand to educational institutions

**Academic Features** (UC-012 to UC-015)
- Course creation and student enrollment
- Generate challenges for academic context
- Teacher recommendations for students

**Enhanced Organization** (UC-005)
- Invite members with granular roles (DOCENTE, ALUMNO, RECLUTADOR, etc.)

**Talent Pool Management** (UC-019, UC-020)
- Manage visibility in talent pool
- Accept/reject recommendations

**Collaborative Learning** (UC-021, UC-022)
- Centralized LLM query repository per course
- Vote on shared queries to surface best answers
- Reduce token costs through query deduplication

**Technical Additions**
- 12 additional tables (cursos, perfiles_talento, consultas_llm, etc.)
- RAG implementation with pgvector for context-aware responses
- Advanced analytics dashboard for educators

### Phase 3: Corporate Expansion (8-12 weeks)
- Searchable talent database with advanced filters
- Company-specific workflow simulators
- ATS integrations (Greenhouse, Lever, BambooHR)
- Advanced analytics and reporting
- API for third-party integrations

### Phase 4: Monetization & Scale (12-16 weeks)
- Subscription tiers (Free, Pro, Enterprise)
- Payment processing (Stripe/MercadoPago)
- Digital certificate issuance with blockchain verification
- Premium challenge marketplace
- White-label solutions for enterprises
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'README.md'] Result:
<file_write_result>
<path>README.md</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<notice>Making multiple related changes in a single apply_diff is more efficient. If other changes are needed in this file, please include them as additional SEARCH/REPLACE blocks.</notice>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:09:47.357Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$1.64

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

Perfect! Now let me make one final update to the Documentation section to ensure it references the DATABASE.md file that was mentioned.

<apply_diff>
<path>README.md</path>
<diff>
<<<<<<< SEARCH
## Documentation

- **Product Definition**: [product/PRODUCT.md](product/PRODUCT.md) - Complete product vision, use cases, and metrics
- **Architecture**: [product/ARCHITECTURE.md](product/ARCHITECTURE.md) - Technical architecture and stack decisions
- **Database Schema**: [product/DATABASE.md](product/DATABASE.md) - Complete 20-table schema with all constraints and rules
- **Roadmap**: [product/ROADMAP.md](product/ROADMAP.md) - Development phases and milestones
- **Use Cases**: [docs/uc/](docs/uc/) - Detailed use case specifications
- **ADRs**: [docs/adr/](docs/adr/) - Architecture Decision Records
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- **Changelog**: [CHANGELOG.md](CHANGELOG.md) - Version history
- **Tech Debt**: [TECH_DEBT.md](TECH_DEBT.md) - Known technical debt
=======
## Documentation

### Product & Strategy
- **[product/PRODUCT.md](product/PRODUCT.md)** - Complete product vision with all 22 use cases, user personas, and success metrics
- **[product/ROADMAP.md](product/ROADMAP.md)** - Development phases with Definition of Done for each milestone
- **[product/DATABASE.md](product/DATABASE.md)** - Complete 20-table schema organized in 7 domains with constraints and business rules

### Technical Architecture
- **[product/ARCHITECTURE.md](product/ARCHITECTURE.md)** - Closed technical decisions, stack, folder structure, and patterns
- **[docs/adr/](docs/adr/)** - Architecture Decision Records (ADR-0001: Stack, ADR-0002: RAG, ADR-0003: LLM Evals)
- **[docs/uc/](docs/uc/)** - Detailed use case specifications with acceptance criteria and LLM considerations

### Development & Operations
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Development guidelines for humans and AI agents
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes
- **[TECH_DEBT.md](TECH_DEBT.md)** - Registered technical debt with priority and remediation plans
- **[docs/runbooks/](docs/runbooks/)** - Operational runbooks for incident response
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'README.md'] Result:
<file_write_result>
<path>README.md</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<notice>Making multiple related changes in a single apply_diff is more efficient. If other changes are needed in this file, please include them as additional SEARCH/REPLACE blocks.</notice>
<environment_details>
# VSCode Visible Files
README.md

# VSCode Open Tabs
README.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-01T19:09:59.753Z
User time zone: America/Buenos_Aires, UTC-3:00

# Current Cost
$1.77

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
README.md successfully updated to reflect the comprehensive use case structure from PRODUCT.md:

**Major Updates:**

1. **Use Case Overview** - Expanded from 4 to 22 use cases organized into 6 functional areas:
   - Identity & Onboarding (UC-001 to UC-003)
   - Organization Management (UC-004, UC-005)
   - Corporate Side - Recruiters (UC-006 to UC-011)
   - Academic Side - Educators (UC-012 to UC-015)
   - Candidate/Student Side (UC-016 to UC-020)
   - Collaborative Learning (UC-021, UC-022)

2. **MVP Scope (Phase 1)** - Clarified 11 critical use cases for hackathon:
   - Complete authentication flow with JWT tokens
   - Organization and job position management
   - AI-powered challenge generation via LangChain4j
   - Challenge assignment and solving with Monaco editor
   - Recruiter analytics and rankings

3. **Data Model** - Enhanced with detailed table descriptions:
   - 8 core tables for Phase 1 with specific purposes
   - 12 additional tables planned for Phase 2
   - Multi-tenant architecture and UUID v7 identifiers

4. **API Endpoints** - Expanded from 9 to 20+ endpoints covering:
   - Authentication & identity management
   - Organization management with role-based invitations
   - Job positions and AI challenge generation
   - Challenge invitations and acceptance
   - Evaluation submission and feedback
   - Rankings and detailed reports

5. **Roadmap** - Restructured into 4 clear phases:
   - Phase 1 (MVP): 11 critical use cases for hackathon
   - Phase 2: Academic module with collaborative learning
   - Phase 3: Corporate expansion with ATS integrations
   - Phase 4: Monetization and scale

6. **Documentation Section** - Reorganized into logical categories:
   - Product & Strategy
   - Technical Architecture
   - Development & Operations

The README now accurately reflects the full scope of the platform while maintaining clarity about what's in the MVP vs. future phases.
</result>
</attempt_completion>

