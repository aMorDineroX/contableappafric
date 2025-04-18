# ContAfricaX - Application de Comptabilité Africaine

[![CI](https://github.com/aMorDineroX/DockerDevApp/actions/workflows/ci.yml/badge.svg)](https://github.com/aMorDineroX/DockerDevApp/actions/workflows/ci.yml)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=aMorDineroX/contafricax)](https://dependabot.com)

Application moderne de comptabilité conçue pour l'Afrique, construite avec React, TypeScript et Docker. ContAfricaX vise à fournir une solution de gestion financière adaptée aux réalités économiques africaines, avec une interface intuitive et des fonctionnalités spécifiques aux marchés locaux.

## Technologies

- **Frontend**: React, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui
- **Base de données**: PostgreSQL
- **Conteneurisation**: Docker
- **Animations**: CSS Animations, Transitions
- **Graphiques**: Recharts
- **Routing**: React Router v6
- **Authentification**: JWT

## Installation

```bash
# Cloner le projet
git clone https://github.com/aMorDineroX/DockerDevApp.git
cd DockerDevApp

# Installer les dépendances
docker-compose up --build
```

## Accès

- **Application** : http://localhost:5173
- **API Backend** : http://localhost:3003
- **PgAdmin** : http://localhost:5050
  - Email : admin@contafricax.com
  - Mot de passe : admin
- **Base de données** :
  - Système : PostgreSQL
  - Serveur : db
  - Utilisateur : admin
  - Mot de passe : password
  - Base de données : contafricax

## Développement

```bash
# Démarrer en mode développement
docker-compose up

# Arrêter les conteneurs
docker-compose down

# Reconstruire les conteneurs après modification des dépendances
docker-compose up --build
```

## Fonctionnalités Implémentées

- **Interface Utilisateur Moderne**
  - Design responsive avec Tailwind CSS
  - Thème personnalisé aux couleurs africaines
  - Composants réutilisables

- **Navigation Améliorée**
  - Sidebar rétractable (cachée par défaut)
  - Fil d'Ariane (Breadcrumb) pour la navigation hiérarchique
  - Bouton Retour contextuel
  - Transitions de page fluides
  - Indicateurs visuels de navigation

- **Authentification**
  - Système de connexion/inscription
  - Mode démo pour tester sans API
  - Protection des routes

- **Structure de Base**
  - Dashboard
  - Pages de transactions, clients, fournisseurs
  - Paramètres utilisateur

## Carte de l'Application

```
ContAfricaX
│
├── Pages Publiques
│   ├── Connexion (/login)
│   └── Inscription (/register)
│
├── Pages Protégées
│   ├── Tableau de Bord (/dashboard)
│   │   └── Widgets statistiques
│   │
│   ├── Transactions (/transactions)
│   │   ├── Liste des transactions
│   │   └── Formulaire de transaction
│   │
│   ├── Clients (/clients)
│   │   ├── Liste des clients
│   │   └── Détails client
│   │
│   ├── Fournisseurs (/suppliers)
│   │   ├── Liste des fournisseurs
│   │   └── Détails fournisseur
│   │
│   ├── Rapports (/reports)
│   │   ├── Rapports financiers
│   │   └── Graphiques d'analyse
│   │
│   ├── Paramètres (/settings)
│   │   ├── Préférences utilisateur
│   │   └── Configuration système
│   │
│   └── Profil (/profile)
│       └── Informations personnelles
│
└── Composants Partagés
    ├── Navigation
    │   ├── Navbar (haut)
    │   ├── Sidebar (gauche, rétractable)
    │   └── Breadcrumb (fil d'Ariane)
    │
    ├── UI
    │   ├── Boutons, Formulaires
    │   ├── Tableaux de données
    │   └── Cartes et Widgets
    │
    └── Authentification
        └── Contexte d'authentification
```

## Prochaines Fonctionnalités

- **Gestion Complète des Transactions**
  - CRUD complet des transactions
  - Catégorisation et étiquetage
  - Pièces jointes et documentation

- **Rapports Financiers Avancés**
  - Bilan comptable
  - Compte de résultat
  - Flux de trésorerie
  - Export PDF/Excel

- **Gestion des Devises Africaines**
  - Support multi-devises
  - Taux de change en temps réel
  - Conversion automatique

- **Fonctionnalités Spécifiques à l'Afrique**
  - Intégration des systèmes de paiement mobile (M-Pesa, Orange Money, etc.)
  - Conformité fiscale par pays
  - Modèles de documents adaptés aux réglementations locales

- **Améliorations Techniques**
  - Tests unitaires et d'intégration
  - Mode hors ligne
  - Optimisation des performances
  - PWA (Progressive Web App)

## Contribution

Les contributions sont les bienvenues ! Veuillez consulter notre guide de contribution pour plus d'informations.

## Licence

Ce projet est sous licence [MIT](LICENSE).
