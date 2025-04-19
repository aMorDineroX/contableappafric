import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthAPI } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loginDemo: () => void; // Fonction de connexion temporaire pour démonstration
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Commencer avec loading=true pour vérifier le token

  // Vérifier si l'utilisateur est déjà authentifié au chargement
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Vérification de l\'authentification...');
      const token = localStorage.getItem('token');

      // Vérifier si c'est un token de démo
      if (token === 'demo-token-for-testing') {
        console.log('Token de démo détecté, activation du mode démo');
        const demoUser = {
          id: 1,
          name: 'Utilisateur Démo',
          email: 'demo@contafricax.com',
          role: 'user',
          emailVerified: true
        };
        setUser(demoUser);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      if (token) {
        console.log('Token trouvé, vérification...');
        try {
          // Essayer de vérifier le token avec l'API
          try {
            const isValid = await AuthAPI.verifyToken(token);
            if (isValid) {
              console.log('Token valide, utilisateur authentifié');
              // Ici, vous pourriez faire un appel pour récupérer les données de l'utilisateur
              setUser({
                id: 1, // Valeur par défaut
                name: 'Utilisateur',
                email: 'user@example.com',
                role: 'user',
                emailVerified: true
              });
              setIsAuthenticated(true);
            } else {
              console.log('Token invalide, suppression du token');
              localStorage.removeItem('token');
            }
          } catch (apiError) {
            console.error('Erreur API lors de la vérification du token:', apiError);
            // Si l'API n'est pas disponible, on peut quand même essayer d'utiliser le token
            // pour une meilleure expérience utilisateur
            console.log('Activation du mode dégradé (API non disponible)');
            setUser({
              id: 1,
              name: 'Utilisateur',
              email: 'user@example.com',
              role: 'user',
              emailVerified: true
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Erreur générale lors de la vérification du token:', error);
          localStorage.removeItem('token');
        }
      } else {
        console.log('Aucun token trouvé, utilisateur non authentifié');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const data = await AuthAPI.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', data.token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    try {
      const data = await AuthAPI.register(email, password, name);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', data.token);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // Fonction de connexion temporaire pour démonstration
  const loginDemo = () => {
    console.log('Activation du mode démo');
    const demoUser = {
      id: 1,
      name: 'Utilisateur Démo',
      email: 'demo@contafricax.com',
      role: 'user',
      emailVerified: true
    };
    setUser(demoUser);
    setIsAuthenticated(true);
    localStorage.setItem('token', 'demo-token-for-testing');

    // Forcer un délai pour s'assurer que l'état est mis à jour
    setTimeout(() => {
      console.log('Mode démo activé, isAuthenticated:', true);
    }, 100);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout, loginDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
