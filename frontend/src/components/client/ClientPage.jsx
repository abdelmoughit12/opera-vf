import React, { useState, useEffect } from 'react';
import Layout from '../sharedCompoents/Layout';
import ClientStats from './ClientStats';
import ClientSearch from './ClientSearch';
import ClientFilters from './ClientFilters';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import { ClientService } from '../../services/clientService';

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    Status: '',
    Type_Client: '',
    Date_debut: '',
    date_fin: '',
    ville: ''
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ClientService.getAll();
      setClients(data || []);
    } catch (error) {
      console.error("Erreur récupération clients :", error);
      setError("Erreur lors de la récupération des clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calcul des statistiques
  const stats = {
    total: clients.length,
    actif: clients.filter(c => c.Status === 'actif').length,
    inactif: clients.filter(c => c.Status === 'inactif').length,
    en_attente: clients.filter(c => c.Status === 'en_attente').length,
    vip: clients.filter(c => c.Type_Client === 'vip').length,
    premium: clients.filter(c => c.Type_Client === 'premium').length,
    standard: clients.filter(c => c.Type_Client === 'standard').length,
    revenus_totaux: clients.reduce((sum, c) => sum + (parseFloat(c.montant_total) || 0), 0)
  };

  // Filtrage des clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      (client.Nom_Visiteur && client.Nom_Visiteur.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.Prenom_Visiteur && client.Prenom_Visiteur.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.Email && client.Email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.CIN && client.CIN.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.Telephone_Visiteur && client.Telephone_Visiteur.includes(searchTerm));
    
    const matchesStatus = !filters.Status || client.Status === filters.Status;
    const matchesType = !filters.Type_Client || client.Type_Client === filters.Type_Client;
    const matchesVille = !filters.ville || (client.Adresse && client.Adresse.toLowerCase().includes(filters.ville.toLowerCase()));
    
    const matchesDate = !filters.date_debut || !filters.date_fin || 
      (client.Date_Inscription && client.Date_Inscription >= filters.date_debut && client.Date_Inscription <= filters.date_fin);
    
    return matchesSearch && matchesStatus && matchesType && matchesVille && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // Fonctions CRUD
  const handleCreateClient = async (data) => {
    try {
      const result = await ClientService.createClient(data);
      if (result.success) {
        await fetchClients(); // Refresh the list
        setShowForm(false);
      } else {
        console.error("Erreur création client:", result.error);
      }
    } catch (error) {
      console.error("Erreur création client:", error);
    }
  };

  const handleUpdateClient = async (data) => {
    try {
      const result = await ClientService.updateClient(selectedClient.CIN, data);
      if (result.success) {
        await fetchClients(); // Refresh the list
        setShowForm(false);
        setSelectedClient(null);
      } else {
        console.error("Erreur mise à jour client:", result.error);
      }
    } catch (error) {
      console.error("Erreur mise à jour client:", error);
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        const result = await ClientService.deleteClient(id);
        if (result.success) {
          await fetchClients(); // Refresh the list
        } else {
          console.error("Erreur suppression client:", result.error);
        }
      } catch (error) {
        console.error("Erreur suppression client:", error);
      }
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  const handleFormSubmit = (data) => {
    if (selectedClient) {
      handleUpdateClient(data);
    } else {
      handleCreateClient(data);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      Status: '',
      Type_Client: '',
      date_debut: '',
      date_fin: '',
      ville: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-red-100 text-red-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'standard': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Chargement des clients...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">{error}</div>
              <button 
                onClick={fetchClients}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
                <p className="text-gray-600 mt-2">Gérez vos clients et leurs informations</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouveau Client
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <ClientStats stats={stats} />

          {/* Recherche */}
          <ClientSearch 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClear={clearFilters}
          />

          {/* Filtres */}
          <ClientFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />

          {/* Liste des Clients */}
          <ClientList 
            clients={filteredClients}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDeleteClient}
            getStatusColor={getStatusColor}
            getTypeColor={getTypeColor}
          />

          {/* Modal Formulaire */}
          <ClientForm
            show={showForm}
            onHide={() => {
              setShowForm(false);
              setSelectedClient(null);
            }}
            client={selectedClient}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ClientPage; 