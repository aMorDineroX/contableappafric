import { useState, useEffect } from 'react';
import { formatCurrency, Currency } from '../utils/currencies';
import { useCurrency } from '../contexts/CurrencyContext';
import { exportToPDF, exportToExcel, prepareFinancialExportData, prepareSalesExportData, prepareExpensesExportData, prepareTaxesExportData } from '../utils/export';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import CurrencySelector from '../components/CurrencySelector';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Types pour les plages de dates
type DateRange = {
  startDate: Date;
  endDate: Date;
  label: string;
};

type ChartViewType = 'chart' | 'table' | 'both';

const Reports = () => {
  // Utiliser le contexte de devise global
  const { currency, setCurrency } = useCurrency();
  const [reportType, setReportType] = useState<'financial' | 'sales' | 'expenses' | 'taxes'>('financial');
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [viewType, setViewType] = useState<ChartViewType>('chart');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showYearComparison, setShowYearComparison] = useState<boolean>(false);

  // État pour la plage de dates
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      startDate,
      endDate,
      label: 'Derniers 12 mois'
    };
  });

  // Données fictives pour les rapports
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const currentMonth = new Date().getMonth();

  // Données pour les 12 derniers mois
  const revenueData = [
    450000, 520000, 480000, 600000, 550000, 630000,
    700000, 680000, 750000, 820000, 780000, 850000
  ];

  const expenseData = [
    320000, 350000, 330000, 380000, 360000, 400000,
    420000, 410000, 450000, 470000, 460000, 490000
  ];

  // Calculer le profit
  const profitData = revenueData.map((revenue, index) => revenue - expenseData[index]);

  // Données pour les catégories de dépenses
  const expenseCategories = ['Salaires', 'Loyer', 'Marketing', 'Équipement', 'Services', 'Autres'];
  const expenseCategoryData = [45, 15, 10, 12, 8, 10]; // en pourcentage

  // Données pour les ventes par pays
  const countrySalesData = [
    { country: 'Sénégal', amount: 2500000 },
    { country: 'Côte d\'Ivoire', amount: 1800000 },
    { country: 'Mali', amount: 1200000 },
    { country: 'Burkina Faso', amount: 950000 },
    { country: 'Guinée', amount: 750000 },
    { country: 'Autres', amount: 1800000 }
  ];

  // Données pour les taxes
  const taxData = [
    { type: 'TVA Collectée', amount: 850000 },
    { type: 'TVA Déductible', amount: 520000 },
    { type: 'IS', amount: 320000 },
    { type: 'Taxes locales', amount: 180000 },
    { type: 'Autres taxes', amount: 130000 }
  ];

  // Configuration des graphiques
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Revenus',
        data: revenueData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Dépenses',
        data: expenseData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Profit',
        data: profitData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1,
      }
    ],
  };

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: 'Ventes',
        data: revenueData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      }
    ],
  };

  const pieChartData = {
    labels: expenseCategories,
    datasets: [
      {
        data: expenseCategoryData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options des graphiques
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution financière',
      },
    },
  };

  // Calculer les totaux
  const totalRevenue = revenueData.reduce((sum, value) => sum + value, 0);
  const totalExpenses = expenseData.reduce((sum, value) => sum + value, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = (totalProfit / totalRevenue) * 100;

  // Fonction pour générer le contenu du rapport en fonction du type sélectionné
  const renderReportContent = () => {
    // Si aucune donnée n'est disponible
    if (revenueData.length === 0 || expenseData.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée disponible</h3>
          <p className="text-gray-500 mb-4">Il n'y a pas de données disponibles pour la période sélectionnée.</p>
          <button
            onClick={() => setPresetDateRange('last12months')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Voir les 12 derniers mois
          </button>
        </div>
      );
    }

    switch (reportType) {
      case 'financial':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Revenus totaux</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue, currency)}
                </p>
                <p className="text-sm text-gray-500">12 derniers mois</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Dépenses totales</h3>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpenses, currency)}
                </p>
                <p className="text-sm text-gray-500">12 derniers mois</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Profit net</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalProfit, currency)}
                </p>
                <p className="text-sm text-gray-500">Marge: {profitMargin.toFixed(2)}%</p>
              </div>
            </div>

            {(viewType === 'chart' || viewType === 'both') && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution financière</h3>
                <div className="h-80">
                  <Line data={lineChartData} options={chartOptions} />
                </div>
              </div>
            )}

            {(viewType === 'table' || viewType === 'both') && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Données financières mensuelles</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dépenses</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge (%)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {months.map((month, index) => {
                        const revenue = revenueData[index];
                        const expense = expenseData[index];
                        const profit = profitData[index];
                        const margin = (profit / revenue * 100).toFixed(1);
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(revenue, currency)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(expense, currency)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(profit, currency)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{margin}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">TOTAL</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700">{formatCurrency(totalRevenue, currency)}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700">{formatCurrency(totalExpenses, currency)}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700">{formatCurrency(totalProfit, currency)}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700">{profitMargin.toFixed(1)}%</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des dépenses</h3>
                <div className="h-64">
                  <Pie data={pieChartData} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ventes par pays</h3>
                <div className="space-y-4">
                  {countrySalesData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-32 text-sm text-gray-600">{item.country}</div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${(item.amount / countrySalesData[0].amount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-32 text-right text-sm font-medium text-gray-900">
                        {formatCurrency(item.amount, currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'sales':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Ventes totales</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue, currency)}
                </p>
                <p className="text-sm text-gray-500">12 derniers mois</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Moyenne mensuelle</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalRevenue / 12, currency)}
                </p>
                <p className="text-sm text-gray-500">Par mois</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Croissance</h3>
                <p className="text-2xl font-bold text-purple-600">
                  +{((revenueData[11] - revenueData[0]) / revenueData[0] * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Sur 12 mois</p>
              </div>
            </div>

            {(viewType === 'chart' || viewType === 'both') && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des ventes</h3>
                <div className="h-80">
                  <Bar data={barChartData} options={chartOptions} />
                </div>
              </div>
            )}

            {(viewType === 'table' || viewType === 'both') && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Données de ventes mensuelles</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ventes</th>
                        {showYearComparison && (
                          <>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Année précédente</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Variation (%)</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {months.map((month, index) => {
                        const sales = revenueData[index];
                        // Simulation de données de l'année précédente (80-120% des ventes actuelles)
                        const lastYearSales = Math.round(sales * (0.8 + Math.random() * 0.4));
                        const variation = ((sales - lastYearSales) / lastYearSales * 100).toFixed(1);
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(sales, currency)}</td>
                            {showYearComparison && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(lastYearSales, currency)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                  <span className={parseFloat(variation) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {parseFloat(variation) >= 0 ? '+' : ''}{variation}%
                                  </span>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">TOTAL</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700">{formatCurrency(totalRevenue, currency)}</th>
                        {showYearComparison && (
                          <>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700">{formatCurrency(totalRevenue * 0.9, currency)}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700">+10.0%</th>
                          </>
                        )}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ventes par pays</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pays
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
                    {countrySalesData.map((item, index) => {
                      const percentage = (item.amount / countrySalesData.reduce((sum, i) => sum + i.amount, 0) * 100).toFixed(1);
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.country}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {formatCurrency(item.amount, currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'expenses':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Dépenses totales</h3>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpenses, currency)}
                </p>
                <p className="text-sm text-gray-500">12 derniers mois</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Moyenne mensuelle</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(totalExpenses / 12, currency)}
                </p>
                <p className="text-sm text-gray-500">Par mois</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Ratio dépenses/revenus</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {((totalExpenses / totalRevenue) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Des revenus</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des dépenses</h3>
                <div className="h-64">
                  <Pie data={pieChartData} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Détail des catégories</h3>
                <div className="space-y-4">
                  {expenseCategories.map((category, index) => {
                    const amount = (totalExpenses * expenseCategoryData[index] / 100);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">{category}</div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(amount, currency)}
                          <span className="ml-2 text-gray-500">({expenseCategoryData[index]}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {(viewType === 'chart' || viewType === 'both') && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des dépenses</h3>
                <div className="h-80">
                  <Line
                    data={{
                      labels: months,
                      datasets: [{
                        label: 'Dépenses',
                        data: expenseData,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        tension: 0.1,
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            )}

            {(viewType === 'table' || viewType === 'both') && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tendances des dépenses</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dépenses</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% du total</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tendance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {months.map((month, index) => {
                        const expense = expenseData[index];
                        const percentage = (expense / totalExpenses * 100).toFixed(1);
                        // Calculer la tendance par rapport au mois précédent
                        let trend = 0;
                        if (index > 0) {
                          trend = ((expense - expenseData[index - 1]) / expenseData[index - 1]) * 100;
                        }
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(expense, currency)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{percentage}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              {index > 0 && (
                                <span className={trend > 0 ? 'text-red-600' : trend < 0 ? 'text-green-600' : 'text-gray-500'}>
                                  {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend).toFixed(1)}%
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'taxes':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Total des taxes</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(taxData.reduce((sum, tax) => sum + tax.amount, 0), currency)}
                </p>
                <p className="text-sm text-gray-500">12 derniers mois</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">TVA nette</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(taxData[0].amount - taxData[1].amount, currency)}
                </p>
                <p className="text-sm text-gray-500">À payer</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Impôt sur les sociétés</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(taxData[2].amount, currency)}
                </p>
                <p className="text-sm text-gray-500">Estimé</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Détail des taxes</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type de taxe
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
                      {taxData.map((tax, index) => {
                        const totalTaxes = taxData.reduce((sum, t) => sum + t.amount, 0);
                        const percentage = (tax.amount / totalTaxes * 100).toFixed(1);
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {tax.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              {formatCurrency(tax.amount, currency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              {percentage}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {(viewType === 'chart' || viewType === 'both') && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des taxes</h3>
                  <div className="h-64">
                    <Pie
                      data={{
                        labels: taxData.map(tax => tax.type),
                        datasets: [{
                          data: taxData.map(tax => tax.amount),
                          backgroundColor: [
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                          ],
                          borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                          ],
                          borderWidth: 1,
                        }]
                      }}
                    />
                  </div>
                </div>
              )}

            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Calendrier fiscal</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ajouter un rappel
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Déclaration TVA mensuelle</h4>
                        <p className="text-sm text-blue-700">À soumettre avant le 15 de chaque mois</p>
                      </div>
                      <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">Mensuel</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-purple-900">Acomptes IS trimestriels</h4>
                        <p className="text-sm text-purple-700">15 mars, 15 juin, 15 septembre, 15 décembre</p>
                      </div>
                      <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full">Trimestriel</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Déclaration annuelle IS</h4>
                        <p className="text-sm text-green-700">À soumettre avant le 30 avril</p>
                      </div>
                      <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">Annuel</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-amber-50 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-amber-900">Déclaration sociale des indépendants (DSI)</h4>
                        <p className="text-sm text-amber-700">À soumettre avant le 1er juin</p>
                      </div>
                      <span className="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded-full">Annuel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Fonctions d'exportation
  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      let exportData;
      switch (reportType) {
        case 'financial':
          exportData = prepareFinancialExportData(revenueData, expenseData, profitData, months, currency);
          break;
        case 'sales':
          exportData = prepareSalesExportData(countrySalesData, currency);
          break;
        case 'expenses':
          exportData = prepareExpensesExportData(expenseCategories, expenseCategoryData, totalExpenses, currency);
          break;
        case 'taxes':
          exportData = prepareTaxesExportData(taxData, currency);
          break;
        default:
          throw new Error('Type de rapport non pris en charge');
      }
      exportToPDF(exportData);
    } catch (error) {
      console.error('Erreur lors de l\'exportation PDF:', error);
      // Ici, vous pourriez ajouter une notification d'erreur
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      let exportData;
      switch (reportType) {
        case 'financial':
          exportData = prepareFinancialExportData(revenueData, expenseData, profitData, months, currency);
          break;
        case 'sales':
          exportData = prepareSalesExportData(countrySalesData, currency);
          break;
        case 'expenses':
          exportData = prepareExpensesExportData(expenseCategories, expenseCategoryData, totalExpenses, currency);
          break;
        case 'taxes':
          exportData = prepareTaxesExportData(taxData, currency);
          break;
        default:
          throw new Error('Type de rapport non pris en charge');
      }
      exportToExcel(exportData);
    } catch (error) {
      console.error('Erreur lors de l\'exportation Excel:', error);
      // Ici, vous pourriez ajouter une notification d'erreur
    } finally {
      setIsExporting(false);
    }
  };

  // Fonction pour définir une plage de dates prédéfinie
  const setPresetDateRange = (preset: string) => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Fin du mois en cours
    let label: string;

    switch (preset) {
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        label = 'Mois en cours';
        break;
      case 'quarter':
        const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
        startDate = new Date(today.getFullYear(), quarterStartMonth, 1);
        label = 'Trimestre en cours';
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        label = 'Année en cours';
        break;
      case 'last12months':
      default:
        startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
        label = 'Derniers 12 mois';
        break;
    }

    setDateRange({ startDate, endDate, label });
  };

  // Mettre à jour la plage de dates lorsque la période change
  useEffect(() => {
    switch (period) {
      case 'month':
        setPresetDateRange('month');
        break;
      case 'quarter':
        setPresetDateRange('quarter');
        break;
      case 'year':
        setPresetDateRange('year');
        break;
    }
  }, [period]);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
          <div className="flex flex-wrap gap-2">
            <CurrencySelector
              selectedCurrency={currency}
              onCurrencyChange={setCurrency}
              className="w-40"
            />
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                  PDF
                </>
              )}
            </button>
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Excel
                </>
              )}
            </button>
            <button
              onClick={() => window.print()}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimer
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex flex-col space-y-6">
              {/* Type de rapport */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Type de rapport</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setReportType('financial')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                      reportType === 'financial'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Financier
                  </button>
                  <button
                    onClick={() => setReportType('sales')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                      reportType === 'sales'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Ventes
                  </button>
                  <button
                    onClick={() => setReportType('expenses')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                      reportType === 'expenses'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Dépenses
                  </button>
                  <button
                    onClick={() => setReportType('taxes')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                      reportType === 'taxes'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                    Taxes
                  </button>
                </div>
              </div>

              {/* Période et affichage */}
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Période</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setPeriod('month')}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        period === 'month'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Mensuel
                    </button>
                    <button
                      onClick={() => setPeriod('quarter')}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        period === 'quarter'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Trimestriel
                    </button>
                    <button
                      onClick={() => setPeriod('year')}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        period === 'year'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Annuel
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Affichage</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setViewType('chart')}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        viewType === 'chart'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Graphiques
                    </button>
                    <button
                      onClick={() => setViewType('table')}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        viewType === 'table'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Tableaux
                    </button>
                    <button
                      onClick={() => setViewType('both')}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        viewType === 'both'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Les deux
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Options</h3>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={showYearComparison}
                        onChange={() => setShowYearComparison(!showYearComparison)}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700">Comparaison année précédente</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Plage de dates */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Plage de dates: {dateRange.label}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Du</span>
                    <div className="relative">
                      <input
                        type="date"
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        value={dateRange.startDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          const newDate = new Date(e.target.value);
                          setDateRange(prev => ({
                            ...prev,
                            startDate: newDate,
                            label: 'Personnalisé'
                          }));
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">au</span>
                    <div className="relative">
                      <input
                        type="date"
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        value={dateRange.endDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          const newDate = new Date(e.target.value);
                          setDateRange(prev => ({
                            ...prev,
                            endDate: newDate,
                            label: 'Personnalisé'
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPresetDateRange('last12months')}
                      className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      12 derniers mois
                    </button>
                    <button
                      onClick={() => setPresetDateRange('year')}
                      className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Année en cours
                    </button>
                    <button
                      onClick={() => setPresetDateRange('quarter')}
                      className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Trimestre en cours
                    </button>
                    <button
                      onClick={() => setPresetDateRange('month')}
                      className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Mois en cours
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu du rapport */}
        {renderReportContent()}
      </div>
    </div>
  );
};

export default Reports;
