import { Pool } from 'pg';

export async function checkDatabaseConnection(pool: Pool) {
  try {
    // Test de connexion
    const client = await pool.connect();
    console.log('Connexion à la base de données établie');

    // Vérification de la table users
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.error('La table users n\'existe pas!');
    } else {
      // Vérification de l'utilisateur admin
      const adminCheck = await client.query(
        "SELECT * FROM users WHERE email = 'admin@contafricax.com'"
      );
      
      if (adminCheck.rows.length === 0) {
        console.warn('Utilisateur admin non trouvé!');
      } else {
        console.log('Configuration de la base de données vérifiée avec succès');
      }
    }

    client.release();
    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification de la base de données:', error);
    return false;
  }
}
