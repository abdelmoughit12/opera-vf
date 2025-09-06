import React, { useState, useEffect } from 'react';
import venteService from "../../../services/venteService";
import { toast } from 'react-toastify';

const Paiement = ({ selectedData, client, onComplete, onBack, paiementData }) => {
  const [typePaiement, setTypePaiement] = useState(paiementData?.typePaiement || '');
  const [montant, setMontant] = useState(paiementData?.montant || selectedData?.prixTotal || 0);
  const [compte, setCompte] = useState(paiementData?.compte || '');
  const [dateValidation, setDateValidation] = useState(paiementData?.dateValidation || '');
  const [banque, setBanque] = useState(paiementData?.banque || '');
  const [numeroCheque, setNumeroCheque] = useState('');
  const [numeroCarte, setNumeroCarte] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const clientCIN = client?.CIN;

  // Types de paiement disponibles
  const typesPaiement = [
    { id: 'especes', nom: 'Espèces', icon: '💵', description: 'Paiement en espèces' },
    { id: 'cheque', nom: 'Chèque', icon: '🏦', description: 'Paiement par chèque' },
    { id: 'carte', nom: 'Carte bancaire', icon: '💳', description: 'Paiement par carte' },
    { id: 'virement', nom: 'Virement bancaire', icon: '🏛️', description: 'Virement bancaire' }
  ];

  // Liste des banques
  const banques = [
    'Attijariwafa Bank',
    'Banque Populaire',
    'BMCE Bank',
    'Société Générale Maroc',
    'CFG Bank',
    'Bank Al-Maghrib',
    'Crédit du Maroc',
    'BMCI',
    'Al Barid Bank',
    'Autre'
  ];

  // Liste des comptes
  const comptes = [
    'Compte Principal',
    'Compte Épargne',
    'Compte Courant',
    'Compte Professionnel',
    'Compte Joint'
  ];

  // Mettre à jour le montant quand le prix total change
  useEffect(() => {
    if (selectedData?.prixTotal) {
      setMontant(selectedData.prixTotal);
    }
  }, [selectedData?.prixTotal]);

  // Continuer vers la confirmation
  const handleContinue = async () => {
    // Validation des champs obligatoires
    if (!typePaiement || !montant || !dateValidation) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (typePaiement === 'cheque' && !numeroCheque) {
      toast.error('Veuillez saisir le numéro de chèque');
      return;
    }

    if (typePaiement === 'carte' && (!numeroCarte || !dateExpiration || !cvv)) {
      toast.error('Veuillez remplir tous les champs de la carte');
      return;
    }

    setIsLoading(true);
    
    try {
      const venteData = {
        CIN: clientCIN,
        ID_Produit: selectedData?.produit?.ID_Produit,
        Quantite: selectedData?.quantite || 1,
        Prix_Unitaire: selectedData?.prixUnitaire || 0,
        Remise: selectedData?.remise || 0,
        ID_Type_Paiement: typePaiementToId(typePaiement),
        Statut_Paiement: 'paye',
        Notes: `Paiement ${typePaiement}${banque ? ` - Banque: ${banque}` : ''}${numeroCheque ? ` - Chèque: ${numeroCheque}` : ''}`,
        Date_Vente: dateValidation,
        banque: banque || null,
      };

      console.log('Envoi des données au serveur:', venteData);

      const result = await venteService.createVente(venteData);
      
      if (result?.success) {
        toast.success('Vente créée avec succès!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Appel du callback avec les données complètes
        onComplete({
          ...result.data,
          paiementType: typePaiement,
          montantPaye: montant,
          dateValidation: dateValidation
        });
      } else {
        throw new Error(result?.message || 'Erreur lors de la création de la vente');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      
      // Gestion des erreurs de validation Laravel
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join(', ');
        toast.error(`Erreur de validation: ${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error(error.message || 'Une erreur est survenue lors de la création de la vente', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Exemple de mapping type => ID_Type_Paiement
  const typePaiementToId = (type) => {
    switch (type) {
      case 'especes': return 1;
      case 'cheque': return 2;
      case 'carte': return 3;
      case 'virement': return 4;
      default: return 1;
    }
  };

  // Rendu conditionnel des champs selon le type de paiement
  const renderPaiementFields = () => {
    switch (typePaiement) {
      case 'especes':
        return (
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">💵</span>
              <span className="font-semibold text-green-800">Paiement en espèces</span>
            </div>
            <p className="text-green-700 text-sm">
              Le montant sera payé en espèces lors de la validation.
            </p>
          </div>
        );

      case 'cheque':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de chèque *
              </label>
              <input
                type="text"
                value={numeroCheque}
                onChange={(e) => setNumeroCheque(e.target.value)}
                placeholder="Ex: 123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banque
                </label>
                <select
                  value={banque}
                  onChange={(e) => setBanque(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une banque</option>
                  {banques.map((banque) => (
                    <option key={banque} value={banque}>{banque}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compte
                </label>
                <select
                  value={compte}
                  onChange={(e) => setCompte(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un compte</option>
                  {comptes.map((compte) => (
                    <option key={compte} value={compte}>{compte}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'carte':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de carte *
              </label>
              <input
                type="text"
                value={numeroCarte}
                onChange={(e) => setNumeroCarte(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'expiration *
                </label>
                <input
                  type="text"
                  value={dateExpiration}
                  onChange={(e) => setDateExpiration(e.target.value)}
                  placeholder="MM/AA"
                  maxLength="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'virement':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🏛️</span>
                <span className="font-semibold text-blue-800">Virement bancaire</span>
              </div>
              <p className="text-blue-700 text-sm mb-3">
                Les coordonnées bancaires seront fournies après validation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banque
                </label>
                <select
                  value={banque}
                  onChange={(e) => setBanque(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une banque</option>
                  {banques.map((banque) => (
                    <option key={banque} value={banque}>{banque}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compte
                </label>
                <select
                  value={compte}
                  onChange={(e) => setCompte(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un compte</option>
                  {comptes.map((compte) => (
                    <option key={compte} value={compte}>{compte}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Safe rendering for price with fallback
  const renderPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '0.00';
    }
    return parseFloat(price).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Résumé de la commande */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la commande</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Type de contrat:</span>
            <span className="font-medium">{selectedData?.typeContrat || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Produit:</span>
            <span className="font-medium">{selectedData?.produit?.Nom_Produit || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantité:</span>
            <span className="font-medium">{selectedData?.quantite || 1}</span>
          </div>
          <div className="flex justify-between">
            <span>Période:</span>
            <span className="font-medium">
              {selectedData?.dateDebut || 'N/A'} - {selectedData?.dateFin || 'N/A'}
            </span>
          </div>
          {selectedData?.remise > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Remise:</span>
              <span className="font-medium">{selectedData.remise}%</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>Total à payer:</span>
            <span className="text-green-600">{renderPrice(selectedData?.prixTotal)} DH</span>
          </div>
        </div>
      </div>

      {/* Sélection du type de paiement */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Type de paiement</h3>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {typesPaiement.map((type) => (
            <button
              key={type.id}
              onClick={() => setTypePaiement(type.id)}
              className={`p-4 min-w-[196px] rounded-xl border-2 transition-all ${
                typePaiement === type.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="font-semibold">{type.nom}</div>
              <div className="text-sm text-gray-600">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Champs spécifiques au type de paiement */}
      {typePaiement && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du paiement</h3>
          {renderPaiementFields()}
        </div>
      )}

      {/* Montant et date de validation */}
      {typePaiement && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant à payer (DH)
            </label>
            <input
              type="number"
              value={montant}
              onChange={(e) => setMontant(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de validation *
            </label>
            <input
              type="date"
              value={dateValidation}
              onChange={(e) => setDateValidation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Boutons de navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
        >
          Retour
        </button>
        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Traitement...</span>
            </>
          ) : (
            <span>Valider le paiement</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Paiement;