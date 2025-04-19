import React, { useState } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import CurrencySelector from '../components/CurrencySelector';
import BalanceSheet from '../components/reports/BalanceSheet';
import IncomeStatement from '../components/reports/IncomeStatement';
import { exportToPDF, exportToExcel } from '../utils/export';
import { FinancialReportAPI } from '../services/financialReportApi';

type ReportType = 'balance-sheet' | 'income-statement';

const AdvancedReports: React.FC = () => {
  const { currency } = useCurrency();
  const [reportType, setReportType] = useState<ReportType>('balance-sheet');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // État pour les dates
  const [balanceSheetDate, setBalanceSheetDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [incomeStatementDates, setIncomeStatementDates] = useState<{
    startDate: string;
    endDate: string;
  }>(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  });
  
  // Fonction pour exporter le bilan en PDF
  const handleExportBalanceSheetPDF = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const balanceSheet = await FinancialReportAPI.getBalanceSheet(balanceSheetDate);
      
      const exportData = {
        title: `Bilan au ${new Date(balanceSheetDate).toLocaleDateString('fr-FR')}`,
        filename: `bilan_${balanceSheetDate.replace(/-/g, '_')}`,
        sheetName: 'Bilan',
        headers: ['Compte', 'Montant', 'Catégorie'],
        rows: [
          // En-tête pour les actifs
          ['ACTIFS', '', ''],
          ...balanceSheet.assets.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL ACTIFS`, balanceSheet.totalAssets.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // En-tête pour les passifs
          ['', '', ''],
          ['PASSIFS', '', ''],
          ...balanceSheet.liabilities.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL PASSIFS`, balanceSheet.totalLiabilities.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // En-tête pour les capitaux propres
          ['', '', ''],
          ['CAPITAUX PROPRES', '', ''],
          ...balanceSheet.equity.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL CAPITAUX PROPRES`, balanceSheet.totalEquity.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // Équilibre du bilan
          ['', '', ''],
          ['ÉQUILIBRE DU BILAN', '', ''],
          ['Total Actifs', balanceSheet.totalAssets.toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Total Passifs + Capitaux Propres', (balanceSheet.totalLiabilities + balanceSheet.totalEquity).toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Différence', (balanceSheet.totalAssets - (balanceSheet.totalLiabilities + balanceSheet.totalEquity)).toLocaleString('fr-FR') + ' ' + currency, '']
        ]
      };
      
      exportToPDF(exportData);
    } catch (err) {
      console.error('Erreur lors de l\'exportation du bilan en PDF:', err);
      setError('Erreur lors de l\'exportation du bilan en PDF. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Fonction pour exporter le bilan en Excel
  const handleExportBalanceSheetExcel = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const balanceSheet = await FinancialReportAPI.getBalanceSheet(balanceSheetDate);
      
      const exportData = {
        title: `Bilan au ${new Date(balanceSheetDate).toLocaleDateString('fr-FR')}`,
        filename: `bilan_${balanceSheetDate.replace(/-/g, '_')}`,
        sheetName: 'Bilan',
        headers: ['Compte', 'Montant', 'Catégorie'],
        rows: [
          // En-tête pour les actifs
          ['ACTIFS', '', ''],
          ...balanceSheet.assets.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL ACTIFS`, balanceSheet.totalAssets.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // En-tête pour les passifs
          ['', '', ''],
          ['PASSIFS', '', ''],
          ...balanceSheet.liabilities.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL PASSIFS`, balanceSheet.totalLiabilities.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // En-tête pour les capitaux propres
          ['', '', ''],
          ['CAPITAUX PROPRES', '', ''],
          ...balanceSheet.equity.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL CAPITAUX PROPRES`, balanceSheet.totalEquity.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // Équilibre du bilan
          ['', '', ''],
          ['ÉQUILIBRE DU BILAN', '', ''],
          ['Total Actifs', balanceSheet.totalAssets.toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Total Passifs + Capitaux Propres', (balanceSheet.totalLiabilities + balanceSheet.totalEquity).toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Différence', (balanceSheet.totalAssets - (balanceSheet.totalLiabilities + balanceSheet.totalEquity)).toLocaleString('fr-FR') + ' ' + currency, '']
        ]
      };
      
      exportToExcel(exportData);
    } catch (err) {
      console.error('Erreur lors de l\'exportation du bilan en Excel:', err);
      setError('Erreur lors de l\'exportation du bilan en Excel. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Fonction pour exporter le compte de résultat en PDF
  const handleExportIncomeStatementPDF = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const incomeStatement = await FinancialReportAPI.getIncomeStatement(
        incomeStatementDates.startDate,
        incomeStatementDates.endDate
      );
      
      const exportData = {
        title: `Compte de Résultat du ${new Date(incomeStatementDates.startDate).toLocaleDateString('fr-FR')} au ${new Date(incomeStatementDates.endDate).toLocaleDateString('fr-FR')}`,
        filename: `compte_resultat_${incomeStatementDates.startDate.replace(/-/g, '_')}_${incomeStatementDates.endDate.replace(/-/g, '_')}`,
        sheetName: 'Compte de Résultat',
        headers: ['Compte', 'Montant', 'Catégorie'],
        rows: [
          // En-tête pour les revenus
          ['REVENUS', '', ''],
          ...incomeStatement.revenues.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL REVENUS`, incomeStatement.totalRevenues.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // En-tête pour les dépenses
          ['', '', ''],
          ['DÉPENSES', '', ''],
          ...incomeStatement.expenses.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL DÉPENSES`, incomeStatement.totalExpenses.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // En-tête pour les taxes
          ['', '', ''],
          ['TAXES', '', ''],
          ...incomeStatement.taxes.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL TAXES`, incomeStatement.totalTaxes.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // Résumé du compte de résultat
          ['', '', ''],
          ['RÉSUMÉ', '', ''],
          ['Revenus Totaux', incomeStatement.totalRevenues.toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Coût des Ventes', (incomeStatement.totalRevenues - incomeStatement.grossProfit).toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Marge Brute', incomeStatement.grossProfit.toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Dépenses d\'Exploitation', (incomeStatement.grossProfit - incomeStatement.operatingIncome).toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Résultat d\'Exploitation', incomeStatement.operatingIncome.toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Charges Financières', (incomeStatement.operatingIncome - incomeStatement.netIncome - incomeStatement.totalTaxes).toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Impôts et Taxes', incomeStatement.totalTaxes.toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Résultat Net', incomeStatement.netIncome.toLocaleString('fr-FR') + ' ' + currency, '']
        ]
      };
      
      exportToPDF(exportData);
    } catch (err) {
      console.error('Erreur lors de l\'exportation du compte de résultat en PDF:', err);
      setError('Erreur lors de l\'exportation du compte de résultat en PDF. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Fonction pour exporter le compte de résultat en Excel
  const handleExportIncomeStatementExcel = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const incomeStatement = await FinancialReportAPI.getIncomeStatement(
        incomeStatementDates.startDate,
        incomeStatementDates.endDate
      );
      
      const exportData = {
        title: `Compte de Résultat du ${new Date(incomeStatementDates.startDate).toLocaleDateString('fr-FR')} au ${new Date(incomeStatementDates.endDate).toLocaleDateString('fr-FR')}`,
        filename: `compte_resultat_${incomeStatementDates.startDate.replace(/-/g, '_')}_${incomeStatementDates.endDate.replace(/-/g, '_')}`,
        sheetName: 'Compte de Résultat',
        headers: ['Compte', 'Montant', 'Catégorie'],
        rows: [
          // En-tête pour les revenus
          ['REVENUS', '', ''],
          ...incomeStatement.revenues.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL REVENUS`, incomeStatement.totalRevenues.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // En-tête pour les dépenses
          ['', '', ''],
          ['DÉPENSES', '', ''],
          ...incomeStatement.expenses.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL DÉPENSES`, incomeStatement.totalExpenses.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // En-tête pour les taxes
          ['', '', ''],
          ['TAXES', '', ''],
          ...incomeStatement.taxes.map(item => [
            item.name,
            item.amount.toLocaleString('fr-FR') + ' ' + currency,
            item.category
          ]),
          [`TOTAL TAXES`, incomeStatement.totalTaxes.toLocaleString('fr-FR') + ' ' + currency, ''],
          
          // Résumé du compte de résultat
          ['', '', ''],
          ['RÉSUMÉ', '', ''],
          ['Revenus Totaux', incomeStatement.totalRevenues.toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Coût des Ventes', (incomeStatement.totalRevenues - incomeStatement.grossProfit).toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Marge Brute', incomeStatement.grossProfit.toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Dépenses d\'Exploitation', (incomeStatement.grossProfit - incomeStatement.operatingIncome).toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Résultat d\'Exploitation', incomeStatement.operatingIncome.toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Charges Financières', (incomeStatement.operatingIncome - incomeStatement.netIncome - incomeStatement.totalTaxes).toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Impôts et Taxes', incomeStatement.totalTaxes.toLocaleString('fr-FR') + ' ' + currency, ''],
          ['Résultat Net', incomeStatement.netIncome.toLocaleString('fr-FR') + ' ' + currency, '']
        ]
      };
      
      exportToExcel(exportData);
    } catch (err) {
      console.error('Erreur lors de l\'exportation du compte de résultat en Excel:', err);
      setError('Erreur lors de l\'exportation du compte de résultat en Excel. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Fonction pour définir une période prédéfinie pour le compte de résultat
  const setPresetPeriod = (period: 'month' | 'quarter' | 'year' | 'last-year') => {
    const today = new Date();
    let startDate: Date;
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    switch (period) {
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
        startDate = new Date(today.getFullYear(), quarterStartMonth, 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      case 'last-year':
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate.setFullYear(today.getFullYear() - 1);
        endDate.setMonth(11);
        endDate.setDate(31);
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    }
    
    setIncomeStatementDates({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Rapports Financiers Avancés</h1>
          <CurrencySelector
            selectedCurrency={currency}
            className="w-40"
          />
        </div>
        
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Sélection du type de rapport */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Type de Rapport</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setReportType('balance-sheet')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                reportType === 'balance-sheet'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Bilan
            </button>
            <button
              onClick={() => setReportType('income-statement')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                reportType === 'income-statement'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Compte de Résultat
            </button>
          </div>
        </div>
        
        {/* Paramètres du rapport */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Paramètres du Rapport</h2>
          
          {reportType === 'balance-sheet' ? (
            <div>
              <label htmlFor="balance-sheet-date" className="block text-sm font-medium text-gray-700 mb-1">
                Date du Bilan
              </label>
              <input
                type="date"
                id="balance-sheet-date"
                value={balanceSheetDate}
                onChange={(e) => setBalanceSheetDate(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div>
                  <label htmlFor="income-statement-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de Début
                  </label>
                  <input
                    type="date"
                    id="income-statement-start-date"
                    value={incomeStatementDates.startDate}
                    onChange={(e) => setIncomeStatementDates(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="income-statement-end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de Fin
                  </label>
                  <input
                    type="date"
                    id="income-statement-end-date"
                    value={incomeStatementDates.endDate}
                    onChange={(e) => setIncomeStatementDates(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Périodes Prédéfinies
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPresetPeriod('month')}
                    className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Mois en cours
                  </button>
                  <button
                    onClick={() => setPresetPeriod('quarter')}
                    className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Trimestre en cours
                  </button>
                  <button
                    onClick={() => setPresetPeriod('year')}
                    className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Année en cours
                  </button>
                  <button
                    onClick={() => setPresetPeriod('last-year')}
                    className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Année précédente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Contenu du rapport */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {reportType === 'balance-sheet' ? (
            <BalanceSheet
              date={balanceSheetDate}
              onExportPDF={handleExportBalanceSheetPDF}
              onExportExcel={handleExportBalanceSheetExcel}
            />
          ) : (
            <IncomeStatement
              startDate={incomeStatementDates.startDate}
              endDate={incomeStatementDates.endDate}
              onExportPDF={handleExportIncomeStatementPDF}
              onExportExcel={handleExportIncomeStatementExcel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedReports;
