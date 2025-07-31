import axios from 'axios';

// Configuration de base pour axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Instance axios avec configuration de base
const operaApi = axios.create({
  baseURL: `${API_BASE_URL}/opera`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
operaApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service des opéras
const operaService = {
  // Récupérer tous les opéras
  getAllOperas: async (params = {}) => {
    try {
      const response = await operaApi.get('/', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des opéras',
      };
    }
  },

  // Récupérer un opéra par ID
  getOperaById: async (id) => {
    try {
      const response = await operaApi.get(`/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de l\'opéra',
      };
    }
  },

  // Créer un nouvel opéra
  createOpera: async (operaData) => {
    try {
      const response = await operaApi.post('/', operaData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création de l\'opéra',
      };
    }
  },

  // Mettre à jour un opéra
  updateOpera: async (id, operaData) => {
    try {
      const response = await operaApi.put(`/${id}`, operaData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'opéra',
      };
    }
  },

  // Supprimer un opéra
  deleteOpera: async (id) => {
    try {
      await operaApi.delete(`/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression de l\'opéra',
      };
    }
  },

  // Rechercher des opéras
  searchOperas: async (searchTerm, filters = {}) => {
    try {
      const response = await operaApi.get('/search', {
        params: { q: searchTerm, ...filters },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche',
      };
    }
  },

  // Récupérer les opéras par catégorie
  getOperasByCategory: async (category) => {
    try {
      const response = await operaApi.get(`/category/${category}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération par catégorie',
      };
    }
  },

  // Récupérer les opéras populaires
  getPopularOperas: async (limit = 10) => {
    try {
      const response = await operaApi.get('/popular', { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des opéras populaires',
      };
    }
  },

  // Récupérer les opéras récents
  getRecentOperas: async (limit = 10) => {
    try {
      const response = await operaApi.get('/recent', { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des opéras récents',
      };
    }
  },

  // Ajouter un opéra aux favoris
  addToFavorites: async (operaId) => {
    try {
      const response = await operaApi.post(`/${operaId}/favorite`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'ajout aux favoris',
      };
    }
  },

  // Retirer un opéra des favoris
  removeFromFavorites: async (operaId) => {
    try {
      const response = await operaApi.delete(`/${operaId}/favorite`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression des favoris',
      };
    }
  },

  // Récupérer les favoris de l'utilisateur
  getUserFavorites: async () => {
    try {
      const response = await operaApi.get('/favorites');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des favoris',
      };
    }
  },
};

export default operaService; 