# =============================================================================
# OneSST Enterprise — Multi-Stage Dockerfile Multi-Cloud
# Compatible con: AWS App Runner/ECS, Google Cloud Run, Azure Container Apps
# Pila: Angular v22+ (Frontend) + .NET 10 Native AOT (Backend)
# =============================================================================

# -----------------------------------------------------------------------------
# ETAPA 1: Construcción del Frontend Angular v22+
# -----------------------------------------------------------------------------
FROM node:22-alpine AS build-frontend
WORKDIR /src/frontend

COPY Frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY Frontend/ ./
RUN npm run build

# -----------------------------------------------------------------------------
# ETAPA 2: Compilación Nativa AOT del Backend en .NET 10 (Linux x64)
# -----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/nightly/sdk:10.0-noble AS build-backend
WORKDIR /src/backend

# Instalar dependencias nativas del compilador clang / zlib para Native AOT
RUN apt-get update && apt-get install -y --no-install-recommends \
    clang \
    zlib1g-dev \
    libkrb5-dev \
    && rm -rf /var/lib/apt/lists/*

COPY Backend/Msst.Backend.csproj ./
RUN dotnet restore

COPY Backend/ ./
RUN dotnet publish -c Release -r linux-x64 -o /app/publish --self-contained true

# Copiar el build de Angular generado en la Etapa 1 dentro del directorio wwwroot del binario
COPY --from=build-frontend /src/frontend/dist/msst-frontend/browser /app/publish/wwwroot

# -----------------------------------------------------------------------------
# ETAPA 3: Imagen Final de Producción de Ultra-Bajo Peso (Chiseled Distroless)
# Tamaño final aproximado: ~35 MB (Sin SDK, sin Node, sin CLR administrado)
# -----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/nightly/runtime-deps:10.0-noble-chiseled AS runtime
WORKDIR /app

# Copiar exclusivamente el ejecutable compilado a código máquina nativo y sus activos web
COPY --from=build-backend /app/publish/ ./

# Usuario sin privilegios por defecto (Seguridad reforzada para compliance bancario / industrial)
USER $APP_UID

# Variables de entorno por defecto (adaptables por orquestadores Cloud)
ENV PORT=5000
ENV ASPNETCORE_URLS=http://0.0.0.0:5000

# Endpoint de liveness y readiness para balanceadores de carga Cloud
EXPOSE 5000

ENTRYPOINT ["./Msst.Backend"]
