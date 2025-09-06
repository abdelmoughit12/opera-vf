import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Vente from "./Vente/Vente";
import TransferModal from "./transfert/TransferModal";
import ResiliationModal from "./resiliation/ResiliationManagerModal";
import RibManager from "./rib/RibManager";
import SalesHistory from "./history/SalesHistory";
import EditClientModal from "./edit/EditClientModal";
import { ClientService } from "../../services/clientService";
import { useNotification } from "../../hooks/useNotification";

const ClientDetails = ({ 
  client , 

}) => {
  const [activeModal, setActiveModal] = useState(null);
  const [clientData, setClientData] = useState(client);
  const { success, error } = useNotification();
  
  useEffect(() => {
    setClientData(client);
  }, [client]);
  const navigate = useNavigate();

  if (!clientData) return <div>Aucun client sélectionné.</div>;

 const handleEditSubmit = async (data) => {
  try {
    // Construire le payload en respectant EXACTEMENT les clés Laravel
    const clientPayload = {
      Club: data.Club ?? clientData.Club,
      
      Code_Club: data.Code_Club ?? clientData.Code_Club,
      Email: data.Email ?? clientData.Email,
      Adresse: data.Adresse ?? clientData.Adresse,
      Date_Naissance: data.Date_Naissance ?? clientData.Date_Naissance,
      Status: data.Status ?? clientData.Status,
      Type_Client: data.Type_Client ?? clientData.Type_Client,
      Notes: data.Notes ?? clientData.Notes,

      // Champs visiteur
      nom: data.nom ?? (clientData.Nom_Visiteur || clientData.Nom),
      prenom: data.prenom ?? (clientData.Prenom_Visiteur || clientData.Prenom),
      telephone: data.telephone ?? (clientData.Telephone_Visiteur || clientData.Telephone),
    };

    console.log("Payload envoyé au backend:", clientPayload);

    const result = await ClientService.updateClient(clientData.CIN, clientPayload);
    if (!result.success) {
      throw new Error(result.error || "Échec de la mise à jour du client");
    }

    const updatedFromApi = result.data || {};

    setClientData(prev => ({
      ...prev,
      ...updatedFromApi,
      CIN: clientData.CIN, // Le CIN ne change pas
      Club: updatedFromApi.Club ?? clientPayload.Club,
      Code_Club: updatedFromApi.Code_Club ?? clientPayload.Code_Club,
      Email: updatedFromApi.Email ?? clientPayload.Email,
      Adresse: updatedFromApi.Adresse ?? clientPayload.Adresse,
      Date_Naissance: updatedFromApi.Date_Naissance ?? clientPayload.Date_Naissance,
      Status: updatedFromApi.Status ?? clientPayload.Status,
      Type_Client: updatedFromApi.Type_Client ?? clientPayload.Type_Client,
      Notes: updatedFromApi.Notes ?? clientPayload.Notes,
      Nom_Visiteur: updatedFromApi.Nom_Visiteur ?? clientPayload.nom,
      Prenom_Visiteur: updatedFromApi.Prenom_Visiteur ?? clientPayload.prenom,
      Telephone_Visiteur: updatedFromApi.Telephone_Visiteur ?? clientPayload.telephone,
    }));

    success("Client mis à jour avec succès");
    setActiveModal(null);
  } catch (err) {
    console.error("Erreur lors de la sauvegarde du client:", err);
    error(err.message || "Erreur lors de la sauvegarde du client");
    throw err;
  }
};

  
  return (
    <div className="p-8  bg-gray-50">
      {/* Titre principal en haut */}

      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
        <div className="w-full max-w-none mx-auto px-8 py-8 relative">
          <div className="flex items-center justify-between relative">
            {/* Bouton retour */}
            <button
              onClick={() => navigate("/clients")}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-lg font-medium">Retour à la liste</span>
            </button>

            {/* Titre principal centré en absolu */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold text-gray-900">
              Détails du Client
            </h1>
          </div>
        </div>

        {/* Informations du client */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                {clientData.Prenom_Visiteur?.charAt(0) || clientData.Prenom?.charAt(0)}
                {clientData.Nom_Visiteur?.charAt(0) || clientData.Nom?.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {clientData.Prenom_Visiteur || clientData.Prenom} {clientData.Nom_Visiteur || clientData.Nom}
                </h2>
                <p className="text-gray-500 text-lg mt-1">
                  Client depuis {clientData.Date_Inscription?.split("T")[0]}
                </p>
              </div>
              {/* Statut du client */}
              <div className="flex items-center space-x-3">
                <span
                  className={`px-4 py-2 text-base font-medium rounded-full ${
                    clientData.Status === "actif"
                      ? "bg-green-100 text-green-800"
                      : clientData.Status === "inactif"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {clientData.Status}
                </span>
                <span className="px-4 py-2 text-base font-medium rounded-full bg-blue-100 text-blue-800">
                  {clientData.Type_Client}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-center space-x-4 overflow-x-auto">
              <button
                onClick={() => setActiveModal("modifier")}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Modifier
              </button>

              <button
                onClick={() => setActiveModal("vente")}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                Nouvelle vente
              </button>

              <button
                onClick={() => setActiveModal("transfert")}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                Transfert
              </button>

              <button
                onClick={() => setActiveModal("rib")}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                Gestion RIB
              </button>

              <button
                onClick={() => setActiveModal("historique")}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Historique
              </button>

              <button
                onClick={() => setActiveModal("resiliation")}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                Résiliation
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Informations personnelles
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <span className="text-base text-gray-500 font-medium">
                  Email
                </span>
                <span className="text-base font-medium text-gray-900">
                  {clientData.Email}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <span className="text-base text-gray-500 font-medium">
                  Téléphone
                </span>
                <span className="text-base font-medium text-gray-900">
                  {clientData.Telephone_Visiteur || clientData.Telephone}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <span className="text-base text-gray-500 font-medium">
                  Date de naissance
                </span>
                <span className="text-base font-medium text-gray-900">
                 { clientData.Date_Naissance?.split("T")[0]}
                </span>
              </div>
              <div className="flex items-start justify-between py-4">
                <span className="text-base text-gray-500 font-medium">
                  Adresse
                </span>
                <span className="text-base font-medium text-gray-900 text-right max-w-xs">
                  {clientData.Adresse}
                </span>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Informations du client
              </h3>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-600 font-medium">
                    Club
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {clientData.Club || 'Non assigné'}
                  </span>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-600 font-medium">
                    Code Club
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {clientData.Code_Club || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-600 font-medium">
                    CIN
                  </span>
                  <span className="text-lg font-medium text-purple-600">
                    {clientData.CIN}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              <h3 className="text-2xl font-semibold text-gray-900">
                Informations
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <span className="text-base text-gray-500 font-medium">
                  Date d'inscription
                </span>
                <span className="text-base font-medium text-gray-900">
                  {clientData.Date_Inscription?.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <span className="text-base text-gray-500 font-medium">
                  Type de client
                </span>
                <span className="px-4 py-2 text-base font-medium rounded-full bg-purple-100 text-purple-800">
                  {clientData.Type_Client}
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-base text-gray-500 font-medium">
                  Statut
                </span>
                <span
                  className={`px-4 py-2 text-base font-medium rounded-full ${
                    clientData.Status === "actif"
                      ? "bg-green-100 text-green-800"
                      : clientData.Status === "inactif"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {clientData.Status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {clientData.Notes && (
          <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Notes</h3>
            </div>
            <div className="bg-amber-50 p-6 rounded-xl">
              <p className="text-gray-700 text-lg leading-relaxed">
                {clientData.Notes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Composants modaux */}
      {activeModal === "vente" && (
        <Vente client={clientData} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "transfert" && (
        <TransferModal clientSource={clientData} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "resiliation" && (
        <ResiliationModal
          client={clientData}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "rib" && (
        <RibManager client={clientData} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "historique" && (
        <SalesHistory client={clientData} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "modifier" && (
        <EditClientModal 
          client={clientData} 
          show={true}
          onHide={() => setActiveModal(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default ClientDetails;
