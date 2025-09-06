import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Configuration de l'API client
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Service pour les opérations sur les clients
const ClientService = {
  // Récupérer tous les clients avec filtres et pagination
  async getAll() {
    try {
      const response = await api.get('/clients');
      // Vérifier si la réponse contient les données attendues
      if (response.data && response.data.success && response.data.data) {
        return response.data.data.data || response.data.data;
      }
      throw new Error('Format de réponse invalide');
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des clients');
    }
  },

  // Récupérer un client par ID
  getClientById: async (id) => {
    try {
      if (!id) {
        throw new Error('ID du client requis');
      }
      
      const response = await api.get(`/clients/${id}`);
      
      if (response.data && response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      
      throw new Error('Client non trouvé');
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération du client',
      };
    }
  },

  // Créer un nouveau client
  createClient: async (clientData) => {
    try {
      if (!clientData || !clientData.CIN) {
        throw new Error('Données client invalides');
      }
      
      const response = await api.post('/clients', clientData);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data,
        };
      }
      
      throw new Error('Erreur lors de la création du client');
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la création du client',
      };
    }
  },

  // Mettre à jour un client
  updateClient: async (id, clientData) => {
    try {
      if (!id) {
        throw new Error('ID du client requis');
      }
      
      const response = await api.put(`/clients/${id}`, clientData);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data,
        };
      }
      
      throw new Error('Erreur lors de la mise à jour du client');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du client',
      };
    }
  },

  // Supprimer un client
  deleteClient: async (id) => {
    try {
      if (!id) {
        throw new Error('ID du client requis');
      }
      
      const response = await api.delete(`/clients/${id}`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data,
        };
      }
      
      throw new Error('Erreur lors de la suppression du client');
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression du client',
      };
    }
  },

  // Rechercher des clients
  searchClients: async (searchTerm, filters = {}) => {
    try {
      const params = { search: searchTerm, ...filters };
      const response = await api.get('/clients/search', { params });
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data,
        };
      }
      
      throw new Error('Erreur lors de la recherche des clients');
    } catch (error) {
      console.error('Erreur lors de la recherche des clients:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la recherche des clients',
      };
    }
  },

  // Récupérer les statistiques des clients
  getClientStats: async () => {
    try {
      const response = await api.get('/clients/stats');
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data,
        };
      }
      
      throw new Error('Erreur lors de la récupération des statistiques');
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques',
      };
    }
  },

  // Valider les données d'un client
  validateClientData: (clientData) => {
    const errors = [];
    
    if (!clientData.CIN) {
      errors.push('CIN est requis');
    }
    
    if (!clientData.Club) {
      errors.push('Club est requis');
    }
    
    if (!clientData.Code_Club) {
      errors.push('Code Club est requis');
    }
    
    if (!clientData.Status) {
      errors.push('Statut est requis');
    }
    
    if (!clientData.Type_Client) {
      errors.push('Type de client est requis');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export { ClientService };