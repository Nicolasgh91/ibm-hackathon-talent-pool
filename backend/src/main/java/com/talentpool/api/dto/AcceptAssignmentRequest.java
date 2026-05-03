package com.talentpool.api.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AcceptAssignmentRequest(@NotNull UUID asignacionId) {}
