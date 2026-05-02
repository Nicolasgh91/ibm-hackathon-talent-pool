# DER — Diagrama entidad-relación (Talent Pool)

Documento de diagramación del modelo lógico. La **fuente de verdad** para columnas, constraints, índices y políticas `ON DELETE` es [product/DATABASE.md](../product/DATABASE.md).

**Motor objetivo:** PostgreSQL 16 con extensiones `pgcrypto`, `citext` y `pgvector` (según DATABASE.md).

---

## Dominios y tablas

| Dominio | Tablas |
|---------|--------|
| Identidad | `usuarios`, `organizaciones`, `membresias` |
| Académico | `cursos`, `inscripciones` |
| Corporativo | `puestos` |
| Núcleo | `desafios`, `asignaciones_desafio`, `invitaciones_desafio`, `evaluaciones`, `evaluaciones_versiones`, `dimensiones_puntaje` |
| Puente | `recomendaciones` |
| Pool | `perfiles_talento`, `habilidades_perfil` |
| Colaboración | `consultas_llm`, `votos_consulta` |
| Trazabilidad | `prompt_versiones`, `llamadas_llm`, `eventos_auditoria` |

---

## Vista integrada (solo relaciones)

Entidades en **MAYÚSCULAS**; cardinalidades en sintaxis Mermaid `erDiagram`. No se listan atributos para evitar duplicar el SSOT.

```mermaid
erDiagram
    USUARIOS ||--o{ MEMBRESIAS : "usuario_id"
    ORGANIZACIONES ||--o{ MEMBRESIAS : "organizacion_id"
    ORGANIZACIONES ||--o{ CURSOS : "organizacion_id"
    USUARIOS ||--o{ CURSOS : "docente_principal_id"
    CURSOS ||--o{ INSCRIPCIONES : "curso_id"
    USUARIOS ||--o{ INSCRIPCIONES : "usuario_id"
    ORGANIZACIONES ||--o{ PUESTOS : "organizacion_id"
    USUARIOS ||--o{ PUESTOS : "reclutador_id"
    USUARIOS ||--o{ DESAFIOS : "creador_usuario_id"
    ORGANIZACIONES |o--o{ DESAFIOS : "organizacion_id_nullable"
    PROMPT_VERSIONES ||--o{ DESAFIOS : "prompt_version_id"
    DESAFIOS ||--o{ ASIGNACIONES_DESAFIO : "desafio_id"
    PUESTOS |o--o{ ASIGNACIONES_DESAFIO : "puesto_id_nullable"
    CURSOS |o--o{ ASIGNACIONES_DESAFIO : "curso_id_nullable"
    ASIGNACIONES_DESAFIO ||--o{ INVITACIONES_DESAFIO : "asignacion_id"
    USUARIOS ||--o{ INVITACIONES_DESAFIO : "emisor_usuario_id"
    USUARIOS |o--o{ INVITACIONES_DESAFIO : "usuario_invitado_id_nullable"
    DESAFIOS ||--o{ EVALUACIONES : "desafio_id"
    USUARIOS ||--o{ EVALUACIONES : "candidato_id"
    ASIGNACIONES_DESAFIO |o--o{ EVALUACIONES : "asignacion_id_nullable"
    EVALUACIONES ||--o{ EVALUACIONES_VERSIONES : "evaluacion_id"
    EVALUACIONES ||--o{ DIMENSIONES_PUNTAJE : "evaluacion_id"
    USUARIOS ||--o{ RECOMENDACIONES : "emisor_usuario_id"
    USUARIOS ||--o{ RECOMENDACIONES : "receptor_usuario_id"
    CURSOS |o--o{ RECOMENDACIONES : "curso_id_nullable"
    USUARIOS ||--|| PERFILES_TALENTO : "usuario_id_unico"
    PERFILES_TALENTO ||--o{ HABILIDADES_PERFIL : "perfil_talento_id"
    EVALUACIONES |o--o{ HABILIDADES_PERFIL : "evaluacion_id_nullable"
    CURSOS |o--o{ CONSULTAS_LLM : "curso_id_nullable"
    USUARIOS ||--o{ CONSULTAS_LLM : "usuario_id"
    PROMPT_VERSIONES |o--o{ CONSULTAS_LLM : "prompt_version_id_nullable"
    CONSULTAS_LLM ||--o{ VOTOS_CONSULTA : "consulta_llm_id"
    USUARIOS ||--o{ VOTOS_CONSULTA : "usuario_id"
    PROMPT_VERSIONES ||--o{ LLAMADAS_LLM : "prompt_version_id"
    EVALUACIONES |o--o{ LLAMADAS_LLM : "evaluacion_id_nullable"
    DESAFIOS |o--o{ LLAMADAS_LLM : "desafio_id_nullable"
    CONSULTAS_LLM |o--o{ LLAMADAS_LLM : "consulta_llm_id_nullable"
    USUARIOS |o--o{ EVENTOS_AUDITORIA : "actor_usuario_id_nullable"
```

