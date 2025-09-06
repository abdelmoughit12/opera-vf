import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const VisiteurService = {
  // Créer un visiteur
  async create(visiteurData) {
    try {
      const response = await api.post('/visiteurs', visiteurData);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 
          'Erreur lors de la création du visiteur'
        );
      }
      throw error;
    }
  },

  // Lister tous les visiteurs
  async getAll() {
    try {
      const response = await api.get('/visiteurs');
      return response.data.data.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des visiteurs');
    }
  },
 
  // Récupérer un visiteur par CIN
  async getByCIN(cin) {
    try {
      const response = await api.get(`/visiteurs/${cin}`);
      return response.data.data;
    } catch (error) {
      throw new Error('Visiteur non trouvé');
    }
  },

  // Mettre à jour un visiteur (exemple supplémentaire)
  async update(cin, visiteurData) {
    try {
      const response = await api.put(`/visiteurs/${cin}`, visiteurData);
      return response.data.data;
    } catch (error) {
      throw new Error('Échec de la mise à jour');
    }
  },

  // Supprimer un visiteur (exemple supplémentaire)
  async delete(cin) {
    try {
      await api.delete(`/visiteurs/${cin}`);
      return true;
    } catch (error) {
      throw new Error('Échec de la suppression');
    }
  },

  //get the clubs
  async getClubs(){
    try{
      const response = await api.get('/clubs');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des clubs');
    }
  },

  // Convertir un visiteur en client
  async convert(cin, payload) {
    try {
      const response = await api.post(`/visiteurs/${cin}/convert`, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Erreur lors de la conversion du visiteur';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

 updateStatus: async (cin, newStatus) => {
  try { 

    const response = await fetch(`${API_BASE_URL}/visiteurs/${cin}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du statut');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur updateStatus:', error);
    throw error;
  }
},

};