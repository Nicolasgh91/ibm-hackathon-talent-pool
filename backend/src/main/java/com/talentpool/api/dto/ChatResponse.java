package com.talentpool.api.dto;

import java.time.Instant;

/**
 * Chat response DTO.
 *
 * <p>Represents the LLM assistant's response to a user message.
 *
 * <p>Includes: - message: the assistant's response - conversationId: for maintaining context -
 * tokenUsage: token consumption and cost metrics - timestamp: when the response was generated
 */
public record ChatResponse(
    String message, String conversationId, TokenUsage tokenUsage, Instant timestamp) {

  /**
   * Create a chat response.
   *
   * @param message the assistant's response
   * @param conversationId the conversation ID
   * @param tokenUsage token usage metrics
   * @return chat response
   */
  public static ChatResponse of(String message, String conversationId, TokenUsage tokenUsage) {
    return new ChatResponse(message, conversationId, tokenUsage, Instant.now());
  }

  /**
   * Create a chat response without token usage (for testing).
   *
   * @param message the assistant's response
   * @param conversationId the conversation ID
   * @return chat response
   */
  public static ChatResponse of(String message, String conversationId) {
    return new ChatResponse(message, conversationId, null, Instant.now());
  }
}

// Made with Bob
