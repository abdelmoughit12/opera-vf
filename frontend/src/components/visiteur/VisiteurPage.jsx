import React, { useState, useEffect, useMemo } from "react";
import Layout from "../sharedCompoents/Layout";
import VisiteurStats from "./VisiteurStats";
import VisiteurCharts from "./VisiteurCharts";
import VisiteurSearch from "./VisiteurSearch";
import VisiteurFilters from "./VisiteurFilters";
import VisiteurList from "./VisiteurList";
import VisiteurForm from "./VisiteurForm";
import VisiteurDetails from "./VisiteurDetails";
import ClubSelectionModal from "./ClubSelectionModal";
import { VisiteurService } from "../../services/visiteurService";
import { useNotification } from "../../hooks/useNotification";

// Couleurs pour graphiques
const palette = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#6B7280",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
];

const VisiteurPage = () => {
  // États pour gérer les données et l'interface
  const [visitors, setVisitors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [date_visite, setDateVisite] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [filterSource, setFilterSource] = useState("Toutes");
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [visitorToConvert, setVisitorToConvert] = useState(null);
  const { success, error } = useNotification();

// Fonction pour mettre à jour le statut d'un visiteur
const handleVisitorConverted = (visitorId, newStatus) => {
  setVisitors(prevVisitors => 
    prevVisitors.map(visitor => 
      visitor.CIN === visitorId 
        ? { ...visitor, status: newStatus }
        : visitor
    )
  );
};
  // Calcul des statistiques basées sur les données réelles
  const stats = {
    total: visitors.length,
    nouveau: visitors.filter((v) => v.status === "Nouveau").length,
    enCours: visitors.filter((v) => v.status === "En cours").length,
    converti: visitors.filter((v) => v.status === "Converti").length,
    tauxConversion:
      visitors.length === 0
        ? 0
        : Math.round(
            (visitors.filter((v) => v.status === "Converti").length /
              visitors.length) *
              100
          ),
  };
  const fetchVisitors = async () => {
    try {
      const data = await VisiteurService.getAll();
      setVisitors(data);
    } catch (error) {
      console.error("Erreur récupération visiteurs :", error);
    }
  };
  useEffect(() => {
    fetchVisitors();
  }, []);

  // Données réelles pour les graphiques à partir des visiteurs
  const statsData = useMemo(() => {
    // Evolution par date (YYYY-MM-DD)
    const countsByDate = visitors.reduce((acc, v) => {
      const iso = v.Date_Visite ? String(v.Date_Visite) : null;
      const date = iso ? iso.split("T")[0] : "Inconnu";
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const evolution = Object.keys(countsByDate)
      .sort()
      .map((date) => ({ date, visiteurs: countsByDate[date] }));

    // Répartition des sources
    const countsBySource = visitors.reduce((acc, v) => {
      const key = v.Source_d_information || "Autres";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const sources = Object.entries(countsBySource).map(
      ([name, value], idx) => ({
        name,
        value,
        color: palette[idx % palette.length],
      })
    );

    // Répartition des intérêts principaux
    const countsByInterest = visitors.reduce((acc, v) => {
      const key = v.Intérêt_principal_ || "Autres";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const interets = Object.entries(countsByInterest).map(
      ([name, value], idx) => ({
        name,
        value,
        color: palette[idx % palette.length],
      })
    );

    return { evolution, sources, interets };
  }, [visitors]);
  // Filtrage des visiteurs basé sur la recherche et les filtres
  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.Nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.Prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.Telephone.includes(searchTerm) ||
      visitor.CIN.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "Tous" || visitor.status === filterStatus;
    const matchesSource =
      filterSource === "Toutes" ||
      visitor.Source_d_information === filterSource;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Fonction pour gérer l'ajout d'un nouveau visiteur
  const handleCreateVisitor = (data) => {
    const newVisitor = {
      id: visitors.length + 1,
      ...data,
      statut: "Nouveau",
      dateInscription: new Date().toISOString().split("T")[0],
      accompagnateur: "À assigner",
      notes: "",
    };
    setVisitors([...visitors, newVisitor]);
    setShowForm(false);
  };

  // FIX: Fonction pour changer le statut avec mise à jour en base de données
  const handleStatusChange = async (CIN, newStatus) => {
    try {
      setLoading(true);

      const visitor = visitors.find((v) => v.CIN === CIN);
      if (!visitor) {
        console.error("Visiteur non trouvé");
        return;
      }

      // Mise à jour DB
      await VisiteurService.updateStatus(CIN, newStatus);
      await fetchVisitors();
      // Mise à jour immédiate du state (réactif)
      setVisitors((prev) =>
        prev.map((v) => (v.CIN === CIN ? { ...v, status: newStatus } : v))
      );

      if (newStatus === "Converti") {
        setVisitorToConvert(visitor);
        setIsClubModalOpen(true);
      }
    } catch (error) {
      console.error("Erreur mise à jour statut :", error);
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setLoading(false);
    }
  };

  //fonction pour gerer la sélection du club
  const handleSelectClub = async (cin, clientData) => {
    try {
      // Recharger la liste des visiteurs pour obtenir le statut mis à jour
      await fetchVisitors();

      // Mettre à jour localement le statut du visiteur converti
      setVisitors((prev) =>
        prev.map((v) =>
          v.CIN === cin
            ? { ...v, status: "Converti", club: clientData.Club }
            : v
        )
      );

      setVisitorToConvert(null);
      success("Visiteur converti en client avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la liste:", error);
      error("Erreur lors de la mise à jour de la liste des visiteurs");
    }
  };

  // Fonction pour voir les détails d'un visiteur
  const handleViewDetails = (visitors) => {
    setSelectedVisitor(visitors);
  };

  // Fonction pour fermer les modals
  const handleCloseModals = () => {
    setShowForm(false);
    setSelectedVisitor(null);
  };

  // Fonction pour réinitialiser les filtres
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("Tous");
    setFilterSource("Toutes");
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statut) => {
    switch (statut) {
      case "Nouveau":
        return "bg-green-100 text-green-800";
      case "En cours":
        return "bg-orange-100 text-orange-800";
      case "Converti":
        return "bg-blue-100 text-blue-800";
      case "Perdu":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête de la page */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des Visiteurs
                </h1>
                <p className="text-gray-600 mt-2">
                  Gérez vos visiteurs et prospects
                </p>{" "}
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                + Nouveau Visiteur
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <VisiteurStats stats={stats} />

          {/* Graphiques */}
          <VisiteurCharts statsData={statsData} />

          {/* Recherche */}
          <VisiteurSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={clearFilters}
          />

          {/* Filtres */}
          <VisiteurFilters
            filterStatus={filterStatus}
            filterSource={filterSource}
            onSearchChange={setSearchTerm}
            onFilterDate_visite={setDateVisite}
            onFilterStatusChange={setFilterStatus}
            onFilterSourceChange={setFilterSource}
            onClearFilters={clearFilters}
          />

          {/* Liste des visiteurs */}
          <VisiteurList
            visitors={filteredVisitors}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            getStatusColor={getStatusColor}
             onVisitorConverted={handleVisitorConverted}
          />
          <ClubSelectionModal
            isOpen={isClubModalOpen}
            onClose={() => setIsClubModalOpen(false)}
            onSelectClub={handleSelectClub}
            visitor={visitorToConvert}
          />
        </div>

        {/* Modal Formulaire */}
        <VisiteurForm
          show={showForm}
          onHide={() => setShowForm(false)}
          onSubmit={handleCreateVisitor}
        />

        {/* Modal Détails */}
        <VisiteurDetails
          visitor={selectedVisitor}
          onClose={() => setSelectedVisitor(null)}
          getStatusColor={getStatusColor}
        />
      </div>
    </Layout>
  );
};

export default VisiteurPage;
