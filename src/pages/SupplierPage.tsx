import { useState } from 'react';
import { formatCurrency } from '../utils/currencies';
import { useCurrency } from '../contexts/CurrencyContext';

// Interface pour les fournisseurs
interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  category: string;
  totalPurchases: number;
  outstandingPayable: number;
  status: 'actif' | 'inactif';
  lastOrderDate: string;
}

const SupplierPage = () => {
  const { currency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Données fictives des fournisseurs
  const suppliers: Supplier[] = [
    {
      id: 1,
      name: 'Fournisseur A',
      email: 'contact@fournisseura.com',
      phone: '+221 77 123 45 67',
      address: '123 Rue Principale, Dakar',
      country: 'Sénégal',
      category: 'Matériel informatique',
      totalPurchases: 12500000,
      outstandingPayable: 2500000,
      status: 'actif',
      lastOrderDate: '2023-11-28',
    },
    {
      id: 2,
      name: 'Fournisseur B',
      email: 'info@fournisseurb.com',
      phone: '+221 78 234 56 78',
      address: '456 Avenue Centrale, Dakar',
      country: 'Sénégal',
      category: 'Fournitures de bureau',
      totalPurchases: 8750000,
      outstandingPayable: 1200000,
      status: 'actif',
      lastOrderDate: '2023-12-05',
    },
    {
      id: 3,
      name: 'Fournisseur C',
      email: 'service@fournisseurc.com',
      phone: '+225 01 345 67 89',
      address: '789 Boulevard Principal, Abidjan',
      country: 'Côte d\'Ivoire',
      category: 'Services informatiques',
      totalPurchases: 15000000,
      outstandingPayable: 0,
      status: 'actif',
      lastOrderDate: '2023-12-01',
    },
    {
      id: 4,
      name: 'Fournisseur D',
      email: 'contact@fournisseurd.com',
      phone: '+221 76 456 78 90',
      address: '101 Rue Commerciale, Thiès',
      country: 'Sénégal',
      category: 'Mobilier de bureau',
      totalPurchases: 6300000,
      outstandingPayable: 1800000,
      status: 'actif',
      lastOrderDate: '2023-11-15',
    },
    {
      id: 5,
      name: 'Fournisseur E',
      email: 'info@fournisseure.com',
      phone: '+237 6 567 89 01',
      address: '202 Avenue Centrale, Douala',
      country: 'Cameroun',
      category: 'Matériel informatique',
      totalPurchases: 9200000,
      outstandingPayable: 3500000,
      status: 'inactif',
      lastOrderDate: '2023-10-20',
    },
  ];

  // Statistiques
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'actif').length;
  const totalPayable = suppliers.reduce((sum, s) => sum + s.outstandingPayable, 0);
  const totalPurchases = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0);
  const categories = ['all', ...new Set(suppliers.map(s => s.category))];

  // Filtrage des fournisseurs
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || supplier.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Ouvrir le modal avec les détails du fournisseur
  const openSupplierDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fournisseurs</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Nouveau fournisseur
          </button>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total fournisseurs</h3>
            <p className="text-2xl font-bold text-blue-600">{totalSuppliers}</p>
            <p className="text-sm text-gray-500">{activeSuppliers} actifs</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">À payer</h3>
            <p className="text-2xl font-bold text-amber-600">
              {formatCurrency(totalPayable, currency)}
            </p>
            <p className="text-sm text-gray-500">Dettes fournisseurs</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Achats totaux</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPurchases, currency)}
            </p>
            <p className="text-sm text-gray-500">Tous fournisseurs</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Catégories</h3>
            <p className="text-2xl font-bold text-purple-600">{categories.length - 1}</p>
            <p className="text-sm text-gray-500">Types de fournisseurs</p>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-1/3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Rechercher
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom ou email du fournisseur"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-1/3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                id="category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Toutes les catégories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des fournisseurs */}
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
                  <tr key={supplier.id} className="hover:bg-gray-50">
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
                      <button 
                        onClick={() => openSupplierDetails(supplier)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Détails
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow mb-8">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSupplier.name}</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de contact</h3>
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
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations financières</h3>
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
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 flex justify-end space-x-4">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Voir les commandes
                  </button>
                  <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierPage;
