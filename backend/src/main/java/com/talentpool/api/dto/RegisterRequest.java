package com.talentpool.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for user registration (UC-001).
 *
 * @param email User's email address (unique, case-insensitive)
 * @param nombreCompleto User's full name
 * @param password Plain text password (will be hashed with Argon2id)
 */
public record RegisterRequest(
    @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        @Size(max = 255, message = "Email must not exceed 255 characters")
        String email,
    @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 200, message = "Full name must be between 2 and 200 characters")
        String nombreCompleto,
    @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        String password) {}

// Made with Bob
