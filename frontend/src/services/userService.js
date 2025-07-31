import axios from 'axios';

// Configuration de base pour axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Instance axios avec configuration de base
const userApi = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
userApi.interceptors.request.use(
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

// Service des utilisateurs
const userService = {
  // Récupérer le profil de l'utilisateur connecté
  getCurrentUserProfile: async () => {
    try {
      const response = await userApi.get('/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du profil',
      };
    }
  },

  // Mettre à jour le profil de l'utilisateur
  updateUserProfile: async (profileData) => {
    try {
      const response = await userApi.put('/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du profil',
      };
    }
  },

  // Changer le mot de passe
  changePassword: async (passwordData) => {
    try {
      const response = await userApi.put('/change-password', passwordData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du changement de mot de passe',
      };
    }
  },

  // Supprimer le compte utilisateur
  deleteAccount: async () => {
    try {
      await userApi.delete('/profile');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression du compte',
      };
    }
  },

  // Récupérer l'historique des activités
  getUserActivity: async (params = {}) => {
    try {
      const response = await userApi.get('/activity', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de l\'activité',
      };
    }
  },

  // Récupérer les préférences de l'utilisateur
  getUserPreferences: async () => {
    try {
      const response = await userApi.get('/preferences');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des préférences',
      };
    }
  },

  // Mettre à jour les préférences de l'utilisateur
  updateUserPreferences: async (preferences) => {
    try {
      const response = await userApi.put('/preferences', preferences);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour des préférences',
      };
    }
  },

  // Uploader une photo de profil
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await userApi.post('/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'upload de la photo',
      };
    }
  },

  // Récupérer les statistiques de l'utilisateur
  getUserStats: async () => {
    try {
      const response = await userApi.get('/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des statistiques',
      };
    }
  },

  // Récupérer les notifications de l'utilisateur
  getUserNotifications: async (params = {}) => {
    try {
      const response = await userApi.get('/notifications', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des notifications',
      };
    }
  },

  // Marquer une notification comme lue
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await userApi.put(`/notifications/${notificationId}/read`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du marquage de la notification',
      };
    }
  },

  // Marquer toutes les notifications comme lues
  markAllNotificationsAsRead: async () => {
    try {
      const response = await userApi.put('/notifications/read-all');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du marquage des notifications',
      };
    }
  },

  // Récupérer les abonnements de l'utilisateur
  getUserSubscriptions: async () => {
    try {
      const response = await userApi.get('/subscriptions');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des abonnements',
      };
    }
  },

  // Gérer les abonnements
  manageSubscription: async (subscriptionData) => {
    try {
      const response = await userApi.post('/subscriptions', subscriptionData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la gestion de l\'abonnement',
      };
    }
  },
};

export default userService; 