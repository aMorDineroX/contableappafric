import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency } from './currencies';
import type { Currency } from './currencies';

// Types pour les données d'exportation
interface ExportData {
  title: string;
  subtitle?: string;
  data: any[];
  columns: {
    header: string;
    dataKey: string;
    format?: (value: any) => string;
  }[];
}

/**
 * Exporte les données au format PDF
 * @param exportData Données à exporter
 */
export const exportToPDF = (exportData: ExportData): void => {
  const { title, subtitle, data, columns } = exportData;
  
  // Création du document PDF
  const doc = new jsPDF();
  
  // Ajout du titre
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Ajout du sous-titre si présent
  if (subtitle) {
    doc.setFontSize(12);
    doc.text(subtitle, 14, 30);
  }
  
  // Ajout de la date d'exportation
  const exportDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setFontSize(10);
  doc.text(`Exporté le ${exportDate}`, 14, subtitle ? 38 : 30);
  
  // Préparation des données pour le tableau
  const tableHeaders = columns.map(col => col.header);
  const tableData = data.map(item => 
    columns.map(col => {
      const value = item[col.dataKey];
      return col.format ? col.format(value) : value;
    })
  );
  
  // Ajout du tableau
  (doc as any).autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: subtitle ? 45 : 35,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });
  
  // Enregistrement du PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Exporte les données au format Excel
 * @param exportData Données à exporter
 */
export const exportToExcel = (exportData: ExportData): void => {
  const { title, data, columns } = exportData;
  
  // Préparation des données pour Excel
  const excelData = [
    columns.map(col => col.header), // En-têtes
    ...data.map(item => 
      columns.map(col => {
        const value = item[col.dataKey];
        return col.format ? col.format(value) : value;
      })
    )
  ];
  
  // Création du workbook et de la worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  
  // Ajout de la worksheet au workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Rapport');
  
  // Enregistrement du fichier Excel
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Prépare les données financières pour l'exportation
 * @param revenueData Données de revenus
 * @param expenseData Données de dépenses
 * @param profitData Données de profit
 * @param months Noms des mois
 * @param currency Devise
 */
export const prepareFinancialExportData = (
  revenueData: number[],
  expenseData: number[],
  profitData: number[],
  months: string[],
  currency: Currency
): ExportData => {
  const data = months.map((month, index) => ({
    month,
    revenue: revenueData[index],
    expense: expenseData[index],
    profit: profitData[index],
  }));
  
  return {
    title: 'Rapport Financier',
    subtitle: `Période: ${months[0]} - ${months[months.length - 1]}`,
    data,
    columns: [
      { header: 'Mois', dataKey: 'month' },
      { 
        header: 'Revenus', 
        dataKey: 'revenue',
        format: (value) => formatCurrency(value, currency)
      },
      { 
        header: 'Dépenses', 
        dataKey: 'expense',
        format: (value) => formatCurrency(value, currency)
      },
      { 
        header: 'Profit', 
        dataKey: 'profit',
        format: (value) => formatCurrency(value, currency)
      },
    ]
  };
};

/**
 * Prépare les données de ventes pour l'exportation
 * @param countrySalesData Données de ventes par pays
 * @param currency Devise
 */
export const prepareSalesExportData = (
  countrySalesData: Array<{ country: string; amount: number }>,
  currency: Currency
): ExportData => {
  const totalSales = countrySalesData.reduce((sum, item) => sum + item.amount, 0);
  
  const data = countrySalesData.map(item => ({
    country: item.country,
    amount: item.amount,
    percentage: (item.amount / totalSales * 100).toFixed(2) + '%'
  }));
  
  return {
    title: 'Rapport des Ventes par Pays',
    data,
    columns: [
      { header: 'Pays', dataKey: 'country' },
      { 
        header: 'Montant', 
        dataKey: 'amount',
        format: (value) => formatCurrency(value, currency)
      },
      { header: 'Pourcentage', dataKey: 'percentage' },
    ]
  };
};

/**
 * Prépare les données de dépenses pour l'exportation
 * @param expenseCategories Catégories de dépenses
 * @param expenseCategoryData Données de dépenses par catégorie (pourcentages)
 * @param totalExpenses Total des dépenses
 * @param currency Devise
 */
export const prepareExpensesExportData = (
  expenseCategories: string[],
  expenseCategoryData: number[],
  totalExpenses: number,
  currency: Currency
): ExportData => {
  const data = expenseCategories.map((category, index) => ({
    category,
    percentage: expenseCategoryData[index],
    amount: totalExpenses * expenseCategoryData[index] / 100
  }));
  
  return {
    title: 'Rapport des Dépenses par Catégorie',
    data,
    columns: [
      { header: 'Catégorie', dataKey: 'category' },
      { 
        header: 'Montant', 
        dataKey: 'amount',
        format: (value) => formatCurrency(value, currency)
      },
      { 
        header: 'Pourcentage', 
        dataKey: 'percentage',
        format: (value) => value + '%'
      },
    ]
  };
};

/**
 * Prépare les données de taxes pour l'exportation
 * @param taxData Données de taxes
 * @param currency Devise
 */
export const prepareTaxesExportData = (
  taxData: Array<{ type: string; amount: number }>,
  currency: Currency
): ExportData => {
  return {
    title: 'Rapport des Taxes',
    data: taxData,
    columns: [
      { header: 'Type de Taxe', dataKey: 'type' },
      { 
        header: 'Montant', 
        dataKey: 'amount',
        format: (value) => formatCurrency(value, currency)
      },
    ]
  };
};
