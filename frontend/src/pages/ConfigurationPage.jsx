import React, { useState, useEffect } from "react";
import { useNotification } from "../hooks/useNotification";
import ClubForm from "../components/configuration/ClubForm";
import ProduitForm from "../components/configuration/ProduitForm";
import ClubList from "../components/configuration/ClubList";
import ProduitList from "../components/configuration/ProduitList";

const ConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState("clubs");
  const [showClubForm, setShowClubForm] = useState(false);
  const [showProduitForm, setShowProduitForm] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [editingProduit, setEditingProduit] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { success, error } = useNotification();

  // Gérer la soumission du formulaire de club
  const handleClubSubmit = async (clubData) => {
    try {
      if (editingClub) {
        success("Club modifié avec succès !");
        setEditingClub(null);
      } else {
        success("Club créé avec succès !");
      }
      setShowClubForm(false);

      // Déclencher le rafraîchissement de la liste
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Erreur lors de la gestion du club:", err);
      error("Erreur lors de la gestion du club");
    }
  };

  // Gérer la soumission du formulaire de produit
  const handleProduitSubmit = async (produitData) => {
    try {
      if (editingProduit) {
        success("Produit modifié avec succès !");
        setEditingProduit(null);
      } else {
        success("Produit créé avec succès !");
      }
      setShowProduitForm(false);

      // Déclencher le rafraîchissement de la liste
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Erreur lors de la gestion du produit:", err);
      error("Erreur lors de la gestion du produit");
    }
  };

  // Gérer la modification d'un club
  const handleEditClub = (club) => {
    setEditingClub(club);
    setShowClubForm(true);
  };

  // Gérer la modification d'un produit
  const handleEditProduit = (produit) => {
    setEditingProduit(produit);
    setShowProduitForm(true);
  };

  // Gérer la suppression d'un club
  const handleDeleteClub = async (clubId) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce club ?")) {
        success("Club supprimé avec succès !");
        // Déclencher le rafraîchissement de la liste
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du club:", err);
      error("Erreur lors de la suppression du club");
    }
  };

  // Gérer la suppression d'un produit
  const handleDeleteProduit = async (produitId) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        success("Produit supprimé avec succès !");
        // Déclencher le rafraîchissement de la liste
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du produit:", err);
      error("Erreur lors de la suppression du produit");
    }
  };

  // Gérer le succès des opérations CRUD
  const handleClubSuccess = (clubData) => {
    // Déclencher le rafraîchissement de la liste
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleProduitSuccess = (produitData) => {
    // Déclencher le rafraîchissement de la liste
    setRefreshTrigger((prev) => prev + 1);
  };

  // Fermer les formulaires
  const handleCloseClubForm = () => {
    setShowClubForm(false);
    setEditingClub(null);
  };

  const handleCloseProduitForm = () => {
    setShowProduitForm(false);
    setEditingProduit(null);
  };

  // Ouvrir le formulaire pour créer un nouveau club
  const handleCreateClub = () => {
    setEditingClub(null);
    setShowClubForm(true);
  };

  // Ouvrir le formulaire pour créer un nouveau produit
  const handleCreateProduit = () => {
    setEditingProduit(null);
    setShowProduitForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuration</h1>
          <p className="mt-2 text-gray-600">
            Gérez les clubs, produits et paramètres de votre application
          </p>
        </div>

        {/* Onglets */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("clubs")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "clubs"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Clubs
            </button>
            <button
              onClick={() => setActiveTab("produits")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "produits"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Produits
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === "clubs" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestion des Clubs
                </h2>
                <button
                  onClick={handleCreateClub}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 inline mr-2"
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
                  Nouveau Club
                </button>
              </div>
              <ClubList
                onEdit={handleEditClub}
                onDelete={handleDeleteClub}
                onRefresh={refreshTrigger}
              />
            </div>
          )}

          {activeTab === "produits" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestion des Produits
                </h2>
                <button
                  onClick={handleCreateProduit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 inline mr-2"
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
                  Nouveau Produit
                </button>
              </div>
              <ProduitList
                onEdit={handleEditProduit}
                onDelete={handleDeleteProduit}
                onRefresh={refreshTrigger}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        {showClubForm && (
          <ClubForm
            show={showClubForm}
            onHide={handleCloseClubForm}
            club={editingClub}
            onSubmit={handleClubSubmit}
            onSuccess={handleClubSuccess}
          />
        )}

        {showProduitForm && (
          <ProduitForm
            show={showProduitForm}
            onHide={handleCloseProduitForm}
            produit={editingProduit}
            onSubmit={handleProduitSubmit}
            onSuccess={handleProduitSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ConfigurationPage;
