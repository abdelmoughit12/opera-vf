import React from "react";

/**
 * Composant VisiteurFilters
 *
 * Ce composant gère les filtres avancés pour les visiteurs.
 * Il permet de filtrer par statut et source d'information.
 *
 * Props:
 * - filterStatus: valeur actuelle du filtre de statut
 * - filterSource: valeur actuelle du filtre de source
 * - onFilterStatusChange: fonction appelée quand le statut change
 * - onFilterSourceChange: fonction appelée quand la source change
 * - onClearFilters: fonction appelée pour réinitialiser tous les filtres
 */
const VisiteurFilters = ({
  filterStatus,
  filterSource,
  date_visite,
  onFilterDate_visite,
  onFilterStatusChange,
  onFilterSourceChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtre - Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Nouveau">Nouveau</option>
            <option value="En cours">En cours</option>
            <option value="Converti">Converti</option>
            <option value="Perdu">Perdu</option>
          </select>
        </div>

        {/* Filtre - Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source
          </label>
          <select
            value={filterSource}
            onChange={(e) => onFilterSourceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Toutes">Toutes les sources</option>
            <option value="Réseaux sociaux">Réseaux sociaux</option>
            <option value="Bouche à oreille">Bouche à oreille</option>
            <option value="Publicité">Publicité</option>
            <option value="Site web">Site web</option>
          </select>
        </div>
        {/* Filtres - Date de visite  */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de visite
          </label>
          <input
            type="date"
            value={date_visite}
            onChange={(e) => onFilterDate_visite("date_visite", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
       
        {/* Bouton de réinitialisation */}
        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisiteurFilters;
