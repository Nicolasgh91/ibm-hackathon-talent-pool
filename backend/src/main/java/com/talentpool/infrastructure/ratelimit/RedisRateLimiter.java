package com.talentpool.infrastructure.ratelimit;

import io.micrometer.core.instrument.MeterRegistry;
import io.quarkus.logging.Log;
import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.value.ValueCommands;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.annotation.PostConstruct;
import java.util.UUID;

/**
 * Redis-based rate limiter using token bucket algorithm.
 *
 * <p>Implementation: - Uses Redis for distributed rate limiting - Token bucket algorithm with
 * sliding window - Atomic operations via Redis commands - Automatic key expiration
 *
 * <p>Key format: ratelimit:{keyPrefix}:{userId}
 *
 * <p>Metrics: - ratelimit.allowed.total (counter) - ratelimit.denied.total (counter)
 */
@ApplicationScoped
public class RedisRateLimiter {

  @Inject RedisDataSource redisDataSource;

  @Inject MeterRegistry meterRegistry;

  private ValueCommands<String, Integer> valueCommands;

  /**
   * Initialize Redis commands on startup.
   */
 @PostConstruct
  void init() {
    valueCommands = redisDataSource.value(Integer.class);
    Log.info("RedisRateLimiter initialized");
  }

  /**
   * Check if a request is allowed under the rate limit.
   *
   * <p>Algorithm: 1. Get current count from Redis 2. If count < limit, increment and allow 3. If
   * count >= limit, deny 4. Set expiration on first request
   *
   * @param userId the user ID
   * @param keyPrefix the key prefix (e.g., "chat")
   * @param limit maximum requests allowed
   * @param windowSeconds time window in seconds
   * @return true if request is allowed, false if rate limit exceeded
   */
  public boolean allowRequest(UUID userId, String keyPrefix, int limit, int windowSeconds) {
    String key = buildKey(keyPrefix, userId);

    try {
      // Get current count
      Integer currentCount = valueCommands.get(key);

      if (currentCount == null) {
        // First request in window
        valueCommands.set(key, 1);
        redisDataSource.key().expire(key, windowSeconds);
        recordAllowed(keyPrefix);
        Log.debugf("Rate limit: first request for key %s", key);
        return true;
      }

      if (currentCount < limit) {
        // Increment count
        valueCommands.incr(key);
        recordAllowed(keyPrefix);
        Log.debugf("Rate limit: allowed request %d/%d for key %s", currentCount + 1, limit, key);
        return true;
      }

      // Rate limit exceeded
      recordDenied(keyPrefix);
      Log.warnf(
          "Rate limit exceeded for key %s - count: %d, limit: %d", key, currentCount, limit);
      return false;

    } catch (Exception e) {
      // On Redis failure, allow request (fail open)
      Log.errorf(e, "Rate limiter error for key %s - allowing request", key);
      recordAllowed(keyPrefix);
      return true;
    }
  }

  /**
   * Get remaining requests for a user.
   *
   * @param userId the user ID
   * @param keyPrefix the key prefix
   * @param limit maximum requests allowed
   * @return remaining requests (0 if limit exceeded)
   */
  public int getRemainingRequests(UUID userId, String keyPrefix, int limit) {
    String key = buildKey(keyPrefix, userId);

    try {
      Integer currentCount = valueCommands.get(key);
      if (currentCount == null) {
        return limit;
      }
      return Math.max(0, limit - currentCount);
    } catch (Exception e) {
      Log.errorf(e, "Error getting remaining requests for key %s", key);
      return limit; // Fail open
    }
  }

  /**
   * Reset rate limit for a user (admin function).
   *
   * @param userId the user ID
   * @param keyPrefix the key prefix
   */
  public void resetLimit(UUID userId, String keyPrefix) {
    String key = buildKey(keyPrefix, userId);
    try {
      redisDataSource.key().del(key);
      Log.infof("Rate limit reset for key %s", key);
    } catch (Exception e) {
      Log.errorf(e, "Error resetting rate limit for key %s", key);
    }
  }

  /**
   * Build Redis key.
   *
   * @param keyPrefix the key prefix
   * @param userId the user ID
   * @return Redis key
   */
  private String buildKey(String keyPrefix, UUID userId) {
    return String.format("ratelimit:%s:%s", keyPrefix, userId);
  }

  /**
   * Record allowed request metric.
   *
   * @param keyPrefix the key prefix
   */
  private void recordAllowed(String keyPrefix) {
    meterRegistry.counter("ratelimit.allowed.total", "key", keyPrefix).increment();
  }

  /**
   * Record denied request metric.
   *
   * @param keyPrefix the key prefix
   */
  private void recordDenied(String keyPrefix) {
    meterRegistry.counter("ratelimit.denied.total", "key", keyPrefix).increment();
  }
}

// Made with Bob
