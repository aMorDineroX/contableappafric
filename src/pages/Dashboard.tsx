import { useState, useEffect } from 'react';
import { formatCurrency, Currency } from '../utils/currencies';
import CurrencySelector from '../components/CurrencySelector';
import { useCurrency } from '../contexts/CurrencyContext';
import type { ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Définition des types
type RevenueData = ChartData<'line'>;
type ExpenseData = ChartData<'doughnut'>;

const Dashboard = () => {
  // Utiliser le contexte de devise global
  const { currency, setCurrency } = useCurrency();
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>({} as Record<Currency, number>);

  // Simuler des taux de change
  useEffect(() => {
    // Dans une application réelle, ces taux seraient récupérés depuis une API
    const mockExchangeRates: Record<Currency, number> = {
      XOF: 1,
      XAF: 1.02,
      NGN: 0.13,
      GHS: 0.08,
      KES: 0.04,
      MAD: 0.09,
      ZAR: 0.03,
      USD: 0.0017,
      EUR: 0.0015,
      BTC: 0.00000004
    };

    setExchangeRates(mockExchangeRates);
  }, []);

  // Typage des données des graphiques
  const revenueData: RevenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Revenus',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Dépenses',
        data: [8000, 15000, 12000, 18000, 16000, 22000],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const expenseDistribution: ExpenseData = {
    labels: ['Salaires', 'Loyer', 'Marketing', 'Équipement', 'Services'],
    datasets: [
      {
        data: [35, 20, 15, 20, 10],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  const recentTransactions = [
    { id: 1, date: '2023-12-01', description: 'Paiement fournisseur', montant: -250000, type: 'dépense' },
    { id: 2, date: '2023-12-02', description: 'Facture client A', montant: 450000, type: 'revenu' },
    { id: 3, date: '2023-12-03', description: 'Frais bancaires', montant: -15000, type: 'dépense' },
    { id: 4, date: '2023-12-04', description: 'Facture client B', montant: 380000, type: 'revenu' },
  ];

  const tasks = [
    { id: 1, title: 'Rapprochement bancaire', dueDate: '2023-12-15', status: 'en_cours' },
    { id: 2, title: 'Déclaration TVA', dueDate: '2023-12-20', status: 'à_faire' },
    { id: 3, title: 'Bilan mensuel', dueDate: '2023-12-31', status: 'à_faire' },
    { id: 4, title: 'Facturation clients', dueDate: '2023-12-10', status: 'terminé' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Comptable</h1>
          <CurrencySelector
            selectedCurrency={currency}
            onCurrencyChange={setCurrency}
            className="w-64"
          />
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Revenus totaux</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(2850000, currency)}
            </p>
            <p className="text-sm text-gray-500">+12% par rapport au mois dernier</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Dépenses totales</h3>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(1950000, currency)}
            </p>
            <p className="text-sm text-gray-500">-5% par rapport au mois dernier</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Trésorerie</h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(900000, currency)}
            </p>
            <p className="text-sm text-gray-500">Solde actuel</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Créances clients</h3>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(750000, currency)}
            </p>
            <p className="text-sm text-gray-500">15 factures en attente</p>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Évolution Revenus/Dépenses</h3>
              <span className="text-sm text-gray-500">Devise: {currency}</span>
            </div>
            <Line data={revenueData} options={{ responsive: true }} />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Répartition des dépenses</h3>
              <span className="text-sm text-gray-500">Devise: {currency}</span>
            </div>
            <Doughnut data={expenseDistribution} options={{ responsive: true }} />
          </div>
        </div>

        {/* Transactions récentes et tâches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Transactions récentes</h3>
                <span className="text-sm text-gray-500">Devise: {currency}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                          transaction.montant >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(transaction.montant, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tâches à suivre</h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-500">Échéance : {task.dueDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'terminé' ? 'bg-green-100 text-green-800' :
                      task.status === 'en_cours' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
