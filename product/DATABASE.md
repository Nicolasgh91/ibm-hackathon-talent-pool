# DATABASE.md — schema de base de datos de Talent Pool

> Documento de referencia del modelo de datos. Acompaña al ER diagram y es la fuente de verdad para todas las decisiones de esquema.
> Versión: 1.0
> Última revisión: YYYY-MM-DD
> Motor: PostgreSQL 16 con extensiones `pgcrypto`, `citext` y `pgvector`.

---

## 1. principios de diseño

### 1.1 reglas que aplican a TODA tabla
- **Identificadores**: UUID v7 generados por aplicación (ordenables por tiempo) o `gen_random_uuid()` desde Postgres como fallback. Nunca BIGSERIAL.
- **Timestamps**: toda tabla tiene `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`. Las tablas con cambios frecuentes agregan `updated_at` manejado por trigger.
- **Soft delete**: solo donde está justificado funcionalmente (ej: `MEMBRESIA.estado = REVOCADA`). Para el resto, hard delete.
- **Snake case**: tablas en plural inglés-neutro evitado, mantenemos español por consistencia con el dominio del producto. Columnas en `snake_case`.
- **Charset**: UTF-8.
- **Timezone**: todos los timestamps en UTC (`TIMESTAMPTZ`).

### 1.2 reglas de integridad
- **Claves foráneas con `ON DELETE` explícito**. La política se decide por relación (ver tabla por tabla).
- **Constraints CHECK** en todos los campos tipo `string` que en realidad son enums hasta migrar a tipos ENUM nativos.
- **Índices**: definidos explícitamente en migraciones. Nunca confiar en los implícitos de Postgres más allá de los de PK.
- **Unicidad compuesta**: usar `UNIQUE` constraints donde aplique (ej: un usuario no puede tener dos membresías activas en la misma organización con el mismo rol).

### 1.3 multi-tenancy
- **Tenancy lógica** vía `organizacion_id` en tablas relevantes.
- **No** hay schemas separados por tenant ni databases separadas. Una sola BD multi-tenant.
- **Row-Level Security (RLS)** opcional para v2; en v1 se controla por capa de aplicación con WHERE explícitos.
- **Datos del usuario** (perfil, evaluaciones propias) son del usuario, NO de la organización.

### 1.4 trazabilidad de LLM
- Toda salida generada por LLM que se persiste (desafíos, evaluaciones) referencia su `prompt_version_id`.
- Todo lo que se persiste y costó tokens registra una fila en `LLAMADA_LLM`.

---

## 2. resumen de las 18 tablas

| # | tabla | propósito | dominio |
|---|-------|----------|---------|
| 1 | `usuarios` | personas físicas | identidad |
| 2 | `organizaciones` | empresas o instituciones | tenancy |
| 3 | `membresias` | unión usuario-organización con rol | identidad |
| 4 | `cursos` | unidades académicas | académico |
| 5 | `inscripciones` | alumnos/auxiliares en un curso | académico |
| 6 | `puestos` | vacantes corporativas | corporativo |
| 7 | `desafios` | problemas técnicos generados por IA | núcleo |
| 8 | `asignaciones_desafio` | uso de un desafío en un contexto | núcleo |
| 9 | `invitaciones_desafio` | invitación nominal con token | núcleo |
| 10 | `evaluaciones` | entrega de un candidato | núcleo |
| 11 | `evaluaciones_versiones` | snapshots y autosave | núcleo |
| 12 | `dimensiones_puntaje` | desglose multi-dimensional | núcleo |
| 13 | `recomendaciones` | feedback de docentes a alumnos | puente |
| 14 | `perfiles_talento` | perfil público para reclutadores | pool |
| 15 | `habilidades_perfil` | skills declaradas y validadas | pool |
| 16 | `consultas_llm` | repositorio colectivo de Q&A | colaboración |
| 17 | `votos_consulta` | votación de utilidad | colaboración |
| 18 | `prompt_versiones` | versionado de prompts | trazabilidad |
| 19 | `llamadas_llm` | auditoría de costo y reproducibilidad | trazabilidad |
| 20 | `eventos_auditoria` | log inmutable de acciones críticas | trazabilidad |

---

## 3. modelos por dominio

### 3.1 dominio: identidad y multi-tenancy

#### tabla `usuarios`
Persona física. Una sola fila por persona, sin importar cuántos roles tenga en cuántas organizaciones.

```sql
CREATE TABLE usuarios (
  id              UUID PRIMARY KEY,
  email           CITEXT NOT NULL UNIQUE,
  nombre_completo VARCHAR(200) NOT NULL,
  password_hash   TEXT NOT NULL,
  foto_url        TEXT,
  email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email_verificado ON usuarios(email_verificado);
```

**Notas**:
- `CITEXT` para email permite case-insensitive sin LOWER() en queries.
- `password_hash` usa argon2id (parámetros en `ARCHITECTURE.md`).
- Si el usuario se registra vía OIDC externo, `password_hash` puede ser NULL y la verificación se delega al IdP. Usar columna adicional `auth_provider` si se va a soportar OIDC.

---

#### tabla `organizaciones`
Empresa o institución educativa. Discriminadas por `tipo`.

```sql
CREATE TABLE organizaciones (
  id              UUID PRIMARY KEY,
  nombre          VARCHAR(200) NOT NULL,
  tipo            VARCHAR(20) NOT NULL,
  plan            VARCHAR(20) NOT NULL DEFAULT 'FREE',
  dominio_email   VARCHAR(255),
  logo_url        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_org_tipo CHECK (tipo IN ('EMPRESA', 'INSTITUCION')),
  CONSTRAINT chk_org_plan CHECK (plan IN ('FREE', 'PRO', 'ENTERPRISE'))
);

CREATE UNIQUE INDEX idx_organizaciones_dominio
  ON organizaciones(dominio_email)
  WHERE dominio_email IS NOT NULL;
```

**Notas**:
- `dominio_email` permite auto-sugerir membresía cuando alguien se registra con email cuyo dominio matchea (`juan@miempresa.com` → sugerir membresía a "miempresa").
- Una organización puede ofrecer cursos Y publicar puestos (ej: una empresa con academy interna). El `tipo` indica el caso primario, no es excluyente.

---

#### tabla `membresias`
Unión usuario-organización con un rol específico. Reemplaza al campo `tipo_usuario` rígido del DER original.

