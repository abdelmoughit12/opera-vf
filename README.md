# 🏋️‍♂️ OPERA VF - Application de Gestion de Clubs de Fitness

Une application moderne et complète pour la gestion de clubs de fitness et spas, développée avec React et Laravel.

## 🚀 Fonctionnalités Principales

### 📊 Dashboard Interactif
- **Statistiques en temps réel** : Clients actifs, revenus, abonnements
- **Graphiques dynamiques** : Évolution des ventes, répartition des abonnements
- **KPIs essentiels** : Taux de conversion, fréquentation, performance

### 👥 Gestion des Visiteurs
- **Inscription simplifiée** : Formulaire complet avec validation
- **Suivi personnalisé** : Statuts, historique des visites, notes
- **Conversion optimisée** : Pipeline de conversion visiteurs → clients
- **Statistiques avancées** : Sources d'information, intérêts, taux de conversion

### 👤 Gestion des Clients
- **Profils détaillés** : Informations personnelles, préférences
- **Historique complet** : Visites, achats, paiements
- **Communication** : Notifications, rappels automatiques

### 💳 Gestion des Abonnements
- **Types flexibles** : Mensuel, trimestriel, annuel
- **Renouvellement automatique** : Rappels, notifications
- **Statistiques** : Taux de rétention, churn analysis

### 💰 Gestion des Ventes et Paiements
- **Transactions sécurisées** : Suivi des paiements, facturation
- **Rapports financiers** : CA, marges, projections
- **Intégration** : Paiements en ligne, factures automatiques

### 📈 Rapports et Analyses
- **Tableaux de bord** : Performance, tendances, insights
- **Export de données** : PDF, Excel, CSV
- **Analytics avancés** : Prédictions, recommandations

## 🛠️ Technologies Utilisées

### Frontend
- **React 18+** : Interface utilisateur moderne
- **Tailwind CSS** : Styling responsive et moderne
- **Recharts** : Visualisations de données interactives
- **React Hook Form** : Gestion des formulaires avec validation
- **React Router** : Navigation SPA
- **Axios** : Communication API

### Backend
- **Laravel 10** : Framework PHP robuste
- **MySQL/PostgreSQL** : Base de données relationnelle
- **Eloquent ORM** : Gestion des données
- **JWT** : Authentification sécurisée
- **API RESTful** : Architecture API moderne

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- PHP 8.1+ et Composer
- MySQL 8.0+ ou PostgreSQL 13+
- Git

### 1. Cloner le Repository
```bash
git clone https://github.com/votre-username/opera-vf.git
cd opera-vf
```

### 2. Configuration Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 3. Configuration Frontend (React)
```bash
cd frontend
npm install
npm start
```

### 4. Configuration de la Base de Données
```bash
# Dans le dossier backend
php artisan migrate:fresh --seed
```

## 🔧 Configuration

### Variables d'Environnement Backend
```env


### Variables d'Environnement Frontend
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=OPERA VF
```

## 🚀 Déploiement

### Production
```bash
# Backend
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend
cd frontend
npm run build
```

### Docker (Optionnel)
```bash
docker-compose up -d
```


Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

