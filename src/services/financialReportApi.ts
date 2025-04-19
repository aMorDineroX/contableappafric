import { Transaction } from '../types/transaction';
import { TransactionAPI } from './api';

// Types pour les rapports financiers avancés
export interface BalanceSheetItem {
  id: string;
  name: string;
  amount: number;
  type: 'asset' | 'liability' | 'equity';
  category: string;
  subcategory?: string;
}

export interface IncomeStatementItem {
  id: string;
  name: string;
  amount: number;
  type: 'revenue' | 'expense' | 'tax' | 'other';
  category: string;
}

export interface BalanceSheet {
  date: string;
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface IncomeStatement {
  startDate: string;
  endDate: string;
  revenues: IncomeStatementItem[];
  expenses: IncomeStatementItem[];
  taxes: IncomeStatementItem[];
  totalRevenues: number;
  totalExpenses: number;
  totalTaxes: number;
  netIncome: number;
  grossProfit: number;
  operatingIncome: number;
}

// Fonction utilitaire pour simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Données fictives pour le bilan
const mockBalanceSheetData: BalanceSheetItem[] = [
  // Actifs
  { id: 'a1', name: 'Trésorerie', amount: 2500000, type: 'asset', category: 'current' },
  { id: 'a2', name: 'Comptes clients', amount: 1800000, type: 'asset', category: 'current' },
  { id: 'a3', name: 'Stocks', amount: 3200000, type: 'asset', category: 'current' },
  { id: 'a4', name: 'Autres actifs courants', amount: 750000, type: 'asset', category: 'current' },
  { id: 'a5', name: 'Immobilisations corporelles', amount: 5600000, type: 'asset', category: 'non-current' },
  { id: 'a6', name: 'Immobilisations incorporelles', amount: 1200000, type: 'asset', category: 'non-current' },
  { id: 'a7', name: 'Investissements à long terme', amount: 2800000, type: 'asset', category: 'non-current' },
  
  // Passifs
  { id: 'l1', name: 'Comptes fournisseurs', amount: 1350000, type: 'liability', category: 'current' },
  { id: 'l2', name: 'Dettes à court terme', amount: 900000, type: 'liability', category: 'current' },
  { id: 'l3', name: 'Charges à payer', amount: 650000, type: 'liability', category: 'current' },
  { id: 'l4', name: 'Emprunts à long terme', amount: 4200000, type: 'liability', category: 'non-current' },
  { id: 'l5', name: 'Autres passifs à long terme', amount: 1100000, type: 'liability', category: 'non-current' },
  
  // Capitaux propres
  { id: 'e1', name: 'Capital social', amount: 5000000, type: 'equity', category: 'equity' },
  { id: 'e2', name: 'Bénéfices non répartis', amount: 3650000, type: 'equity', category: 'equity' },
];

// Données fictives pour le compte de résultat
const mockIncomeStatementData: IncomeStatementItem[] = [
  // Revenus
  { id: 'r1', name: 'Ventes de produits', amount: 12500000, type: 'revenue', category: 'operating' },
  { id: 'r2', name: 'Prestations de services', amount: 8200000, type: 'revenue', category: 'operating' },
  { id: 'r3', name: 'Autres revenus', amount: 750000, type: 'revenue', category: 'non-operating' },
  
  // Dépenses
  { id: 'e1', name: 'Coût des marchandises vendues', amount: 9800000, type: 'expense', category: 'cost-of-sales' },
  { id: 'e2', name: 'Salaires et charges sociales', amount: 4200000, type: 'expense', category: 'operating' },
  { id: 'e3', name: 'Loyer et charges locatives', amount: 1800000, type: 'expense', category: 'operating' },
  { id: 'e4', name: 'Marketing et publicité', amount: 950000, type: 'expense', category: 'operating' },
  { id: 'e5', name: 'Fournitures et consommables', amount: 650000, type: 'expense', category: 'operating' },
  { id: 'e6', name: 'Amortissements', amount: 1200000, type: 'expense', category: 'operating' },
  { id: 'e7', name: 'Frais financiers', amount: 580000, type: 'expense', category: 'financial' },
  
  // Taxes
  { id: 't1', name: 'Impôt sur les sociétés', amount: 850000, type: 'tax', category: 'income-tax' },
  { id: 't2', name: 'Autres taxes', amount: 320000, type: 'tax', category: 'other-tax' },
];

// API pour les rapports financiers avancés
export const FinancialReportAPI = {
  // Récupérer le bilan
  getBalanceSheet: async (date: string): Promise<BalanceSheet> => {
    await delay(800);
    
    // Dans une application réelle, nous calculerions le bilan à partir des transactions
    // Pour cette démo, nous utilisons des données fictives
    const assets = mockBalanceSheetData.filter(item => item.type === 'asset');
    const liabilities = mockBalanceSheetData.filter(item => item.type === 'liability');
    const equity = mockBalanceSheetData.filter(item => item.type === 'equity');
    
    const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      date,
      assets,
      liabilities,
      equity,
      totalAssets,
      totalLiabilities,
      totalEquity
    };
  },
  
