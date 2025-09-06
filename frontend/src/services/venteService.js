import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const venteApi = axios.create({
  baseURL: `${API_BASE_URL}/ventes`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter des headers si nécessaire
venteApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service pour les opérations sur les ventes
const venteService = {
  // Créer une nouvelle vente
  createVente: async (venteData) => {
    try {
      const response = await venteApi.post('/', venteData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la création de la vente:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création de la vente',
      };
    }
  },

  // Récupérer toutes les ventes avec filtres et pagination
  getAllVentes: async (params = {}) => {
    try {
      const response = await venteApi.get('/', { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des ventes:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des ventes',
      };
    }
  },

  // Récupérer les ventes d'un client spécifique
  getVentesByClient: async (clientId) => {
    try {
      const response = await venteApi.get(`/client/${clientId}`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des ventes du client:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des ventes du client',
      };
    }
  },

  // Récupérer une vente par ID
  getVenteById: async (id) => {
    try {
      const response = await venteApi.get(`/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la vente:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de la vente',
      };
    }
  },

  // Mettre à jour une vente
  updateVente: async (id, venteData) => {
    try {
      const response = await venteApi.put(`/${id}`, venteData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la vente:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de la vente',
      };
    }
  },

  // Supprimer une vente
  deleteVente: async (id) => {
    try {
      const response = await venteApi.delete(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de la vente:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression de la vente',
      };
    }
  },

  // Récupérer les statistiques des ventes
  getVenteStats: async () => {
    try {
      const response = await venteApi.get('/stats');
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de vente:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des statistiques de vente',
      };
    }
  },

  // Rechercher des ventes
  searchVentes: async (searchTerm, filters = {}) => {
    try {
      const params = { search: searchTerm, ...filters };
      const response = await venteApi.get('/', { params });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la recherche des ventes:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche des ventes',
      };
    }
  },
};

export default venteService; 