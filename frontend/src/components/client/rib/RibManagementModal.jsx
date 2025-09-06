import React, { useState, useEffect } from "react";
import RibList from "./RibList";
import RibDetails from "./RibDetails";
import AddRibForm from "./AddRibForm";
import ribService from "../../../services/ribService";
import { useNotification } from "../../../hooks/useNotification";
import ConfirmDialog from "../../common/ConfirmDialog";

const RibManagementModal = ({ client, onClose }) => {
  const [ribs, setRibs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState("list"); // list | details | add
  const [selectedRib, setSelectedRib] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ribToDelete, setRibToDelete] = useState(null);
  const { success, error: showError } = useNotification();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const ribs = await ribService.getRibsByCin(client?.cin);
        if (!mounted) return;
        setRibs(ribs);
      } catch (err) {
        if (!mounted) return;
        setError("Erreur de chargement des RIBs");
      }
      setLoading(false);
    };
    if (client?.cin) load();
    return () => {
      mounted = false;
    };
  }, [client?.cin]);

  const handleRefresh = async () => {
    try {
      const ribs = await ribService.getRibsByCin(client?.cin);
      setRibs(ribs);
      return ribs;
    } catch (err) {
      setError("Erreur de chargement des RIBs");
      return [];
    }
  };

  const handleAddRib = () => {
    setCurrentView("add");
    setSelectedRib(null);
  };

  const handleOpenDetails = (rib) => {
    setSelectedRib(rib);
    setCurrentView("details");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedRib(null);
  };

  const handleRibAdded = async (data) => {
    try {
      await ribService.addRib({ ...data, CIN: client?.cin });
      await handleRefresh();
      setCurrentView("list");
      success("RIB ajouté avec succès");
    } catch (err) {
      showError("Erreur lors de l'ajout du RIB");
    }
  };

  const handleDeleteRib = async (id) => {
    setRibToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRib = async () => {
    try {
      await ribService.deleteRib(ribToDelete);
      await handleRefresh();
      handleBackToList();
      success("RIB supprimé avec succès");
    } catch (err) {
      showError("Erreur lors de la suppression du RIB");
    } finally {
      setShowDeleteConfirm(false);
      setRibToDelete(null);
    }
  };

  // Optionnel : si tu as une API pour définir un RIB par défaut
  const handleSetDefault = async (id) => {
    // Ajoute ici la logique si tu as une route dédiée
    await handleRefresh();
    setSelectedRib(ribs.find((r) => r.id === id) || null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
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
                {client?.prenom} {client?.nom}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
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
              <span className="font-medium">RIBs</span>
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
            <div className="text-center py-8">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-500">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Chargement des RIBs...
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-red-600 bg-red-100 rounded-lg">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          {!loading && !error && currentView === "list" && (
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  RIB enregistrés
                </h3>
                <button
                  onClick={handleAddRib}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Ajouter un RIB</span>
                </button>
              </div>

              {/* Liste des RIBs */}
              {ribs.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucun RIB
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Commencez par ajouter un RIB pour ce client.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleAddRib}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
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
                      Ajouter un RIB
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {ribs.map((rib) => (
                    <div
                      key={rib.ID_Rib || rib.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors cursor-pointer"
                      onClick={() => handleOpenDetails(rib)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
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
                            <div className="font-semibold text-gray-900">
                              {rib.Banque}
                            </div>
                            <div className="text-sm text-gray-500">
                              {rib.Agence}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {rib.Statut && (
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                              Par défaut
                            </span>
                          )}
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && !error && currentView === "details" && selectedRib && (
            <RibDetails
              rib={selectedRib}
              onBack={handleBackToList}
              onSetDefault={handleSetDefault}
              onDelete={handleDeleteRib}
            />
          )}

          {!loading && !error && currentView === "add" && (
            <AddRibForm
              client={client}
              onCancel={handleBackToList}
              onSubmit={handleRibAdded}
            />
          )}
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce RIB ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmVariant="danger"
        onConfirm={confirmDeleteRib}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setRibToDelete(null);
        }}
      />
    </div>
  );
};

export default RibManagementModal;
