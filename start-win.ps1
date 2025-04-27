Write-Host "Démarrage de l'application ContAfricaX..." -ForegroundColor Green

Write-Host "Démarrage du serveur backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run server-win"

Write-Host "Attente de 5 secondes pour que le serveur backend démarre..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Démarrage du frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "Application démarrée !" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Magenta
Write-Host "Backend: http://localhost:3000" -ForegroundColor Magenta
