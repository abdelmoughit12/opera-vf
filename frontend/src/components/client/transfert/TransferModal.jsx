import React, { useState } from "react";
import SelectionClients from "./SelectionClients";
import ConfirmationTransfert from "./ConfirmationTransfert";
import { useNotification } from "../../../hooks/useNotification";

const TransferModal = ({ clientSource, onClose }) => {
  const [currentStep, setCurrentStep] = useState("selection");
  const [selectedData, setSelectedData] = useState({
    clientSource: clientSource,
    clientCible: null,
    fraisTransfert: 0,
    message: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { success, error } = useNotification();

  // Gérer la complétion de la sélection des clients
  const handleSelectionComplete = (data) => {
    setSelectedData(data);
    setCurrentStep("confirmation");
    setShowConfirmation(true);
  };

  // Retourner à la sélection des clients
  const handleBackToSelection = () => {
    setShowConfirmation(false);
    setCurrentStep("selection");
  };

  // Confirmer le transfert (simulation frontend)
  const handleConfirmTransfert = async () => {
    try {
      // Simulation du processus de transfert
      console.log("Données du transfert:", {
        client_source_id: selectedData.clientSource?.id,
        client_cible_id: selectedData.clientCible?.id,
        frais_transfert: selectedData.fraisTransfert,
        message: selectedData.message,
        statut: "validee",
      });

      // Simulation d'un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Succès simulé
      success("Transfert effectué avec succès ! (Simulation frontend)");
      onClose();

      // Optionnel : recharger les données de la page parent
      // window.location.reload(); // Commenté car pas recommandé
    } catch (err) {
      console.error("Erreur lors du transfert:", err);
      error("Erreur lors du transfert");
    }
  };

  // Fermer le modal de confirmation
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setCurrentStep("selection");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Transfert d'Abonnement
                </h2>
                <p className="text-gray-500 text-sm">
                  Client source: {clientSource?.prenom} {clientSource?.nom}
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
                    ? "text-orange-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "selection"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span className="font-medium">Sélection Clients</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === "confirmation"
                    ? "text-orange-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "confirmation"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Contenu du modal */}
          <div className="p-6">
            {!showConfirmation && (
              <SelectionClients
                clientSource={clientSource}
                onComplete={handleSelectionComplete}
                selectedData={selectedData}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <ConfirmationTransfert
          selectedData={selectedData}
          onConfirm={handleConfirmTransfert}
          onCancel={handleCloseConfirmation}
          onBack={handleBackToSelection}
        />
      )}
    </>
  );
};

export default TransferModal;
