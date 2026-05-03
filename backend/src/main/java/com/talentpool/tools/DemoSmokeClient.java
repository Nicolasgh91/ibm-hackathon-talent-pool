package com.talentpool.tools;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.ConnectException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;

/**
 * Smoke HTTP del flujo demo (sin frontend): reclutador, desafío, invitación, evaluación async y
 * ranking.
 *
 * <p>Variables de entorno (defaults como el antiguo script bash): {@code BASE_URL}, {@code
 * PUESTO_ID}, {@code RECRUITER_EMAIL}, {@code RECRUITER_PASSWORD}, {@code CANDIDATE_EMAIL}, {@code
 * CANDIDATE_PASSWORD}, {@code POLL_MAX}, {@code POLL_SLEEP}.
 *
 * <p>Ejecutar: {@code ./mvnw -q compile exec:java} desde {@code backend/} con la API en marcha y
 * seed demo aplicado.
 */
public final class DemoSmokeClient {

  private static final ObjectMapper MAPPER = new ObjectMapper();

  private static final String DEMO_CODE =
      """
      public class LRUCache<K,V> { /* demo */
      // comment
      void test() { assert true; }
      try { } catch (Exception e) { throw e; }
      }
      """;

  private DemoSmokeClient() {}

  private static boolean hasConnectFailure(Throwable e) {
    for (Throwable t = e; t != null; t = t.getCause()) {
      if (t instanceof ConnectException) {
        return true;
      }
    }
    return false;
  }

  public static void main(String[] args) {
    try {
      run();
    } catch (SmokeException e) {
      System.err.println("ERROR: " + e.getMessage());
      System.exit(1);
    } catch (Exception e) {
      String msg = e.getMessage();
      if (msg == null || msg.isBlank()) {
        msg =
            hasConnectFailure(e)
                ? "No se pudo conectar (¿API en marcha en BASE_URL? Ej.: ./mvnw quarkus:dev)"
                : e.toString();
      }
      System.err.println("ERROR: " + msg);
      e.printStackTrace(System.err);
      System.exit(1);
    }
  }

  private static void run() throws Exception {
    String baseUrl = trimTrailingSlash(env("BASE_URL", "http://localhost:8080"));
    UUID puestoId = UUID.fromString(env("PUESTO_ID", "33333333-3333-3333-3333-333333333333"));
    String recruiterEmail = env("RECRUITER_EMAIL", "recruiter@acme.com");
    String recruiterPassword = env("RECRUITER_PASSWORD", "Demo123!");
    String candidateEmail = env("CANDIDATE_EMAIL", "ana@example.com");
    String candidatePassword = env("CANDIDATE_PASSWORD", "Demo123!");
    int pollMax = Integer.parseInt(env("POLL_MAX", "45"));
    int pollSleepSec = Integer.parseInt(env("POLL_SLEEP", "2"));

    HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(15)).build();

    System.out.println("==> Login reclutador (" + recruiterEmail + ")");
    HttpJson loginRec =
        postJson(
            client,
            baseUrl + "/api/v1/auth/login",
            null,
            "{\"email\":\""
                + jsonEscape(recruiterEmail)
                + "\",\"password\":\""
                + jsonEscape(recruiterPassword)
                + "\"}",
            Duration.ofSeconds(30));
    expectStatus(loginRec.status(), 200, loginRec.body());
    String tokenRecruiter = text(loginRec.json(), "accessToken");

    System.out.println("==> POST /api/v1/challenges (puesto " + puestoId + ")");
    HttpJson challenge =
        postJson(
            client,
            baseUrl + "/api/v1/challenges",
            tokenRecruiter,
            "{\"puestoId\":\"" + puestoId + "\",\"minutosEstimados\":60}",
            Duration.ofSeconds(180));
    expectStatus(challenge.status(), 201, challenge.body());
    UUID desafioId = UUID.fromString(text(challenge.json(), "id"));
    System.out.println("    desafioId=" + desafioId);

    System.out.println(
        "==> POST /api/v1/challenges/" + desafioId + "/invitations (" + candidateEmail + ")");
    HttpJson inv =
        postJson(
            client,
            baseUrl + "/api/v1/challenges/" + desafioId + "/invitations",
            tokenRecruiter,
            "{\"emails\":[\"" + jsonEscape(candidateEmail) + "\"],\"maxIntentos\":1}",
            Duration.ofSeconds(60));
    expectStatus(inv.status(), 201, inv.body());
    JsonNode invitaciones = inv.json().path("invitaciones");
    if (!invitaciones.isArray() || invitaciones.isEmpty()) {
      throw new SmokeException("Sin invitaciones en respuesta");
    }
    String invToken = text(invitaciones.get(0), "token");
    String link = text(invitaciones.get(0), "linkInvitacion");
    System.out.println(
        "    token=" + invToken.substring(0, Math.min(16, invToken.length())) + "...");
    System.out.println("    linkInvitacion=" + link);

