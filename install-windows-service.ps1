<#
.SYNOPSIS
    Script de Instalación y Registro de OneSST como Servicio Nativo de Windows.
.DESCRIPTION
    Registra Msst.Backend.exe en el Service Control Manager (SCM) con arranque automático
    y política de autorrecuperación inmediata ante fallos.
#>

$serviceName = "MsstIndustrialService"
$displayName = "OneSST - Sistema de Seguridad y Salud en el Trabajo (.NET 10 Native AOT)"
$binPath = "D:\Temp\Maximo\MSST\Backend\publish\Msst.Backend.exe --urls http://0.0.0.0:5000;http://0.0.0.0:4200"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Instalando Servicio de Windows: $serviceName" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Comprobar permisos de administrador
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[ALERTA] Este script requiere ejecutarse con privilegios de Administrador." -ForegroundColor Yellow
    Write-Host "Abriendo PowerShell elevado..." -ForegroundColor Cyan
    Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

# 2. Detener y eliminar servicio previo si ya existía
$existing = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Deteniendo versión previa del servicio..." -ForegroundColor Yellow
    Stop-Service -Name $serviceName -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    sc.exe delete $serviceName | Out-Null
    Start-Sleep -Seconds 2
}

# 3. Crear el servicio con sc.exe
Write-Host "Registrando servicio en Windows Service Control Manager..." -ForegroundColor Cyan
$cmdCreate = "sc.exe create `"$serviceName`" binPath= `"$binPath`" start= auto DisplayName= `"$displayName`""
Invoke-Expression $cmdCreate

# 4. Configurar reinicio automático ante cualquier fallo (1s, 2s, 5s)
sc.exe failure $serviceName reset= 86400 actions= restart/1000/restart/2000/restart/5000

# 5. Iniciar el servicio
Write-Host "Iniciando servicio..." -ForegroundColor Cyan
Start-Service -Name $serviceName

$status = Get-Service -Name $serviceName
Write-Host "`n=================================================================" -ForegroundColor Green
Write-Host " Servicio Registrado e Iniciado Exitosamente:" -ForegroundColor Green
Write-Host " Nombre:  $($status.Name)" -ForegroundColor Green
Write-Host " Estado:  $($status.Status)" -ForegroundColor Green
Write-Host " URLs:    http://localhost:5000 y http://localhost:4200" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
