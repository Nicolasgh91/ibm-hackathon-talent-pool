package com.talentpool.infrastructure.security;

import io.micrometer.core.instrument.MeterRegistry;
import io.quarkus.logging.Log;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import java.util.List;
import java.util.regex.Pattern;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Input guardrail service for validating and sanitizing user input.
 *
 * <p>Protects against: - Prompt injection attacks - SQL injection attempts - XSS attacks -
 * Excessive input length - Malicious patterns
 *
 * <p>Metrics: - guardrail.violations.total (counter) - guardrail.checks.total (counter)
 */
@ApplicationScoped
public class InputGuardrailService {

  @Inject MeterRegistry meterRegistry;

  @ConfigProperty(name = "app.chat.max-message-length", defaultValue = "2000")
  int maxMessageLength;

  @ConfigProperty(name = "app.chat.guardrails.enabled", defaultValue = "true")
  boolean guardrailsEnabled;

  @ConfigProperty(name = "app.chat.guardrails.patterns")
  List<String> dangerousPatterns;

  // Compiled patterns for performance
  private List<Pattern> compiledPatterns;

  /**
   * Initialize compiled patterns on startup.
   *
   * <p>Patterns are compiled once for better performance during validation.
   */
  @PostConstruct
  void init() {
    if (dangerousPatterns != null && !dangerousPatterns.isEmpty()) {
      compiledPatterns =
          dangerousPatterns.stream()
              .map(p -> Pattern.compile(p, Pattern.CASE_INSENSITIVE))
              .toList();
      Log.infof("Initialized %d guardrail patterns", compiledPatterns.size());
    } else {
      compiledPatterns = List.of();
      Log.warn("No guardrail patterns configured");
    }
  }

  /**
   * Validate user input against guardrails.
   *
   * <p>Checks: 1. Length validation (max 2000 chars) 2. Prompt injection patterns 3. SQL injection
   * patterns 4. XSS patterns
   *
   * @param input the user input to validate
   * @throws BadRequestException if input violates guardrails
   */
  public void validate(String input) {
    if (!guardrailsEnabled) {
      return;
    }

    meterRegistry.counter("guardrail.checks.total").increment();

    // Check length
    if (input == null || input.isBlank()) {
      recordViolation("empty_input");
      throw new BadRequestException("Input cannot be empty");
    }

    if (input.length() > maxMessageLength) {
      recordViolation("length_exceeded");
      throw new BadRequestException(
          String.format(
              "Input exceeds maximum length of %d characters (got %d)",
              maxMessageLength, input.length()));
    }

    // Check for dangerous patterns
    for (Pattern pattern : compiledPatterns) {
      if (pattern.matcher(input).find()) {
        String patternStr = pattern.pattern();
        recordViolation("pattern_match");
        Log.warnf(
            "Guardrail violation detected - pattern: %s, input length: %d",
            patternStr, input.length());
        throw new BadRequestException(
            "Input contains potentially malicious content. Please rephrase your message.");
      }
    }

    // Additional checks for common attack vectors
    checkSqlInjection(input);
    checkXss(input);
  }

  /**
   * Check for SQL injection patterns.
   *
   * @param input the input to check
   */
  private void checkSqlInjection(String input) {
    String lowerInput = input.toLowerCase();

    // Check for SQL keywords in suspicious contexts
    if (lowerInput.matches(
        ".*\\b(union|select|insert|update|delete|drop|create|alter)\\s+(all|from|into|table|database)\\b.*")) {
      recordViolation("sql_injection");
      Log.warnf("SQL injection attempt detected - input length: %d", input.length());
      throw new BadRequestException("Input contains potentially malicious SQL patterns");
    }
  }

  /**
   * Check for XSS patterns.
   *
   * @param input the input to check
   */
  private void checkXss(String input) {
    String lowerInput = input.toLowerCase();

    // Check for script tags and event handlers
    if (lowerInput.contains("<script")
        || lowerInput.contains("javascript:")
        || lowerInput.contains("onerror=")
        || lowerInput.contains("onload=")) {
      recordViolation("xss_attempt");
      Log.warnf("XSS attempt detected - input length: %d", input.length());
      throw new BadRequestException("Input contains potentially malicious script content");
    }
  }

  /**
   * Record a guardrail violation metric.
   *
   * @param violationType the type of violation
   */
  private void recordViolation(String violationType) {
    meterRegistry.counter("guardrail.violations.total", "type", violationType).increment();
  }

  /**
   * Sanitize input by removing potentially dangerous characters.
   *
   * <p>This is a defensive measure in addition to validation. Use with caution as it may alter
   * legitimate input.
   *
   * @param input the input to sanitize
   * @return sanitized input
   */
  public String sanitize(String input) {
    if (input == null) {
      return null;
    }

    // Remove null bytes
    String sanitized = input.replace("\0", "");

    // Trim whitespace
    sanitized = sanitized.trim();

    return sanitized;
  }
}

// Made with Bob
