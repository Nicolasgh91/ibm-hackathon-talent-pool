package com.talentpool.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

/**
 * Request DTO for generating a technical challenge.
 *
 * <p>Used by POST /api/v1/challenges endpoint.
 */
public record GenerateChallengeRequest(
    @NotNull(message = "Position ID is required") UUID puestoId,
    @Min(value = 15, message = "Estimated time must be at least 15 minutes")
        Integer minutosEstimados, // Optional, default 60
    @Size(max = 1000, message = "Additional context must not exceed 1000 characters")
        String contextoAdicional // Optional hints for LLM
    ) {}

// Made with Bob
