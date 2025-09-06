import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNotification } from "../../hooks/useNotification";
import { VisiteurService } from "../../services/visiteurService";

const clientSchema = yup.object({
  email: yup.string().email("Email invalide").required("Email requis"),
  sexe: yup.string().required("Sexe requis"),
  typeClient: yup.string().required("Type client requis"),
  status: yup.string().default("en_attente"), // 👈 par défaut
  adresse: yup.string().required("Adresse requise"),
  dateNaissance: yup.date().required("Date de naissance requise"),
  notes: yup.string().nullable(),
});

const ClubSelectionModal = ({ isOpen, onClose, onSelectClub, visitor }) => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [loading, setLoading] = useState(false);
  const { error, success } = useNotification();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      status: "en_attente", 
    },
  });

useEffect(() => {
  const fetchClubs = async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const response = await VisiteurService.getClubs();
      
      // Vérifiez si la réponse est valide et contient les données
      if (response && response.success && response.data && Array.isArray(response.data.data)) {
        setClubs(response.data.data);
      } else {
        error("Format de données invalide pour les clubs.");
        setClubs([]);
      }
    } catch (err) {
      console.error("Erreur récupération clubs :", err);
      error("Impossible de récupérer les clubs.");
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };
  fetchClubs();
}, [isOpen, error]);

  // Générer un code club unique
  const generateCodeClub = (clubName) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const cleanName = clubName.replace(/\s+/g, "").toUpperCase();
    return `${cleanName}${randomNum}`;
  };

  // ✅ Soumission formulaire
  const onSubmit = async (data) => {
    if (!visitor?.CIN) {
      error("Données du visiteur invalides.");
      return;
    }
    if (!selectedClub) {
      error("Veuillez sélectionner un club.");
      return;
    }

    const clubObj = clubs.find((c) => (c.ID_Club || c.id) == selectedClub);
    const codeClub = generateCodeClub(clubObj?.Nom || clubObj?.nom || "CLUB");

   try {
    setLoading(true);
    const response = await VisiteurService.convert(visitor.CIN, {
      Code_Club: codeClub,
      Club: clubObj?.Nom || clubObj?.nom,
      Email: data.email,
      Sexe: data.sexe === "homme" ? 1 : 0,
      Type_Client: data.typeClient,
      Adresse: data.adresse,
      Date_Naissance: data.dateNaissance,
      Status: data.status || "en_attente", // ◀◀◀ Utilisez data.status (minuscule)
      Notes: data.notes || "",
    });

    if (response.success) {
      success("Visiteur converti en client avec succès.");
      reset();
      setSelectedClub("");
      
      // ◀◀◀ Appelez onSelectClub AVANT onClose
      onSelectClub(visitor.CIN, {
        Code_Club: codeClub,
        Club: clubObj?.Nom || clubObj?.nom,
        Email: data.email,
        Sexe: data.sexe === "homme" ? 1 : 0,
        Type_Client: data.typeClient,
        Adresse: data.adresse,
        Date_Naissance: data.dateNaissance,
        Status: data.status || "en_attente",
        Notes: data.notes || "",
      });
      
      onClose(); // Fermez le modal après
    } else {
      error(response.message || "Erreur lors de la conversion");
    }
  } catch (err) {
    console.error("Erreur lors de la conversion:", err);
    error(err.message || "Erreur lors de la conversion du visiteur en client.");
  } finally {
    setLoading(false);
  }
};

  if (!isOpen || !visitor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8 relative animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-6">
          Conversion en client :{" "}
          <span className="text-blue-600">
            {visitor.prenom || visitor.Prenom} {visitor.nom || visitor.Nom}
          </span>
        </h2>

        {/* Sélection club */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Sélectionnez un club :
          </label>
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            disabled={loading || clubs.length === 0}
          >
            <option value="" >
              {loading
                ? "Chargement..."
                : clubs.length === 0
                ? "Aucun club disponible"
                : "-- Choisir un club --"}
            </option>
            {clubs.map((club) => (
              <option
                key={club.ID_Club || club.id}
                value={club.ID_Club || club.id}
              >
                {club.Nom || club.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Formulaire infos client */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="p-3 border rounded-lg w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <select
                {...register("sexe")}
                className="p-3 border rounded-lg w-full"
              >
                <option value="">-- Sexe --</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
              {errors.sexe && (
                <p className="text-red-500 text-sm">{errors.sexe.message}</p>
              )}
            </div>

            <div>
              <select
                {...register("typeClient")}
                className="p-3 border rounded-lg w-full"
              >
                <option value="">-- Type de client --</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>
              {errors.typeClient && (
                <p className="text-red-500 text-sm">
                  {errors.typeClient.message}
                </p>
              )}
            </div>

            <div>
              <select
                {...register("status")}
                className="p-3 border rounded-lg w-full"
              >
                <option value="">-- Status --</option>
                <option value="en_attente">En attente</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="suspendu">Suspendu</option>
                <option value="resilié">Résilié</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>


            <div>
              <input
                type="text"
                placeholder="Adresse"
                {...register("adresse")}
                className="p-3 border rounded-lg w-full"
              />
              {errors.adresse && (
                <p className="text-red-500 text-sm">{errors.adresse.message}</p>
              )}
            </div>
           <div>
            <input
              type="date"
              {...register("dateNaissance")}
              className="p-3 border rounded-lg w-full"
            />
            {errors.dateNaissance && (
              <p className="text-red-500 text-sm">
                {errors.dateNaissance.message}
              </p>
            )}
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Date de naissance
            </label>
          </div>
          </div>

          <textarea
            placeholder="Notes (optionnel)"
            {...register("notes")}
            className="mt-4 p-3 border rounded-lg w-full"
            rows="3"
          />

          {/* Boutons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Conversion en cours..." : "Valider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClubSelectionModal;
