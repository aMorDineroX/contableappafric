import { useState } from 'react';
import { formatCurrency } from '../utils/currencies';
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

const Reports = () => {
  const [currency] = useState<'XOF' | 'XAF' | 'NGN'>('XOF');
  const [reportType, setReportType] = useState<'financial' | 'sales' | 'expenses' | 'taxes'>('financial');
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

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

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution financière</h3>
              <div className="h-80">
                <Line data={lineChartData} options={chartOptions} />
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

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des ventes</h3>
              <div className="h-80">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>

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
                        <tr key={index}>
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

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Calendrier fiscal</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-blue-900">Déclaration TVA mensuelle</h4>
                    <p className="text-sm text-blue-700">À soumettre avant le 15 de chaque mois</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-purple-900">Acomptes IS trimestriels</h4>
                    <p className="text-sm text-purple-700">15 mars, 15 juin, 15 septembre, 15 décembre</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-green-900">Déclaration annuelle IS</h4>
                    <p className="text-sm text-green-700">À soumettre avant le 30 avril</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Exporter PDF
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Exporter Excel
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setReportType('financial')}
                  className={`px-4 py-2 rounded-md ${
                    reportType === 'financial'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Financier
                </button>
                <button
                  onClick={() => setReportType('sales')}
                  className={`px-4 py-2 rounded-md ${
                    reportType === 'sales'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ventes
                </button>
                <button
                  onClick={() => setReportType('expenses')}
                  className={`px-4 py-2 rounded-md ${
                    reportType === 'expenses'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dépenses
                </button>
                <button
                  onClick={() => setReportType('taxes')}
                  className={`px-4 py-2 rounded-md ${
                    reportType === 'taxes'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Taxes
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPeriod('month')}
                  className={`px-4 py-2 rounded-md ${
                    period === 'month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setPeriod('quarter')}
                  className={`px-4 py-2 rounded-md ${
                    period === 'quarter'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Trimestriel
                </button>
                <button
                  onClick={() => setPeriod('year')}
                  className={`px-4 py-2 rounded-md ${
                    period === 'year'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Annuel
                </button>
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
