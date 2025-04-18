import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { checkDatabaseConnection } from './db/check-db';
import { requestLogger, statusCheck } from './utils/logger';

dotenv.config();

const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Middleware de gestion des erreurs globales
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Erreur serveur:', err);
  return res.status(500).json({
    error: {
      message: err.message || 'Erreur serveur interne',
      status: 500
    }
  });
});

app.use(requestLogger);

// Connexion BD avec gestion d'erreur
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'contafricax',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});

// Vérifier la connexion à la base de données
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connexion à la base de données réussie:', result.rows[0]);
  }
});

// Route de test
app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({ status: 'ok' });
});

// Ajout d'une route de statut détaillé
app.get('/api/status', async (_req: Request, res: Response) => {
  try {
    const status = await statusCheck();
    return res.json({
      status: 'ok',
      services: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error'
    });
  }
});

// Route d'inscription avec meilleure gestion d'erreur
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    console.log('Début inscription - Body reçu:', req.body);
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      console.log('Données manquantes:', { email: !email, password: !password, name: !name });
      return res.status(400).json({
        error: {
          message: 'Données manquantes',
          fields: { email: !email, password: !password, name: !name }
        }
      });
    }

    console.log('Vérification utilisateur existant pour:', email);
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('Utilisateur existe déjà:', email);
      return res.status(409).json({
        error: {
          message: 'Un utilisateur avec cet email existe déjà'
        }
      });
    }

    console.log('Hashage du mot de passe...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Insertion nouvel utilisateur...');
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    console.log('Utilisateur créé avec succès:', result.rows[0]);
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        emailVerified: false,
        role: 'user'
      },
      token
    });

  } catch (error: any) {
    console.error('Erreur détaillée d\'inscription:', {
      message: error.message,
      stack: error.stack,
      detail: error.detail,
      code: error.code
    });
    
    return res.status(500).json({
      error: {
        message: 'Erreur serveur lors de l\'inscription',
        detail: error.message
      }
    });
  }
});

const startServer = async (): Promise<void> => {
  try {
    // Vérifier la connexion à la base de données
    const dbReady = await checkDatabaseConnection(pool);
    if (!dbReady) {
      throw new Error('Impossible de se connecter à la base de données');
    }

    // Démarrer le serveur avec la bonne gestion des types
    const port = parseInt(process.env.PORT || '3000', 10);
    const serverInstance = app.listen(port, '0.0.0.0', () => {
      console.log(`Serveur API démarré sur http://0.0.0.0:${port}`);
    });

    // Gestion de l'arrêt gracieux
    process.on('SIGTERM', () => {
      console.log('SIGTERM reçu. Arrêt gracieux...');
      serverInstance.close(() => {
        console.log('Serveur arrêté');
        pool.end();
      });
    });

  } catch (error) {
    console.error('Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();

export default app;
