import React from 'react';

const ClientSearch = ({ 
  searchTerm, 
  onSearchChange, 
  onClear 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default ClientSearch; 