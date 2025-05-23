import { Request, Response } from "express";
import { pool } from "../config/database";

export class TransactionController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM transactions ORDER BY date_transaction DESC');
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message });
    }
  }

  async create(req: Request, res: Response) {
    const { montant, type, description, categorie_id } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO transactions (montant, type, description, categorie_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [montant, type, description, categorie_id]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message });
    }
  }
}