---

## Vistas por dominio

Las siguientes figuras son **vistas parciales** del mismo esquema (entidades compartidas pueden repetirse entre diagramas).

### Identidad y multi-tenancy

```mermaid
erDiagram
    USUARIOS {
        UUID id PK
        CITEXT email UK
        VARCHAR nombre_completo
        BOOLEAN email_verificado
        TIMESTAMPTZ created_at
    }
    ORGANIZACIONES {
        UUID id PK
        VARCHAR nombre
        VARCHAR tipo
        VARCHAR plan
        TIMESTAMPTZ created_at
    }
    MEMBRESIAS {
        UUID id PK
        UUID usuario_id FK
        UUID organizacion_id FK
        VARCHAR rol
        VARCHAR estado
        TIMESTAMPTZ inicio
    }
    USUARIOS ||--o{ MEMBRESIAS : "tiene"
    ORGANIZACIONES ||--o{ MEMBRESIAS : "agrupa"
```

### Académico

```mermaid
erDiagram
    ORGANIZACIONES {
        UUID id PK
        VARCHAR nombre
        VARCHAR tipo
    }
    USUARIOS {
        UUID id PK
        CITEXT email UK
        VARCHAR nombre_completo
    }
    CURSOS {
        UUID id PK
        UUID organizacion_id FK
        UUID docente_principal_id FK
        VARCHAR nombre
        VARCHAR estado
        TIMESTAMPTZ created_at
    }
    INSCRIPCIONES {
        UUID id PK
        UUID curso_id FK
        UUID usuario_id FK
        VARCHAR rol_curso
        VARCHAR estado
    }
    ORGANIZACIONES ||--o{ CURSOS : "ofrece"
    USUARIOS ||--o{ CURSOS : "docente_principal"
    CURSOS ||--o{ INSCRIPCIONES : "inscribe"
    USUARIOS ||--o{ INSCRIPCIONES : "participa"
```

### Corporativo

```mermaid
erDiagram
    ORGANIZACIONES {
        UUID id PK
        VARCHAR nombre
        VARCHAR tipo
    }
    USUARIOS {
        UUID id PK
        CITEXT email UK
        VARCHAR nombre_completo
    }
    PUESTOS {
        UUID id PK
        UUID organizacion_id FK
        UUID reclutador_id FK
        VARCHAR titulo
        VARCHAR estado
        VARCHAR seniority
        TIMESTAMPTZ created_at
    }
    ORGANIZACIONES ||--o{ PUESTOS : "publica"
    USUARIOS ||--o{ PUESTOS : "reclutador"
```

### Núcleo — desafíos, asignaciones e invitaciones

