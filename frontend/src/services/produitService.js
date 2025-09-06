import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const produitApi = axios.create({
  baseURL: `${API_BASE_URL}/produits`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Service pour les opérations sur les produits
const produitService = {
  // Récupérer tous les produits
getAllProduits: async (params = {}) => {
    try {
      const response = await produitApi.get('/', { params });
      return response.data;
    } catch (error) {
      console.error('Error in produitService.getAllProduits:', error);
      throw error;
    }
  },

  getProduitsByCategorie: async (categorie) => {
    try {
      const response = await produitApi.get('/', {
        params: { categorie, statut: 'actif' }
      });
      return response.data;
    } catch (error) {
      console.error('Error in produitService.getProduitsByCategorie:', error);
      throw error;
    }
  },

  // Récupérer un produit par ID
  getProduitById: async (id) => {
    try {
      const response = await produitApi.get(`/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du produit',
      };
    }
  },

  // Récupérer les produits par catégorie
  getProduitsByCategorie: async (categorie) => {
    try {
      const response = await produitApi.get('/', { params: { categorie } });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des produits par catégorie:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des produits par catégorie',
      };
    }
  },

  // Récupérer les produits en stock
  getProduitsEnStock: async () => {
    try {
      const response = await produitApi.get('/', { params: { stock: 'disponible' } });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des produits en stock:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des produits en stock',
      };
    }
  },

  // Créer un nouveau produit
  createProduit: async (produitData) => {
    try {
      const response = await produitApi.post('/', produitData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du produit',
      };
    }
  },

  // Mettre à jour un produit
  updateProduit: async (id, produitData) => {
    try {
      const response = await produitApi.put(`/${id}`, produitData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du produit',
      };
    }
  },

  // Supprimer un produit
  deleteProduit: async (id) => {
    try {
      const response = await produitApi.delete(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression du produit',
      };
    }
  },

  // Rechercher des produits
  searchProduits: async (searchTerm, filters = {}) => {
    try {
      const params = { search: searchTerm, ...filters };
      const response = await produitApi.get('/', { params });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la recherche des produits:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche des produits',
      };
    }
  },
};

export default produitService;
