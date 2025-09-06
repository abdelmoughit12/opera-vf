import React, { useEffect, useState } from "react";
import RibList from "./RibList";
import RibDetails from "./RibDetails";
import AddRibForm from "./AddRibForm";
import ribService from "../../../services/ribService";

const RibManager = ({ client, onClose }) => {
  const defaultClient = {
    id: 1,
    Email: "mailabdelmoughit@gmail.com",
    Telephone_Visiteur: "0771952328",
    Date_Naissance: "2008-06-05",
    Adresse: "rabat",
    Prenom_Visiteur: "Abdel",
    Nom_Visiteur: "Moughit",
    Club: "Opera",
    Code_Club: "OPERA-513266",
    CIN: "dn52625",
    Date_Inscription: "2025-08-23",
    Type_Client: "vip",
    Status: "en_attente",
  };

  const currentClient = client || defaultClient;

  // Fonction utilitaire pour extraire le CIN du client
  const getClientCIN = (clientData) => {
    return clientData?.CIN || clientData?.cin;
  };

  // Fonction utilitaire pour extraire les informations d'affichage du client
  const getClientDisplayInfo = (clientData) => {
    return {
      prenom: clientData?.Prenom_Visiteur || clientData?.prenom,
      nom: clientData?.Nom_Visiteur || clientData?.nom,
      email: clientData?.Email || clientData?.email,
      telephone: clientData?.Telephone_Visiteur || clientData?.telephone,
      club: clientData?.Club || clientData?.club
    };
  };

  const [ribs, setRibs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState("list");
  const [selectedRib, setSelectedRib] = useState(null);

  const clientCIN = getClientCIN(currentClient);
  const clientInfo = getClientDisplayInfo(currentClient);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!clientCIN) {
        if (mounted) {
          setError("CIN du client manquant");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError("");
      try {
        console.log("Chargement des RIBs pour le CIN:", clientCIN);
        const data = await ribService.getRibsByCin(clientCIN);
        console.log("Réponse API RIBs:", data);
        if (!mounted) return;
        
        // Vérifier que data est un tableau
        if (Array.isArray(data)) {
          setRibs(data);
        } else {
          console.warn("Données RIB non-tableau reçues:", data);
          setRibs([]);
        }
      } catch (err) {
        console.error("Erreur de chargement des RIBs:", err);
        if (mounted) {
          setError("Erreur de chargement des RIBs: " + (err.message || "Erreur inconnue"));
        }
      }
      if (mounted) setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [clientCIN]);

  const handleRefresh = async () => {
    if (!clientCIN) {
      setError("CIN du client manquant");
      return [];
    }

    try {
      setLoading(true);
      const data = await ribService.getRibsByCin(clientCIN);
      if (Array.isArray(data)) {
        setRibs(data);
        return data;
      } else {
        setRibs([]);
        return [];
      }
    } catch (err) {
      console.error("Erreur lors du rafraîchissement:", err);
      setError("Erreur lors du rafraîchissement: " + (err.message || "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
    return [];
  };

  const handleOpenDetails = (rib) => {
    setSelectedRib(rib);
    setCurrentView("details");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedRib(null);
  };

  const handleAddRib = () => {
    setCurrentView("add");
    setSelectedRib(null);
  };

  const handleSubmitRib = async (data) => {
    try {
      setLoading(true);
      // Préparer les données avec le bon format de champs
      const ribData = {
        CIN: clientCIN,
        Banque: data.Banque || data.banque,
        Agence: data.Agence || data.agence,
        Compte: data.Compte || data.compte,
        IBAN: data.IBAN || data.iban || null,
        BIC: data.BIC || data.bic || null,
        Statut: data.Statut !== undefined ? data.Statut : (data.statut !== undefined ? data.statut : 1)
      };
      
      console.log("Données RIB à envoyer:", ribData);
      await ribService.addRib(ribData);
      await handleRefresh();
      setCurrentView("list");
    } catch (err) {
      console.error("Erreur lors de l'ajout du RIB:", err);
      alert("Erreur lors de l'ajout du RIB: " + (err.response?.data?.message || err.message || "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRib = async (id) => {
    try {
      setLoading(true);
      await ribService.deleteRib(id);
      await handleRefresh();
      handleBackToList();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression: " + (err.response?.data?.message || err.message || "Erreur inconnue"));
      setLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    // Si tu as une API pour définir un RIB par défaut, ajoute la logique ici
    // Pour l'instant, on rafraîchit juste la liste
    await handleRefresh();
    const updatedRib = ribs.find((r) => (r.ID_Rib || r.id) === id);
    if (updatedRib) {
      setSelectedRib(updatedRib);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
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
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Gestion des RIB
              </h2>
              <p className="text-gray-500 text-sm">
                {clientInfo.prenom} {clientInfo.nom} - Club {clientInfo.club}
              </p>
              <p className="text-gray-400 text-xs">
                {clientInfo.email} | {clientInfo.telephone}
              </p>
              <p className="text-gray-400 text-xs">
                CIN: {clientCIN}
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
                currentView === "list" ? "text-purple-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentView === "list"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="font-medium">RIBs ({ribs.length})</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div
              className={`flex items-center space-x-2 ${
                currentView === "details" ? "text-purple-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentView === "details"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="font-medium">Détails</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div
              className={`flex items-center space-x-2 ${
                currentView === "add" ? "text-purple-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentView === "add"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span className="font-medium">Nouveau</span>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-500">Chargement des RIBs...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                {error}
              </div>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && currentView === "list" && (
            <div className="space-y-6">
              {/* Actions */}
              

              {/* Liste des RIBs */}
              <RibList
                ribs={ribs}
                onOpenDetails={handleOpenDetails}
                onAdd={handleAddRib}
                onRefresh={handleRefresh}
              />
            </div>
          )}

          {!loading && !error && currentView === "details" && selectedRib && (
            <RibDetails
              rib={selectedRib}
              client={currentClient}
              onBack={handleBackToList}
              onSetDefault={handleSetDefault}
              onDelete={handleDeleteRib}
            />
          )}

          {!loading && !error && currentView === "add" && (
            <AddRibForm
              client={currentClient}
              onCancel={handleBackToList}
              onSubmit={handleSubmitRib}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RibManager;