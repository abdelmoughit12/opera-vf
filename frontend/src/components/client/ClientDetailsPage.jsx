import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,useLocation  } from 'react-router-dom';
import Layout from '../sharedCompoents/Layout';
import ClientDetails from './ClientDetails';
import { ClientService } from "../../services/clientService";


const ClientDetailsPage = () => {
  const { id } = useParams();   // ici `id` = CIN car tu passes CIN dans l’URL
  const { state } = useLocation();
  const navigate = useNavigate();

  const [client, setClient] = useState(state?.client || null);
  const [loading, setLoading] = useState(!state?.client);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!client) {
      const fetchClient = async () => {
        setLoading(true);
        const result = await ClientService.getClientById(id); 
        if (result.success) {
          setClient(result.data);
        } else {
          setError(result.error);
        }
        setLoading(false);
      };
      fetchClient();
    }
  }, [id, client]);

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des détails du client...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Client non trouvé</h2>
              <p className="text-gray-600 mb-6">Le client avec l'ID {id} n'existe pas.</p>
              <button
                onClick={() => navigate('/clients')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Retour à la liste des clients
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="">
      {/*  <div className="max-w-4xl mx-auto"> */}
          {/* Header avec bouton retour */}
          {/* <div className="mb-6">
            <button
              onClick={() => navigate('/clients')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à la liste des clients
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Détails du Client</h1>
          </div> */}

          {/* Composant ClientDetails */}
          <ClientDetails client={client} />
        {/* </div>*/}
      </div> 
    </Layout>
  );
};

export default ClientDetailsPage; 