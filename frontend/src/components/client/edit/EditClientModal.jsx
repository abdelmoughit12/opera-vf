import React, { useEffect, useState } from "react";
import * as yup from "yup";
import YupForm, { FormField, SubmitButton } from "../../common/YupForm";

// Schéma de validation Yup pour le client
const clientSchema = yup
  .object({
    Code_Club: yup.string().required("Code client requis"),
    CIN: yup.string().required("CIN requis"),
    Club: yup.string().required("Club requis"),
    nom: yup.string().required("Nom requis"),
    prenom: yup.string().required("Prénom requis"),
    Email: yup.string().email("Email invalide").required("Email requis"),
    telephone: yup.string().required("Téléphone requis"),
    Date_Naissance: yup.date().nullable(),
    Adresse: yup.string(),
    Status: yup.string().required("Status requis"),
    Type_Client: yup.string().required("Type de client requis"),
    Notes: yup.string(),
  })
  .required();

const EditClientModal = ({ client, show, onHide, onSubmit }) => {
  const [error, setError] = useState(null);

  if (!show) return null;
  const defaultValues = {
  Code_Club: client?.Code_Club || "",
  CIN: client?.CIN || "",
  Club: client?.Club || "",
  nom: client?.Nom || client?.Nom_Visiteur || "",
  prenom: client?.Prenom || client?.Prenom_Visiteur || "",
  Email: client?.Email || "",
  telephone: client?.telephone || client?.Telephone || client?.Telephone_Visiteur || "",
  Date_Naissance: client?.Date_Naissance
    ? new Date(client.Date_Naissance).toISOString().split("T")[0]
    : "",
  Adresse: client?.Adresse || "",
  Status: client?.Status || "actif", // Provide default
  Type_Client: client?.Type_Client || "standard", // Provide default
  Notes: client?.Notes || "",
};
const handleFormSubmit = async (data) => {
  console.log("Form data received:", data); // Debug log

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return null;
    
    // If it's already a string (from date input), return as is
    if (typeof date === 'string') {
      return date || null;
    }
    
    // If it's a Date object, convert to YYYY-MM-DD format
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    
    return null;
  };

  // Helper function to clean strings (trim whitespace)
  const cleanString = (str) => {
    return typeof str === 'string' ? str.trim() : str;
  };

  const mappedData = {
    // Client fields
    CIN: client?.CIN, // Keep original CIN
    Club: cleanString(data.Club),
      Code_Club: cleanString(data.Code_Club),
    // Code_Club: cleanString(data.Code_Club), // Remove this line to not update Code_Club
    Status: data.Status,
    Type_Client: data.Type_Client,
    Notes: data.Notes || null, // Use null instead of empty string for optional fields
    Email: cleanString(data.Email),
    Adresse: data.Adresse || null, // Use null instead of empty string for optional fields
    Date_Naissance: formatDate(data.Date_Naissance), // Format the date properly
    
    // Visiteur fields (mapped to match backend expectations)
    nom: cleanString(data.nom),
    prenom: cleanString(data.prenom),
    telephone: cleanString(data.telephone),
  };

  // Remove undefined values to avoid sending them
  Object.keys(mappedData).forEach(key => {
    if (mappedData[key] === undefined) {
      delete mappedData[key];
    }
  });

  console.log("Payload envoyé au backend:", mappedData);

  try {
    setError(null);
    await onSubmit(mappedData);
  } catch (err) {
    console.error("Error in handleFormSubmit:", err);
    
    // Handle different types of errors
    if (err.response?.data?.errors) {
      // Laravel validation errors
      const validationErrors = err.response.data.errors;
      const errorMessages = Object.values(validationErrors).flat();
      setError(`Erreurs de validation: ${errorMessages.join(', ')}`);
    } else if (err.response?.data?.message) {
      // Laravel error message
      setError(err.response.data.message);
    } else {
      setError(err.message || "Une erreur est survenue lors de la modification");
    }
  }
};

  const handleClose = () => {
    onHide();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Modifier le client
              </h2>
              <p className="text-gray-500 text-sm">
                {client?.Prenom_Visiteur} {client?.Nom_Visiteur}
              </p>
            </div>
          </div>
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

        {/* Message d'erreur */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Formulaire avec YupForm */}
        <YupForm
          schema={clientSchema}
          defaultValues={defaultValues}
          onSubmit={handleFormSubmit}
          resetOnSubmit={false}
          className="p-6"
          onError={(errors) => {
            console.log("Erreurs de validation:", errors);
            setError("Veuillez corriger les erreurs dans le formulaire");
          }}
        >
          {({ register, errors, isSubmitting }) => (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  name="Club"
                  label="Club"
                  placeholder="Club du client"
                  readOnly
                  required
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="Code_Club"
                  label="Code client"
                  placeholder="Code du client"
                  required
                    
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="CIN"
                  label="CIN"
                  placeholder="CIN du client"
                  required
                  disabled={true}
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="prenom"
                  label="Prénom"
                  placeholder="Prénom du client"
                  required
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="nom"
                  label="Nom"
                  placeholder="Nom du client"
                  required
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="Date_Naissance"
                  label="Date de naissance"
                  type="date"
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="Email"
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="telephone"
                  label="Téléphone"
                  type="tel"
                  placeholder="XXXXXXXXXX"
                  required
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="Type_Client"
                  label="Type de client"
                  type="select"
                  required
                  options={[
                    { value: "standard", label: "Standard" },
                    { value: "premium", label: "Premium" },
                    { value: "vip", label: "VIP" },
                  ]}
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="Status"
                  label="Statut"
                  type="select"
                  required
                  options={[
                    { value: "actif", label: "Actif" },
                    { value: "inactif", label: "Inactif" },
                    { value: "en_attente", label: "En attente" },
                  ]}
                  register={register}
                  errors={errors}
                />
                {/* Adresse et statut */}

                <FormField
                  name="Adresse"
                  label="Adresse"
                  placeholder="123 Rue de la Paix"
                  register={register}
                  errors={errors}
                />
              </div>

              {/* Notes */}
              <div className="mt-6">
                <FormField
                  name="Notes"
                  label="Notes"
                  type="textarea"
                  placeholder="Notes sur le client..."
                  rows={4}
                  register={register}
                  errors={errors}
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Annuler
                </button>
                <SubmitButton isSubmitting={isSubmitting}>
                  Sauvegarder
                </SubmitButton>
              </div>
            </>
          )}
        </YupForm>
      </div>
    </div>
  );
};

export default EditClientModal;
