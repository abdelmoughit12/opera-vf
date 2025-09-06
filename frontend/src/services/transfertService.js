import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Configuration de l'API transfert
const transfertApi = axios.create({
  baseURL: `${API_BASE_URL}/transferts`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
transfertApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service pour les opérations sur les transferts
const transfertService = {
  // Créer un nouveau transfert
  createTransfert: async (transfertData) => {
    try {
      const response = await transfertApi.post('/', transfertData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la création du transfert:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du transfert',
      };
    }
  },

  // Récupérer tous les transferts avec filtres et pagination
  getAllTransferts: async (params = {}) => {
    try {
      const response = await transfertApi.get('/', { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des transferts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des transferts',
      };
    }
  },

  // Récupérer les transferts d'un client spécifique
  getTransfertsByClient: async (clientId) => {
    try {
      const response = await transfertApi.get(`/client/${clientId}`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des transferts du client:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des transferts du client',
      };
    }
  },

  // Récupérer un transfert par ID
  getTransfertById: async (id) => {
    try {
      const response = await transfertApi.get(`/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du transfert:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du transfert',
      };
    }
  },

  // Mettre à jour un transfert
  updateTransfert: async (id, transfertData) => {
    try {
      const response = await transfertApi.put(`/${id}`, transfertData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du transfert:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du transfert',
      };
    }
  },

  // Supprimer un transfert
  deleteTransfert: async (id) => {
    try {
      const response = await transfertApi.delete(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la suppression du transfert:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression du transfert',
      };
    }
  },

  // Récupérer les statistiques des transferts
  getTransfertStats: async () => {
    try {
      const response = await transfertApi.get('/stats');
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de transfert:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des statistiques de transfert',
      };
    }
  },

  // Rechercher des transferts
  searchTransferts: async (searchTerm, filters = {}) => {
    try {
      const params = { search: searchTerm, ...filters };
      const response = await transfertApi.get('/search', { params });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la recherche des transferts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche des transferts',
      };
    }
  },

  // Valider un transfert
  validateTransfert: async (id) => {
    try {
      const response = await transfertApi.post(`/${id}/validate`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la validation du transfert:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la validation du transfert',
      };
    }
  },

  // Annuler un transfert
  cancelTransfert: async (id) => {
    try {
      const response = await transfertApi.post(`/${id}/cancel`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de l\'annulation du transfert:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'annulation du transfert',
      };
    }
  },
};

export default transfertService; 