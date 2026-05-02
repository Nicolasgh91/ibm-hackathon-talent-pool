package com.talentpool.service;

import com.talentpool.api.dto.ChatRequest;
import com.talentpool.api.dto.ChatResponse;
import com.talentpool.api.dto.TokenUsage;
import com.talentpool.infrastructure.llm.ChatAssistant;
import com.talentpool.infrastructure.security.InputGuardrailService;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.UUID;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.MDC;

/**
 * Chat service implementing LLM-based conversation.
 *
 * <p>Responsibilities: - Orchestrate LLM calls via ChatAssistant - Track metrics (latency, tokens,
 * cost) - Manage correlation IDs for request tracing - Estimate token usage and costs
 *
 * <p>Observability: - Structured logging with correlation IDs - Micrometer metrics for latency and
 * token usage - OpenTelemetry traces (automatic via Quarkus)
 */
@ApplicationScoped
public class ChatService {

  @Inject ChatAssistant chatAssistant;

  @Inject MeterRegistry meterRegistry;

  @Inject InputGuardrailService guardrailService;

  @ConfigProperty(name = "app.llm.cost-per-1k-tokens.input", defaultValue = "0.00015")
  double inputCostPer1k;

  @ConfigProperty(name = "app.llm.cost-per-1k-tokens.output", defaultValue = "0.0006")
  double outputCostPer1k;

  @ConfigProperty(name = "app.llm.provider", defaultValue = "ollama")
  String llmProvider;

  /**
   * Send a chat message to the LLM assistant.
   *
   * <p>This method: 1. Generates or uses provided conversation ID 2. Sets up correlation ID for
   * tracing 3. Calls the LLM via ChatAssistant 4. Tracks metrics (latency, tokens, cost) 5.
   * Returns structured response
   *
   * @param request the chat request
   * @param userId the authenticated user ID
   * @return chat response with token usage
   */
  public ChatResponse chat(ChatRequest request, UUID userId) {
    // Generate conversation ID if not provided
    String conversationId =
        request.conversationId() != null
            ? request.conversationId()
            : UUID.randomUUID().toString();

    // Set up correlation ID for distributed tracing
    String correlationId = UUID.randomUUID().toString();
    MDC.put("correlationId", correlationId);
    MDC.put("userId", userId.toString());
    MDC.put("conversationId", conversationId);

    Log.infof(
        "Processing chat request - correlationId: %s, userId: %s, conversationId: %s, messageLength: %d",
        correlationId, userId, conversationId, request.message().length());

    try {
      // Validate input with guardrails
      guardrailService.validate(request.message());

      // Start timer for latency tracking
      Timer.Sample sample = Timer.start(meterRegistry);

      // Call LLM
      String response;
      if (request.conversationId() != null) {
        response = chatAssistant.chat(request.message(), conversationId);
      } else {
        response = chatAssistant.chat(request.message());
      }

      // Stop timer and record latency
      sample.stop(
          Timer.builder("chat.latency")
              .description("Chat request latency")
              .tag("provider", llmProvider)
              .register(meterRegistry));

      // Estimate token usage (rough approximation: 1 token ≈ 4 characters)
      int inputTokens = estimateTokens(request.message());
      int outputTokens = estimateTokens(response);

      // Calculate cost (free for Ollama)
      double cost = 0.0;
      if ("openai".equalsIgnoreCase(llmProvider)) {
        cost =
            (inputTokens / 1000.0 * inputCostPer1k) + (outputTokens / 1000.0 * outputCostPer1k);
      }

      // Persist audit record in DB
      LlamadaLlm llamada = LlamadaLlm.builder()
          .promptVersionId(promptVersion.id())
          .proveedor(llmProvider)
          .modelo(modelo)
          .tokensIn(inputTokens)
          .tokensOut(outputTokens)
          .costoUsd(cost)
          .latenciaMs(latencyMs)
          .estado("OK")
          .requestId(MDC.get("request_id"))
          .build();

      llamadaLlmRepository.persist(llamada);

      TokenUsage tokenUsage = new TokenUsage(inputTokens, outputTokens, cost);

      // Record metrics
      meterRegistry
          .counter("chat.requests.total", "provider", llmProvider, "status", "success")
          .increment();
      meterRegistry
          .counter("chat.tokens.input", "provider", llmProvider)
          .increment(inputTokens);
      meterRegistry
          .counter("chat.tokens.output", "provider", llmProvider)
          .increment(outputTokens);
      if (cost > 0) {
        meterRegistry.counter("chat.cost.usd", "provider", llmProvider).increment(cost);
      }

      Log.infof(
          "Chat request completed - correlationId: %s, inputTokens: %d, outputTokens: %d, cost: $%.6f",
          correlationId, inputTokens, outputTokens, cost);

      return ChatResponse.of(response, conversationId, tokenUsage);

    } catch (Exception e) {
      // Record error metric
      meterRegistry
          .counter("chat.requests.total", "provider", llmProvider, "status", "error")
          .increment();

      Log.errorf(
          e,
          "Chat request failed - correlationId: %s, userId: %s, error: %s",
          correlationId,
          userId,
          e.getMessage());
      throw new RuntimeException("Failed to process chat request", e);

    } finally {
      // Clean up MDC
      MDC.remove("correlationId");
      MDC.remove("userId");
      MDC.remove("conversationId");
    }
  }

  /**
   * Estimate token count from text.
   *
   * <p>Rough approximation: 1 token ≈ 4 characters This is a simplified estimation. For production,
   * consider using a proper tokenizer library.
   *
   * @param text the text to estimate
   * @return estimated token count
   */
  private int estimateTokens(String text) {
    if (text == null || text.isEmpty()) {
      return 0;
    }
    // Rough approximation: 1 token ≈ 4 characters
    // This is conservative; actual tokenization may vary
    return (int) Math.ceil(text.length() / 4.0);
  }
}

// Made with Bob
