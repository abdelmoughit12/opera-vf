import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from '../Layout';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Schema de validation pour le formulaire visiteur
const visitorSchema = yup.object({
  nom: yup.string().required('Nom requis'),
  prenom: yup.string().required('Prénom requis'),
  telephone: yup.string().required('Téléphone requis'),
  email: yup.string().email('Email invalide').required('Email requis'),
  dateNaissance: yup.date().required('Date de naissance requise'),
  adresse: yup.string().required('Adresse requise'),
  source: yup.string().required('Source d\'information requise'),
  interet: yup.string().required('Intérêt principal requis'),
}).required();

// Données mock pour les visiteurs
const mockVisitors = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Marie',
    telephone: '0612345678',
    email: 'marie.dupont@email.com',
    dateNaissance: '1990-05-15',
    adresse: '123 Rue de la Paix, Casablanca',
    source: 'Réseaux sociaux',
    interet: 'Yoga',
    statut: 'En cours',
    dateInscription: '2024-01-15',
    nombreVisites: 2,
    derniereVisite: '2024-01-20',
    accompagnateur: 'Ahmed Benali',
    notes: 'Intéressée par les cours de yoga du matin'
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Pierre',
    telephone: '0623456789',
    email: 'pierre.martin@email.com',
    dateNaissance: '1985-08-22',
    adresse: '456 Avenue Mohammed V, Rabat',
    source: 'Bouche à oreille',
    interet: 'Musculation',
    statut: 'Nouveau',
    dateInscription: '2024-01-18',
    nombreVisites: 1,
    derniereVisite: '2024-01-18',
    accompagnateur: 'Fatima Zahra',
    notes: 'Souhaite perdre du poids'
  },
  {
    id: 3,
    nom: 'Bernard',
    prenom: 'Sophie',
    telephone: '0634567890',
    email: 'sophie.bernard@email.com',
    dateNaissance: '1992-03-10',
    adresse: '789 Boulevard Hassan II, Marrakech',
    source: 'Publicité',
    interet: 'Cardio',
    statut: 'Converti',
    dateInscription: '2024-01-10',
    nombreVisites: 5,
    derniereVisite: '2024-01-25',
    accompagnateur: 'Karim Alami',
    notes: 'Convertie en abonnement premium'
  }
];

// Données pour les graphiques
const statsData = {
  evolution: [
    { date: '2024-01-15', visiteurs: 12 },
    { date: '2024-01-16', visiteurs: 18 },
    { date: '2024-01-17', visiteurs: 15 },
    { date: '2024-01-18', visiteurs: 22 },
    { date: '2024-01-19', visiteurs: 19 },
    { date: '2024-01-20', visiteurs: 25 },
    { date: '2024-01-21', visiteurs: 28 }
  ],
  sources: [
    { name: 'Réseaux sociaux', value: 35, color: '#3B82F6' },
    { name: 'Bouche à oreille', value: 25, color: '#10B981' },
    { name: 'Publicité', value: 20, color: '#F59E0B' },
    { name: 'Site web', value: 15, color: '#EF4444' },
    { name: 'Autres', value: 5, color: '#6B7280' }
  ],
  interets: [
    { name: 'Musculation', value: 30, color: '#3B82F6' },
    { name: 'Cardio', value: 25, color: '#10B981' },
    { name: 'Yoga', value: 20, color: '#F59E0B' },
    { name: 'Spa', value: 15, color: '#EF4444' },
    { name: 'Autres', value: 10, color: '#6B7280' }
  ]
};

