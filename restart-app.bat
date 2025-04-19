@echo off
echo Arrêt des processus existants...
taskkill /F /IM node.exe /T

echo Nettoyage du cache...
rmdir /S /Q node_modules\.vite

echo Démarrage du serveur backend...
start cmd /k "npm run server-win"

echo Attente de 5 secondes...
timeout /t 5 /nobreak > nul

echo Démarrage du frontend...
start cmd /k "npm run dev"

echo Application redémarrée !
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3000
