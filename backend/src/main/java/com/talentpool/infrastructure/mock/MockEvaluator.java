package com.talentpool.infrastructure.mock;

import io.quarkus.arc.profile.IfBuildProfile;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.jboss.logging.Logger;

/**
 * Mock code evaluator for demo purposes.
 *
 * <p>Simulates realistic LLM evaluation times (8-15s) and returns plausible scores based on simple
 * heuristics. The frontend must not know this is mocked.
 *
 * <p>Only active in dev profile.
 */
@ApplicationScoped
@IfBuildProfile("dev")
public class MockEvaluator {

  private static final Logger LOG = Logger.getLogger(MockEvaluator.class);
  private static final Random RANDOM = new Random();

  /**
   * Evaluates code and returns a realistic-looking result. Simulates 8-15 second processing time.
   */
  public EvaluationResult evaluate(String codigo, String lenguaje) {
    LOG.infof(
        "Evaluating code submission (language=%s, length=%d chars)", lenguaje, codigo.length());

    // Simulate realistic LLM evaluation latency (8-15 seconds)
    simulateLatency(8000, 7000);

    // Calculate "realistic" score based on simple heuristics
    int linesOfCode = codigo.split("\n").length;
    boolean hasComments = codigo.contains("//") || codigo.contains("/*") || codigo.contains("#");
    boolean hasTests =
        codigo.toLowerCase().contains("test")
            || codigo.toLowerCase().contains("assert")
            || codigo.toLowerCase().contains("expect");
    boolean hasErrorHandling =
        codigo.contains("try")
            || codigo.contains("catch")
            || codigo.contains("throw")
            || codigo.contains("except");
    boolean hasDocumentation =
        codigo.contains("/**") || codigo.contains("\"\"\"") || codigo.contains("///");

    // Base score: 60-80 (most candidates get something working)
    int basePuntaje = 60 + RANDOM.nextInt(20);

    // Bonuses for good practices
    int commentBonus = hasComments ? 5 : 0;
    int testBonus = hasTests ? 10 : 0;
    int errorHandlingBonus = hasErrorHandling ? 8 : 0;
    int docBonus = hasDocumentation ? 7 : 0;

    // Penalty for very short code (likely incomplete)
    int lengthPenalty = linesOfCode < 10 ? -15 : 0;

    // Bonus for reasonable length (shows effort)
    int lengthBonus = (linesOfCode >= 30 && linesOfCode <= 200) ? 5 : 0;

    int puntajeTotal =
        Math.max(
            0,
            Math.min(
                100,
                basePuntaje
                    + commentBonus
                    + testBonus
                    + errorHandlingBonus
                    + docBonus
                    + lengthPenalty
                    + lengthBonus));

    LOG.infof(
        "Evaluation complete: score=%d (base=%d, comments=%d, tests=%d, errors=%d, doc=%d, length=%d+%d)",
        puntajeTotal,
        basePuntaje,
        commentBonus,
        testBonus,
        errorHandlingBonus,
        docBonus,
        lengthPenalty,
        lengthBonus);

    return new EvaluationResult(
        BigDecimal.valueOf(puntajeTotal),
        buildDimensiones(puntajeTotal, hasTests, hasErrorHandling),
        buildFeedback(puntajeTotal, hasTests, hasErrorHandling, hasComments, linesOfCode),
        "v1.0.0-mock");
  }

  private void simulateLatency(int minMs, int rangeMs) {
    try {
      int delay = minMs + RANDOM.nextInt(rangeMs);
      LOG.debugf("Simulating evaluation latency: %dms", delay);
      Thread.sleep(delay);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      LOG.warn("Latency simulation interrupted", e);
    }
  }

