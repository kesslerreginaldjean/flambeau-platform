@echo off
echo Demarrage Collège Le Flambeau
echo ==============================

cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js n'est pas installe ou pas dans le PATH.
    echo Telechargez depuis https://nodejs.org/
    pause
    exit /b 1
)

echo Backend...
start "Backend - Flambeau" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Frontend...
start "Frontend - Flambeau" cmd /k "cd frontend && npm run dev"

echo.
echo Serveurs en cours de demarrage.
echo Frontend : http://localhost:3000
echo Backend  : http://localhost:5000
echo.
echo IMPORTANT - Aucun mot de passe par defaut n'est expose ici.
echo Creez le premier compte admin via : cd backend ^&^& npm run db:seed
echo.
pause
