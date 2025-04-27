@echo off
echo Demarrage de l'application ContAfricaX...

echo Demarrage du serveur backend...
start cmd /k "npm run server-win"

echo Attente de 5 secondes pour que le serveur backend demarre...
timeout /t 5 /nobreak > nul

echo Demarrage du frontend...
start cmd /k "npm run dev"

echo Application demarree !
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3000