  // Récupérer le compte de résultat
  getIncomeStatement: async (startDate: string, endDate: string): Promise<IncomeStatement> => {
    await delay(800);
    
    // Dans une application réelle, nous calculerions le compte de résultat à partir des transactions
    // Pour cette démo, nous utilisons des données fictives
    const revenues = mockIncomeStatementData.filter(item => item.type === 'revenue');
    const expenses = mockIncomeStatementData.filter(item => item.type === 'expense');
    const taxes = mockIncomeStatementData.filter(item => item.type === 'tax');
    
    const totalRevenues = revenues.reduce((sum, item) => sum + item.amount, 0);
    const costOfSales = expenses
      .filter(item => item.category === 'cost-of-sales')
      .reduce((sum, item) => sum + item.amount, 0);
    const operatingExpenses = expenses
      .filter(item => item.category === 'operating')
      .reduce((sum, item) => sum + item.amount, 0);
    const financialExpenses = expenses
      .filter(item => item.category === 'financial')
      .reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalTaxes = taxes.reduce((sum, item) => sum + item.amount, 0);
    
    const grossProfit = totalRevenues - costOfSales;
    const operatingIncome = grossProfit - operatingExpenses;
    const netIncome = operatingIncome - financialExpenses - totalTaxes;
    
    return {
      startDate,
      endDate,
      revenues,
      expenses,
      taxes,
      totalRevenues,
      totalExpenses,
      totalTaxes,
      grossProfit,
      operatingIncome,
      netIncome
    };
  },
  
  // Récupérer les données pour le bilan à partir des transactions réelles
  calculateBalanceSheetFromTransactions: async (date: string): Promise<BalanceSheet> => {
    try {
      // Récupérer toutes les transactions jusqu'à la date spécifiée
      const allTransactions = await TransactionAPI.getAll();
      const transactionsUntilDate = allTransactions.filter(
        t => new Date(t.date) <= new Date(date)
      );
      
      // Calculer les actifs
      const cashAndEquivalents = transactionsUntilDate
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0) - 
        transactionsUntilDate
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Pour une application réelle, nous aurions besoin de plus de logique pour calculer
      // les autres éléments du bilan à partir des transactions
      
      // Pour cette démo, nous complétons avec des données fictives
      const assets: BalanceSheetItem[] = [
        { id: 'a1', name: 'Trésorerie et équivalents', amount: cashAndEquivalents, type: 'asset', category: 'current' },
        ...mockBalanceSheetData.filter(item => item.type === 'asset' && item.id !== 'a1')
      ];
      
      const liabilities = mockBalanceSheetData.filter(item => item.type === 'liability');
      const equity = mockBalanceSheetData.filter(item => item.type === 'equity');
      
      const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
      const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
      const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);
      
      return {
        date,
        assets,
        liabilities,
        equity,
        totalAssets,
        totalLiabilities,
        totalEquity
      };
    } catch (error) {
      console.error('Erreur lors du calcul du bilan:', error);
      throw error;
    }
  },
  
  // Récupérer les données pour le compte de résultat à partir des transactions réelles
  calculateIncomeStatementFromTransactions: async (startDate: string, endDate: string): Promise<IncomeStatement> => {
    try {
      // Récupérer toutes les transactions dans la période spécifiée
      const allTransactions = await TransactionAPI.getAll();
      const transactionsInPeriod = allTransactions.filter(
        t => new Date(t.date) >= new Date(startDate) && new Date(t.date) <= new Date(endDate)
      );
      
      // Calculer les revenus
      const revenueTransactions = transactionsInPeriod.filter(t => t.type === 'INCOME');
      const revenuesByCategory = revenueTransactions.reduce((acc, t) => {
        const category = t.category?.name || 'Autres revenus';
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += t.amount;
        return acc;
      }, {} as Record<string, number>);
      
      const revenues: IncomeStatementItem[] = Object.entries(revenuesByCategory).map(([name, amount], index) => ({
        id: `r${index + 1}`,
        name,
        amount,
        type: 'revenue',
        category: 'operating'
      }));
      
      // Calculer les dépenses
      const expenseTransactions = transactionsInPeriod.filter(t => t.type === 'EXPENSE');
      const expensesByCategory = expenseTransactions.reduce((acc, t) => {
        const category = t.category?.name || 'Autres dépenses';
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += t.amount;
        return acc;
      }, {} as Record<string, number>);
      
      const expenses: IncomeStatementItem[] = Object.entries(expensesByCategory).map(([name, amount], index) => ({
        id: `e${index + 1}`,
        name,
        amount,
        type: 'expense',
        category: name.toLowerCase().includes('vente') ? 'cost-of-sales' : 'operating'
      }));
      
      // Pour une application réelle, nous aurions besoin de plus de logique pour calculer
      // les taxes et autres éléments du compte de résultat
      
      // Pour cette démo, nous utilisons des données fictives pour les taxes
      const taxes = mockIncomeStatementData.filter(item => item.type === 'tax');
      
      const totalRevenues = revenues.reduce((sum, item) => sum + item.amount, 0);
      const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
      const totalTaxes = taxes.reduce((sum, item) => sum + item.amount, 0);
      
      const costOfSales = expenses
        .filter(item => item.category === 'cost-of-sales')
        .reduce((sum, item) => sum + item.amount, 0);
      const operatingExpenses = expenses
        .filter(item => item.category === 'operating')
        .reduce((sum, item) => sum + item.amount, 0);
      
      const grossProfit = totalRevenues - costOfSales;
      const operatingIncome = grossProfit - operatingExpenses;
      const netIncome = totalRevenues - totalExpenses - totalTaxes;
      
      return {
        startDate,
        endDate,
        revenues,
        expenses,
        taxes,
        totalRevenues,
        totalExpenses,
        totalTaxes,
        grossProfit,
        operatingIncome,
        netIncome
      };
    } catch (error) {
      console.error('Erreur lors du calcul du compte de résultat:', error);
      throw error;
    }
  }
};
