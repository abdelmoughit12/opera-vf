import React, { useState, useEffect } from "react";
import { useNotification } from "../../hooks/useNotification";
import clubService from "../../services/clubService";

const ClubList = ({ onEdit, onDelete, onRefresh }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { error, success } = useNotification();

  // Charger les clubs depuis l'API
  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubService.getAllClubs();

      if (response.success) {
        setClubs(response.data.data || []);
      } else {
        error(response.error || "Erreur lors du chargement des clubs");
        setClubs([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des clubs:", err);
      error("Impossible de charger les clubs");
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les clubs au montage du composant
  useEffect(() => {
    fetchClubs();
  }, []);

  // Rafraîchir la liste si onRefresh est appelé
  useEffect(() => {
    if (onRefresh) {
      fetchClubs();
    }
  }, [onRefresh]);

  // Filtrer les clubs selon la recherche et le type
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.Nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.Ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.Adresse?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || club.Type_Club === filterType;
    return matchesSearch && matchesType;
  });

  // Obtenir le label du type de club
  const getTypeLabel = (type) => {
    const types = {
      standard: "Standard",
      premium: "Premium",
      vip: "VIP",
      familial: "Familial",
      sportif: "Sportif",
      bienetre: "Bien-être",
    };
    return types[type] || type;
  };

  // Obtenir le label du statut
  const getStatutLabel = (statut) => {
    const statuts = {
      actif: "Actif",
      inactif: "Inactif",
      maintenance: "En maintenance",
      ferme: "Fermé",
    };
    return statuts[statut] || statut;
  };

  // Obtenir la couleur du statut
  const getStatutColor = (statut) => {
    const colors = {
      actif: "bg-green-100 text-green-800",
      inactif: "bg-gray-100 text-gray-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      ferme: "bg-red-100 text-red-800",
    };
    return colors[statut] || "bg-gray-100 text-gray-800";
  };

  // Obtenir la couleur du type
  const getTypeColor = (type) => {
    const colors = {
      standard: "bg-blue-100 text-blue-800",
      premium: "bg-purple-100 text-purple-800",
      vip: "bg-yellow-100 text-yellow-800",
      familial: "bg-green-100 text-green-800",
      sportif: "bg-orange-100 text-orange-800",
      bienetre: "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  // Gérer la suppression d'un club
  const handleDelete = async (clubId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce club ?")) {
      try {
        const response = await clubService.deleteClub(clubId);
        if (response.success) {
          success("Club supprimé avec succès !");
          // Rafraîchir la liste
          fetchClubs();
          // Appeler la fonction de callback si elle existe
          if (onDelete) {
            onDelete(clubId);
          }
        } else {
          error(response.error || "Erreur lors de la suppression du club");
        }
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        error("Impossible de supprimer le club");
      }
    }
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Gérer le filtre par type
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  // Calculer les statistiques
  const stats = {
    total: clubs.length,
    actifs: clubs.filter((c) => c.Statut === "actif").length,
    parType: clubs.reduce((acc, club) => {
      acc[club.Type_Club] = (acc[club.Type_Club] || 0) + 1;
      return acc;
    }, {}),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-600">Total des clubs</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {stats.actifs}
          </div>
          <div className="text-sm text-green-600">Clubs actifs</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {stats.parType.standard || 0}
          </div>
          <div className="text-sm text-purple-600">Clubs standard</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.parType.vip || 0}
          </div>
          <div className="text-sm text-yellow-600">Clubs VIP</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par nom, ville ou adresse..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
            <option value="familial">Familial</option>
            <option value="sportif">Sportif</option>
            <option value="bienetre">Bien-être</option>
          </select>
        </div>
      </div>

      {/* Liste des clubs */}
      {filteredClubs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchTerm || filterType !== "all"
              ? "Aucun club ne correspond aux critères de recherche"
              : "Aucun club trouvé"}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <div
              key={club.ID_Club}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* En-tête du club */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {club.Nom}
                </h3>
                <div className="flex space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                      club.Type_Club
                    )}`}
                  >
                    {getTypeLabel(club.Type_Club)}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(
                      club.Statut
                    )}`}
                  >
                    {getStatutLabel(club.Statut)}
                  </span>
                </div>
              </div>

              {/* Informations du club */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    {club.Adresse}, {club.Ville} {club.Code_Postal}
                  </span>
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{club.Telephone}</span>
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <span className="truncate">{club.Email}</span>
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>Capacité: {club.Capacite_Max} personnes</span>
                </div>

                {club.Description && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-600 line-clamp-2">
                      {club.Description}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onEdit(club)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(club.ID_Club)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubList;