```sql
CREATE TABLE membresias (
  id              UUID PRIMARY KEY,
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  organizacion_id UUID NOT NULL REFERENCES organizaciones(id) ON DELETE CASCADE,
  rol             VARCHAR(30) NOT NULL,
  estado          VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  inicio          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fin             TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_mem_rol CHECK (rol IN ('OWNER', 'RECLUTADOR', 'DOCENTE', 'ALUMNO', 'EMPLEADO', 'ADMIN')),
  CONSTRAINT chk_mem_estado CHECK (estado IN ('ACTIVA', 'SUSPENDIDA', 'REVOCADA')),
  CONSTRAINT chk_mem_fechas CHECK (fin IS NULL OR fin >= inicio)
);

-- Un usuario no puede tener dos membresías activas con el mismo rol en la misma organización.
CREATE UNIQUE INDEX idx_membresias_unicas_activas
  ON membresias(usuario_id, organizacion_id, rol)
  WHERE estado = 'ACTIVA';

CREATE INDEX idx_membresias_usuario ON membresias(usuario_id);
CREATE INDEX idx_membresias_organizacion ON membresias(organizacion_id);
```

**Notas críticas**:
- Un usuario PUEDE ser DOCENTE en la org A y ALUMNO en la org B simultáneamente.
- Un usuario PUEDE tener históricamente N membresías en la misma org (renunció, volvió). Solo una activa por (usuario, org, rol).
- `OWNER` es el creador de la organización; `ADMIN` es delegado. `RECLUTADOR` aplica a empresas; `DOCENTE` a instituciones; `ALUMNO` a instituciones; `EMPLEADO` es genérico (un empleado de empresa que puede generar prácticas internas).

**Reglas de negocio**:
- No se permite `REVOCADA → ACTIVA` (es un cambio permanente). Si vuelve, es nueva membresía.
- `SUSPENDIDA` es temporal y reversible.

---

### 3.2 dominio: académico

#### tabla `cursos`
Curso o materia ofrecida por una institución (o academy corporativa).

```sql
CREATE TABLE cursos (
  id                    UUID PRIMARY KEY,
  organizacion_id       UUID NOT NULL REFERENCES organizaciones(id) ON DELETE RESTRICT,
  docente_principal_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  nombre                VARCHAR(200) NOT NULL,
  codigo                VARCHAR(50),
  anio_lectivo          VARCHAR(10),
  periodo               VARCHAR(50),
  descripcion           TEXT,
  estado                VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_curso_estado CHECK (estado IN ('BORRADOR', 'ACTIVO', 'FINALIZADO', 'ARCHIVADO'))
);

CREATE INDEX idx_cursos_organizacion ON cursos(organizacion_id);
CREATE INDEX idx_cursos_docente ON cursos(docente_principal_id);
CREATE UNIQUE INDEX idx_cursos_codigo_org
  ON cursos(organizacion_id, codigo, anio_lectivo, periodo)
  WHERE codigo IS NOT NULL;
```

**Notas**:
- `docente_principal_id` debe tener una membresía activa con rol `DOCENTE` en la `organizacion_id` del curso. Validar en capa de aplicación (o con trigger en v2).
- `ON DELETE RESTRICT` en organización y docente: no se borra una organización con cursos activos.

---

#### tabla `inscripciones`
Vincula usuarios a cursos. Soporta alumnos y auxiliares docentes.

```sql
CREATE TABLE inscripciones (
  id          UUID PRIMARY KEY,
  curso_id    UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  rol_curso   VARCHAR(20) NOT NULL DEFAULT 'ALUMNO',
  estado      VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_insc_rol CHECK (rol_curso IN ('ALUMNO', 'AUXILIAR', 'OYENTE')),
  CONSTRAINT chk_insc_estado CHECK (estado IN ('ACTIVA', 'BAJA', 'FINALIZADA'))
);

CREATE UNIQUE INDEX idx_inscripciones_unicas
  ON inscripciones(curso_id, usuario_id)
  WHERE estado IN ('ACTIVA', 'FINALIZADA');

CREATE INDEX idx_inscripciones_usuario ON inscripciones(usuario_id);
CREATE INDEX idx_inscripciones_curso ON inscripciones(curso_id);
```

**Reglas**:
- Un usuario inscripto debe tener membresía `ALUMNO` en la organización del curso.
- Un mismo usuario puede tener histórico de bajas + reinscripciones.

---

### 3.3 dominio: corporativo

#### tabla `puestos`
Vacante laboral. Pertenece a una empresa.

```sql
CREATE TABLE puestos (
  id                    UUID PRIMARY KEY,
  organizacion_id       UUID NOT NULL REFERENCES organizaciones(id) ON DELETE RESTRICT,
  reclutador_id         UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  titulo                VARCHAR(200) NOT NULL,
  tecnologia_principal  VARCHAR(100) NOT NULL,
  seniority             VARCHAR(20) NOT NULL,
  descripcion           TEXT,
  estado                VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_puesto_seniority CHECK (seniority IN ('TRAINEE', 'JR', 'SSR', 'SR', 'LEAD')),
  CONSTRAINT chk_puesto_estado CHECK (estado IN ('BORRADOR', 'ABIERTO', 'PAUSADO', 'CERRADO'))
);

CREATE INDEX idx_puestos_organizacion ON puestos(organizacion_id);
CREATE INDEX idx_puestos_reclutador ON puestos(reclutador_id);
CREATE INDEX idx_puestos_estado ON puestos(estado) WHERE estado = 'ABIERTO';
```

**Reglas**:
- `reclutador_id` debe tener membresía `RECLUTADOR` activa en la `organizacion_id`.
- Un puesto en estado `BORRADOR` no recibe candidatos. `ABIERTO` sí. `PAUSADO` y `CERRADO` no aceptan nuevas evaluaciones pero conservan las históricas.

---

### 3.4 dominio: núcleo (desafíos y evaluaciones)

#### tabla `desafios`
El problema técnico generado por LLM. Independiente del contexto de uso.

