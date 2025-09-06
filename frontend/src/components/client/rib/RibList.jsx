import React from "react";

const RibList = ({ ribs, onAdd, onRefresh, onOpenDetails }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          RIBs enregistrés
        </h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            Rafraîchir
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Ajouter un RIB
          </button>
        </div>
      </div>

      {ribs.length === 0 ? (
        <div className="text-center text-gray-500 py-12 border rounded-xl">
          Aucun RIB pour ce client.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ribs.map((rib) => (
            <button
              key={rib.ID_Rib || rib.id}
              onClick={() => onOpenDetails(rib)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                rib.Statut
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">{rib.Banque}</div>
                {rib.Statut && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    Défaut
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-700">
                <div>
                  <span className="text-gray-500">Compte:</span> {rib.Compte}
                </div>
                <div className="truncate">
                  <span className="text-gray-500">IBAN:</span> {rib.IBAN}
                </div>
                {rib.BIC && (
                  <div>
                    <span className="text-gray-500">BIC:</span> {rib.BIC}
                  </div>
                )}
                {rib.Agence && (
                  <div>
                    <span className="text-gray-500">Agence:</span> {rib.Agence}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RibList;
