package com.talentpool.api;

import com.talentpool.api.dto.EvaluacionResponse.DimensionResponse;
import com.talentpool.api.dto.EvaluacionResponse.EvaluacionBasic;
import com.talentpool.api.dto.EvaluacionResponse.EvaluacionDetail;
import com.talentpool.api.dto.SubmitEvaluationRequest;
import com.talentpool.domain.Desafio;
import com.talentpool.domain.DimensionPuntaje;
import com.talentpool.domain.Evaluacion;
import com.talentpool.domain.Usuario;
import com.talentpool.service.EvaluacionService;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("/api/v1/evaluations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Evaluations", description = "Code submission and asynchronous evaluation")
public class EvaluationsResource {

  @Inject EvaluacionService evaluacionService;

  @POST
  @PermitAll
  @Operation(summary = "Submit code and start async evaluation")
  @APIResponses({
    @APIResponse(responseCode = "202", description = "Evaluation submitted"),
    @APIResponse(responseCode = "400", description = "Invalid request")
  })
  public Response submit(@Valid SubmitEvaluationRequest request) {
    Evaluacion evaluacion = evaluacionService.submitForEvaluation(request);
    return Response.accepted(Map.of(
            "evaluacionId", evaluacion.id,
            "estado", evaluacion.estado,
            "estimacionSegundos", 15))
        .build();
  }

  @GET
  @Path("/{id}")
  @Authenticated
  @Operation(summary = "Get evaluation status/result")
  @APIResponses({
    @APIResponse(
        responseCode = "200",
        description = "Evaluation retrieved",
        content = @Content(schema = @Schema(implementation = EvaluacionDetail.class))),
    @APIResponse(responseCode = "401", description = "Unauthorized"),
    @APIResponse(responseCode = "404", description = "Evaluation not found")
  })
  public Response byId(@PathParam("id") UUID evaluacionId) {
    Evaluacion evaluacion = evaluacionService.findById(evaluacionId);
    if (!"EVALUADA".equals(evaluacion.estado)) {
      return Response.ok(EvaluacionBasic.from(evaluacion)).build();
    }

    Desafio desafio = Desafio.findByIdOptional(evaluacion.desafioId);
    Usuario candidato = Usuario.findByIdOptional(evaluacion.candidatoId);
    List<DimensionResponse> dimensiones = DimensionPuntaje.findByEvaluacion(evaluacion.id).stream()
        .map(DimensionResponse::from)
        .toList();

    EvaluacionDetail detail = new EvaluacionDetail(
        evaluacion.id,
        evaluacion.desafioId,
        desafio != null ? desafio.titulo : null,
        evaluacion.candidatoId,
        candidato != null ? candidato.email : null,
        evaluacion.estado,
        evaluacion.puntajeTotal,
        dimensiones,
        evaluacion.reporteFeedback,
        evaluacion.minutosEmpleados != null ? evaluacion.minutosEmpleados : computeMinutes(evaluacion),
        evaluacion.inicio,
        evaluacion.entrega,
        evaluacion.evaluadoEn);
    return Response.ok(detail).build();
  }

  private int computeMinutes(Evaluacion evaluacion) {
    Instant end = evaluacion.entrega != null ? evaluacion.entrega : Instant.now();
    return (int) Duration.between(evaluacion.inicio, end).toMinutes();
  }
}

