require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Fonction pour lire le fichier SQL d'initialisation
function readSqlFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

async function initializeNeonDatabase() {
  // Créer une connexion à la base de données Neon
  const pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('Utilisation des paramètres de connexion :', {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    // Masquer le mot de passe pour des raisons de sécurité
    password: '********',
    port: process.env.DB_PORT || 5432
  });

  try {
    console.log('Connexion à la base de données Neon...');
    const client = await pool.connect();

    console.log('Connexion établie, initialisation de la base de données...');

    // Lire le fichier SQL d'initialisation spécifique à Neon
    const initSqlPath = path.join(__dirname, './neon-init.sql');
    const initSql = readSqlFile(initSqlPath);

    // Exécuter le script SQL
    console.log('Exécution du script d\'initialisation...');
    await client.query(initSql);

    console.log('Base de données initialisée avec succès!');

    // Vérifier les tables créées
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    console.log('Tables créées:', tablesResult.rows.map(row => row.table_name));

    client.release();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    await pool.end();
  }
}

// Exécuter la fonction d'initialisation
initializeNeonDatabase();
