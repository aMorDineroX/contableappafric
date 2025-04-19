import React, { useState, useEffect } from 'react';
import { PaymentStats as PaymentStatsType, PaymentFilters, MobilePaymentProvider, AfricanCountry } from '../../types/payment';
import { MobilePaymentAPI } from '../../services/mobilePaymentApi';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrement des composants Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Noms des fournisseurs de paiement
const providerNames: Record<MobilePaymentProvider, string> = {
  [MobilePaymentProvider.ORANGE_MONEY]: 'Orange Money',
  [MobilePaymentProvider.MTN_MOBILE_MONEY]: 'MTN Mobile Money',
  [MobilePaymentProvider.WAVE]: 'Wave',
  [MobilePaymentProvider.MPESA]: 'M-Pesa',
  [MobilePaymentProvider.MOOV_MONEY]: 'Moov Money',
  [MobilePaymentProvider.FREE_MONEY]: 'Free Money',
};

// Noms des pays
const countryNames: Record<AfricanCountry, string> = {
  [AfricanCountry.SENEGAL]: 'Sénégal',
  [AfricanCountry.COTE_DIVOIRE]: 'Côte d\'Ivoire',
  [AfricanCountry.CAMEROUN]: 'Cameroun',
  [AfricanCountry.MALI]: 'Mali',
  [AfricanCountry.BURKINA_FASO]: 'Burkina Faso',
  [AfricanCountry.BENIN]: 'Bénin',
  [AfricanCountry.TOGO]: 'Togo',
  [AfricanCountry.NIGER]: 'Niger',
  [AfricanCountry.GUINEE]: 'Guinée',
  [AfricanCountry.KENYA]: 'Kenya',
  [AfricanCountry.GHANA]: 'Ghana',
  [AfricanCountry.NIGERIA]: 'Nigeria',
};

// Couleurs pour les graphiques
const chartColors = [
  'rgba(255, 99, 132, 0.7)',
  'rgba(54, 162, 235, 0.7)',
  'rgba(255, 206, 86, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)',
  'rgba(255, 159, 64, 0.7)',
  'rgba(199, 199, 199, 0.7)',
  'rgba(83, 102, 255, 0.7)',
  'rgba(40, 159, 64, 0.7)',
  'rgba(210, 105, 30, 0.7)',
  'rgba(128, 0, 128, 0.7)',
  'rgba(0, 128, 128, 0.7)',
];

interface PaymentStatsProps {
  filters?: PaymentFilters;
  className?: string;
}

const PaymentStatsComponent: React.FC<PaymentStatsProps> = ({
  filters,
  className = '',
}) => {
  const { currency } = useCurrency();
  const [stats, setStats] = useState<PaymentStatsType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'countries'>('overview');

  // Charger les statistiques
  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await MobilePaymentAPI.getPaymentStats(filters);
      setStats(data);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Impossible de charger les statistiques. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les statistiques au chargement du composant et lorsque les filtres changent
  useEffect(() => {
    fetchStats();
  }, [filters]);

  // Préparer les données pour le graphique des fournisseurs
  const prepareProviderChartData = () => {
    if (!stats) return null;

    const providers = Object.entries(stats.byProvider)
      .filter(([_, data]) => data.count > 0)
      .sort((a, b) => b[1].amount - a[1].amount);

    return {
      labels: providers.map(([provider]) => providerNames[provider as MobilePaymentProvider]),
      datasets: [
        {
          label: 'Montant',
          data: providers.map(([_, data]) => data.amount),
          backgroundColor: chartColors.slice(0, providers.length),
          borderColor: chartColors.slice(0, providers.length).map(color => color.replace('0.7', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  // Préparer les données pour le graphique des pays
  const prepareCountryChartData = () => {
    if (!stats) return null;

    const countries = Object.entries(stats.byCountry)
      .filter(([_, data]) => data.count > 0)
      .sort((a, b) => b[1].amount - a[1].amount);

    return {
      labels: countries.map(([country]) => countryNames[country as AfricanCountry]),
      datasets: [
        {
          label: 'Montant',
          data: countries.map(([_, data]) => data.amount),
          backgroundColor: chartColors.slice(0, countries.length),
          borderColor: chartColors.slice(0, countries.length).map(color => color.replace('0.7', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  // Options pour les graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value, currency)}`;
          }
        }
      }
    },
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 h-24"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded mt-6"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchStats}
              className="mt-2 text-sm text-red-700 underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`text-gray-500 ${className}`}>
        Aucune statistique disponible.
      </div>
    );
  }

  const providerChartData = prepareProviderChartData();
  const countryChartData = prepareCountryChartData();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total des paiements</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
          <div className="mt-1 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.successfulPayments} réussis</span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-red-600 font-medium">{stats.failedPayments} échoués</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Montant total</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount, currency)}</p>
          <p className="mt-1 text-sm text-gray-500">
            Moyenne: {formatCurrency(stats.averageAmount, currency)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Paiements en attente</h3>
          <p className="text-2xl font-bold text-amber-600">{stats.pendingPayments}</p>
          <p className="mt-1 text-sm text-gray-500">
            {stats.pendingPayments > 0
              ? `${((stats.pendingPayments / stats.totalPayments) * 100).toFixed(1)}% du total`
              : 'Aucun paiement en attente'}
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Aperçu
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'providers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Par fournisseur
          </button>
          <button
            onClick={() => setActiveTab('countries')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'countries'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Par pays
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Aperçu des paiements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Répartition par statut</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Complétés</span>
                      <span className="text-sm font-medium text-green-600">
                        {stats.successfulPayments} ({((stats.successfulPayments / stats.totalPayments) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">En attente</span>
                      <span className="text-sm font-medium text-amber-600">
                        {stats.pendingPayments} ({((stats.pendingPayments / stats.totalPayments) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Échoués</span>
                      <span className="text-sm font-medium text-red-600">
                        {stats.failedPayments} ({((stats.failedPayments / stats.totalPayments) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Top 3 des fournisseurs</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {Object.entries(stats.byProvider)
                      .filter(([_, data]) => data.count > 0)
                      .sort((a, b) => b[1].amount - a[1].amount)
                      .slice(0, 3)
                      .map(([provider, data], index) => (
                        <div key={provider} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">
                            {index + 1}. {providerNames[provider as MobilePaymentProvider]}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(data.amount, currency)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'providers' && providerChartData && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Paiements par fournisseur</h3>
            <div className="h-80">
              <Pie data={providerChartData} options={chartOptions} />
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Détails par fournisseur</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fournisseur
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % du total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(stats.byProvider)
                      .filter(([_, data]) => data.count > 0)
                      .sort((a, b) => b[1].amount - a[1].amount)
                      .map(([provider, data]) => (
                        <tr key={provider}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {providerNames[provider as MobilePaymentProvider]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            {data.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {formatCurrency(data.amount, currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            {((data.amount / stats.totalAmount) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'countries' && countryChartData && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Paiements par pays</h3>
            <div className="h-80">
              <Bar
                data={countryChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value as number, currency);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Détails par pays</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pays
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % du total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(stats.byCountry)
                      .filter(([_, data]) => data.count > 0)
                      .sort((a, b) => b[1].amount - a[1].amount)
                      .map(([country, data]) => (
                        <tr key={country}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {countryNames[country as AfricanCountry]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            {data.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {formatCurrency(data.amount, currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            {((data.amount / stats.totalAmount) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatsComponent;
