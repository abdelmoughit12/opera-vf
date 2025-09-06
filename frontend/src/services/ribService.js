import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ribApi = axios.create({
  baseURL: `${API_BASE_URL}/ribs`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const ribService = {
  // Récupérer les RIBs d'un client par CIN
  getRibsByCin: async (cin) => {
    try {
      const response = await ribApi.get('/', { params: { cin } });
      // L'API retourne directement le tableau des RIBs
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des RIBs:', error);
      throw error;
    }
  },

  // Ajouter un RIB
  addRib: async (ribData) => {
    try {
      const response = await ribApi.post('/', ribData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du RIB:', error);
      throw error;
    }
  },

  // Modifier un RIB
  updateRib: async (id, ribData) => {
    try {
      const response = await ribApi.put(`/${id}`, ribData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification du RIB:', error);
      throw error;
    }
  },

  // Supprimer un RIB
 deleteRib: async (id) => {
  try {
    const response = await ribApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du RIB:', error);
    throw error;
  }},


  // Afficher un RIB
  getRib: async (id) => {
    try {
      const response = await ribApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du RIB:', error);
      throw error;
    }
  },
};

export default ribService;