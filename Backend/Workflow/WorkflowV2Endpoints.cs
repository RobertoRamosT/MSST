using Microsoft.AspNetCore.Antiforgery;
using Msst.Backend.Security;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Microsoft.AspNetCore.Routing;
using Msst.Backend.Database;

namespace Msst.Backend.Workflow;

public static class WorkflowV2Endpoints
{
    public static IServiceCollection AddWorkflowV2(this IServiceCollection services) =>
        services.AddSingleton<WorkflowV2Repository>();

    public static void MapWorkflowV2(this IEndpointRouteBuilder endpoints)
    {
        Map(endpoints, "/sst/workflow/v2/casos", "GET", "CATALOG");
        Map(endpoints, "/sst/workflow/v2/subjects", "GET", "SUBJECTS");
        Map(endpoints, "/sst/workflow/v2/expedientes", "GET", "LIST");
        Map(endpoints, "/sst/workflow/v2/expedientes/{id:long}", "GET", "DETAIL");
        Map(endpoints, "/sst/workflow/v2/expedientes", "POST", "CREATE");
        Map(endpoints, "/sst/workflow/v2/expedientes/{id:long}/actions", "POST", "ACTION");
        Map(endpoints, "/sst/workflow/v2/expedientes/{id:long}/proofs", "POST", "PROOF");
        Map(endpoints, "/sst/workflow/v2/role-grants", "POST", "GRANT_ROLE");
        Map(endpoints, "/sst/workflow/v2/definitions", "POST", "DEFINE");
        Map(endpoints, "/sst/workflow/v2/definitions/{id:long}/publish", "POST", "PUBLISH");
    }

    private static void Map(IEndpointRouteBuilder endpoints, string path, string method, string operation)
    {
        // Sobreload RequestDelegate explícita: ningún binding de cuerpo mediante reflexión.
        RequestDelegate handler = context => HandleAsync(context, operation);
        endpoints.MapMethods(path, [method], handler).RequireAuthorization("MSST.Workflow.Actuar");
    }

