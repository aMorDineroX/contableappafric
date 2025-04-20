import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Créer la configuration de la pool
const createPoolConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false // Nécessaire pour les connexions SSL à Neon
      } : undefined
    };
  } else {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'contafricax',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password',
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : undefined
    };
  }
};

// Exporter la pool
export const pool = new Pool(createPoolConfig());
