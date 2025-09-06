import React from 'react';
import ClubSelectionModal from "./ClubSelectionModal";
/**
 * Composant VisiteurDetails
 * 
 * Ce composant affiche les détails complets d'un visiteur dans un modal.
 * Il permet de voir toutes les informations et d'effectuer des actions.
 * 
 * Props:
 * - visitor: objet contenant les données du visiteur
 * - onClose: fonction appelée pour fermer le modal
 * - getStatusColor: fonction qui retourne les classes CSS pour la couleur du statut
 */
const VisiteurDetails = ({ 
  visitor, 
  onClose, 
  getStatusColor 
}) => {
  if (!visitor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        {/* En-tête du modal */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Détails du Visiteur</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenu du modal */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations Personnelles */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Personnelles</h3>
              <div className="space-y-3">
                 <div>
                  <span className="text-sm font-medium text-gray-500">CIN:</span>
                  <p className="text-sm text-gray-900">{visitor.CIN} </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Nom :</span>
                  <p className="text-sm text-gray-900"> {visitor.Nom}</p>
                </div>
                  <div>
                  <span className="text-sm font-medium text-gray-500">Prenom :</span>
                  <p className="text-sm text-gray-900"> {visitor.Prenom}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Téléphone:</span>
                  <p className="text-sm text-gray-900">{visitor.Telephone}</p>
                </div>

              </div>
            </div>

            {/* Informations de Suivi */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de Suivi</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Source:</span>
                  <p className="text-sm text-gray-900">{visitor.Source_d_information}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Intérêt:</span>
                  <p className="text-sm text-gray-900">{visitor.Intérêt_principal_}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Statut:</span>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visitor.status)}`}>
                    {visitor.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Date de visite:</span>
                  <p className="text-sm text-gray-900">{visitor.Date_Visite?.split("T")[0]}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Accompagnateur:</span>
                  <p className="text-sm text-gray-900">{visitor.Commerciale}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {visitor.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{visitor.Remarque}</p>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Fermer
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisiteurDetails; 