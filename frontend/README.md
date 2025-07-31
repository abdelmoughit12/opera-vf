# Opera App - Frontend

Application React moderne avec Tailwind CSS pour la gestion des opéras.

## 🚀 Technologies utilisées

- **React 19** - Framework JavaScript
- **Tailwind CSS** - Framework CSS utilitaire
- **Heroicons** - Icônes SVG
- **React Hook Form** - Gestion des formulaires
- **Yup** - Validation des données
- **React Router** - Navigation

## 🎨 Design System

### Couleurs
- **Vert principal** : `#00D4AA`
- **Bleu secondaire** : `#4A90E2`
- **Fond sombre** : `#1A1A1A`
- **Fond clair** : `#2A2A2A`

### Classes Tailwind personnalisées
```css
.bg-gradient-opera    /* Dégradé vert-bleu */
.bg-gradient-dark     /* Dégradé sombre */
.btn-primary          /* Bouton principal */
.input-field          /* Champ de saisie */
.card-glass           /* Carte avec effet verre */
```

## 📁 Structure du projet

```
src/
├── components/
│   └── auth/
│       └── Login.jsx          # Page de connexion
├── services/                  # Services API
│   ├── authService.js
│   ├── operaService.js
│   ├── userService.js
│   └── index.js
├── App.js                     # Composant principal
├── index.js                   # Point d'entrée
└── index.css                  # Styles Tailwind
```

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

## 🎯 Fonctionnalités

### Page de connexion
- ✅ Design moderne avec Tailwind CSS
- ✅ Validation des formulaires
- ✅ Effets visuels et animations
- ✅ Responsive design
- ✅ Icône Play pour représenter Opera

### Architecture
- ✅ Services modulaires
- ✅ Code simple et lisible
- ✅ Pas de Material-UI (plus simple)
- ✅ Utilisation de Tailwind CSS

## 🎨 Avantages de cette approche

### Simplicité
- **Code plus lisible** avec Tailwind CSS
- **Moins de dépendances** (pas de Material-UI)
- **Classes utilitaires** faciles à comprendre
- **Développement plus rapide**

### Performance
- **Bundle plus petit** sans Material-UI
- **CSS optimisé** avec Tailwind
- **Chargement plus rapide**

### Maintenance
- **Code plus simple** à maintenir
- **Moins de fichiers** CSS complexes
- **Documentation claire**

## 🔧 Configuration

### Tailwind CSS
Le fichier `tailwind.config.js` contient :
- Couleurs personnalisées pour Opera
- Animations personnalisées
- Classes utilitaires

### Services
Les services sont organisés par domaine :
- `authService.js` - Authentification
- `operaService.js` - Gestion des opéras
- `userService.js` - Gestion des utilisateurs

## 🚀 Déploiement

```bash
# Build de production
npm run build

# Tester le build
npm run test
```

## 📝 Notes

- L'icône Play (▶️) représente mieux l'idée d'opéra/musique
- Le code est maintenant plus simple et compréhensible
- Tailwind CSS facilite le développement et la maintenance
- L'architecture reste modulaire et scalable
