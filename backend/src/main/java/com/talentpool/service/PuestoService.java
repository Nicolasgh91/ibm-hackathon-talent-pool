package com.talentpool.service;

import com.talentpool.api.dto.CreatePuestoRequest;
import com.talentpool.api.dto.CreatePuestoRequest.SkillTecnica;
import com.talentpool.api.dto.UpdatePuestoRequest;
import com.talentpool.api.exception.ResourceNotFoundException;
import com.talentpool.api.exception.UnauthorizedAccessException;
import com.talentpool.domain.Membresia;
import com.talentpool.domain.Puesto;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import java.util.List;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Service for managing job positions (Puestos).
 *
 * <p>Handles business logic for creating and managing positions for recruiting (UC-006).
 */
@ApplicationScoped
public class PuestoService {

  private static final Logger LOG = Logger.getLogger(PuestoService.class);

  private static final int MIN_HERRAMIENTAS = 1;
  private static final int MIN_SKILLS_TECNICAS = 3;
  private static final int MAX_SKILLS_TECNICAS = 12;
  private static final int MAX_SKILLS_BLANDAS = 8;

  @Inject EntityManager em;

  /**
   * Create a new job position (UC-006).
   *
   * <p>Enforces the structured profile minimums declared in product/PRODUCT.md UC-006: at least 1
   * tool, between 3 and 12 technical skills, up to 8 soft skills. Initial state is BORRADOR; a
   * later transition to ABIERTO is what unblocks UC-007 challenge generation.
   *
   * @param request position details
   * @param userId ID of the user creating the position
   * @return created position
   */
  @Transactional
  public Puesto create(CreatePuestoRequest request, UUID userId) {
    LOG.infof("Creating position for user %s: %s", userId, request.titulo());

    UUID organizacionId = request.organizacionId();
    if (organizacionId == null) {
      organizacionId = getUserOrganizationId(userId);
    } else {
      validateUserOrganizationAccess(userId, organizacionId);
    }

    JsonArray herramientas = toJsonArrayOfStrings(request.herramientas());
    JsonArray skillsTecnicas = toJsonArrayOfSkills(request.skillsTecnicas());
    JsonArray skillsBlandas = toJsonArrayOfStrings(request.skillsBlandas());

    validateProfile(herramientas, skillsTecnicas, skillsBlandas);

    Puesto puesto = new Puesto();
    puesto.organizacionId = organizacionId;
    puesto.reclutadorId = userId;
    puesto.titulo = request.titulo();
    puesto.tecnologiaPrincipal = request.tecnologiaPrincipal();
    puesto.seniority = request.seniority();
    puesto.descripcion = request.descripcion();
    puesto.herramientas = herramientas;
    puesto.skillsTecnicas = skillsTecnicas;
    puesto.skillsBlandas = skillsBlandas;
    puesto.roadmapPublicoHabilitado =
        request.roadmapPublicoHabilitado() == null
            ? Boolean.TRUE
            : request.roadmapPublicoHabilitado();
    puesto.estado = "BORRADOR";

    em.persist(puesto);
    LOG.infof("Position created: %s", puesto.id);

    return puesto;
  }

  /**
   * Find position by ID.
   *
   * @param id position ID
   * @return position
   * @throws ResourceNotFoundException if not found
   */
  public Puesto findById(UUID id) {
    Puesto puesto = Puesto.findByIdOptional(id);
    if (puesto == null) {
      throw new ResourceNotFoundException("Position", id);
    }
    return puesto;
  }

  /**
   * Find all positions for an organization.
   *
   * @param organizacionId organization ID
   * @return list of positions
   */
  public List<Puesto> findByOrganizacion(UUID organizacionId) {
    return Puesto.findByOrganizacion(organizacionId);
  }

  /**
   * Validate user has access to a position.
   *
   * @param userId user ID
   * @param puestoId position ID
   * @throws UnauthorizedAccessException if user doesn't have access
   */
  public void validateUserAccess(UUID userId, UUID puestoId) {
    Puesto puesto = findById(puestoId);

    if (!puesto.reclutadorId.equals(userId)) {
      UUID userOrgId = getUserOrganizationId(userId);
      if (!puesto.organizacionId.equals(userOrgId)) {
        throw new UnauthorizedAccessException("Position", puestoId);
      }
    }
  }

  /** Primary organization for listings when {@code organizacionId} is omitted. */
  public UUID primaryOrganizationForUser(UUID userId) {
    return getUserOrganizationId(userId);
  }

  @Transactional
  public Puesto update(UUID puestoId, UpdatePuestoRequest req, UUID userId) {
    Puesto p = findById(puestoId);
    validateUserAccess(userId, puestoId);
    if (req.titulo() != null && !req.titulo().isBlank()) {
      p.titulo = req.titulo().trim();
    }
    if (req.descripcion() != null) {
      p.descripcion = req.descripcion();
    }
    if (req.seniority() != null && !req.seniority().isBlank()) {
      p.seniority = req.seniority();
    }
    if (req.tecnologiaPrincipal() != null && !req.tecnologiaPrincipal().isBlank()) {
      p.tecnologiaPrincipal = req.tecnologiaPrincipal().trim();
    }
    if (req.herramientas() != null) {
      p.herramientas = toJsonArrayOfStrings(req.herramientas());
    }
    if (req.skillsTecnicas() != null) {
      p.skillsTecnicas = toJsonArrayOfSkills(req.skillsTecnicas());
    }
    if (req.skillsBlandas() != null) {
      p.skillsBlandas = toJsonArrayOfStrings(req.skillsBlandas());
    }
    if (req.roadmapPublicoHabilitado() != null) {
      p.roadmapPublicoHabilitado = req.roadmapPublicoHabilitado();
    }
    validateProfile(p.herramientas, p.skillsTecnicas, p.skillsBlandas);
    em.merge(p);
    return p;
  }

