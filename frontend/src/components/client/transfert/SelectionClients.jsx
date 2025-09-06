import React, { useState, useEffect } from "react";

const SelectionClients = ({ clientSource, onComplete, selectedData }) => {
  const [clientCible, setClientCible] = useState(selectedData.clientCible);
  const [fraisTransfert, setFraisTransfert] = useState(
    selectedData.fraisTransfert
  );
  const [message, setMessage] = useState(selectedData.message);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Simuler le chargement des clients (mock data pour le frontend)
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        // Simulation de données clients pour le frontend
        const mockClients = [
          {
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
          },
          {
            id: 2,
            nom: "Martin",
            prenom: "Marie",
            Code_client: "CL002",
            CIN: "CD789012",
            Club: "Club B",
            email: "marie.martin@email.com",
            telephone: "0623456789",
            date_debut: "2024-02-01",
            date_fin: "2025-01-31",
          },
          {
            id: 3,
            nom: "Bernard",
            prenom: "Pierre",
            Code_client: "CL003",
            CIN: "EF345678",
            Club: "Club C",
            email: "pierre.bernard@email.com",
            telephone: "0634567890",
            date_debut: "2024-03-01",
            date_fin: "2025-02-28",
          },
        ];

        // Filtrer le client source de la liste
        const filteredClients = mockClients.filter(
          (client) => client.id !== clientSource?.id
        );
        setClients(filteredClients);
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
        // En cas d'erreur, on utilise une liste vide
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [clientSource?.id]);

  // Filtrer les clients selon la recherche
  const filteredClients = clients.filter(
    (client) =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.Code_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.CIN.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Continuer vers la confirmation
  const handleContinue = () => {
    if (!clientCible) {
      alert("Veuillez sélectionner un client cible");
      return;
    }

    onComplete({
      clientSource,
      clientCible,
      fraisTransfert,
      message,
    });
  };

  return (
    <div className="space-y-6">
      {/* Message d'attention */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-red-600 mt-0.5"
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
            <h3 className="text-sm font-semibold text-red-800">
              Attention Important
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Une fois le transfert effectué et validé, le client source sera
              bloqué et le reste de la période initiale sera affecté au client
              cible.
            </p>
          </div>
        </div>
      </div>

      {/* Informations du client source */}
      <div className="bg-blue-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Client Source
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-blue-700">Code client:</span>{" "}
            {clientSource?.Code_client || "OPERA-513266"}
          </div>
          <div>
            <span className="font-medium text-blue-700">CIN:</span>{" "}
            {clientSource?.CIN || "Non spécifié"}
          </div>
          <div>
            <span className="font-medium text-blue-700">Nom:</span>{" "}
            {clientSource?.prenom || "Abdelmoughit"} {clientSource?.nom || "Mouradi"}
          </div>
          <div>
            <span className="font-medium text-blue-700">Club:</span>{" "}
            {clientSource?.Club || "Non spécifié"}
          </div>
          <div>
            <span className="font-medium text-blue-700">Email:</span>{" "}
            {clientSource?.email || "abdelmoughit@gmail.com"}
          </div>
          <div>
            <span className="font-medium text-blue-700">Téléphone:</span>{" "}
            {clientSource?.telephone || "0771952328"}
          </div>
          <div>
            <span className="font-medium text-blue-700">Date début:</span>{" "}
            {clientSource?.date_debut || "2025-08-23"}
          </div>
          <div>
            <span className="font-medium text-blue-700">Date fin:</span>{" "}
            {clientSource?.date_fin || "2025-12-23"}
          </div>
        </div>
      </div>

      {/* Sélection du client cible */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Client Cible
        </h3>

        {/* Recherche */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher un client
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, prénom, code client ou CIN..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Liste des clients */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Chargement des clients...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => setClientCible(client)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  clientCible?.id === client.id
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="font-semibold">
                      {client.prenom} {client.nom}
                    </div>
                    <div className="text-sm text-gray-500">
                      {client.Code_client}
                    </div>
                  </div>
                  <div className="text-sm space-y-0.5">
                    <div>
                      <span className="font-medium">CIN:</span> {client.CIN}
                    </div>
                    <div>
                      <span className="font-medium">Club:</span> {client.Club}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {client.email}
                    </div>
                    <div>
                      <span className="font-medium">Téléphone:</span>{" "}
                      {client.telephone}
                    </div>
                    <div>
                      <span className="font-medium">Date début:</span>{" "}
                      {client.date_debut}
                    </div>
                    <div>
                      <span className="font-medium">Date de fin:</span>{" "}
                      {client.date_fin}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {filteredClients.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            Aucun client trouvé
          </div>
        )}
      </div>

      {/* Frais de transfert */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frais de transfert (DH)
        </label>
        <input
          type="number"
          min="0"
          value={fraisTransfert}
          onChange={(e) => setFraisTransfert(parseFloat(e.target.value) || 0)}
          className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="0.00"
        />
      </div>

      {/* Message optionnel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message (optionnel)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Ajouter un message ou une note..."
        />
      </div>

      {/* Bouton continuer */}
      {clientCible && (
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
          >
            Continuer vers la confirmation
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectionClients;
