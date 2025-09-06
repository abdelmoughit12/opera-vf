import React, { useState } from "react";
import SelectionProduit from "./SelectionProduit";
import Paiement from "./Paiement";
import ConfirmationModal from "./ConfirmationModal";
import { useNotification } from "../../../hooks/useNotification";
import venteService from "../../../services/venteService";

const VenteModal = ({ client, onClose }) => {
  const [currentStep, setCurrentStep] = useState("selection");
  const [selectedData, setSelectedData] = useState({
    typeContrat: "",
    produit: "",
    quantite: 1,
    dateDebut: "",
    dateFin: "",
    remise: 0,
    prixUnitaire: 0,
    prixTotal: 0,
  });
  const [paiementData, setPaiementData] = useState({
    typePaiement: "",
    montant: 0,
    compte: "",
    dateValidation: "",
    banque: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();

  // Gérer la complétion de la sélection de produit
  const handleSelectionComplete = (data) => {
    setSelectedData(data);
    setCurrentStep("paiement");
  };

  // Gérer la complétion du paiement
  const handlePaiementComplete = (data) => {
    setPaiementData(data);
    setShowConfirmation(true);
  };

  // Retourner à la sélection de produit
  const handleBackToSelection = () => {
    setCurrentStep("selection");
  };

  // Confirmer la vente avec le backend
  const handleConfirmVente = async () => {
    try {
      setLoading(true);

      // Préparer les données pour l'API
      const venteData = {
        CIN: client?.CIN,
        ID_Produit: selectedData.produit?.ID_Produit || selectedData.produit,
        Quantite: selectedData.quantite,
        Prix_Unitaire: selectedData.prixUnitaire,
        Remise: selectedData.remise,
        Mode_Paiement: paiementData.typePaiement,
        Statut_Paiement: "paye", // Par défaut payé si on arrive à la confirmation
        Notes: `Vente via modal - ${selectedData.typeContrat}`,
        Date_Vente: new Date().toISOString(),
      };

      // Appeler l'API pour créer la vente
      const response = await venteService.createVente(venteData);

      if (response.success) {
        success("Vente enregistrée avec succès !");
        onClose();
        // Optionnel : recharger les données de la page parent
        // window.location.reload();
      } else {
        throw new Error(
          response.error || "Erreur lors de la création de la vente"
        );
      }
    } catch (err) {
      console.error("Erreur lors de la création de la vente:", err);
      error(err.message || "Erreur lors de la création de la vente");
    } finally {
      setLoading(false);
    }
  };

  // Fermer le modal de confirmation
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Nouvelle Vente
                </h2>
                <p className="text-gray-500 text-sm">
                  {client?.Prenom_Visiteur} {client?.Nom_Visiteur}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Indicateur d'étapes */}
          <div className="flex items-center justify-center p-4 bg-gray-50">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === "selection"
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "selection"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span className="font-medium">Sélection Produit</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === "paiement" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "paiement"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Paiement</span>
              </div>
            </div>
          </div>

          {/* Contenu du modal */}
          <div className="p-6">
            {currentStep === "selection" && (
              <SelectionProduit
                client={client}
                onComplete={handleSelectionComplete}
                selectedData={selectedData}
              />
            )}

            {currentStep === "paiement" && (
              <Paiement
                selectedData={selectedData}
                 client={client} 
                onComplete={handlePaiementComplete}
                onBack={handleBackToSelection}
                paiementData={paiementData}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <ConfirmationModal
          selectedData={selectedData}
          paiementData={paiementData}
          client={client}
          onConfirm={handleConfirmVente}
          onCancel={handleCloseConfirmation}
          loading={loading}
        />
      )}
    </>
  );
};

export default VenteModal;
