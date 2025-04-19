<div align="center">

# ContAfricaX - Application de Comptabilité Africaine

[![CI](https://github.com/aMorDineroX/DockerDevApp/actions/workflows/ci.yml/badge.svg)](https://github.com/aMorDineroX/DockerDevApp/actions/workflows/ci.yml)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=aMorDineroX/contafricax)](https://dependabot.com)

</div>

## 🔥 Présentation

ContAfricaX est une application moderne de comptabilité conçue spécifiquement pour l'Afrique, construite avec React, TypeScript et Docker. Elle vise à fournir une solution de gestion financière adaptée aux réalités économiques africaines, avec une interface intuitive et des fonctionnalités spécifiques aux marchés locaux.

### 💎 Points forts

- **Interface utilisateur moderne et intuitive** adaptée aux besoins africains
- **Support multi-devises** incluant les monnaies africaines et internationales
- **Gestion complète des transactions** avec catégorisation et pièces jointes
- **Gestion des clients et fournisseurs** avec suivi des relations commerciales
- **Rapports financiers personnalisés** adaptés aux réglementations locales
- **Optimisé pour les appareils mobiles** pour une utilisation sur le terrain

## 💻 Technologies

### Frontend
- **Framework**: React 18 avec TypeScript
- **Build Tool**: Vite pour un développement rapide
- **UI Framework**: Tailwind CSS avec composants shadcn/ui
- **Routing**: React Router v6 avec transitions animées
- **Gestion d'état**: React Context API et hooks personnalisés
- **Graphiques**: Recharts pour les visualisations de données
- **Animations**: CSS Animations, Transitions, Framer Motion

### Backend
- **Base de données**: PostgreSQL (compatible avec Neon DB)
- **API**: Express.js avec TypeScript
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: Zod pour la validation des données

### DevOps
- **Conteneurisation**: Docker et Docker Compose
- **CI/CD**: GitHub Actions
- **Gestion des dépendances**: Dependabot

## 📍 Installation

### Prérequis
- Docker et Docker Compose
- Node.js 18+ et npm/yarn/pnpm
- Git

### Installation avec Docker

```bash
# Cloner le projet
git clone https://github.com/aMorDineroX/contableappafric.git
cd contableappafric

# Installer les dépendances et démarrer avec Docker
docker-compose up --build
```

### Installation sans Docker (développement local)

```bash
# Cloner le projet
git clone https://github.com/aMorDineroX/contableappafric.git
cd contableappafric

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Pour Windows, utiliser le script PowerShell
.\Start-App.ps1
```

## 🔑 Accès

### Environnement local
- **Application Frontend** : http://localhost:5173 ou http://localhost:5174
- **API Backend** : http://localhost:3000
- **Base de données PostgreSQL** :
  - Hôte : localhost
  - Port : 5432
  - Utilisateur : admin
  - Mot de passe : password
  - Base de données : contafricax

### Environnement Docker
- **Application Frontend** : http://localhost:5173
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

### Comptes de démonstration
- **Admin**:
  - Email: admin@contafricax.com
  - Mot de passe: admin123
- **Utilisateur**:
  - Email: user@contafricax.com
  - Mot de passe: user123

## 👨‍💻 Développement

### Commandes Docker

```bash
# Démarrer en mode développement
docker-compose up

# Arrêter les conteneurs
docker-compose down

# Reconstruire les conteneurs après modification des dépendances
docker-compose up --build
```

### Commandes npm

```bash
# Démarrer le serveur de développement frontend
npm run dev

# Démarrer le serveur backend
npm run server

# Démarrer les deux serveurs (Windows)
npm run start-win

# Lancer les tests
npm run test

# Construire pour la production
npm run build
```

## ✅ Fonctionnalités Implémentées

### Interface Utilisateur Moderne
- **Design responsive** adapté à tous les appareils avec Tailwind CSS
- **Thème personnalisé** aux couleurs africaines avec mode clair/sombre
- **Composants réutilisables** pour une cohérence visuelle
- **Animations et transitions** pour une expérience utilisateur fluide
- **Tableaux de bord interactifs** avec widgets personnalisables

### Navigation Améliorée
- **Sidebar rétractable** (cachée par défaut) pour maximiser l'espace de travail
- **Fil d'Ariane (Breadcrumb)** pour la navigation hiérarchique
- **Bouton Retour contextuel** pour une navigation intuitive
- **Transitions de page fluides** avec animations
- **Indicateurs visuels** de navigation et d'activité

### Gestion des Clients
- **Vue en cartes et tableau** pour afficher les clients
- **Filtrage et recherche avancés** par statut, pays, solde, etc.
- **Sélection multiple et opérations par lot** (suppression, changement de statut)
- **Fiche détaillée du client** avec informations complètes
- **Gestion des notes et documents** associés aux clients
- **Suivi des transactions** par client

### Gestion des Transactions
- **Saisie et édition de transactions** avec validation des données
- **Catégorisation** des transactions (revenus, dépenses)
- **Filtrage multi-critères** par date, montant, catégorie, etc.
- **Visualisation graphique** des flux financiers
- **Support multi-devises** (FCFA, EUR, USD, etc.)

### Authentification et Sécurité
- **Système de connexion/inscription** sécurisé
- **Mode démo** pour tester sans API
- **Protection des routes** pour les pages sécurisées
- **Gestion des sessions** avec JWT
- **Contrôle d'accès** basé sur les rôles

## 🗺️ Structure de l'Application

```
ContAfricaX
│
├── Pages Publiques
│   ├── Landing Page (/) - Page d'accueil avec présentation du produit
│   ├── Connexion (/login) - Authentification des utilisateurs
│   └── Inscription (/register) - Création de compte
│
├── Pages Protégées (nécessitent une authentification)
│   ├── Tableau de Bord (/dashboard)
│   │   ├── Widgets statistiques (revenus, dépenses, solde)
│   │   ├── Graphiques d'évolution financière
│   │   └── Activité récente
│   │
│   ├── Transactions (/transactions)
│   │   ├── Liste des transactions (filtrable, triable)
│   │   ├── Formulaire de transaction (ajout/édition)
│   │   ├── Détails de transaction (avec pièces jointes)
│   │   └── Catégorisation et étiquetage
│   │
│   ├── Clients (/clients) - IMPLÉMENTÉ
│   │   ├── Liste des clients (vue cartes et tableau)
│   │   ├── Fiche détaillée du client
│   │   ├── Formulaire client (ajout/édition)
│   │   ├── Gestion des notes et documents
│   │   └── Opérations par lot (sélection multiple)
│   │
│   ├── Fournisseurs (/suppliers)
│   │   ├── Liste des fournisseurs
│   │   ├── Détails fournisseur
│   │   └── Formulaire fournisseur
│   │
│   ├── Rapports (/reports)
│   │   ├── Rapports financiers personnalisables
│   │   ├── Graphiques d'analyse avancés
│   │   └── Export de données (PDF, Excel, CSV)
│   │
│   ├── Paramètres (/settings)
│   │   ├── Préférences utilisateur
│   │   ├── Gestion des devises
│   │   └── Configuration système
│   │
│   └── Profil (/profile)
│       ├── Informations personnelles
│       ├── Sécurité du compte
│       └── Préférences de notification
│
├── Composants Partagés
│   ├── Navigation
│   │   ├── Navbar (haut) - Barre de navigation principale
│   │   ├── Sidebar (gauche, rétractable) - Menu latéral
│   │   └── Breadcrumb (fil d'Ariane) - Navigation hiérarchique
│   │
│   ├── UI
│   │   ├── Boutons, Formulaires, Inputs
│   │   ├── Tableaux de données (triables, filtrables)
│   │   ├── Cartes et Widgets
│   │   └── Modales et Notifications
│   │
│   └── Contextes et Hooks
│       ├── AuthContext - Gestion de l'authentification
│       ├── CurrencyContext - Gestion des devises
│       └── Hooks personnalisés
│
└── Services et API
    ├── Services d'authentification
    ├── Services de transactions
    ├── Services de clients
    └── Services de rapports
```

## 📝 Roadmap

### Phase 1 - Fondations (Terminé)
- ✅ Interface utilisateur responsive avec Tailwind CSS
- ✅ Navigation améliorée avec sidebar rétractable
- ✅ Système d'authentification de base
- ✅ Structure de l'application et routage
- ✅ Gestion des clients (implémentée)

### Phase 2 - Fonctionnalités Essentielles (En cours)
- ✅ Gestion complète des transactions
- ✅ Support multi-devises (FCFA, EUR, USD, etc.)
- ✅ Tableau de bord avec statistiques de base
- ⭕ Gestion des fournisseurs
- ⭕ Rapports financiers de base

### Phase 3 - Fonctionnalités Avancées (Planifié)
- ⭕ Rapports financiers avancés (bilan, compte de résultat)
- ⭕ Intégration des systèmes de paiement mobile africains
- ⭕ Conformité fiscale par pays africain
- ⭕ Gestion des stocks et inventaire
- ⭕ Facturation automatisée

### Phase 4 - Optimisation et Expansion (Futur)
- ⭕ Mode hors ligne avec synchronisation
- ⭕ Application mobile (PWA)
- ⭕ Intégration avec d'autres services financiers
- ⭕ Tableau de bord avancé avec IA prédictive
- ⭕ Support multi-langues (français, anglais, arabe, swahili)

## 📸 Captures d'écran

### Tableau de bord

![Tableau de bord](docs/images/dashboard.png)

*Le tableau de bord offre une vue d'ensemble des finances avec des widgets interactifs et des graphiques.*

### Page Clients

![Page Clients](docs/images/clients.png)

*La page Clients permet de gérer efficacement votre portefeuille client avec des vues en cartes ou en tableau.*

### Gestion des transactions

![Transactions](docs/images/transactions.png)

*Interface de gestion des transactions avec filtrage avancé et support multi-devises.*

## 👨‍👨‍👧‍👧 Contribution

Les contributions sont les bienvenues ! Voici comment vous pouvez contribuer :

1. **Fork** le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une **Pull Request**

Veuillez vous assurer que votre code respecte les standards de qualité du projet et inclut des tests si nécessaire.

## 🔒 Sécurité

Si vous découvrez une vulnérabilité de sécurité, veuillez envoyer un e-mail à [security@contafricax.com](mailto:security@contafricax.com) au lieu d'utiliser le système d'issues.

## 📃 Licence

Ce projet est sous licence [MIT](LICENSE).

---

<div align="center">

**ContAfricaX** - Développé avec ❤️ pour l'Afrique

[Site Web](https://contafricax.com) | [Documentation](https://docs.contafricax.com) | [Support](mailto:support@contafricax.com)

</div>
