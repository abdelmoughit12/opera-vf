import React from "react";

const HistoryFilters = ({
  filters,
  onChange,
  contractTypes,
  products,
  showProductFilters,
  showClientFilter = true,
}) => {
  const set = (field, value) => onChange({ ...filters, [field]: value });

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {showClientFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <input
              type="text"
              value={filters.clientQuery || ""}
              onChange={(e) => set("clientQuery", e.target.value)}
              placeholder="Nom, Prénom, Code client, CIN"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date début
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set("dateFrom", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date fin
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set("dateTo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {showProductFilters && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de contrat
              </label>
              <select
                value={filters.contractType}
                onChange={(e) => set("contractType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tous</option>
                {contractTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Produit
              </label>
              <select
                value={filters.productId}
                onChange={(e) => set("productId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tous</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche produit
              </label>
              <input
                type="text"
                value={filters.productQuery || ""}
                onChange={(e) => set("productQuery", e.target.value)}
                placeholder="Nom du produit (libre)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryFilters;
