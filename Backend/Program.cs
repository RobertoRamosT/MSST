using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting.WindowsServices;
using Msst.Backend.Data;
using Msst.Backend.Endpoints;
using Msst.Backend.Serialization;

var builder = WebApplication.CreateSlimBuilder(args);

// 1. Integración Nativa con el Servicio de Windows (Localhost / On-Premise)
//    Permite que Msst.Backend.exe se registre en Windows Service Control Manager (services.msc)
//    manteniendo al mismo tiempo ejecución en consola y contenedores Cloud.
if (OperatingSystem.IsWindows())
{
    builder.Services.AddWindowsService(options =>
    {
        options.ServiceName = "MsstIndustrialService";
    });
}

// 2. Soporte Dinámico Multi-Cloud (AWS App Runner / ECS, Google Cloud Run, Azure Container Apps)
//    Lee automáticamente el puerto asignado por el orquestador Cloud mediante la variable $PORT.
var cloudPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(cloudPort) && int.TryParse(cloudPort, out var p))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{p}");
}

// 3. Configuración de Serialización JSON sin Reflexión (.NET 10 Native AOT)
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, MsstJsonContext.Default);
});

// 4. Configuración de CORS para el Frontend Angular v22+ (con credenciales / cookies)
builder.Services.AddCors(options =>
{
    options.AddPolicy("MsstFrontendPolicy", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 5. Inyección explícita del Repositorio AOT para SQL Server (Localhost / Cloud RDS / Azure SQL)
builder.Services.AddSingleton<SqlServerAotRepository>();

var app = builder.Build();

app.UseCors("MsstFrontendPolicy");

// 6. Endpoint de Salud para Orquestadores Cloud (Liveness & Readiness Probe para AWS / GCP / Azure / K8s)
//    Implementado sin reflexión para compatibilidad estricta con .NET 10 Native AOT
app.MapGet("/health", async context =>
{
    context.Response.ContentType = "application/json; charset=utf-8";
    var json = $"{{\"status\":\"Healthy\",\"service\":\"OneSST Enterprise .NET 10 Native AOT\",\"timestamp\":\"{DateTime.UtcNow:o}\",\"os\":\"{Environment.OSVersion}\"}}";
    await context.Response.WriteAsync(json);
});

// 7. Mapeo de los 43 módulos y 1,344 endpoints REST (/sst/*)
app.MapGosstEndpoints();

// 8. Publicación Unificada: Servidor de Archivos Estáticos y SPA Fallback hacia Angular 22+
//    Resuelve rutas robustas para: Windows Service (AppContext.BaseDirectory), Docker Cloud y Desarrollo Local.
var baseDir = AppContext.BaseDirectory;
var candidatePaths = new[]
{
    Path.Combine(baseDir, "wwwroot"),
    Path.GetFullPath(Path.Combine(baseDir, "..", "..", "Frontend", "dist", "msst-frontend", "browser")),
    Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "Frontend", "dist", "msst-frontend", "browser")),
    @"D:\Temp\Maximo\MSST\Frontend\dist\msst-frontend\browser"
};

var frontendDistPath = candidatePaths.FirstOrDefault(Directory.Exists);

if (!string.IsNullOrEmpty(frontendDistPath) && Directory.Exists(frontendDistPath))
{
    var fileProvider = new PhysicalFileProvider(frontendDistPath);
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = fileProvider });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = fileProvider });

    app.MapFallback(async context =>
    {
        var reqPath = context.Request.Path.Value ?? string.Empty;
        if (reqPath.StartsWith("/sst/", StringComparison.OrdinalIgnoreCase) || reqPath.Equals("/health", StringComparison.OrdinalIgnoreCase))
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            return;
        }

        var indexFile = Path.Combine(frontendDistPath, "index.html");
        if (File.Exists(indexFile))
        {
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.SendFileAsync(indexFile);
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
        }
    });
}

app.Run();