```sql
CREATE TABLE desafios (
  id                  UUID PRIMARY KEY,
  creador_usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  organizacion_id     UUID REFERENCES organizaciones(id) ON DELETE RESTRICT,
  prompt_version_id   UUID NOT NULL REFERENCES prompt_versiones(id) ON DELETE RESTRICT,
  titulo              VARCHAR(200) NOT NULL,
  enunciado           TEXT NOT NULL,
  rubrica_oculta      JSONB NOT NULL,
  contexto_origen     VARCHAR(20) NOT NULL,
  tecnologia          VARCHAR(100) NOT NULL,
  seniority           VARCHAR(20) NOT NULL,
  minutos_estimados   INTEGER NOT NULL DEFAULT 60,
  es_publico          BOOLEAN NOT NULL DEFAULT FALSE,
  estado              VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_desafio_contexto CHECK (contexto_origen IN ('CORPORATIVO', 'ACADEMICO', 'BIBLIOTECA')),
  CONSTRAINT chk_desafio_seniority CHECK (seniority IN ('TRAINEE', 'JR', 'SSR', 'SR', 'LEAD')),
  CONSTRAINT chk_desafio_estado CHECK (estado IN ('BORRADOR', 'REVISION', 'ACTIVO', 'ARCHIVADO')),
  CONSTRAINT chk_desafio_minutos CHECK (minutos_estimados > 0 AND minutos_estimados <= 480)
);

CREATE INDEX idx_desafios_creador ON desafios(creador_usuario_id);
CREATE INDEX idx_desafios_organizacion ON desafios(organizacion_id);
CREATE INDEX idx_desafios_publicos ON desafios(es_publico, estado) WHERE es_publico = TRUE AND estado = 'ACTIVO';
CREATE INDEX idx_desafios_tecnologia ON desafios(tecnologia, seniority);
CREATE INDEX idx_desafios_rubrica_gin ON desafios USING GIN (rubrica_oculta);
```

**Notas críticas**:
- `rubrica_oculta` JSONB: nunca se devuelve al candidato. Solo el sistema y el reclutador/docente la ven.
- `organizacion_id` es nullable: un desafío de biblioteca pública no pertenece a ninguna org.
- `es_publico = TRUE` permite que el desafío aparezca en biblioteca para reutilización por terceros.
- `prompt_version_id` registra qué versión del prompt generador se usó. Cambios de prompt → nuevos desafíos con nueva versión, los históricos quedan ligados a su versión original (reproducibilidad).

**Estructura sugerida de `rubrica_oculta`**:
```json
{
  "version_rubrica": "1.0",
  "dimensiones": [
    {
      "nombre": "LOGICA",
      "peso": 0.4,
      "criterios": ["resuelve el caso base", "maneja edge cases", "..."]
    },
    {
      "nombre": "EFICIENCIA",
      "peso": 0.3,
      "criterios": ["complejidad temporal apropiada", "..."]
    },
    {
      "nombre": "ESTILO",
      "peso": 0.2,
      "criterios": ["nombres descriptivos", "..."]
    },
    {
      "nombre": "PRACTICAS",
      "peso": 0.1,
      "criterios": ["manejo de errores", "tests"]
    }
  ],
  "puntaje_maximo": 100
}
```

---

#### tabla `asignaciones_desafio`
Tabla puente entre un desafío y un contexto de uso (puesto, curso o público abierto). Permite reutilización del mismo desafío en múltiples contextos.

```sql
CREATE TABLE asignaciones_desafio (
  id              UUID PRIMARY KEY,
  desafio_id      UUID NOT NULL REFERENCES desafios(id) ON DELETE RESTRICT,
  puesto_id       UUID REFERENCES puestos(id) ON DELETE CASCADE,
  curso_id        UUID REFERENCES cursos(id) ON DELETE CASCADE,
  tipo            VARCHAR(20) NOT NULL,
  fecha_apertura  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_cierre    TIMESTAMPTZ,
  max_intentos    INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_asig_tipo CHECK (tipo IN ('PUESTO', 'CURSO', 'PUBLICO')),
  CONSTRAINT chk_asig_target CHECK (
    (tipo = 'PUESTO' AND puesto_id IS NOT NULL AND curso_id IS NULL) OR
    (tipo = 'CURSO' AND curso_id IS NOT NULL AND puesto_id IS NULL) OR
    (tipo = 'PUBLICO' AND puesto_id IS NULL AND curso_id IS NULL)
  ),
  CONSTRAINT chk_asig_fechas CHECK (fecha_cierre IS NULL OR fecha_cierre > fecha_apertura),
  CONSTRAINT chk_asig_intentos CHECK (max_intentos > 0 AND max_intentos <= 10)
);

CREATE INDEX idx_asignaciones_desafio ON asignaciones_desafio(desafio_id);
CREATE INDEX idx_asignaciones_puesto ON asignaciones_desafio(puesto_id) WHERE puesto_id IS NOT NULL;
CREATE INDEX idx_asignaciones_curso ON asignaciones_desafio(curso_id) WHERE curso_id IS NOT NULL;
CREATE INDEX idx_asignaciones_ventana ON asignaciones_desafio(fecha_apertura, fecha_cierre);
```

**Patrón clave**: el constraint `chk_asig_target` garantiza que cada asignación apunta a UN solo contexto, alineado con el `tipo`. Esto evita estados inválidos (asignación de tipo PUESTO sin puesto_id, o con puesto_id Y curso_id).

---

#### tabla `invitaciones_desafio`
Invitación nominal a un email para resolver un desafío específico. Genera un token único para acceso por link.

```sql
CREATE TABLE invitaciones_desafio (
  id                    UUID PRIMARY KEY,
  asignacion_id         UUID NOT NULL REFERENCES asignaciones_desafio(id) ON DELETE CASCADE,
  emisor_usuario_id     UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  email_invitado        CITEXT NOT NULL,
  usuario_invitado_id   UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  token                 VARCHAR(64) NOT NULL UNIQUE,
  estado                VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  expira_en             TIMESTAMPTZ NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_inv_estado CHECK (estado IN ('PENDIENTE', 'ACEPTADA', 'EXPIRADA', 'REVOCADA')),
  CONSTRAINT chk_inv_expira CHECK (expira_en > created_at)
);

CREATE INDEX idx_invitaciones_asignacion ON invitaciones_desafio(asignacion_id);
CREATE INDEX idx_invitaciones_email ON invitaciones_desafio(email_invitado);
CREATE INDEX idx_invitaciones_usuario ON invitaciones_desafio(usuario_invitado_id) WHERE usuario_invitado_id IS NOT NULL;
CREATE INDEX idx_invitaciones_pendientes ON invitaciones_desafio(estado, expira_en) WHERE estado = 'PENDIENTE';
```

