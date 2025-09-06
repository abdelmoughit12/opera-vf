import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schema de validation
const clientSchema = yup
  .object({
    Code_client: yup.string().required("Code client requis"),
    CIN: yup.string().required("CIN requis"),
    Club: yup.string().required("Club requis"),
    nom: yup.string().required("Nom requis"),
    prenom: yup.string().required("Prénom requis"),
    email: yup.string().email("Email invalide").required("Email requis"),
    telephone: yup.string().required("Téléphone requis"),
    date_naissance: yup.date().nullable(),
    adresse: yup.string(),
    code_postal: yup.string().required("Code postal requis"),
    ville: yup.string().required("Ville requise"),
    statut: yup.string().required("Statut requis"),
    type_client: yup.string().required("Type de client requis"),
    notes: yup.string(),
  })
  .required();

const ClientForm = ({ show, onHide, client, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clientSchema),
  });

  // Remplir le formulaire quand un client est sélectionné pour modification
  React.useEffect(() => {
    if (client && show) {
      setValue("Code_client", client.Code_client);
      setValue("CIN", client.CIN);
      setValue("Club", client.Club);
      setValue("nom", client.nom);
      setValue("prenom", client.prenom);
      setValue("email", client.email);
      setValue("telephone", client.telephone);
      setValue("date_naissance", client.date_naissance);
      setValue("adresse", client.adresse);
      setValue("code_postal", client.code_postal);
      setValue("ville", client.ville);
      setValue("statut", client.statut);
      setValue("type_client", client.type_client);
      setValue("notes", client.notes);
    } else if (!client && show) {
      reset();
    }
  }, [client, show, setValue, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {client ? "Modifier le Client" : "Nouveau Client"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
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
        </div>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code client *
              </label>
              <input
                type="text"
                {...register("Code_client")}
                disabled={!!client} // Désactivé en mode édition
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
              {errors.Code_client && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Code_client.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club *
              </label>
              <input
                type="text"
                {...register("Club")}
                disabled={!!client} // Désactivé en mode édition
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
              {errors.Club && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Club.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CIN *
              </label>
              <input
                type="text"
                {...register("CIN")}
                disabled={!!client} // Désactivé en mode édition
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
              {errors.CIN && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.CIN.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                {...register("nom")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nom && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nom.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                {...register("prenom")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.prenom && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.prenom.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                {...register("telephone")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.telephone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.telephone.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                {...register("date_naissance")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut *
              </label>
              <select
                {...register("statut")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="en_attente">En attente</option>
              </select>
              {errors.statut && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.statut.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <input
                type="text"
                {...register("Ville")}
                maxLength={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.code_Villepostal && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Ville.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <input
                type="text"
                {...register("Adresse")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.Adresse && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Adresse.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de client *
              </label>
              <select
                {...register("type_client")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>
              {errors.type_client && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.type_client.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notes personnelles sur le client..."
            />
          </div>
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
              {client ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
