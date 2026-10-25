<#
.SYNOPSIS
    Script de Ejecución para el Monorepo OneSST Enterprise.
.DESCRIPTION
    Inicia el binario nativo .NET 10 Native AOT que sirve tanto los 1,344 endpoints REST
    como los activos estáticos y SPA fallback de Angular v22+.
#>

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendExe = Join-Path $rootDir "Backend\publish\Msst.Backend.exe"

if (-not (Test-Path $backendExe)) {
    Write-Host "[ALERTA] No se encontro el binario compilado en: $backendExe" -ForegroundColor Yellow
    Write-Host "Ejecutando compilacion previa del Monorepo..." -ForegroundColor Cyan
    & (Join-Path $rootDir "build-monorepo.ps1")
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Iniciando OneSST Enterprise (.NET 10 Native AOT + Angular v22+)" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Backend REST:   http://localhost:5000/sst" -ForegroundColor Green
Write-Host " Frontend SPA:   http://localhost:5000 / http://localhost:4200" -ForegroundColor Green
Write-Host " Presione Ctrl+C para detener el servidor." -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan

Set-Location (Join-Path $rootDir "Backend\publish")
& ".\Msst.Backend.exe" --urls "http://localhost:5000;http://localhost:4200"
