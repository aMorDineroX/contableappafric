import { Link, useLocation } from 'react-router-dom';

// Define route names for breadcrumb display
const routeNames: Record<string, string> = {
  'dashboard': 'Tableau de bord',
  'transactions': 'Transactions',
  'clients': 'Clients',
  'suppliers': 'Fournisseurs',
  'reports': 'Rapports',
  'settings': 'Paramètres',
  'profile': 'Profil',
  'login': 'Connexion',
  'register': 'Inscription'
};

const Breadcrumb = () => {
  const location = useLocation();

  // Skip breadcrumb on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Split the path into segments
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  // If we're at the root or dashboard, don't show breadcrumb
  if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'dashboard')) {
    return null;
  }

  return (
    <nav
      className="text-sm mb-6 animate-slideUp"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/dashboard"
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          // Build the path up to this segment
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={path} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>

              {isLast ? (
                <span className="ml-2 text-blue-600 font-medium">
                  {routeNames[segment] || segment}
                </span>
              ) : (
                <Link
                  to={path}
                  className="ml-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {routeNames[segment] || segment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
