# Modal de Vente - Documentation

Ce dossier contient tous les composants nécessaires pour gérer le processus de vente dans l'application.

## Structure des fichiers

```
vente/
├── VenteModal.jsx          # Composant principal orchestrant le processus
├── SelectionProduit.jsx    # Première étape : sélection du produit
├── Paiement.jsx           # Deuxième étape : configuration du paiement
├── ConfirmationModal.jsx  # Modal de confirmation finale
└── README.md              # Cette documentation
```

## Composants

### 1. VenteModal.jsx
**Composant principal** qui orchestre tout le processus de vente.

**Props :**
- `client` : Objet client pour lequel créer la vente
- `onClose` : Fonction appelée pour fermer le modal

**Fonctionnalités :**
- Gestion des étapes (sélection produit → paiement → confirmation)
- État global de la vente
- Appel API pour créer la vente
- Navigation entre les étapes

### 2. SelectionProduit.jsx
**Première étape** : Sélection du type de contrat, produit, quantité et dates.

**Props :**
- `client` : Informations du client
- `onComplete` : Fonction appelée quand la sélection est terminée
- `selectedData` : Données déjà sélectionnées (pour la persistance)

**Fonctionnalités :**
- Sélection du type de contrat (CDD, VIP, PROMO, FAMILIALE)
- Affichage des produits selon le contrat choisi
- Configuration de la quantité (+/-)
- Calcul automatique des dates de début/fin
- Gestion des remises
- Calcul automatique du prix total

**Types de contrats disponibles :**
- **CDD** : Contrat à Durée Déterminée
  - Abonnement Mensuel (300 DH)
  - Abonnement Trimestriel (800 DH)
  - Abonnement Semestriel (1500 DH)

- **VIP** : Contrat VIP Premium
  - VIP Mensuel (500 DH)
  - VIP Trimestriel (1400 DH)
  - VIP Annuel (5000 DH)

- **PROMO** : Contrat Promotionnel
  - Essai 15 jours (150 DH)
  - Promo Mensuel (200 DH)
  - Promo Trimestriel (500 DH)

- **FAMILIALE** : Contrat Familial
  - Pack 2 personnes (450 DH)
  - Pack 4 personnes (800 DH)
  - Pack 6 personnes (1100 DH)

### 3. Paiement.jsx
**Deuxième étape** : Configuration du paiement.

**Props :**
- `selectedData` : Données de la sélection de produit
- `onComplete` : Fonction appelée quand le paiement est configuré
- `onBack` : Fonction pour retourner à la sélection
- `paiementData` : Données de paiement déjà saisies

**Fonctionnalités :**
- Affichage du résumé de la commande
- Sélection du type de paiement (Espèces, Chèque, Carte, Virement)
- Champs spécifiques selon le type de paiement
- Validation des données
- Configuration de la date de validation

**Types de paiement :**
- **Espèces** : Paiement en espèces
- **Chèque** : Paiement par chèque (numéro, banque, compte)
- **Carte bancaire** : Paiement par carte (numéro, expiration, CVV)
- **Virement bancaire** : Virement (banque, compte)

### 4. ConfirmationModal.jsx
**Modal de confirmation** finale avant la création de la vente.

**Props :**
- `selectedData` : Données de la sélection de produit
- `paiementData` : Données de paiement
- `client` : Informations du client
- `onConfirm` : Fonction pour confirmer la vente
- `onCancel` : Fonction pour annuler

**Fonctionnalités :**
- Affichage complet du résumé
- Informations du client
- Détails du produit et du paiement
- Message de confirmation
- Boutons d'action (Confirmer/Annuler)

## Flux de données

```
VenteModal (état global)
    ↓
SelectionProduit (sélection produit)
    ↓ (onComplete)
Paiement (configuration paiement)
    ↓ (onComplete)
ConfirmationModal (confirmation finale)
    ↓ (onConfirm)
API createVente
```

## Utilisation

```jsx
import VenteModal from './components/client/vente/VenteModal';

// Dans votre composant
const [showVenteModal, setShowVenteModal] = useState(false);

// Ouvrir le modal
<button onClick={() => setShowVenteModal(true)}>
  Nouvelle vente
</button>

// Afficher le modal
{showVenteModal && (
  <VenteModal
    client={client}
    onClose={() => setShowVenteModal(false)}
  />
)}
```

## Styles et Design

Le design suit les principes de l'application :
- **Couleurs** : Bleu principal (#3B82F6), Vert pour les actions positives (#10B981)
- **Bordures** : Arrondies (rounded-xl, rounded-2xl)
- **Espacement** : Cohérent avec le reste de l'application
- **Responsive** : Adaptation mobile et desktop
- **Accessibilité** : Labels appropriés, contrastes corrects

## Validation

Chaque étape inclut une validation appropriée :
- **Sélection produit** : Type de contrat, produit, dates obligatoires
- **Paiement** : Type de paiement, montant, date de validation obligatoires
- **Champs spécifiques** : Numéro de chèque, détails de carte selon le type

## API

Le modal utilise le service `venteService` pour :
- `createVente(venteData)` : Créer une nouvelle vente
- Gestion des erreurs et succès
- Rechargement des données après création

## État et Persistance

Le modal gère l'état local pour :
- Persister les données entre les étapes
- Permettre la navigation retour
- Maintenir la cohérence des données

## Extensibilité

Le système est conçu pour être facilement extensible :
- Ajout de nouveaux types de contrats
- Nouveaux types de paiement
- Champs supplémentaires
- Validation personnalisée 