```mermaid
erDiagram
    PROMPT_VERSIONES {
        UUID id PK
        VARCHAR nombre
        VARCHAR version_semver
        VARCHAR estado
        TIMESTAMPTZ created_at
    }
    USUARIOS {
        UUID id PK
        CITEXT email UK
    }
    ORGANIZACIONES {
        UUID id PK
        VARCHAR nombre
    }
    DESAFIOS {
        UUID id PK
        UUID creador_usuario_id FK
        UUID organizacion_id FK
        UUID prompt_version_id FK
        VARCHAR titulo
        VARCHAR estado
        BOOLEAN es_publico
    }
    PUESTOS {
        UUID id PK
        UUID organizacion_id FK
        VARCHAR titulo
    }
    CURSOS {
        UUID id PK
        UUID organizacion_id FK
        VARCHAR nombre
    }
    ASIGNACIONES_DESAFIO {
        UUID id PK
        UUID desafio_id FK
        UUID puesto_id FK
        UUID curso_id FK
        VARCHAR tipo
        INTEGER max_intentos
    }
    INVITACIONES_DESAFIO {
        UUID id PK
        UUID asignacion_id FK
        UUID emisor_usuario_id FK
        UUID usuario_invitado_id FK
        VARCHAR token UK
        VARCHAR estado
    }
    PROMPT_VERSIONES ||--o{ DESAFIOS : "version_prompt"
    USUARIOS ||--o{ DESAFIOS : "creador"
    ORGANIZACIONES |o--o{ DESAFIOS : "org_opcional"
    DESAFIOS ||--o{ ASIGNACIONES_DESAFIO : "contexto"
    PUESTOS |o--o{ ASIGNACIONES_DESAFIO : "si_tipo_puesto"
    CURSOS |o--o{ ASIGNACIONES_DESAFIO : "si_tipo_curso"
    ASIGNACIONES_DESAFIO ||--o{ INVITACIONES_DESAFIO : "invita"
    USUARIOS ||--o{ INVITACIONES_DESAFIO : "emisor"
    USUARIOS |o--o{ INVITACIONES_DESAFIO : "invitado_resuelto"
```

### Núcleo — evaluaciones y puntajes

```mermaid
erDiagram
    DESAFIOS {
        UUID id PK
        VARCHAR titulo
        VARCHAR estado
    }
    ASIGNACIONES_DESAFIO {
        UUID id PK
        UUID desafio_id FK
        VARCHAR tipo
    }
    USUARIOS {
        UUID id PK
        CITEXT email UK
    }
    EVALUACIONES {
        UUID id PK
        UUID desafio_id FK
        UUID candidato_id FK
        UUID asignacion_id FK
        DECIMAL puntaje_total
        VARCHAR estado
        TIMESTAMPTZ entrega
    }
    EVALUACIONES_VERSIONES {
        UUID id PK
        UUID evaluacion_id FK
        INTEGER numero_version
        VARCHAR tipo_evento
    }
    DIMENSIONES_PUNTAJE {
        UUID id PK
        UUID evaluacion_id FK
        VARCHAR nombre
        DECIMAL puntaje
        DECIMAL peso
    }
    DESAFIOS ||--o{ EVALUACIONES : "plantilla"
    USUARIOS ||--o{ EVALUACIONES : "candidato"
    ASIGNACIONES_DESAFIO |o--o{ EVALUACIONES : "marco_opcional"
    EVALUACIONES ||--o{ EVALUACIONES_VERSIONES : "historial"
    EVALUACIONES ||--o{ DIMENSIONES_PUNTAJE : "desglose"
```

### Puente educativo-corporativo

```mermaid
erDiagram
    USUARIOS {
        UUID id PK
        CITEXT email UK
    }
    CURSOS {
        UUID id PK
        VARCHAR nombre
    }
    RECOMENDACIONES {
        UUID id PK
        UUID emisor_usuario_id FK
        UUID receptor_usuario_id FK
        UUID curso_id FK
        INTEGER puntaje_estrellas
        BOOLEAN visible_para_pool
        VARCHAR estado
    }
    USUARIOS ||--o{ RECOMENDACIONES : "docente_emisor"
    USUARIOS ||--o{ RECOMENDACIONES : "alumno_receptor"
    CURSOS |o--o{ RECOMENDACIONES : "contexto_opcional"
```

### Pool de talento

```mermaid
erDiagram
    USUARIOS {
        UUID id PK
        CITEXT email UK
    }
    EVALUACIONES {
        UUID id PK
        DECIMAL puntaje_total
        VARCHAR estado
    }
    PERFILES_TALENTO {
        UUID id PK
        UUID usuario_id FK
        VARCHAR disponibilidad
        BOOLEAN visible_reclutadores
        VARCHAR titular
    }
    HABILIDADES_PERFIL {
        UUID id PK
        UUID perfil_talento_id FK
        UUID evaluacion_id FK
        VARCHAR nombre
        BOOLEAN validada_por_evaluacion
    }
    USUARIOS ||--|| PERFILES_TALENTO : "uno_a_uno"
    PERFILES_TALENTO ||--o{ HABILIDADES_PERFIL : "declara"
    EVALUACIONES |o--o{ HABILIDADES_PERFIL : "valida_opcional"
```

