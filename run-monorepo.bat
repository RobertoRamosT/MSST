@echo off
setlocal
cd /d "%~dp0"
echo =================================================================
echo  Iniciando OneSST Enterprise
echo =================================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-monorepo.ps1"
