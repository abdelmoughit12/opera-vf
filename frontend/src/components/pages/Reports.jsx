import React from 'react';
import Layout from '../Layout';

const Reports = () => {
  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Rapports et Analyses</h1>
            <p className="text-gray-600 mt-2">Consultez vos rapports détaillés</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Rapports</h2>
              <p className="text-gray-600">Cette page sera développée pour les rapports et analyses détaillés</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports; 