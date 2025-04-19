import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresVerified?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiresAuth = true,
  requiresVerified = true,
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log('AuthGuard - Path:', location.pathname);
  console.log('AuthGuard - isAuthenticated:', isAuthenticated);
  console.log('AuthGuard - loading:', loading);
  console.log('AuthGuard - user:', user);

  // Vérifier si le token de démo est présent
  const isDemoMode = localStorage.getItem('token') === 'demo-token-for-testing';
  if (isDemoMode) {
    console.log('AuthGuard - Mode démo détecté, accès autorisé');
    return <>{children}</>;
  }

  if (loading) {
    console.log('AuthGuard - Chargement en cours...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requiresAuth && !isAuthenticated) {
    console.log('AuthGuard - Redirection vers login car non authentifié');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresVerified && user && !user.emailVerified) {
    console.log('AuthGuard - Redirection vers vérification email');
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  console.log('AuthGuard - Accès autorisé');
  return <>{children}</>;
};
