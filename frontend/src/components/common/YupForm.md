# Guide d'utilisation de YupForm

## Vue d'ensemble

YupForm est un composant React réutilisable qui simplifie la gestion des formulaires avec validation Yup et react-hook-form.

## Composants disponibles

### 1. YupForm (Composant principal)

Le composant principal qui gère la logique du formulaire.

#### Props
- `schema`: Schéma de validation Yup (obligatoire)
- `defaultValues`: Valeurs par défaut du formulaire (optionnel)
- `onSubmit`: Fonction appelée lors de la soumission (obligatoire)
- `children`: Contenu du formulaire (fonction ou JSX)
- `className`: Classes CSS pour le formulaire (optionnel)
- `resetOnSubmit`: Réinitialiser le formulaire après soumission (défaut: true)

### 2. FormField (Composant de champ)

Composant pour les champs de saisie avec validation automatique.

#### Props
- `name`: Nom du champ (obligatoire)
- `label`: Label du champ (optionnel)
- `type`: Type de champ ('text', 'email', 'tel', 'date', 'select', 'textarea')
- `placeholder`: Placeholder du champ (optionnel)
- `required`: Champ obligatoire (optionnel)
- `options`: Options pour les selects (optionnel)
- `rows`: Nombre de lignes pour textarea (optionnel)
- `register`: Fonction register de react-hook-form (obligatoire)
- `errors`: Objet d'erreurs (obligatoire)
- `className`: Classes CSS supplémentaires (optionnel)

### 3. SubmitButton (Composant de bouton)

Bouton de soumission avec état de chargement.

#### Props
- `children`: Contenu du bouton
- `isSubmitting`: État de soumission (obligatoire)
- `disabled`: État désactivé (optionnel)
- `className`: Classes CSS (optionnel)

## Exemples d'utilisation

### Exemple basique

```jsx
import YupForm, { FormField, SubmitButton } from './YupForm';
import * as yup from 'yup';

const userSchema = yup.object({
  name: yup.string().required('Nom requis'),
  email: yup.string().email('Email invalide').required('Email requis'),
  age: yup.number().positive('Âge doit être positif').required('Âge requis')
});

const UserForm = ({ user, onSubmit }) => {
  return (
    <YupForm
      schema={userSchema}
      defaultValues={user || {}}
      onSubmit={onSubmit}
    >
      {({ register, errors, isSubmitting }) => (
        <div className="space-y-4">
          <FormField
            name="name"
            label="Nom"
            placeholder="Votre nom"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="email@example.com"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            name="age"
            label="Âge"
            type="number"
            placeholder="25"
            required
            register={register}
            errors={errors}
          />
          
          <SubmitButton isSubmitting={isSubmitting}>
            Enregistrer
          </SubmitButton>
        </div>
      )}
    </YupForm>
  );
};
```

### Exemple avec select et textarea

```jsx
const advancedSchema = yup.object({
  category: yup.string().required('Catégorie requise'),
  description: yup.string().min(10, 'Description trop courte'),
  priority: yup.string().required('Priorité requise')
});

const AdvancedForm = () => {
  return (
    <YupForm schema={advancedSchema} onSubmit={handleSubmit}>
      {({ register, errors, isSubmitting }) => (
        <div className="space-y-4">
          <FormField
            name="category"
            label="Catégorie"
            type="select"
            required
            options={[
              { value: 'urgent', label: 'Urgent' },
              { value: 'normal', label: 'Normal' },
              { value: 'low', label: 'Faible' }
            ]}
            register={register}
            errors={errors}
          />
          
          <FormField
            name="description"
            label="Description"
            type="textarea"
            placeholder="Décrivez votre demande..."
            rows={4}
            register={register}
            errors={errors}
          />
          
          <FormField
            name="priority"
            label="Priorité"
            type="select"
            required
            options={[
              { value: 'high', label: 'Haute' },
              { value: 'medium', label: 'Moyenne' },
              { value: 'low', label: 'Basse' }
            ]}
            register={register}
            errors={errors}
          />
          
          <SubmitButton isSubmitting={isSubmitting}>
            Créer
          </SubmitButton>
        </div>
      )}
    </YupForm>
  );
};
```

## Bonnes pratiques avec Yup

### 1. Définition des schémas

```jsx
// ✅ Bon - Schéma bien structuré
const userSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(2, 'Prénom doit contenir au moins 2 caractères')
    .max(50, 'Prénom trop long')
    .required('Prénom requis'),
  
  email: yup
    .string()
    .email('Format email invalide')
    .required('Email requis'),
  
  age: yup
    .number()
    .typeError('Âge doit être un nombre')
    .positive('Âge doit être positif')
    .integer('Âge doit être un entier')
    .max(120, 'Âge invalide')
    .required('Âge requis'),
  
  password: yup
    .string()
    .min(8, 'Mot de passe trop court')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    )
    .required('Mot de passe requis')
});
```