**Flujo**:
1. Reclutador crea asignación + invitación → email enviado con link `/eval?token=xxx`.
2. Si el invitado tiene cuenta, al loguearse se asocia `usuario_invitado_id`.
3. Si no tiene cuenta, se registra y luego acepta.
4. Estado pasa a `ACEPTADA`. Al cumplirse `expira_en` sin aceptación, pasa a `EXPIRADA` (job batch).

---

#### tabla `evaluaciones`
Entrega de un candidato/alumno a un desafío específico, en el marco de una asignación.

```sql
CREATE TABLE evaluaciones (
  id              UUID PRIMARY KEY,
  desafio_id      UUID NOT NULL REFERENCES desafios(id) ON DELETE RESTRICT,
  candidato_id    UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  asignacion_id   UUID REFERENCES asignaciones_desafio(id) ON DELETE SET NULL,
  codigo_entregado TEXT,
  lenguaje        VARCHAR(50),
  puntaje_total   DECIMAL(5,2),
  reporte_feedback JSONB,
  contexto        VARCHAR(20) NOT NULL,
  minutos_empleados INTEGER,
  estado          VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  inicio          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  entrega         TIMESTAMPTZ,
  evaluado_en     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_eval_contexto CHECK (contexto IN ('CORPORATIVO', 'ACADEMICO', 'AUTOEVALUACION')),
  CONSTRAINT chk_eval_estado CHECK (estado IN ('BORRADOR', 'EN_CURSO', 'ENTREGADA', 'EVALUADA', 'ANULADA')),
  CONSTRAINT chk_eval_puntaje CHECK (puntaje_total IS NULL OR (puntaje_total >= 0 AND puntaje_total <= 100)),
  CONSTRAINT chk_eval_fechas CHECK (
    (entrega IS NULL OR entrega >= inicio) AND
    (evaluado_en IS NULL OR (entrega IS NOT NULL AND evaluado_en >= entrega))
  )
);

CREATE INDEX idx_evaluaciones_desafio ON evaluaciones(desafio_id);
CREATE INDEX idx_evaluaciones_candidato ON evaluaciones(candidato_id);
CREATE INDEX idx_evaluaciones_asignacion ON evaluaciones(asignacion_id) WHERE asignacion_id IS NOT NULL;
CREATE INDEX idx_evaluaciones_ranking ON evaluaciones(asignacion_id, puntaje_total DESC) WHERE estado = 'EVALUADA';
CREATE INDEX idx_evaluaciones_feedback_gin ON evaluaciones USING GIN (reporte_feedback);
```

**Estados (FSM)**:
```
BORRADOR ──► EN_CURSO ──► ENTREGADA ──► EVALUADA
   │            │             │
   └────────────┴─────────────┴───► ANULADA (admin/sistema)
```

- `BORRADOR`: candidato vio el desafío pero no empezó (`inicio` aún no se setea hasta que escribe).
- `EN_CURSO`: hay versiones de autosave; aún no hay entrega formal.
- `ENTREGADA`: candidato presionó "enviar"; el LLM aún no evaluó.
- `EVALUADA`: el LLM completó la evaluación; `puntaje_total` y `reporte_feedback` poblados.
- `ANULADA`: descalificada (fraude detectado, problema técnico).

**Notas**:
- `asignacion_id` puede ser NULL si la evaluación es una autoevaluación libre (alumno practicando con un desafío de biblioteca sin asignación formal).
- El ranking de candidatos para un puesto se obtiene con un solo query usando `idx_evaluaciones_ranking`.

**Estructura sugerida de `reporte_feedback`**:
```json
{
  "version_evaluador": "1.2.0",
  "resumen": "Solución correcta con buena estructura, falta optimización en X",
  "puntos_fuertes": ["...", "..."],
  "puntos_a_mejorar": ["...", "..."],
  "ejemplos_codigo_mejor": [
    {"linea": 42, "sugerencia": "..."}
  ]
}
```

---

#### tabla `evaluaciones_versiones`
Historial de snapshots del código del candidato. Habilita autosave y reconstrucción del proceso de resolución.

```sql
CREATE TABLE evaluaciones_versiones (
  id              UUID PRIMARY KEY,
  evaluacion_id   UUID NOT NULL REFERENCES evaluaciones(id) ON DELETE CASCADE,
  codigo_snapshot TEXT NOT NULL,
  numero_version  INTEGER NOT NULL,
  tipo_evento     VARCHAR(20) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_evver_tipo CHECK (tipo_evento IN ('AUTOSAVE', 'ENTREGA', 'INICIO')),
  CONSTRAINT chk_evver_num CHECK (numero_version > 0)
);

CREATE UNIQUE INDEX idx_evver_unico ON evaluaciones_versiones(evaluacion_id, numero_version);
CREATE INDEX idx_evver_evaluacion ON evaluaciones_versiones(evaluacion_id, created_at DESC);
```

**Notas**:
- Una versión con `tipo_evento = ENTREGA` es la formalmente entregada y debe coincidir con `evaluaciones.codigo_entregado`.
- Para v1, autosave cada 30 segundos o ante cambios significativos. Para v2, podría almacenar diff en lugar de snapshot completo.

---

#### tabla `dimensiones_puntaje`
Desglose multi-dimensional del puntaje de una evaluación.

```sql
CREATE TABLE dimensiones_puntaje (
  id              UUID PRIMARY KEY,
  evaluacion_id   UUID NOT NULL REFERENCES evaluaciones(id) ON DELETE CASCADE,
  nombre          VARCHAR(50) NOT NULL,
  puntaje         DECIMAL(5,2) NOT NULL,
  peso            DECIMAL(3,2) NOT NULL,
  justificacion   TEXT,
  CONSTRAINT chk_dim_puntaje CHECK (puntaje >= 0 AND puntaje <= 100),
  CONSTRAINT chk_dim_peso CHECK (peso > 0 AND peso <= 1)
);

CREATE UNIQUE INDEX idx_dim_unica ON dimensiones_puntaje(evaluacion_id, nombre);
CREATE INDEX idx_dim_evaluacion ON dimensiones_puntaje(evaluacion_id);
```

