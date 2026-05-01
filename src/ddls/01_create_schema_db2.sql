-- DDL DB2 para Talent Pool
-- Fuente funcional: product/DATABASE.md
--
-- Adaptaciones desde PostgreSQL:
-- - UUID se modela como CHAR(36), esperando UUID v7 generado por la aplicacion.
-- - CITEXT se modela como VARCHAR + columna normalizada generada con LOWER().
-- - TIMESTAMPTZ se modela como TIMESTAMP DEFAULT CURRENT TIMESTAMP; la aplicacion debe persistir UTC.
-- - BOOLEAN se modela como SMALLINT con CHECK (0, 1), para maxima compatibilidad DB2.
-- - TEXT/JSONB/INET se modelan como CLOB/VARCHAR. La validacion JSON queda a cargo de la aplicacion.
-- - Indices parciales de PostgreSQL se reemplazan por indices compuestos convencionales.

CREATE TABLE usuarios (
  id                  CHAR(36) PRIMARY KEY,
  email               VARCHAR(255) NOT NULL,
  email_normalizado   VARCHAR(255) GENERATED ALWAYS AS (LOWER(email)),
  nombre_completo     VARCHAR(200) NOT NULL,
  password_hash       CLOB(64K) NOT NULL,
  foto_url            CLOB(64K),
  email_verificado    SMALLINT NOT NULL DEFAULT 0,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email_normalizado),
  CONSTRAINT chk_usuarios_email_verificado CHECK (email_verificado IN (0, 1))
);

CREATE INDEX idx_usuarios_email_verificado ON usuarios(email_verificado);

CREATE TABLE organizaciones (
  id              CHAR(36) PRIMARY KEY,
  nombre          VARCHAR(200) NOT NULL,
  tipo            VARCHAR(20) NOT NULL,
  plan            VARCHAR(20) NOT NULL DEFAULT 'FREE',
  dominio_email   VARCHAR(255),
  logo_url        CLOB(64K),
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT chk_org_tipo CHECK (tipo IN ('EMPRESA', 'INSTITUCION')),
  CONSTRAINT chk_org_plan CHECK (plan IN ('FREE', 'PRO', 'ENTERPRISE'))
);

CREATE UNIQUE INDEX idx_organizaciones_dominio ON organizaciones(dominio_email);

CREATE TABLE prompt_versiones (
  id                  CHAR(36) PRIMARY KEY,
  nombre              VARCHAR(100) NOT NULL,
  version_semver      VARCHAR(20) NOT NULL,
  plantilla           CLOB(1M) NOT NULL,
  variables_esperadas VARCHAR(32672) NOT NULL DEFAULT '[]',
  estado              VARCHAR(20) NOT NULL DEFAULT 'EXPERIMENTAL',
  notas_cambio        CLOB(64K),
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT chk_prompt_estado CHECK (estado IN ('EXPERIMENTAL', 'ACTIVA', 'DEPRECADA'))
);

CREATE UNIQUE INDEX idx_prompt_nombre_version ON prompt_versiones(nombre, version_semver);
CREATE INDEX idx_prompt_activa ON prompt_versiones(nombre, estado);
CREATE INDEX idx_prompt_estado ON prompt_versiones(estado);

CREATE TABLE membresias (
  id              CHAR(36) PRIMARY KEY,
  usuario_id      CHAR(36) NOT NULL,
  organizacion_id CHAR(36) NOT NULL,
  rol             VARCHAR(30) NOT NULL,
  estado          VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  inicio          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  fin             TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_mem_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_mem_organizacion FOREIGN KEY (organizacion_id) REFERENCES organizaciones(id) ON DELETE CASCADE,
  CONSTRAINT chk_mem_rol CHECK (rol IN ('OWNER', 'RECLUTADOR', 'DOCENTE', 'ALUMNO', 'EMPLEADO', 'ADMIN')),
  CONSTRAINT chk_mem_estado CHECK (estado IN ('ACTIVA', 'SUSPENDIDA', 'REVOCADA')),
  CONSTRAINT chk_mem_fechas CHECK (fin IS NULL OR fin >= inicio)
);

