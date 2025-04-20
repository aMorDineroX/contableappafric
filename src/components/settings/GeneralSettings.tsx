import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GeneralSettings: React.FC = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<string>('fr');
  const [dateFormat, setDateFormat] = useState<string>('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState<string>('24h');
  const [theme, setTheme] = useState<string>('light');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Fonction pour sauvegarder les paramètres
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simuler une sauvegarde asynchrone
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres Généraux</h2>
      
      <div className="space-y-6">
        {/* Langue */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Langue</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Langue de l'interface
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </div>

        {/* Format de date et heure */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Format de date et heure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                Format de date
              </label>
              <select
                id="dateFormat"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-1">
                Format d'heure
              </label>
              <select
                id="timeFormat"
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">24h (14:30)</option>
                <option value="12h">12h (2:30 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Thème */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Thème</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTheme('light')}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Clair</span>
                {theme === 'light' && <i className="fas fa-check-circle text-blue-500"></i>}
              </div>
              <div className="h-20 bg-white border border-gray-200 rounded"></div>
            </div>
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTheme('dark')}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Sombre</span>
                {theme === 'dark' && <i className="fas fa-check-circle text-blue-500"></i>}
              </div>
              <div className="h-20 bg-gray-800 border border-gray-700 rounded"></div>
            </div>
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTheme('system')}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Système</span>
                {theme === 'system' && <i className="fas fa-check-circle text-blue-500"></i>}
              </div>
              <div className="h-20 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isSaving 
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>

        {/* Message de succès */}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            Paramètres enregistrés avec succès
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSettings;
