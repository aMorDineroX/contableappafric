import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Utiliser directement la chaîne de connexion si disponible
if (process.env.DATABASE_URL) {
  export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false // Nécessaire pour les connexions SSL à Neon
    } : undefined
  });
} else {
  // Configuration manuelle en fallback
  export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'contafricax',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : undefined
  });
}
