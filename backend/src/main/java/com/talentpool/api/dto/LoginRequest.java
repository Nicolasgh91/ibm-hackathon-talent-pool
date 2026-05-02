package com.talentpool.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for user login (UC-002).
 *
 * @param email User's email address
 * @param password User's password
 */
public record LoginRequest(
    @NotBlank(message = "Email is required") @Email(message = "Email must be valid") String email,
    @NotBlank(message = "Password is required") String password) {}

// Made with Bob
