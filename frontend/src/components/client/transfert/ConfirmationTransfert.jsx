import React from 'react';

const ConfirmationTransfert = ({ selectedData, onConfirm, onCancel, onBack }) => {
  const { clientSource, clientCible, fraisTransfert, message } = selectedData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Confirmer le Transfert</h2>
              <p className="text-gray-500 text-sm">Vérifiez les informations avant de confirmer</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Message d'attention */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800">Attention Important</h3>
                <p className="text-sm text-red-700 mt-1">
                  Une fois le transfert effectué et validé, le client source sera bloqué et le reste de la période initiale sera affecté au client cible.
                </p>
              </div>
            </div>
          </div>

          {/* Informations du client source */}
          <div className="bg-red-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Client Source (Sera Bloqué)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-red-700">Code client:</span> {clientSource?.Code_client}
              </div>
              <div>
                <span className="font-medium text-red-700">CIN:</span> {clientSource?.CIN}
              </div>
              <div>
                <span className="font-medium text-red-700">Nom:</span> {clientSource?.prenom} {clientSource?.nom}
              </div>
              <div>
                <span className="font-medium text-red-700">Club:</span> {clientSource?.Club}
              </div>
              <div>
                <span className="font-medium text-red-700">Email:</span> {clientSource?.email}
              </div>
              <div>
                <span className="font-medium text-red-700">Téléphone:</span> {clientSource?.telephone}
              </div>
            </div>
          </div>

          {/* Flèche de transfert */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 text-orange-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="font-semibold">Transfert vers</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>

          {/* Informations du client cible */}
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Client Cible (Recevra l'Abonnement)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-700">Code client:</span> {clientCible?.Code_client}
              </div>
              <div>
                <span className="font-medium text-green-700">CIN:</span> {clientCible?.CIN}
              </div>
              <div>
                <span className="font-medium text-green-700">Nom:</span> {clientCible?.prenom} {clientCible?.nom}
              </div>
              <div>
                <span className="font-medium text-green-700">Club:</span> {clientCible?.Club}
              </div>
              <div>
                <span className="font-medium text-green-700">Email:</span> {clientCible?.email}
              </div>
              <div>
                <span className="font-medium text-green-700">Téléphone:</span> {clientCible?.telephone}
              </div>
            </div>
          </div>

          {/* Détails du transfert */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du Transfert</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de transfert:</span>
                <span className="font-medium">{fraisTransfert.toFixed(2)} DH</span>
              </div>
              {message && (
                <div className="border-t pt-2 mt-2">
                  <div className="text-gray-600 mb-1">Message:</div>
                  <div className="text-sm bg-white p-3 rounded-lg border">
                    {message}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message de confirmation */}
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-yellow-800">Confirmation Requise</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Êtes-vous sûr de vouloir effectuer ce transfert ? Cette action est irréversible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Retour
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
            >
              Confirmer le Transfert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationTransfert; 