# 🎛️ Guide d'Utilisation - Page de Configuration

## **📋 Vue d'ensemble**

La page de configuration vous permet de gérer tous les aspects de votre application Opera :
- **🏢 Clubs** : Créer, modifier et gérer les clubs
- **📦 Produits** : Ajouter, configurer et organiser les produits de vente
- **⚙️ Paramètres** : Configurer les options système

## **🏢 Gestion des Clubs**

### **Créer un Nouveau Club**

#### **1. Accéder à la Configuration**
- Aller sur `http://localhost:3000/configuration`
- Cliquer sur l'onglet "Clubs"
- Cliquer sur "Nouveau Club"

#### **2. Remplir les Informations de Base**
```markdown
✅ **Champs Obligatoires :**
- Nom du Club : Nom unique du club
- Type de Club : Standard, Premium, VIP, Familial, Sportif, Bien-être
- Statut : Actif, Inactif, En maintenance, Fermé
- Capacité Maximale : Nombre maximum de membres

✅ **Adresse :**
- Adresse complète
- Code postal
- Ville

✅ **Contact :**
- Téléphone
- Email
```

#### **3. Configurer les Services**
```markdown
✅ **Horaires :**
- Heure d'ouverture
- Heure de fermeture

✅ **Services :**
- Description des services proposés
- Site web (optionnel)
- Description détaillée
- Notes supplémentaires
```

#### **4. Exemples de Clubs**

**Club Standard :**
- Nom : "Club Fitness Standard"
- Type : Standard
- Capacité : 100 personnes
- Services : Fitness, Cardio, Musculation

**Club VIP Premium :**
- Nom : "Club VIP Premium"
- Type : VIP
- Capacité : 50 personnes
- Services : Fitness, Piscine, Sauna, Spa, Restaurant

**Club Familial :**
- Nom : "Club Familial"
- Type : Familial
- Capacité : 200 personnes
- Services : Fitness, Piscine, Cours enfants, Garderie

### **Modifier un Club Existant**

1. **Sélectionner le club** dans la liste
2. **Cliquer sur "Modifier"**
3. **Modifier les champs** nécessaires
4. **Sauvegarder** les modifications

### **Supprimer un Club**

⚠️ **Attention :** Un club ne peut être supprimé que s'il n'a pas de clients associés.

1. **Sélectionner le club** dans la liste
2. **Cliquer sur "Supprimer"**
3. **Confirmer** la suppression

## **📦 Gestion des Produits**

### **Créer un Nouveau Produit**

#### **1. Accéder aux Produits**
- Cliquer sur l'onglet "Produits"
- Cliquer sur "Nouveau Produit"

#### **2. Informations de Base**
```markdown
✅ **Champs Obligatoires :**
- Nom du Produit : Ex: "Abonnement Mensuel Standard"
- Catégorie : Abonnement, Pack Famille, Promotion, Service, Équipement
- Prix : Montant en DH
- Stock : Nombre d'unités disponibles
- Statut : Actif, Inactif, Rupture, Promotion
```

#### **3. Configuration par Catégorie**

**🎯 Abonnements :**
```markdown
- Durée : 1, 3, 6, 12 mois
- Type : Standard, Premium, VIP, Étudiant, Senior
- Exemples :
  * Abonnement Mensuel Standard (300 DH)
  * Abonnement Trimestriel VIP (1400 DH)
  * Abonnement Annuel Premium (5000 DH)
```

**👨‍👩‍👧‍👦 Packs Famille :**
```markdown
- Nombre de personnes : 2, 4, 6+
- Type : Couple, Famille 2, Famille 4, Famille 6+
- Exemples :
  * Pack 2 personnes (450 DH)
  * Pack 4 personnes (800 DH)
  * Pack 6 personnes (1100 DH)
```

**🎉 Promotions :**
```markdown
- Durée : 0.5, 1, 3, 6 mois
- Type : Essai, Réduction, Parrainage, Fidélité
- Exemples :
  * Essai 15 jours (150 DH)
  * Promo Mensuel (200 DH)
  * Promo Étudiant 6 mois (900 DH)
```

#### **4. Détails Avancés**
```markdown
✅ **Description :** Détails du produit
✅ **Conditions :** Conditions d'utilisation
✅ **Avantages :** Bénéfices du produit
✅ **Restrictions :** Limitations éventuelles
✅ **Notes :** Informations supplémentaires
```

### **Gestion des Stocks**

#### **Alerte de Stock Faible**
- **Automatique** : Alerte quand stock ≤ 10 unités
- **Affichage** : Message rouge dans la liste des produits
- **Action** : Recharger le stock ou désactiver le produit

