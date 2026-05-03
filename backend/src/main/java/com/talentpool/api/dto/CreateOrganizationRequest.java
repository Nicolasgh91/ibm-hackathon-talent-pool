package com.talentpool.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for POST /api/v1/organizations (UC-004).
 *
 * @param nombre Organization display name
 * @param descripcion Optional free-text description for the UI
 * @param tipo EMPRESA or INSTITUCION; defaults to EMPRESA when omitted or blank
 */
public record CreateOrganizationRequest(
    @NotBlank(message = "Name is required")
        @Size(min = 3, max = 200, message = "Name must be between 3 and 200 characters")
        String nombre,
    @Size(max = 8000, message = "Description must not exceed 8000 characters") String descripcion,
    String tipo) {}
