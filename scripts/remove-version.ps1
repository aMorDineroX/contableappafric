# Chemins des fichiers docker-compose
$files = @(
    "..\docker-compose.yml",
    "..\docker-compose.prod.yml"
)

foreach ($file in $files) {
    # Lire le contenu du fichier
    $content = Get-Content $file -Raw
    
    # Supprimer la ligne contenant "version:"
    $newContent = $content -replace "version:\s*'3\.8'\s*`n", ""
    
    # Écrire le nouveau contenu dans le fichier
    $newContent | Set-Content $file -NoNewline
    
    Write-Host "Version attribute removed from $file"
}