#### **Mise à Jour du Stock**
1. **Modifier le produit**
2. **Ajuster la quantité**
3. **Sauvegarder**

## **🔍 Fonctionnalités de Recherche et Filtrage**

### **Recherche de Clubs**
```markdown
✅ **Par nom** : Recherche textuelle
✅ **Par ville** : Filtrage géographique
✅ **Par type** : Standard, Premium, VIP, etc.
✅ **Par statut** : Actif, Inactif, Maintenance, Fermé
✅ **Par capacité** : Min/Max de membres
```

### **Recherche de Produits**
```markdown
✅ **Par nom** : Recherche textuelle
✅ **Par catégorie** : Abonnement, Pack Famille, Promotion
✅ **Par statut** : Actif, Inactif, Rupture, Promotion
✅ **Par prix** : Fourchette de prix
✅ **Par stock** : Disponibilité
```

## **📊 Tableaux de Bord et Statistiques**

### **Statistiques des Clubs**
```markdown
📈 **Vue d'ensemble :**
- Total des clubs
- Clubs actifs
- Clubs en maintenance
- Clubs fermés

🏙️ **Répartition :**
- Par type de club
- Par ville
- Par capacité
```

### **Statistiques des Produits**
```markdown
📦 **Inventaire :**
- Total des produits
- Produits actifs
- Produits en promotion
- Produits en rupture

💰 **Valeur :**
- Valeur totale du stock
- Produits les plus populaires
- Catégories dominantes
```

## **⚙️ Configuration Avancée**

### **Validation des Données**
```markdown
✅ **Clubs :**
- Nom unique
- Email unique
- Capacité positive
- Dates valides

✅ **Produits :**
- Nom unique
- Prix positif
- Stock non négatif
- Catégorie valide
```

### **Gestion des Erreurs**
```markdown
🚨 **Erreurs courantes :**
- Nom de club déjà utilisé
- Email déjà existant
- Stock insuffisant
- Données de validation invalides

✅ **Solutions :**
- Vérifier l'unicité
- Corriger les données
- Recharger la page
```

## **🎯 Bonnes Pratiques**

### **Organisation des Clubs**
```markdown
🏗️ **Structure recommandée :**
1. Clubs Standard (entrée de gamme)
2. Clubs Premium (milieu de gamme)
3. Clubs VIP (haut de gamme)
4. Clubs Spécialisés (sportif, bien-être)
5. Clubs Familiaux (tous publics)
```

### **Organisation des Produits**
```markdown
📋 **Hiérarchie recommandée :**
1. Abonnements de base
2. Abonnements premium
3. Packs famille
4. Promotions saisonnières
5. Services additionnels
```

### **Gestion des Stocks**
```markdown
📦 **Stratégies :**
- Maintenir un stock minimum de 20 unités
- Surveiller les produits populaires
- Désactiver les produits en rupture
- Planifier les réapprovisionnements
```

## **🔧 Intégration avec le Système**

### **Liaison Club-Client**
```markdown
🔗 **Relation :**
- Chaque client est associé à un club
- Le club détermine les services disponibles
- Le type de club influence les produits accessibles
```

### **Liaison Club-Produit**
```markdown
🔄 **Intégration :**
- Les produits sont liés aux catégories de clubs
- Les prix peuvent varier selon le club
- Les promotions sont spécifiques aux clubs
```

## **📱 Interface Utilisateur**

### **Navigation**
```markdown
🧭 **Structure :**
- Onglets : Clubs | Produits
- Actions : Créer | Modifier | Supprimer
- Filtres : Recherche | Type | Statut
- Statistiques : Vue d'ensemble
```

### **Responsive Design**
```markdown
📱 **Adaptation :**
- Desktop : Vue complète avec grilles
- Tablet : Vue adaptée avec colonnes
- Mobile : Vue empilée avec boutons d'action
```

## **🚀 Prochaines Étapes**

### **Fonctionnalités à venir**
```markdown
🔮 **Évolutions prévues :**
- Gestion des images de clubs
- Système de géolocalisation
- Gestion des horaires avancés
- Intégration des réseaux sociaux
- Système de réservation
- Gestion des événements
```

### **Optimisations**
```markdown
⚡ **Améliorations :**
- Cache des données
- Pagination avancée
- Export des données
- Import en lot
- Sauvegarde automatique
- Historique des modifications
```

---

## **🎉 Conclusion**

La page de configuration vous donne un contrôle total sur votre application Opera. Utilisez-la pour :

- **🏢 Structurer** votre réseau de clubs
- **📦 Organiser** votre catalogue de produits
- **📊 Surveiller** vos performances
- **⚙️ Optimiser** votre fonctionnement

**Besoin d'aide ?** Consultez la documentation technique ou contactez l'équipe de support ! 🚀
