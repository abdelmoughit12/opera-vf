# Système de Notifications

Ce système remplace tous les `alert()` et `window.confirm()` par des composants React élégants et personnalisables.

## Composants

### 1. NotificationToast
Affichage d'une notification individuelle avec animation et auto-destruction.

**Props :**
- `message` : Texte de la notification
- `type` : `success`, `error`, `warning`, `info`
- `duration` : Durée d'affichage en ms (défaut: 4000)
- `position` : Position sur l'écran (défaut: `top-right`)
- `onClose` : Callback appelé à la fermeture

### 2. ConfirmDialog
Remplace `window.confirm()` par un modal de confirmation personnalisé.

**Props :**
- `isOpen` : État d'ouverture
- `title` : Titre du dialog
- `message` : Message de confirmation
- `confirmText` : Texte du bouton de confirmation
- `cancelText` : Texte du bouton d'annulation
- `confirmVariant` : Style du bouton (`danger`, `primary`, `success`)
- `onConfirm` : Callback de confirmation
- `onCancel` : Callback d'annulation

### 3. NotificationContainer
Conteneur qui affiche toutes les notifications actives.

### 4. NotificationProvider
Provider React Context qui gère les notifications globalement.

## Utilisation

### Dans un composant

```jsx
import { useNotification } from '../../../hooks/useNotification';

const MonComposant = () => {
  const { success, error, warning, info } = useNotification();

  const handleSuccess = () => {
    success("Opération réussie !");
  };

  const handleError = () => {
    error("Une erreur est survenue");
  };

  const handleWarning = () => {
    warning("Attention, action requise");
  };

  const handleInfo = () => {
    info("Information importante");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Succès</button>
      <button onClick={handleError}>Erreur</button>
      <button onClick={handleWarning}>Avertissement</button>
      <button onClick={handleInfo}>Info</button>
    </div>
  );
};
```

### Avec ConfirmDialog

```jsx
import ConfirmDialog from '../../common/ConfirmDialog';

const MonComposant = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    // Logique de suppression
    setShowConfirm(false);
    setItemToDelete(null);
  };

  return (
    <>
      <button onClick={() => handleDelete(123)}>Supprimer</button>
      
      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet élément ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};
```

## Types de Notifications

- **Success** : Opérations réussies (vert)
- **Error** : Erreurs et échecs (rouge)
- **Warning** : Avertissements (jaune)
- **Info** : Informations générales (bleu)

## Positionnement

Les notifications peuvent être positionnées :
- `top-right` (défaut)
- `top-left`
- `bottom-right`
- `bottom-left`

## Personnalisation

### Durée d'affichage
```jsx
success("Message", 6000); // 6 secondes
error("Erreur", 8000);   // 8 secondes
```

### Position personnalisée
```jsx
<NotificationToast
  message="Message"
  position="bottom-left"
  duration={5000}
/>
```

## Migration depuis alert()

### Avant
```jsx
alert("Opération réussie");
```

### Après
```jsx
const { success } = useNotification();
success("Opération réussie");
```

## Migration depuis window.confirm()

### Avant
```jsx
if (window.confirm("Confirmer ?")) {
  // Action
}
```

### Après
```jsx
const [showConfirm, setShowConfirm] = useState(false);

const handleAction = () => {
  setShowConfirm(true);
};

const confirmAction = () => {
  // Action
  setShowConfirm(false);
};

return (
  <>
    <button onClick={handleAction}>Action</button>
    <ConfirmDialog
      isOpen={showConfirm}
      title="Confirmation"
      message="Confirmer ?"
      onConfirm={confirmAction}
      onCancel={() => setShowConfirm(false)}
    />
  </>
);
```

## Avantages

1. **UX améliorée** : Notifications élégantes et non-bloquantes
2. **Personnalisable** : Couleurs, positions, durées
3. **Accessible** : Meilleure accessibilité que les alert natifs
4. **Responsive** : S'adapte à tous les écrans
5. **Animations** : Transitions fluides
6. **Gestion d'état** : Intégration React native
7. **Réutilisable** : Composants modulaires

