using System.Data;
using Msst.Backend.Data;
using Msst.Backend.Database;

namespace Msst.Backend.Security;

/// <summary>El proveedor explícito devuelve un único NVARCHAR(MAX); ningún DTO usa reflexión.</summary>
public sealed class ProcedureJsonClient(SqlServerAotRepository repository)
{
    public async Task<string> ExecuteAsync(string procedure, string operation, int actorId, int empresaId,
        string payloadJson, CancellationToken cancellationToken)
    {
        await using var connection = repository.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        await using var command = new SqlCommand(procedure, connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.AddWithValue("@Operation", operation);
        command.Parameters.AddWithValue("@ActorId", actorId);
        command.Parameters.AddWithValue("@EmpresaId", empresaId);
        command.Parameters.AddWithValue("@PayloadJson", payloadJson);
        var result = await command.ExecuteScalarAsync(cancellationToken);
        return result as string ?? throw new InvalidOperationException("PROCEDURE_RECEIPT_MISSING");
    }
}
