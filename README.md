# OneSST Enterprise — Repositorio Unificado Monorepo

Sistema Integral de Seguridad y Salud en el Trabajo de Alta Concurrencia y Máxima Disponibilidad.

---

## 1. Arquitectura del Monorepo

Este repositorio unifica el ciclo de vida, versionado y despliegue del sistema **OneSST**, estructurado con estricta separación de responsabilidades:

```
D:\Temp\Maximo\MSST\
├── .git/                                # Repositorio Git Monorepo (Rama: main)
├── .gitattributes                       # Normalización de saltos de línea LF/CRLF y binarios
├── .gitignore                           # Exclusión optimizada para .NET 10 y Angular v22+
├── build-monorepo.bat / .ps1            # Script de compilación unificada en un solo clic
├── run-monorepo.bat / .ps1              # Script de ejecución local del servidor autónomo
├── README.md                            # Guía y documentación del Monorepo
│
├── Backend/                             # Capa de Servicios y Acceso a Datos
│   ├── Data/                            # Repositorio AOT para SQL Server (sin EF Core)
│   ├── Endpoints/                       # Mapeo de los 43 módulos y 1,344 endpoints REST
│   ├── Models/                          # DTOs y modelos de datos tipados
│   ├── Serialization/                   # JsonSerializerContext (Cero reflexión en runtime)
│   ├── Msst.Backend.csproj              # Configuración .NET 10 Native AOT
│   └── Program.cs                       # Servidor Kestrel embebido con SPA Fallback
│
└── Frontend/                            # Capa de Interfaz de Usuario y Experiencia
    ├── src/
    │   ├── app/                         # Componentes Standalone, Zoneless y Signals
    │   │   ├── core/                    # Servicios de API, Autenticación y Auditoría
    │   │   ├── features/                # Vistas modernas (Portal Contratistas, Workflows)
    │   │   └── shared/                  # Componentes reutilizables de UI
    │   └── assets/                      # Estilos, iconografía y recursos visuales
    ├── public/sstweb/pages/             # 42 Ventanas HTML de gestión operativa 1:1
    ├── angular.json                     # Configuración del compilador Angular CLI
    └── package.json                     # Dependencias y scripts de construcción
```

---

## 2. Comandos de Construcción y Ejecución

### Compilación Completa (Frontend + Backend AOT)
Desde la raíz del repositorio, ejecuta el script automatizado:
```powershell
.\build-monorepo.ps1
```
O mediante el archivo batch para doble clic:
```cmd
build-monorepo.bat
```
*Este proceso compila la SPA de Angular v22+ en `Frontend/dist` y genera el binario nativo x64 `Msst.Backend.exe` en `Backend/publish`.*

### Ejecución Local
Para arrancar el sistema completo (.NET 10 Native AOT + Angular SPA):
```powershell
.\run-monorepo.ps1
```
- **Backend API:** `http://localhost:5000/sst`
- **Frontend SPA:** `http://localhost:5000` o `http://localhost:4200`

---

## 3. Convenciones de Commits en el Monorepo

Para mantener un historial limpio, trazable y estructurado, se sigue la convención de [Conventional Commits](https://www.conventionalcommits.org/):

| Ámbito | Prefijo | Ejemplo |
| :--- | :--- | :--- |
| **Backend** | `feat(backend):` / `fix(backend):` | `feat(backend): Implementar endpoint de transiciones con sellado criptográfico` |
| **Frontend** | `feat(frontend):` / `fix(frontend):` | `feat(frontend): Conectar modal de workflows reactivos a señales de estado` |
| **Monorepo / Infra** | `chore(repo):` / `ci(build):` | `chore(repo): Actualizar scripts de compilación unificada y gitattributes` |
| **Documentación** | `docs(readme):` | `docs(readme): Actualizar guía de despliegue y variables de entorno` |

---

## 4. Repositorio de Información y Diseño
Toda la documentación técnica, diagramas C4, esquemas de bases de datos, scripts SQL Server y análisis de cumplimiento normativo se encuentran archivados en:
- **[`D:\Temp\Maximo\MSST_Info`](file:///D:/Temp/Maximo/MSST_Info/README.md)**
