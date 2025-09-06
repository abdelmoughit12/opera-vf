import React from "react";

const Row = ({ label, children }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-gray-900 text-sm font-medium">{children}</div>
  </div>
);

const HistoryDetails = ({ item, type, onBack }) => {
  const isSales = type === "sales";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Détails {isSales ? "de la vente" : "du paiement"}
        </h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
        >
          Retour
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Informations client
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <Row label="Nom">
                {item.client?.Prenom_Visiteur|| "Abdelmoughit"} {item.client?.Nom_Visiteur || "Mouradi"}
              </Row>
              <Row label="Code client">{item.client?.Code_Club || "OPERA-513266"}</Row>
              <Row label="CIN">{item.client?.CIN ||"DN52625"}</Row>
              <Row label="Club">{item.client?.Club}</Row>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Détails</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <Row label="Date">{item.date}</Row>
              {isSales ? (
                <>
                  <Row label="Type de contrat">{item.contractType}</Row>
                  <Row label="Produit">{item.productName}</Row>
                  <Row label="Quantité">{item.quantity}</Row>
                  <Row label="Prix unitaire">
                    {item.unitPrice.toFixed(2)} DH
                  </Row>
                  <Row label="Remise">{item.discountPercent}%</Row>
                  <Row label="Total">{item.totalPrice.toFixed(2)} DH</Row>
                  <Row label="Statut">
                    {item.status === "payee" ? "Payée" : "En attente"}
                  </Row>
                </>
              ) : (
                <>
                  <Row label="Méthode">{item.method}</Row>
                  <Row label="Montant">{item.amount.toFixed(2)} DH</Row>
                  <Row label="Référence">{item.reference}</Row>
                  <Row label="Vente liée">{item.saleId}</Row>
                  <Row label="Statut">
                    {item.status === "valide" ? "Validé" : "En attente"}
                  </Row>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetails;


