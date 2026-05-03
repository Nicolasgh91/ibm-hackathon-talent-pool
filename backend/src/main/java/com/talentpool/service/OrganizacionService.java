package com.talentpool.service;

import com.talentpool.api.dto.CreateOrganizationRequest;
import com.talentpool.api.exception.ResourceNotFoundException;
import com.talentpool.api.exception.UnauthorizedAccessException;
import com.talentpool.domain.Membresia;
import com.talentpool.domain.Organizacion;
import com.talentpool.domain.Puesto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;
import org.jboss.logging.Logger;

/** UC-004: organization CRUD scoped by {@link Membresia} membership. */
@ApplicationScoped
public class OrganizacionService {

  private static final Logger LOG = Logger.getLogger(OrganizacionService.class);

  @Inject EntityManager em;

  public List<Organizacion> listForUser(UUID userId) {
    return em.createQuery(
            "SELECT o FROM Organizacion o JOIN Membresia m ON m.organizacionId = o.id "
                + "WHERE m.usuarioId = :uid AND m.estado = 'ACTIVA' ORDER BY o.nombre ASC",
            Organizacion.class)
        .setParameter("uid", userId)
        .getResultList();
  }

  public Organizacion getForUser(UUID userId, UUID organizacionId) {
    Organizacion o = Organizacion.findByIdOptional(organizacionId);
    if (o == null) {
      throw new ResourceNotFoundException("Organization", organizacionId);
    }
    requireMembership(userId, organizacionId);
    return o;
  }

  @Transactional
  public Organizacion create(UUID userId, CreateOrganizationRequest request) {
    LOG.infof("Creating organization for user %s: %s", userId, request.nombre());

    String tipo = normalizeTipo(request.tipo());

    Organizacion o = new Organizacion();
    o.nombre = request.nombre().trim();
    o.descripcion = blankToNull(request.descripcion());
    o.tipo = tipo;
    o.plan = "FREE";

    em.persist(o);

    Membresia m = new Membresia();
    m.usuarioId = userId;
    m.organizacionId = o.id;
    m.rol = "OWNER";
    m.estado = "ACTIVA";
    em.persist(m);

    LOG.infof("Organization created: %s", o.id);
    return o;
  }

  @Transactional
  public Organizacion update(UUID userId, UUID organizacionId, CreateOrganizationRequest request) {
    Organizacion o = getForUser(userId, organizacionId);
    requireRecruiterAdminRole(userId, organizacionId);

    o.nombre = request.nombre().trim();
    o.descripcion = blankToNull(request.descripcion());
    if (request.tipo() != null && !request.tipo().isBlank()) {
      o.tipo = normalizeTipo(request.tipo());
    }

    em.merge(o);
    return o;
  }

  @Transactional
  public void delete(UUID userId, UUID organizacionId) {
    Organizacion o = getForUser(userId, organizacionId);
    requireOwner(userId, organizacionId);

    long puestoCount = Puesto.count("organizacionId", organizacionId);
    if (puestoCount > 0) {
      throw new ClientErrorException(
          Response.status(Response.Status.CONFLICT)
              .entity(
                  "{\"error\":\"Organization has job positions; remove or reassign them first\"}")
              .build());
    }

    em.remove(o);
    LOG.infof("Organization deleted: %s", organizacionId);
  }

  private static String normalizeTipo(String tipo) {
    if (tipo == null || tipo.isBlank()) {
      return "EMPRESA";
    }
    if (!"EMPRESA".equals(tipo) && !"INSTITUCION".equals(tipo)) {
      throw new BadRequestException("tipo must be EMPRESA or INSTITUCION");
    }
    return tipo;
  }

  private void requireMembership(UUID userId, UUID organizacionId) {
    boolean ok =
        Membresia.count(
                "usuarioId = ?1 and organizacionId = ?2 and estado = 'ACTIVA'",
                userId,
                organizacionId)
            > 0;
    if (!ok) {
      throw new UnauthorizedAccessException("Organization", organizacionId);
    }
  }

  private void requireRecruiterAdminRole(UUID userId, UUID organizacionId) {
    Membresia m =
        Membresia.find(
                "usuarioId = ?1 and organizacionId = ?2 and estado = 'ACTIVA'",
                userId,
                organizacionId)
            .firstResult();
    if (m == null) {
      throw new UnauthorizedAccessException("Organization", organizacionId);
    }
    if (!"OWNER".equals(m.rol) && !"RECLUTADOR".equals(m.rol)) {
      throw new UnauthorizedAccessException(
          "Only organization OWNER or RECLUTADOR can update organization");
    }
  }

  private void requireOwner(UUID userId, UUID organizacionId) {
    Membresia m =
        Membresia.find(
                "usuarioId = ?1 and organizacionId = ?2 and estado = 'ACTIVA'",
                userId,
                organizacionId)
            .firstResult();
    if (m == null || !"OWNER".equals(m.rol)) {
      throw new UnauthorizedAccessException("Only organization OWNER can delete organization");
    }
  }

  private static String blankToNull(String s) {
    if (s == null || s.isBlank()) {
      return null;
    }
    return s.trim();
  }
}
