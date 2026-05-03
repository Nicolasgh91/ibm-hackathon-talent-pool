package com.talentpool.api.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

/** Partial update for a job position (PATCH-style via PUT). */
public record UpdatePuestoRequest(
    @Size(max = 200, message = "Title must not exceed 200 characters") String titulo,
    @Size(max = 5000, message = "Description must not exceed 5000 characters") String descripcion,
    @Pattern(
            regexp = "TRAINEE|JR|SSR|SR|LEAD",
            message = "Seniority must be one of: TRAINEE, JR, SSR, SR, LEAD")
        String seniority,
    @Size(max = 100, message = "Technology must not exceed 100 characters") String tecnologiaPrincipal,
    List<String> herramientas,
    List<CreatePuestoRequest.SkillTecnica> skillsTecnicas,
    List<String> skillsBlandas,
    Boolean roadmapPublicoHabilitado) {}
