import React, { useState, useEffect } from "react";
import { useNotification } from "../../hooks/useNotification";
import produitService from "../../services/produitService";

const ProduitList = ({ onEdit, onDelete, onRefresh }) => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const { error, success } = useNotification();

  // Charger les produits depuis l'API
  const fetchProduits = async () => {
    try {
      setLoading(true);
      const response = await produitService.getAllProduits();

      if (response.success) {
        setProduits(response.data.data || []);
      } else {
        error(response.error || "Erreur lors du chargement des produits");
        setProduits([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
      error("Impossible de charger les produits");
      setProduits([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les produits au montage du composant
  useEffect(() => {
    fetchProduits();
  }, []);

  // Rafraîchir la liste si onRefresh est appelé
  useEffect(() => {
    if (onRefresh) {
      fetchProduits();
    }
  }, [onRefresh]);

  // Filtrer les produits selon la recherche et les filtres
  const filteredProduits = produits.filter((produit) => {
    const matchesSearch =
      produit.Nom_Produit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produit.Description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategorie =
      filterCategorie === "all" || produit.Categorie === filterCategorie;
    const matchesStatut =
      filterStatut === "all" || produit.Statut === filterStatut;
    return matchesSearch && matchesCategorie && matchesStatut;
  });

  // Obtenir le label de la catégorie
  const getCategorieLabel = (categorie) => {
    const categories = {
      abonnement: "Abonnement",
      pack_famille: "Pack Famille",
      promotion: "Promotion",
    };
    return categories[categorie] || categorie;
  };

  // Obtenir le label du statut
  const getStatutLabel = (statut) => {
    const statuts = {
      actif: "Actif",
      inactif: "Inactif",
      rupture: "En rupture",
      brouillon: "Brouillon",
    };
    return statuts[statut] || statut;
  };

  // Obtenir la couleur du statut
  const getStatutColor = (statut) => {
    const colors = {
      actif: "bg-green-100 text-green-800",
      inactif: "bg-gray-100 text-gray-800",
      rupture: "bg-red-100 text-red-800",
      brouillon: "bg-yellow-100 text-yellow-800",
    };
    return colors[statut] || "bg-gray-100 text-gray-800";
  };

  // Obtenir la couleur de la catégorie
  const getCategorieColor = (categorie) => {
    const colors = {
      abonnement: "bg-blue-100 text-blue-800",
      pack_famille: "bg-green-100 text-green-800",
      promotion: "bg-orange-100 text-orange-800",
    };
    return colors[categorie] || "bg-gray-100 text-gray-800";
  };

  // Obtenir la couleur du stock
  const getStockColor = (stock) => {
    if (stock <= 0) return "bg-red-100 text-red-800";
    if (stock <= 10) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // Gérer la suppression d'un produit
  const handleDelete = async (produitId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const response = await produitService.deleteProduit(produitId);
        if (response.success) {
          success("Produit supprimé avec succès !");
          // Rafraîchir la liste
          fetchProduits();
          // Appeler la fonction de callback si elle existe
          if (onDelete) {
            onDelete(produitId);
          }
        } else {
          error(response.error || "Erreur lors de la suppression du produit");
        }
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        error("Impossible de supprimer le produit");
      }
    }
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Gérer le filtre par catégorie
  const handleCategorieFilterChange = (e) => {
    setFilterCategorie(e.target.value);
  };

  // Gérer le filtre par statut
  const handleStatutFilterChange = (e) => {
    setFilterStatut(e.target.value);
  };

  // Calculer les statistiques
  const stats = {
    total: produits.length,
    actifs: produits.filter((p) => p.Statut === "actif").length,
    enRupture: produits.filter((p) => p.Stock <= 0).length,
    stockFaible: produits.filter((p) => p.Stock > 0 && p.Stock <= 10).length,
    parCategorie: produits.reduce((acc, produit) => {
      acc[produit.Categorie] = (acc[produit.Categorie] || 0) + 1;
      return acc;
    }, {}),
    valeurStock: produits.reduce((total, produit) => {
      return total + produit.Prix * produit.Stock;
    }, 0),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.total}</div>
          <div className="text-sm text-green-600">Total des produits</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.actifs}</div>
          <div className="text-sm text-blue-600">Produits actifs</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {stats.enRupture}
          </div>
          <div className="text-sm text-red-600">En rupture</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.stockFaible}
          </div>
          <div className="text-sm text-yellow-600">Stock faible</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {stats.valeurStock.toFixed(0)} DH
          </div>
          <div className="text-sm text-purple-600">Valeur du stock</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par nom ou description..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filterCategorie}
            onChange={handleCategorieFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">Toutes les catégories</option>
            <option value="abonnement">Abonnements</option>
            <option value="pack_famille">Packs Famille</option>
            <option value="promotion">Promotions</option>
          </select>
        </div>
        <div className="sm:w-48">
          <select
            value={filterStatut}
            onChange={handleStatutFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
            <option value="rupture">En rupture</option>
            <option value="brouillon">Brouillons</option>
          </select>
        </div>
      </div>

      {/* Liste des produits */}
      {filteredProduits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchTerm || filterCategorie !== "all" || filterStatut !== "all"
              ? "Aucun produit ne correspond aux critères de recherche"
              : "Aucun produit trouvé"}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProduits.map((produit) => (
            <div
              key={produit.ID_Produit}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* En-tête du produit */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {produit.Nom_Produit}
                </h3>
                <div className="flex space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getCategorieColor(
                      produit.Categorie
                    )}`}
                  >
                    {getCategorieLabel(produit.Categorie)}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(
                      produit.Statut
                    )}`}
                  >
                    {getStatutLabel(produit.Statut)}
                  </span>
                </div>
              </div>

              {/* Informations du produit */}
              <div className="space-y-2 text-sm text-gray-600">
                {produit.Description && (
                  <div className="pb-2 border-b border-gray-100">
                    <p className="text-gray-600 line-clamp-2">
                      {produit.Description}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Prix:</span>
                  <span className="text-lg font-bold text-green-600">
                    {produit.Prix} DH
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Stock:</span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStockColor(
                      produit.Stock
                    )}`}
                  >
                    {produit.Stock} unités
                  </span>
                </div>

                {produit.Categorie === "abonnement" && produit.Duree_Mois && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Durée:</span>
                    <span className="text-gray-600">
                      {produit.Duree_Mois} mois
                    </span>
                  </div>
                )}

                {produit.Type_Abonnement && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="text-gray-600 capitalize">
                      {produit.Type_Abonnement.replace("_", " ")}
                    </span>
                  </div>
                )}

                {produit.Image_URL && (
                  <div className="pt-2">
                    <img
                      src={produit.Image_URL}
                      alt={produit.Nom_Produit}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onEdit(produit)}
                  className="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(produit.ID_Produit)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProduitList;
