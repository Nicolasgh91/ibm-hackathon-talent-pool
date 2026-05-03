package com.talentpool.infrastructure.mock;

import io.quarkus.arc.profile.IfBuildProfile;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Map;
import java.util.Random;
import org.jboss.logging.Logger;

/**
 * Mock challenge generator for demo purposes.
 *
 * <p>Simulates realistic LLM response times (3-8s) and returns pre-built challenges based on
 * technology. The frontend must not know these are mocked.
 *
 * <p>Only active in dev profile.
 */
@ApplicationScoped
@IfBuildProfile("dev")
public class MockChallengeGenerator {

  private static final Logger LOG = Logger.getLogger(MockChallengeGenerator.class);
  private static final Random RANDOM = new Random();

  private static final Map<String, ChallengeTemplate> TEMPLATES =
      Map.of(
          "Java",
              new ChallengeTemplate(
                  "Implement a Thread-Safe LRU Cache",
                  """
          ## Challenge: Thread-Safe LRU Cache

          Implement an `LRUCache<K, V>` class that:

          1. Supports `get(key)` and `put(key, value)` operations in O(1) time complexity
          2. Has a fixed maximum capacity defined in the constructor
          3. When the cache is full, evicts the least recently used element
          4. Is thread-safe for concurrent access from multiple threads

          ### Constraints

          - Do not use `Collections.synchronizedMap` or `ConcurrentHashMap` directly as the complete solution
          - Think carefully about lock granularity to maximize concurrency
          - Correctly handle the edge case of capacity = 0
          - Your implementation should be production-ready

          ### What we evaluate

          - **Algorithm correctness**: Does it implement LRU eviction correctly?
          - **Concurrency handling**: Is it truly thread-safe? Are there race conditions?
          - **Code quality**: Clean, readable code with descriptive names
          - **Edge cases**: How does it handle null keys, capacity 0, concurrent access?

          ### Example Usage

          ```java
          LRUCache<String, Integer> cache = new LRUCache<>(2);
          cache.put("a", 1);
          cache.put("b", 2);
          cache.get("a");        // returns 1
          cache.put("c", 3);     // evicts key "b"
          cache.get("b");        // returns null
          ```

          Good luck!
          """,
                  buildJavaRubric()),
          "Python",
              new ChallengeTemplate(
                  "Time Series Anomaly Detector",
                  """
          ## Challenge: Time Series Anomaly Detector

          Implement a function `detect_anomalies(data, threshold=2.0)` that:

          1. Takes a list of numeric time series data points
          2. Detects anomalies using statistical methods (z-score or similar)
          3. Returns indices of anomalous points
          4. Handles edge cases gracefully

          ### Requirements

          - Use statistical methods (mean, standard deviation)
          - Threshold parameter controls sensitivity (default 2.0 std deviations)
          - Handle empty lists, single values, and constant sequences
          - Efficient implementation for large datasets

          ### What we evaluate

          - **Algorithm choice**: Appropriate statistical method
          - **Edge case handling**: Empty data, constants, NaN values
          - **Code quality**: Pythonic, readable, well-documented
          - **Efficiency**: Handles large datasets efficiently

          ### Example

          ```python
          data = [10, 12, 11, 13, 12, 100, 11, 12]
          anomalies = detect_anomalies(data, threshold=2.0)
          # Should return [5] (index of value 100)
          ```
          """,
                  buildPythonRubric()),
          "JavaScript",
              new ChallengeTemplate(
                  "Implement Promise.allSettled from Scratch",
                  """
          ## Challenge: Promise.allSettled Implementation

          Implement a function `promiseAllSettled(promises)` that:

          1. Takes an array of promises
          2. Waits for all promises to settle (fulfilled or rejected)
          3. Returns a promise that resolves with an array of result objects
          4. Each result object has `status` and either `value` or `reason`

          ### Requirements

          - Do NOT use the built-in `Promise.allSettled`
          - Handle both fulfilled and rejected promises
          - Maintain the order of results matching input order
          - Handle empty arrays and non-promise values

          ### What we evaluate

          - **Promise understanding**: Correct async handling
          - **Edge cases**: Empty arrays, non-promises, mixed results
          - **Code quality**: Clean, modern JavaScript
          - **Error handling**: Proper rejection handling

          ### Example

          ```javascript
          const promises = [
            Promise.resolve(1),
            Promise.reject('error'),
            Promise.resolve(3)
          ];

          promiseAllSettled(promises).then(results => {
            // results = [
            //   { status: 'fulfilled', value: 1 },
            //   { status: 'rejected', reason: 'error' },
            //   { status: 'fulfilled', value: 3 }
            // ]
          });
          ```
          """,
                  buildJavaScriptRubric()));

