import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { VisiteurService } from '../../services/visiteurService';
import { useState } from 'react';
import MessageModal from '../sharedCompoents/MessageModal';

// Schema de validation pour le formulaire visiteur
const visitorSchema = yup.object({
  CIN: yup.string().required('CIN requise'),
  nom: yup.string().required('Nom requis'),
  prenom: yup.string().required('Prénom requis'),
  telephone: yup.string().required('Téléphone requis'),
  source: yup.string().required('Source d\'information requise'),
  interet: yup.string().required('Intérêt principal requis'),
  remarque: yup.string().nullable().max(255),
}).required();
 


const VisiteurForm = ({ 
  show, 
  onHide, 
  onSubmit 
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(visitorSchema),
    defaultValues: {
    Date_visite: new Date().toISOString().split('T')[0],
  },
  });
    const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');

  // Gérer la soumission du formulaire
const handleFormSubmit = async (data) => {
  try {
    const formattedData = {
      CIN: data.CIN,
      Nom: data.nom,
      Prenom: data.prenom,
      Telephone: data.telephone,
      Remarque: data.remarque,
      Date_Visite: new Date(data.Date_visite).toISOString().split('T')[0],
      status: 'Nouveau',
      Commerciale: 'Commercial par défaut',
      Source_d_information: data.source,
      Intérêt_principal_: data.interet
    };

    const response = await VisiteurService.create(formattedData);

    // Si la création a réussi
    setSuccessMessage('Visiteur enregistré avec succès !');
    setErrorMessage('');
    reset();
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(([field, messages]) => {
        console.error(`${field}: ${messages.join(', ')}`);
      });
    }
    setErrorMessage(error.response?.data?.message || "Erreur lors de l'enregistrement");
    setSuccessMessage('');
  }
};

  // Gérer la fermeture du modal
  const handleClose = () => {
    reset();
    onHide();
  };

  // Ne rien afficher si le modal n'est pas ouvert
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête du modal */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Nouveau Visiteur</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Champ CIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CIN *</label>
              <input
                type="text"
                {...register('CIN')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.CIN && <p className="text-red-500 text-sm mt-1">{errors.CIN.message}</p>}
            </div>
            {/* Champ Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input
                type="text"
                {...register('nom')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
            </div>

            {/* Champ Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
              <input
                type="text"
                {...register('prenom')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>}
            </div>

            {/* Champ Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
              <input
                type="tel"
                {...register('telephone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone.message}</p>}
            </div>


            {/* Champ Source d'information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source d'information *</label>
              <select
                {...register('source')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner une source</option>
                <option value="Réseaux sociaux">Réseaux sociaux</option>
                <option value="Bouche à oreille">Bouche à oreille</option>
                <option value="Publicité">Publicité</option>
                <option value="Site web">Site web</option>
                <option value="Autres">Autres</option>
              </select>
              {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>}
            </div>

            {/* Champ Intérêt principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intérêt principal *</label>
              <select
                {...register('interet')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un intérêt</option>
                <option value="Musculation">Musculation</option>
                <option value="Cardio">Cardio</option>
                <option value="Yoga">Yoga</option>
                <option value="Spa">Spa</option>
                <option value="Pilates">Pilates</option>
                <option value="Autres">Autres</option>
              </select>
              {errors.interet && <p className="text-red-500 text-sm mt-1">{errors.interet.message}</p>}
            </div>
          </div>

          {/* Champ Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarque *</label>
            <textarea
              {...register('remarque')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.remarque && <p className="text-red-500 text-sm mt-1">{errors.remarque.message}</p>}
          </div>
          {/* Champ Date visite */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date de visite *</label>
            <input
              type="date"
              {...register('Date_visite')}
              disabled
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.Date_visite && <p className="text-red-500 text-sm mt-1">{errors.Date_visite.message}</p>}
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Enregistrer
            </button>
          </div>
          <MessageModal
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
          <MessageModal
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />

        </form>
      </div>
    </div>
  );
};

export default VisiteurForm; 