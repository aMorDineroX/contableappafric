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
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const isValid = await AuthAPI.verifyToken(token);
          if (isValid) {
            // Ici, vous pourriez faire un appel pour récupérer les données de l'utilisateur
            // Pour l'instant, nous allons simplement marquer l'utilisateur comme authentifié
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
        }
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
