import React, { useState } from "react";
import { useNotification } from "../../../hooks/useNotification";

const reasons = [
  { id: "fin_contrat", label: "Fin de contrat" },
  { id: "insatisfaction", label: "Insatisfaction" },
  { id: "demenagement", label: "Déménagement" },
  { id: "sante", label: "Raison de santé" },
  { id: "autre", label: "Autre" },
];

const initialForm = (client) => ({
  clientId: client?.id || null,
  resiliationDate: new Date().toISOString().split("T")[0],
  reason: "",
  notes: "",
  refundAmount: 0,
  confirmBlockAccess: true,
});

const ResiliationForm = ({ client, form, setForm, onNext, onCancel }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Résiliation</h3>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
        >
          Annuler
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl">
        <h4 className="font-semibold text-blue-900 mb-2">Client</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Nom:</span>{" "}
            {client?.Prenom_Visiteur } {client?.Nom_Visiteur}
          </div>
          <div>
            <span className="text-blue-700 font-medium">Code client:</span>{" "}
            {client?.Code_Club}
          </div>
          <div>
            <span className="text-blue-700 font-medium">CIN:</span>{" "}
            {client?.CIN}
          </div>
          <div>
            <span className="text-blue-700 font-medium">Club:</span>{" "}
            {client?.Club}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de résiliation
          </label>
          <input
            type="date"
            value={form.resiliationDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, resiliationDate: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motif
          </label>
          <select
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Sélectionner un motif</option>
            {reasons.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant de remboursement (DH)
          </label>
          <input
            type="number"
            min="0"
            value={form.refundAmount}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                refundAmount: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Notes ou détails supplémentaires"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="md:col-span-2 flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <input
            id="confirmBlockAccess"
            type="checkbox"
            checked={form.confirmBlockAccess}
            onChange={(e) =>
              setForm((f) => ({ ...f, confirmBlockAccess: e.target.checked }))
            }
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
          />
          <label
            htmlFor="confirmBlockAccess"
            className="text-sm text-yellow-900 font-medium"
          >
            Confirmer le blocage d'accès après résiliation
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
        >
          Annuler
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

const ResiliationReview = ({ client, form, onBack, onConfirm }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Vérification</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
        >
          Modifier
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-red-600 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-red-800">Attention</h3>
            <p className="text-sm text-red-700 mt-1">
              La résiliation bloque l'accès du client et peut entraîner un
              remboursement.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Client</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Nom:</span> {client?.Prenom_Visiteur}{" "}
              {client?.Nom_Visiteur}
            </div>
            <div>
              <span className="font-medium">Code client:</span>{" "}
              {client?.Code_Club}
            </div>
            <div>
              <span className="font-medium">CIN:</span> {client?.CIN}
            </div>
            <div>
              <span className="font-medium">Club:</span> {client?.Club}
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Détails</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Date:</span> {form.resiliationDate}
            </div>
            <div>
              <span className="font-medium">Motif:</span>{" "}
              {reasons.find((r) => r.id === form.reason)?.label || "-"}
            </div>
            <div>
              <span className="font-medium">Remboursement:</span>{" "}
              {form.refundAmount.toFixed(2)} DH
            </div>
            <div>
              <span className="font-medium">Notes:</span> {form.notes || "-"}
            </div>
            <div>
              <span className="font-medium">Blocage accès:</span>{" "}
              {form.confirmBlockAccess ? "Oui" : "Non"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Retour
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Confirmer la Résiliation
        </button>
      </div>
    </div>
  );
};

const ResiliationManagerModal = ({ client, onClose }) => {
  const [step, setStep] = useState("form"); // form | review | done
  const [form, setForm] = useState(() => initialForm(client));
  const { success, error } = useNotification();

  const handleConfirm = async () => {
    try {
      // Simulation frontend uniquement
      await new Promise((r) => setTimeout(r, 800));
      success("Résiliation effectuée avec succès (simulation frontend)");
      onClose?.();
    } catch (err) {
      error("Erreur lors de la résiliation");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Résiliation</h2>
              <p className="text-gray-500 text-sm">
                {client?.prenom} {client?.nom}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center p-4 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                step === "form" ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "form"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="font-medium">Formulaire</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div
              className={`flex items-center space-x-2 ${
                step === "review" ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "review"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="font-medium">Vérification</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "form" && (
            <ResiliationForm
              client={client}
              form={form}
              setForm={setForm}
              onCancel={onClose}
              onNext={() => {
                if (!form.reason) {
                  error("Veuillez sélectionner un motif");
                  return;
                }
                setStep("review");
              }}
            />
          )}

          {step === "review" && (
            <ResiliationReview
              client={client}
              form={form}
              onBack={() => setStep("form")}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResiliationManagerModal;
