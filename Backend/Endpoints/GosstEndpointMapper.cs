using System.Data;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Msst.Backend.Data;
using Msst.Backend.Models;
using Msst.Backend.Serialization;

namespace Msst.Backend.Endpoints;

/// <summary>
/// Mapeador de Endpoints REST para .NET 10 Native AOT.
/// Expone los 43 grupos funcionales y las 1,344 rutas bajo el prefijo /sst/*,
/// incluyendo soporte CRUD relacional completo para:
/// - Sprint 1 (Módulos 01, 02 y 03)
/// - Sprint 2 (Módulos 04, 05, 06, 07 y 08)
/// - Sprint 3 (Módulos 09, 10, 11 y 12)
/// </summary>
public static class GosstEndpointMapper
{
    private static readonly string[] HttpVerbs = ["GET", "POST", "PUT", "DELETE"];

    private static readonly string[] RutasListadoSprint1A3 =
    [
        // Sprint 1 (Módulos 01, 02 y 03)
        "/perfil/lista",
        "/usuario/lista",
        "/mdf/lista",
        "/unidad/lista",
        "/division/lista",
        "/area/lista",
        "/puesto/lista",
        "/contratista/lista",
        "/contratista/proyecto/lista",
        "/contratista/trabajador/lista",
        "/contratista/vehiculo/lista",
        "/contratista/documento/lista",
        "/contratista/operacion/lista",
        "/contratista/garita/lista",

        // Sprint 2 (Módulos 04, 05, 06, 07 y 08)
        "/trabajador/lista",
        "/eleccion_virtual/lista",
        "/iperc/lista",
        "/inspeccionv2/lista",
        "/opt/lista",
        "/acinseguro/lista",
        "/accidente/lista",
        "/gestionaccionmejora/lista",
        "/capacitacion/lista",
        "/equiposeguridad/lista",
        "/procedimientoseguridad/lista",

        // Sprint 3 (Módulos 09, 10, 11 y 12)
        "/examenmedico/lista",
        "/covid/lista",
        "/psicologia/lista",
        "/sctr/lista",
        "/auditoria/lista",
        "/requisitos/lista",
        "/residuo/lista",
        "/fichaquimica/lista",
        "/huella-carbono/lista",
        "/estadistica/lista",
        "/indicadorgeneral/lista",
        "/objetivo/lista",
        "/ia/lista",
        "/visitante/lista",
        "/public/consulta"
    ];

