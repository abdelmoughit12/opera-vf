# Architecture Opera App

## Vue d'ensemble

Ce projet utilise une architecture de microservices côté frontend avec React et Material-UI. L'organisation est conçue pour être scalable, maintenable et facile à comprendre.

## Structure du projet

```
src/
├── components/          # Composants React organisés par fonctionnalité
│   ├── auth/           # Composants d'authentification
│   │   ├── Login.jsx
│   │   └── Login.css
│   ├── opera/          # Composants liés aux opéras
│   ├── user/           # Composants liés aux utilisateurs
│   ├── common/         # Composants réutilisables
│   └── layout/         # Composants de mise en page
├── services/           # Services API (microservices)
│   ├── authService.js  # Service d'authentification
│   ├── operaService.js # Service des opéras
│   ├── userService.js  # Service des utilisateurs
│   └── index.js        # Export centralisé
├── styles/             # Styles et thèmes
│   ├── theme.js        # Configuration Material-UI
│   └── global.css      # Styles globaux
├── hooks/              # Hooks React personnalisés
├── utils/              # Utilitaires et helpers
├── constants/          # Constantes de l'application
└── assets/             # Images, icônes, etc.
```

## Architecture des microservices

### 1. Service d'authentification (`authService.js`)
- **Responsabilités** : Gestion de l'authentification, connexion, déconnexion
- **Endpoints** : `/api/auth/*`
- **Fonctionnalités** :
  - Connexion/Inscription
  - Gestion des tokens JWT
  - Mot de passe oublié
  - Rafraîchissement de token

### 2. Service des opéras (`operaService.js`)
- **Responsabilités** : Gestion des opéras et contenus
- **Endpoints** : `/api/opera/*`
- **Fonctionnalités** :
  - CRUD des opéras
  - Recherche et filtrage
  - Gestion des favoris
  - Statistiques

### 3. Service des utilisateurs (`userService.js`)
- **Responsabilités** : Gestion des profils utilisateurs
- **Endpoints** : `/api/users/*`
- **Fonctionnalités** :
  - Profil utilisateur
  - Préférences
  - Notifications
  - Activités

## Organisation CSS

### Approche hybride
1. **Material-UI Theme** : Configuration centralisée des composants
2. **CSS Modules** : Styles spécifiques aux composants
3. **Global CSS** : Utilitaires et styles globaux

### Structure CSS
```
styles/
├── theme.js           # Configuration Material-UI
├── global.css         # Styles globaux et utilitaires
└── components/        # Styles par composant
    ├── auth/
    │   └── Login.css
    └── ...
```

## Avantages de cette architecture

### 1. Séparation des responsabilités
- Chaque service a une responsabilité claire
- Facilite la maintenance et les tests
- Permet le développement en parallèle

### 2. Scalabilité
- Ajout facile de nouveaux services
- Déploiement indépendant possible
- Réutilisation des services

### 3. Maintenabilité
- Code organisé et lisible
- Documentation claire
- Standards de codage cohérents

### 4. Performance
- Chargement à la demande
- Mise en cache optimisée
- Bundle splitting automatique

## Bonnes pratiques

### 1. Nommage
- Composants : PascalCase (`Login.jsx`)
- Services : camelCase (`authService.js`)
- Fichiers CSS : PascalCase (`Login.css`)

### 2. Structure des composants
```jsx
// 1. Imports
import React from 'react';
import { ... } from '@mui/material';

// 2. PropTypes (si nécessaire)
// 3. Composant principal
const ComponentName = () => {
  // 4. Hooks et état
  // 5. Fonctions
  // 6. Rendu
  return (...);
};

// 7. Export
export default ComponentName;
```

### 3. Gestion des erreurs
- Intercepteurs axios pour les erreurs globales
- Gestion locale des erreurs dans les composants
- Messages d'erreur utilisateur-friendly

### 4. Performance
- Lazy loading des composants
- Memoization avec React.memo
- Optimisation des re-renders

## Configuration

### Variables d'environnement
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

### Thème Material-UI
- Couleurs personnalisées
- Typographie cohérente
- Composants stylisés

## Développement

### Ajouter un nouveau service
1. Créer le fichier dans `src/services/`
2. Implémenter les méthodes CRUD
3. Ajouter l'export dans `src/services/index.js`
4. Documenter les endpoints

### Ajouter un nouveau composant
1. Créer le dossier dans `src/components/`
2. Créer le composant JSX
3. Créer le fichier CSS associé
4. Ajouter les tests si nécessaire

### Ajouter une nouvelle route
1. Mettre à jour `App.js`
2. Créer le composant de page
3. Ajouter la navigation si nécessaire

## Tests

### Structure des tests
```
src/
├── __tests__/
│   ├── components/
│   ├── services/
│   └── utils/
```

### Types de tests
- Tests unitaires pour les services
- Tests d'intégration pour les composants
- Tests E2E pour les flux complets

## Déploiement

### Build de production
```bash
npm run build
```

### Optimisations
- Code splitting automatique
- Compression des assets
- Cache des ressources statiques

## Monitoring et logs

### Logging
- Console pour le développement
- Service de logging pour la production
- Traçage des erreurs

### Métriques
- Performance des composants
- Temps de réponse des API
- Utilisation des ressources

## Sécurité

### Authentification
- Tokens JWT
- Refresh tokens
- Gestion des sessions

### Validation
- Validation côté client avec Yup
- Validation côté serveur
- Sanitisation des données

## Conclusion

Cette architecture permet de développer une application scalable et maintenable tout en gardant une structure claire et organisée. L'approche microservices facilite l'évolution du projet et l'ajout de nouvelles fonctionnalités. 