# Vérification des Dépendances

## Frontend (React)

### Dépendances principales
```bash
npm install react-hook-form @hookform/resolvers yup axios
```

### Vérification des imports
```javascript
// ✅ Doit être présent dans ClubSelectionModal.jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNotification } from "../../hooks/useNotification";
import { VisiteurService } from "../../services/visiteurService";
```

## Backend (Laravel)

### Dépendances principales
```bash
composer require laravel/sanctum
```

### Vérification des modèles
```php
// ✅ Modèle Visiteur
use App\Models\Visiteur;

// ✅ Modèle Client  
use App\Models\Client;

// ✅ Validation
use Illuminate\Support\Facades\Validator;
```

### Vérification des routes
```php
// ✅ Route de conversion
Route::post('/visiteurs/{cin}/convert', [VisiteurController::class, 'convertToClient']);
```

## Base de données

### Tables requises
```sql
-- ✅ Table Visiteur
CREATE TABLE Visiteur (
    CIN VARCHAR(50) PRIMARY KEY,
    Nom VARCHAR(100),
    Prenom VARCHAR(100),
    Telephone VARCHAR(20),
    Date_Visite DATETIME,
    status VARCHAR(50),
    Remarque TEXT,
    Commerciale VARCHAR(100),
    Transferer_Date DATETIME,
    Source_d_information VARCHAR(100),
    Intérêt_principal_ VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- ✅ Table Client
CREATE TABLE Client (
    CIN VARCHAR(50) PRIMARY KEY,
    Code_Club VARCHAR(50),
    Club VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Sexe BOOLEAN,
    Type_Client VARCHAR(50),
    Date_Inscription DATE,
    Status VARCHAR(50),
    Adresse TEXT,
    Date_Naissance DATE,
    Notes TEXT,
    ID_Transfert VARCHAR(50),
    ID_Ventes INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Variables d'environnement

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:8000/api
```

### Backend (.env)
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=opera_db
DB_USERNAME=root
DB_PASSWORD=
```

## Vérification du fonctionnement

### 1. Test de l'API
```bash
# Test de la route de conversion
curl -X POST http://localhost:8000/api/visiteurs/TEST123/convert \
  -H "Content-Type: application/json" \
  -d '{
    "Code_Club": "CLUB-TEST-123",
    "Club": "Club Test",
    "Email": "test@example.com",
    "Sexe": 1,
    "Type_Client": "standard",
    "Adresse": "123 Test Street",
    "Date_Naissance": "1990-01-01",
    "Notes": "Test"
  }'
```

### 2. Test des composants React
```bash
# Démarrer le frontend
cd frontend
npm start

# Démarrer le backend
cd backend
php artisan serve
```

### 3. Vérification des logs
```bash
# Logs Laravel
tail -f backend/storage/logs/laravel.log

# Logs React (console du navigateur)
# Vérifier les erreurs dans la console du navigateur
```

## Problèmes courants

### 1. **CORS**
```php
// backend/config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

### 2. **Validation des données**
```php
// Vérifier que tous les champs requis sont présents
'Code_Club' => 'required|string|max:50',
'Club' => 'required|string|max:100',
'Email' => 'required|email|unique:Client,Email',
'Sexe' => 'required|in:0,1,true,false',
'Type_Client' => 'required|string|max:50',
'Adresse' => 'required|string',
'Date_Naissance' => 'required|date',
```

### 3. **Gestion des erreurs**
```javascript
// Frontend : Intercepter les erreurs
try {
  const response = await VisiteurService.convert(cin, payload);
  // Traitement du succès
} catch (error) {
  // Affichage de l'erreur
  error(error.message);
}
```

## Résolution des problèmes

### 1. **Erreur 404 - Route non trouvée**
```bash
# Vérifier les routes
php artisan route:list --name=visiteurs

# Vider le cache des routes
php artisan route:clear
```

### 2. **Erreur 422 - Validation échouée**
```bash
# Vérifier les données envoyées
# Vérifier la validation côté serveur
# Vérifier les types de données
```

### 3. **Erreur 500 - Erreur serveur**
```bash
# Vérifier les logs Laravel
tail -f storage/logs/laravel.log

# Vérifier la configuration de la base de données
php artisan config:clear
```

## Tests automatisés

### Exécution des tests
```bash
# Tests backend
cd backend
php artisan test --filter=VisiteurConversionTest

# Tests frontend (si configurés)
cd frontend
npm test
```
