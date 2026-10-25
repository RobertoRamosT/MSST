<#
.SYNOPSIS
    Script de Desinstalación del Servicio OneSST de Windows.
#>

$serviceName = "MsstIndustrialService"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

Write-Host "Deteniendo servicio $serviceName..." -ForegroundColor Yellow
Stop-Service -Name $serviceName -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "Eliminando servicio del sistema..." -ForegroundColor Cyan
sc.exe delete $serviceName

Write-Host "Servicio desinstalado correctamente." -ForegroundColor Green
