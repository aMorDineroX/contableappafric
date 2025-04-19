import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthGuard } from './components/AuthGuard';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReactLandingPage from './pages/ReactLandingPage';
import Clients from './pages/Clients';

// Pages fictives pour la navigation
import TransactionsPage from './pages/TransactionsPage';
const Reports = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Rapports</h1><p>Cette page est en cours de développement.</p></div>;
const Suppliers = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Fournisseurs</h1><p>Cette page est en cours de développement.</p></div>;
const Settings = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Paramètres</h1><p>Cette page est en cours de développement.</p></div>;
const Profile = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Profil</h1><p>Cette page est en cours de développement.</p></div>;

// Wrapper component to access location
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>

          {/* Route racine affiche la landing page */}
          <Route path="/" element={<ReactLandingPage />} />

          {/* Routes publiques */}
          <Route path="/login" element={
            <Layout>
              <Login />
            </Layout>
          } />
          <Route path="/register" element={
            <Layout>
              <Register />
            </Layout>
          } />

          {/* Routes protégées */}
          <Route path="/dashboard" element={
            <AuthGuard>
              <Layout>
                <Dashboard />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/transactions" element={
            <AuthGuard>
              <Layout>
                <TransactionsPage />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/clients" element={
            <AuthGuard>
              <Layout>
                <Clients />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/suppliers" element={
            <AuthGuard>
              <Layout>
                <Suppliers />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/reports" element={
            <AuthGuard>
              <Layout>
                <Reports />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/settings" element={
            <AuthGuard>
              <Layout>
                <Settings />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/profile" element={
            <AuthGuard>
              <Layout>
                <Profile />
              </Layout>
            </AuthGuard>
          } />

          {/* Route 404 */}
          <Route path="*" element={
            <Layout>
              <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl mb-8">Page non trouvée</p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Retour
                </button>
              </div>
            </Layout>
          } />
      </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}
export default App;
