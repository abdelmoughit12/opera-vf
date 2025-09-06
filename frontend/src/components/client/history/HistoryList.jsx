import React from "react";

const HistoryList = ({ items, type, onOpenDetails }) => {
  const isSales = type === "sales";

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-dashed border-gray-300 rounded-xl">
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
          Aucun élément
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Aucun résultat selon vos filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onOpenDetails(it)}
          className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors text-left bg-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">{it.date}</div>
              <div className="font-semibold text-gray-900 mt-1">
                {isSales ? it.productName : `${it.method} • ${it.reference}`}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {it.client?.prenom} {it.client?.nom} • {it.client?.Code_client}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-sm font-medium ${
                  isSales ? "text-indigo-600" : "text-green-600"
                }`}
              >
                {isSales
                  ? `${it.totalPrice.toFixed(2)} DH`
                  : `${it.amount.toFixed(2)} DH`}
              </div>
              <div className="text-xs mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    (isSales ? it.status === "payee" : it.status === "valide")
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {isSales
                    ? it.status === "payee"
                      ? "Payée"
                      : "En attente"
                    : it.status === "valide"
                    ? "Validé"
                    : "En attente"}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default HistoryList;


