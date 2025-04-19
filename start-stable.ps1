# Script PowerShell pour démarrer l'application en mode stable
Write-Host "Démarrage de l'application en mode stable (sans rechargement automatique)"

# Démarrer le serveur backend dans une nouvelle fenêtre PowerShell
Start-Process powershell -ArgumentList "-Command npm run server-stable"

# Attendre quelques secondes pour que le serveur démarre
Write-Host "Démarrage du serveur backend..."
Start-Sleep -Seconds 5

# Démarrer le frontend dans la fenêtre actuelle
Write-Host "Démarrage du frontend..."
npm run dev-stable