**Reglas**:
- La suma de `peso` para una misma `evaluacion_id` debe ser 1.0 (validar en aplicación).
- `evaluaciones.puntaje_total = SUM(puntaje * peso)` para esa evaluación.
- Nombres canónicos sugeridos: `LOGICA`, `EFICIENCIA`, `ESTILO`, `PRACTICAS`. Se pueden agregar otros, pero deben matchear los definidos en `desafios.rubrica_oculta`.

---

### 3.5 dominio: puente educativo-corporativo

#### tabla `recomendaciones`
Feedback de un docente sobre un alumno, opcionalmente vinculada a un curso. Visible para reclutadores si el alumno habilita.

```sql
CREATE TABLE recomendaciones (
  id                  UUID PRIMARY KEY,
  emisor_usuario_id   UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  receptor_usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id            UUID REFERENCES cursos(id) ON DELETE SET NULL,
  contenido           TEXT NOT NULL,
  puntaje_estrellas   INTEGER NOT NULL,
  visible_para_pool   BOOLEAN NOT NULL DEFAULT FALSE,
  estado              VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_rec_estrellas CHECK (puntaje_estrellas BETWEEN 1 AND 5),
  CONSTRAINT chk_rec_estado CHECK (estado IN ('BORRADOR', 'PUBLICADA', 'RETIRADA')),
  CONSTRAINT chk_rec_actores CHECK (emisor_usuario_id != receptor_usuario_id),
  CONSTRAINT chk_rec_contenido CHECK (LENGTH(contenido) >= 50 AND LENGTH(contenido) <= 5000)
);

CREATE INDEX idx_rec_emisor ON recomendaciones(emisor_usuario_id);
CREATE INDEX idx_rec_receptor ON recomendaciones(receptor_usuario_id);
CREATE INDEX idx_rec_visibles ON recomendaciones(receptor_usuario_id, estado, visible_para_pool)
  WHERE estado = 'PUBLICADA' AND visible_para_pool = TRUE;
```

**Reglas**:
- El emisor debe tener (o haber tenido) membresía `DOCENTE` en alguna organización.
- El receptor debe haber sido (o ser) `ALUMNO` en algún curso del emisor para que la recomendación tenga sentido. Validable a nivel aplicación.
- `visible_para_pool` controla si los reclutadores la ven. **Default: FALSE** (el alumno acepta explícitamente cada recomendación). Esto es una mini-excepción al opt-out general del pool, porque las recomendaciones son contenido sobre la persona que terceros redactan: se requiere consentimiento expreso.
- Estado `RETIRADA`: el emisor o receptor decide bajarla. No se borra para mantener historial.

---

### 3.6 dominio: pool de talento

#### tabla `perfiles_talento`
Extensión del usuario para visibilidad pública/reclutadores.

```sql
CREATE TABLE perfiles_talento (
  id                    UUID PRIMARY KEY,
  usuario_id            UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  titular               VARCHAR(200),
  bio                   TEXT,
  disponibilidad        VARCHAR(20) NOT NULL DEFAULT 'PASIVA',
  visible_publico       BOOLEAN NOT NULL DEFAULT FALSE,
  visible_reclutadores  BOOLEAN NOT NULL DEFAULT TRUE,
  preferencias_contacto JSONB NOT NULL DEFAULT '{}'::jsonb,
  ubicacion             VARCHAR(200),
  cv_url                TEXT,
  linkedin_url          TEXT,
  github_url            TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_perfil_disponibilidad CHECK (disponibilidad IN ('ACTIVA', 'PASIVA', 'NO_DISPONIBLE'))
);

CREATE INDEX idx_perfil_visible_reclutadores ON perfiles_talento(visible_reclutadores)
  WHERE visible_reclutadores = TRUE AND disponibilidad != 'NO_DISPONIBLE';
CREATE INDEX idx_perfil_disponibilidad ON perfiles_talento(disponibilidad);
```

**Decisión clave (de la conversación)**:
- `visible_reclutadores = TRUE` por **default**, opt-out posible. Es la regla pediste.
- `visible_publico = FALSE` por default (más conservador, requiere acción explícita).
- `disponibilidad = 'PASIVA'` por default (se permite contactar pero no busca activamente).

**Reglas de visibilidad efectiva**:
Un usuario es visible para reclutadores si y sólo si:
- Tiene un `perfil_talento` (todos los usuarios que se registran tienen uno auto-creado)
- `visible_reclutadores = TRUE`
- `disponibilidad != 'NO_DISPONIBLE'`

---

#### tabla `habilidades_perfil`
Skills declarados por el usuario, opcionalmente validados por una evaluación.

```sql
CREATE TABLE habilidades_perfil (
  id                        UUID PRIMARY KEY,
  perfil_talento_id         UUID NOT NULL REFERENCES perfiles_talento(id) ON DELETE CASCADE,
  nombre                    VARCHAR(100) NOT NULL,
  nivel                     VARCHAR(20) NOT NULL,
  validada_por_evaluacion   BOOLEAN NOT NULL DEFAULT FALSE,
  evaluacion_id             UUID REFERENCES evaluaciones(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_hab_nivel CHECK (nivel IN ('BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO')),
  CONSTRAINT chk_hab_validada CHECK (
    (validada_por_evaluacion = FALSE) OR
    (validada_por_evaluacion = TRUE AND evaluacion_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX idx_hab_unica ON habilidades_perfil(perfil_talento_id, nombre);
CREATE INDEX idx_hab_validadas ON habilidades_perfil(perfil_talento_id) WHERE validada_por_evaluacion = TRUE;
```

**Notas**:
- Un skill validado significa: "Python avanzado validado por evaluación X (87/100)". Los reclutadores ven esta validación como diferenciador.
- Para v2: tabla maestra `tecnologias_canonicas` para autocompletado y agrupación. Por ahora, free text.

---

### 3.7 dominio: colaboración (repositorio LLM)

#### tabla `consultas_llm`
Pregunta de un alumno a la IA. Si está enmarcada en un curso, forma parte del repositorio colectivo.

