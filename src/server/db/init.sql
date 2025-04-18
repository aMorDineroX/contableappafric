-- Initialisation de la base de données avec la table users
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS users CASCADE;

-- Create admin user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin'
   ) THEN
      CREATE USER admin WITH PASSWORD 'password' CREATEDB CREATEROLE;
      ALTER USER admin WITH SUPERUSER;
   END IF;
END
$do$;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création d'un utilisateur de test
INSERT INTO users (email, password, name, role, email_verified)
VALUES (
    'admin@contafricax.com',
    '$2b$10$YourHashedPasswordHere',
    'Admin',
    'admin',
    true
) ON CONFLICT DO NOTHING;
