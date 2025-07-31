import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

// Icônes SVG personnalisées
const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const MoneyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

// Composant StatCard
const StatCard = ({ title, value, icon: Icon, color, change, period }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs {period}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon />
      </div>
    </div>
  </div>
);

// Composant RecentActivity
const RecentActivity = ({ activities = [] }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${activity.type === 'sale' ? 'bg-green-500' : activity.type === 'client' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
          {activity.amount && (
            <span className="text-sm font-semibold text-green-600">{activity.amount}</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Composant AlertsPanel
const AlertsPanel = ({ alerts = [] }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <AlertIcon className="text-orange-500 mr-2" />
      Alertes
    </h3>
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div key={index} className={`p-3 rounded-lg border-l-4 ${alert.type === 'warning' ? 'bg-orange-50 border-orange-400' : 'bg-red-50 border-red-400'}`}>
          <p className="text-sm font-medium text-gray-900">{alert.title}</p>
          <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
        </div>
      ))}
    </div>
  </div>
);

// Composant QuickActions
const QuickActions = ({ onAction }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
    <div className="grid grid-cols-2 gap-3">
      {[
        { title: 'Nouveau Client', color: 'bg-blue-500 hover:bg-blue-600' },
        { title: 'Nouvelle Vente', color: 'bg-green-500 hover:bg-green-600' },
        { title: 'Gérer Abonnements', color: 'bg-purple-500 hover:bg-purple-600' },
        { title: 'Rapports', color: 'bg-orange-500 hover:bg-orange-600' }
      ].map((action, index) => (
        <button
          key={index}
          onClick={() => onAction(action.title)}
          className={`${action.color} text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200`}
        >
          {action.title}
        </button>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  // Données mock par défaut
  const defaultData = {
    stats: {
      activeClients: 1247,
      dailyRevenue: 15420,
      expiringSubscriptions: 23,
      todayVisits: 89,
      conversionRate: 68
    },
    salesData: [
      { day: 'Lun', sales: 12000, visits: 45 },
      { day: 'Mar', sales: 15000, visits: 52 },
      { day: 'Mer', sales: 18000, visits: 61 },
      { day: 'Jeu', sales: 14000, visits: 48 },
      { day: 'Ven', sales: 22000, visits: 78 },
      { day: 'Sam', sales: 25000, visits: 85 },
      { day: 'Dim', sales: 16000, visits: 55 }
    ],
    subscriptionData: [
      { name: 'Mensuel', value: 45, color: '#3B82F6' },
      { name: 'Trimestriel', value: 30, color: '#10B981' },
      { name: 'Annuel', value: 25, color: '#F59E0B' }
    ],
    hourlyData: [
      { hour: '6h', visits: 5 },
      { hour: '8h', visits: 15 },
      { hour: '10h', visits: 25 },
      { hour: '12h', visits: 35 },
      { hour: '14h', visits: 30 },
      { hour: '16h', visits: 40 },
      { hour: '18h', visits: 45 },
      { hour: '20h', visits: 20 }
    ],
    recentActivity: [
      { type: 'sale', title: 'Nouvelle vente - Abonnement Premium', time: 'Il y a 5 min', amount: '2,500 MAD' },
      { type: 'client', title: 'Nouveau client inscrit', time: 'Il y a 15 min' },
      { type: 'sale', title: 'Renouvellement abonement', time: 'Il y a 30 min', amount: '1,800 MAD' },
      { type: 'warning', title: 'Paiement en retard', time: 'Il y a 1h' }
    ],
    alerts: [
      { type: 'warning', title: '23 abonnements expirant ce mois', description: 'Action requise pour renouveler' },
      { type: 'warning', title: '5 paiements en retard', description: 'Montant total: 8,500 MAD' },
      { type: 'error', title: 'Maintenance prévue demain', description: 'De 2h à 4h du matin' }
    ]
  };

  const [dashboardData, setDashboardData] = useState(defaultData);

  useEffect(() => {
    // Simulation du chargement des données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleQuickAction = (action) => {
    console.log(`Action: ${action}`);
    // Navigation vers les pages correspondantes
    switch (action) {
      case 'Nouveau Client':
        navigate('/clients');
        break;
      case 'Nouvelle Vente':
        navigate('/sales');
        break;
      case 'Gérer Abonnements':
        navigate('/subscriptions');
        break;
      case 'Rapports':
        navigate('/reports');
        break;
      default:
        console.log(`Action non gérée: ${action}`);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Filtres de période */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
            <div className="flex space-x-2">
              {['day', 'week', 'month'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === p
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p === 'day' ? 'Jour' : p === 'week' ? 'Semaine' : 'Mois'}
                </button>
              ))}
            </div>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Clients Actifs"
              value={dashboardData.stats.activeClients?.toLocaleString() || '0'}
              icon={UsersIcon}
              color="bg-blue-100 text-blue-600"
              change={12}
              period="mois dernier"
            />
            <StatCard
              title="CA du Jour"
              value={`${dashboardData.stats.dailyRevenue?.toLocaleString() || '0'} MAD`}
              icon={MoneyIcon}
              color="bg-green-100 text-green-600"
              change={8}
              period="hier"
            />
            <StatCard
              title="Abonnements Expirant"
              value={dashboardData.stats.expiringSubscriptions || '0'}
              icon={CalendarIcon}
              color="bg-orange-100 text-orange-600"
              change={-5}
              period="semaine dernière"
            />
            <StatCard
              title="Visites Aujourd'hui"
              value={dashboardData.stats.todayVisits || '0'}
              icon={EyeIcon}
              color="bg-purple-100 text-purple-600"
              change={15}
              period="hier"
            />
            <StatCard
              title="Taux de Conversion"
              value={`${dashboardData.stats.conversionRate || '0'}%`}
              icon={TrendingUpIcon}
              color="bg-indigo-100 text-indigo-600"
              change={3}
              period="mois dernier"
            />
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Graphique des ventes */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Ventes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} MAD`} />
                  <Area type="monotone" dataKey="sales" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Répartition des abonnements */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Types d'Abonnements</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.subscriptionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dashboardData.subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fréquentation par heure */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fréquentation par Heure</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sections inférieures */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentActivity activities={dashboardData.recentActivity} />
            <AlertsPanel alerts={dashboardData.alerts} />
            <QuickActions onAction={handleQuickAction} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;