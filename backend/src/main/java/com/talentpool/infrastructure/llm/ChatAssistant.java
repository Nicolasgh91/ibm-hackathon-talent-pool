package com.talentpool.infrastructure.llm;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import io.quarkiverse.langchain4j.RegisterAiService;

/**
 * LangChain4j AI Service for chat functionality.
 *
 * <p>This interface is automatically implemented by Quarkus LangChain4j extension. It provides a
 * type-safe way to interact with the configured LLM (OpenAI when integration is enabled).
 *
 * <p>The system message defines the assistant's behavior and personality. The user message template
 * allows for dynamic message injection.
 */
@RegisterAiService
public interface ChatAssistant {

  /**
   * Send a chat message to the LLM assistant.
   *
   * <p>System Message: Defines the assistant as a helpful technical expert for the Talent Pool
   * platform, focused on providing clear, accurate, and professional responses.
   *
   * <p>User Message: The actual user input, injected via the @V annotation.
   *
   * @param message the user's message
   * @return the assistant's response
   */
  @SystemMessage(
      """
      You are a helpful technical assistant for Talent Pool, an AI-powered platform that bridges
      technical education and employment through automated challenge generation and evaluation.

      Your role is to:
      - Provide clear, accurate, and professional technical guidance
      - Help users understand programming concepts and best practices
      - Assist with code review and problem-solving
      - Maintain a friendly but professional tone
      - Keep responses concise and actionable (aim for 2-3 paragraphs unless more detail is needed)

      Guidelines:
      - If asked about non-technical topics, politely redirect to technical assistance
      - If you don't know something, admit it rather than guessing
      - Use code examples when helpful, with proper formatting
      - Prioritize practical, real-world advice over theoretical discussions
      """)
  @UserMessage("{{message}}")
  String chat(@V("message") String message);

  /**
   * Send a chat message with conversation context.
   *
   * <p>This overload allows maintaining conversation history by including the conversation ID.
   * Future enhancement: implement actual conversation memory.
   *
   * @param message the user's message
   * @param conversationId the conversation ID for context
   * @return the assistant's response
   */
  @SystemMessage(
      """
      You are a helpful technical assistant for Talent Pool, an AI-powered platform that bridges
      technical education and employment through automated challenge generation and evaluation.

      Your role is to:
      - Provide clear, accurate, and professional technical guidance
      - Help users understand programming concepts and best practices
      - Assist with code review and problem-solving
      - Maintain a friendly but professional tone
      - Keep responses concise and actionable (aim for 2-3 paragraphs unless more detail is needed)

      Guidelines:
      - If asked about non-technical topics, politely redirect to technical assistance
      - If you don't know something, admit it rather than guessing
      - Use code examples when helpful, with proper formatting
      - Prioritize practical, real-world advice over theoretical discussions

      Conversation ID: {{conversationId}}
      """)
  @UserMessage("{{message}}")
  String chat(@V("message") String message, @V("conversationId") String conversationId);
}

// Made with Bob
