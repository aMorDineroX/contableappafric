import { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '../utils/currencies';
import { useCurrency } from '../contexts/CurrencyContext';
import { Supplier, SupplierFormData, SupplierFilters, SupplierStatus } from '../types/supplier';
import { SupplierAPI } from '../services/supplierApi';
import SupplierForm from '../components/suppliers/SupplierForm';
import SupplierDetails from '../components/suppliers/SupplierDetails';
import { exportToPDF, exportToExcel, prepareSuppliersExportData } from '../utils/export';

const SupplierPage = () => {
  const { currency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filtres
  const [filters, setFilters] = useState<SupplierFilters>({
    status: 'all',
    country: '',
    category: 'all',
    hasOutstandingPayable: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Charger les fournisseurs
  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SupplierAPI.getAll();
      setSuppliers(data);
    } catch (err) {
      setError('Erreur lors du chargement des fournisseurs. Veuillez réessayer.');
      console.error('Erreur lors du chargement des fournisseurs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Statistiques
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'actif').length;
  const totalPayable = suppliers.reduce((sum, s) => sum + s.outstandingPayable, 0);
  const totalPurchases = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0);
  const categories = ['all', ...new Set(suppliers.map(s => s.category))];
  const countries = ['', ...new Set(suppliers.map(s => s.country))];

  // Filtrage des fournisseurs
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = searchTerm === '' ||
                         supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'all' || supplier.category === filters.category;
    const matchesStatus = filters.status === 'all' || supplier.status === filters.status;
    const matchesCountry = filters.country === '' || supplier.country === filters.country;
    const matchesPayable = filters.hasOutstandingPayable === 'all' ||
                          (filters.hasOutstandingPayable === true && supplier.outstandingPayable > 0) ||
                          (filters.hasOutstandingPayable === false && supplier.outstandingPayable === 0);

    return matchesSearch && matchesCategory && matchesStatus && matchesCountry && matchesPayable;
  }).sort((a, b) => {
    // Tri
    const sortField = filters.sortBy;
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    if (sortField === 'name') {
      return sortOrder * a.name.localeCompare(b.name);
    } else if (sortField === 'lastOrderDate') {
      return sortOrder * (new Date(a.lastOrderDate).getTime() - new Date(b.lastOrderDate).getTime());
    } else {
      // @ts-ignore - Nous savons que ces champs existent
      return sortOrder * (a[sortField] - b[sortField]);
    }
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
    setIsDetailsModalOpen(true);
  };

  // Ouvrir le modal d'ajout de fournisseur
  const openAddSupplierModal = () => {
    setEditingSupplier(null);
    setIsFormModalOpen(true);
  };

  // Ouvrir le modal de modification de fournisseur
  const openEditSupplierModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormModalOpen(true);
  };

  // Gérer la soumission du formulaire
  const handleSubmitSupplier = async (formData: SupplierFormData) => {
    setIsSubmitting(true);
    try {
      if (editingSupplier) {
        // Mise à jour d'un fournisseur existant
        await SupplierAPI.update(editingSupplier.id, formData);
      } else {
        // Création d'un nouveau fournisseur
        await SupplierAPI.create(formData);
      }
      // Recharger les fournisseurs après la création/mise à jour
      await fetchSuppliers();
      setIsFormModalOpen(false);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du fournisseur:', err);
      setError('Erreur lors de l\'enregistrement du fournisseur. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ajouter une note à un fournisseur
  const handleAddNote = async (content: string) => {
    if (!selectedSupplier) return;

    try {
      await SupplierAPI.addNote(selectedSupplier.id, content);
      // Recharger le fournisseur pour obtenir la note mise à jour
      const updatedSupplier = await SupplierAPI.getById(selectedSupplier.id);
      setSelectedSupplier(updatedSupplier);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la note:', err);
      setError('Erreur lors de l\'ajout de la note. Veuillez réessayer.');
    }
  };

  // Supprimer un fournisseur
  const handleDeleteSupplier = async (supplierId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible.')) {
      return;
    }

    try {
      await SupplierAPI.delete(supplierId);
      setIsDetailsModalOpen(false);
      await fetchSuppliers();
    } catch (err) {
      console.error('Erreur lors de la suppression du fournisseur:', err);
      setError('Erreur lors de la suppression du fournisseur. Veuillez réessayer.');
    }
  };

  // Mettre à jour les filtres
  const updateFilter = (key: keyof SupplierFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Réinitialiser la pagination lors du changement de filtre
  };

  // Exporter les fournisseurs en PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const exportData = prepareSuppliersExportData(filteredSuppliers, currency);
      exportToPDF(exportData);
    } catch (error) {
      console.error('Erreur lors de l\'exportation PDF:', error);
      setError('Erreur lors de l\'exportation PDF. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  // Exporter les fournisseurs en Excel
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const exportData = prepareSuppliersExportData(filteredSuppliers, currency);
      exportToExcel(exportData);
    } catch (error) {
      console.error('Erreur lors de l\'exportation Excel:', error);
      setError('Erreur lors de l\'exportation Excel. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Fermer</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}

        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fournisseurs</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting || isLoading || filteredSuppliers.length === 0}
              className={`bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors flex items-center gap-2 ${(isExporting || isLoading || filteredSuppliers.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exportation...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exporter PDF
                </>
              )}
            </button>
            <button
              onClick={handleExportExcel}
              disabled={isExporting || isLoading || filteredSuppliers.length === 0}
              className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 ${(isExporting || isLoading || filteredSuppliers.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exportation...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exporter Excel
                </>
              )}
            </button>
            <button
              onClick={openAddSupplierModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouveau fournisseur
            </button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total fournisseurs</h3>
            {isLoading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-2"></div>
            ) : (
              <>
                <p className="text-2xl font-bold text-blue-600">{totalSuppliers}</p>
                <p className="text-sm text-gray-500">{activeSuppliers} actifs</p>
              </>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">À payer</h3>
            {isLoading ? (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded mt-2"></div>
            ) : (
              <>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(totalPayable, currency)}
                </p>
                <p className="text-sm text-gray-500">Dettes fournisseurs</p>
              </>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Achats totaux</h3>
            {isLoading ? (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded mt-2"></div>
            ) : (
              <>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalPurchases, currency)}
                </p>
                <p className="text-sm text-gray-500">Tous fournisseurs</p>
              </>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Catégories</h3>
            {isLoading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-2"></div>
            ) : (
              <>
                <p className="text-2xl font-bold text-purple-600">{categories.length - 1}</p>
                <p className="text-sm text-gray-500">Types de fournisseurs</p>
              </>
            )}
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full md:w-1/3">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Rechercher
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nom, email ou téléphone"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Toutes les catégories' : category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/3">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="archivé">Archivé</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full md:w-1/3">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <select
                  id="country"
                  value={filters.country}
                  onChange={(e) => updateFilter('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les pays</option>
                  {countries.filter(c => c !== '').map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/3">
                <label htmlFor="payable" className="block text-sm font-medium text-gray-700 mb-1">
                  Solde à payer
                </label>
                <select
                  id="payable"
                  value={filters.hasOutstandingPayable === 'all' ? 'all' : filters.hasOutstandingPayable ? 'true' : 'false'}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateFilter('hasOutstandingPayable', value === 'all' ? 'all' : value === 'true');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les soldes</option>
                  <option value="true">Avec solde à payer</option>
                  <option value="false">Sans solde à payer</option>
                </select>
              </div>
              <div className="w-full md:w-1/3">
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Trier par
                </label>
                <div className="flex gap-2">
                  <select
                    id="sortBy"
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Nom</option>
                    <option value="lastOrderDate">Dernière commande</option>
                    <option value="totalPurchases">Total achats</option>
                    <option value="outstandingPayable">Montant à payer</option>
                  </select>
                  <button
                    onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title={filters.sortOrder === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'}
                  >
                    {filters.sortOrder === 'asc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
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
                {isLoading ? (
                  // État de chargement
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 bg-gray-200 rounded w-24 ml-auto"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 bg-gray-200 rounded w-24 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredSuppliers.length === 0 ? (
                  // Aucun résultat
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun fournisseur trouvé</h3>
                        <p className="text-gray-500 mb-4">Aucun fournisseur ne correspond à vos critères de recherche.</p>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setFilters({
                              status: 'all',
                              country: '',
                              category: 'all',
                              hasOutstandingPayable: 'all',
                              sortBy: 'name',
                              sortOrder: 'asc'
                            });
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Réinitialiser les filtres
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Liste des fournisseurs
                  paginatedSuppliers.map((supplier) => (
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
                            : supplier.status === 'inactif'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
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
                        <button
                          onClick={() => openEditSupplierModal(supplier)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && filteredSuppliers.length > 0 && totalPages > 1 && (
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

                  {/* Afficher un nombre limité de boutons de pagination */}
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    // Calculer le numéro de page à afficher
                    let pageNum;
                    if (totalPages <= 5) {
                      // Moins de 5 pages, afficher toutes les pages
                      pageNum = index + 1;
                    } else if (currentPage <= 3) {
                      // Proche du début, afficher les 5 premières pages
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Proche de la fin, afficher les 5 dernières pages
                      pageNum = totalPages - 4 + index;
                    } else {
                      // Au milieu, afficher 2 pages avant et 2 pages après la page courante
                      pageNum = currentPage - 2 + index;
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

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
        {isDetailsModalOpen && selectedSupplier && (
          <SupplierDetails
            supplier={selectedSupplier}
            onEdit={() => {
              setIsDetailsModalOpen(false);
              openEditSupplierModal(selectedSupplier);
            }}
            onClose={() => setIsDetailsModalOpen(false)}
            onAddNote={handleAddNote}
            onDelete={handleDeleteSupplier}
          />
        )}

        {/* Modal de formulaire (ajout/modification) */}
        {isFormModalOpen && (
          <SupplierForm
            initialData={editingSupplier ? {
              ...editingSupplier,
              notes: Array.isArray(editingSupplier.notes)
                ? editingSupplier.notes.map(note => note.content).join('\n')
                : editingSupplier.notes
            } : undefined}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitSupplier}
            onCancel={() => setIsFormModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SupplierPage;
