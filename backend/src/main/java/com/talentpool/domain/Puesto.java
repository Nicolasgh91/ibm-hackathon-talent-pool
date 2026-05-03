package com.talentpool.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.vertx.core.json.JsonArray;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Puesto entity - Job position for corporate recruiting.
 *
 * <p>Based on product/DATABASE.md §3.3
 */
@Entity
@Table(name = "puestos")
public class Puesto extends PanacheEntityBase {

  @Id
  @Column(columnDefinition = "UUID")
  public UUID id;

  @Column(name = "organizacion_id", nullable = false, columnDefinition = "UUID")
  public UUID organizacionId;

  @Column(name = "reclutador_id", nullable = false, columnDefinition = "UUID")
  public UUID reclutadorId;

  @Column(nullable = false, length = 200)
  public String titulo;

  @Column(name = "tecnologia_principal", nullable = false, length = 100)
  public String tecnologiaPrincipal;

  @Column(nullable = false, length = 20)
  public String seniority; // TRAINEE, JR, SSR, SR, LEAD

  @Column(columnDefinition = "TEXT")
  public String descripcion;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(nullable = false, columnDefinition = "jsonb")
  public JsonArray herramientas = new JsonArray();

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "skills_tecnicas", nullable = false, columnDefinition = "jsonb")
  public JsonArray skillsTecnicas = new JsonArray();

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "skills_blandas", nullable = false, columnDefinition = "jsonb")
  public JsonArray skillsBlandas = new JsonArray();

  @Column(name = "roadmap_publico_habilitado", nullable = false)
  public Boolean roadmapPublicoHabilitado = true;

  @Column(nullable = false, length = 20)
  public String estado = "BORRADOR"; // BORRADOR, ABIERTO, PAUSADO, CERRADO

  @Column(name = "created_at", nullable = false, updatable = false)
  public Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  public Instant updatedAt;

  @PrePersist
  protected void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
    if (herramientas == null) {
      herramientas = new JsonArray();
    }
    if (skillsTecnicas == null) {
      skillsTecnicas = new JsonArray();
    }
    if (skillsBlandas == null) {
      skillsBlandas = new JsonArray();
    }
    if (roadmapPublicoHabilitado == null) {
      roadmapPublicoHabilitado = true;
    }
    createdAt = Instant.now();
    updatedAt = Instant.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = Instant.now();
  }

  public static Puesto findByIdOptional(UUID id) {
    return findById(id);
  }

  public static List<Puesto> findByOrganizacion(UUID organizacionId) {
    return list("organizacionId", organizacionId);
  }

  public static List<Puesto> findOpenByOrganizacion(UUID organizacionId) {
    return list("organizacionId = ?1 and estado = 'ABIERTO'", organizacionId);
  }
}
