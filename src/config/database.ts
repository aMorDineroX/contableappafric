import { Pool } from 'pg';

export const pool = new Pool({
  host: 'db',
  port: 5432,
  database: 'contafricax',
  user: 'admin',
  password: 'password'
});
