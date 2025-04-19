import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="profile-card bg-white rounded-xl overflow-hidden">
              <div className="african-pattern h-24 relative">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'Utilisateur'}</h2>
                <p className="text-amber-600 font-medium">Comptable Senior</p>
                <p className="text-gray-600 mt-2">Finances SA</p>
                
                <div className="mt-6 flex justify-center space-x-4">
                  <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <i className="fab fa-linkedin-in"></i>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <i className="fab fa-whatsapp"></i>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-envelope"></i>
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Profil complété</span>
                    <span className="font-bold text-gray-800">85%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-xl p-6 shadow-sm animate-slide-up">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Informations personnelles</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                    <i className="fas fa-map-marker-alt text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Localisation</p>
                    <p className="font-medium text-gray-800">Dakar, Sénégal</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <i className="fas fa-envelope text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-medium text-gray-800">{user?.email || 'email@example.com'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                    <i className="fas fa-phone-alt text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Téléphone</p>
                    <p className="font-medium text-gray-800">+221 77 123 45 67</p>
                  </div>
                </div>
              </div>
              
              <button className="mt-6 w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition duration-300 hover:scale-102 active:scale-98">
                Modifier le profil
              </button>
            </div>
          </div>
          
          {/* Right Content */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl p-6 shadow-sm animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="stat-card bg-blue-50 rounded-lg p-4 hover-lift">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <i className="fas fa-users text-xl"></i>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Clients</p>
                      <p className="text-2xl font-bold text-gray-800">42</p>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card bg-green-50 rounded-lg p-4 hover-lift">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                      <i className="fas fa-exchange-alt text-xl"></i>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Transactions</p>
                      <p className="text-2xl font-bold text-gray-800">128</p>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card bg-purple-50 rounded-lg p-4 hover-lift">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                      <i className="fas fa-file-alt text-xl"></i>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Documents</p>
                      <p className="text-2xl font-bold text-gray-800">76</p>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card bg-amber-50 rounded-lg p-4 hover-lift">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                      <i className="fas fa-trophy text-xl"></i>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Performance</p>
                      <p className="text-2xl font-bold text-gray-800">85%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activities */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Activités récentes</h3>
                <div className="space-y-4">
                  <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition duration-200">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-3">
                      <i className="fas fa-file-invoice"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">A soumis le rapport trimestriel</p>
                      <p className="text-sm text-gray-500">Il y a 2 heures</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                  
                  <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition duration-200">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-3">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">A ajouté un nouveau client</p>
                      <p className="text-sm text-gray-500">Il y a 1 jour</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                  
                  <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition duration-200">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-3">
                      <i className="fas fa-exchange-alt"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">A effectué une transaction</p>
                      <p className="text-sm text-gray-500">Il y a 2 jours</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                  
                  <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition duration-200">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-3">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">A mis à jour les données fiscales</p>
                      <p className="text-sm text-gray-500">Il y a 3 jours</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                
                <button className="mt-6 w-full py-2 border border-gray-200 hover:border-gray-300 text-gray-600 font-medium rounded-lg transition duration-300 hover:scale-102 active:scale-98">
                  Voir toutes les activités
                </button>
              </div>
            </div>
            
            {/* Documents Section */}
            <div className="mt-6 bg-white rounded-xl p-6 shadow-sm animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Mes documents</h3>
                <button className="text-amber-600 hover:text-amber-700 font-medium">
                  <i className="fas fa-plus mr-1"></i> Ajouter
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200 hover-lift">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <i className="fas fa-file-pdf text-xl"></i>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">Rapport annuel 2023</h4>
                  <p className="text-sm text-gray-500 mb-3">Ajouté le 15/06/2023</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">2.4 MB</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200 hover-lift">
                  <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-3">
                    <i className="fas fa-file-excel text-xl"></i>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">Déclarations fiscales</h4>
                  <p className="text-sm text-gray-500 mb-3">Ajouté le 10/06/2023</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">1.8 MB</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200 hover-lift">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                    <i className="fas fa-file-word text-xl"></i>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">Contrats clients</h4>
                  <p className="text-sm text-gray-500 mb-3">Ajouté le 05/06/2023</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">3.2 MB</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
