@echo off
setlocal
cd /d "%~dp0"
echo =================================================================
echo  OneSST Enterprise - Compilacion Unificada del Monorepo
echo =================================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-monorepo.ps1"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] La compilacion fallo con codigo %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo Compilacion finalizada correctamente.
pause
