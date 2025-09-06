import React, { useState } from "react";
import ribService from "../../../services/ribService";
import { useNotification } from "../../../hooks/useNotification";
import ConfirmModal from "./ConfirmModal"; // <-- importer le modal

const RibDetails = ({ rib, onBack, onSetDefault, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { success, error } = useNotification();


const handleDelete = async () => {
  try {
    console.log("ID à supprimer:", rib.ID_Rib);
    await ribService.deleteRib(rib.ID_Rib);
    onDelete(rib.ID_Rib); // mise à jour de la liste
    success("RIB supprimé avec succès"); // ✅ notification visuelle
    setIsModalOpen(false);
  } catch (err) {
    error("Erreur lors de la suppression du RIB"); // ✅ notification visuelle
    setIsModalOpen(false);
  }
};



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          Détails du RIB
        </h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Retour</span>
        </button>
      </div>

      {/* Carte du RIB */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-white">{rib.Banque}</div>
            <div className="text-purple-100 text-sm">
              {rib.Agence || "Agence non spécifiée"}
            </div>
          </div>
          {rib.Statut && (
            <span className="text-xs px-3 py-1 rounded-full bg-white text-purple-600 font-medium">
              RIB par défaut
            </span>
          )}
        </div>

        <div className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-gray-500 text-sm font-medium">Compte</div>
                <div className="font-semibold text-gray-900 text-lg">
                  {rib.Compte}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-gray-500 text-sm font-medium">IBAN</div>
                <div className="font-mono text-gray-900 break-words bg-gray-50 p-3 rounded-lg border">
                  {rib.IBAN}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {rib.BIC && (
                <div className="space-y-2">
                  <div className="text-gray-500 text-sm font-medium">
                    BIC/SWIFT
                  </div>
                  <div className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border">
                    {rib.BIC}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
     <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        {!rib.Statut && (
          <button
            onClick={() => onSetDefault(rib.ID_Rib )}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Définir par défaut
          </button>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Supprimer
        </button>
      </div>

    <ConfirmModal
    isOpen={isModalOpen}
    title="Confirmer la suppression"
    message="Voulez-vous vraiment supprimer ce RIB ?"
    onConfirm={() => handleDelete(rib.ID_Rib)} // <-- utiliser ID_RIB exactement
    onCancel={() => setIsModalOpen(false)}
  />
    </div>
  );
};

export default RibDetails;