const Visitors = () => {
  const [visitors, setVisitors] = useState(mockVisitors);
  const [showForm, setShowForm] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [filterSource, setFilterSource] = useState('Toutes');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(visitorSchema),
  });

  const onSubmit = (data) => {
    const newVisitor = {
      id: visitors.length + 1,
      ...data,
      statut: 'Nouveau',
      dateInscription: new Date().toISOString().split('T')[0],
      nombreVisites: 0,
      derniereVisite: null,
      accompagnateur: 'À assigner',
      notes: ''
    };
    setVisitors([...visitors, newVisitor]);
    setShowForm(false);
    reset();
  };

  const handleStatusChange = (visitorId, newStatus) => {
    setVisitors(visitors.map(v => 
      v.id === visitorId ? { ...v, statut: newStatus } : v
    ));
  };

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = 
      visitor.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.telephone.includes(searchTerm) ||
      visitor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'Tous' || visitor.statut === filterStatus;
    const matchesSource = filterSource === 'Toutes' || visitor.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Nouveau': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-orange-100 text-orange-800';
      case 'Converti': return 'bg-blue-100 text-blue-800';
      case 'Perdu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: visitors.length,
    nouveau: visitors.filter(v => v.statut === 'Nouveau').length,
    enCours: visitors.filter(v => v.statut === 'En cours').length,
    converti: visitors.filter(v => v.statut === 'Converti').length,
    tauxConversion: Math.round((visitors.filter(v => v.statut === 'Converti').length / visitors.length) * 100)
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Visiteurs</h1>
                <p className="text-gray-600 mt-2">Gérez vos visiteurs et prospects</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                + Nouveau Visiteur
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Visiteurs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Nouveaux</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.nouveau}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Cours</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.enCours}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Convertis</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.converti}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taux Conversion</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.tauxConversion}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Visites</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={statsData.evolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visiteurs" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources d'Information</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statsData.sources}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statsData.sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Intérêts Principaux</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statsData.interets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filtres et Recherche */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                <input
                  type="text"
                  placeholder="Nom, téléphone, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Tous">Tous les statuts</option>
                  <option value="Nouveau">Nouveau</option>
                  <option value="En cours">En cours</option>
                  <option value="Converti">Converti</option>
                  <option value="Perdu">Perdu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Toutes">Toutes les sources</option>
                  <option value="Réseaux sociaux">Réseaux sociaux</option>
                  <option value="Bouche à oreille">Bouche à oreille</option>
                  <option value="Publicité">Publicité</option>
                  <option value="Site web">Site web</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('Tous');
                    setFilterSource('Toutes');
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Liste des Visiteurs */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Liste des Visiteurs ({filteredVisitors.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visiteur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intérêt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visites</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVisitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{visitor.prenom} {visitor.nom}</div>
                          <div className="text-sm text-gray-500">Inscrit le {visitor.dateInscription}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{visitor.telephone}</div>
                          <div className="text-sm text-gray-500">{visitor.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.interet}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={visitor.statut}
                          onChange={(e) => handleStatusChange(visitor.id, e.target.value)}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visitor.statut)}`}
                        >
                          <option value="Nouveau">Nouveau</option>
                          <option value="En cours">En cours</option>
                          <option value="Converti">Converti</option>
                          <option value="Perdu">Perdu</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {visitor.nombreVisites} visite{visitor.nombreVisites > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedVisitor(visitor)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Voir
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            Convertir
                          </button>
                          <button className="text-orange-600 hover:text-orange-900">
                            Appeler
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Formulaire */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Nouveau Visiteur</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      {...register('nom')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input
                      type="text"
                      {...register('prenom')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      {...register('telephone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                    <input
                      type="date"
                      {...register('dateNaissance')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.dateNaissance && <p className="text-red-500 text-sm mt-1">{errors.dateNaissance.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Source d'information *</label>
                    <select
                      {...register('source')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner une source</option>
                      <option value="Réseaux sociaux">Réseaux sociaux</option>
                      <option value="Bouche à oreille">Bouche à oreille</option>
                      <option value="Publicité">Publicité</option>
                      <option value="Site web">Site web</option>
                      <option value="Autres">Autres</option>
                    </select>
                    {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Intérêt principal *</label>
                    <select
                      {...register('interet')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner un intérêt</option>
                      <option value="Musculation">Musculation</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Spa">Spa</option>
                      <option value="Pilates">Pilates</option>
                      <option value="Autres">Autres</option>
                    </select>
                    {errors.interet && <p className="text-red-500 text-sm mt-1">{errors.interet.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                  <textarea
                    {...register('adresse')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse.message}</p>}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Détails Visiteur */}
        {selectedVisitor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Détails du Visiteur</h2>
                  <button
                    onClick={() => setSelectedVisitor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Personnelles</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Nom complet:</span>
                        <p className="text-sm text-gray-900">{selectedVisitor.prenom} {selectedVisitor.nom}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Téléphone:</span>
                        <p className="text-sm text-gray-900">{selectedVisitor.telephone}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="text-sm text-gray-900">{selectedVisitor.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Date de naissance:</span>
                        <p className="text-sm text-gray-900">{selectedVisitor.dateNaissance}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Adresse:</span>
                        <p className="text-sm text-gray-900">{selectedVisitor.adresse}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de Suivi</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Source:</span>
                        <p className="text-sm text-gray-900">{selectedVisitor.source}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Intérêt:</span>
                        <p className="text-sm text-gray-900">{selectedVisitor.interet}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Statut:</span>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedVisitor.statut)}`}>
                          {selectedVisitor.statut}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Nombre de visites:</span>
                        <p className="text-sm text-gray-900">{selectedVisitor.nombreVisites}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Accompagnateur:</span>
                        <p className="text-sm text-gray-900">{selectedVisitor.accompagnateur}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {selectedVisitor.notes && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedVisitor.notes}</p>
                  </div>
                )}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedVisitor(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Fermer
                  </button>
                  <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                    Convertir en Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Visitors; 