```sql
CREATE TABLE consultas_llm (
  id                  UUID PRIMARY KEY,
  curso_id            UUID REFERENCES cursos(id) ON DELETE CASCADE,
  usuario_id          UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  pregunta            TEXT NOT NULL,
  respuesta           TEXT,
  tags                JSONB NOT NULL DEFAULT '[]'::jsonb,
  visible_clase       BOOLEAN NOT NULL DEFAULT TRUE,
  votos_positivos     INTEGER NOT NULL DEFAULT 0,
  prompt_version_id   UUID REFERENCES prompt_versiones(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_consulta_pregunta CHECK (LENGTH(pregunta) BETWEEN 10 AND 5000),
  CONSTRAINT chk_consulta_votos CHECK (votos_positivos >= 0)
);

CREATE INDEX idx_consultas_curso ON consultas_llm(curso_id) WHERE curso_id IS NOT NULL;
CREATE INDEX idx_consultas_usuario ON consultas_llm(usuario_id);
CREATE INDEX idx_consultas_top ON consultas_llm(curso_id, votos_positivos DESC, created_at DESC)
  WHERE visible_clase = TRUE;
CREATE INDEX idx_consultas_tags_gin ON consultas_llm USING GIN (tags);

-- Búsqueda full-text en español (preparar columna tsvector con trigger en migración aparte)
-- ALTER TABLE consultas_llm ADD COLUMN search_vector TSVECTOR;
-- CREATE INDEX idx_consultas_fts ON consultas_llm USING GIN (search_vector);
```

**Notas**:
- `curso_id` NULL: consulta personal (no compartida con clase). El usuario decide si tiene contexto de curso o no.
- `visible_clase` permite al autor marcar privadas consultas embarazosas/personales aún dentro de un curso.
- `votos_positivos` denormalizado para queries de top consultas. Se mantiene con trigger sobre `votos_consulta`.
- Para RAG futuro (fase 2 del documento): agregar columna `embedding VECTOR(384)` con pgvector y búsqueda semántica sobre el corpus de consultas de un curso.

---

#### tabla `votos_consulta`
Votos emitidos por usuarios sobre consultas. Permite ranking y moderación.

```sql
CREATE TABLE votos_consulta (
  id                UUID PRIMARY KEY,
  consulta_llm_id   UUID NOT NULL REFERENCES consultas_llm(id) ON DELETE CASCADE,
  usuario_id        UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo              VARCHAR(20) NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_voto_tipo CHECK (tipo IN ('UTIL', 'NO_UTIL', 'REPORTAR'))
);

CREATE UNIQUE INDEX idx_voto_unico ON votos_consulta(consulta_llm_id, usuario_id);
CREATE INDEX idx_voto_consulta ON votos_consulta(consulta_llm_id);
```

**Notas**:
- Un usuario puede tener UN voto activo por consulta. Si cambia de opinión, hace UPDATE.
- `REPORTAR` dispara flujo de moderación (no afecta ranking, suma flag para revisión).

---

### 3.8 dominio: trazabilidad y auditoría

#### tabla `prompt_versiones`
Versionado semántico de prompts del sistema. Cualquier prompt clave (generador, evaluador, juez de evals) tiene su versión registrada.

```sql
CREATE TABLE prompt_versiones (
  id                  UUID PRIMARY KEY,
  nombre              VARCHAR(100) NOT NULL,
  version_semver      VARCHAR(20) NOT NULL,
  plantilla           TEXT NOT NULL,
  variables_esperadas JSONB NOT NULL DEFAULT '[]'::jsonb,
  estado              VARCHAR(20) NOT NULL DEFAULT 'EXPERIMENTAL',
  notas_cambio        TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_prompt_estado CHECK (estado IN ('EXPERIMENTAL', 'ACTIVA', 'DEPRECADA'))
);

CREATE UNIQUE INDEX idx_prompt_nombre_version ON prompt_versiones(nombre, version_semver);
CREATE UNIQUE INDEX idx_prompt_activa ON prompt_versiones(nombre)
  WHERE estado = 'ACTIVA';
CREATE INDEX idx_prompt_estado ON prompt_versiones(estado);
```

**Reglas**:
- Solo UNA versión `ACTIVA` por nombre simultáneamente. El index parcial lo garantiza.
- `EXPERIMENTAL` es el estado de testing/evals. Pasa a `ACTIVA` cuando se aprueba en CI.
- `DEPRECADA` mantiene la fila para que evaluaciones históricas la referencien.

**Prompts canónicos esperados**:
- `generador_desafio`
- `evaluador_codigo`
- `juez_evals`
- `respondedor_consulta_alumno`

---

#### tabla `llamadas_llm`
Registro de cada invocación al LLM. Sirve para costos, debugging y reproducibilidad.

```sql
CREATE TABLE llamadas_llm (
  id                  UUID PRIMARY KEY,
  evaluacion_id       UUID REFERENCES evaluaciones(id) ON DELETE SET NULL,
  desafio_id          UUID REFERENCES desafios(id) ON DELETE SET NULL,
  consulta_llm_id     UUID REFERENCES consultas_llm(id) ON DELETE SET NULL,
  prompt_version_id   UUID NOT NULL REFERENCES prompt_versiones(id) ON DELETE RESTRICT,
  proveedor           VARCHAR(50) NOT NULL,
  modelo              VARCHAR(100) NOT NULL,
  tokens_in           INTEGER NOT NULL,
  tokens_out          INTEGER NOT NULL,
  costo_usd           DECIMAL(10,6) NOT NULL,
  latencia_ms         INTEGER NOT NULL,
  estado              VARCHAR(20) NOT NULL DEFAULT 'OK',
  error_mensaje       TEXT,
  request_id          UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_llm_estado CHECK (estado IN ('OK', 'ERROR', 'TIMEOUT', 'GUARDRAIL_RECHAZO')),
  CONSTRAINT chk_llm_tokens CHECK (tokens_in >= 0 AND tokens_out >= 0),
  CONSTRAINT chk_llm_costo CHECK (costo_usd >= 0),
  CONSTRAINT chk_llm_latencia CHECK (latencia_ms >= 0)
);

CREATE INDEX idx_llm_evaluacion ON llamadas_llm(evaluacion_id) WHERE evaluacion_id IS NOT NULL;
CREATE INDEX idx_llm_desafio ON llamadas_llm(desafio_id) WHERE desafio_id IS NOT NULL;
CREATE INDEX idx_llm_consulta ON llamadas_llm(consulta_llm_id) WHERE consulta_llm_id IS NOT NULL;
CREATE INDEX idx_llm_prompt ON llamadas_llm(prompt_version_id);
CREATE INDEX idx_llm_costos_diarios ON llamadas_llm(created_at, proveedor, modelo);
CREATE INDEX idx_llm_request_id ON llamadas_llm(request_id) WHERE request_id IS NOT NULL;
```

