import React, { useState, useRef } from 'react';
import { settingsService, AppSettings, SettingsProfile } from '../../services/settingsService';

interface BackupRestoreSettingsProps {
  onSettingsImported?: (settings: AppSettings) => void;
}

const BackupRestoreSettings: React.FC<BackupRestoreSettingsProps> = ({ onSettingsImported }) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour exporter les paramètres
  const handleExportSettings = () => {
    setIsExporting(true);
    
    try {
      const settingsJson = settingsService.exportSettings();
      
      // Créer un objet Blob pour le téléchargement
      const blob = new Blob([settingsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement et cliquer dessus
      const a = document.createElement('a');
      a.href = url;
      a.download = `contafricax-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'exportation des paramètres:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Fonction pour importer les paramètres
  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsImporting(true);
    setImportError(null);
    
    const file = event.target.files?.[0];
    if (!file) {
      setIsImporting(false);
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const settingsJson = e.target?.result as string;
        const success = settingsService.importSettings(settingsJson);
        
        if (success) {
          setImportSuccess(true);
          setTimeout(() => {
            setImportSuccess(false);
          }, 3000);
          
          // Notifier le composant parent que les paramètres ont été importés
          if (onSettingsImported) {
            const settings = settingsService.getSettings();
            if (settings) {
              onSettingsImported(settings);
            }
          }
        } else {
          setImportError('Erreur lors de l\'importation des paramètres');
        }
      } catch (error) {
        console.error('Erreur lors de l\'importation des paramètres:', error);
        setImportError('Format de fichier invalide');
      } finally {
        setIsImporting(false);
        // Réinitialiser l'input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      setImportError('Erreur lors de la lecture du fichier');
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };

  // Fonction pour réinitialiser les paramètres
  const handleResetSettings = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.')) {
      const success = settingsService.resetSettings();
      
      if (success) {
        alert('Paramètres réinitialisés avec succès. La page va être rechargée.');
        window.location.reload();
      } else {
        alert('Erreur lors de la réinitialisation des paramètres');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Sauvegarde et Restauration</h3>
      <p className="text-sm text-gray-600 mb-4">
        Exportez vos paramètres pour les sauvegarder ou importez des paramètres précédemment exportés.
      </p>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportSettings}
            disabled={isExporting}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              isExporting 
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isExporting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Exportation...
              </>
            ) : (
              <>
                <i className="fas fa-download mr-2"></i>
                Exporter les paramètres
              </>
            )}
          </button>
          
          <label
            htmlFor="import-settings"
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-center cursor-pointer ${
              isImporting 
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isImporting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Importation...
              </>
            ) : (
              <>
                <i className="fas fa-upload mr-2"></i>
                Importer des paramètres
              </>
            )}
            <input
              id="import-settings"
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImportSettings}
              disabled={isImporting}
              className="hidden"
            />
          </label>
        </div>
        
        <button
          onClick={handleResetSettings}
          className="w-full px-4 py-2 rounded-lg font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
        >
          <i className="fas fa-trash-alt mr-2"></i>
          Réinitialiser tous les paramètres
        </button>
      </div>
      
      {/* Messages de succès/erreur */}
      {exportSuccess && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
          <i className="fas fa-check-circle mr-2"></i>
          Paramètres exportés avec succès
        </div>
      )}
      
      {importSuccess && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
          <i className="fas fa-check-circle mr-2"></i>
          Paramètres importés avec succès
        </div>
      )}
      
      {importError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {importError}
        </div>
      )}
    </div>
  );
};

export default BackupRestoreSettings;
