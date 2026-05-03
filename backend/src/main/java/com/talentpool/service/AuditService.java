package com.talentpool.service;

import com.talentpool.domain.EventoAuditoria;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.Map;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Append-only writer for {@link EventoAuditoria}.
 *
 * <p>Canonical action names live as constants here so callers don't drift the namespace. The
 * service writes in a fresh transaction and never bubbles errors to the user-visible flow.
 */
@ApplicationScoped
public class AuditService {

  private static final Logger LOG = Logger.getLogger(AuditService.class);

  // ---- canonical actions (DATABASE.md §3.8 list) -------------------------

  public static final String USUARIO_REGISTRADO = "usuario.registrado";
  public static final String USUARIO_LOGIN_EXITOSO = "usuario.login_exitoso";
  public static final String USUARIO_LOGIN_FALLIDO = "usuario.login_fallido";
  public static final String USUARIO_PASSWORD_CAMBIADA = "usuario.password_cambiada";
  public static final String USUARIO_LOGOUT = "usuario.logout";

  public static final String DESAFIO_CREADO = "desafio.creado";
  public static final String DESAFIO_PUBLICADO = "desafio.publicado";
  public static final String DESAFIO_ARCHIVADO = "desafio.archivado";
  public static final String DESAFIO_GENERACION_FALLBACK = "desafio.generacion_fallback";

  public static final String ASIGNACION_CREADA = "asignacion.creada";
  public static final String INVITACION_ENVIADA = "invitacion.enviada";
  public static final String INVITACION_ACEPTADA = "invitacion.aceptada";
  public static final String INVITACION_REVOCADA = "invitacion.revocada";

  public static final String EVALUACION_INICIADA = "evaluacion.iniciada";
  public static final String EVALUACION_ENTREGADA = "evaluacion.entregada";
  public static final String EVALUACION_EVALUADA = "evaluacion.evaluada";
  public static final String EVALUACION_ANULADA = "evaluacion.anulada";

  public static final String MEMBRESIA_CREADA = "membresia.creada";
  public static final String MEMBRESIA_SUSPENDIDA = "membresia.suspendida";
  public static final String MEMBRESIA_REVOCADA = "membresia.revocada";

  public static final String PERFIL_VISIBILIDAD_CAMBIADA = "perfil.visibilidad_cambiada";

  // ---- impl --------------------------------------------------------------

  private final EntityManager em;

  public AuditService(EntityManager em) {
    this.em = em;
  }

  /**
   * Persist a single audit event in a fresh transaction.
   *
   * @param actorUsuarioId nullable when the action is system-driven
   * @param accion one of the constants declared above (free-form is allowed but discouraged)
   * @param entidadTipo type label, e.g. {@code "DESAFIO"}, {@code "USUARIO"}
   * @param entidadId id of the affected entity
   * @param metadata structured payload; null becomes {@code {}}
   */
  @Transactional(Transactional.TxType.REQUIRES_NEW)
  public void log(
      UUID actorUsuarioId,
      String accion,
      String entidadTipo,
      UUID entidadId,
      Map<String, Object> metadata) {
    log(actorUsuarioId, accion, entidadTipo, entidadId, metadata, null, null);
  }

  /** Variant that carries the request envelope (IP / User-Agent) for security-sensitive actions. */
  @Transactional(Transactional.TxType.REQUIRES_NEW)
  public void log(
      UUID actorUsuarioId,
      String accion,
      String entidadTipo,
      UUID entidadId,
      Map<String, Object> metadata,
      String ipOrigen,
      String userAgent) {
    try {
      EventoAuditoria row = new EventoAuditoria();
      row.actorUsuarioId = actorUsuarioId;
      row.accion = accion;
      row.entidadTipo = entidadTipo;
      row.entidadId = entidadId;
      row.metadataEvento = metadata == null ? new JsonObject() : new JsonObject(metadata);
      row.ipOrigen = ipOrigen;
      row.userAgent = userAgent;
      em.persist(row);
    } catch (Exception e) {
      LOG.warnf(
          e,
          "Failed to write eventos_auditoria row (accion=%s, entidad=%s/%s, actor=%s)",
          accion,
          entidadTipo,
          entidadId,
          actorUsuarioId);
    }
  }
}
