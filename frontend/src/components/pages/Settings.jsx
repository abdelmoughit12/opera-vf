import React, { useState } from "react";
import Layout from "../sharedCompoents/Layout";
import { useNavigate } from "react-router-dom";
import ConfigurationPage from "../../pages/ConfigurationPage";
import { useNotification } from "../../hooks/useNotification";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("configuration");
  const { success, error } = useNotification();

  // Configuration des onglets de paramètres
  const settingsTabs = [
    {
      id: "configuration",
      title: "Configuration",
      description: "Gestion des clubs, produits et paramètres",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    // {
    //   id: "profile",
    //   title: "Profil Utilisateur",
    //   description: "Gérer votre profil et préférences",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   id: "security",
    //   title: "Sécurité",
    //   description: "Paramètres de sécurité et authentification",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   id: "notifications",
    //   title: "Notifications",
    //   description: "Préférences de notifications",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M15 17h5l-5 5v-5zM4.19 4.22A9.967 9.967 0 0112 2c5.523 0 10 4.477 10 10 0 2.136-.674 4.116-1.82 5.74L15 17H5a2 2 0 01-2-2V6a2 2 0 012-2h.19z"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   id: "system",
    //   title: "Système",
    //   description: "Paramètres système et maintenance",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    //       />
    //     </svg>
    //   ),
    // },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "configuration":
        return <ConfigurationPage />;
      case "profile":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Profil Utilisateur
            </h2>
            <p className="text-gray-600">
              Gestion du profil utilisateur - À implémenter
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                Cette section permettra de gérer les informations du profil
                utilisateur, les préférences personnelles et les paramètres de
                compte.
              </p>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sécurité
            </h2>
            <p className="text-gray-600">
              Paramètres de sécurité - À implémenter
            </p>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Cette section permettra de gérer les mots de passe,
                l'authentification à deux facteurs et les sessions actives.
              </p>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Notifications
            </h2>
            <p className="text-gray-600">
              Préférences de notifications - À implémenter
            </p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 text-sm">
                Cette section permettra de configurer les préférences de
                notifications par email, SMS et dans l'application.
              </p>
            </div>
          </div>
        );
      case "system":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Système
            </h2>
            <p className="text-gray-600">Paramètres système - À implémenter</p>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <p className="text-purple-800 text-sm">
                Cette section permettra de gérer les paramètres système, la
                maintenance et les sauvegardes.
              </p>
            </div>
          </div>
        );
      default:
        return <ConfigurationPage />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête principal */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="mt-2 text-gray-600">
              Gérez tous les paramètres de votre application Opera
            </p>
          </div>

          {/* Navigation par onglets */}
          <div className="mb-6">
            <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="space-y-6">{renderTabContent()}</div>

          {/* Informations supplémentaires */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              À propos des paramètres
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Configuration
                </h4>
                <p>
                  Gérez les clubs, produits et paramètres de base de votre
                  application. Cette section est entièrement fonctionnelle et
                  permet une gestion complète.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Fonctionnalités à venir
                </h4>
                <p>
                  Les autres sections (Profil, Sécurité, Notifications, Système)
                  seront implémentées dans les prochaines versions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
