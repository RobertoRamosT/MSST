using System.Text.Json.Serialization;

namespace Msst.Backend.Workflow;

public sealed record WorkflowV2Actor(int ActorId, int EmpresaId);
public sealed record WorkflowV2Violation(string RequirementCode, string Code, string Message);
public sealed record WorkflowV2Subject(string SubjectType, long SubjectId, string Label, int? IdContratista, int? IdProyecto);
public sealed record WorkflowV2Requirement(string RequirementCode, string Title, string StageCode,
    bool Mandatory, string VerificationKind, bool EvidenceRequired, string[] VerifierRoles,
    string Status, string Message, Guid[] EvidenceIds, string? DeclaredValue, bool RequiresValidityEnd, int? MaxValidityHours, Guid? SignatureId=null, bool RequiresClinicalReview=false);
public sealed record WorkflowV2Stage(string StageCode, int Order, string Title, string RoleCode,
    int? DeadlineHours, bool AllowNoRequirements, WorkflowV2Requirement[] Requirements);
public sealed record WorkflowV2Transition(string ActionCode, string Label, string FromStageCode,
    string FromStateCode, string ToStageCode, string ToStateCode, string[] RequiredRoles,
    bool RequiresVerifiedRequirements, bool RequiresComment, bool IsFinal, string? EffectCode, string? EffectValue);
public sealed record WorkflowV2Definition(long DefinitionId, string CodigoCaso, string Subtipo,
    int DefinitionVersion, string Nombre, string SubjectType, string Status,
    string InitialStageCode, string InitialStateCode, WorkflowV2Stage[] Stages,
    WorkflowV2Transition[] Transitions, string[] ValidationMessages);
public sealed record WorkflowV2Case(string CodigoCaso, string Nombre, string Descripcion,
    WorkflowV2Definition[] Definitions);
public sealed record WorkflowV2Event(long EventId, Guid RequestId, string ActionCode,
    string ActorDisplayName, DateTimeOffset OccurredAtUtc, string FromStageCode,
    string FromStateCode, string ToStageCode, string ToStateCode, string? Comment);
public sealed record WorkflowV2Snapshot(long ExpedienteId, string CodigoExpediente, string CodigoCaso,
    string Subtipo, int DefinitionVersion, string Titulo, WorkflowV2Subject Subject,
    string StageCode, int EtapaActual, int TotalEtapas, string EstadoGeneral,
    decimal CumplimientoPorc, string Version, DateTimeOffset FechaUltimoMovimiento,
    string[] AllowedActions, WorkflowV2Transition[] Actions, WorkflowV2Requirement[] Requirements,
    WorkflowV2Event[] History);
