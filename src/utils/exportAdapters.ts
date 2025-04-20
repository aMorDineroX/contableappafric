import { exportToPDF, exportToExcel, ExportData } from './export';

/**
 * Adapter pour convertir les données de rapport simple en format ExportData
 * @param simpleData Données simples avec titre, filename, sheetName, headers et rows
 * @returns Données au format ExportData
 */
export const adaptSimpleToExportData = (simpleData: {
  title: string;
  filename: string;
  sheetName: string;
  headers: string[];
  rows: string[][];
}): ExportData => {
  // Créer des objets à partir des données de lignes
  const data = simpleData.rows.map(row => {
    const obj: Record<string, string> = {};
    simpleData.headers.forEach((header, index) => {
      obj[`col${index}`] = row[index] || '';
    });
    return obj;
  });

  // Créer les colonnes
  const columns = simpleData.headers.map((header, index) => ({
    header,
    dataKey: `col${index}`
  }));

  return {
    title: simpleData.title,
    data,
    columns
  };
};

/**
 * Exporte les données simples au format PDF
 * @param simpleData Données simples
 */
export const exportSimpleToPDF = (simpleData: {
  title: string;
  filename: string;
  sheetName: string;
  headers: string[];
  rows: string[][];
}): void => {
  const exportData = adaptSimpleToExportData(simpleData);
  exportToPDF(exportData);
};

/**
 * Exporte les données simples au format Excel
 * @param simpleData Données simples
 */
export const exportSimpleToExcel = (simpleData: {
  title: string;
  filename: string;
  sheetName: string;
  headers: string[];
  rows: string[][];
}): void => {
  const exportData = adaptSimpleToExportData(simpleData);
  exportToExcel(exportData);
};
