import axios from 'axios';

// Configuration de base pour les appels API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Instance axios configurée
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
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

// Service pour le dashboard
export const dashboardService = {
  // Récupérer les statistiques principales
  async getStats(period = 'week') {
    try {
      // Simulation d'appel API - remplacez par votre vraie API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données mock
      const mockStats = {
        activeClients: 1247,
        dailyRevenue: 15420,
        expiringSubscriptions: 23,
        todayVisits: 89,
        conversionRate: 68,
        period: period
      };
      
      return mockStats;
      
      // Décommentez pour utiliser une vraie API
      // const response = await apiClient.get(`/dashboard/stats?period=${period}`);
      // return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  // Récupérer les données de ventes
  async getSalesData(period = 'week') {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockSalesData = [
        { day: 'Lun', sales: 12000, visits: 45 },
        { day: 'Mar', sales: 15000, visits: 52 },
        { day: 'Mer', sales: 18000, visits: 61 },
        { day: 'Jeu', sales: 14000, visits: 48 },
        { day: 'Ven', sales: 22000, visits: 78 },
        { day: 'Sam', sales: 25000, visits: 85 },
        { day: 'Dim', sales: 16000, visits: 55 }
      ];
      
      return mockSalesData;
      
      // const response = await apiClient.get(`/dashboard/sales?period=${period}`);
      // return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données de ventes:', error);
      throw error;
    }
  },

  // Récupérer les données d'abonnements
  async getSubscriptionData() {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockSubscriptionData = [
        { name: 'Mensuel', value: 45, color: '#3B82F6' },
        { name: 'Trimestriel', value: 30, color: '#10B981' },
        { name: 'Annuel', value: 25, color: '#F59E0B' }
      ];
      
      return mockSubscriptionData;
      
      // const response = await apiClient.get('/dashboard/subscriptions');
      // return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données d\'abonnements:', error);
      throw error;
    }
  },

  // Récupérer les données de fréquentation par heure
  async getHourlyData() {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockHourlyData = [
        { hour: '6h', visits: 5 },
        { hour: '8h', visits: 15 },
        { hour: '10h', visits: 25 },
        { hour: '12h', visits: 35 },
        { hour: '14h', visits: 30 },
        { hour: '16h', visits: 40 },
        { hour: '18h', visits: 45 },
        { hour: '20h', visits: 20 }
      ];
      
      return mockHourlyData;
      
      // const response = await apiClient.get('/dashboard/hourly');
      // return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données horaires:', error);
      throw error;
    }
  },

  // Récupérer l'activité récente
  async getRecentActivity() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockActivities = [
        { type: 'sale', title: 'Nouvelle vente - Abonnement Premium', time: 'Il y a 5 min', amount: '2,500 MAD' },
        { type: 'client', title: 'Nouveau client inscrit', time: 'Il y a 15 min' },
        { type: 'sale', title: 'Renouvellement abonement', time: 'Il y a 30 min', amount: '1,800 MAD' },
        { type: 'warning', title: 'Paiement en retard', time: 'Il y a 1h' }
      ];
      
      return mockActivities;
      
      // const response = await apiClient.get('/dashboard/recent-activity');
      // return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'activité récente:', error);
      throw error;
    }
  },

  // Récupérer les alertes
  async getAlerts() {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockAlerts = [
        { type: 'warning', title: '23 abonnements expirant ce mois', description: 'Action requise pour renouveler' },
        { type: 'warning', title: '5 paiements en retard', description: 'Montant total: 8,500 MAD' },
        { type: 'error', title: 'Maintenance prévue demain', description: 'De 2h à 4h du matin' }
      ];
      
      return mockAlerts;
      
      // const response = await apiClient.get('/dashboard/alerts');
      // return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      throw error;
    }
  },

  // Récupérer toutes les données du dashboard
  async getAllDashboardData(period = 'week') {
    try {
      const [stats, salesData, subscriptionData, hourlyData, recentActivity, alerts] = await Promise.all([
        this.getStats(period),
        this.getSalesData(period),
        this.getSubscriptionData(),
        this.getHourlyData(),
        this.getRecentActivity(),
        this.getAlerts()
      ]);

      return {
        stats,
        salesData,
        subscriptionData,
        hourlyData,
        recentActivity,
        alerts
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données du dashboard:', error);
      throw error;
    }
  }
};

export default dashboardService; 