public sealed record WorkflowV2Envelope
{
    public bool Succeeded { get; init; }
    public string Code { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public string CorrelationId { get; init; } = string.Empty;
    public Guid? RequestId { get; init; }
    public bool Replayed { get; init; }
    public int HttpStatus { get; init; }
    public WorkflowV2Snapshot? Snapshot { get; init; }
    public WorkflowV2Case[] Cases { get; set; } = [];
    public WorkflowV2Snapshot[] Expedientes { get; set; } = [];
    public WorkflowV2Subject[] Subjects { get; set; } = [];
    public WorkflowV2Definition? Definition { get; init; }
    public WorkflowV2Violation[] ValidationErrors { get; set; } = [];
    public int Total { get; init; }
}

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record WorkflowV2FieldValue(
    [property: JsonRequired] string RequirementCode,
    [property: JsonRequired] string Value);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record WorkflowV2ActionRequest(
    [property: JsonRequired] Guid IdempotencyKey,
    [property: JsonRequired] string ExpectedVersion,
    [property: JsonRequired] int DefinitionVersion,
    [property: JsonRequired] string ActionCode,
    [property: JsonRequired] WorkflowV2FieldValue[] Values,
    [property: JsonRequired] Guid[] EvidenceIds,
    string? Comment);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record WorkflowV2CreateRequest(
    [property: JsonRequired] Guid IdempotencyKey,
    [property: JsonRequired] string CodigoCaso,
    [property: JsonRequired] string Subtipo,
    [property: JsonRequired] int DefinitionVersion,
    [property: JsonRequired] string Titulo,
    [property: JsonRequired] string SubjectType,
    [property: JsonRequired] long SubjectId);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record WorkflowV2ProofRequest(
    [property: JsonRequired] Guid IdempotencyKey,
    [property: JsonRequired] string ExpectedVersion,
    [property: JsonRequired] string RequirementCode,
    [property: JsonRequired] string Decision,
    [property: JsonRequired] Guid[] EvidenceIds,
    DateTimeOffset? ValidUntilUtc,
    string? Comment,
    Guid? SignatureId,
    long? ClinicalRecordId,
    string? ClinicalRecordVersion);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record WorkflowV2RequirementDraft(
    [property: JsonRequired] string RequirementCode,
    [property: JsonRequired] string Title,
    [property: JsonRequired] bool Mandatory,
    [property: JsonRequired] string VerificationKind,
    [property: JsonRequired] bool EvidenceRequired,
    [property: JsonRequired] string[] VerifierRoles,
    [property: JsonRequired] bool RequiresValidityEnd,
    int? MaxValidityHours);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record WorkflowV2StageDraft(
    [property: JsonRequired] string StageCode,
    [property: JsonRequired] int Order,
    [property: JsonRequired] string Title,
    [property: JsonRequired] string RoleCode,
    int? DeadlineHours,
    [property: JsonRequired] bool AllowNoRequirements,
    [property: JsonRequired] WorkflowV2RequirementDraft[] Requirements);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record WorkflowV2TransitionDraft(
    [property: JsonRequired] string ActionCode,
    [property: JsonRequired] string Label,
    [property: JsonRequired] string FromStageCode,
    [property: JsonRequired] string FromStateCode,
    [property: JsonRequired] string ToStageCode,
    [property: JsonRequired] string ToStateCode,
    [property: JsonRequired] string[] RequiredRoles,
    [property: JsonRequired] bool RequiresVerifiedRequirements,
    [property: JsonRequired] bool RequiresComment,
    [property: JsonRequired] bool IsFinal,
    string? EffectCode,
    string? EffectValue);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record WorkflowV2DefinitionRequest(
    [property: JsonRequired] Guid IdempotencyKey,
    [property: JsonRequired] string CodigoCaso,
    [property: JsonRequired] string Subtipo,
    [property: JsonRequired] string Nombre,
    [property: JsonRequired] string SubjectType,
    [property: JsonRequired] string InitialStageCode,
    [property: JsonRequired] string InitialStateCode,
    [property: JsonRequired] WorkflowV2StageDraft[] Stages,
    [property: JsonRequired] WorkflowV2TransitionDraft[] Transitions);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record WorkflowV2PublishRequest([property: JsonRequired] Guid IdempotencyKey);

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record WorkflowV2RoleGrantRequest(
    [property: JsonRequired] Guid IdempotencyKey,
    [property: JsonRequired] int UserId,
    [property: JsonRequired] string RoleCode,
    [property: JsonRequired] bool Enabled,
    DateTimeOffset? ValidUntilUtc,
    [property: JsonRequired] string Reason);

internal sealed record WorkflowV2Query(long? ExpedienteId, long? DefinitionId, string? CodigoCaso,
    string? Subtipo, string? SubjectType, string? Search, int? Offset, int? Limit);
internal sealed record WorkflowV2ActionCommand(long ExpedienteId, Guid IdempotencyKey, string ExpectedVersion,
    int DefinitionVersion, string ActionCode, WorkflowV2FieldValue[] Values, Guid[] EvidenceIds, string? Comment, Guid[] VerifiedEvidenceIds, Guid[] VerifiedSignatureIds);
internal sealed record WorkflowV2ProofCommand(long ExpedienteId, Guid IdempotencyKey, string ExpectedVersion,
    string RequirementCode, string Decision, Guid[] EvidenceIds, DateTimeOffset? ValidUntilUtc, string? Comment, Guid? SignatureId, Guid[] VerifiedEvidenceIds, Guid[] VerifiedSignatureIds, long? ClinicalRecordId=null, string? ClinicalRecordVersion=null);
internal sealed record WorkflowV2PublishCommand(long DefinitionId, Guid IdempotencyKey);

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull)]
[JsonSerializable(typeof(WorkflowV2Envelope))]
[JsonSerializable(typeof(WorkflowV2RoleGrantRequest))]
[JsonSerializable(typeof(WorkflowV2Query))]
[JsonSerializable(typeof(WorkflowV2CreateRequest))]
[JsonSerializable(typeof(WorkflowV2ActionRequest))]
[JsonSerializable(typeof(WorkflowV2ActionCommand))]
[JsonSerializable(typeof(WorkflowV2ProofRequest))]
[JsonSerializable(typeof(WorkflowV2ProofCommand))]
[JsonSerializable(typeof(WorkflowV2DefinitionRequest))]
[JsonSerializable(typeof(WorkflowV2PublishRequest))]
[JsonSerializable(typeof(WorkflowV2PublishCommand))]
internal partial class WorkflowV2JsonContext : JsonSerializerContext { }