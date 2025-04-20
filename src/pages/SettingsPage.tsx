import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import GeneralSettings from '../components/settings/GeneralSettings';
import CurrencySettings from '../components/settings/CurrencySettings';
import TaxSettings from '../components/settings/TaxSettings';
import PaymentSettings from '../components/settings/PaymentSettings';
import NotificationSettings from '../components/settings/NotificationSettings';

// Types d'onglets disponibles
type SettingsTab = 'general' | 'currency' | 'tax' | 'payment' | 'notification';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Fonction pour changer d'onglet
  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
  };

  // Définition des onglets
  const tabs = [
    { id: 'general', label: 'Général', icon: 'fas fa-cog' },
    { id: 'currency', label: 'Devises', icon: 'fas fa-money-bill-wave' },
    { id: 'tax', label: 'Fiscalité', icon: 'fas fa-file-invoice-dollar' },
    { id: 'payment', label: 'Paiements', icon: 'fas fa-credit-card' },
    { id: 'notification', label: 'Notifications', icon: 'fas fa-bell' },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de navigation */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <h2 className="text-xl font-bold text-gray-800">Paramètres</h2>
                <p className="text-sm text-gray-600">Configurez votre application</p>
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => handleTabChange(tab.id as SettingsTab)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <i className={`${tab.icon} w-5 h-5 mr-3`}></i>
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                          <span className="ml-auto">
                            <i className="fas fa-chevron-right text-blue-500"></i>
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user?.name || 'Utilisateur'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'email@example.com'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up">
              {/* Afficher le contenu en fonction de l'onglet actif */}
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'currency' && <CurrencySettings />}
              {activeTab === 'tax' && <TaxSettings />}
              {activeTab === 'payment' && <PaymentSettings />}
              {activeTab === 'notification' && <NotificationSettings />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
