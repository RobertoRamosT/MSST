using Msst.Backend.Database;
using Msst.Backend.Models;
namespace Msst.Backend.Data;

/// <summary>Conexión nativa configurada y consultas del ámbito autenticado.</summary>
public sealed class SqlServerAotRepository
{
    private readonly string _connectionString;

    public SqlServerAotRepository(IConfiguration configuration)
    {
        _connectionString = SqlConnection.FromConfiguration(configuration);
    }

    public SqlConnection CreateConnection() => new(_connectionString);

    public async Task<EmpresaByIdResponse> ObtenerEmpresaPorIdAsync(int idEmpresa, CancellationToken ct = default)
    {
        var resp = new EmpresaByIdResponse();
        await using var conn = CreateConnection();
        await conn.OpenAsync(ct);

        const string sql = @"
            SELECT TOP 1 IdEmpresa, Nombre, Ruc, Codigo, ColorTema, IsProyectoSimple
            FROM dbo.Org_Empresa
            WHERE IdEmpresa = @IdEmpresa
            ORDER BY IdEmpresa DESC;";

        await using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@IdEmpresa", idEmpresa);
        await using var rdr = await cmd.ExecuteReaderAsync(ct);
        if (await rdr.ReadAsync(ct))
        {
            resp.Empresa.IdCompany = rdr.GetInt32(0);
            resp.Empresa.Name = rdr.GetString(1);
            resp.Empresa.Ruc = rdr.GetString(2);
            resp.Empresa.Codigo = rdr.IsDBNull(3) ? string.Empty : rdr.GetString(3);
            resp.Empresa.Color = rdr.IsDBNull(4) ? string.Empty : rdr.GetString(4);
            resp.Empresa.IsProyectoSimple = rdr.GetInt32(5);
        }
        if(resp.Empresa.IdCompany<=0)throw new ApiDomainException(404,"COMPANY_NOT_FOUND","La empresa no está disponible en su ámbito.");
        return resp;
    }

    public async Task<ContratistaPerfilesResponse> ObtenerPerfilesContratistaAsync(int idEmpresa, CancellationToken ct = default)
    {
        var resp = new ContratistaPerfilesResponse();
        await using var conn = CreateConnection();
        await conn.OpenAsync(ct);

        const string sqlEmpresa = @"
            SELECT TOP 1 IdEmpresa, Nombre, ColorTema
            FROM dbo.Org_Empresa
            WHERE IdEmpresa = @IdEmpresa;";
        await using (var cmdEmp = new SqlCommand(sqlEmpresa, conn))
        {
            cmdEmp.Parameters.AddWithValue("@IdEmpresa", idEmpresa);
            await using var rdr = await cmdEmp.ExecuteReaderAsync(ct);
            if (await rdr.ReadAsync(ct))
            {
                resp.Empresa.IdCompany = rdr.GetInt32(0);
                resp.Empresa.Name = rdr.GetString(1);
                resp.Empresa.Color = rdr.IsDBNull(2) ? string.Empty : rdr.GetString(2);
            }
        }

        const string sqlSecciones = @"
            SELECT IdSeccion, Nombre, Icono, SeccionPadreId, ModuloId, TipoExamenId,
                   NumAlerta, TextoAyuda, Orden, EsDestacado
            FROM dbo.Seg_SeccionContratista
            WHERE IdEmpresa = @IdEmpresa AND Estado = 1
            ORDER BY Orden ASC;";
        await using (var cmd = new SqlCommand(sqlSecciones, conn))
        {
            cmd.Parameters.AddWithValue("@IdEmpresa", idEmpresa);
            await using var rdr = await cmd.ExecuteReaderAsync(ct);
            while (await rdr.ReadAsync(ct))
            {
                resp.Seccion.Add(new SeccionContratistaDto
                {
                    Id = rdr.GetInt32(0),
                    Nombre = rdr.GetString(1),
                    Icono = rdr.GetString(2),
                    SeccionPadreId = rdr.IsDBNull(3) ? null : rdr.GetInt32(3),
                    ModuloId = rdr.IsDBNull(4) ? null : rdr.GetInt32(4),
                    TipoExamenId = rdr.IsDBNull(5) ? null : rdr.GetInt32(5),
                    NumAlerta = rdr.GetInt32(6),
                    TextoAyuda = rdr.IsDBNull(7) ? null : rdr.GetString(7),
                    Orden = rdr.GetInt32(8),
                    EsDestacado = rdr.GetBoolean(9)
                });
            }
        }

        if(resp.Empresa.IdCompany<=0)throw new ApiDomainException(404,"COMPANY_NOT_FOUND","La empresa no está disponible en su ámbito.");
        return resp;
    }

    public async Task<EmpresaMensajeResponse> ObtenerMensajesAsync(int empresa,CancellationToken ct=default)
    {
        var result=new EmpresaMensajeResponse();
        await using var connection=CreateConnection();await connection.OpenAsync(ct);
        await using var cmd=new SqlCommand("SELECT Frase,Autor FROM dbo.Org_EmpresaMensaje WHERE IdEmpresa=@Id AND Enabled=1 ORDER BY IdMensaje;",connection);
        cmd.Parameters.AddWithValue("@Id",empresa);await using var r=await cmd.ExecuteReaderAsync(ct);
        while(await r.ReadAsync(ct))result.List.Add(new(){Frase=r.GetString(0),Autor=r.IsDBNull(1)?"":r.GetString(1)});
        return result;
    }

    public async Task<EstadoSistemaAotDto> ObtenerEstadoSistemaAsync(CancellationToken ct = default)
    {
        var dto = new EstadoSistemaAotDto
        {
            FechaHoraServidor = DateTimeOffset.UtcNow.ToString("O")
        };

        await using var conn = CreateConnection();
        await conn.OpenAsync(ct);
        await using var cmd = new SqlCommand("SELECT COUNT(*) FROM dbo.Sys_EndpointCatalogo;", conn);
        var countObj = await cmd.ExecuteScalarAsync(ct);
        dto.TotalEndpointsRegistrados = Convert.ToInt32(countObj);
        await using var db=new SqlCommand("SELECT DB_NAME();",conn);
        dto.BaseDatos=Convert.ToString(await db.ExecuteScalarAsync(ct))??string.Empty;

        return dto;
    }
}
