-- Initialisation de la base de données avec la table users
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS users CASCADE;

-- Suppression du bloc de création d'utilisateur admin qui nécessite des privilèges SUPERUSER

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

-- Création d'un utilisateur de test avec un mot de passe hashé valide
-- Le mot de passe est 'password123'
INSERT INTO users (email, password, name, role, email_verified)
VALUES (
    'admin@contafricax.com',
    '$2b$10$3euPcmQFCiblsZeEu5s7p.9wVslfS.7J/8MXM1NIyHs5S5Lv0qz.e',
    'Admin',
    'admin',
    true
) ON CONFLICT DO NOTHING;

-- Ajout des tables supplémentaires nécessaires

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('REVENU', 'DEPENSE')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de quelques catégories par défaut
INSERT INTO categories (name, type, description) VALUES
('Ventes', 'REVENU', 'Revenus provenant des ventes de produits ou services'),
('Services', 'REVENU', 'Revenus provenant des prestations de services'),
('Salaires', 'DEPENSE', 'Dépenses liées aux salaires des employés'),
('Fournitures', 'DEPENSE', 'Achats de fournitures et matériel'),
('Loyer', 'DEPENSE', 'Paiement du loyer des locaux')
ON CONFLICT DO NOTHING;

-- Table des transactions
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('REVENU', 'DEPENSE')),
    description TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'EN_ATTENTE' CHECK (status IN ('EN_ATTENTE', 'VALIDEE', 'ANNULEE')),
    category_id INTEGER REFERENCES categories(id),
    reference VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'FCFA',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    tax_id VARCHAR(50),
    website VARCHAR(255),
    status VARCHAR(20) DEFAULT 'actif' CHECK (status IN ('actif', 'inactif', 'prospect')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
