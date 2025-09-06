import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNotification } from "../../hooks/useNotification";
import produitService from "../../services/produitService";

// Schéma de validation pour le produit
const produitSchema = yup
  .object({
    Nom_Produit: yup.string().required("Nom du produit requis"),
    Description: yup.string().nullable(),
    Prix: yup
      .number()
      .positive("Prix doit être positif")
      .required("Prix requis"),
    Stock: yup
      .number()
      .min(0, "Stock ne peut pas être négatif")
      .required("Stock requis"),
    Categorie: yup.string().required("Catégorie requise"),
    Statut: yup.string().required("Statut requis"),
    Image_URL: yup.string().url("URL invalide").nullable(),
    Duree_Mois: yup
      .number()
      .min(0, "Durée ne peut pas être négative")
      .nullable(),
    Type_Abonnement: yup.string().nullable(),
    Conditions: yup.string().nullable(),
    Avantages: yup.string().nullable(),
    Restrictions: yup.string().nullable(),
    Notes: yup.string().nullable(),
  })
  .required();

const ProduitForm = ({ show, onHide, produit, onSubmit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { error, success } = useNotification();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(produitSchema),
    defaultValues: {
      Statut: "actif",
      Categorie: "abonnement",
      Stock: 100,
      Prix: 0,
      Duree_Mois: 1,
    },
  });

  const selectedCategorie = watch("Categorie");

  // Remplir le formulaire si on modifie un produit existant
  useEffect(() => {
    if (produit && show) {
      setValue("Nom_Produit", produit.Nom_Produit || "");
      setValue("Description", produit.Description || "");
      setValue("Prix", produit.Prix || 0);
      setValue("Stock", produit.Stock || 0);
      setValue("Categorie", produit.Categorie || "abonnement");
      setValue("Statut", produit.Statut || "actif");
      setValue("Image_URL", produit.Image_URL || "");
      setValue("Duree_Mois", produit.Duree_Mois || 1);
      setValue("Type_Abonnement", produit.Type_Abonnement || "");
      setValue("Conditions", produit.Conditions || "");
      setValue("Avantages", produit.Avantages || "");
      setValue("Restrictions", produit.Restrictions || "");
      setValue("Notes", produit.Notes || "");
    } else if (!produit && show) {
      reset();
    }
  }, [produit, show, setValue, reset]);

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);

      let response;
      if (produit) {
        // Mise à jour d'un produit existant
        response = await produitService.updateProduit(produit.ID_Produit, data);
        if (response.success) {
          success("Produit modifié avec succès !");
          if (onSuccess) onSuccess(response.data);
        } else {
          throw new Error(
            response.error || "Erreur lors de la modification du produit"
          );
        }
      } else {
        // Création d'un nouveau produit
        response = await produitService.createProduit(data);
        if (response.success) {
          success("Produit créé avec succès !");
          if (onSuccess) onSuccess(response.data);
        } else {
          throw new Error(
            response.error || "Erreur lors de la création du produit"
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
      console.error("Erreur lors de la sauvegarde du produit:", err);
      error(err.message || "Erreur lors de la sauvegarde du produit");
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
            {produit ? "Modifier le Produit" : "Nouveau Produit"}
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
                Nom du Produit *
              </label>
              <input
                type="text"
                {...register("Nom_Produit")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.Nom_Produit ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nom du produit"
              />
              {errors.Nom_Produit && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Nom_Produit.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                {...register("Categorie")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.Categorie ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="abonnement">Abonnement</option>
                <option value="pack_famille">Pack Famille</option>
                <option value="promotion">Promotion</option>
              </select>
              {errors.Categorie && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Categorie.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (DH) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("Prix")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.Prix ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
                min="0"
              />
              {errors.Prix && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Prix.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                {...register("Stock")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.Stock ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="100"
                min="0"
              />
              {errors.Stock && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Stock.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut *
              </label>
              <select
                {...register("Statut")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.Statut ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="rupture">En rupture</option>
                <option value="brouillon">Brouillon</option>
              </select>
              {errors.Statut && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Statut.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                {...register("Image_URL")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Champs spécifiques à la catégorie */}
          {selectedCategorie === "abonnement" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (mois) *
                </label>
                <input
                  type="number"
                  {...register("Duree_Mois")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.Duree_Mois ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1"
                  min="0"
                />
                {errors.Duree_Mois && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Duree_Mois.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'Abonnement
                </label>
                <select
                  {...register("Type_Abonnement")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                  <option value="etudiant">Étudiant</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>
          )}

          {selectedCategorie === "pack_famille" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (mois) *
                </label>
                <input
                  type="number"
                  {...register("Duree_Mois")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.Duree_Mois ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1"
                  min="0"
                />
                {errors.Duree_Mois && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Duree_Mois.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de Pack
                </label>
                <select
                  {...register("Type_Abonnement")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="famille_2">2 personnes</option>
                  <option value="famille_4">4 personnes</option>
                  <option value="famille_6">6 personnes</option>
                  <option value="famille_8">8 personnes</option>
                </select>
              </div>
            </div>
          )}

          {selectedCategorie === "promotion" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (mois)
                </label>
                <input
                  type="number"
                  step="0.5"
                  {...register("Duree_Mois")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.Duree_Mois ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.5"
                  min="0"
                />
                {errors.Duree_Mois && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Duree_Mois.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de Promotion
                </label>
                <select
                  {...register("Type_Abonnement")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="essai">Essai</option>
                  <option value="etudiant">Étudiant</option>
                  <option value="nouveau_client">Nouveau client</option>
                  <option value="fidelite">Fidélité</option>
                  <option value="saisonniere">Saisonnière</option>
                </select>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register("Description")}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Description détaillée du produit..."
            />
          </div>

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conditions
              </label>
              <textarea
                {...register("Conditions")}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Conditions d'utilisation..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avantages
              </label>
              <textarea
                {...register("Avantages")}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Avantages du produit..."
              />
            </div>
          </div>

          {/* Restrictions et Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restrictions
              </label>
              <textarea
                {...register("Restrictions")}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Restrictions d'utilisation..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                {...register("Notes")}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Notes supplémentaires..."
              />
            </div>
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
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {produit ? "Modification..." : "Création..."}
                </div>
              ) : produit ? (
                "Modifier le Produit"
              ) : (
                "Créer le Produit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProduitForm;
