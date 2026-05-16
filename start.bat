@echo off
echo 🔥 Démarrage Collège Le Flambeau
echo ===============================

cd /d "%~dp0"

echo 📦 Vérification Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou pas dans le PATH
    echo Téléchargez depuis https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js trouvé

echo �️ Initialisation de la base de données...
cd backend
set PATH=%PATH%;C:\Program Files\nodejs\
npm run init-db
cd ..

echo �🚀 Démarrage du Backend...
start "Backend - Collège Le Flambeau" cmd /k "cd backend && set PATH=%PATH%;C:\Program Files\nodejs\ && npm run dev"

timeout /t 3 /nobreak >nul

echo 🚀 Démarrage du Frontend...
start "Frontend - Collège Le Flambeau" cmd /k "cd frontend && set PATH=%PATH%;C:\Program Files\nodejs\ && npm run dev"

echo.
echo ✅ Serveurs démarrés!
echo.
echo 🌐 Accédez à l'application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo.
echo 📝 Comptes de test:
echo    Admin: admin@leflambeau.edu.ht / password123
echo    Prof: teacher@leflambeau.edu.ht / password123
echo    Parent: parent@leflambeau.edu.ht / password123
echo    Élève: student@leflambeau.edu.ht / password123
echo.
pause