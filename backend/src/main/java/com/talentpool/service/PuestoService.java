package com.talentpool.service;

import com.talentpool.api.dto.CreatePuestoRequest;
import com.talentpool.api.exception.ResourceNotFoundException;
import com.talentpool.api.exception.UnauthorizedAccessException;
import com.talentpool.domain.Membresia;
import com.talentpool.domain.Puesto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Service for managing job positions (Puestos).
 *
 * <p>Handles business logic for creating and managing positions for recruiting.
 */
@ApplicationScoped
public class PuestoService {

  private static final Logger LOG = Logger.getLogger(PuestoService.class);

  @Inject EntityManager em;

  /**
   * Create a new job position.
   *
   * @param request position details
   * @param userId ID of the user creating the position
   * @return created position
   */
  @Transactional
  public Puesto create(CreatePuestoRequest request, UUID userId) {
    LOG.infof("Creating position for user %s: %s", userId, request.titulo());

    // Determine organization ID
    UUID organizacionId = request.organizacionId();
    if (organizacionId == null) {
      // Get user's organization from membership
      organizacionId = getUserOrganizationId(userId);
    } else {
      // Validate user has access to the specified organization
      validateUserOrganizationAccess(userId, organizacionId);
    }

    // Create position
    Puesto puesto = new Puesto();
    puesto.organizacionId = organizacionId;
    puesto.reclutadorId = userId;
    puesto.titulo = request.titulo();
    puesto.tecnologiaPrincipal = request.tecnologiaPrincipal();
    puesto.seniority = request.seniority();
    puesto.descripcion = request.descripcion();
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
    
    // User must be the recruiter or belong to the same organization
    if (!puesto.reclutadorId.equals(userId)) {
      UUID userOrgId = getUserOrganizationId(userId);
      if (!puesto.organizacionId.equals(userOrgId)) {
        throw new UnauthorizedAccessException("Position", puestoId);
      }
    }
  }

  /**
   * Get user's organization ID from their membership.
   *
   * @param userId user ID
   * @return organization ID
   * @throws ResourceNotFoundException if user has no organization
   */
  private UUID getUserOrganizationId(UUID userId) {
    Membresia membresia = em.createQuery(
            "SELECT m FROM Membresia m WHERE m.usuarioId = :userId AND m.estado = 'ACTIVA'",
            Membresia.class)
        .setParameter("userId", userId)
        .getResultStream()
        .findFirst()
        .orElseThrow(() -> new ResourceNotFoundException(
            "User has no active organization membership"));

    return membresia.organizacionId;
  }

  /**
   * Validate user has access to an organization.
   *
   * @param userId user ID
   * @param organizacionId organization ID
   * @throws UnauthorizedAccessException if user doesn't belong to organization
   */
  private void validateUserOrganizationAccess(UUID userId, UUID organizacionId) {
    boolean hasAccess = em.createQuery(
            "SELECT COUNT(m) > 0 FROM Membresia m " +
            "WHERE m.usuarioId = :userId AND m.organizacionId = :orgId AND m.estado = 'ACTIVA'",
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

// Made with Bob