import { useState } from 'react';
import { formatCurrency } from '../utils/currencies';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'revenu' | 'dépense';
  category: string;
  status: 'validé' | 'en_attente' | 'annulé';
}

const Transactions = () => {
  const [currency] = useState<'XOF' | 'XAF' | 'NGN'>('XOF');
  const [filter, setFilter] = useState<'all' | 'revenu' | 'dépense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Données fictives pour les transactions
  const transactionsData: Transaction[] = [
    { id: 1, date: '2023-12-01', description: 'Paiement fournisseur Alpha', amount: -250000, type: 'dépense', category: 'Fournisseurs', status: 'validé' },
    { id: 2, date: '2023-12-02', description: 'Facture client XYZ Corp', amount: 450000, type: 'revenu', category: 'Ventes', status: 'validé' },
    { id: 3, date: '2023-12-03', description: 'Frais bancaires', amount: -15000, type: 'dépense', category: 'Frais bancaires', status: 'validé' },
    { id: 4, date: '2023-12-04', description: 'Facture client ABC Ltd', amount: 380000, type: 'revenu', category: 'Ventes', status: 'validé' },
    { id: 5, date: '2023-12-05', description: 'Loyer bureau', amount: -180000, type: 'dépense', category: 'Loyer', status: 'validé' },
    { id: 6, date: '2023-12-06', description: 'Facture client Delta', amount: 275000, type: 'revenu', category: 'Ventes', status: 'en_attente' },
    { id: 7, date: '2023-12-07', description: 'Achat fournitures', amount: -45000, type: 'dépense', category: 'Fournitures', status: 'validé' },
    { id: 8, date: '2023-12-08', description: 'Facture client Gamma', amount: 520000, type: 'revenu', category: 'Ventes', status: 'validé' },
    { id: 9, date: '2023-12-09', description: 'Salaires employés', amount: -850000, type: 'dépense', category: 'Salaires', status: 'en_attente' },
    { id: 10, date: '2023-12-10', description: 'Facture client Omega', amount: 320000, type: 'revenu', category: 'Ventes', status: 'validé' },
    { id: 11, date: '2023-12-11', description: 'Maintenance équipement', amount: -75000, type: 'dépense', category: 'Maintenance', status: 'validé' },
    { id: 12, date: '2023-12-12', description: 'Facture client Epsilon', amount: 410000, type: 'revenu', category: 'Ventes', status: 'annulé' },
    { id: 13, date: '2023-12-13', description: 'Publicité en ligne', amount: -120000, type: 'dépense', category: 'Marketing', status: 'validé' },
    { id: 14, date: '2023-12-14', description: 'Facture client Zeta', amount: 290000, type: 'revenu', category: 'Ventes', status: 'validé' },
    { id: 15, date: '2023-12-15', description: 'Assurance professionnelle', amount: -95000, type: 'dépense', category: 'Assurance', status: 'validé' },
  ];

  // Filtrer les transactions
  const filteredTransactions = transactionsData
    .filter(transaction => {
      if (filter === 'all') return true;
      return transaction.type === filter;
    })
    .filter(transaction => {
      if (!searchTerm) return true;
      return (
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculer les totaux
  const totalRevenues = filteredTransactions
    .filter(t => t.type === 'revenu')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'dépense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const balance = totalRevenues - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Nouvelle transaction
          </button>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Revenus totaux</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenues, currency)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Dépenses totales</h3>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses, currency)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Balance</h3>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance, currency)}
            </p>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilter('revenu')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'revenu'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Revenus
                </button>
                <button
                  onClick={() => setFilter('dépense')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'dépense'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dépenses
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Tableau des transactions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(transaction.amount, currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'validé' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'en_attente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Modifier
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
                    </span>{' '}
                    sur <span className="font-medium">{filteredTransactions.length}</span> résultats
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
        </div>
      </div>
    </div>
  );
};

export default Transactions;
