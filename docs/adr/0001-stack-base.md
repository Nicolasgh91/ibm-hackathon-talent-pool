# ADR-0001: stack tecnológico base

## estado
`aceptado`
Fecha: YYYY-MM-DD
Autor: equipo fundador

---

## contexto

Necesitamos definir el stack tecnológico cerrado del proyecto antes de comenzar la fase 0. Las restricciones y objetivos son:

- Aplicación con capacidades LLM como diferenciador (chat, RAG, agentes, según el producto definitivo)
- Equipo con experiencia principal en Java y TypeScript
- Necesidad de iteración rápida y herramientas maduras
- Aplicación con potencial gran cantidad de usuarios finales (escalabilidad horizontal exigida)
- Costo operativo bajo en etapas tempranas, especialmente costo de tokens LLM
- Comunidad y soporte a largo plazo
- Posibilidad futura de desplegar en serverless o edge (arranque rápido, RAM baja)

---

## decisión

El stack del proyecto es:

### backend
- **JDK**: Eclipse Temurin 21 LTS
- **Framework**: Quarkus (versión LTS más reciente)
- **LLM toolkit**: LangChain4j con extensión Quarkus (`quarkus-langchain4j-*`)
- **Build**: Maven 3.9
- **API**: RESTEasy Reactive (JAX-RS)
- **ORM**: Hibernate ORM with Panache
- **Migraciones**: Flyway
- **Validación**: Hibernate Validator
- **Auth**: Quarkus OIDC + SmallRye JWT
- **Build nativo**: GraalVM CE for JDK 21 (opcional en dev, recomendado para prod)

### datos
- **Relacional**: PostgreSQL 16
- **Vector store**: pgvector (extensión de PostgreSQL) — ver ADR-0002
- **Caché**: Redis 7

### frontend
- **Lenguaje**: TypeScript 5
- **Framework**: React 18
- **Build**: Vite 5
- **Gestor**: pnpm 9
- **Cliente HTTP**: openapi-fetch tipado desde la spec OpenAPI generada por Quarkus

### testing
- **Backend**: JUnit 5 + AssertJ + Mockito + REST Assured + Testcontainers + Quarkus Dev Services
- **LLM mocking**: MockChatModel de LangChain4j + WireMock
- **Frontend**: Vitest + Testing Library
- **e2e**: Playwright

### tooling y operación
- **Contenedores**: Docker + docker compose
- **CI/CD**: GitHub Actions
- **Análisis estático**: SonarQube / SonarCloud
- **SAST adicional**: GitHub CodeQL
- **Observabilidad**: Micrometer + OpenTelemetry (extensiones Quarkus oficiales)

El proveedor cloud y el proveedor LLM principal de producción se decidirán en ADRs posteriores cuando haya certeza del perfil de carga y costos.

---

## alternativas consideradas

### alternativa A — Spring Boot + Spring AI
- **pros**: ecosistema enorme, gran adopción empresarial
- **contras**: arranque más lento, mayor consumo de RAM, build nativo menos maduro, Spring AI menos maduro que LangChain4j al momento
- **descartada**: para una aplicación con capacidades LLM y potencial de escalado a serverless, los tiempos de arranque y la huella de memoria de Spring son una desventaja real. Quarkus fue diseñado precisamente para ese perfil.

### alternativa B — Python + FastAPI + LangChain
- **pros**: ecosistema LLM más maduro, prototipado más rápido, mucho contenido educativo
- **contras**: peor performance en CPU-bound, tipado más débil, deployment más complejo en serverless, sin compilación nativa
- **descartada**: el equipo tiene experiencia Java, y para producción a escala con SLOs estrictos preferimos un stack tipado y compilado. La madurez de LangChain4j ya es suficiente para los casos planificados.

### alternativa C — Node.js + NestJS + LangChain.js
- **pros**: un solo lenguaje en frontend y backend, ecosistema grande
- **contras**: tipado menos estricto, performance JIT inferior a Java compilado, ecosistema LLM menos rico que Python
- **descartada**: no aporta diferencial sobre Quarkus en performance, y perdemos el tipado fuerte y la robustez del ecosistema Java empresarial.

### alternativa D — Quarkus + Spring AI (sin LangChain4j)
- **pros**: Spring AI es razonablemente bueno
- **contras**: Quarkus está pensado para integrarse con LangChain4j, no con Spring AI; perdés la integración nativa CDI
- **descartada**: combinación incoherente, mejor mantener consistencia.

---

## consecuencias

### positivas
- Arranque rápido (~ 1-2 segundos en JVM, sub-segundo en nativo) ideal para escalado horizontal y serverless
- Huella de memoria baja: importante en costos cloud y en despliegues en edge
- Tipado fuerte de Java + de TypeScript reduce errores en runtime y mejora colaboración con agentes de código
- LangChain4j integrado como CDI bean: AiServices con interfaces tipadas, tools tipadas, retrievers tipados
- Quarkus Dev Services automatiza el setup local: el agente puede correr tests sin configuración manual de infraestructura
- OpenAPI generado automáticamente por SmallRye OpenAPI, consumible directamente por el frontend

### negativas
- Build nativo con GraalVM puede ser lento (5-10 min) y requiere atención a reflexión y serialización
- Java + TypeScript son dos stacks distintos: tooling duplicado en CI
- Curva de aprendizaje de Mutiny (programación reactiva con `Uni`/`Multi`) si se usa intensivamente
- LangChain4j sigue evolucionando rápido: versionar cuidadosamente y testear bien antes de cada upgrade

### neutras
- pnpm es menos común que npm; requiere configuración explícita en CI

---

## implicancias para el código

- Estructura de carpetas según `ARCHITECTURE.md` §3
- `pom.xml` con Quarkus BOM y LangChain4j BOM importadas para garantizar compatibilidad de versiones
- `package.json` con `engines` declarando Node y pnpm
- Configuración de Docker compose para BD local con pgvector, Redis, backend en `quarkus:dev` y frontend en `pnpm dev`
- Plugin `quarkus-maven-plugin` configurado tanto para JVM como para nativo (perfil Maven `native`)

---

## referencias

- `ARCHITECTURE.md` §2
- [Documentación oficial Quarkus + LangChain4j](https://docs.quarkiverse.io/quarkus-langchain4j/dev/)
- ADR-0002: estrategia de RAG y vector store
- ADR-0003: estrategia de evaluación de LLMs
