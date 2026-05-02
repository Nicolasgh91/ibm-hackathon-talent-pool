package com.talentpool.api.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for submitting code for evaluation.
 *
 * <p>Used by POST /api/v1/evaluations endpoint.
 */
public record SubmitEvaluationRequest(
    @JsonAlias("invitationToken")
    @NotBlank(message = "Invitation token is required")
    String token,

    @NotBlank(message = "Code submission is required")
    @Size(max = 50000, message = "Code must not exceed 50000 characters")
    String codigoEntregado,

    @NotBlank(message = "Programming language is required")
    @Size(max = 50, message = "Language must not exceed 50 characters")
    String lenguaje,

    @Min(value = 0, message = "Minutes employed cannot be negative")
    Integer minutosEmpleados
) {}

// Made with Bob