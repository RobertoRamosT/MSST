<#
.SYNOPSIS
    Script de Compilación Unificada para el Monorepo OneSST Enterprise.
.DESCRIPTION
    Compila el Frontend en Angular v22+ y publica el Backend en .NET 10 Native AOT.
#>

$ErrorActionPreference = "Stop"
$swTotal = [System.Diagnostics.Stopwatch]::StartNew()

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " OneSST Enterprise - Compilación Unificada del Monorepo" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $rootDir "Frontend"
$backendDir = Join-Path $rootDir "Backend"
$publishDir = Join-Path $backendDir "publish"

# 1. Compilación del Frontend Angular v22+
Write-Host "`n[1/2] Compilando Frontend Angular (Zoneless + Standalone)..." -ForegroundColor Yellow
$swFront = [System.Diagnostics.Stopwatch]::StartNew()
Push-Location $frontendDir
try {
    npm run build
    $swFront.Stop()
    Write-Host "Frontend compilado exitosamente en $($swFront.Elapsed.TotalSeconds.ToString('F1'))s" -ForegroundColor Green
}
finally {
    Pop-Location
}

# 2. Compilación del Backend .NET 10 Native AOT
Write-Host "`n[2/2] Compilando Backend .NET 10 Native AOT (x64)..." -ForegroundColor Yellow
$swBack = [System.Diagnostics.Stopwatch]::StartNew()
Push-Location $backendDir
try {
    dotnet publish -c Release -r win-x64 -o "$publishDir"
    $swBack.Stop()
    Write-Host "Backend AOT compilado exitosamente en $($swBack.Elapsed.TotalSeconds.ToString('F1'))s" -ForegroundColor Green
}
finally {
    Pop-Location
}

# 3. Verificación de Artefactos
$exePath = Join-Path $publishDir "Msst.Backend.exe"
if (Test-Path $exePath) {
    $exeSizeMB = [math]::Round((Get-Item $exePath).Length / 1MB, 2)
    Write-Host "`n=================================================================" -ForegroundColor Green
    Write-Host " Compilación Exitosa del Monorepo en $($swTotal.Elapsed.TotalSeconds.ToString('F1'))s" -ForegroundColor Green
    Write-Host " Binario Nativo Generado: $exePath ($exeSizeMB MB)" -ForegroundColor Green
    Write-Host " SPA Angular Lista en:    $frontendDir\dist\msst-frontend\browser" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
} else {
    Write-Error "No se encontró el ejecutable nativo en: $exePath"
}