    private static async Task HandleAsync(HttpContext http, string operation)
    {
        var correlationId = http.TraceIdentifier;
        if (http.User.Identity?.IsAuthenticated != true ||
            !int.TryParse(http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var actorId) || actorId <= 0 ||
            !int.TryParse(http.User.FindFirst("msst:empresa_id")?.Value, out var empresaId) || empresaId <= 0)
        {
            await WriteAsync(http, Failure(401, "AUTH_REQUIRED", "Inicie sesión con un ámbito autorizado.", correlationId));
            return;
        }
        if (HttpMethods.IsPost(http.Request.Method) && !await SecurityV2Endpoints.ValidateCsrfAsync(http,http.RequestServices.GetRequiredService<IAntiforgery>()))
        {
            await WriteAsync(http, Failure(400, "CSRF_INVALID", "Actualice la sesión antes de continuar.", correlationId));
            return;
        }
        try
        {
            var id = ParseId(http);
            string payload;
            Guid? requestId = null;
            switch (operation)
            {
                case "ACTION":
                {
                    var request = await ReadAsync(http, WorkflowV2JsonContext.Default.WorkflowV2ActionRequest);
                    ValidateVersion(request.ExpectedVersion);
                    ValidateId(request.IdempotencyKey);
                    if (id is null || request.DefinitionVersion <= 0 || !IsCode(request.ActionCode, 80) ||
                        request.Values is null || request.EvidenceIds is null ||
                        request.Values.Any(value => value is null || string.IsNullOrWhiteSpace(value.RequirementCode) || value.Value is null) ||
                        request.Values.Select(value => value.RequirementCode).Distinct(StringComparer.Ordinal).Count() != request.Values.Length ||
                        request.EvidenceIds.Any(value => value == Guid.Empty) || request.EvidenceIds.Distinct().Count() != request.EvidenceIds.Length)
                        throw new WorkflowV2InputException("Revise acción, requisitos e identificadores de evidencias.");
                    requestId = request.IdempotencyKey;
                    payload = JsonSerializer.Serialize(new WorkflowV2ActionCommand(id.Value, request.IdempotencyKey,
                        request.ExpectedVersion, request.DefinitionVersion, request.ActionCode, request.Values,
                        request.EvidenceIds, request.Comment, [], []), WorkflowV2JsonContext.Default.WorkflowV2ActionCommand);
                    break;
                }
                case "CREATE":
                {
                    var request = await ReadAsync(http, WorkflowV2JsonContext.Default.WorkflowV2CreateRequest);
                    ValidateId(request.IdempotencyKey);
                    if (string.IsNullOrWhiteSpace(request.CodigoCaso) || string.IsNullOrWhiteSpace(request.Subtipo) ||
                        string.IsNullOrWhiteSpace(request.Titulo) || string.IsNullOrWhiteSpace(request.SubjectType) ||
                        request.SubjectId <= 0 || request.DefinitionVersion <= 0)
                        throw new WorkflowV2InputException("Seleccione caso, subtipo, versión y sujeto operativo existentes.");
                    requestId = request.IdempotencyKey;
                    payload = JsonSerializer.Serialize(request, WorkflowV2JsonContext.Default.WorkflowV2CreateRequest);
                    break;
                }
                case "PROOF":
                {
                    var request = await ReadAsync(http, WorkflowV2JsonContext.Default.WorkflowV2ProofRequest);
                    ValidateVersion(request.ExpectedVersion);
                    ValidateId(request.IdempotencyKey);
                    if (id is null || string.IsNullOrWhiteSpace(request.RequirementCode) ||
                        request.Decision is not ("APPROVED" or "OBSERVED" or "REJECTED") || request.EvidenceIds is null ||
                        request.EvidenceIds.Any(value => value == Guid.Empty) || request.EvidenceIds.Distinct().Count() != request.EvidenceIds.Length)
                        throw new WorkflowV2InputException("Indique requisito, dictamen y evidencias válidos.");
                    if (request.ClinicalRecordId.HasValue != (request.ClinicalRecordVersion is not null) || request.ClinicalRecordId<=0)
                        throw new WorkflowV2InputException("Seleccione una evaluación clínica con identificador y versión válidos.");
                    if (request.ClinicalRecordVersion is not null) ValidateVersion(request.ClinicalRecordVersion);
                    requestId = request.IdempotencyKey;
                    payload = JsonSerializer.Serialize(new WorkflowV2ProofCommand(id.Value, request.IdempotencyKey,
                        request.ExpectedVersion, request.RequirementCode, request.Decision, request.EvidenceIds,
                        request.ValidUntilUtc, request.Comment, request.SignatureId, [], [], request.ClinicalRecordId, request.ClinicalRecordVersion), WorkflowV2JsonContext.Default.WorkflowV2ProofCommand);
                    break;
                }
                case "DEFINE":
                {
                    var request = await ReadAsync(http, WorkflowV2JsonContext.Default.WorkflowV2DefinitionRequest);
                    ValidateId(request.IdempotencyKey);
                    if (string.IsNullOrWhiteSpace(request.CodigoCaso) || string.IsNullOrWhiteSpace(request.Subtipo) ||
                        string.IsNullOrWhiteSpace(request.Nombre) || string.IsNullOrWhiteSpace(request.SubjectType) ||
                        request.Stages is null || request.Stages.Length == 0 || request.Transitions is null || request.Transitions.Length == 0)
                        throw new WorkflowV2InputException("La definición necesita caso, subtipo, sujeto, etapas y transiciones.");
                    ValidateDefinition(request);
                    requestId = request.IdempotencyKey;
                    payload = JsonSerializer.Serialize(request, WorkflowV2JsonContext.Default.WorkflowV2DefinitionRequest);
                    break;
                }
                case "GRANT_ROLE":
                {
                    var request = await ReadAsync(http, WorkflowV2JsonContext.Default.WorkflowV2RoleGrantRequest);
                    ValidateId(request.IdempotencyKey);
                    if (request.UserId <= 0 || !IsCode(request.RoleCode, 120) || string.IsNullOrWhiteSpace(request.Reason))
                        throw new WorkflowV2InputException("Indique usuario, rol y motivo de la concesión.");
                    requestId = request.IdempotencyKey;
                    payload = JsonSerializer.Serialize(request, WorkflowV2JsonContext.Default.WorkflowV2RoleGrantRequest);
                    break;
                }
                case "PUBLISH":
                {
                    var request = await ReadAsync(http, WorkflowV2JsonContext.Default.WorkflowV2PublishRequest);
                    ValidateId(request.IdempotencyKey);
                    if (id is null) throw new WorkflowV2InputException("Seleccione una definición existente.");
                    requestId = request.IdempotencyKey;
                    payload = JsonSerializer.Serialize(new WorkflowV2PublishCommand(id.Value, request.IdempotencyKey),
                        WorkflowV2JsonContext.Default.WorkflowV2PublishCommand);
                    break;
                }
                default:
                {
                    int? offset = ParseOptionalInt(http.Request.Query["offset"]);
                    int? limit = ParseOptionalInt(http.Request.Query["limit"]);
                    payload = JsonSerializer.Serialize(new WorkflowV2Query(operation == "DETAIL" ? id : null, null,
                        http.Request.Query["codigoCaso"], http.Request.Query["subtipo"], http.Request.Query["subjectType"],
                        http.Request.Query["search"], offset, limit), WorkflowV2JsonContext.Default.WorkflowV2Query);
                    break;
                }
            }
            var repository = http.RequestServices.GetRequiredService<WorkflowV2Repository>();
            var response = await repository.ExecuteAsync(operation, new(actorId, empresaId), payload,
                correlationId, requestId, http.RequestAborted);
            await WriteAsync(http, response);
        }
        catch (OperationCanceledException) when (http.RequestAborted.IsCancellationRequested) { }
        catch (JsonException)
        {
            await WriteAsync(http, Failure(400, "REQUEST_JSON_INVALID", "La solicitud contiene JSON inválido, campos desconocidos o datos requeridos ausentes.", correlationId));
        }
        catch (WorkflowV2InputException ex)
        {
            await WriteAsync(http, Failure(400, "REQUEST_INVALID", ex.Message, correlationId));
        }
        catch (SqlException ex)
        {
            http.RequestServices.GetRequiredService<ILogger<WorkflowV2Repository>>()
                .LogError("Workflow no confirmado. SqlNumber={SqlNumber}, CorrelationId={CorrelationId}", ex.Number, correlationId);
            await WriteAsync(http, Failure(503, "WF_OPERATION_UNCONFIRMED", "No se pudo confirmar la operación. Conserve los datos y vuelva a consultar el expediente.", correlationId));
        }
        catch (WorkflowV2SignatureException)
        {
            await WriteAsync(http, Failure(422,"WF_SIGNATURE_UNCONFIRMED","La firma requerida no superó la comprobación actual de integridad, identidad o cadena de confianza. Revise el documento y la firma antes de continuar.",correlationId));
        }
        catch (WorkflowV2EvidenceException)
        {
            await WriteAsync(http, Failure(422, "WF_EVIDENCE_UNVERIFIED", "Un archivo requerido no existe o no superó la comprobación de integridad. Cargue una evidencia válida antes de continuar.", correlationId));
        }
        catch (InvalidDataException)
        {
            http.RequestServices.GetRequiredService<ILogger<WorkflowV2Repository>>()
                .LogError("Workflow devolvió un resultado incompleto. CorrelationId={CorrelationId}", correlationId);
            await WriteAsync(http, Failure(500, "WF_OPERATION_UNCONFIRMED", "No se confirmó el estado persistido. Actualice el expediente antes de continuar.", correlationId));
        }
    }

