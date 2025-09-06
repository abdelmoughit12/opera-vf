import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const clubApi = axios.create({
  baseURL: `${API_BASE_URL}/clubs`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Service pour les opérations sur les clubs
const clubService = {
  // Récupérer tous les clubs
  getAllClubs: async (params = {}) => {
    try {
      const response = await clubApi.get('/', { params });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des clubs:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des clubs',
      };
    }
  },

  // Récupérer un club par ID
  getClubById: async (id) => {
    try {
      const response = await clubApi.get(`/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du club:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du club',
      };
    }
  },

  // Récupérer les clubs par type
  getClubsByType: async (type) => {
    try {
      const response = await clubApi.get('/', { params: { type } });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des clubs par type:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des clubs par type',
      };
    }
  },

  // Récupérer les clubs actifs
  getActiveClubs: async () => {
    try {
      const response = await clubApi.get('/', { params: { statut: 'actif' } });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des clubs actifs:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des clubs actifs',
      };
    }
  },

  // Créer un nouveau club
  createClub: async (clubData) => {
    try {
      const response = await clubApi.post('/', clubData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la création du club:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du club',
      };
    }
  },

  // Mettre à jour un club
  updateClub: async (id, clubData) => {
    try {
      const response = await clubApi.put(`/${id}`, clubData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du club:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du club',
      };
    }
  },

  // Supprimer un club
  deleteClub: async (id) => {
    try {
      const response = await clubApi.delete(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la suppression du club:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression du club',
      };
    }
  },

  // Rechercher des clubs
  searchClubs: async (searchTerm, filters = {}) => {
    try {
      const params = { search: searchTerm, ...filters };
      const response = await clubApi.get('/', { params });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la recherche des clubs:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche des clubs',
      };
    }
  },

  // Obtenir les statistiques des clubs
  getClubStats: async () => {
    try {
      const response = await clubApi.get('/stats');
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des clubs:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des statistiques des clubs',
      };
    }
  },

  // Vérifier la disponibilité d'un nom de club
  checkClubNameAvailability: async (nom, excludeId = null) => {
    try {
      const params = { nom, exclude_id: excludeId };
      const response = await clubApi.get('/check-name', { params });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du nom du club:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la vérification du nom du club',
      };
    }
  },

  // Obtenir les clubs par ville
  getClubsByCity: async (ville) => {
    try {
      const response = await clubApi.get('/', { params: { ville } });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des clubs par ville:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des clubs par ville',
      };
    }
  },

  // Obtenir les clubs par capacité
  getClubsByCapacity: async (minCapacity, maxCapacity) => {
    try {
      const response = await clubApi.get('/', { 
        params: { 
          min_capacity: minCapacity, 
          max_capacity: maxCapacity 
        } 
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des clubs par capacité:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des clubs par capacité',
      };
    }
  }
};

export default clubService;
