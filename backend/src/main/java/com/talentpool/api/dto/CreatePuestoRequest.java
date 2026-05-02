package com.talentpool.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

/**
 * Request DTO for creating a new job position.
 *
 * <p>Used by POST /api/v1/positions endpoint.
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
        message = "Seniority must be one of: TRAINEE, JR, SSR, SR, LEAD"
    )
    String seniority,

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    String descripcion,

    UUID organizacionId // Optional, defaults to user's organization
) {}

// Made with Bob