<#
.SYNOPSIS
    Script para realizar push del Monorepo OneSST a GitHub.
.DESCRIPTION
    Verifica la existencia del repositorio remoto en GitHub y ejecuta el push de la rama main.
#>

$repoUrl = "https://github.com/RobertoRamosT/MSST.git"
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Enviando Monorepo OneSST a GitHub ($repoUrl)..." -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

Set-Location "$PSScriptRoot"

# Verificar si el repositorio remoto responde
try {
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n[EXITO] El Monorepo se sincronizo correctamente con GitHub." -ForegroundColor Green
    } else {
        Write-Host "`n[AVISO] No se pudo completar el push. Asegurate de haber creado el repositorio 'MSST' en https://github.com/new" -ForegroundColor Yellow
    }
} catch {
    Write-Host "`n[ERROR] Ocurrio un error al ejecutar git push: $_" -ForegroundColor Red
}
