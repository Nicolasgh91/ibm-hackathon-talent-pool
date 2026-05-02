package com.talentpool.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Chat request DTO.
 *
 * <p>Represents a user message to the LLM assistant.
 *
 * <p>Validation: - message: required, max 2000 characters - conversationId: optional, max 100
 * characters
 */
public record ChatRequest(
    @NotBlank(message = "Message cannot be blank")
        @Size(max = 2000, message = "Message cannot exceed 2000 characters")
        String message,
    @Size(max = 100, message = "Conversation ID cannot exceed 100 characters")
        String conversationId) {

  /**
   * Create a chat request with only a message.
   *
   * @param message the user message
   * @return chat request
   */
  public static ChatRequest of(String message) {
    return new ChatRequest(message, null);
  }

  /**
   * Create a chat request with message and conversation ID.
   *
   * @param message the user message
   * @param conversationId the conversation ID for context
   * @return chat request
   */
  public static ChatRequest of(String message, String conversationId) {
    return new ChatRequest(message, conversationId);
  }
}

// Made with Bob
