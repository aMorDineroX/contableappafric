import { useNavigate, useLocation } from 'react-router-dom';

interface BackButtonProps {
  fallbackPath?: string;
}

const BackButton = ({ fallbackPath = '/dashboard' }: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on main pages
  if (location.pathname === '/' ||
      location.pathname === '/dashboard' ||
      location.pathname === '/login' ||
      location.pathname === '/register') {
    return null;
  }

  const handleBack = () => {
    // If there's history to go back to, use it
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // Otherwise go to fallback path
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-4 transition-colors animate-slideLeft"
      aria-label="Retour"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Retour
    </button>
  );
};

export default BackButton;
