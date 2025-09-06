import React, { useState } from "react";
import TransferModal from "./TransferModal";

const TransferDemo = () => {
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Client source de démonstration
  const demoClientSource = {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    Code_client: "CL001",
    CIN: "AB123456",
    Club: "Club A",
    email: "jean.dupont@email.com",
    telephone: "0612345678",
    date_debut: "2024-01-01",
    date_fin: "2024-12-31",
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Démonstration du Modal de Transfert
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Client Source
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <span className="font-medium text-gray-700">Code client:</span>
               <span className="font-medium text-gray-700">OPERA-513266</span>{"  "}

            </div>
            <div>
              <span className="font-medium text-gray-700">CIN:</span>{" "}
              {demoClientSource.CIN}
            </div>
            <div>
              <span className="font-medium text-gray-700">Nom: Abdelmoughit</span>{" "}
              {demoClientSource.prenom} || "OPERA-513266" {demoClientSource.nom}
            </div>
            <div>
              <span className="font-medium text-gray-700">Club:</span>{" "}
              {demoClientSource.Club}
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>{" "}
              {demoClientSource.email}
            </div>
            <div>
              <span className="font-medium text-gray-700">Téléphone:</span>{" "}
              {demoClientSource.telephone}
            </div>
          </div>

          <button
            onClick={() => setShowTransferModal(true)}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2"
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span>Démarrer le Transfert</span>
          </button>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Instructions de test
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Cliquez sur "Démarrer le Transfert" pour ouvrir le modal</li>
            <li>• Sélectionnez un client cible dans la liste</li>
            <li>
              • Remplissez les frais de transfert et le message (optionnel)
            </li>
            <li>• Continuez vers la confirmation</li>
            <li>• Vérifiez les informations et confirmez le transfert</li>
          </ul>
        </div>
      </div>

      {/* Modal de transfert */}
      {showTransferModal && (
        <TransferModal
          clientSource={demoClientSource}
          onClose={() => setShowTransferModal(false)}
        />
      )}
    </div>
  );
};

export default TransferDemo;



