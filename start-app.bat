@echo off
echo Démarrage de l'application ContAfricaX...

echo Démarrage du serveur backend...
start cmd /k "npm run server-win"

echo Attente de 5 secondes pour que le serveur backend démarre...
timeout /t 5 /nobreak > nul

echo Démarrage du frontend...
start cmd /k "npm run dev"

echo Application démarrée !
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3000
