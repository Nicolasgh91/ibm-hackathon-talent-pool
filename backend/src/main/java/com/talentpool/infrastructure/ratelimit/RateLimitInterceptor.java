package com.talentpool.infrastructure.ratelimit;

import io.quarkus.logging.Log;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import java.util.UUID;

/**
 * Interceptor for rate limiting annotated methods.
 *
 * <p>Intercepts methods annotated with @RateLimited and enforces rate limits using Redis.
 *
 * <p>Behavior: - Extracts user ID from SecurityContext - Checks rate limit via RedisRateLimiter -
 * Allows request if under limit - Returns 429 Too Many Requests if limit exceeded
 *
 * <p>Priority: 2000 (runs after security interceptors)
 */
@RateLimited
@Interceptor
@Priority(2000)
public class RateLimitInterceptor {

  @Inject RedisRateLimiter rateLimiter;

  /**
   * Intercept method invocation and enforce rate limit.
   *
   * @param context the invocation context
   * @return the method result
   * @throws Exception if rate limit exceeded or method execution fails
   */
  @AroundInvoke
  public Object enforceRateLimit(InvocationContext context) throws Exception {
    RateLimited annotation = context.getMethod().getAnnotation(RateLimited.class);
    if (annotation == null) {
      annotation = context.getTarget().getClass().getAnnotation(RateLimited.class);
    }

    if (annotation == null) {
      // No annotation found, proceed without rate limiting
      return context.proceed();
    }

    // Extract user ID from SecurityContext
    UUID userId = extractUserId(context);
    if (userId == null) {
      // No user ID found (unauthenticated request), proceed without rate limiting
      Log.warn("Rate limit check skipped - no user ID found in SecurityContext");
      return context.proceed();
    }

    // Determine key prefix
    String keyPrefix =
        annotation.keyPrefix().isEmpty()
            ? context.getMethod().getName()
            : annotation.keyPrefix();

    // Check rate limit
    boolean allowed =
        rateLimiter.allowRequest(userId, keyPrefix, annotation.limit(), annotation.windowSeconds());

    if (!allowed) {
      int remaining = rateLimiter.getRemainingRequests(userId, keyPrefix, annotation.limit());
      Log.warnf(
          "Rate limit exceeded for user %s on %s - limit: %d, window: %ds",
          userId, keyPrefix, annotation.limit(), annotation.windowSeconds());

      throw new ClientErrorException(
          Response.status(Response.Status.TOO_MANY_REQUESTS)
              .entity(
                  java.util.Map.of(
                      "error",
                      "Rate limit exceeded",
                      "message",
                      String.format(
                          "Too many requests. Limit: %d requests per %d seconds. Try again later.",
                          annotation.limit(), annotation.windowSeconds()),
                      "limit",
                      annotation.limit(),
                      "window",
                      annotation.windowSeconds(),
                      "remaining",
                      remaining))
              .build());
    }

    // Proceed with method execution
    return context.proceed();
  }

  /**
   * Extract user ID from invocation context.
   *
   * <p>Looks for SecurityContext in method parameters.
   *
   * @param context the invocation context
   * @return user ID or null if not found
   */
  private UUID extractUserId(InvocationContext context) {
    Object[] parameters = context.getParameters();
    for (Object param : parameters) {
      if (param instanceof SecurityContext securityContext) {
        try {
          String subject = securityContext.getUserPrincipal().getName();
          return UUID.fromString(subject);
        } catch (Exception e) {
          Log.errorf(e, "Failed to extract user ID from SecurityContext");
          return null;
        }
      }
    }
    return null;
  }
}

// Made with Bob