### Colaboración (consultas LLM)

```mermaid
erDiagram
    CURSOS {
        UUID id PK
        VARCHAR nombre
    }
    USUARIOS {
        UUID id PK
        CITEXT email UK
    }
    PROMPT_VERSIONES {
        UUID id PK
        VARCHAR nombre
        VARCHAR version_semver
    }
    CONSULTAS_LLM {
        UUID id PK
        UUID curso_id FK
        UUID usuario_id FK
        UUID prompt_version_id FK
        TEXT pregunta
        BOOLEAN visible_clase
    }
    VOTOS_CONSULTA {
        UUID id PK
        UUID consulta_llm_id FK
        UUID usuario_id FK
        VARCHAR tipo
    }
    CURSOS |o--o{ CONSULTAS_LLM : "repo_curso_opcional"
    USUARIOS ||--o{ CONSULTAS_LLM : "autor"
    PROMPT_VERSIONES |o--o{ CONSULTAS_LLM : "prompt_opcional"
    CONSULTAS_LLM ||--o{ VOTOS_CONSULTA : "recibe"
    USUARIOS ||--o{ VOTOS_CONSULTA : "emite"
```

### Trazabilidad y auditoría

```mermaid
erDiagram
    PROMPT_VERSIONES {
        UUID id PK
        VARCHAR nombre
        VARCHAR estado
    }
    EVALUACIONES {
        UUID id PK
        VARCHAR estado
    }
    DESAFIOS {
        UUID id PK
        VARCHAR titulo
    }
    CONSULTAS_LLM {
        UUID id PK
        TEXT pregunta
    }
    USUARIOS {
        UUID id PK
        CITEXT email UK
    }
    LLAMADAS_LLM {
        UUID id PK
        UUID prompt_version_id FK
        UUID evaluacion_id FK
        UUID desafio_id FK
        UUID consulta_llm_id FK
        VARCHAR proveedor
        DECIMAL costo_usd
    }
    EVENTOS_AUDITORIA {
        UUID id PK
        UUID actor_usuario_id FK
        VARCHAR accion
        VARCHAR entidad_tipo
        UUID entidad_id
        TIMESTAMPTZ created_at
    }
    PROMPT_VERSIONES ||--o{ LLAMADAS_LLM : "version_prompt"
    EVALUACIONES |o--o{ LLAMADAS_LLM : "origen_opcional"
    DESAFIOS |o--o{ LLAMADAS_LLM : "origen_opcional"
    CONSULTAS_LLM |o--o{ LLAMADAS_LLM : "origen_opcional"
    USUARIOS |o--o{ EVENTOS_AUDITORIA : "actor_opcional"
```

---

## Notas de modelado

- **Multi-tenancy:** la mayoría de los datos de negocio se acotan por `organizacion_id` en tablas como `cursos`, `puestos`, `desafios` (cuando aplica) y vía `membresias` para roles.
- **FK opcionales:** `desafios.organizacion_id`, `asignaciones_desafio.puesto_id` / `curso_id`, `evaluaciones.asignacion_id`, `recomendaciones.curso_id`, `consultas_llm.curso_id` y `prompt_version_id`, `habilidades_perfil.evaluacion_id`, `invitaciones_desafio.usuario_invitado_id`, `eventos_auditoria.actor_usuario_id` pueden ser NULL según reglas en [DATABASE.md](../product/DATABASE.md).
- **`perfiles_talento.usuario_id`:** relación 1:1 con `usuarios` (restricción `UNIQUE` en la FK).
- **`llamadas_llm`:** las FKs `evaluacion_id`, `desafio_id` y `consulta_llm_id` son mutuamente opcionales; en aplicación debe cumplirse **exactamente un origen** por fila ([DATABASE.md](../product/DATABASE.md) §3.8).
- **Invitaciones y evaluaciones:** el acceso nominal usa `invitaciones_desafio.token`; no hay FK directa desde `evaluaciones` hacia `invitaciones_desafio` en el esquema documentado.
