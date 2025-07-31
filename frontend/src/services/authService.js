import axios from 'axios';

// Configuration de base pour axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Instance axios avec configuration de base
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
authApi.interceptors.request.use(
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

// Intercepteur pour gérer les erreurs de réponse
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
const authService = {
  // Connexion
  login: async (credentials) => {
    try {
      const response = await authApi.post('/login', credentials);
      const { token, user } = response.data;
      
      // Stocker les informations d'authentification
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion',
      };
    }
  },

  // Inscription
  register: async (userData) => {
    try {
      const response = await authApi.post('/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur d\'inscription',
      };
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await authApi.post('/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage local
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Obtenir les informations de l'utilisateur
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Rafraîchir le token
  refreshToken: async () => {
    try {
      const response = await authApi.post('/refresh');
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return { success: true, token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de rafraîchissement du token',
      };
    }
  },

  // Mot de passe oublié
  forgotPassword: async (email) => {
    try {
      const response = await authApi.post('/forgot-password', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email',
      };
    }
  },

  // Réinitialiser le mot de passe
  resetPassword: async (token, newPassword) => {
    try {
      const response = await authApi.post('/reset-password', {
        token,
        password: newPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la réinitialisation',
      };
    }
  },
};

export default authService; 