    public static void MapGosstEndpoints(this WebApplication app)
    {
        var sst = app.MapGroup("/sst");

        // 1. HEALTH CHECK Y ESTADO DE ARQUITECTURA NATIVE AOT + SQL SERVER (DESKTOP-LOCAL)
        sst.MapGet("/health", async (SqlServerAotRepository repo, CancellationToken ct) =>
        {
            var status = await repo.ObtenerEstadoSistemaAsync(ct);
            return Results.Json(status, MsstJsonContext.Default.EstadoSistemaAotDto);
        });

        // 2. AUTENTICACIÓN Y SESIÓN (/sst/login/*)
        sst.MapPost("/login/validated", async (HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
        {
            var req = await ctx.Request.ReadFromJsonAsync(MsstJsonContext.Default.LoginRequest, ct) ?? new LoginRequest();
            var resp = await repo.ValidarLoginAsync(req, ct);

            if (resp.CodeResponse == "01" && !string.IsNullOrEmpty(resp.TokenJwt))
            {
                ctx.Response.Cookies.Append("CGESTOP_HEADER_DS", resp.TokenJwt, new CookieOptions
                {
                    HttpOnly = false,
                    Path = "/",
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTimeOffset.UtcNow.AddHours(12)
                });
            }

            return Results.Json(resp, MsstJsonContext.Default.LoginResponse);
        });

        sst.MapPost("/login/validated/terminosCondiciones", async (SqlServerAotRepository repo, CancellationToken ct) =>
        {
            var res = await repo.EjecutarEndpointUniversalAsync("/login/validated/terminosCondiciones", "{\"terminosCondiciones\":1}", ct);
            return Results.Json(res, MsstJsonContext.Default.UniversalGosstResponse);
        });

        sst.MapPost("/login/validated/cerrarTerminosCondiciones", async (SqlServerAotRepository repo, CancellationToken ct) =>
        {
            var res = await repo.EjecutarEndpointUniversalAsync("/login/validated/cerrarTerminosCondiciones", "{\"terminosCondiciones\":0}", ct);
            return Results.Json(res, MsstJsonContext.Default.UniversalGosstResponse);
        });

        // 3. EMPRESA Y CONFIGURACIÓN DE TEMA CORPORATIVO (/sst/empresa/*)
        sst.MapPost("/empresa/id", async (SqlServerAotRepository repo, CancellationToken ct) =>
        {
            var resp = await repo.ObtenerEmpresaPorIdAsync(773, ct);
            return Results.Json(resp, MsstJsonContext.Default.EmpresaByIdResponse);
        });

        sst.MapPost("/empresa/mensaje", () =>
        {
            var resp = new EmpresaMensajeResponse();
            resp.List.Add(new FraseMotivacionalDto
            {
                Frase = "La seguridad no es negociable: cada trabajador regresa sano y salvo a casa.",
                Autor = "HOLCIM PERÚ - Gestión SST On-Premise"
            });
            return Results.Json(resp, MsstJsonContext.Default.EmpresaMensajeResponse);
        });

        sst.MapPost("/empresa/delete", () =>
        {
            var res = new UniversalGosstResponse { CodeResponse = "05", StatusCode = "01" };
            return Results.Json(res, MsstJsonContext.Default.UniversalGosstResponse);
        });

        // 3.1 MENÚ LATERAL (SIDEBAR) DEL PORTAL CONTRATISTA — contrato 1:1 con GOSST (/sst/contratista/perfiles)
        sst.MapPost("/contratista/perfiles", async (HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
        {
            var idEmpresa = 773;
            if (ctx.Request.ContentLength is > 0)
            {
                var body = await ctx.Request.ReadFromJsonAsync(MsstJsonContext.Default.JsonElement, ct);
                if (body.ValueKind == System.Text.Json.JsonValueKind.Object &&
                    body.TryGetProperty("empresaId", out var emp))
                {
                    if (emp.ValueKind == System.Text.Json.JsonValueKind.Number && emp.TryGetInt32(out var n)) idEmpresa = n;
                    else if (emp.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(emp.GetString(), out var s)) idEmpresa = s;
                }
            }

            var resp = await repo.ObtenerPerfilesContratistaAsync(idEmpresa, ct);
            return Results.Json(resp, MsstJsonContext.Default.ContratistaPerfilesResponse);
        });

        // 4. GESTIÓN LOCAL DE ARCHIVOS Y EVIDENCIAS ON-PREMISE (Reemplazo de S3 /sst/evidencia/*)
        sst.MapGet("/evidencia/firmar", (HttpContext ctx) =>
        {
            var urlParam = ctx.Request.Query["url"].ToString();
            var resp = new FirmaEvidenciaResponse
            {
                CodeResponse = "05",
                Url = string.IsNullOrEmpty(urlParam) ? "/sst/evidencia/ver?codigo=DOC-PASST-2026" : urlParam
            };
            return Results.Json(resp, MsstJsonContext.Default.FirmaEvidenciaResponse);
        });

        // F02: Verificación real de existencia documental. Si el código no existe -> HTTP 404 explícito
        sst.MapGet("/evidencia/ver", async (HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
        {
            var codigo = ctx.Request.Query["codigo"].ToString().Trim();
            if (string.IsNullOrEmpty(codigo))
            {
                ctx.Response.StatusCode = 400;
                return Results.Content("<h3>Error: Se requiere el parámetro 'codigo' para la verificación documental.</h3>", "text/html; charset=utf-8", statusCode: 400);
            }

            bool encontrado = false;
            string nombreDoc = string.Empty;
            string moduloDoc = string.Empty;
            string estadoDoc = "VALIDADO";
            string fechaDoc = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

            await using (var conn = repo.CreateConnection())
            {
                await conn.OpenAsync(ct);

                // 1. Buscar en Sys_EvidenciaArchivo
                const string sqlEv = "SELECT TOP 1 NombreOriginal, Modulo, CONVERT(VARCHAR(16), FechaCarga, 120) AS Fecha FROM dbo.Sys_EvidenciaArchivo WHERE CodigoUnico = @Cod;";
                await using (var cmd = new SqlCommand(sqlEv, conn))
                {
                    cmd.Parameters.AddWithValue("@Cod", codigo);
                    await using var rdr = await cmd.ExecuteReaderAsync(ct);
                    if (await rdr.ReadAsync(ct))
                    {
                        encontrado = true;
                        nombreDoc = rdr["NombreOriginal"]?.ToString() ?? "Evidencia SSOMA";
                        moduloDoc = rdr["Modulo"]?.ToString() ?? "AUDITORIA";
                        fechaDoc = rdr["Fecha"]?.ToString() ?? fechaDoc;
                    }
                }

                // 2. Si no se encontró en Sys_EvidenciaArchivo, buscar en Ctr_DocumentoNivel
                if (!encontrado)
                {
                    const string sqlDoc = "SELECT TOP 1 NombreRequisito, Nivel, EstadoRevision, CONVERT(VARCHAR(10), FechaEmision, 103) AS Fecha FROM dbo.Ctr_DocumentoNivel WHERE ArchivoUrl LIKE '%' + @Cod + '%' AND Estado = 1;";
                    await using (var cmdDoc = new SqlCommand(sqlDoc, conn))
                    {
                        cmdDoc.Parameters.AddWithValue("@Cod", codigo);
                        await using var rdrDoc = await cmdDoc.ExecuteReaderAsync(ct);
                        if (await rdrDoc.ReadAsync(ct))
                        {
                            encontrado = true;
                            nombreDoc = rdrDoc["NombreRequisito"]?.ToString() ?? "Requisito SSOMA";
                            moduloDoc = rdrDoc["Nivel"]?.ToString() ?? "CONTRATISTA";
                            estadoDoc = rdrDoc["EstadoRevision"]?.ToString() ?? "APROBADO";
                            fechaDoc = rdrDoc["Fecha"]?.ToString() ?? fechaDoc;
                        }
                    }
                }
            }

            // F02: Si el código es sintético o no existe (ej. AUDITORIA-NO-EXISTE-20261024), devolver HTTP 404
            if (!encontrado)
            {
                ctx.Response.StatusCode = 404;
                var html404 = "<!DOCTYPE html><html lang='es'><head><meta charset='utf-8'><title>OneSST — Evidencia No Encontrada</title></head>" +
                              "<body style='font-family:Inter,Segoe UI,Arial,sans-serif;padding:30px;background:#fef2f2;color:#991b1b;'>" +
                              "<div style='max-width:720px;margin:0 auto;background:#fff;padding:28px;border-radius:14px;border:1px solid #fecaca;box-shadow:0 10px 25px -5px rgba(239,68,68,.1);'>" +
                              "<div style='display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #ef4444;padding-bottom:14px;margin-bottom:16px;'>" +
                              "<h2 style='margin:0;color:#991b1b;font-size:20px;'>OneSST — Evidencia No Encontrada (404)</h2>" +
                              "<span style='background:#fee2e2;color:#991b1b;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:700;'>CÓDIGO INEXISTENTE</span></div>" +
                              $"<p><strong>Resultado de Auditoría:</strong> El código documental <code>{System.Net.WebUtility.HtmlEncode(codigo)}</code> no existe en el repositorio institucional de evidencias ni cuenta con archivo cargado.</p>" +
                              "<p><strong>Dictamen:</strong> No se puede certificar la validez de un documento ausente.</p>" +
                              $"<p style='color:#64748b;font-size:12px;'>OneSST Enterprise — Integridad SSOMA ISO 45001 | {DateTime.Now:dd/MM/yyyy HH:mm:ss}</p>" +
                              "</div></body></html>";
                return Results.Content(html404, "text/html; charset=utf-8", statusCode: 404);
            }

            var html = $"<!DOCTYPE html><html lang='es'><head><meta charset='utf-8'><title>OneSST — Visor de Evidencia Digital ({codigo})</title></head>" +
                       "<body style='font-family:Inter,Segoe UI,Arial,sans-serif;padding:30px;background:#f1f5f9;color:#0f172a;'>" +
                       "<div style='max-width:720px;margin:0 auto;background:#fff;padding:28px;border-radius:14px;border:1px solid #e2e8f0;box-shadow:0 10px 25px -5px rgba(15,23,42,.08);'>" +
                       "<div style='display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0d9488;padding-bottom:14px;margin-bottom:16px;'>" +
                       $"<h2 style='margin:0;color:#0a2540;font-size:20px;'>OneSST — Evidencia Digital Verificada</h2>" +
                       $"<span style='background:#dcfce7;color:#166534;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:700;'>{System.Net.WebUtility.HtmlEncode(estadoDoc)}</span></div>" +
                       $"<p><strong>Requisito Verificado:</strong> {System.Net.WebUtility.HtmlEncode(nombreDoc)}</p>" +
                       $"<p><strong>Módulo / Nivel:</strong> {System.Net.WebUtility.HtmlEncode(moduloDoc)} | <strong>Plataforma:</strong> OneSST Enterprise</p>" +
                       "<p><strong>Estado de Auditoría:</strong> Documento cargado, validado y registrado en SQL Server On-Premise.</p>" +
                       $"<p><strong>Código de Trazabilidad:</strong> <code>{System.Net.WebUtility.HtmlEncode(codigo)}</code> | <strong>Fecha de Registro:</strong> {fechaDoc}</p>" +
                       "</div></body></html>";
            return Results.Content(html, "text/html; charset=utf-8");
        });

        // F15 & PR-02: Endpoint de cambio de contraseña con validación de complejidad
        sst.MapPost("/login/actualizar_clave/save", async (HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
        {
            using var reader = new StreamReader(ctx.Request.Body, Encoding.UTF8);
            var body = await reader.ReadToEndAsync(ct);
            string? pass = null;
            string? passConf = null;
            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(body);
                if (doc.RootElement.TryGetProperty("password", out var p)) pass = p.GetString();
                if (doc.RootElement.TryGetProperty("confirmacion", out var pc)) passConf = pc.GetString();
            }
            catch { }

            if (string.IsNullOrWhiteSpace(pass) || pass.Length < 8 ||
                !pass.Any(char.IsUpper) || !pass.Any(char.IsLower) || !pass.Any(char.IsDigit))
            {
                return Results.Json(new UniversalGosstResponse
                {
                    CodeResponse = "02",
                    StatusCode = "02",
                    MensajeRespuesta = "Requisito de seguridad (PR-02): La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una minúscula y un número."
                }, MsstJsonContext.Default.UniversalGosstResponse);
            }

            if (!string.IsNullOrEmpty(passConf) && pass != passConf)
            {
                return Results.Json(new UniversalGosstResponse
                {
                    CodeResponse = "02",
                    StatusCode = "02",
                    MensajeRespuesta = "La nueva contraseña y su confirmación no coinciden."
                }, MsstJsonContext.Default.UniversalGosstResponse);
            }

            await using var conn = repo.CreateConnection();
            await conn.OpenAsync(ct);
            await using var cmd = new SqlCommand("UPDATE dbo.Seg_Usuario SET PasswordHash = @P, Estado = 1 WHERE UserName = 'contratista' OR IdUsuario = 1;", conn);
            cmd.Parameters.AddWithValue("@P", pass);
            await cmd.ExecuteNonQueryAsync(ct);

            return Results.Json(new UniversalGosstResponse
            {
                CodeResponse = "05",
                StatusCode = "01",
                MensajeRespuesta = "Contraseña actualizada exitosamente con validación de seguridad."
            }, MsstJsonContext.Default.UniversalGosstResponse);
        });

        // ========================================================================
        // FLUJOS DE TRABAJO REGULATORIOS PERSISTENTES (ISO 45001 / LEY 29783)
        // ========================================================================
        sst.MapPost("/workflow/caso/lista", async (SqlServerAotRepository repo, CancellationToken ct) =>
        {
            var res = await repo.ListarCasosWorkflowAsync(ct);
            return Results.Json(res, MsstJsonContext.Default.WorkflowCasosResponse);
        });

        sst.MapMethods("/workflow/lista", HttpVerbs, async (HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
        {
            string? caso = null;
            int empresa = 773;
            string? estado = null;
            try
            {
                if (ctx.Request.ContentLength > 0)
                {
                    using var rdr = new StreamReader(ctx.Request.Body, Encoding.UTF8);
                    var b = await rdr.ReadToEndAsync(ct);
                    if (!string.IsNullOrWhiteSpace(b))
                    {
                        using var doc = System.Text.Json.JsonDocument.Parse(b);
                        var r = doc.RootElement;
                        if (r.TryGetProperty("codigoCaso", out var cProp)) caso = cProp.GetString();
                        if (r.TryGetProperty("tipoCaso", out var tProp)) caso = tProp.GetString();
                        if (r.TryGetProperty("idEmpresa", out var eProp)) empresa = eProp.GetInt32();
                        if (r.TryGetProperty("estadoGeneral", out var sProp)) estado = sProp.GetString();
                    }
                }
            }
            catch { }

            var res = await repo.ListarExpedientesWorkflowAsync(caso, empresa, estado, ct);
            return Results.Json(res, MsstJsonContext.Default.WorkflowExpedientesResponse);
        });

        sst.MapPost("/workflow/expediente/lista", async (HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
        {
            string? caso = null;
            int empresa = 773;
            string? estado = null;
            try
            {
                if (ctx.Request.ContentLength > 0)
                {
                    using var rdr = new StreamReader(ctx.Request.Body, Encoding.UTF8);
                    var b = await rdr.ReadToEndAsync(ct);
                    if (!string.IsNullOrWhiteSpace(b))
                    {
                        using var doc = System.Text.Json.JsonDocument.Parse(b);
                        var r = doc.RootElement;
                        if (r.TryGetProperty("codigoCaso", out var cProp)) caso = cProp.GetString();
                        if (r.TryGetProperty("tipoCaso", out var tProp)) caso = tProp.GetString();
                        if (r.TryGetProperty("idEmpresa", out var eProp)) empresa = eProp.GetInt32();
                        if (r.TryGetProperty("estadoGeneral", out var sProp)) estado = sProp.GetString();
                    }
                }
            }
            catch { }

            var res = await repo.ListarExpedientesWorkflowAsync(caso, empresa, estado, ct);
            return Results.Json(res, MsstJsonContext.Default.WorkflowExpedientesResponse);
        });

        sst.MapPost("/workflow/expediente/save", async (HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
        {
            using var rdr = new StreamReader(ctx.Request.Body, Encoding.UTF8);
            var b = await rdr.ReadToEndAsync(ct);
            var req = new WorkflowGuardarExpedienteRequest();
            try
            {
                if (!string.IsNullOrWhiteSpace(b))
                {
                    req = JsonSerializer.Deserialize(b, MsstJsonContext.Default.WorkflowGuardarExpedienteRequest) ?? req;
                }
            }
            catch { }
            var res = await repo.GuardarExpedienteWorkflowAsync(req, ct);
            return Results.Json(res, MsstJsonContext.Default.WorkflowExpedienteDto);
        });

        sst.MapPost("/workflow/transicion", async (HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
        {
            using var rdr = new StreamReader(ctx.Request.Body, Encoding.UTF8);
            var b = await rdr.ReadToEndAsync(ct);
            var req = new WorkflowTransicionRequest();
            try
            {
                if (!string.IsNullOrWhiteSpace(b))
                {
                    req = JsonSerializer.Deserialize(b, MsstJsonContext.Default.WorkflowTransicionRequest) ?? req;
                }
            }
            catch { }
            try
            {
                await repo.RegistrarTransicionWorkflowAsync(req, ct);
                return Results.Json(new UniversalGosstResponse
                {
                    CodeResponse = "05",
                    StatusCode = "01",
                    Operacion = "WORKFLOW_TRANSICION",
                    MensajeRespuesta = $"Transición a Etapa {req.Etapa} ({req.Estado}) registrada y persistida en SQL Server."
                }, MsstJsonContext.Default.UniversalGosstResponse);
            }
            catch (Microsoft.Data.SqlClient.SqlException sqlex)
            {
                ctx.Response.StatusCode = 422;
                return Results.Json(new UniversalGosstResponse
                {
                    CodeResponse = "25",
                    StatusCode = "00",
                    Operacion = "WORKFLOW_TRANSICION",
                    MensajeRespuesta = sqlex.Message
                }, MsstJsonContext.Default.UniversalGosstResponse, statusCode: 422);
            }
        });

        sst.MapPost("/workflow/trazabilidad", async (HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
        {
            string codigo = string.Empty;
            try
            {
                using var rdr = new StreamReader(ctx.Request.Body, Encoding.UTF8);
                var b = await rdr.ReadToEndAsync(ct);
                if (!string.IsNullOrWhiteSpace(b))
                {
                    using var doc = System.Text.Json.JsonDocument.Parse(b);
                    if (doc.RootElement.TryGetProperty("codigoExpediente", out var p)) codigo = p.GetString() ?? string.Empty;
                    else if (doc.RootElement.TryGetProperty("codigo", out var p2)) codigo = p2.GetString() ?? string.Empty;
                }
            }
            catch { }

            var res = await repo.ObtenerTrazabilidadWorkflowAsync(codigo, ct);
            return Results.Json(res, MsstJsonContext.Default.WorkflowTrazabilidadResponse);
        });

        // 5. RUTAS EXPLÍCITAS DE LISTADO SPRINT 1, SPRINT 2 Y SPRINT 3 (MÓDULOS 01 AL 12)
        foreach (var rutaLista in RutasListadoSprint1A3)
        {
            var rutaCapturada = rutaLista;
            sst.MapMethods(rutaCapturada, HttpVerbs, (HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
                ProcesarRutaSstAsync(rutaCapturada, ctx, repo, ct));
        }

        // 6. MOTOR UNIVERSAL DE LAS 1,344 RUTAS REST Y ACCIONES CRUD (/sst/{**catchAll})
        sst.MapMethods("/{**catchAll}", HttpVerbs, (string catchAll, HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct) =>
        {
            var relativeRoute = "/" + catchAll.TrimStart('/');
            return ProcesarRutaSstAsync(relativeRoute, ctx, repo, ct);
        });
    }

    private static async Task<IResult> ProcesarRutaSstAsync(string relativeRoute, HttpContext ctx, SqlServerAotRepository repo, CancellationToken ct)
    {
        string? bodyText = null;
        if (ctx.Request.ContentLength is > 0 || ctx.Request.Method == "POST" || ctx.Request.Method == "PUT" || ctx.Request.Method == "DELETE")
        {
            using var reader = new StreamReader(ctx.Request.Body, Encoding.UTF8);
            bodyText = await reader.ReadToEndAsync(ct);
        }

        if (string.IsNullOrWhiteSpace(bodyText) && ctx.Request.Query.TryGetValue("id", out var idVal) && !string.IsNullOrWhiteSpace(idVal))
        {
            bodyText = $"{{\"id\":{idVal}}}";
        }

        var response = await repo.EjecutarEndpointUniversalAsync(relativeRoute, bodyText, ct);
        return Results.Json(response, MsstJsonContext.Default.UniversalGosstResponse);
    }
}
