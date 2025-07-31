import React from 'react';
import Layout from '../Layout';

const Sales = () => {
  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Ventes</h1>
            <p className="text-gray-600 mt-2">Suivez et gérez vos ventes</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💰</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Ventes</h2>
              <p className="text-gray-600">Cette page sera développée pour la gestion complète des ventes</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sales; 