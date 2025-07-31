import React from 'react';
import Layout from '../Layout';

const Settings = () => {
  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600 mt-2">Configurez votre application</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⚙️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Paramètres</h2>
              <p className="text-gray-600">Cette page sera développée pour la configuration de l'application</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings; 