import { pool } from "../config/database";

export class TransactionService {
  async getMonthlyBalance() {
    const query = `
      SELECT
        date_trunc('month', date_transaction) as mois,
        SUM(CASE WHEN type = 'REVENU' THEN montant ELSE -montant END) as balance
      FROM transactions
      GROUP BY date_trunc('month', date_transaction)
      ORDER BY mois DESC
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (err) {
      throw new Error(`Erreur lors du calcul du bilan mensuel: ${(err as Error).message}`);
    }
  }
}
