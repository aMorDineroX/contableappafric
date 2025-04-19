import { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '../utils/currencies';
import { useCurrency } from '../contexts/CurrencyContext';
import { Client, ClientFormData, ClientFilters, ClientStatus } from '../types/client';
import { ClientAPI } from '../services/clientApi';

// Import des composants clients
import ClientTable from '../components/clients/ClientTable';
import ClientCards from '../components/clients/ClientCards';
import ClientForm from '../components/clients/ClientForm';
import ClientDetails from '../components/clients/ClientDetails';
import ClientBatchActions from '../components/clients/ClientBatchActions';

// Import des icônes SVG en ligne
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const UserGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

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
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<ClientFilters>({
    status: 'all',
    country: '',
    hasOutstandingBalance: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour la sélection et les opérations par lot
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);

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

  // Gérer la sélection d'un onglet
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Appliquer les filtres en fonction de l'onglet sélectionné
    if (tab === 'active') {
      setFilters({...filters, status: 'actif'});
    } else if (tab === 'inactive') {
      setFilters({...filters, status: 'inactif'});
    } else if (tab === 'outstanding') {
      setFilters({...filters, hasOutstandingBalance: true});
    } else if (tab === 'recent') {
      setFilters({...filters, sortBy: 'lastOrderDate', sortOrder: 'desc'});
    } else {
      setFilters({
        status: 'all',
        country: '',
        hasOutstandingBalance: 'all',
        sortBy: 'name',
        sortOrder: 'asc'
      });
    }

    setCurrentPage(1);
  };

  // Exporter les clients en CSV
  const exportClientsToCSV = () => {
    // Entêtes CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nom,Email,Téléphone,Pays,Status,Total des ventes,Solde impayé,Date de dernière commande\n";

    // Ajouter les données
    filteredClients.forEach(client => {
      const row = [
        client.name,
        client.email,
        client.phone,
        client.country,
        client.status,
        formatCurrency(client.totalSales, currency),
        formatCurrency(client.outstandingBalance, currency),
        new Date(client.lastOrderDate).toLocaleDateString()
      ].join(",");
      csvContent += row + "\n";
    });

    // Créer le lien de téléchargement
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clients_contafricax.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Statistiques clients
  const clientStats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'actif').length,
    inactiveClients: clients.filter(c => c.status === 'inactif').length,
    totalSales: clients.reduce((sum, client) => sum + client.totalSales, 0),
    totalOutstanding: clients.reduce((sum, client) => sum + client.outstandingBalance, 0),
  };

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Gérer le clic sur un client
  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Ouvrir le formulaire d'édition
  const openClientForm = (client?: Client) => {
    if (client) {
      setSelectedClient(client);
      setIsEditMode(true);
    } else {
      setSelectedClient(null);
      setIsEditMode(false);
    }
    setIsFormModalOpen(true);
  };

  // Gérer la création ou mise à jour d'un client
  const handleSaveClient = async (formData: ClientFormData) => {
    setIsSubmitting(true);
    try {
      let updatedClient: Client;

      if (isEditMode && selectedClient) {
        // Mise à jour
        updatedClient = await ClientAPI.update(selectedClient.id, formData);

        // Mettre à jour le state local
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
      } else {
        // Création
        updatedClient = await ClientAPI.create(formData);

        // Ajouter au state local
        setClients([...clients, updatedClient]);
      }

      setIsFormModalOpen(false);
      setIsEditMode(false);
      setSelectedClient(null);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du client.');
      console.error('Erreur lors de l\'enregistrement du client:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer un client
  const handleDeleteClient = async (clientId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      return;
    }

    try {
      await ClientAPI.delete(clientId);
      setClients(clients.filter(c => c.id !== clientId));
      setIsModalOpen(false);
      setSelectedClient(null);

      // Si le client était sélectionné dans le mode de sélection, le retirer
      if (selectedClientIds.includes(clientId)) {
        setSelectedClientIds(selectedClientIds.filter(id => id !== clientId));
      }
    } catch (err) {
      setError('Erreur lors de la suppression du client.');
      console.error('Erreur lors de la suppression du client:', err);
    }
  };

  // Gérer la sélection d'un client
  const handleClientSelection = (clientId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedClientIds([...selectedClientIds, clientId]);
    } else {
      setSelectedClientIds(selectedClientIds.filter(id => id !== clientId));
    }
  };

  // Supprimer plusieurs clients
  const handleBatchDelete = async () => {
    try {
      // Supprimer chaque client sélectionné
      for (const clientId of selectedClientIds) {
        await ClientAPI.delete(clientId);
      }

      // Mettre à jour la liste des clients
      setClients(clients.filter(c => !selectedClientIds.includes(c.id)));

      // Réinitialiser la sélection
      setSelectedClientIds([]);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression des clients sélectionnés.');
      console.error('Erreur lors de la suppression des clients:', err);
    }
  };

  // Changer le statut de plusieurs clients
  const handleBatchStatusChange = async (status: ClientStatus) => {
    try {
      const updatedClients: Client[] = [];

      // Mettre à jour chaque client sélectionné
      for (const clientId of selectedClientIds) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
          const updatedClient = await ClientAPI.update(clientId, { status });
          updatedClients.push(updatedClient);
        }
      }

      // Mettre à jour la liste des clients
      setClients(clients.map(c => {
        const updated = updatedClients.find(u => u.id === c.id);
        return updated || c;
      }));

      // Réinitialiser la sélection
      setSelectedClientIds([]);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut des clients sélectionnés.');
      console.error('Erreur lors de la mise à jour du statut des clients:', err);
    }
  };

  // Activer/désactiver le mode de sélection
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedClientIds([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* En-tête de la page avec statistiques */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestion des clients</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => openClientForm()}
              className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <PlusIcon />
              Nouveau client
            </button>
            <button
              onClick={exportClientsToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <DownloadIcon />
              Exporter CSV
            </button>
            <button
              onClick={toggleSelectionMode}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectionMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {selectionMode ? 'Annuler la sélection' : 'Sélectionner'}
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total clients</p>
            <p className="text-2xl font-bold text-blue-800 flex items-center">
              <UserGroupIcon />
              <span className="ml-2">{clientStats.totalClients}</span>
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Clients actifs</p>
            <p className="text-2xl font-bold text-green-800">{clientStats.activeClients}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600">Clients inactifs</p>
            <p className="text-2xl font-bold text-yellow-800">{clientStats.inactiveClients}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Total des ventes</p>
            <p className="text-2xl font-bold text-purple-800">{formatCurrency(clientStats.totalSales, currency)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600">Total impayé</p>
            <p className="text-2xl font-bold text-red-800">{formatCurrency(clientStats.totalOutstanding, currency)}</p>
          </div>
        </div>
      </div>

      {/* Onglets et filtres */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Onglets */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-4 py-2 rounded-md ${activeTab === 'all'
                ? 'bg-white shadow-sm font-medium'
                : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Tous
            </button>
            <button
              onClick={() => handleTabChange('active')}
              className={`px-4 py-2 rounded-md ${activeTab === 'active'
                ? 'bg-white shadow-sm font-medium'
                : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Actifs
            </button>
            <button
              onClick={() => handleTabChange('inactive')}
              className={`px-4 py-2 rounded-md ${activeTab === 'inactive'
                ? 'bg-white shadow-sm font-medium'
                : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Inactifs
            </button>
            <button
              onClick={() => handleTabChange('outstanding')}
              className={`px-4 py-2 rounded-md ${activeTab === 'outstanding'
                ? 'bg-white shadow-sm font-medium'
                : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Impayés
            </button>
            <button
              onClick={() => handleTabChange('recent')}
              className={`px-4 py-2 rounded-md ${activeTab === 'recent'
                ? 'bg-white shadow-sm font-medium'
                : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Récents
            </button>
          </div>

          {/* Options de vue et filtres */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <button
              onClick={() => alert("Fonctionnalité de filtres avancés à implémenter")}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              title="Filtres avancés"
            >
              <FilterIcon />
            </button>

            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md ${viewMode === 'cards' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                title="Vue en cartes"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                title="Vue en tableau"
              >
                <TableIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Contenu principal - Liste des clients */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">Aucun client ne correspond à vos critères de recherche</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  status: 'all',
                  country: '',
                  hasOutstandingBalance: 'all',
                  sortBy: 'name',
                  sortOrder: 'asc'
                });
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          <ClientCards
            clients={paginatedClients}
            onClientClick={handleClientClick}
            selectedClientIds={selectedClientIds}
            onClientSelect={handleClientSelection}
            selectionMode={selectionMode}
          />
        ) : (
          <ClientTable
            clients={paginatedClients}
            onClientClick={handleClientClick}
            selectedClientIds={selectedClientIds}
            onClientSelect={handleClientSelection}
            selectionMode={selectionMode}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                Précédent
              </button>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                // Affiche au maximum 5 pages à la fois, centrées sur la page actuelle
                let pageToShow: number;
                if (totalPages <= 5) {
                  pageToShow = index + 1;
                } else if (currentPage <= 3) {
                  pageToShow = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + index;
                } else {
                  pageToShow = currentPage - 2 + index;
                }

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(pageToShow)}
                    className={`px-3 py-1 border-t border-b ${currentPage === pageToShow ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                  >
                    {pageToShow}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-r-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détail client - utilisation du composant existant */}
      {isModalOpen && selectedClient && (
        <ClientDetails
          client={selectedClient}
          onEdit={() => {
            setIsModalOpen(false);
            openClientForm(selectedClient);
          }}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDeleteClient}
          onAddNote={async (content: string) => {
            if (selectedClient) {
              try {
                const newNote = await ClientAPI.addNote(selectedClient.id, content);
                // Mettre à jour le client sélectionné avec la nouvelle note
                const updatedClient = {
                  ...selectedClient,
                  notes: [...(selectedClient.notes || []), newNote]
                };
                setSelectedClient(updatedClient);

                // Mettre à jour la liste des clients
                setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
                return Promise.resolve();
              } catch (err) {
                console.error('Erreur lors de l\'ajout de la note:', err);
                return Promise.reject(err);
              }
            }
            return Promise.reject('Aucun client sélectionné');
          }}
        />
      )}

      {/* Modal de formulaire client - utilisation du composant existant */}
      {isFormModalOpen && (
        <ClientForm
          initialData={isEditMode && selectedClient ? {
            name: selectedClient.name,
            email: selectedClient.email,
            phone: selectedClient.phone,
            address: selectedClient.address,
            city: selectedClient.city,
            postalCode: selectedClient.postalCode,
            country: selectedClient.country,
            taxId: selectedClient.taxId,
            website: selectedClient.website,
            status: selectedClient.status,
            notes: selectedClient.notes?.map(n => n.content).join('\n')
          } : undefined}
          isSubmitting={isSubmitting}
          onSubmit={handleSaveClient}
          onCancel={() => setIsFormModalOpen(false)}
        />
      )}

      {/* Actions par lot */}
      {selectionMode && (
        <ClientBatchActions
          selectedCount={selectedClientIds.length}
          onBatchDelete={handleBatchDelete}
          onBatchStatusChange={handleBatchStatusChange}
          onClearSelection={() => setSelectedClientIds([])}
        />
      )}
    </div>
  );
};

export default Clients;