**Notas**:
- Las tres FKs nullable (`evaluacion_id`, `desafio_id`, `consulta_llm_id`) representan los tres orígenes posibles de una llamada. Exactamente uno debe estar poblado en cada fila (validar en aplicación, o agregar constraint si la complejidad lo justifica).
- `request_id` correlaciona con el `X-Request-ID` del request HTTP que disparó la llamada, para debugging cross-stack.
- `GUARDRAIL_RECHAZO` indica que el guardrail de input/output abortó el flujo (relevante para auditoría de seguridad).

**Queries típicas**:
```sql
-- Costo del último mes por proveedor
SELECT proveedor, SUM(costo_usd) AS costo_total
FROM llamadas_llm
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY proveedor;

-- Costo por evaluación promedio
SELECT AVG(costo_usd) FROM llamadas_llm
WHERE evaluacion_id IS NOT NULL AND created_at >= NOW() - INTERVAL '7 days';
```

---

#### tabla `eventos_auditoria`
Log inmutable de acciones críticas del sistema. Indispensable para disputas legales o compliance.

```sql
CREATE TABLE eventos_auditoria (
  id                  UUID PRIMARY KEY,
  actor_usuario_id    UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  accion              VARCHAR(100) NOT NULL,
  entidad_tipo        VARCHAR(50) NOT NULL,
  entidad_id          UUID NOT NULL,
  metadata_evento     JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_origen           INET,
  user_agent          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_entidad ON eventos_auditoria(entidad_tipo, entidad_id);
CREATE INDEX idx_audit_actor ON eventos_auditoria(actor_usuario_id) WHERE actor_usuario_id IS NOT NULL;
CREATE INDEX idx_audit_accion ON eventos_auditoria(accion);
CREATE INDEX idx_audit_temporal ON eventos_auditoria(created_at);
```

**Acciones canónicas a auditar**:
- `usuario.registrado`, `usuario.login_exitoso`, `usuario.login_fallido`, `usuario.password_cambiada`
- `desafio.creado`, `desafio.publicado`, `desafio.archivado`
- `asignacion.creada`, `invitacion.enviada`, `invitacion.aceptada`, `invitacion.revocada`
- `evaluacion.iniciada`, `evaluacion.entregada`, `evaluacion.evaluada`, `evaluacion.anulada`
- `recomendacion.publicada`, `recomendacion.retirada`, `recomendacion.visibilidad_cambiada`
- `perfil.visibilidad_cambiada`
- `membresia.creada`, `membresia.suspendida`, `membresia.revocada`

**Reglas**:
- INSERT-only. Nunca UPDATE ni DELETE.
- `actor_usuario_id` puede ser NULL para acciones del sistema (jobs batch).
- Retención: indefinida por ahora. Política de retención documentar en runbook cuando se defina compliance.

---

## 4. mapa de relaciones (cardinalidades clave)

```
USUARIO (1) ──────── (N) MEMBRESIA ──────── (1) ORGANIZACION
USUARIO (1) ──────── (1) PERFIL_TALENTO ──── (N) HABILIDAD_PERFIL
USUARIO (1) ──────── (N) RECOMENDACION (emitidas)
USUARIO (1) ──────── (N) RECOMENDACION (recibidas)

ORGANIZACION (1) ─── (N) CURSO ──────────── (N) INSCRIPCION ── (1) USUARIO
ORGANIZACION (1) ─── (N) PUESTO ─────────── (1) USUARIO (reclutador)

DESAFIO (1) ───────── (N) ASIGNACION_DESAFIO ── (0..1) PUESTO
                                              └─ (0..1) CURSO
ASIGNACION_DESAFIO (1) ── (N) INVITACION_DESAFIO
ASIGNACION_DESAFIO (1) ── (N) EVALUACION

EVALUACION (1) ────── (N) EVALUACION_VERSION
EVALUACION (1) ────── (N) DIMENSION_PUNTAJE
EVALUACION (1) ────── (N) LLAMADA_LLM (auditoría)

PROMPT_VERSION (1) ── (N) DESAFIO (los generados con ese prompt)
PROMPT_VERSION (1) ── (N) LLAMADA_LLM

CURSO (1) ─────────── (N) CONSULTA_LLM ───── (N) VOTO_CONSULTA
```

---

## 5. constraints y reglas de negocio que viven en el código

Algunas reglas no se pueden expresar puramente con CHECK constraints en SQL. Estas viven en la capa de aplicación (servicios) o en triggers especializados:

| regla | dónde se valida |
|-------|-----------------|
| El docente principal de un curso tiene membresía DOCENTE en la org | Servicio `CursoService.crear()` |
| Un reclutador de un puesto tiene membresía RECLUTADOR en la org | Servicio `PuestoService.crear()` |
| Una invitación apunta a una asignación cuya org coincide con el emisor | Servicio `InvitacionService.crear()` |
| Una evaluación solo se acepta si la asignación está dentro de ventana | Servicio `EvaluacionService.iniciar()` |
| Un candidato no excede `max_intentos` por asignación | Servicio `EvaluacionService.iniciar()` |
| Suma de `peso` de dimensiones de una evaluación = 1.0 | Servicio `EvaluacionService.cerrar()` |
| Solo el receptor o el emisor pueden cambiar `visible_para_pool` de una recomendación | Servicio `RecomendacionService.actualizar()` |
| Un usuario solo ve recomendaciones de otros si tiene rol RECLUTADOR o es el receptor | Servicio + RLS futuro |
| Solo una `prompt_versiones` con estado ACTIVA por nombre | Garantizado por índice parcial |
| Un usuario no puede votar dos veces la misma consulta | Garantizado por índice único |

---

## 6. estrategia de migraciones (Flyway)

**Orden propuesto** (cada V es una migración separada):

