// Export centralisé de tous les services
export { default as authService } from './authService';
export { default as operaService } from './operaService';
export { default as userService } from './userService';
export { default as ribService } from './ribService';

// Configuration globale des services
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3,
};

// Utilitaires pour les services
export const serviceUtils = {
  // Gestionnaire d'erreurs global
  handleError: (error, context = '') => {
    console.error(`Erreur dans ${context}:`, error);
    
    if (error.response) {
      // Erreur de réponse du serveur
      return {
        success: false,
        error: error.response.data?.message || 'Erreur serveur',
        status: error.response.status,
      };
    } else if (error.request) {
      // Erreur de réseau
      return {
        success: false,
        error: 'Erreur de connexion réseau',
        status: 0,
      };
    } else {
      // Autre erreur
      return {
        success: false,
        error: error.message || 'Erreur inconnue',
        status: -1,
      };
    }
  },

  // Validation des données
  validateData: (data, schema) => {
    try {
      return schema.validate(data);
    } catch (error) {
      return {
        isValid: false,
        errors: error.errors,
      };
    }
  },

  // Formatage des dates
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Formatage des nombres
  formatNumber: (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  },
}; 