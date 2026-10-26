using System.Text.Json.Serialization;

namespace Msst.Backend.Committee;

public sealed record CommitteeMember(int UserId,string Nombre,string RoleCode);
public sealed record CommitteeSessionType(string TypeCode,int RuleVersion,string Label,int MinimumQuorum,
    int RequiredSignatures,string WorkflowCaseCode,string WorkflowSubtipo,int WorkflowDefinitionVersion,string SignatureFieldCode);
public sealed record CommitteeActa(long IdActa,string NumeroActa,string TipoSesion,int RuleVersion,DateTimeOffset FechaReunion,
    string AgendaPrincipal,string AcuerdoTomado,int ResponsableUsuarioId,string ResponsableNombre,
    int QuorumAsistentes,int QuorumRequerido,string Estado,string Version,int[] AsistentesUsuarioIds,
    long? WorkflowExpedienteId,DateTimeOffset CreatedAtUtc,string DocumentUrl,Guid[] SignatureIds);
public sealed record CommitteeCandidate(long IdCandidato,int UsuarioId,string Nombre);
public sealed record CommitteeElection(long IdProceso,string Titulo,DateTimeOffset FechaInicio,DateTimeOffset FechaFin,
    string Estado,string Version,bool YaVotoUsuarioActual,CommitteeCandidate[] Candidatos,int TotalVotos);
public sealed record CommitteeVoteReceipt(Guid RequestId,long IdProceso,DateTimeOffset AcceptedAtUtc,bool AlreadyRecorded);
public sealed record CommitteeEnvelope
{
    public bool Succeeded{get;init;}
    public string Code{get;init;}=string.Empty;
    public string Message{get;init;}=string.Empty;
    public string CorrelationId{get;init;}=string.Empty;
    public Guid? RequestId{get;init;}
    public int HttpStatus{get;init;}
    public bool Replayed{get;init;}
    public CommitteeActa[] Actas{get;init;}=[];
    public CommitteeElection[] Procesos{get;init;}=[];
    public CommitteeMember[] Members{get;init;}=[];
    public CommitteeSessionType[] SessionTypes{get;init;}=[];
    public CommitteeActa? Acta{get;init;}
    public CommitteeVoteReceipt? Receipt{get;init;}
    public string? CanonicalDocument{get;init;}
    public Guid[] EvidenceIds{get;init;}=[];
}
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record CommitteeActaRequest([property:JsonRequired]Guid IdempotencyKey,
    [property:JsonRequired]string NumeroActa,[property:JsonRequired]string TipoSesion,
    [property:JsonRequired]DateTimeOffset FechaReunion,[property:JsonRequired]string AgendaPrincipal,
    [property:JsonRequired]string AcuerdoTomado,[property:JsonRequired]int ResponsableUsuarioId,
    [property:JsonRequired]int QuorumAsistentes,[property:JsonRequired]int QuorumRequerido,
    [property:JsonRequired]int[] AsistentesUsuarioIds,long? WorkflowExpedienteId);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record CommitteeVoteRequest([property:JsonRequired]Guid IdempotencyKey,
    [property:JsonRequired]string ExpectedVersion,[property:JsonRequired]long IdCandidato);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record CommitteeApproveRequest([property:JsonRequired]Guid IdempotencyKey,
    [property:JsonRequired]string ExpectedVersion,[property:JsonRequired]long WorkflowExpedienteId,
    [property:JsonRequired]Guid[] SignatureIds);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record CommitteeSessionTypeRequest([property:JsonRequired]Guid IdempotencyKey,
    [property:JsonRequired]string TypeCode,[property:JsonRequired]string Label,
    [property:JsonRequired]int MinimumQuorum,[property:JsonRequired]int RequiredSignatures,
    [property:JsonRequired]string WorkflowCaseCode,[property:JsonRequired]string WorkflowSubtipo,
    [property:JsonRequired]int WorkflowDefinitionVersion,
    [property:JsonRequired]string SignatureFieldCode);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record CommitteeMemberRequest([property:JsonRequired]Guid IdempotencyKey,
    [property:JsonRequired]int UserId,[property:JsonRequired]string RoleCode,
    [property:JsonRequired]DateTimeOffset ValidFromUtc,DateTimeOffset? ValidUntilUtc,
    [property:JsonRequired]bool Enabled,[property:JsonRequired]string Reason);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record CommitteeElectionRequest([property:JsonRequired]Guid IdempotencyKey,
    [property:JsonRequired]string Titulo,[property:JsonRequired]DateTimeOffset FechaInicio,
    [property:JsonRequired]DateTimeOffset FechaFin,[property:JsonRequired]int[] CandidateUserIds,
    [property:JsonRequired]int[] VoterUserIds);
internal sealed record CommitteeQuery(long? Id);
internal sealed record CommitteeVoteCommand(long IdProceso,Guid IdempotencyKey,string ExpectedVersion,long IdCandidato);
internal sealed record CommitteeApproveCommand(long IdActa,Guid IdempotencyKey,string ExpectedVersion,long WorkflowExpedienteId,Guid[] SignatureIds,Guid[] VerifiedEvidenceIds,Guid[] VerifiedSignatureIds);
[JsonSourceGenerationOptions(PropertyNamingPolicy=JsonKnownNamingPolicy.CamelCase,DefaultIgnoreCondition=JsonIgnoreCondition.WhenWritingNull)]
[JsonSerializable(typeof(CommitteeEnvelope))]
[JsonSerializable(typeof(CommitteeQuery))]
[JsonSerializable(typeof(CommitteeActaRequest))]
[JsonSerializable(typeof(CommitteeVoteRequest))]
[JsonSerializable(typeof(CommitteeVoteCommand))]
[JsonSerializable(typeof(CommitteeApproveRequest))]
[JsonSerializable(typeof(CommitteeApproveCommand))]
[JsonSerializable(typeof(CommitteeSessionTypeRequest))]
[JsonSerializable(typeof(CommitteeMemberRequest))]
[JsonSerializable(typeof(CommitteeElectionRequest))]
internal partial class CommitteeJsonContext:JsonSerializerContext{}