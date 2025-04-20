// filepath: c:\Users\morcr\OneDrive\Bureau\MyDockerApps\ContAfricaX\src\pages\Suppliers.tsx
import { useState } from 'react';
import { formatCurrency } from '../utils/currencies';
import { Supplier, SupplierStatus } from '../types/supplier';
import { useCurrency } from '../contexts/CurrencyContext';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import SupplierCards from '../components/suppliers/SupplierCards';
import SupplierFilters from '../components/suppliers/SupplierFilters';

const Suppliers = () => {
  const { currency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const itemsPerPage = 6;

  // Données fictives pour les fournisseurs
  const suppliersData: Supplier[] = [
    {
      id: 1,
      name: 'Fournitures Express',
      email: 'contact@fournitures-express.com',
      phone: '+221 77 123 45 67',
      address: '123 Rue des Fournisseurs, Dakar',
      country: 'Sénégal',
      category: 'Fournitures de bureau',
      totalPurchases: 850000,
      outstandingPayable: 150000,
      status: 'actif' as SupplierStatus,
      lastOrderDate: '2023-11-28',
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2023-11-28T14:45:00Z'
    },
    {
      id: 2,
      name: 'Tech Solutions',
      email: 'info@techsolutions.ci',
      phone: '+225 01 234 56 78',
      address: '45 Boulevard Technologique, Abidjan',
      country: 'Côte d\'Ivoire',
      category: 'Équipement informatique',
      totalPurchases: 1250000,
      outstandingPayable: 0,
      status: 'actif' as SupplierStatus,
      lastOrderDate: '2023-12-05',
      createdAt: '2023-02-10T09:15:00Z',
      updatedAt: '2023-12-05T11:30:00Z'
    },
    {
      id: 3,
      name: 'Mobilier Pro',
      email: 'service@mobilier-pro.ng',
      phone: '+234 801 234 5678',
      address: '78 Main Street, Lagos',
      country: 'Nigeria',
      category: 'Mobilier de bureau',
      totalPurchases: 1750000,
      outstandingPayable: 450000,
      status: 'actif' as SupplierStatus,
      lastOrderDate: '2023-12-01',
      createdAt: '2023-03-05T14:20:00Z',
      updatedAt: '2023-12-01T16:45:00Z'
    },
    {
      id: 4,
      name: 'Imprimerie Centrale',
      email: 'contact@imprimerie-centrale.cm',
      phone: '+237 6 12 34 56 78',
      address: '56 Avenue de l\'Imprimerie, Douala',
      country: 'Cameroun',
      category: 'Imprimerie',
      totalPurchases: 650000,
      outstandingPayable: 120000,
      status: 'actif' as SupplierStatus,
      lastOrderDate: '2023-11-15',
      createdAt: '2023-04-12T08:30:00Z',
      updatedAt: '2023-11-15T10:15:00Z'
    },
    {
      id: 5,
      name: 'Services Nettoyage',
      email: 'info@services-nettoyage.sn',
      phone: '+221 78 765 43 21',
      address: '89 Rue de la Propreté, Dakar',
      country: 'Sénégal',
      category: 'Services d\'entretien',
      totalPurchases: 320000,
      outstandingPayable: 0,
      status: 'inactif' as SupplierStatus,
      lastOrderDate: '2023-10-20',
      createdAt: '2023-05-20T11:45:00Z',
      updatedAt: '2023-10-20T09:30:00Z'
    },
    {
      id: 6,
      name: 'Sécurité Plus',
      email: 'contact@securite-plus.bf',
      phone: '+226 70 12 34 56',
      address: '12 Rue de la Sécurité, Ouagadougou',
      country: 'Burkina Faso',
      category: 'Sécurité',
      totalPurchases: 480000,
      outstandingPayable: 80000,
      status: 'actif' as SupplierStatus,
      lastOrderDate: '2023-11-30',
      createdAt: '2023-06-15T13:20:00Z',
      updatedAt: '2023-11-30T15:10:00Z'
    },
    {
      id: 7,
      name: 'Transport Rapide',
      email: 'info@transport-rapide.ml',
      phone: '+223 76 12 34 56',
      address: '34 Avenue du Transport, Bamako',
      country: 'Mali',
      category: 'Transport',
      totalPurchases: 720000,
      outstandingPayable: 150000,
      status: 'actif' as SupplierStatus,
      lastOrderDate: '2023-12-03',
      createdAt: '2023-07-08T10:00:00Z',
      updatedAt: '2023-12-03T12:30:00Z'
    },
    {
      id: 8,
      name: 'Maintenance Équipements',
      email: 'service@maintenance-equipements.ne',
      phone: '+227 90 12 34 56',
      address: '67 Rue de la Maintenance, Niamey',
      country: 'Niger',
      category: 'Maintenance',
      totalPurchases: 390000,
      outstandingPayable: 80000,
      status: 'actif' as SupplierStatus,
      lastOrderDate: '2023-11-25',
      createdAt: '2023-08-17T09:45:00Z',
      updatedAt: '2023-11-25T14:20:00Z'
    },
    {
      id: 9,
      name: 'Formation Pro',
      email: 'contact@formation-pro.tg',
      phone: '+228 90 12 34 56',
      address: '23 Boulevard de la Formation, Lomé',
      country: 'Togo',
      category: 'Formation',
      totalPurchases: 580000,
      outstandingPayable: 0,
      status: 'inactif' as SupplierStatus,
      lastOrderDate: '2023-09-15',
      createdAt: '2023-09-01T15:30:00Z',
      updatedAt: '2023-09-15T11:45:00Z'
    }
  ];

  // Extraire les catégories uniques
  const categories = ['all', ...Array.from(new Set(suppliersData.map(s => s.category)))];

  // Filtrer les fournisseurs
  const filteredSuppliers = suppliersData
    .filter(supplier => {
      if (filterCategory !== 'all' && supplier.category !== filterCategory) return false;
      if (!searchTerm) return true;
      return (
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  // Pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculer les statistiques
  const totalSuppliers = suppliersData.length;
  const activeSuppliers = suppliersData.filter(s => s.status === 'actif').length;
  const totalPayable = suppliersData.reduce((sum, s) => sum + s.outstandingPayable, 0);
  const totalPurchases = suppliersData.reduce((sum, s) => sum + s.totalPurchases, 0);

  // Ouvrir le modal avec les détails du fournisseur
  const openSupplierDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  // Basculer entre la vue tableau et la vue cartes
  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'cards' : 'table');
  };

  // Gérer les filtres avancés
  const toggleFilters = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  // Gérer la création d'un nouveau fournisseur
  const handleNewSupplier = () => {
    // Ici, vous pourriez ouvrir un formulaire de création
    alert('Fonctionnalité à implémenter : Créer un nouveau fournisseur');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fournisseurs</h1>
          <div className="flex space-x-3">
            <Button
              onClick={toggleViewMode}
              className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md"
            >
              {viewMode === 'table' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                  </svg>
                  Vue cartes
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
                  </svg>
                  Vue tableau
                </>
              )}
            </Button>
            <Button
              onClick={toggleFilters}
              className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
              </svg>
              Filtres
            </Button>
            <Button
              onClick={handleNewSupplier}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Nouveau fournisseur
            </Button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900">Total fournisseurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{totalSuppliers}</p>
                <p className="text-sm text-gray-500">{activeSuppliers} actifs</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900">À payer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(totalPayable, currency)}
                </p>
                <p className="text-sm text-gray-500">Dettes fournisseurs</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900">Achats totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalPurchases, currency)}
                </p>
                <p className="text-sm text-gray-500">Tous fournisseurs</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900">Catégories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">{categories.length - 1}</p>
                <p className="text-sm text-gray-500">Types de fournisseurs</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      filterCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'Toutes catégories' : category}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres avancés */}
        {isFilterExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <SupplierFilters
              onFilterChange={(filters) => {
                console.log('Filtres appliqués:', filters);
                // Implémenter la logique de filtrage ici
              }}
              onReset={() => {
                setFilterCategory('all');
                setSearchTerm('');
              }}
            />
          </motion.div>
        )}

        {/* Liste des fournisseurs */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pays
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Achats totaux
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      À payer
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSuppliers.map((supplier) => (
                    <motion.tr
                      key={supplier.id}
                      className="hover:bg-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                            <div className="text-sm text-gray-500">{supplier.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                        {formatCurrency(supplier.totalPurchases, currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span className={supplier.outstandingPayable > 0 ? 'text-amber-600' : 'text-green-600'}>
                          {formatCurrency(supplier.outstandingPayable, currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          supplier.status === 'actif'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {supplier.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          onClick={() => openSupplierDetails(supplier)}
                          className="text-blue-600 hover:text-blue-900 mr-3 bg-transparent p-0"
                        >
                          Détails
                        </Button>
                        <Button
                          onClick={() => alert(`Modifier ${supplier.name}`)}
                          className="text-gray-600 hover:text-gray-900 bg-transparent p-0"
                        >
                          Modifier
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <SupplierCards
              suppliers={paginatedSuppliers}
              onSupplierClick={openSupplierDetails}
            />
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mb-8 rounded-lg shadow">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredSuppliers.length)}
                  </span>{' '}
                  sur <span className="font-medium">{filteredSuppliers.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Précédent</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === index + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Suivant</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Modal de détails du fournisseur */}
        {isModalOpen && selectedSupplier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-900">{selectedSupplier.name}</CardTitle>
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 bg-transparent p-1 h-auto"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-medium text-gray-900">Informations de contact</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Email:</span> {selectedSupplier.email}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Téléphone:</span> {selectedSupplier.phone}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Adresse:</span> {selectedSupplier.address}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Pays:</span> {selectedSupplier.country}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Catégorie:</span> {selectedSupplier.category}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-medium text-gray-900">Informations financières</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Achats totaux:</span>{' '}
                          <span className="text-blue-600">{formatCurrency(selectedSupplier.totalPurchases, currency)}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Montant à payer:</span>{' '}
                          <span className={selectedSupplier.outstandingPayable > 0 ? 'text-amber-600' : 'text-green-600'}>
                            {formatCurrency(selectedSupplier.outstandingPayable, currency)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Statut:</span>{' '}
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedSupplier.status === 'actif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedSupplier.status}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Dernière commande:</span>{' '}
                          {new Date(selectedSupplier.lastOrderDate).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Date de création:</span>{' '}
                          {new Date(selectedSupplier.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border-t border-gray-200 pt-6 flex justify-end space-x-4">
                    <Button
                      className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      onClick={() => alert('Fonctionnalité à implémenter : Voir les commandes')}
                    >
                      Voir les commandes
                    </Button>
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => alert(`Fonctionnalité à implémenter : Modifier ${selectedSupplier.name}`)}
                    >
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
