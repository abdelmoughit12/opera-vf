import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNotification } from "../../hooks/useNotification";
import clubService from "../../services/clubService";

// Schéma de validation pour le club
const clubSchema = yup
  .object({
    Nom: yup.string().required("Nom du club requis"),
    Adresse: yup.string().required("Adresse requise"),
    Ville: yup.string().required("Ville requise"),
    Code_Postal: yup.string().required("Code postal requis"),
    Telephone: yup.string().required("Téléphone requis"),
    Email: yup.string().email("Email invalide").required("Email requis"),
    Type_Club: yup.string().required("Type de club requis"),
    Statut: yup.string().required("Statut requis"),
    Capacite_Max: yup
      .number()
      .positive("Capacité doit être positive")
      .required("Capacité requise"),
    Date_Creation: yup.date().required("Date de création requise"),
    Description: yup.string().nullable(),
    Site_Web: yup.string().url("URL invalide").nullable(),
    Horaires_Ouverture: yup.string().nullable(),
    Horaires_Fermeture: yup.string().nullable(),
    Services: yup.string().nullable(),
    Notes: yup.string().nullable(),
  })
  .required();

const ClubForm = ({ show, onHide, club, onSubmit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [checkingName, setCheckingName] = useState(false);
  const { error, success } = useNotification();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clubSchema),
    defaultValues: {
      Statut: "actif",
      Type_Club: "standard",
      Date_Creation: new Date().toISOString().split("T")[0],
    },
  });

  const watchedNom = watch("Nom");

  // Remplir le formulaire si on modifie un club existant
  useEffect(() => {
    if (club && show) {
      setValue("Nom", club.Nom || "");
      setValue("Adresse", club.Adresse || "");
      setValue("Ville", club.Ville || "");
      setValue("Code_Postal", club.Code_Postal || "");
      setValue("Telephone", club.Telephone || "");
      setValue("Email", club.Email || "");
      setValue("Type_Club", club.Type_Club || "standard");
      setValue("Statut", club.Statut || "actif");
      setValue("Capacite_Max", club.Capacite_Max || 100);
      setValue(
        "Date_Creation",
        club.Date_Creation
          ? new Date(club.Date_Creation).toISOString().split("T")[0]
          : ""
      );
      setValue("Description", club.Description || "");
      setValue("Site_Web", club.Site_Web || "");
      setValue("Horaires_Ouverture", club.Horaires_Ouverture || "");
      setValue("Horaires_Fermeture", club.Horaires_Fermeture || "");
      setValue("Services", club.Services || "");
      setValue("Notes", club.Notes || "");
    } else if (!club && show) {
      reset();
    }
  }, [club, show, setValue, reset]);

  // Vérifier la disponibilité du nom du club
  useEffect(() => {
    const checkNameAvailability = async () => {
      if (watchedNom && watchedNom.length > 2 && !club) {
        setCheckingName(true);
        try {
          const response = await clubService.checkClubNameAvailability(
            watchedNom
          );
          if (response.success && !response.data.available) {
            setValue("Nom", watchedNom, { shouldValidate: true });
          }
        } catch (err) {
          console.error("Erreur lors de la vérification du nom:", err);
        } finally {
          setCheckingName(false);
        }
      }
    };

    const timeoutId = setTimeout(checkNameAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedNom, club, setValue]);

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);

      let response;
      if (club) {
        // Mise à jour d'un club existant
        response = await clubService.updateClub(club.ID_Club, data);
        if (response.success) {
          success("Club modifié avec succès !");
          if (onSuccess) onSuccess(response.data);
        } else {
          throw new Error(
            response.error || "Erreur lors de la modification du club"
          );
        }
      } else {
        // Création d'un nouveau club
        response = await clubService.createClub(data);
        if (response.success) {
          success("Club créé avec succès !");
          if (onSuccess) onSuccess(response.data);
        } else {
          throw new Error(
            response.error || "Erreur lors de la création du club"
          );
        }
      }

      // Appeler la fonction de callback si elle existe
      if (onSubmit) {
        await onSubmit(data);
      }

      // Fermer le formulaire
      handleClose();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde du club:", err);
      error(err.message || "Erreur lors de la sauvegarde du club");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {club ? "Modifier le Club" : "Nouveau Club"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* Formulaire */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Club *
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("Nom")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.Nom ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nom du club"
                />
                {checkingName && (
                  <div className="absolute right-3 top-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              {errors.Nom && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Nom.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de Club *
              </label>
              <select
                {...register("Type_Club")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Type_Club ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
                <option value="familial">Familial</option>
                <option value="sportif">Sportif</option>
                <option value="bienetre">Bien-être</option>
              </select>
              {errors.Type_Club && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Type_Club.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut *
              </label>
              <select
                {...register("Statut")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Statut ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="maintenance">En maintenance</option>
                <option value="ferme">Fermé</option>
              </select>
              {errors.Statut && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Statut.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacité Maximale *
              </label>
              <input
                type="number"
                {...register("Capacite_Max")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Capacite_Max ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="100"
                min="1"
              />
              {errors.Capacite_Max && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Capacite_Max.message}
                </p>
              )}
            </div>
          </div>

          {/* Adresse */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <input
                type="text"
                {...register("Adresse")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Adresse ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="123 Rue de la Paix"
              />
              {errors.Adresse && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Adresse.message}
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Ville ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Casablanca"
              />
              {errors.Ville && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Ville.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code Postal *
              </label>
              <input
                type="text"
                {...register("Code_Postal")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Code_Postal ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="20000"
              />
              {errors.Code_Postal && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Code_Postal.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                {...register("Telephone")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Telephone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0612345678"
              />
              {errors.Telephone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Telephone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                {...register("Email")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="contact@club.com"
              />
              {errors.Email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Email.message}
                </p>
              )}
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de Création *
              </label>
              <input
                type="date"
                {...register("Date_Creation")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.Date_Creation ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.Date_Creation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Date_Creation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Web
              </label>
              <input
                type="url"
                {...register("Site_Web")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.club.com"
              />
            </div>
          </div>

          {/* Horaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure d'Ouverture
              </label>
              <input
                type="time"
                {...register("Horaires_Ouverture")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure de Fermeture
              </label>
              <input
                type="time"
                {...register("Horaires_Fermeture")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description et Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register("Description")}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description du club..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services
              </label>
              <textarea
                {...register("Services")}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Services proposés..."
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register("Notes")}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notes supplémentaires..."
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {club ? "Modification..." : "Création..."}
                </div>
              ) : club ? (
                "Modifier le Club"
              ) : (
                "Créer le Club"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClubForm;
