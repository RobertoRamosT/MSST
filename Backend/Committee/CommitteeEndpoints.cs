using Microsoft.AspNetCore.Antiforgery;
using Msst.Backend.Security;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Microsoft.AspNetCore.Routing;
using Msst.Backend.Database;
namespace Msst.Backend.Committee;
public static class CommitteeEndpoints
{
    public static IServiceCollection AddCommitteeV2(this IServiceCollection services)=>services.AddSingleton<CommitteeRepository>();
    public static void MapCommitteeV2(this IEndpointRouteBuilder endpoints)
    {
        Map(endpoints,"/sst/committee/actas","GET","ACTAS");Map(endpoints,"/sst/committee/elections","GET","ELECTIONS");
        Map(endpoints,"/sst/committee/members","GET","MEMBERS");Map(endpoints,"/sst/committee/session-types","GET","TYPES");
        Map(endpoints,"/sst/committee/actas","POST","CREATE_ACTA");Map(endpoints,"/sst/committee/actas/{id:long}/approve","POST","APPROVE");
        Map(endpoints,"/sst/committee/actas/{id:long}/document","GET","DOCUMENT");
        Map(endpoints,"/sst/committee/elections","POST","CREATE_ELECTION");Map(endpoints,"/sst/committee/elections/{id:long}/votes","POST","VOTE");
        Map(endpoints,"/sst/committee/members","POST","SAVE_MEMBER");Map(endpoints,"/sst/committee/session-types","POST","SAVE_TYPE");
    }
    private static void Map(IEndpointRouteBuilder endpoints,string route,string method,string operation)
    {
        RequestDelegate handler=context=>HandleAsync(context,operation);
        endpoints.MapMethods(route,[method],handler).RequireAuthorization();
    }
    private static async Task HandleAsync(HttpContext http,string operation)
    {
        var correlationId=http.TraceIdentifier;
        if(http.User.Identity?.IsAuthenticated!=true || !int.TryParse(http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value,out var actorId) || actorId<=0 ||
            !int.TryParse(http.User.FindFirst("msst:empresa_id")?.Value,out var empresaId) || empresaId<=0)
        {await WriteAsync(http,Fail(401,"AUTH_REQUIRED","Inicie sesión en un ámbito autorizado.",correlationId));return;}
        if(HttpMethods.IsPost(http.Request.Method)&&!await SecurityV2Endpoints.ValidateCsrfAsync(http,http.RequestServices.GetRequiredService<IAntiforgery>()))
        {await WriteAsync(http,Fail(400,"CSRF_INVALID","Actualice la sesión antes de continuar.",correlationId));return;}
        try
        {
            long.TryParse(http.Request.RouteValues["id"]?.ToString(),out var id);
            string payload;Guid? requestId=null;
            switch(operation)
            {
                case "CREATE_ACTA":
                {
                    var request=await ReadAsync(http,CommitteeJsonContext.Default.CommitteeActaRequest);ValidId(request.IdempotencyKey);
                    if(string.IsNullOrWhiteSpace(request.NumeroActa)||request.NumeroActa.Length>64||string.IsNullOrWhiteSpace(request.TipoSesion)||request.TipoSesion.Length>80||
                        string.IsNullOrWhiteSpace(request.AgendaPrincipal)||string.IsNullOrWhiteSpace(request.AcuerdoTomado)||request.ResponsableUsuarioId<=0||
                        request.AsistentesUsuarioIds is null||request.AsistentesUsuarioIds.Length==0||request.AsistentesUsuarioIds.Any(user=>user<=0)||
                        request.AsistentesUsuarioIds.Distinct().Count()!=request.AsistentesUsuarioIds.Length)
                        throw new CommitteeInputException("Complete número, tipo, fecha, agenda, acuerdo, responsable y asistentes reales.");
                    requestId=request.IdempotencyKey;payload=JsonSerializer.Serialize(request,CommitteeJsonContext.Default.CommitteeActaRequest);break;
                }
                case "VOTE":
                {
                    var request=await ReadAsync(http,CommitteeJsonContext.Default.CommitteeVoteRequest);ValidId(request.IdempotencyKey);ValidVersion(request.ExpectedVersion);
                    if(id<=0||request.IdCandidato<=0)throw new CommitteeInputException("Seleccione un proceso y candidato existentes.");
                    requestId=request.IdempotencyKey;payload=JsonSerializer.Serialize(new CommitteeVoteCommand(id,request.IdempotencyKey,request.ExpectedVersion,request.IdCandidato),CommitteeJsonContext.Default.CommitteeVoteCommand);break;
                }
                case "APPROVE":
                {
                    var request=await ReadAsync(http,CommitteeJsonContext.Default.CommitteeApproveRequest);ValidId(request.IdempotencyKey);ValidVersion(request.ExpectedVersion);
                    if(id<=0||request.WorkflowExpedienteId<=0||request.SignatureIds is null||request.SignatureIds.Length==0||request.SignatureIds.Any(value=>value==Guid.Empty)||request.SignatureIds.Distinct().Count()!=request.SignatureIds.Length)
                        throw new CommitteeInputException("Seleccione el expediente y las firmas verificadas del acta.");
                    requestId=request.IdempotencyKey;payload=JsonSerializer.Serialize(new CommitteeApproveCommand(id,request.IdempotencyKey,request.ExpectedVersion,request.WorkflowExpedienteId,request.SignatureIds,[],[]),CommitteeJsonContext.Default.CommitteeApproveCommand);break;
                }
                case "SAVE_MEMBER":
                {
                    var request=await ReadAsync(http,CommitteeJsonContext.Default.CommitteeMemberRequest);ValidId(request.IdempotencyKey);
                    if(request.UserId<=0||string.IsNullOrWhiteSpace(request.RoleCode)||request.RoleCode.Length>120||string.IsNullOrWhiteSpace(request.Reason))throw new CommitteeInputException("Indique usuario, rol, vigencia y motivo de la designación.");
                    requestId=request.IdempotencyKey;payload=JsonSerializer.Serialize(request,CommitteeJsonContext.Default.CommitteeMemberRequest);break;
                }
                case "SAVE_TYPE":
                {
                    var request=await ReadAsync(http,CommitteeJsonContext.Default.CommitteeSessionTypeRequest);ValidId(request.IdempotencyKey);
                    if(string.IsNullOrWhiteSpace(request.TypeCode)||request.TypeCode.Length>80||string.IsNullOrWhiteSpace(request.Label)||request.Label.Length>200||
                        request.MinimumQuorum<=0||request.RequiredSignatures<=0||request.RequiredSignatures>request.MinimumQuorum||
                        string.IsNullOrWhiteSpace(request.WorkflowCaseCode)||string.IsNullOrWhiteSpace(request.WorkflowSubtipo)||string.IsNullOrWhiteSpace(request.SignatureFieldCode))
                        throw new CommitteeInputException("Complete el tipo, quórum, firmas requeridas y la política de workflow y evidencia.");
                    requestId=request.IdempotencyKey;payload=JsonSerializer.Serialize(request,CommitteeJsonContext.Default.CommitteeSessionTypeRequest);break;
                }
                case "CREATE_ELECTION":
                {
                    var request=await ReadAsync(http,CommitteeJsonContext.Default.CommitteeElectionRequest);ValidId(request.IdempotencyKey);
                    if(string.IsNullOrWhiteSpace(request.Titulo)||request.Titulo.Length>250||request.FechaFin<=request.FechaInicio||request.CandidateUserIds is null||request.VoterUserIds is null||
                        request.CandidateUserIds.Length==0||request.VoterUserIds.Length==0||request.CandidateUserIds.Any(value=>value<=0)||request.VoterUserIds.Any(value=>value<=0)||
                        request.CandidateUserIds.Distinct().Count()!=request.CandidateUserIds.Length||request.VoterUserIds.Distinct().Count()!=request.VoterUserIds.Length)
                        throw new CommitteeInputException("Indique título, plazo, candidatos y padrón de usuarios reales.");
                    requestId=request.IdempotencyKey;payload=JsonSerializer.Serialize(request,CommitteeJsonContext.Default.CommitteeElectionRequest);break;
                }
                default:payload=JsonSerializer.Serialize(new CommitteeQuery(id>0?id:null),CommitteeJsonContext.Default.CommitteeQuery);break;
            }
            var response=await http.RequestServices.GetRequiredService<CommitteeRepository>().ExecuteAsync(operation,actorId,empresaId,payload,correlationId,requestId,http.RequestAborted);
            if(operation=="DOCUMENT"&&response.Succeeded&&response.CanonicalDocument is not null)
                await Results.File(Encoding.UTF8.GetBytes(response.CanonicalDocument),"application/json",$"acta-{id}.json").ExecuteAsync(http);
            else await WriteAsync(http,response);
        }
        catch(OperationCanceledException)when(http.RequestAborted.IsCancellationRequested){}
        catch(JsonException){await WriteAsync(http,Fail(400,"REQUEST_JSON_INVALID","La solicitud contiene campos inválidos o datos requeridos ausentes.",correlationId));}
        catch(CommitteeInputException ex){await WriteAsync(http,Fail(400,"REQUEST_INVALID",ex.Message,correlationId));}
        catch(Exception ex)when(ex is InvalidDataException or IOException or UnauthorizedAccessException or CryptographicException)
        {await WriteAsync(http,Fail(422,"COMMITTEE_UNCONFIRMED","No se confirmó el documento, la integridad de sus archivos o el resultado persistido.",correlationId));}
        catch(SqlException ex)
        {
            http.RequestServices.GetRequiredService<ILogger<CommitteeRepository>>().LogError("Comité no confirmado. SqlNumber={SqlNumber},CorrelationId={CorrelationId}",ex.Number,correlationId);
            await WriteAsync(http,Fail(503,"COMMITTEE_UNAVAILABLE","No se pudo confirmar la operación. Conserve sus datos y vuelva a consultar.",correlationId));
        }
    }
    private static void ValidId(Guid value){if(value==Guid.Empty)throw new CommitteeInputException("Indique un identificador único de operación.");}
    private static void ValidVersion(string? value)
    {try{if(!string.IsNullOrWhiteSpace(value)&&Convert.FromBase64String(value).Length==8)return;}catch(FormatException){}throw new CommitteeInputException("La versión cambió o no es válida. Actualice los datos.");}
    private static async Task<T> ReadAsync<T>(HttpContext http,JsonTypeInfo<T> metadata)where T:class=>await JsonSerializer.DeserializeAsync(http.Request.Body,metadata,http.RequestAborted)??throw new CommitteeInputException("Complete la solicitud.");
    private static CommitteeEnvelope Fail(int status,string code,string message,string correlation)=>new(){Succeeded=false,Code=code,Message=message,HttpStatus=status,CorrelationId=correlation};
    private static Task WriteAsync(HttpContext http,CommitteeEnvelope envelope)=>Results.Json(envelope,CommitteeJsonContext.Default.CommitteeEnvelope,statusCode:envelope.HttpStatus).ExecuteAsync(http);
    private sealed class CommitteeInputException(string message):Exception(message);
}