  /**
   * Generates a challenge for the given technology and seniority. Simulates realistic LLM latency
   * (3-8 seconds).
   */
  public ChallengeContent generate(String tecnologia, String seniority) {
    LOG.infof("Generating mock challenge for technology=%s, seniority=%s", tecnologia, seniority);

    // Simulate realistic LLM latency (3-8 seconds)
    simulateLatency(3000, 5000);

    ChallengeTemplate template = TEMPLATES.getOrDefault(tecnologia, TEMPLATES.get("Java"));

    LOG.infof("Generated challenge: %s", template.titulo);
    return new ChallengeContent(template.titulo, template.enunciado, template.rubrica);
  }

  private void simulateLatency(int minMs, int rangeMs) {
    try {
      int delay = minMs + RANDOM.nextInt(rangeMs);
      LOG.debugf("Simulating LLM latency: %dms", delay);
      Thread.sleep(delay);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      LOG.warn("Latency simulation interrupted", e);
    }
  }

  private static JsonObject buildJavaRubric() {
    return new JsonObject()
        .put("version_rubrica", "1.0")
        .put(
            "dimensiones",
            new JsonArray()
                .add(
                    new JsonObject()
                        .put("nombre", "LOGICA")
                        .put("peso", 0.4)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Implements LRU eviction correctly")
                                .add("Handles edge cases (capacity 0, null keys)")
                                .add("O(1) time complexity for get/put")))
                .add(
                    new JsonObject()
                        .put("nombre", "EFICIENCIA")
                        .put("peso", 0.3)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Optimal data structures (HashMap + LinkedList)")
                                .add("No unnecessary iterations")
                                .add("Memory efficient")))
                .add(
                    new JsonObject()
                        .put("nombre", "ESTILO")
                        .put("peso", 0.2)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Clean, readable code")
                                .add("Descriptive variable names")
                                .add("Proper encapsulation")))
                .add(
                    new JsonObject()
                        .put("nombre", "PRACTICAS")
                        .put("peso", 0.1)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Thread-safety correctly implemented")
                                .add("Proper synchronization")
                                .add("No race conditions"))))
        .put("puntaje_maximo", 100);
  }

  private static JsonObject buildPythonRubric() {
    return new JsonObject()
        .put("version_rubrica", "1.0")
        .put(
            "dimensiones",
            new JsonArray()
                .add(
                    new JsonObject()
                        .put("nombre", "LOGICA")
                        .put("peso", 0.4)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Correct statistical method")
                                .add("Proper threshold application")
                                .add("Returns correct indices")))
                .add(
                    new JsonObject()
                        .put("nombre", "EFICIENCIA")
                        .put("peso", 0.3)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Efficient for large datasets")
                                .add("Single pass when possible")
                                .add("Appropriate data structures")))
                .add(
                    new JsonObject()
                        .put("nombre", "ESTILO")
                        .put("peso", 0.2)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Pythonic code")
                                .add("Clear variable names")
                                .add("Good documentation")))
                .add(
                    new JsonObject()
                        .put("nombre", "PRACTICAS")
                        .put("peso", 0.1)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Handles edge cases")
                                .add("Input validation")
                                .add("Error handling"))))
        .put("puntaje_maximo", 100);
  }

  private static JsonObject buildJavaScriptRubric() {
    return new JsonObject()
        .put("version_rubrica", "1.0")
        .put(
            "dimensiones",
            new JsonArray()
                .add(
                    new JsonObject()
                        .put("nombre", "LOGICA")
                        .put("peso", 0.4)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Correct promise handling")
                                .add("Maintains result order")
                                .add("Handles both fulfilled and rejected")))
                .add(
                    new JsonObject()
                        .put("nombre", "EFICIENCIA")
                        .put("peso", 0.3)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Parallel execution")
                                .add("No unnecessary awaits")
                                .add("Efficient result collection")))
                .add(
                    new JsonObject()
                        .put("nombre", "ESTILO")
                        .put("peso", 0.2)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Modern JavaScript syntax")
                                .add("Clear and concise")
                                .add("Good naming")))
                .add(
                    new JsonObject()
                        .put("nombre", "PRACTICAS")
                        .put("peso", 0.1)
                        .put(
                            "criterios",
                            new JsonArray()
                                .add("Proper error handling")
                                .add("Edge case coverage")
                                .add("Type safety considerations"))))
        .put("puntaje_maximo", 100);
  }

  public record ChallengeTemplate(String titulo, String enunciado, JsonObject rubrica) {}

  public record ChallengeContent(String titulo, String enunciado, JsonObject rubrica) {}
}

// Made with Bob
