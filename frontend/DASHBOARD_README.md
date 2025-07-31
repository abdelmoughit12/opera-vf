# Dashboard OPERA VF - Documentation

## 🎯 Vue d'ensemble

Le dashboard OPERA VF est une interface moderne et complète pour la gestion de clubs de fitness/spa. Il fournit une vue d'ensemble en temps réel des métriques clés et permet une gestion efficace des opérations.

## 🚀 Fonctionnalités

### 📊 Statistiques Principales (KPIs)
- **Clients Actifs** : Nombre total de clients avec abonnements actifs
- **CA du Jour** : Chiffre d'affaires généré aujourd'hui
- **Abonnements Expirant** : Nombre d'abonnements qui expirent ce mois
- **Visites Aujourd'hui** : Nombre de visites enregistrées aujourd'hui
- **Taux de Conversion** : Pourcentage de prospects convertis en clients

### 📈 Graphiques et Visualisations
- **Évolution des Ventes** : Graphique en aire montrant les ventes par jour
- **Types d'Abonnements** : Graphique circulaire de la répartition des abonnements
- **Fréquentation par Heure** : Graphique en barres des visites par heure

### 🔔 Alertes et Notifications
- Abonnements expirant bientôt
- Paiements en retard
- Maintenances prévues
- Notifications importantes

### ⚡ Actions Rapides
- Nouveau Client
- Nouvelle Vente
- Gérer Abonnements
- Rapports

## 🛠️ Technologies Utilisées

- **React 19** : Framework JavaScript moderne
- **Tailwind CSS** : Framework CSS utilitaire
- **Recharts** : Bibliothèque de graphiques React
- **Axios** : Client HTTP pour les appels API
- **React Router** : Navigation entre les pages

## 📁 Structure des Fichiers

```
src/
├── components/
│   ├── Dashboard.jsx          # Composant principal du dashboard
│   └── auth/
│       └── Login.jsx          # Page de connexion
├── services/
│   ├── dashboardService.js    # Service pour les données du dashboard
│   ├── authService.js         # Service d'authentification
│   └── index.js              # Export des services
└── App.js                    # Configuration des routes
```

## 🔧 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
cd frontend
npm install
```

### Variables d'environnement
Créez un fichier `.env` dans le dossier `frontend` :
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Démarrage
```bash
npm start
```

## 📊 Architecture des Données

### Statistiques (Stats)
```javascript
{
  activeClients: 1247,
  dailyRevenue: 15420,
  expiringSubscriptions: 23,
  todayVisits: 89,
  conversionRate: 68
}
```

### Données de Ventes
```javascript
[
  { day: 'Lun', sales: 12000, visits: 45 },
  { day: 'Mar', sales: 15000, visits: 52 },
  // ...
]
```

### Types d'Abonnements
```javascript
[
  { name: 'Mensuel', value: 45, color: '#3B82F6' },
  { name: 'Trimestriel', value: 30, color: '#10B981' },
  { name: 'Annuel', value: 25, color: '#F59E0B' }
]
```

## 🔌 Intégration API

### Configuration
Le service `dashboardService.js` gère tous les appels API avec :
- Configuration automatique des headers d'authentification
- Gestion des erreurs centralisée
- Données mock pour le développement

### Endpoints Utilisés
```javascript
// Statistiques
GET /api/dashboard/stats?period={period}

// Données de ventes
GET /api/dashboard/sales?period={period}

// Types d'abonnements
GET /api/dashboard/subscriptions

// Fréquentation horaire
GET /api/dashboard/hourly

// Activité récente
GET /api/dashboard/recent-activity

// Alertes
GET /api/dashboard/alerts
```

## 🎨 Design System

### Couleurs
- **Bleu principal** : `#3B82F6` (blue-500)
- **Vert succès** : `#10B981` (emerald-500)
- **Orange avertissement** : `#F59E0B` (amber-500)
- **Rouge erreur** : `#EF4444` (red-500)
- **Gris neutre** : `#6B7280` (gray-500)

### Typographie
- **Titres** : Font-semibold, text-gray-900
- **Sous-titres** : Font-medium, text-gray-600
- **Corps** : Text-gray-900
- **Métadonnées** : Text-gray-500

### Composants
- **Cards** : bg-white, rounded-xl, shadow-lg, border border-gray-100
- **Boutons** : px-4 py-2, rounded-lg, transition-colors
- **Inputs** : border border-gray-300, rounded-lg, focus:ring-2

## 🔄 États de l'Application

### Chargement
- Spinner animé avec message "Chargement du dashboard..."
- Gestion des états de chargement pour chaque section

### Erreur
- Affichage d'un message d'erreur avec bouton "Réessayer"
- Gestion des erreurs réseau et API

### Données
- État local avec `useState` pour les données du dashboard
- Actualisation automatique lors du changement de période

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px (grid-cols-1)
- **Tablet** : 768px - 1024px (grid-cols-2)
- **Desktop** : > 1024px (grid-cols-5 pour les stats)

### Adaptations
- Graphiques redimensionnés automatiquement
- Navigation adaptée pour mobile
- Cards empilées sur petits écrans

## 🔐 Sécurité

### Authentification
- Token JWT stocké dans localStorage
- Headers d'authentification automatiques
- Redirection vers login si non authentifié

### Validation
- Validation des données côté client
- Gestion des erreurs API
- Protection contre les injections

## 🚀 Optimisations

### Performance
- Chargement asynchrone des données
- Composants optimisés avec React.memo
- Lazy loading des graphiques

### UX
- Animations fluides avec Tailwind
- Feedback visuel immédiat
- États de chargement appropriés

## 🧪 Tests

### Tests Unitaires
```bash
npm test
```

### Tests d'Intégration
- Tests des composants avec React Testing Library
- Tests des services avec Jest
- Tests des graphiques avec Recharts

## 📈 Métriques et Analytics

### Données Collectées
- Temps de chargement des pages
- Interactions utilisateur
- Erreurs JavaScript
- Performance des graphiques

### Outils
- React DevTools pour le debugging
- Chrome DevTools pour les performances
- Console pour les logs

## 🔄 Mises à Jour

### Versioning
- Suivi des versions avec Git
- Changelog détaillé
- Migration des données

### Déploiement
- Build de production optimisé
- Variables d'environnement
- CDN pour les assets statiques

## 📞 Support

### Documentation
- README détaillé
- Commentaires dans le code
- Exemples d'utilisation

### Contact
- Issues GitHub pour les bugs
- Pull requests pour les améliorations
- Documentation technique

## 🎯 Roadmap

### Fonctionnalités Futures
- [ ] Export PDF des rapports
- [ ] Notifications push en temps réel
- [ ] Mode sombre
- [ ] Personnalisation des widgets
- [ ] Intégration avec d'autres services

### Améliorations Techniques
- [ ] PWA (Progressive Web App)
- [ ] Service Workers pour le cache
- [ ] Optimisation des performances
- [ ] Tests automatisés complets

---

**Développé avec ❤️ pour OPERA VF** 