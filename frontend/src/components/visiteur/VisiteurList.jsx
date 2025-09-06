import React from "react";
import ClubSelectionModal from "./ClubSelectionModal";
import { useState } from "react";
import { useEffect } from "react";
import { VisiteurService } from "../../services/visiteurService";
import MessageModal from "../sharedCompoents/MessageModal";

const VisiteurList = ({
  visitors,
  onStatusChange,
  onViewDetails,
  getStatusColor,
  onVisitorConverted
}) => {
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ouvrir le modal
  const handleOpenModal = (visitor) => {
    setSelectedVisitor(visitor);
    setIsModalOpen(true);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setSelectedVisitor(null);
    setIsModalOpen(false);
  };

  const handleSelectClub = async (visitorId, clientData) => {
    console.log(`Client créé pour le visiteur #${visitorId}:`, clientData);
    
    // Mettre à jour le statut du visiteur dans la liste
    if (onVisitorConverted) {
      onVisitorConverted(visitorId, 'Converti');
    }
    
    handleCloseModal();
  };

 
  

 useEffect(() => {
    if (selectedVisitor && selectedVisitor.statut === "Converti") {
      handleCloseModal();
    }
  }, [selectedVisitor]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* En-tête du tableau */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Liste des Visiteurs ({visitors.length})
        </h2>
      </div>

      {/* Tableau des visiteurs */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visiteur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intérêt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visitors.map((visitor) => (
              <tr key={visitor.id} className="hover:bg-gray-50">
                {/* Colonne Visiteur */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {visitor.Prenom} {visitor.Nom}
                    </div>
                    <div className="text-sm text-gray-700">
                      CIN : {visitor.CIN}
                    </div>
                    <div className="text-sm text-gray-500">
                      Inscrit le {visitor.Date_Visite?.split("T")[0]}
                    </div>
                  </div>
                </td>

                {/* Colonne Contact */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">
                      {visitor.Telephone}
                    </div>
                  </div>
                </td>

                {/* Colonne Source */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {visitor.Source_d_information}
                </td>

                {/* Colonne Intérêt */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {visitor.Intérêt_principal_}
                </td>

                {/* Colonne Statut */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {visitor.status === "Converti" ? (
                    // Affichage statique pour les visiteurs convertis
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        visitor.status
                      )}`}
                    >
                      Converti
                    </span>
                  ) : (
                    // Select modifiable pour les autres statuts
                    <select
                      value={visitor.status}
                      onChange={(e) =>
                        onStatusChange(visitor.CIN, e.target.value)
                      }
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        visitor.status
                      )}`}
                    >
                      <option value="Nouveau">Nouveau</option>
                      <option value="En cours">En cours</option>
                      <option value="Converti" disabled>
                        Converti
                      </option>
                      <option value="Perdu">Perdu</option>
                    </select>
                  )}
                </td>

                {/* Colonne Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(visitor)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Voir
                    </button>
                    {/* Afficher le bouton Convertir seulement si le statut n'est pas "Converti" */}
                    {visitor.status !== "Converti" && (
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleOpenModal(visitor)}
                      >
                        Convertir
                      </button>
                    )}
                    {/* Affichage du modal de sélection de club */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ClubSelectionModal
        isOpen={isModalOpen}
        onSelectClub={handleSelectClub}
        onClose={handleCloseModal}
        visitor={selectedVisitor}
      />
    </div>
  );
};

export default VisiteurList;
