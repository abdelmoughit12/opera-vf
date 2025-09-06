import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientService } from '../../services/clientService';
import EditClientModal from './edit/EditClientModal';

const ClientList = ({ 
  clients, 
  setClients, // Ajout de cette prop pour mettre à jour la liste
  currentPage, 
  itemsPerPage, 
  totalPages, 
  onPageChange, 
  onEdit, 
  onDelete,
  getStatusColor,
  getTypeColor 
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Helper function to safely get client data
  const getClientData = (client, field) => {
    if (!client) return '';
    return client[field] || '';
  };

  // Helper function to format amount
  const formatAmount = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to get client name
  const getClientName = (client) => {
    const prenom = getClientData(client, 'Prenom_Visiteur') || getClientData(client, 'Prenom');
    const nom = getClientData(client, 'Nom_Visiteur') || getClientData(client, 'Nom');
    return `${prenom} ${nom}`.trim() || 'Nom non disponible';
  };

  // Helper function to get client phone
  const getClientPhone = (client) => {
    return getClientData(client, 'Telephone_Visiteur') || getClientData(client, 'Telephone') || 'Non renseigné';
  };

  // Helper function to get client email
  const getClientEmail = (client) => {
    return getClientData(client, 'Email') || 'Non renseigné';
  };

  // Fonction pour afficher les notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000); // Cache la notification après 3 secondes
  };

  // Fonction pour gérer la modification du client
  const handleEditClient = (e, client) => {
    e.stopPropagation();
    setSelectedClient(client);
    setShowEditModal(true);
    console.log('Ouverture de la modale EditClient pour:', client.CIN);
  };

  // Fonction pour gérer la soumission de la modification
  const handleEditSubmit = async (updatedClientData) => {
    try {
      const result = await ClientService.updateClient(selectedClient.CIN, updatedClientData);
      if (result.success) {
        // Fermer la modale
        setShowEditModal(false);
        setSelectedClient(null);

        // Mise à jour en temps réel de la liste des clients
        if (setClients) {
          setClients(prevClients => 
            prevClients.map(client => 
              client.CIN === selectedClient.CIN 
                ? { ...client, ...result.data }
                : client
            )
          );
        }

        // Afficher la notification de succès
        showNotification(
          `Client ${getClientName({ ...selectedClient, ...result.data })} modifié avec succès!`, 
          'success'
        );

        console.log('Client modifié avec succès:', result.data);
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      
      // Afficher la notification d'erreur
      showNotification(
        'Erreur lors de la modification du client. Veuillez réessayer.',
        'error'
      );
    }
  };

  // Composant de notification
  const NotificationComponent = () => {
    if (!notification.show) return null;

    const bgColor = notification.type === 'success' 
      ? 'bg-green-500' 
      : notification.type === 'error' 
      ? 'bg-red-500' 
      : 'bg-blue-500';

    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between animate-fade-in`}>
          <div className="flex items-center">
            <div className="mr-3">
              {notification.type === 'success' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification({ show: false, message: '', type: '' })}
            className="ml-4 text-white hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Notification */}
      <NotificationComponent />

      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Liste des Clients ({clients.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentClients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Aucun client trouvé
                  </td>
                </tr>
              ) : (
                currentClients.map((client) => (
                  <tr
                    key={client.CIN || client.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={e => {
                      if (e.target.tagName !== "BUTTON") {
                        console.log('ClientList - Clic sur ligne, navigation vers client ID:', client.CIN);
                        navigate(`/client/${client.CIN}`);
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getClientName(client)}
                        </div>
                        <div className="text-sm text-gray-600">
                          CIN: {getClientData(client, 'CIN')}
                        </div>
                        <div className="text-sm text-gray-600">
                          Inscrit le {formatDate(getClientData(client, 'Date_Inscription'))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getClientData(client, 'Club') ? ` ${getClientData(client, 'Club')}` : 'Non assigné'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{getClientPhone(client)}</div>
                        <div className="text-sm text-gray-500">{getClientEmail(client)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getClientData(client, 'Status'))}`}>
                        {getClientData(client, 'Status') || 'Non défini'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(getClientData(client, 'Type_Client'))}`}>
                        {getClientData(client, 'Type_Client') || 'Non défini'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getClientData(client, 'Adresse') || 'Non renseignée'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleEditClient(e, client)}
                          className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200"
                        >
                          Modifier
                        </button>

                        <button
                          onClick={e => { e.stopPropagation(); onDelete(client.CIN); }}
                          className="text-red-600 hover:text-red-900 font-medium transition-colors duration-200"
                        >
                          Supprimer
                        </button>
                        
                        <button
                          onClick={e => { 
                            e.stopPropagation(); 
                            console.log('ClientList - Navigation vers client ID:', client.CIN);
                            navigate(`/client/${client.CIN}`, { state: { client } }); 
                          }}
                          className="text-green-600 hover:text-green-900 font-medium transition-colors duration-200"
                        >
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, clients.length)} sur {clients.length} résultats
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modale de modification */}
        {showEditModal && selectedClient && (
          <EditClientModal
            client={selectedClient}
            show={showEditModal}
            onHide={() => {
              setShowEditModal(false);
              setSelectedClient(null);
            }}
            onSubmit={handleEditSubmit}
          />
        )}
      </div>

      {/* Styles pour l'animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ClientList;