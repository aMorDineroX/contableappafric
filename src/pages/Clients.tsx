import { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '../utils/currencies';
import { useCurrency } from '../contexts/CurrencyContext';
import { Client, ClientFormData, ClientFilters as ClientFiltersType } from '../types/client';
import { ClientAPI } from '../services/clientApi';

// Import des composants clients
import ClientTable from '../components/clients/ClientTable';
import ClientCards from '../components/clients/ClientCards';
import ClientFilters from '../components/clients/ClientFilters';
import ClientForm from '../components/clients/ClientForm';
import ClientDetails from '../components/clients/ClientDetails';

const Clients = () => {
  // Utiliser le contexte de devise global
  const { currency } = useCurrency();

  // États pour la recherche et la pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const itemsPerPage = 8;

  // États pour la gestion des données
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [filters, setFilters] = useState<ClientFiltersType>({
    status: 'all',
    country: '',
    hasOutstandingBalance: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les clients depuis l'API
  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ClientAPI.getAll();
      setClients(data);
    } catch (err) {
      setError('Erreur lors du chargement des clients. Veuillez réessayer.');
      console.error('Erreur lors du chargement des clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les clients au montage du composant
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filtrer les clients
  const filteredClients = clients.filter(client => {
    // Filtre de recherche
    const matchesSearch = !searchTerm ||
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.country.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre de statut
    const matchesStatus = filters.status === 'all' || client.status === filters.status;

    // Filtre de pays
    const matchesCountry = !filters.country ||
      client.country.toLowerCase() === filters.country.toLowerCase();

    // Filtre de solde impayé
    const matchesBalance = filters.hasOutstandingBalance === 'all' ||
      (filters.hasOutstandingBalance === true && client.outstandingBalance > 0) ||
      (filters.hasOutstandingBalance === false && client.outstandingBalance === 0);

    return matchesSearch && matchesStatus && matchesCountry && matchesBalance;
  }).sort((a, b) => {
    // Tri
    const sortField = filters.sortBy;
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    if (sortField === 'name') {
      return sortOrder * a.name.localeCompare(b.name);
    } else if (sortField === 'lastOrderDate') {
      return sortOrder * (new Date(a.lastOrderDate).getTime() - new Date(b.lastOrderDate).getTime());
    } else if (sortField === 'totalSales') {
      return sortOrder * (a.totalSales - b.totalSales);
    } else if (sortField === 'outstandingBalance') {
      return sortOrder * (a.outstandingBalance - b.outstandingBalance);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculer les statistiques
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'actif').length;
  const totalOutstanding = clients.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const totalSales = clients.reduce((sum, c) => sum + c.totalSales, 0);

  // Ouvrir le modal avec les détails du client
  const openClientDetails = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Ouvrir le formulaire pour créer un nouveau client
  const openNewClientForm = () => {
    setSelectedClient(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  // Ouvrir le formulaire pour éditer un client existant
  const openEditClientForm = (client: Client) => {
    setSelectedClient(client);
    setIsEditMode(true);
    setIsFormModalOpen(true);
    setIsModalOpen(false);
  };

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (formData: ClientFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && selectedClient) {
        await ClientAPI.update(selectedClient.id, formData);
      } else {
        await ClientAPI.create(formData);
      }
      fetchClients();
      setIsFormModalOpen(false);
    } catch (err) {
      setError(`Erreur lors de l'${isEditMode ? 'édition' : 'ajout'} du client. Veuillez réessayer.`);
      console.error(`Erreur lors de l'${isEditMode ? 'édition' : 'ajout'} du client:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la suppression d'un client
  const handleDeleteClient = async (clientId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      return;
    }

    try {
      await ClientAPI.delete(clientId);
      fetchClients();
      setIsModalOpen(false);
    } catch (err) {
      setError('Erreur lors de la suppression du client. Veuillez réessayer.');
      console.error('Erreur lors de la suppression du client:', err);
    }
  };

  // Gérer l'ajout d'une note
  const handleAddNote = async (content: string) => {
    if (!selectedClient) return;

    try {
      await ClientAPI.addNote(selectedClient.id, content);
      // Recharger les détails du client
      const updatedClient = await ClientAPI.getById(selectedClient.id);
      setSelectedClient(updatedClient);
    } catch (err) {
      setError('Erreur lors de l\'ajout de la note. Veuillez réessayer.');
      console.error('Erreur lors de l\'ajout de la note:', err);
    }
  };

  // Gérer le changement de filtres
  const handleFilterChange = (newFilters: ClientFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Réinitialiser la pagination
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      status: 'all',
      country: '',
      hasOutstandingBalance: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Nouveau client
          </button>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total clients</h3>
            <p className="text-2xl font-bold text-blue-600">{totalClients}</p>
            <p className="text-sm text-gray-500">{activeClients} actifs</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Soldes impayés</h3>
            <p className="text-2xl font-bold text-amber-600">
              {formatCurrency(totalOutstanding, currency)}
            </p>
            <p className="text-sm text-gray-500">À recouvrer</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Ventes totales</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(clientsData.reduce((sum, c) => sum + c.totalSales, 0), currency)}
            </p>
            <p className="text-sm text-gray-500">Tous clients confondus</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un client..."
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

        {/* Liste des clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {paginatedClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openClientDetails(client)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{client.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    client.status === 'actif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{client.email}</p>
                <p className="text-sm text-gray-500 mb-4">{client.country}</p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Solde impayé</span>
                    <span className={`font-medium ${
                      client.outstandingBalance > 0 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(client.outstandingBalance, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Ventes totales</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(client.totalSales, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
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
        )}

        {/* Modal de détails du client */}
        {isModalOpen && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
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
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de contact</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Email:</span> {selectedClient.email}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Téléphone:</span> {selectedClient.phone}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Adresse:</span> {selectedClient.address}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Pays:</span> {selectedClient.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations financières</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Ventes totales:</span>{' '}
                      <span className="text-blue-600">{formatCurrency(selectedClient.totalSales, currency)}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Solde impayé:</span>{' '}
                      <span className={selectedClient.outstandingBalance > 0 ? 'text-amber-600' : 'text-green-600'}>
                        {formatCurrency(selectedClient.outstandingBalance, currency)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Statut:</span>{' '}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedClient.status === 'actif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedClient.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Dernière commande:</span>{' '}
                      {new Date(selectedClient.lastOrderDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 flex justify-end space-x-4">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Voir les factures
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

export default Clients;
