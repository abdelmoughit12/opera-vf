import React from "react";

const ConfirmationModal = ({
  selectedData,
  paiementData,
  client,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  // Safe rendering for price with fallback
  const renderPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '0.00';
    }
    return parseFloat(price).toFixed(2);
  };

  // Fonction pour obtenir le label du type de paiement
  const getTypePaiementLabel = (type) => {
    const types = {
      especes: "Espèces",
      cheque: "Chèque",
      carte: "Carte bancaire",
      virement: "Virement bancaire",
    };
    return types[type] || type;
  };

  // Fonction pour obtenir l'icône du type de paiement
  const getTypePaiementIcon = (type) => {
    const icons = {
      especes: "💵",
      cheque: "🏦",
      carte: "💳",
      virement: "🏛️",
    };
    return icons[type] || "💰";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Confirmation de la vente
              </h2>
              <p className="text-gray-500 text-sm">
                Vérifiez les détails avant de confirmer
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
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

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Informations du client */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Client</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700">Nom:</span>{" "}
                {client?.Prenom_Visiteur || 'N/A'} {client?.Nom_Visiteur || 'N/A'}
              </div>
              <div>
                <span className="font-medium text-blue-700">Club:</span>{" "}
                {client?.Club || 'N/A'}
              </div>
              <div>
                <span className="font-medium text-blue-700">Email:</span>{" "}
                {client?.email || client?.Email || 'N/A'}
              </div>
              <div>
                <span className="font-medium text-blue-700">Téléphone:</span>{" "}
                {client?.Telephone_Visiteur || 'N/A'}
              </div>
            </div>
          </div>

          {/* Détails du produit */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Détails du produit
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Type de contrat:</span>
                <span className="font-medium">{selectedData?.typeContrat || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Produit:</span>
                <span className="font-medium">{selectedData?.produit?.Nom_Produit || selectedData?.produit || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantité:</span>
                <span className="font-medium">{selectedData?.quantite || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Période:</span>
                <span className="font-medium">
                  {selectedData?.dateDebut || 'N/A'} - {selectedData?.dateFin || 'N/A'}
                </span>
              </div>
              {selectedData?.remise > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise:</span>
                  <span className="font-medium">{selectedData.remise}%</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Prix total:</span>
                <span className="text-green-600">
                  {renderPrice(selectedData?.prixTotal)} DH
                </span>
              </div>
            </div>
          </div>

          {/* Détails du paiement */}
          <div className="bg-green-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              Détails du paiement
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-green-700">Type de paiement:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {getTypePaiementIcon(paiementData?.typePaiement)}
                  </span>
                  <span className="font-medium">
                    {getTypePaiementLabel(paiementData?.typePaiement)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Montant:</span>
                <span className="font-medium">
                  {renderPrice(paiementData?.montant)} DH
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Date de validation:</span>
                <span className="font-medium">
                  {paiementData?.dateValidation || 'N/A'}
                </span>
              </div>
              {paiementData?.banque && (
                <div className="flex justify-between">
                  <span className="text-green-700">Banque:</span>
                  <span className="font-medium">{paiementData.banque}</span>
                </div>
              )}
              {paiementData?.compte && (
                <div className="flex justify-between">
                  <span className="text-green-700">Compte:</span>
                  <span className="font-medium">{paiementData.compte}</span>
                </div>
              )}
              {paiementData?.numeroCheque && (
                <div className="flex justify-between">
                  <span className="text-green-700">N° Chèque:</span>
                  <span className="font-medium">
                    {paiementData.numeroCheque}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Message de confirmation */}
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-yellow-800">
                  Confirmation requise
                </h4>
                <p className="text-yellow-700 text-sm mt-1">
                  Êtes-vous sûr de vouloir finaliser cette vente ? Cette action
                  ne peut pas être annulée.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            Annuler
          </button>
          <button
             onClick={async () => {
    await onConfirm(); // exécute la logique de confirmation
    onCancel();        // ferme le modal après confirmation
  }}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Traitement..." : "Confirmer la vente"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;