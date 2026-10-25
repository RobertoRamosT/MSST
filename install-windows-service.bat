@echo off
setlocal
cd /d "%~dp0"
echo Solicitando permisos de administrador para registrar el servicio...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"%~dp0install-windows-service.ps1\"'"
