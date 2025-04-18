\c postgres;

DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'contafricax') THEN
      CREATE DATABASE contafricax;
   END IF;
END
$do$;

\c contafricax;

-- Types personnalisés
CREATE TYPE transaction_type AS ENUM ('REVENU', 'DEPENSE');
CREATE TYPE transaction_status AS ENUM ('EN_ATTENTE', 'VALIDEE', 'ANNULEE');

-- Table principale des transactions
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    type transaction_type NOT NULL,
    montant DECIMAL(15,2) NOT NULL,
    description TEXT,
    status transaction_status DEFAULT 'EN_ATTENTE',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    categorie VARCHAR(50),
    reference VARCHAR(50) UNIQUE,
    devise VARCHAR(10) DEFAULT 'FCFA'
);

-- Index pour améliorer les performances
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(date_creation);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Fonction pour mettre à jour la date de modification
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour la mise à jour automatique
CREATE TRIGGER update_transactions_modtime
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
