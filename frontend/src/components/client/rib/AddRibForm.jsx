import React, { useState } from "react";
import { useNotification } from "../../../hooks/useNotification";

const banques = [
  "Attijariwafa Bank",
  "Banque Populaire",
  "BMCE Bank",
  "Société Générale Maroc",
  "CFG Bank",
  "Crédit du Maroc",
  "BMCI",
  "Al Barid Bank",
  "Autre",
];

const AddRibForm = ({ client, onCancel, onSubmit }) => {
  const [form, setForm] = useState({
    Banque: "",
    IBAN: "",
    BIC: "",
    Agence: "",
    Compte: "",
    Statut: false,
  });

const { error, success } = useNotification();

const handleSave = () => {
  if (!form.Banque || !form.IBAN || !form.Compte) {
    error("Veuillez renseigner au minimum Banque, IBAN et Compte");
    return;
  }
  onSubmit(form);
  success("RIB enregistré avec succès");
};

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

 
  const clientInfo = {
    prenom: client?.Prenom_Visiteur || client?.prenom,
    nom: client?.Nom_Visiteur || client?.nom,
    email: client?.Email || client?.email,
    telephone: client?.Telephone_Visiteur || client?.telephone,
    club: client?.Club || client?.club
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Ajouter un RIB</h3>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
        >
          Annuler
        </button>
      </div>

      {/* Informations du client */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          Informations du client
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-blue-700 font-medium">Nom:</span>
            <span className="text-blue-900">{clientInfo.prenom} {clientInfo.nom}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-700 font-medium">Club:</span>
            <span className="text-blue-900">{clientInfo.club}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-700 font-medium">Email:</span>
            <span className="text-blue-900">{clientInfo.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-700 font-medium">Téléphone:</span>
            <span className="text-blue-900">{clientInfo.telephone}</span>
          </div>
        </div>
      </div>

      {/* Formulaire RIB */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Informations bancaires</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banque <span className="text-red-500">*</span>
            </label>
            <select
              value={form.Banque}
              onChange={(e) => handleChange("Banque", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              <option value="">Sélectionner une banque</option>
              {banques.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compte <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.Compte}
              onChange={(e) => handleChange("Compte", e.target.value)}
              placeholder="Numéro de compte"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IBAN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.IBAN}
              onChange={(e) => handleChange("IBAN", e.target.value)}
              placeholder="MA64 0000 0000 0000 0000 0000 000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BIC/SWIFT
            </label>
            <input
              type="text"
              value={form.BIC}
              onChange={(e) => handleChange("BIC", e.target.value)}
              placeholder="BICSWIFT"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agence
            </label>
            <input
              type="text"
              value={form.Agence}
              onChange={(e) => handleChange("Agence", e.target.value)}
              placeholder="Nom de l'agence"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <input
                id="Statut"
                type="checkbox"
                checked={form.Statut}
                onChange={(e) => handleChange("Statut", e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="Statut" className="text-sm text-purple-900 font-medium">
                Définir comme RIB par défaut
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Enregistrer le RIB
        </button>
      </div>
    </div>
  );
};

export default AddRibForm;
