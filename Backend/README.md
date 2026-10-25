# MSST Backend — .NET 10 Web API (Native AOT)

## Especificaciones Técnicas
- **Framework:** `.NET 10.0` (`Microsoft.NET.Sdk.Web`)
- **Compilación:** `PublishAot=true` (Native AOT libre de reflexión)
- **Serialización:** `MsstJsonContext : JsonSerializerContext` (Source Generators en [`Serialization/MsstJsonContext.cs`](file:///D:/Temp/Maximo/MSST/Backend/Serialization/MsstJsonContext.cs))
- **Base de Datos:** SQL Server Local `DESKTOP-LOCAL` | Base de datos: `MSST_DB` | Autenticación: Windows Authentication (`Integrated Security=True;TrustServerCertificate=True`)
- **Cobertura de Rutas:** 43 Módulos / **1,344 Endpoints REST (`/sst/*`)** en [`Endpoints/GosstEndpointMapper.cs`](file:///D:/Temp/Maximo/MSST/Backend/Endpoints/GosstEndpointMapper.cs) y [`Data/SqlServerAotRepository.cs`](file:///D:/Temp/Maximo/MSST/Backend/Data/SqlServerAotRepository.cs).

## Ejecución Rápida
```powershell
dotnet build -c Release
.\bin\Release\net10.0\Msst.Backend.exe --urls "http://localhost:5000"
```
