const { execSync } = require('child_process');

console.log('Démarrage de l\'application ContAfricaX...');
console.log('Pour arrêter l\'application, appuyez sur Ctrl+C');

try {
  console.log('\nDémarrage du serveur backend et frontend...');
  console.log('Cette commande va ouvrir deux fenêtres PowerShell distinctes.');
  console.log('Veuillez ne pas fermer ces fenêtres tant que vous utilisez l\'application.\n');
  
  // Execute the PowerShell script
  execSync('powershell -ExecutionPolicy Bypass -File start-win.ps1', { 
    stdio: 'inherit' 
  });
  
  console.log('Application démarrée avec succès!');
} catch (error) {
  console.error(`Erreur lors du démarrage: ${error.message}`);
}