CREATE INDEX idx_membresias_unicas_activas ON membresias(usuario_id, organizacion_id, rol, estado);
CREATE INDEX idx_membresias_usuario ON membresias(usuario_id);
CREATE INDEX idx_membresias_organizacion ON membresias(organizacion_id);

CREATE TABLE cursos (
  id                    CHAR(36) PRIMARY KEY,
  organizacion_id       CHAR(36) NOT NULL,
  docente_principal_id  CHAR(36) NOT NULL,
  nombre                VARCHAR(200) NOT NULL,
  codigo                VARCHAR(50),
  anio_lectivo          VARCHAR(10),
  periodo               VARCHAR(50),
  descripcion           CLOB(64K),
  estado                VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_cursos_organizacion FOREIGN KEY (organizacion_id) REFERENCES organizaciones(id) ON DELETE RESTRICT,
  CONSTRAINT fk_cursos_docente FOREIGN KEY (docente_principal_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT chk_curso_estado CHECK (estado IN ('BORRADOR', 'ACTIVO', 'FINALIZADO', 'ARCHIVADO'))
);

CREATE INDEX idx_cursos_organizacion ON cursos(organizacion_id);
CREATE INDEX idx_cursos_docente ON cursos(docente_principal_id);
CREATE UNIQUE INDEX idx_cursos_codigo_org ON cursos(organizacion_id, codigo, anio_lectivo, periodo);

CREATE TABLE inscripciones (
  id          CHAR(36) PRIMARY KEY,
  curso_id    CHAR(36) NOT NULL,
  usuario_id  CHAR(36) NOT NULL,
  rol_curso   VARCHAR(20) NOT NULL DEFAULT 'ALUMNO',
  estado      VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_insc_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
  CONSTRAINT fk_insc_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT chk_insc_rol CHECK (rol_curso IN ('ALUMNO', 'AUXILIAR', 'OYENTE')),
  CONSTRAINT chk_insc_estado CHECK (estado IN ('ACTIVA', 'BAJA', 'FINALIZADA'))
);

CREATE INDEX idx_inscripciones_unicas ON inscripciones(curso_id, usuario_id, estado);
CREATE INDEX idx_inscripciones_usuario ON inscripciones(usuario_id);
CREATE INDEX idx_inscripciones_curso ON inscripciones(curso_id);

CREATE TABLE puestos (
  id                    CHAR(36) PRIMARY KEY,
  organizacion_id       CHAR(36) NOT NULL,
  reclutador_id         CHAR(36) NOT NULL,
  titulo                VARCHAR(200) NOT NULL,
  tecnologia_principal  VARCHAR(100) NOT NULL,
  seniority             VARCHAR(20) NOT NULL,
  descripcion           CLOB(64K),
  estado                VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_puestos_organizacion FOREIGN KEY (organizacion_id) REFERENCES organizaciones(id) ON DELETE RESTRICT,
  CONSTRAINT fk_puestos_reclutador FOREIGN KEY (reclutador_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT chk_puesto_seniority CHECK (seniority IN ('TRAINEE', 'JR', 'SSR', 'SR', 'LEAD')),
  CONSTRAINT chk_puesto_estado CHECK (estado IN ('BORRADOR', 'ABIERTO', 'PAUSADO', 'CERRADO'))
);

CREATE INDEX idx_puestos_organizacion ON puestos(organizacion_id);
CREATE INDEX idx_puestos_reclutador ON puestos(reclutador_id);
CREATE INDEX idx_puestos_estado ON puestos(estado);

CREATE TABLE desafios (
  id                  CHAR(36) PRIMARY KEY,
  creador_usuario_id  CHAR(36) NOT NULL,
  organizacion_id     CHAR(36),
  prompt_version_id   CHAR(36) NOT NULL,
  titulo              VARCHAR(200) NOT NULL,
  enunciado           CLOB(1M) NOT NULL,
  rubrica_oculta      CLOB(1M) NOT NULL,
  contexto_origen     VARCHAR(20) NOT NULL,
  tecnologia          VARCHAR(100) NOT NULL,
  seniority           VARCHAR(20) NOT NULL,
  minutos_estimados   INTEGER NOT NULL DEFAULT 60,
  es_publico          SMALLINT NOT NULL DEFAULT 0,
  estado              VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_desafios_creador FOREIGN KEY (creador_usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT fk_desafios_organizacion FOREIGN KEY (organizacion_id) REFERENCES organizaciones(id) ON DELETE RESTRICT,
  CONSTRAINT fk_desafios_prompt FOREIGN KEY (prompt_version_id) REFERENCES prompt_versiones(id) ON DELETE RESTRICT,
  CONSTRAINT chk_desafio_contexto CHECK (contexto_origen IN ('CORPORATIVO', 'ACADEMICO', 'BIBLIOTECA')),
  CONSTRAINT chk_desafio_seniority CHECK (seniority IN ('TRAINEE', 'JR', 'SSR', 'SR', 'LEAD')),
  CONSTRAINT chk_desafio_estado CHECK (estado IN ('BORRADOR', 'REVISION', 'ACTIVO', 'ARCHIVADO')),
  CONSTRAINT chk_desafio_minutos CHECK (minutos_estimados > 0 AND minutos_estimados <= 480),
  CONSTRAINT chk_desafio_publico CHECK (es_publico IN (0, 1))
);

CREATE INDEX idx_desafios_creador ON desafios(creador_usuario_id);
CREATE INDEX idx_desafios_organizacion ON desafios(organizacion_id);
CREATE INDEX idx_desafios_publicos ON desafios(es_publico, estado);
CREATE INDEX idx_desafios_tecnologia ON desafios(tecnologia, seniority);

CREATE TABLE asignaciones_desafio (
  id              CHAR(36) PRIMARY KEY,
  desafio_id      CHAR(36) NOT NULL,
  puesto_id       CHAR(36),
  curso_id        CHAR(36),
  tipo            VARCHAR(20) NOT NULL,
  fecha_apertura  TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  fecha_cierre    TIMESTAMP,
  max_intentos    INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_asig_desafio FOREIGN KEY (desafio_id) REFERENCES desafios(id) ON DELETE RESTRICT,
  CONSTRAINT fk_asig_puesto FOREIGN KEY (puesto_id) REFERENCES puestos(id) ON DELETE CASCADE,
  CONSTRAINT fk_asig_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
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
CREATE INDEX idx_asignaciones_puesto ON asignaciones_desafio(puesto_id);
CREATE INDEX idx_asignaciones_curso ON asignaciones_desafio(curso_id);
CREATE INDEX idx_asignaciones_ventana ON asignaciones_desafio(fecha_apertura, fecha_cierre);

CREATE TABLE invitaciones_desafio (
  id                    CHAR(36) PRIMARY KEY,
  asignacion_id         CHAR(36) NOT NULL,
  emisor_usuario_id     CHAR(36) NOT NULL,
  email_invitado        VARCHAR(255) NOT NULL,
  email_invitado_norm   VARCHAR(255) GENERATED ALWAYS AS (LOWER(email_invitado)),
  usuario_invitado_id   CHAR(36),
  token                 VARCHAR(64) NOT NULL UNIQUE,
  estado                VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  expira_en             TIMESTAMP NOT NULL,
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_inv_asignacion FOREIGN KEY (asignacion_id) REFERENCES asignaciones_desafio(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_emisor FOREIGN KEY (emisor_usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT fk_inv_usuario FOREIGN KEY (usuario_invitado_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT chk_inv_estado CHECK (estado IN ('PENDIENTE', 'ACEPTADA', 'EXPIRADA', 'REVOCADA')),
  CONSTRAINT chk_inv_expira CHECK (expira_en > created_at)
);

CREATE INDEX idx_invitaciones_asignacion ON invitaciones_desafio(asignacion_id);
CREATE INDEX idx_invitaciones_email ON invitaciones_desafio(email_invitado_norm);
CREATE INDEX idx_invitaciones_usuario ON invitaciones_desafio(usuario_invitado_id);
CREATE INDEX idx_invitaciones_pendientes ON invitaciones_desafio(estado, expira_en);

CREATE TABLE evaluaciones (
  id                  CHAR(36) PRIMARY KEY,
  desafio_id          CHAR(36) NOT NULL,
  candidato_id        CHAR(36) NOT NULL,
  asignacion_id       CHAR(36),
  codigo_entregado    CLOB(2M),
  lenguaje            VARCHAR(50),
  puntaje_total       DECIMAL(5,2),
  reporte_feedback    CLOB(1M),
  contexto            VARCHAR(20) NOT NULL,
  minutos_empleados   INTEGER,
  estado              VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  inicio              TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  entrega             TIMESTAMP,
  evaluado_en         TIMESTAMP,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_eval_desafio FOREIGN KEY (desafio_id) REFERENCES desafios(id) ON DELETE RESTRICT,
  CONSTRAINT fk_eval_candidato FOREIGN KEY (candidato_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT fk_eval_asignacion FOREIGN KEY (asignacion_id) REFERENCES asignaciones_desafio(id) ON DELETE SET NULL,
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
CREATE INDEX idx_evaluaciones_asignacion ON evaluaciones(asignacion_id);
CREATE INDEX idx_evaluaciones_ranking ON evaluaciones(asignacion_id, estado, puntaje_total DESC);

CREATE TABLE evaluaciones_versiones (
  id              CHAR(36) PRIMARY KEY,
  evaluacion_id   CHAR(36) NOT NULL,
  codigo_snapshot CLOB(2M) NOT NULL,
  numero_version  INTEGER NOT NULL,
  tipo_evento     VARCHAR(20) NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_evver_evaluacion FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones(id) ON DELETE CASCADE,
  CONSTRAINT chk_evver_tipo CHECK (tipo_evento IN ('AUTOSAVE', 'ENTREGA', 'INICIO')),
  CONSTRAINT chk_evver_num CHECK (numero_version > 0)
);

CREATE UNIQUE INDEX idx_evver_unico ON evaluaciones_versiones(evaluacion_id, numero_version);
CREATE INDEX idx_evver_evaluacion ON evaluaciones_versiones(evaluacion_id, created_at DESC);

CREATE TABLE dimensiones_puntaje (
  id              CHAR(36) PRIMARY KEY,
  evaluacion_id   CHAR(36) NOT NULL,
  nombre          VARCHAR(50) NOT NULL,
  puntaje         DECIMAL(5,2) NOT NULL,
  peso            DECIMAL(3,2) NOT NULL,
  justificacion   CLOB(64K),
  CONSTRAINT fk_dim_evaluacion FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones(id) ON DELETE CASCADE,
  CONSTRAINT chk_dim_puntaje CHECK (puntaje >= 0 AND puntaje <= 100),
  CONSTRAINT chk_dim_peso CHECK (peso > 0 AND peso <= 1)
);

CREATE UNIQUE INDEX idx_dim_unica ON dimensiones_puntaje(evaluacion_id, nombre);
CREATE INDEX idx_dim_evaluacion ON dimensiones_puntaje(evaluacion_id);

CREATE TABLE recomendaciones (
  id                  CHAR(36) PRIMARY KEY,
  emisor_usuario_id   CHAR(36) NOT NULL,
  receptor_usuario_id CHAR(36) NOT NULL,
  curso_id            CHAR(36),
  contenido           VARCHAR(5000) NOT NULL,
  puntaje_estrellas   INTEGER NOT NULL,
  visible_para_pool   SMALLINT NOT NULL DEFAULT 0,
  estado              VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_rec_emisor FOREIGN KEY (emisor_usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT fk_rec_receptor FOREIGN KEY (receptor_usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_rec_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE SET NULL,
  CONSTRAINT chk_rec_estrellas CHECK (puntaje_estrellas BETWEEN 1 AND 5),
  CONSTRAINT chk_rec_estado CHECK (estado IN ('BORRADOR', 'PUBLICADA', 'RETIRADA')),
  CONSTRAINT chk_rec_actores CHECK (emisor_usuario_id <> receptor_usuario_id),
  CONSTRAINT chk_rec_contenido CHECK (LENGTH(contenido) >= 50 AND LENGTH(contenido) <= 5000),
  CONSTRAINT chk_rec_visible_pool CHECK (visible_para_pool IN (0, 1))
);

CREATE INDEX idx_rec_emisor ON recomendaciones(emisor_usuario_id);
CREATE INDEX idx_rec_receptor ON recomendaciones(receptor_usuario_id);
CREATE INDEX idx_rec_visibles ON recomendaciones(receptor_usuario_id, estado, visible_para_pool);

CREATE TABLE perfiles_talento (
  id                    CHAR(36) PRIMARY KEY,
  usuario_id            CHAR(36) NOT NULL UNIQUE,
  titular               VARCHAR(200),
  bio                   CLOB(64K),
  disponibilidad        VARCHAR(20) NOT NULL DEFAULT 'PASIVA',
  visible_publico       SMALLINT NOT NULL DEFAULT 0,
  visible_reclutadores  SMALLINT NOT NULL DEFAULT 1,
  preferencias_contacto VARCHAR(32672) NOT NULL DEFAULT '{}',
  ubicacion             VARCHAR(200),
  cv_url                CLOB(64K),
  linkedin_url          CLOB(64K),
  github_url            CLOB(64K),
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_perfil_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT chk_perfil_disponibilidad CHECK (disponibilidad IN ('ACTIVA', 'PASIVA', 'NO_DISPONIBLE')),
  CONSTRAINT chk_perfil_visible_publico CHECK (visible_publico IN (0, 1)),
  CONSTRAINT chk_perfil_visible_reclutadores CHECK (visible_reclutadores IN (0, 1))
);

CREATE INDEX idx_perfil_visible_reclutadores ON perfiles_talento(visible_reclutadores, disponibilidad);
CREATE INDEX idx_perfil_disponibilidad ON perfiles_talento(disponibilidad);

CREATE TABLE habilidades_perfil (
  id                        CHAR(36) PRIMARY KEY,
  perfil_talento_id         CHAR(36) NOT NULL,
  nombre                    VARCHAR(100) NOT NULL,
  nivel                     VARCHAR(20) NOT NULL,
  validada_por_evaluacion   SMALLINT NOT NULL DEFAULT 0,
  evaluacion_id             CHAR(36),
  created_at                TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_hab_perfil FOREIGN KEY (perfil_talento_id) REFERENCES perfiles_talento(id) ON DELETE CASCADE,
  CONSTRAINT fk_hab_evaluacion FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones(id) ON DELETE SET NULL,
  CONSTRAINT chk_hab_nivel CHECK (nivel IN ('BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO')),
  CONSTRAINT chk_hab_validada CHECK (
    validada_por_evaluacion = 0 OR
    (validada_por_evaluacion = 1 AND evaluacion_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX idx_hab_unica ON habilidades_perfil(perfil_talento_id, nombre);
CREATE INDEX idx_hab_validadas ON habilidades_perfil(perfil_talento_id, validada_por_evaluacion);

CREATE TABLE consultas_llm (
  id                  CHAR(36) PRIMARY KEY,
  curso_id            CHAR(36),
  usuario_id          CHAR(36) NOT NULL,
  pregunta            VARCHAR(5000) NOT NULL,
  respuesta           CLOB(1M),
  tags                VARCHAR(32672) NOT NULL DEFAULT '[]',
  visible_clase       SMALLINT NOT NULL DEFAULT 1,
  votos_positivos     INTEGER NOT NULL DEFAULT 0,
  prompt_version_id   CHAR(36),
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_consulta_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
  CONSTRAINT fk_consulta_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_consulta_prompt FOREIGN KEY (prompt_version_id) REFERENCES prompt_versiones(id) ON DELETE SET NULL,
  CONSTRAINT chk_consulta_pregunta CHECK (LENGTH(pregunta) BETWEEN 10 AND 5000),
  CONSTRAINT chk_consulta_votos CHECK (votos_positivos >= 0),
  CONSTRAINT chk_consulta_visible_clase CHECK (visible_clase IN (0, 1))
);

CREATE INDEX idx_consultas_curso ON consultas_llm(curso_id);
CREATE INDEX idx_consultas_usuario ON consultas_llm(usuario_id);
CREATE INDEX idx_consultas_top ON consultas_llm(curso_id, visible_clase, votos_positivos DESC, created_at DESC);

CREATE TABLE votos_consulta (
  id                CHAR(36) PRIMARY KEY,
  consulta_llm_id   CHAR(36) NOT NULL,
  usuario_id        CHAR(36) NOT NULL,
  tipo              VARCHAR(20) NOT NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_voto_consulta FOREIGN KEY (consulta_llm_id) REFERENCES consultas_llm(id) ON DELETE CASCADE,
  CONSTRAINT fk_voto_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT chk_voto_tipo CHECK (tipo IN ('UTIL', 'NO_UTIL', 'REPORTAR'))
);

CREATE UNIQUE INDEX idx_voto_unico ON votos_consulta(consulta_llm_id, usuario_id);
CREATE INDEX idx_voto_consulta ON votos_consulta(consulta_llm_id);

CREATE TABLE llamadas_llm (
  id                  CHAR(36) PRIMARY KEY,
  evaluacion_id       CHAR(36),
  desafio_id          CHAR(36),
  consulta_llm_id     CHAR(36),
  prompt_version_id   CHAR(36) NOT NULL,
  proveedor           VARCHAR(50) NOT NULL,
  modelo              VARCHAR(100) NOT NULL,
  tokens_in           INTEGER NOT NULL,
  tokens_out          INTEGER NOT NULL,
  costo_usd           DECIMAL(10,6) NOT NULL,
  latencia_ms         INTEGER NOT NULL,
  estado              VARCHAR(20) NOT NULL DEFAULT 'OK',
  error_mensaje       CLOB(64K),
  request_id          CHAR(36),
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_llm_evaluacion FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones(id) ON DELETE SET NULL,
  CONSTRAINT fk_llm_desafio FOREIGN KEY (desafio_id) REFERENCES desafios(id) ON DELETE SET NULL,
  CONSTRAINT fk_llm_consulta FOREIGN KEY (consulta_llm_id) REFERENCES consultas_llm(id) ON DELETE SET NULL,
  CONSTRAINT fk_llm_prompt FOREIGN KEY (prompt_version_id) REFERENCES prompt_versiones(id) ON DELETE RESTRICT,
  CONSTRAINT chk_llm_estado CHECK (estado IN ('OK', 'ERROR', 'TIMEOUT', 'GUARDRAIL_RECHAZO')),
  CONSTRAINT chk_llm_tokens CHECK (tokens_in >= 0 AND tokens_out >= 0),
  CONSTRAINT chk_llm_costo CHECK (costo_usd >= 0),
  CONSTRAINT chk_llm_latencia CHECK (latencia_ms >= 0)
);

CREATE INDEX idx_llm_evaluacion ON llamadas_llm(evaluacion_id);
CREATE INDEX idx_llm_desafio ON llamadas_llm(desafio_id);
CREATE INDEX idx_llm_consulta ON llamadas_llm(consulta_llm_id);
CREATE INDEX idx_llm_prompt ON llamadas_llm(prompt_version_id);
CREATE INDEX idx_llm_costos_diarios ON llamadas_llm(created_at, proveedor, modelo);
CREATE INDEX idx_llm_request_id ON llamadas_llm(request_id);

CREATE TABLE eventos_auditoria (
  id                  CHAR(36) PRIMARY KEY,
  actor_usuario_id    CHAR(36),
  accion              VARCHAR(100) NOT NULL,
  entidad_tipo        VARCHAR(50) NOT NULL,
  entidad_id          CHAR(36) NOT NULL,
  metadata_evento     VARCHAR(32672) NOT NULL DEFAULT '{}',
  ip_origen           VARCHAR(45),
  user_agent          CLOB(64K),
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT TIMESTAMP,
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_entidad ON eventos_auditoria(entidad_tipo, entidad_id);
CREATE INDEX idx_audit_actor ON eventos_auditoria(actor_usuario_id);
CREATE INDEX idx_audit_accion ON eventos_auditoria(accion);
CREATE INDEX idx_audit_temporal ON eventos_auditoria(created_at);
