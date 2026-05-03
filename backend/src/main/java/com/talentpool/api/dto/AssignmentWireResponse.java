package com.talentpool.api.dto;

import java.time.Instant;
import java.util.UUID;

/** JSON shape close to the SPA {@code ChallengeAssignment} for assignments endpoints. */
public record AssignmentWireResponse(
    UUID id,
    UUID desafioId,
    UUID candidatoId,
    String estado,
    Instant fechaInvitacion,
    Instant fechaAceptacion,
    Instant fechaLimite,
    Instant createdAt,
    Instant updatedAt,
    DesafioResponse desafio) {}