### 2. Validation conditionnelle

```jsx
const conditionalSchema = yup.object({
  hasAddress: yup.boolean(),
  address: yup.string().when('hasAddress', {
    is: true,
    then: yup.string().required('Adresse requise'),
    otherwise: yup.string().nullable()
  }),
  city: yup.string().when('hasAddress', {
    is: true,
    then: yup.string().required('Ville requise'),
    otherwise: yup.string().nullable()
  })
});
```

### 3. Validation personnalisée

```jsx
const customSchema = yup.object({
  phone: yup
    .string()
    .matches(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      'Format téléphone français invalide'
    )
    .required('Téléphone requis'),
  
  postalCode: yup
    .string()
    .matches(/^\d{5}$/, 'Code postal doit contenir 5 chiffres')
    .required('Code postal requis'),
  
  website: yup
    .string()
    .url('URL invalide')
    .test('is-https', 'Le site doit utiliser HTTPS', (value) => {
      if (!value) return true; // Optionnel
      return value.startsWith('https://');
    })
});
```

### 4. Messages d'erreur localisés

```jsx
const localizedSchema = yup.object({
  name: yup.string().required('Le nom est obligatoire'),
  email: yup.string().email('Format d\'email invalide').required('L\'email est obligatoire'),
  age: yup.number().positive('L\'âge doit être positif').required('L\'âge est obligatoire')
});
```

### 5. Transformation des données

```jsx
const transformSchema = yup.object({
  name: yup
    .string()
    .trim()
    .transform((value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
    .required('Nom requis'),
  
  email: yup
    .string()
    .trim()
    .lowercase()
    .email('Email invalide')
    .required('Email requis'),
  
  phone: yup
    .string()
    .transform((value) => value.replace(/\s/g, '')) // Supprime les espaces
    .matches(/^0[1-9](\d{8})$/, 'Format téléphone invalide')
    .required('Téléphone requis')
});
```

## Gestion des erreurs

### 1. Erreurs de validation

Les erreurs sont automatiquement affichées sous chaque champ avec le composant `FormField`.

### 2. Erreurs de soumission

```jsx
const handleSubmit = async (data) => {
  try {
    await api.createUser(data);
    // Succès
  } catch (error) {
    // Gérer les erreurs de l'API
    if (error.response?.data?.errors) {
      // Afficher les erreurs spécifiques
      setApiErrors(error.response.data.errors);
    }
  }
};
```

### 3. Validation côté serveur

```jsx
const serverValidationSchema = yup.object({
  email: yup
    .string()
    .email('Email invalide')
    .required('Email requis')
    .test('unique-email', 'Cet email existe déjà', async (value) => {
      if (!value) return true;
      const exists = await checkEmailExists(value);
      return !exists;
    })
});
```

## Performance

### 1. Optimisation des re-renders

```jsx
// ✅ Bon - Utiliser React.memo pour les composants de formulaire
const FormField = React.memo(({ name, label, register, errors, ...props }) => {
  // ...
});

// ✅ Bon - Utiliser useCallback pour les fonctions
const handleSubmit = useCallback(async (data) => {
  await onSubmit(data);
}, [onSubmit]);
```

### 2. Validation différée

```jsx
const form = useForm({
  resolver: yupResolver(schema),
  mode: 'onBlur', // Valide seulement quand le champ perd le focus
  // ou
  mode: 'onChange', // Valide à chaque changement
  // ou
  mode: 'onSubmit' // Valide seulement à la soumission
});
```

## Tests

### 1. Test des schémas

```jsx
import * as yup from 'yup';

describe('User Schema', () => {
  it('should validate correct user data', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25
    };
    
    const result = await userSchema.validate(validData);
    expect(result).toEqual(validData);
  });
  
  it('should reject invalid email', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      age: 25
    };
    
    await expect(userSchema.validate(invalidData)).rejects.toThrow();
  });
});
```

### 2. Test des composants

```jsx
import { render, fireEvent, waitFor } from '@testing-library/react';

describe('YupForm', () => {
  it('should submit form with valid data', async () => {
    const mockSubmit = jest.fn();
    
    render(
      <YupForm schema={userSchema} onSubmit={mockSubmit}>
        {/* ... */}
      </YupForm>
    );
    
    fireEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com'
      }));
    });
  });
});
```

## Conclusion

YupForm simplifie grandement la gestion des formulaires React en combinant la puissance de Yup pour la validation et react-hook-form pour la gestion d'état. En suivant ces bonnes pratiques, vous créerez des formulaires robustes, performants et maintenables. 