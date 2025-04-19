import React, { useState, useEffect } from 'react';
import { IncomeStatement as IncomeStatementType, IncomeStatementItem, FinancialReportAPI } from '../../services/financialReportApi';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';

interface IncomeStatementProps {
  startDate: string;
  endDate: string;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

const IncomeStatement: React.FC<IncomeStatementProps> = ({ 
  startDate, 
  endDate, 
  onExportPDF, 
  onExportExcel 
}) => {
  const { currency } = useCurrency();
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatementType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncomeStatement = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await FinancialReportAPI.getIncomeStatement(startDate, endDate);
        setIncomeStatement(data);
      } catch (err) {
        console.error('Erreur lors du chargement du compte de résultat:', err);
        setError('Impossible de charger le compte de résultat. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncomeStatement();
  }, [startDate, endDate]);

  // Fonction pour afficher une section du compte de résultat
  const renderSection = (title: string, items: IncomeStatementItem[], total: number) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compte
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
            {items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(item.amount, currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {((item.amount / total) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                TOTAL {title.toUpperCase()}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700">
                {formatCurrency(total, currency)}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700">
                100%
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!incomeStatement) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Compte de Résultat du {new Date(startDate).toLocaleDateString('fr-FR')} au {new Date(endDate).toLocaleDateString('fr-FR')}
        </h2>
        <div className="flex space-x-2">
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter PDF
            </button>
          )}
          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter Excel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Revenus Totaux</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(incomeStatement.totalRevenues, currency)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Marge Brute</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(incomeStatement.grossProfit, currency)}
          </p>
          <p className="text-sm text-gray-500">
            {((incomeStatement.grossProfit / incomeStatement.totalRevenues) * 100).toFixed(1)}% des revenus
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Résultat d'Exploitation</h3>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(incomeStatement.operatingIncome, currency)}
          </p>
          <p className="text-sm text-gray-500">
            {((incomeStatement.operatingIncome / incomeStatement.totalRevenues) * 100).toFixed(1)}% des revenus
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Résultat Net</h3>
          <p className={`text-2xl font-bold ${incomeStatement.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(incomeStatement.netIncome, currency)}
          </p>
          <p className="text-sm text-gray-500">
            {((incomeStatement.netIncome / incomeStatement.totalRevenues) * 100).toFixed(1)}% des revenus
          </p>
        </div>
      </div>

      {/* Revenus */}
      {renderSection('Revenus', incomeStatement.revenues, incomeStatement.totalRevenues)}

      {/* Dépenses */}
      {renderSection('Dépenses', incomeStatement.expenses, incomeStatement.totalExpenses)}

      {/* Taxes */}
      {renderSection('Taxes', incomeStatement.taxes, incomeStatement.totalTaxes)}

      {/* Résumé du compte de résultat */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Résumé du Compte de Résultat</h3>
        <table className="min-w-full">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 text-sm font-medium text-gray-900">Revenus Totaux</td>
              <td className="py-3 text-sm text-right text-gray-900">{formatCurrency(incomeStatement.totalRevenues, currency)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 text-sm font-medium text-gray-900">Coût des Ventes</td>
              <td className="py-3 text-sm text-right text-red-600">
                {formatCurrency(incomeStatement.totalRevenues - incomeStatement.grossProfit, currency)}
              </td>
            </tr>
            <tr className="border-b border-gray-200 bg-gray-50">
              <td className="py-3 text-sm font-medium text-gray-900">Marge Brute</td>
              <td className="py-3 text-sm text-right font-medium text-blue-600">
                {formatCurrency(incomeStatement.grossProfit, currency)}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 text-sm font-medium text-gray-900">Dépenses d'Exploitation</td>
              <td className="py-3 text-sm text-right text-red-600">
                {formatCurrency(incomeStatement.grossProfit - incomeStatement.operatingIncome, currency)}
              </td>
            </tr>
            <tr className="border-b border-gray-200 bg-gray-50">
              <td className="py-3 text-sm font-medium text-gray-900">Résultat d'Exploitation</td>
              <td className="py-3 text-sm text-right font-medium text-purple-600">
                {formatCurrency(incomeStatement.operatingIncome, currency)}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 text-sm font-medium text-gray-900">Charges Financières</td>
              <td className="py-3 text-sm text-right text-red-600">
                {formatCurrency(incomeStatement.operatingIncome - incomeStatement.netIncome - incomeStatement.totalTaxes, currency)}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 text-sm font-medium text-gray-900">Impôts et Taxes</td>
              <td className="py-3 text-sm text-right text-red-600">
                {formatCurrency(incomeStatement.totalTaxes, currency)}
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="py-4 text-base font-bold text-gray-900">Résultat Net</td>
              <td className={`py-4 text-base text-right font-bold ${incomeStatement.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(incomeStatement.netIncome, currency)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeStatement;
