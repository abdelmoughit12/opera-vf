import React, { useState, useEffect } from "react";
import RibManagementModal from "../rib/RibManagementModal";
import produitService from "../../../services/produitService";
import { useNotification } from "../../../hooks/useNotification";

const SelectionProduit = ({ client, onComplete, selectedData }) => {
  const [typeContrat, setTypeContrat] = useState(selectedData.typeContrat);
  const [produit, setProduit] = useState(selectedData.produit);
  const [quantite, setQuantite] = useState(selectedData.quantite);
  const [dateDebut, setDateDebut] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [dateFin, setDateFin] = useState(selectedData.dateFin);
  const [remise, setRemise] = useState(selectedData.remise);
  const [prixTotal, setPrixTotal] = useState(selectedData.prixTotal);
  const [showRibModal, setShowRibModal] = useState(false);
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(null);
  const { error, success } = useNotification();
  // Types de contrats disponibles
// Types de contrats disponibles (maintenant chargés dynamiquement)
  const [typesContrats, setTypesContrats] = useState([]);

  // Charger les produits et catégories depuis le backend
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setLoading(true);
        setErrorLoading(null);
        console.log('Début du chargement des produits...');
        
        const response = await produitService.getAllProduits();
        console.log('Réponse du serveur:', response);
        
        if (response.success) {
          // Récupérer les données paginées ou directes
          const produitsData = response.data.data || response.data;
          const categoriesData = response.categories || [];
          
          console.log('Produits chargés:', produitsData.length);
          console.log('Catégories disponibles:', categoriesData);
          
          setProduits(produitsData);
          setCategories(categoriesData);
          
          // Transformer les catégories en types de contrats
          const transformedCategories = categoriesData.map(categorie => ({
            id: categorie,
            nom: getCategorieDisplayName(categorie),
            description: getCategorieDescription(categorie)
          }));
          
          setTypesContrats(transformedCategories);
          success("Produits chargés avec succès");
        } else {
          const errorMsg = response.message || "Erreur lors du chargement des produits";
          console.error('Erreur de réponse:', errorMsg);
          error(errorMsg);
          setErrorLoading(errorMsg);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        const errorMsg = err.response?.data?.message || "Impossible de charger les produits";
        error(errorMsg);
        setErrorLoading(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, [error, success]);
  // Fonctions utilitaires pour formater les noms de catégories
  const getCategorieDisplayName = (categorie) => {
    const names = {
      'abonnement': 'Abonnement',
      'pack_famille': 'Pack Famille',
      'promotion': 'Promotion'
    };
    return names[categorie] || categorie;
  };

  const getCategorieDescription = (categorie) => {
    const descriptions = {
      'abonnement': 'Abonnements standards et VIP',
      'pack_famille': 'Packs pour familles',
      'promotion': 'Offres promotionnelles'
    };
    return descriptions[categorie] || `Produits de type ${categorie}`;
  };


 // Filtrer les produits par catégorie
  const getProduitsByCategorie = (categorie) => {
    if (!categorie || !produits.length) return [];
    
    const produitsFiltres = produits.filter(
      (p) => p.Categorie === categorie && p.Statut === "actif"
    );
    
    console.log(`Produits pour catégorie ${categorie}:`, produitsFiltres.length);
    return produitsFiltres;
  };

  // Calculer la date de fin basée sur la date de début et la durée du produit
  useEffect(() => {
    if (dateDebut && produit) {
      try {
        const produitSelectionne = produits.find((p) => p.ID_Produit == produit);
        if (produitSelectionne) {
          // Utiliser la durée du produit depuis la base de données
          let dureeMois = produitSelectionne.Duree_Mois || 1;
          
          const dateDebutObj = new Date(dateDebut);
          const dateFinObj = new Date(dateDebutObj);
          dateFinObj.setMonth(dateFinObj.getMonth() + dureeMois);
          
          setDateFin(dateFinObj.toISOString().split("T")[0]);
          console.log('Date de fin calculée:', dateFinObj.toISOString().split("T")[0]);
        }
      } catch (err) {
        console.error('Erreur dans le calcul de la date de fin:', err);
      }
    }
  }, [dateDebut, produit, produits]);

  // Calculer le prix total
  useEffect(() => {
    if (produit && quantite) {
      try {
        const produitSelectionne = produits.find((p) => p.ID_Produit == produit);
        if (produitSelectionne) {
          const prixSansRemise = parseFloat(produitSelectionne.Prix) * parseInt(quantite);
          const montantRemise = (prixSansRemise * parseFloat(remise || 0)) / 100;
          const prixFinal = prixSansRemise - montantRemise;
          
          setPrixTotal(prixFinal);
          console.log('Prix total calculé:', prixFinal);
        }
      } catch (err) {
        console.error('Erreur dans le calcul du prix total:', err);
      }
    }
  }, [produit, quantite, remise, produits]);

  // Gérer la sélection du type de contrat
  const handleTypeContratChange = (type) => {
    console.log('Type de contrat sélectionné:', type);
    setTypeContrat(type);
    setProduit(""); // Réinitialiser le produit sélectionné
  };

  // Gérer la sélection du produit
  const handleProduitChange = (produitId) => {
    console.log('Produit sélectionné:', produitId);
    setProduit(produitId);
  };

  // Gérer le changement de quantité
  const handleQuantiteChange = (nouvelleQuantite) => {
    if (nouvelleQuantite >= 1) {
      console.log('Quantité modifiée:', nouvelleQuantite);
      setQuantite(nouvelleQuantite);
    }
  };
  console.log('client :',client.CIN);
  // Continuer vers l'étape de paiement
  const handleContinue = () => {
    try {
      if (!typeContrat || !produit || !dateDebut || !dateFin) {
        error("Veuillez remplir tous les champs obligatoires");
        return;
      }
      const CIN = client?.CIN;
      const produitSelectionne = produits.find((p) => p.ID_Produit == produit);
      
      if (!produitSelectionne) {
        error("Produit sélectionné introuvable");
        return;
      }

      console.log('Données envoyées à onComplete:', {
        CIN,
        typeContrat,
        produit: produitSelectionne,
        quantite,
        dateDebut,
        dateFin,
        remise,
        prixUnitaire: produitSelectionne.Prix,
        prixTotal
      });

      onComplete({
        typeContrat,
        produit: produitSelectionne,
        CIN:CIN,
        quantite,
        dateDebut,
        dateFin,
        remise,
        prixUnitaire: produitSelectionne.Prix,
        prixTotal,
      });
      
    } catch (err) {
      console.error('Erreur dans handleContinue:', err);
      error("Erreur lors de la validation des données");
    }
  };

  // Afficher le chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Chargement des produits...</span>
      </div>
    );
  }

  // Afficher les erreurs
  if (errorLoading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 font-semibold mb-2">Erreur de chargement</div>
        <div className="text-red-500 mb-4">{errorLoading}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }


  return (
   <div className="space-y-6">
      {/* Informations du client */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-blue-900">Client</h3>
          <button
            onClick={() => setShowRibModal(true)}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Gérer RIB</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">Nom:</span>{" "}
            {client?.Prenom_Visiteur} {client?.Nom_Visiteur}
          </div>
          <div>
            <span className="font-medium text-blue-700">Club:</span>{" "}
            {client?.Club}
          </div>
          <div>
            <span className="font-medium text-blue-700">Email:</span>{" "}
            {client?.Email}
          </div>
          <div>
            <span className="font-medium text-blue-700">Téléphone:</span>{" "}
            {client?.Telephone_Visiteur}
          </div>
        </div>
      </div>

      {/* Sélection du type de contrat */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Type de Contrat
        </h3>
        {typesContrats.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucune catégorie de produit disponible
          </div>
        ) : (
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {typesContrats.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeContratChange(type.id)}
                className={`p-4 min-w-[200px] min-h-[110px] rounded-xl border-2 transition-all ${
                  typeContrat === type.id
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold">{type.nom}</div>
                <div className="text-sm text-gray-600">{type.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sélection du produit */}
      {typeContrat && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produit</h3>
          {getProduitsByCategorie(typeContrat).length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun produit disponible pour cette catégorie
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {getProduitsByCategorie(typeContrat).map((prod) => (
                <button
                  key={prod.ID_Produit}
                  onClick={() => handleProduitChange(prod.ID_Produit)}
                  className={`p-4 min-w-[200px] rounded-xl border-2 transition-all text-left ${
                    produit === prod.ID_Produit
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">{prod.Nom_Produit}</div>
                  <div className="text-lg font-bold text-green-600">
                    {prod.Prix} DH
                  </div>
                  <div className="text-sm text-gray-600">
                    Durée: {prod.Duree_Formatted || '1 mois'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Stock: {prod.Stock} disponible
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quantité et dates */}
      {produit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quantité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de packs
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantiteChange(quantite - 1)}
                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="text-xl font-semibold min-w-[3rem] text-center">
                {quantite}
              </span>
              <button
                onClick={() => handleQuantiteChange(quantite + 1)}
                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={dateDebut}
                readOnly
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={dateFin}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Remise */}
      {produit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remise (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={remise}
            onChange={(e) => setRemise(parseFloat(e.target.value) || 0)}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Résumé et prix */}
      {produit && (
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Prix unitaire:</span>
              <span className="font-medium">
                {produits.find((p) => p.ID_Produit === produit)?.Prix} DH
              </span>
            </div>
            <div className="flex justify-between">
              <span>Quantité:</span>
              <span className="font-medium">{quantite}</span>
            </div>
            {remise > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Remise ({remise}%):</span>
                <span className="font-medium">
                  -
                  {(
                    (produits.find((p) => p.ID_Produit === produit)?.Prix *
                      quantite *
                      remise) /
                    100
                  ).toFixed(2)}{" "}
                  DH
                </span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">{prixTotal.toFixed(2)} DH</span>
            </div>
          </div>
        </div>
      )}

      {/* Bouton continuer */}
      {produit && (
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Continuer vers le paiement
          </button>
        </div>
      )}

      {/* Modal de gestion RIB */}
      {showRibModal && (
        <RibManagementModal
          client={client}
          onClose={() => setShowRibModal(false)}
        />
      )}
    </div>
  );
};

export default SelectionProduit;
