import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-20 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                ContAfricaX
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`${location.pathname === '/dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Tableau de bord
              </Link>
              <Link
                to="/transactions"
                className={`${location.pathname === '/transactions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Transactions
              </Link>
              <Link
                to="/clients"
                className={`${location.pathname === '/clients' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Clients
              </Link>
              <Link
                to="/suppliers"
                className={`${location.pathname === '/suppliers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Fournisseurs
              </Link>
              <Link
                to="/reports"
                className={`${location.pathname === '/reports' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Rapports
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </button>
                </div>
                {isProfileOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Votre Profil
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Paramètres
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/dashboard"
            className={`${location.pathname === '/dashboard' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Tableau de bord
          </Link>
          <Link
            to="/transactions"
            className={`${location.pathname === '/transactions' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Transactions
          </Link>
          <Link
            to="/clients"
            className={`${location.pathname === '/clients' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Clients
          </Link>
          <Link
            to="/suppliers"
            className={`${location.pathname === '/suppliers' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Fournisseurs
          </Link>
          <Link
            to="/reports"
            className={`${location.pathname === '/reports' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Rapports
          </Link>
          <Link
            to="/settings"
            className={`${location.pathname === '/settings' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Paramètres
          </Link>
        </div>
        {isAuthenticated ? (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name || 'Utilisateur'}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email || ''}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Votre Profil
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-2 px-4">
              <Link
                to="/login"
                className="block text-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="block text-center px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inscription
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
