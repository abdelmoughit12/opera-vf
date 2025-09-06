import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const authService = {
  login: async (credentials) => {
    try {
      const response = await authApi.post('/login', credentials);
      
      // Adaptez cette partie selon la réponse de votre API
      if (response.data && response.data.success) {
        // Si votre API retourne un token
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        // Si votre API retourne les infos utilisateur
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return { success: true, data: response.data };
      }
      
      throw new Error('Réponse inattendue du serveur');
      
    } catch (error) {
      let errorMessage = 'Erreur de connexion';
      
      if (error.response) {
        // Gestion des erreurs HTTP
        switch (error.response.status) {
          case 401:
            errorMessage = 'Email ou mot de passe incorrect';
            break;
          case 422:
            errorMessage = 'Données invalides';
            if (error.response.data.errors) {
              errorMessage = Object.values(error.response.data.errors)[0][0];
            }
            break;
          default:
            errorMessage = error.response.data?.message || 'Erreur du serveur';
        }
      } else if (error.request) {
        errorMessage = 'Le serveur ne répond pas';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Méthodes simplifiées
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: true };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;