  private List<Dimension> buildDimensiones(int total, boolean hasTests, boolean hasErrorHandling) {
    // Distribute the total score among dimensions with some variance
    List<Dimension> dimensiones = new ArrayList<>();

    dimensiones.add(
        new Dimension(
            "LOGICA",
            BigDecimal.valueOf(clamp(total + delta(-5, 10))),
            BigDecimal.valueOf(0.4),
            total >= 70
                ? "The solution correctly solves the main problem and handles most cases."
                : "The solution addresses the problem but may miss some edge cases."));

    dimensiones.add(
        new Dimension(
            "EFICIENCIA",
            BigDecimal.valueOf(clamp(total + delta(-10, 5))),
            BigDecimal.valueOf(0.3),
            total >= 75
                ? "The operations meet the expected time complexity requirements."
                : "The solution works but could be optimized for better performance."));

    dimensiones.add(
        new Dimension(
            "ESTILO",
            BigDecimal.valueOf(clamp(total + delta(-8, 8))),
            BigDecimal.valueOf(0.2),
            total >= 70
                ? "Clean, readable code with descriptive names and good structure."
                : "The code is understandable but could benefit from better naming and organization."));

    int practicasScore = total + delta(-15, 5);
    if (!hasErrorHandling) practicasScore -= 10;
    if (!hasTests) practicasScore -= 10;

    dimensiones.add(
        new Dimension(
            "PRACTICAS",
            BigDecimal.valueOf(clamp(practicasScore)),
            BigDecimal.valueOf(0.1),
            hasErrorHandling && hasTests
                ? "Good practices: includes error handling and test cases."
                : "Error handling and test coverage could be improved."));

    return dimensiones;
  }

  private String buildFeedback(
      int total, boolean hasTests, boolean hasErrorHandling, boolean hasComments, int linesOfCode) {
    List<String> fortalezas = new ArrayList<>();
    List<String> mejoras = new ArrayList<>();

    // Strengths
    if (total >= 80) {
      fortalezas.add("Correct and well-structured solution");
    } else if (total >= 70) {
      fortalezas.add("Functional solution that addresses the main requirements");
    }

    if (hasTests) {
      fortalezas.add("Includes test cases to verify behavior");
    }

    if (hasErrorHandling) {
      fortalezas.add("Considers error handling and edge cases");
    }

    if (hasComments) {
      fortalezas.add("Code is documented with helpful comments");
    }

    if (linesOfCode >= 30 && linesOfCode <= 150) {
      fortalezas.add("Appropriate solution length showing good judgment");
    }

    if (fortalezas.isEmpty()) {
      fortalezas.add("The general structure is understandable");
    }

    // Areas for improvement
    if (total < 80) {
      mejoras.add("Consider more edge cases in the implementation");
    }

    if (!hasTests) {
      mejoras.add("Adding unit tests would strengthen the solution and demonstrate thoroughness");
    }

    if (!hasErrorHandling) {
      mejoras.add("Explicit exception handling would improve robustness");
    }

    if (!hasComments && linesOfCode > 50) {
      mejoras.add("Adding comments for complex logic would improve maintainability");
    }

    if (linesOfCode < 20) {
      mejoras.add("The solution seems incomplete - consider addressing all requirements");
    }

    if (total < 70) {
      mejoras.add("Review the algorithm to ensure it handles all specified cases correctly");
    }

    // Build JSON feedback string
    StringBuilder feedback = new StringBuilder();
    feedback.append("{");
    feedback.append("\"resumen\":\"");
    if (total >= 85) {
      feedback.append("Excellent solution with strong technical quality and good practices.");
    } else if (total >= 75) {
      feedback.append("Solid solution with good technical quality.");
    } else if (total >= 65) {
      feedback.append("Functional solution with clear areas for improvement.");
    } else {
      feedback.append("The solution needs significant improvements to meet requirements.");
    }
    feedback.append("\",");

    feedback.append("\"puntosFuertes\":[");
    for (int i = 0; i < fortalezas.size(); i++) {
      feedback.append("\"").append(escapeJson(fortalezas.get(i))).append("\"");
      if (i < fortalezas.size() - 1) feedback.append(",");
    }
    feedback.append("],");

    feedback.append("\"puntosAMejorar\":[");
    for (int i = 0; i < mejoras.size(); i++) {
      feedback.append("\"").append(escapeJson(mejoras.get(i))).append("\"");
      if (i < mejoras.size() - 1) feedback.append(",");
    }
    feedback.append("]");
    feedback.append("}");

    return feedback.toString();
  }

  private String escapeJson(String str) {
    return str.replace("\"", "\\\"").replace("\n", "\\n");
  }

  private int clamp(int v) {
    return Math.max(0, Math.min(100, v));
  }

  private int delta(int min, int max) {
    return min + RANDOM.nextInt(max - min + 1);
  }

  public record EvaluationResult(
      BigDecimal puntaje,
      List<Dimension> dimensiones,
      String feedbackJson,
      String versionEvaluador) {}

  public record Dimension(
      String nombre, BigDecimal puntaje, BigDecimal peso, String justificacion) {}
}

// Made with Bob