  @Transactional
  public void delete(UUID puestoId, UUID userId) {
    Puesto p = findById(puestoId);
    validateUserAccess(userId, puestoId);
    p.delete();
  }

  @Transactional
  public Puesto activate(UUID puestoId, UUID userId) {
    Puesto p = findById(puestoId);
    validateUserAccess(userId, puestoId);
    p.estado = "ABIERTO";
    em.merge(p);
    return p;
  }

  @Transactional
  public Puesto deactivate(UUID puestoId, UUID userId) {
    Puesto p = findById(puestoId);
    validateUserAccess(userId, puestoId);
    p.estado = "PAUSADO";
    em.merge(p);
    return p;
  }

  // -- helpers ---------------------------------------------------------------

  /**
   * UC-006 profile validation.
   *
   * <p>Strict minimums (>=1 herramienta, >=3 skills_tecnicas, >=2 skills_blandas) only apply when
   * the recruiter publishes the position (BORRADOR -> ABIERTO). At create time we keep drafts
   * permissive so the legacy short payload still produces a BORRADOR row. Maximum limits are
   * enforced unconditionally because they protect downstream prompts from oversized inputs. Tracked
   * in TECH_DEBT TD-007.
   */
  private void validateProfile(
      JsonArray herramientas, JsonArray skillsTecnicas, JsonArray skillsBlandas) {
    if (skillsTecnicas.size() > MAX_SKILLS_TECNICAS) {
      throw unprocessable("skills_tecnicas: maximum " + MAX_SKILLS_TECNICAS + " allowed (UC-006)");
    }
    if (skillsBlandas.size() > MAX_SKILLS_BLANDAS) {
      throw unprocessable("skills_blandas: maximum " + MAX_SKILLS_BLANDAS + " allowed (UC-006)");
    }
  }

  /**
   * Strict UC-006 minimums used by the (future) publish transition. Exposed package-private so
   * Phase D can call it from the publish endpoint without re-implementing the rules.
   */
  void validateProfileForPublish(Puesto puesto) {
    if (puesto.herramientas == null || puesto.herramientas.size() < MIN_HERRAMIENTAS) {
      throw unprocessable(
          "herramientas: at least " + MIN_HERRAMIENTAS + " required to publish (UC-006)");
    }
    if (puesto.skillsTecnicas == null || puesto.skillsTecnicas.size() < MIN_SKILLS_TECNICAS) {
      throw unprocessable(
          "skills_tecnicas: minimum " + MIN_SKILLS_TECNICAS + " required to publish (UC-006)");
    }
  }

  private static JsonArray toJsonArrayOfStrings(List<String> items) {
    JsonArray array = new JsonArray();
    if (items == null) {
      return array;
    }
    for (String s : items) {
      if (s != null && !s.isBlank()) {
        array.add(s.trim());
      }
    }
    return array;
  }

  private static JsonArray toJsonArrayOfSkills(List<SkillTecnica> skills) {
    JsonArray array = new JsonArray();
    if (skills == null) {
      return array;
    }
    for (SkillTecnica skill : skills) {
      if (skill == null || skill.nombre() == null || skill.nombre().isBlank()) {
        continue;
      }
      JsonObject obj =
          new JsonObject().put("nombre", skill.nombre().trim()).put("nivel", skill.nivel());
      array.add(obj);
    }
    return array;
  }

  private static WebApplicationException unprocessable(String message) {
    return new WebApplicationException(message, 422);
  }

  private UUID getUserOrganizationId(UUID userId) {
    Membresia membresia =
        em.createQuery(
                "SELECT m FROM Membresia m WHERE m.usuarioId = :userId AND m.estado = 'ACTIVA'",
                Membresia.class)
            .setParameter("userId", userId)
            .getResultStream()
            .findFirst()
            .orElseThrow(
                () -> new ResourceNotFoundException("User has no active organization membership"));

    return membresia.organizacionId;
  }

  public void validateUserOrganizationAccess(UUID userId, UUID organizacionId) {
    boolean hasAccess =
        em.createQuery(
                "SELECT COUNT(m) > 0 FROM Membresia m "
                    + "WHERE m.usuarioId = :userId AND m.organizacionId = :orgId AND m.estado = 'ACTIVA'",
                Boolean.class)
            .setParameter("userId", userId)
            .setParameter("orgId", organizacionId)
            .getSingleResult();

    if (!hasAccess) {
      throw new UnauthorizedAccessException(
          "User does not belong to organization: " + organizacionId);
    }
  }
}
