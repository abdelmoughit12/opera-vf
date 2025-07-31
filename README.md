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
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=opera_vf
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=votre-secret-jwt
```

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

## 📱 Utilisation

### Accès à l'Application
1. **URL** : `http://localhost:3000`
2. **Connexion** : Utilisez les identifiants par défaut ou créez un compte
3. **Navigation** : Menu latéral pour accéder aux différentes sections

### Premiers Pas
1. **Dashboard** : Consultez les statistiques générales
2. **Visiteurs** : Ajoutez et gérez vos prospects
3. **Clients** : Consultez votre base clients
4. **Abonnements** : Gérez les abonnements actifs
5. **Rapports** : Analysez vos performances

## 🔐 Sécurité

- **Authentification JWT** : Sessions sécurisées
- **Validation des données** : Côté client et serveur
- **CSRF Protection** : Protection contre les attaques
- **Sanitisation** : Nettoyage des entrées utilisateur
- **Permissions** : Système de rôles et permissions

## 📊 Structure du Projet

```
opera-vf/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Services API
│   │   └── styles/         # Styles CSS
│   ├── public/             # Fichiers publics
│   └── package.json
├── backend/                 # API Laravel
│   ├── app/
│   │   ├── Http/           # Contrôleurs et Middleware
│   │   ├── Models/         # Modèles Eloquent
│   │   └── Services/       # Services métier
│   ├── database/           # Migrations et Seeders
│   ├── routes/             # Routes API
│   └── composer.json
└── README.md
```

## 🤝 Contribution

1. **Fork** le projet
2. **Créez** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Poussez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Email** : support@opera-vf.com
- **Documentation** : [docs.opera-vf.com](https://docs.opera-vf.com)
- **Issues** : [GitHub Issues](https://github.com/votre-username/opera-vf/issues)

## 🙏 Remerciements

- **React Team** pour le framework frontend
- **Laravel Team** pour le framework backend
- **Tailwind CSS** pour le système de design
- **Recharts** pour les visualisations

---

**Développé avec ❤️ pour les clubs de fitness modernes** 