package com.talentpool.infrastructure.ratelimit;

import jakarta.interceptor.InterceptorBinding;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods that should be rate limited.
 *
 * <p>Usage:
 *
 * <pre>
 * &#64;RateLimited(limit = 10, windowSeconds = 60)
 * public Response chat(ChatRequest request) { ... }
 * </pre>
 *
 * <p>The rate limiter uses Redis to track request counts per user within a sliding window.
 */
@InterceptorBinding
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface RateLimited {

  /**
   * Maximum number of requests allowed within the time window.
   *
   * @return request limit
   */
  int limit() default 10;

  /**
   * Time window in seconds.
   *
   * @return window duration in seconds
   */
  int windowSeconds() default 60;

  /**
   * Custom key prefix for Redis. If not specified, uses the method name.
   *
   * @return key prefix
   */
  String keyPrefix() default "";
}

// Made with Bob
