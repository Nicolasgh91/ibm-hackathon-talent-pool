package com.talentpool.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

/** Maps the SPA invite payload to {@link InviteCandidatesRequest}. */
public record InviteSingleCandidateRequest(
    @NotNull UUID desafioId,
    @NotNull @Email String candidatoEmail,
    Instant fechaLimite) {}
