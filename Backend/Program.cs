using Microsoft.Extensions.FileProviders;
using Msst.Backend.Data;
using Msst.Backend.Endpoints;
using Msst.Backend.Serialization;

var builder = WebApplication.CreateSlimBuilder(args);

// 1. Configuración de Serialización JSON sin Reflexión (.NET 10 Native AOT)
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, MsstJsonContext.Default);
});

// 2. Configuración de CORS para el Frontend Angular v22+ (con credenciales / cookies)
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

// 3. Inyección explícita del Repositorio AOT para SQL Server (DESKTOP-LOCAL)
builder.Services.AddSingleton<SqlServerAotRepository>();

var app = builder.Build();

app.UseCors("MsstFrontendPolicy");

// 4. Mapeo de los 43 módulos y 1,344 endpoints REST (/sst/*)
app.MapGosstEndpoints();

// 5. Publicación Localhost: Servidor de Archivos Estáticos y SPA Fallback hacia el build de Angular 22+
//    Mantiene separación física estricta entre D:\Temp\Maximo\MSST\Backend y D:\Temp\Maximo\MSST\Frontend
var frontendDistPath = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "Frontend", "dist", "msst-frontend", "browser"));
if (!Directory.Exists(frontendDistPath))
{
    frontendDistPath = @"D:\Temp\Maximo\MSST\Frontend\dist\msst-frontend\browser";
}

if (Directory.Exists(frontendDistPath))
{
    var fileProvider = new PhysicalFileProvider(frontendDistPath);
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = fileProvider });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = fileProvider });

    app.MapFallback(async context =>
    {
        var reqPath = context.Request.Path.Value ?? string.Empty;
        if (reqPath.StartsWith("/sst/", StringComparison.OrdinalIgnoreCase))
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
