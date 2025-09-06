import { useState, useEffect, useCallback } from 'react';
import { ClientService } from '../services/clientService';
import { useNotification } from './useNotification';

export const useClientData = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  // Fonction pour normaliser les données client
  const normalizeClientData = useCallback((client) => {
    if (!client) return null;
    
    return {
      // Données principales
      CIN: client.CIN,
      Club: client.Club,
      Code_Club: client.Code_Club,
      Email: client.Email,
      Status: client.Status,
      Type_Client: client.Type_Client,
      Date_Inscription: client.Date_Inscription,
      Date_Naissance: client.Date_Naissance,
      Adresse: client.Adresse,
      Notes: client.Notes,
      
      // Données du visiteur (avec fallback)
      Nom_Visiteur: client.Nom_Visiteur || client.Nom,
      Prenom_Visiteur: client.Prenom_Visiteur || client.Prenom,
      Telephone_Visiteur: client.Telephone_Visiteur || client.Telephone,
      
      // Données originales pour compatibilité
      ...client
    };
  }, []);

  // Récupérer tous les clients
  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ClientService.getAll();
      const normalizedClients = Array.isArray(data) 
        ? data.map(normalizeClientData).filter(Boolean)
        : [];
      
      setClients(normalizedClients);
    } catch (err) {
      console.error('Erreur lors de la récupération des clients:', err);
      setError(err.message);
      showNotification('error', 'Erreur lors de la récupération des clients');
    } finally {
      setLoading(false);
    }
  }, [normalizeClientData, showNotification]);

  // Récupérer un client par ID
  const fetchClientById = useCallback(async (id) => {
    if (!id) {
      setError('ID du client requis');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await ClientService.getClientById(id);
      
      if (result.success && result.data) {
        return normalizeClientData(result.data);
      } else {
        setError(result.error || 'Client non trouvé');
        showNotification('error', result.error || 'Client non trouvé');
        return null;
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du client:', err);
      setError(err.message);
      showNotification('error', 'Erreur lors de la récupération du client');
      return null;
    } finally {
      setLoading(false);
    }
  }, [normalizeClientData, showNotification]);

  // Créer un nouveau client
  const createClient = useCallback(async (clientData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validation des données
      const validation = ClientService.validateClientData(clientData);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        showNotification('error', validation.errors.join(', '));
        return null;
      }

      const result = await ClientService.createClient(clientData);
      
      if (result.success && result.data) {
        const newClient = normalizeClientData(result.data);
        setClients(prev => [...prev, newClient]);
        showNotification('success', 'Client créé avec succès');
        return newClient;
      } else {
        setError(result.error || 'Erreur lors de la création du client');
        showNotification('error', result.error || 'Erreur lors de la création du client');
        return null;
      }
    } catch (err) {
      console.error('Erreur lors de la création du client:', err);
      setError(err.message);
      showNotification('error', 'Erreur lors de la création du client');
      return null;
    } finally {
      setLoading(false);
    }
  }, [normalizeClientData, showNotification]);

  // Mettre à jour un client
  const updateClient = useCallback(async (id, clientData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ClientService.updateClient(id, clientData);
      
      if (result.success && result.data) {
        const updatedClient = normalizeClientData(result.data);
        setClients(prev => prev.map(client => 
          client.CIN === id ? updatedClient : client
        ));
        showNotification('success', 'Client mis à jour avec succès');
        return updatedClient;
      } else {
        setError(result.error || 'Erreur lors de la mise à jour du client');
        showNotification('error', result.error || 'Erreur lors de la mise à jour du client');
        return null;
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du client:', err);
      setError(err.message);
      showNotification('error', 'Erreur lors de la mise à jour du client');
      return null;
    } finally {
      setLoading(false);
    }
  }, [normalizeClientData, showNotification]);

  // Supprimer un client
  const deleteClient = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ClientService.deleteClient(id);
      
      if (result.success) {
        setClients(prev => prev.filter(client => client.CIN !== id));
        showNotification('success', 'Client supprimé avec succès');
        return true;
      } else {
        setError(result.error || 'Erreur lors de la suppression du client');
        showNotification('error', result.error || 'Erreur lors de la suppression du client');
        return false;
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du client:', err);
      setError(err.message);
      showNotification('error', 'Erreur lors de la suppression du client');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Rechercher des clients
  const searchClients = useCallback(async (searchTerm, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ClientService.searchClients(searchTerm, filters);
      
      if (result.success && result.data) {
        const normalizedClients = Array.isArray(result.data) 
          ? result.data.map(normalizeClientData).filter(Boolean)
          : [];
        
        setClients(normalizedClients);
        return normalizedClients;
      } else {
        setError(result.error || 'Erreur lors de la recherche');
        showNotification('error', result.error || 'Erreur lors de la recherche');
        return [];
      }
    } catch (err) {
      console.error('Erreur lors de la recherche des clients:', err);
      setError(err.message);
      showNotification('error', 'Erreur lors de la recherche des clients');
      return [];
    } finally {
      setLoading(false);
    }
  }, [normalizeClientData, showNotification]);

  // Fonctions utilitaires
  const getClientById = useCallback((id) => {
    return clients.find(client => client.CIN === id);
  }, [clients]);

  const getClientName = useCallback((client) => {
    if (!client) return 'Nom non disponible';
    const prenom = client.Prenom_Visiteur || client.Prenom;
    const nom = client.Nom_Visiteur || client.Nom;
    return `${prenom || ''} ${nom || ''}`.trim() || 'Nom non disponible';
  }, []);

  const getClientPhone = useCallback((client) => {
    if (!client) return 'Non renseigné';
    return client.Telephone_Visiteur || client.Telephone || 'Non renseigné';
  }, []);

  const getClientEmail = useCallback((client) => {
    if (!client) return 'Non renseigné';
    return client.Email || 'Non renseigné';
  }, []);

  return {
    // État
    clients,
    loading,
    error,
    
    // Actions
    fetchClients,
    fetchClientById,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
    
    // Utilitaires
    getClientById,
    getClientName,
    getClientPhone,
    getClientEmail,
    normalizeClientData
  };
};


