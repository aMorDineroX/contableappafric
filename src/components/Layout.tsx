import { ReactNode, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import BackButton from './BackButton';
import PageTransition from './PageTransition';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Sidebar cachée par défaut

  // Fonction pour gérer le redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      // Toujours réduire la sidebar sur les petits écrans
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
      // Sur les grands écrans, on garde l'état actuel (ne pas déplier automatiquement)
    };

    // Appliquer au chargement initial
    handleResize();

    // Ajouter l'écouteur d'événement
    window.addEventListener('resize', handleResize);

    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16"> {/* Ajouter pt-16 pour compenser la hauteur de la navbar fixe */}
        {isAuthenticated && (
          <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        )}
        <main
          className={`flex-1 transition-all duration-300 ${isAuthenticated ? (isSidebarCollapsed ? 'ml-20' : 'ml-64') : ''} p-6`}
        >
          <BackButton />
          <Breadcrumb />
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default Layout;
