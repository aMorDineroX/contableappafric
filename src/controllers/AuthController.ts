import { Request, Response } from "express";
import { pool } from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;

    try {
      // Vérifier si l'utilisateur existe déjà
      const userExists = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (userExists.rows.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Créer l'utilisateur
      const result = await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, hashedPassword, name]
      );

      // Générer le token JWT
      const token = jwt.sign(
        { userId: result.rows[0].id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        user: result.rows[0],
        token
      });
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message });
    }
  }

  async verifyToken(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token non fourni' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.json({ valid: true, decoded });
    } catch (err) {
      return res.status(401).json({ valid: false, error: 'Token invalide' });
    }
  }
}
