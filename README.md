# MSST Enterprise — Repositorio de Código Fuente (.NET 10 Native AOT + Angular 22+)

Este directorio contiene exclusivamente el código fuente del sistema **MSST** (Migración 1:1 de GOSST), estrictamente separado en dos capas independientes:

1. **[`Backend/`](file:///D:/Temp/Maximo/MSST/Backend)**:
   - Proyecto **.NET 10 Web API con Native AOT (`PublishAot=true`)** (`Msst.Backend.csproj`).
   - Conectado directamente al servidor local **SQL Server (`DESKTOP-LOCAL` / Base de Datos `MSST_DB`)** mediante **Windows Authentication (`Integrated Security=True`)**.
   - Expone los **43 módulos** y las **1,344 rutas REST (`/sst/*`)** sin reflexión en tiempo de ejecución (`MsstJsonContext : JsonSerializerContext`).

2. **[`Frontend/`](file:///D:/Temp/Maximo/MSST/Frontend)**:
   - Proyecto **Angular (Standalone + Zoneless + Signals)**.
   - Incluye la arquitectura reactiva (`GosstApiService`, `GosstSessionService`, `gosstAuthInterceptor`), el Portal de Contratistas y Módulos SST, y las **42 ventanas HTML originales 1:1** (`public/sstweb/pages/*.html`) preconfiguradas para consumir el backend local (`http://localhost:5000/sst`).

---

## Documentación, Scripts SQL Server, Presupuesto y Diagramas de Arquitectura
Toda la documentación de sustento del proyecto, scripts SQL Server, presupuestos y diagramas (Arquitectura General, Backend AOT, Frontend Angular, Entidad-Relación ERD, Funcionales y de Secuencia) se encuentra separada en:
- **[`D:\Temp\Maximo\MSST_Info`](file:///D:/Temp/Maximo/MSST_Info/README.md)**
