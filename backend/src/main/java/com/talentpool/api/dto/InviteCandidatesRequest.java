package com.talentpool.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import java.time.Instant;
import java.util.List;

/**
 * Request DTO for inviting candidates to a challenge.
 *
 * <p>Used by POST /api/v1/challenges/{id}/invitations endpoint.
 */
public record InviteCandidatesRequest(
    @NotEmpty(message = "At least one email is required")
        List<@Email(message = "Invalid email format") String> emails,
    Instant fechaApertura, // Optional, default now
    Instant fechaCierre, // Optional, default +7 days
    Instant expiraEn, // Backward-compatible alias for fechaCierre
    @Min(value = 1, message = "Max attempts must be at least 1")
        Integer maxIntentos // Optional, default 1
    ) {}

// Made with Bob