    System.out.println("==> GET /api/v1/invitations/by-token/{token} (público)");
    HttpJson view =
        getJson(
            client,
            baseUrl + "/api/v1/invitations/by-token/" + invToken,
            null,
            Duration.ofSeconds(30));
    expectStatus(view.status(), 200, view.body());

    System.out.println("==> POST /api/v1/evaluations (invitationToken, sin JWT)");
    String evalBody =
        MAPPER
            .createObjectNode()
            .put("invitationToken", invToken)
            .put("codigoEntregado", DEMO_CODE)
            .put("lenguaje", "java")
            .put("minutosEmpleados", 45)
            .toString();
    HttpJson submit =
        postJson(client, baseUrl + "/api/v1/evaluations", null, evalBody, Duration.ofSeconds(30));
    expectStatus(submit.status(), 202, submit.body());
    UUID evalId = UUID.fromString(text(submit.json(), "evaluacionId"));
    System.out.println("    evaluacionId=" + evalId);

    System.out.println("==> Login candidato (" + candidateEmail + ")");
    HttpJson loginCand =
        postJson(
            client,
            baseUrl + "/api/v1/auth/login",
            null,
            "{\"email\":\""
                + jsonEscape(candidateEmail)
                + "\",\"password\":\""
                + jsonEscape(candidatePassword)
                + "\"}",
            Duration.ofSeconds(30));
    expectStatus(loginCand.status(), 200, loginCand.body());
    String tokenCandidate = text(loginCand.json(), "accessToken");

    System.out.println(
        "==> Polling GET /api/v1/evaluations/"
            + evalId
            + " (máx "
            + pollMax
            + " × "
            + pollSleepSec
            + "s)");
    String estadoFinal = null;
    for (int i = 1; i <= pollMax; i++) {
      HttpJson pol =
          getJson(
              client,
              baseUrl + "/api/v1/evaluations/" + evalId,
              tokenCandidate,
              Duration.ofSeconds(60));
      expectStatus(pol.status(), 200, pol.body());
      String estado = text(pol.json(), "estado");
      estadoFinal = estado;
      System.out.println("    [" + i + "] estado=" + estado);
      if ("EVALUADA".equals(estado)) {
        String b = pol.body();
        System.out.println(b.substring(0, Math.min(b.length(), 2000)));
        break;
      }
      if ("ANULADA".equals(estado)) {
        throw new SmokeException("Evaluación anulada: " + pol.body());
      }
      Thread.sleep(pollSleepSec * 1000L);
    }
    if (!"EVALUADA".equals(estadoFinal)) {
      throw new SmokeException("Timeout: estado final=" + estadoFinal);
    }

    System.out.println("==> GET /api/v1/positions/" + puestoId + "/ranking (reclutador)");
    HttpJson rank =
        getJson(
            client,
            baseUrl + "/api/v1/positions/" + puestoId + "/ranking",
            tokenRecruiter,
            Duration.ofSeconds(60));
    expectStatus(rank.status(), 200, rank.body());
    System.out.println(rank.body());

    System.out.println("==> Smoke OK");
  }

  private static String env(String key, String defaultValue) {
    String v = System.getenv(key);
    return v != null && !v.isBlank() ? v : defaultValue;
  }

  private static String trimTrailingSlash(String url) {
    return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
  }

  private static String jsonEscape(String s) {
    return s.replace("\\", "\\\\").replace("\"", "\\\"");
  }

  private static HttpJson postJson(
      HttpClient client, String url, String bearer, String json, Duration timeout)
      throws Exception {
    HttpRequest.Builder b =
        HttpRequest.newBuilder()
            .uri(URI.create(url))
            .timeout(timeout)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8));
    if (bearer != null) {
      b.header("Authorization", "Bearer " + bearer);
    }
    HttpResponse<String> resp =
        client.send(b.build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
    return HttpJson.of(resp.statusCode(), resp.body());
  }

  private static HttpJson getJson(HttpClient client, String url, String bearer, Duration timeout)
      throws Exception {
    HttpRequest.Builder b = HttpRequest.newBuilder().uri(URI.create(url)).timeout(timeout).GET();
    if (bearer != null) {
      b.header("Authorization", "Bearer " + bearer);
    }
    HttpResponse<String> resp =
        client.send(b.build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
    return HttpJson.of(resp.statusCode(), resp.body());
  }

  private static String text(JsonNode node, String field) throws SmokeException {
    JsonNode v = node.get(field);
    if (v == null || v.isNull()) {
      throw new SmokeException("Campo faltante: " + field);
    }
    return v.asText();
  }

  private static void expectStatus(int actual, int expected, String body) throws SmokeException {
    if (actual != expected) {
      throw new SmokeException("HTTP " + actual + ", esperado " + expected + ": " + body);
    }
  }

  private record HttpJson(int status, String body, JsonNode json) {
    static HttpJson of(int status, String body) throws Exception {
      JsonNode parsed =
          (body == null || body.isBlank())
              ? MAPPER.getNodeFactory().objectNode()
              : MAPPER.readTree(body);
      return new HttpJson(status, body, parsed);
    }
  }

  private static final class SmokeException extends Exception {
    SmokeException(String message) {
      super(message);
    }
  }
}
