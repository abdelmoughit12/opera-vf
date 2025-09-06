import React from 'react';

const ClientFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres avancés</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select
            value={filters.Status}
            onChange={(e) => onFilterChange('Status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="en_attente">En attente</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de client</label>
          <select
            value={filters.Type_Client}
            onChange={(e) => onFilterChange('Type_Client', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les types</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
          <input
            type="date"
            value={filters.Date_debut}
            onChange={(e) => onFilterChange('Date_debut', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
          <input
            type="date"
            value={filters.date_fin}
            onChange={(e) => onFilterChange('date_fin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
          <input
            type="text"
            placeholder="Rechercher par ville"
            value={filters.ville}
            onChange={(e) => onFilterChange('ville', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Effacer les filtres
        </button>
      </div>
    </div>
  );
};

export default ClientFilters; 