```
V1__create_extensions.sql                  -- pgcrypto, citext
V2__create_usuarios.sql
V3__create_organizaciones.sql
V4__create_membresias.sql
V5__create_cursos.sql
V6__create_inscripciones.sql
V7__create_puestos.sql
V8__create_prompt_versiones.sql            -- antes de desafios (FK)
V9__create_desafios.sql
V10__create_asignaciones_desafio.sql
V11__create_invitaciones_desafio.sql
V12__create_evaluaciones.sql
V13__create_evaluaciones_versiones.sql
V14__create_dimensiones_puntaje.sql
V15__create_perfiles_talento.sql
V16__create_habilidades_perfil.sql
V17__create_recomendaciones.sql
V18__create_consultas_llm.sql
V19__create_votos_consulta.sql
V20__create_llamadas_llm.sql
V21__create_eventos_auditoria.sql
V22__seed_prompt_versiones_iniciales.sql   -- datos iniciales
V23__create_triggers_updated_at.sql        -- triggers para updated_at
V24__create_function_recomputar_votos.sql  -- trigger de denormalización
```

**Reglas**:
- Migraciones inmutables una vez en `main` (regla de `CONTRIBUTING.md`).
- Cada migración es atómica y reversible cuando sea posible.
- Backfills en migraciones separadas de cambios de esquema.

---

## 7. consideraciones de performance

### 7.1 índices anticipados
Los índices listados arriba cubren los queries esperados del MVP:
- Login por email: `idx_usuarios_email` (único, implícito)
- Listar puestos abiertos de una org: `idx_puestos_organizacion` + `idx_puestos_estado`
- Ranking de evaluaciones: `idx_evaluaciones_ranking`
- Top consultas LLM de un curso: `idx_consultas_top`
- Buscar pool de talento visible: `idx_perfil_visible_reclutadores`

### 7.2 patrones a evitar
- **N+1 queries**: cargar evaluaciones + sus dimensiones + sus llamadas LLM debe hacerse con JOIN o batch fetching, no en loop.
- **Full-text en JSONB**: para búsqueda en `reporte_feedback` o `rubrica_oculta`, los GIN indexes ayudan pero son lentos. Si se vuelve crítico, denormalizar campos a columnas dedicadas.
- **Conteos exactos en tablas grandes**: `COUNT(*)` sobre `evaluaciones` con filtros se vuelve lento. Usar paginación cursor-based y conteos aproximados.

### 7.3 escalabilidad anticipada
- **Particionamiento**: cuando `evaluaciones` o `llamadas_llm` superen ~10M filas, particionar por `created_at` mensual.
- **Read replicas**: queries de reportes (top candidatos, costos LLM) van a réplica.
- **Materialized views**: el ranking del pool de talento puede materializarse y refrescarse cada N minutos en vez de calcularse on-demand.

---

## 8. seguridad y privacidad

### 8.1 datos sensibles (nunca loguear)
- `usuarios.password_hash`
- `invitaciones_desafio.token`
- Contenido de prompts y respuestas LLM en producción (debug only)
- `evaluaciones.codigo_entregado` puede contener IP del candidato (proyectos personales)

### 8.2 derecho al olvido (GDPR/LPDP)
Cuando un usuario solicita borrado:
- `ON DELETE CASCADE` en `membresias`, `inscripciones`, `perfiles_talento`, `habilidades_perfil`, `consultas_llm`, `votos_consulta`, `evaluaciones_versiones`
- `ON DELETE SET NULL` en `eventos_auditoria.actor_usuario_id`, `evaluaciones.candidato_id` (pseudonimizar)
- `ON DELETE RESTRICT` en `cursos.docente_principal_id`, `desafios.creador_usuario_id`: hay que reasignar antes de borrar (o crear usuario "anonimizado" para reasignar)

Documentar el procedimiento completo en `docs/runbooks/derecho-al-olvido.md`.

### 8.3 multi-tenancy
- En todos los queries de listado, filtrar por `organizacion_id` del usuario logueado (capa de aplicación).
- Para v2: implementar Row-Level Security (RLS) en Postgres como segunda línea de defensa.

### 8.4 datos del candidato vs datos del reclutador
- El **código entregado** y la **rúbrica oculta** son confidenciales y NO deben ser cross-visible:
  - Reclutador A no puede ver evaluaciones del puesto del reclutador B
  - Candidato no puede ver la rúbrica oculta del desafío que resolvió
  - Candidato no puede ver el código de otros candidatos

---

## 9. evolución prevista (v2 y siguientes)

| feature futura | impacto en el schema |
|----------------|---------------------|
| RAG sobre consultas LLM | Agregar `embedding VECTOR(384)` en `consultas_llm` (pgvector) |
| Ejecución de código (no solo análisis estático) | Tabla nueva `ejecuciones_codigo` con stdout, exit_code, runtime_ms |
| Pagos y suscripciones | Tablas `suscripciones`, `facturas`, `pagos` + columna `plan_id` en organizaciones |
| Certificados digitales | Tabla `certificados` con hash, blockchain_anchor opcional |
| Sistema de gamificación | Tablas `logros`, `usuario_logro`, `puntos_actividad` |
| Mensajería interna recruiter↔candidato | Tablas `conversaciones`, `mensajes` |
| ATS integration | Tabla `integraciones_externas` con tokens OAuth |
| Multi-idioma de prompts | Agregar `idioma` a `prompt_versiones`, índice por (nombre, idioma, estado) |

---

## 10. checklist de validación del schema

Antes de mergear cualquier migración nueva, verificar:

- [ ] Toda FK tiene política `ON DELETE` explícita
- [ ] Todo `string` que es enum tiene CHECK constraint
- [ ] Toda tabla tiene `created_at`; las que se modifican tienen `updated_at`
- [ ] Todo índice nuevo está justificado por un query real
- [ ] Toda tabla con datos sensibles está documentada en §8.1
- [ ] Si la tabla genera datos personales del usuario, está cubierta en §8.2
- [ ] Si la tabla es multi-tenant, usa `organizacion_id` y respeta el patrón
- [ ] La migración es reversible o está justificada su irreversibilidad
- [ ] El nombre de la migración sigue el patrón `V<n>__<descripcion_snake_case>.sql`

---

## 11. referencias

- DER (diagrama entidad-relación): [`database/DER.md`](../database/DER.md)
- ADR-0002: estrategia de RAG y vector store (define uso de pgvector)
- ADR-0003: estrategia de evaluación de LLMs (define `prompt_versiones`)
- `ARCHITECTURE.md` §4: modelo de datos (visión de alto nivel)
- `CONTRIBUTING.md` §6.3: convenciones SQL
