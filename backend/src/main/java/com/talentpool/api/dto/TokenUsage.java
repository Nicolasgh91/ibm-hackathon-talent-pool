package com.talentpool.api.dto;

/**
 * Token usage metrics for LLM calls.
 *
 * <p>Tracks: - inputTokens: tokens in the user's message - outputTokens: tokens in the assistant's
 * response - estimatedCost: estimated cost in USD based on token pricing
 */
public record TokenUsage(int inputTokens, int outputTokens, double estimatedCost) {

  /**
   * Calculate total tokens.
   *
   * @return total tokens (input + output)
   */
  public int totalTokens() {
    return inputTokens + outputTokens;
  }

  /**
   * Create token usage from token counts.
   *
   * @param inputTokens input token count
   * @param outputTokens output token count
   * @param inputCostPer1k cost per 1000 input tokens
   * @param outputCostPer1k cost per 1000 output tokens
   * @return token usage with calculated cost
   */
  public static TokenUsage of(
      int inputTokens, int outputTokens, double inputCostPer1k, double outputCostPer1k) {
    double cost =
        (inputTokens / 1000.0 * inputCostPer1k) + (outputTokens / 1000.0 * outputCostPer1k);
    return new TokenUsage(inputTokens, outputTokens, cost);
  }

  /**
   * Create token usage without cost calculation (for testing or free models).
   *
   * @param inputTokens input token count
   * @param outputTokens output token count
   * @return token usage with zero cost
   */
  public static TokenUsage of(int inputTokens, int outputTokens) {
    return new TokenUsage(inputTokens, outputTokens, 0.0);
  }
}

// Made with Bob