    private static bool IsCode(string? value, int maximum) => !string.IsNullOrWhiteSpace(value) &&
        value.Length <= maximum && value.All(character => char.IsAsciiLetterOrDigit(character) || character is '_' or '-' or ':' or '.');
    private static void ValidateDefinition(WorkflowV2DefinitionRequest request)
    {
        if (!IsCode(request.CodigoCaso,50) || !IsCode(request.Subtipo,80) || request.Nombre.Length>200 ||
            !IsCode(request.SubjectType,40) || !IsCode(request.InitialStageCode,80) || !IsCode(request.InitialStateCode,80) ||
            request.Stages.Select(stage=>stage?.StageCode).Distinct(StringComparer.Ordinal).Count()!=request.Stages.Length ||
            request.Stages.Select(stage=>stage?.Order).Distinct().Count()!=request.Stages.Length)
            throw new WorkflowV2InputException("Revise códigos, título y unicidad de etapas de la definición.");
        foreach (var stage in request.Stages)
        {
            if(stage is null || !IsCode(stage.StageCode,80) || stage.Order<=0 || string.IsNullOrWhiteSpace(stage.Title) ||
               stage.Title.Length>250 || !IsCode(stage.RoleCode,120) || stage.Requirements is null || stage.DeadlineHours<=0)
                throw new WorkflowV2InputException("Revise código, orden, nombre, rol y plazo de cada etapa.");
            foreach(var requirement in stage.Requirements)
                if(requirement is null || !IsCode(requirement.RequirementCode,100) || string.IsNullOrWhiteSpace(requirement.Title) ||
                   requirement.Title.Length>500 || requirement.VerifierRoles is null || requirement.VerifierRoles.Length==0 ||
                   requirement.VerifierRoles.Any(role=>!IsCode(role,120)) ||
                   requirement.VerifierRoles.Distinct(StringComparer.Ordinal).Count()!=requirement.VerifierRoles.Length ||
                   requirement.VerificationKind is not ("EVIDENCE_REVIEW" or "DOMAIN_REVIEW" or "SIGNATURE") ||
                   requirement.MaxValidityHours<=0 || (requirement.MaxValidityHours.HasValue && !requirement.RequiresValidityEnd))
                    throw new WorkflowV2InputException("Revise identificador, roles, tipo y política de vigencia de cada requisito.");
        }
        var requirements=request.Stages.SelectMany(stage=>stage.Requirements).Select(requirement=>requirement.RequirementCode).ToArray();
        if(requirements.Distinct(StringComparer.Ordinal).Count()!=requirements.Length)
            throw new WorkflowV2InputException("Los identificadores de requisito deben ser únicos dentro de la versión.");
        foreach(var transition in request.Transitions)
            if(transition is null || !IsCode(transition.ActionCode,80) || string.IsNullOrWhiteSpace(transition.Label) ||
               transition.Label.Length>200 || !IsCode(transition.FromStageCode,80) || !IsCode(transition.FromStateCode,80) ||
               !IsCode(transition.ToStageCode,80) || !IsCode(transition.ToStateCode,80) || transition.RequiredRoles is null ||
               transition.RequiredRoles.Length==0 || transition.RequiredRoles.Any(role=>!IsCode(role,120)) ||
               transition.RequiredRoles.Distinct(StringComparer.Ordinal).Count()!=transition.RequiredRoles.Length ||
               !IsCode(transition.EffectCode,60) || transition.EffectValue?.Length>100)
                throw new WorkflowV2InputException("Revise códigos, roles y efecto explícito de cada transición.");
    }
    private static long? ParseId(HttpContext http) =>
        long.TryParse(http.Request.RouteValues["id"]?.ToString(), out var id) && id > 0 ? id : null;
    private static int? ParseOptionalInt(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        if (int.TryParse(value, out var number) && number >= 0) return number;
        throw new WorkflowV2InputException("El intervalo de consulta no es válido.");
    }
    private static async Task<T> ReadAsync<T>(HttpContext http, JsonTypeInfo<T> metadata) where T : class =>
        await JsonSerializer.DeserializeAsync(http.Request.Body, metadata, http.RequestAborted)
        ?? throw new WorkflowV2InputException("Complete los datos de la solicitud.");
    private static void ValidateId(Guid id)
    {
        if (id == Guid.Empty) throw new WorkflowV2InputException("Indique el identificador de la operación.");
    }
    private static void ValidateVersion(string? value)
    {
        try
        {
            if (!string.IsNullOrWhiteSpace(value) && Convert.FromBase64String(value).Length == 8) return;
        }
        catch (FormatException) { }
        throw new WorkflowV2InputException("La versión del expediente no es válida. Actualice sus datos.");
    }
    private static WorkflowV2Envelope Failure(int status, string code, string message, string correlationId) =>
        new() { Succeeded = false, Code = code, Message = message, CorrelationId = correlationId, HttpStatus = status };
    private static Task WriteAsync(HttpContext http, WorkflowV2Envelope response) =>
        Results.Json(response, WorkflowV2JsonContext.Default.WorkflowV2Envelope, statusCode: response.HttpStatus).ExecuteAsync(http);
    private sealed class WorkflowV2InputException(string message) : Exception(message);
}