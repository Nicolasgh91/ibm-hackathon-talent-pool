package com.talentpool.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

/**
 * Request DTO for creating a new job position (UC-006).
 *
 * <p>Used by POST /api/v1/positions endpoint.
 *
 * <p>Per product/DATABASE.md §3.3 the position profile must include at least one tool and three
 * technical skills. Soft skills are optional. List sizes are validated by the service layer because
 * Bean Validation cannot express "min 1 / min 3" on nullable JSON-like collections without
 * sacrificing nullability semantics for partial PATCH flows in later phases.
 */
public record CreatePuestoRequest(
    @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must not exceed 200 characters")
        String titulo,
    @NotBlank(message = "Main technology is required")
        @Size(max = 100, message = "Technology must not exceed 100 characters")
        String tecnologiaPrincipal,
    @NotBlank(message = "Seniority level is required")
        @Pattern(
            regexp = "TRAINEE|JR|SSR|SR|LEAD",
            message = "Seniority must be one of: TRAINEE, JR, SSR, SR, LEAD")
        String seniority,
    @Size(max = 5000, message = "Description must not exceed 5000 characters") String descripcion,
    List<String> herramientas,
    List<SkillTecnica> skillsTecnicas,
    List<String> skillsBlandas,
    Boolean roadmapPublicoHabilitado,
    UUID organizacionId) {

  /**
   * Structured technical skill entry.
   *
   * @param nombre canonical skill name (free text in v1)
   * @param nivel one of BASICO|INTERMEDIO|AVANZADO|EXPERTO
   */
  public record SkillTecnica(
      @NotBlank(message = "Skill name is required") String nombre,
      @NotBlank(message = "Skill level is required")
          @Pattern(
              regexp = "BASICO|INTERMEDIO|AVANZADO|EXPERTO",
              message = "Level must be BASICO|INTERMEDIO|AVANZADO|EXPERTO")
          String nivel) {}
}
