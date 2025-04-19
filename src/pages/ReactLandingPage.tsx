import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landingpage.css';

// Composant FAQ Item
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 border-b border-gray-200 pb-6">
      <button 
        className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-blue-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <i className={`fas fa-chevron-down text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}></i>
      </button>
      <div className={`mt-4 text-gray-600 ${isOpen ? 'block' : 'hidden'}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

const ReactLandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-800 to-blue-500 flex items-center justify-center">
              <i className="fas fa-calculator text-white"></i>
            </div>
            <span className="text-xl font-bold text-gray-800">Cont<span className="text-blue-800">AfricaX</span></span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-800 transition">Fonctionnalités</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-800 transition">Tarifs</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-800 transition">Témoignages</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-800 transition">FAQ</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-800 transition hidden md:block">Connexion</Link>
            <Link to="/register" className="btn-primary text-white px-6 py-2 rounded-full font-medium">Essai Gratuit</Link>
            <button className="md:hidden text-gray-600">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-pattern py-20 relative overflow-hidden">
        <div className="african-pattern absolute inset-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
                Gestion Comptable <span className="text-blue-800">Made in Africa</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                La solution tout-en-un pour simplifier votre comptabilité, adaptée aux spécificités des entreprises africaines. Gagnez du temps et prenez les bonnes décisions financières.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="btn-primary text-white px-8 py-3 rounded-full font-medium shadow-lg">
                  Commencer Maintenant <i className="fas fa-arrow-right ml-2"></i>
                </Link>
                <button className="bg-white text-gray-800 px-8 py-3 rounded-full font-medium border border-gray-200 shadow-lg hover:bg-gray-50 transition">
                  <i className="fas fa-play-circle mr-2 text-blue-600"></i> Voir la démo
                </button>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/12.jpg" alt="Client" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Client" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Client" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600"><span className="font-bold text-blue-800">500+</span> entreprises nous font confiance</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="relative bg-white p-2 rounded-2xl shadow-2xl border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Dashboard ContAfricaX" className="rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Logos */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 mb-8">Ils nous font confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <img src="https://via.placeholder.com/120x40?text=Entreprise+A" alt="Client" className="h-8 opacity-60 hover:opacity-100 transition" />
            <img src="https://via.placeholder.com/120x40?text=Banque+B" alt="Client" className="h-10 opacity-60 hover:opacity-100 transition" />
            <img src="https://via.placeholder.com/120x40?text=Startup+C" alt="Client" className="h-12 opacity-60 hover:opacity-100 transition" />
            <img src="https://via.placeholder.com/120x40?text=Groupe+D" alt="Client" className="h-8 opacity-60 hover:opacity-100 transition" />
            <img src="https://via.placeholder.com/120x40?text=Coopérative+E" alt="Client" className="h-10 opacity-60 hover:opacity-100 transition" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Des fonctionnalités conçues pour l'Afrique</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment ContAfricaX répond aux besoins spécifiques des entreprises africaines
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card bg-white p-8 rounded-xl border border-gray-100 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-money-bill-wave text-blue-800 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Multi-devises africaines</h3>
              <p className="text-gray-600">
                Gestion des opérations en FCFA, Naira, Cedi et autres devises locales avec mise à jour automatique des taux de change.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card bg-white p-8 rounded-xl border border-gray-100 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-file-invoice-dollar text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Conformité fiscale</h3>
              <p className="text-gray-600">
                Préparation automatique des déclarations fiscales selon les réglementations de chaque pays africain.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card bg-white p-8 rounded-xl border border-gray-100 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-mobile-alt text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Mobile First</h3>
              <p className="text-gray-600">
                Application optimisée pour smartphones avec mode hors-ligne pour les zones à faible connectivité.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="feature-card bg-white p-8 rounded-xl border border-gray-100 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-users text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Gestion informelle</h3>
              <p className="text-gray-600">
                Outils adaptés pour les tontines, associations et petites entreprises avec comptabilité simplifiée.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="feature-card bg-white p-8 rounded-xl border border-gray-100 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-chart-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Tableaux de bord</h3>
              <p className="text-gray-600">
                Visualisation claire de votre santé financière avec indicateurs clés adaptés aux PME africaines.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="feature-card bg-white p-8 rounded-xl border border-gray-100 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-language text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Multi-lingue</h3>
              <p className="text-gray-600">
                Interface disponible en français, anglais, arabe et langues locales pour une meilleure accessibilité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En 3 étapes simples, prenez le contrôle de votre comptabilité
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Step 1 */}
            <div className="relative mb-12 md:mb-0 text-center w-full md:w-1/3 px-8">
              <div className="absolute -left-2 md:left-auto md:right-full top-1/2 transform -translate-y-1/2 md:block hidden">
                <i className="fas fa-arrow-right text-gray-300 text-2xl"></i>
              </div>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-800 font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Inscription</h3>
              <p className="text-gray-600">
                Créez votre compte en 2 minutes et choisissez votre formule adaptée à votre entreprise.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative mb-12 md:mb-0 text-center w-full md:w-1/3 px-8">
              <div className="absolute -left-2 md:left-auto md:right-full top-1/2 transform -translate-y-1/2 md:block hidden">
                <i className="fas fa-arrow-right text-gray-300 text-2xl"></i>
              </div>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Configuration</h3>
              <p className="text-gray-600">
                Importez vos données ou partez de zéro. Notre assistant vous guide pas à pas.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center w-full md:w-1/3 px-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Gestion</h3>
              <p className="text-gray-600">
                Gérez votre comptabilité au quotidien et consultez vos rapports en temps réel.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link to="/register" className="btn-primary text-white px-8 py-3 rounded-full font-medium shadow-lg">
              Essayer Gratuitement <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Des tarifs adaptés à votre entreprise</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez la formule qui correspond à vos besoins
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
            {/* Plan 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Starter</h3>
                <p className="text-gray-600 mb-6">Parfait pour les petites entreprises</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">5,000</span>
                  <span className="text-gray-600">FCFA/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>Jusqu'à 50 transactions/mois</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>1 utilisateur</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>Facturation de base</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <i className="fas fa-times-circle mr-2"></i>
                    <span>Rapports avancés</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <i className="fas fa-times-circle mr-2"></i>
                    <span>Support prioritaire</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto p-4 bg-gray-50 text-center">
                <Link to="/register" className="w-full bg-white text-gray-800 px-6 py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-100 transition inline-block">
                  Choisir ce plan
                </Link>
              </div>
            </div>
            
            {/* Plan 2 (Featured) */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-blue-500 transform scale-105 z-10 flex flex-col">
              <div className="bg-blue-500 text-white py-2 text-center font-medium">
                Le plus populaire
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Business</h3>
                <p className="text-gray-600 mb-6">Idéal pour les PME en croissance</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">15,000</span>
                  <span className="text-gray-600">FCFA/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>Jusqu'à 500 transactions/mois</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>3 utilisateurs</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>Facturation complète</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>Rapports avancés</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <i className="fas fa-times-circle mr-2"></i>
                    <span>Support prioritaire</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto p-4 bg-gray-50 text-center">
                <Link to="/register" className="w-full btn-primary text-white px-6 py-3 rounded-lg font-medium inline-block">
                  Choisir ce plan
                </Link>
              </div>
            </div>
            
            {/* Plan 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">Solution complète pour grandes entreprises</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">35,000</span>
                  <span className="text-gray-600">FCFA/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>Transactions illimitées</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>Utilisateurs illimités</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>Facturation complète</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>Rapports avancés</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span>Support prioritaire 24/7</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto p-4 bg-gray-50 text-center">
                <Link to="/register" className="w-full bg-white text-gray-800 px-6 py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-100 transition inline-block">
                  Choisir ce plan
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600">Vous avez des besoins spécifiques ? <a href="#" className="text-blue-600 hover:underline">Contactez notre équipe</a></p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à révolutionner votre comptabilité ?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Rejoignez des milliers d'entreprises africaines qui utilisent déjà ContAfricaX pour simplifier leur gestion financière.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="bg-white text-gray-800 px-8 py-3 rounded-full font-medium shadow-lg hover:bg-gray-100 transition">
              Commencer l'essai gratuit <i className="fas fa-arrow-right ml-2"></i>
            </Link>
            <Link to="/login" className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-white hover:text-gray-800 transition">
              Se connecter <i className="fas fa-sign-in-alt ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ce que disent nos clients</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des entrepreneurs africains qui ont transformé leur gestion financière
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="testimonial-card p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold text-gray-800">Aïssatou Diallo</h4>
                  <p className="text-gray-600">Gérante, Boutique de tissus (Sénégal)</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Avant ContAfricaX, je perdais des heures à essayer de comprendre ma comptabilité. Maintenant, tout est clair et je peux me concentrer sur le développement de mon business."
              </p>
              <div className="flex text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="testimonial-card p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold text-gray-800">Jean Bosco</h4>
                  <p className="text-gray-600">Directeur, Agence de transport (RDC)</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "La fonction multi-devises est un vrai plus pour notre activité qui opère dans plusieurs pays. Les rapports fiscaux automatiques nous font gagner un temps précieux."
              </p>
              <div className="flex text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="testimonial-card p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold text-gray-800">Fatou Ndiaye</h4>
                  <p className="text-gray-600">Présidente, Association de tontine (Côte d'Ivoire)</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Enfin une solution adaptée à nos tontines ! La simplicité d'utilisation et le mode hors-ligne sont parfaits pour nos membres qui ne sont pas tous à l'aise avec la technologie."
              </p>
              <div className="flex text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Questions fréquentes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trouvez des réponses aux questions les plus posées
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <FAQItem 
              question="ContAfricaX est-il adapté à mon pays africain ?" 
              answer="Oui, ContAfricaX est conçu pour couvrir les spécificités comptables et fiscales de tous les pays africains. Nous avons des modules adaptés pour chaque législation nationale et nous mettons à jour régulièrement nos systèmes en fonction des changements réglementaires." 
            />
            
            <FAQItem 
              question="Puis-je utiliser ContAfricaX sans connexion internet constante ?" 
              answer="Absolument ! ContAfricaX fonctionne en mode hors-ligne et synchronise automatiquement vos données lorsque vous retrouvez une connexion. C'est idéal pour les zones où l'internet est intermittent." 
            />
            
            <FAQItem 
              question="Comment puis-je migrer mes données existantes vers ContAfricaX ?" 
              answer="Nous proposons des outils d'importation pour les formats Excel et CSV, ainsi qu'un service d'assistance à la migration pour les données plus complexes. Notre équipe peut vous aider à transférer vos données historiques sans perdre d'information." 
            />
            
            <FAQItem 
              question="Quelle est la politique de sécurité de mes données ?" 
              answer="Vos données sont chiffrées de bout en bout et stockées sur des serveurs sécurisés en Afrique. Nous respectons les réglementations locales sur la protection des données et ne partageons jamais vos informations avec des tiers sans votre consentement." 
            />
            
            <FAQItem 
              question="Puis-je essayer ContAfricaX gratuitement ?" 
              answer="Bien sûr ! Nous offrons un essai gratuit de 14 jours sans engagement et sans besoin de carte bancaire. Vous pouvez tester toutes les fonctionnalités et voir par vous-même comment ContAfricaX peut transformer votre gestion comptable." 
            />
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600">Vous avez d'autres questions ? <a href="#" className="text-blue-600 hover:underline">Contactez notre support</a></p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Column 1 */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center">
                  <i className="fas fa-calculator text-white"></i>
                </div>
                <span className="text-xl font-bold">Cont<span className="text-blue-500">AfricaX</span></span>
              </div>
              <p className="text-gray-400 mb-6">
                La solution de comptabilité conçue pour les entreprises africaines, par des Africains.
              </p>
            </div>
            
            {/* Column 2 */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Liens utiles</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Accueil</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Fonctionnalités</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition">Tarifs</a></li>
              </ul>
            </div>
            
            {/* Column 3 */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Ressources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Centre d'aide</a></li>
              </ul>
            </div>
            
            {/* Column 4 */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt text-blue-500 mt-1 mr-3"></i>
                  <span className="text-gray-400">Immeuble Alpha, Avenue Bourguiba, Dakar, Sénégal</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt text-blue-500 mr-3"></i>
                  <span className="text-gray-400">+221 33 123 45 67</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2023 ContAfricaX. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReactLandingPage;
