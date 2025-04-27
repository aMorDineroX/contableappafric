const { spawn } = require('child_process');
const path = require('path');

console.log('Démarrage de l\'application ContAfricaX...');

// Start the backend server
console.log('Démarrage du serveur backend...');
const serverProcess = spawn('npm', ['run', 'server-win'], {
  stdio: 'inherit',
  shell: true
});

serverProcess.on('error', (error) => {
  console.error(`Erreur lors du démarrage du serveur: ${error.message}`);
});

// Wait 5 seconds before starting the frontend
console.log('Attente de 5 secondes pour que le serveur backend démarre...');
setTimeout(() => {
  // Start the frontend
  console.log('Démarrage du frontend...');
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  frontendProcess.on('error', (error) => {
    console.error(`Erreur lors du démarrage du frontend: ${error.message}`);
  });

  console.log('Application démarrée !');
  console.log('Frontend: http://localhost:5173');
  console.log('Backend: http://localhost:3000');
}, 5000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Arrêt de l\'application...');
  serverProcess.kill();
  process.exit(0);
});
