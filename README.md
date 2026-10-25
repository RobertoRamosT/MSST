# OneSST Enterprise — Repositorio Exclusivo de Código Fuente

Este repositorio contiene **exclusivamente el código fuente** de la solución corporativa de Seguridad y Salud en el Trabajo, estructurado de forma independiente en dos proyectos limpios:

```
D:\Temp\Maximo\MSST\
├── .git/                                # Repositorio Git Monorepo (Rama: main)
├── .gitattributes                       # Normalización de saltos de línea LF/CRLF y binarios
├── .gitignore                           # Exclusión optimizada para .NET 10 y Angular v22+
├── README.md                            # Guía del código fuente
│
├── Backend/                             # Código Fuente de Servicios y Acceso a Datos (.NET 10 Native AOT)
│   ├── Data/                            # Repositorio AOT para SQL Server (sin EF Core ni reflexión)
│   ├── Endpoints/                       # Mapeo de los 43 módulos y 1,344 endpoints REST (/sst/*)
│   ├── Models/                          # Modelos de datos y DTOs fuertemente tipados
│   ├── Properties/                      # Perfiles de inicio y launchSettings.json
│   ├── Serialization/                   # JsonSerializerContext para compilación AOT estricta
│   ├── Msst.Backend.csproj              # Proyecto .NET 10 con PublishAot=true
│   ├── Msst.Backend.http                # Pruebas HTTP directas de endpoints
│   ├── Program.cs                       # Servidor Kestrel nativo con SPA Fallback y liveness probe
│   └── appsettings.json                 # Configuración de conexiones y logging
│
└── Frontend/                            # Código Fuente de Interfaz de Usuario (Angular v22+)
    ├── src/
    │   ├── app/                         # Arquitectura Standalone, Zoneless y Signals
    │   │   ├── core/                    # Servicios de API, sesión, catálogo y modelos DTO
    │   │   ├── features/                # Módulos operativos, portal de contratistas y workflows
    │   │   ├── layout/                  # Barra superior, navegación y sidebar auto-hidden
    │   │   └── shared/                  # Componentes reutilizables
    │   ├── assets/                      # Recursos visuales y estilos SCSS/CSS
    │   ├── index.html                   # Documento raíz con metadatos UTF-8
    │   └── main.ts                      # Bootstrap de Angular sin Zone.js
    ├── public/sstweb/pages/             # 42 Ventanas HTML de gestión operativa
    ├── angular.json                     # Configuración del compilador Angular CLI
    ├── package.json                     # Dependencias y scripts de construcción
    └── tsconfig.json                    # Configuración TypeScript estricta
```

---

## 1. Comandos Estándar de Construcción del Código Fuente

### Frontend (Angular v22+)
```powershell
Set-Location "D:\Temp\Maximo\MSST\Frontend"
npm run build
```

### Backend (.NET 10 Native AOT)
```powershell
Set-Location "D:\Temp\Maximo\MSST\Backend"
dotnet publish -c Release -r win-x64 -o publish
```

---

## 2. Repositorio de Información, Documentación, Base de Datos y Despliegue

Todo el material que no corresponde a código fuente se encuentra estrictamente centralizado en:
👉 **[`D:\Temp\Maximo\MSST_Info`](file:///D:/Temp/Maximo/MSST_Info/README.md)**

Estructura de `MSST_Info`:
- **`01_Documento_Proyecto_y_Alcance/`**: Documento maestro del proyecto y alcance funcional.
- **`02_Presupuesto_y_Sustento_Costos/`**: Presupuesto y sustento técnico-financiero.
- **`03_Arquitectura_y_Diagramas/`**: Diagramas C4, ERD, funcional y de secuencia.
- **`04_SQL_Server_Scripts/`**: Scripts de base de datos DDL, DML y procedimientos almacenados.
- **`05_Pautas_Criterios_y_Reglas_Tecnicas/`**: Estándares de desarrollo y directivas editoriales.
- **`06_Herramientas_Aceleracion/`**: Scripts de análisis y QA de código legado.
- **`06_QA_Auditoria/`**: Reportes de auditoría de calidad y cumplimiento normativo.
- **`07_Despliegue_Hosting_y_Servicios/`**:
  - Scripts de instalación y desinstalación de Servicio de Windows (`install-windows-service.*`, `uninstall-windows-service.*`).
  - Contenedor multi-cloud (`Dockerfile` y `.dockerignore`).
  - Scripts de automatización de compilación y ejecución (`build-monorepo.*`, `run-monorepo.*`).
  - Scripts de sincronización Git (`push-to-github.*`).
