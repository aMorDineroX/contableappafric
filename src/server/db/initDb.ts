import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase(pool: Pool) {
  try {
    console.log('Début de l\'initialisation de la base de données...');

    // Lecture du fichier SQL
    const sqlFile = path.join(__dirname, 'init.sql');
    const initSQL = fs.readFileSync(sqlFile, 'utf-8');

    // Exécution des commandes SQL
    await pool.query(initSQL);
    
    console.log('Base de données initialisée avec succès');

    // Vérification de la création des tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log('Tables créées :', tablesResult.rows.map(row => row.table_name));

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}
