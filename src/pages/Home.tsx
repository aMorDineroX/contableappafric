import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Utilisateurs Actifs', value: '2.7M+' },
    { label: 'Pays Africains', value: '54' },
    { label: 'Transactions', value: '150k+' },
    { label: 'Partenaires', value: '200+' },
  ];

  const features = [
    {
      title: 'Tableau de bord',
      description: 'Visualisez vos performances et analyses en temps réel',
      icon: '📊',
      path: '/dashboard'
    },
    {
      title: 'Produits',
      description: 'Explorez notre catalogue de produits africains',
      icon: '🛍️',
      path: '/products'
    },
    {
      title: 'Marchés',
      description: 'Découvrez les opportunités commerciales en Afrique',
      icon: '🌍',
      path: '/markets'
    },
    {
      title: 'Formation',
      description: 'Développez vos compétences commerciales',
      icon: '📚',
      path: '/education'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section avec animation */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-6 animate-fadeIn">
          <h1 className="text-6xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Bienvenue sur ContAfricaX
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
            Votre plateforme   de comptabilité adaptée aux réalités africaines. 
            <span className="block mt-2 text-blue-600 font-medium">
              Connectez-vous avec des millions de commerçants à travers l'Afrique.
            </span>
          </p>
        </div>

        {/* Stats Section avec hover effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl 
                         transform hover:-translate-y-1 transition-all duration-300
                         border border-gray-100 hover:border-blue-200"
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent 
                            bg-gradient-to-r from-blue-600 to-purple-600 
                            group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-gray-600 mt-2 group-hover:text-blue-600 
                            transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid avec effets de carte */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl 
                         transform hover:-translate-y-2 transition-all duration-300
                         cursor-pointer border border-gray-100 hover:border-blue-200"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 
                            transition-transform duration-300">
                {feature.icon}
              </div>
              <h2 className="text-xl font-bold mb-3 text-gray-800 
                           group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h2>
              <p className="text-gray-600 group-hover:text-gray-700 
                          transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action amélioré */}
        <div className="text-center mt-20">
          <button 
            onClick={() => navigate('/register')}
            className="group relative inline-flex items-center px-12 py-4 
                     overflow-hidden text-lg font-bold text-white 
                     bg-gradient-to-r from-blue-600 to-purple-600
                     rounded-full hover:from-purple-600 hover:to-blue-600 
                     transition-all duration-300 transform hover:-translate-y-1
                     focus:outline-none focus:ring-2 focus:ring-blue-400 
                     focus:ring-offset-2 shadow-lg hover:shadow-xl"
          >
            <span className="relative">
              Commencer Maintenant
              <span className="absolute bottom-0 left-0 w-full h-1 
                             bg-white transform scale-x-0 group-hover:scale-x-100 
                             transition-transform duration-300">
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
