import React, { useState } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Currency, CURRENCIES } from '../../utils/currencies';

const CurrencySettings: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const [primaryCurrency, setPrimaryCurrency] = useState<Currency>(currency);
  const [secondaryCurrencies, setSecondaryCurrencies] = useState<Currency[]>(['EUR', 'USD']);
  const [showAllCurrencies, setShowAllCurrencies] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Filtrer les devises africaines et internationales
  const africanCurrencies = Object.entries(CURRENCIES)
    .filter(([_, config]) => !config.isInternational && !config.isCrypto)
    .map(([code]) => code as Currency);

  const internationalCurrencies = Object.entries(CURRENCIES)
    .filter(([_, config]) => config.isInternational)
    .map(([code]) => code as Currency);

  const cryptoCurrencies = Object.entries(CURRENCIES)
    .filter(([_, config]) => config.isCrypto)
    .map(([code]) => code as Currency);

  // Fonction pour gérer la sélection/désélection des devises secondaires
  const toggleSecondaryCurrency = (currencyCode: Currency) => {
    if (secondaryCurrencies.includes(currencyCode)) {
      setSecondaryCurrencies(secondaryCurrencies.filter(c => c !== currencyCode));
    } else {
      setSecondaryCurrencies([...secondaryCurrencies, currencyCode]);
    }
  };

  // Fonction pour sauvegarder les paramètres
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Mettre à jour la devise principale dans le contexte
    setCurrency(primaryCurrency);
    
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres de Devise</h2>
      
      <div className="space-y-6">
        {/* Devise principale */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Devise principale</h3>
          <p className="text-sm text-gray-600 mb-4">
            Cette devise sera utilisée par défaut pour toutes les transactions et rapports.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="primaryCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                Sélectionnez votre devise principale
              </label>
              <select
                id="primaryCurrency"
                value={primaryCurrency}
                onChange={(e) => setPrimaryCurrency(e.target.value as Currency)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <optgroup label="Devises Africaines">
                  {africanCurrencies.map(code => (
                    <option key={code} value={code}>
                      {CURRENCIES[code].name} ({CURRENCIES[code].symbol})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Devises Internationales">
                  {internationalCurrencies.map(code => (
                    <option key={code} value={code}>
                      {CURRENCIES[code].name} ({CURRENCIES[code].symbol})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Devises secondaires */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Devises secondaires</h3>
          <p className="text-sm text-gray-600 mb-4">
            Ces devises seront disponibles pour la conversion et l'affichage alternatif.
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {africanCurrencies.map(code => (
                <button
                  key={code}
                  onClick={() => toggleSecondaryCurrency(code)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    secondaryCurrencies.includes(code)
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                  disabled={code === primaryCurrency}
                >
                  {CURRENCIES[code].symbol} {CURRENCIES[code].code}
                  {secondaryCurrencies.includes(code) && (
                    <i className="fas fa-check ml-1 text-blue-500"></i>
                  )}
                </button>
              ))}
            </div>
            
            <div>
              <button
                onClick={() => setShowAllCurrencies(!showAllCurrencies)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                {showAllCurrencies ? (
                  <>
                    <i className="fas fa-chevron-up mr-1"></i>
                    Masquer les devises internationales
                  </>
                ) : (
                  <>
                    <i className="fas fa-chevron-down mr-1"></i>
                    Afficher les devises internationales
                  </>
                )}
              </button>
            </div>
            
            {showAllCurrencies && (
              <div className="flex flex-wrap gap-2 mt-2">
                {internationalCurrencies.map(code => (
                  <button
                    key={code}
                    onClick={() => toggleSecondaryCurrency(code)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      secondaryCurrencies.includes(code)
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                    disabled={code === primaryCurrency}
                  >
                    {CURRENCIES[code].symbol} {CURRENCIES[code].code}
                    {secondaryCurrencies.includes(code) && (
                      <i className="fas fa-check ml-1 text-blue-500"></i>
                    )}
                  </button>
                ))}
                
                {cryptoCurrencies.map(code => (
                  <button
                    key={code}
                    onClick={() => toggleSecondaryCurrency(code)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      secondaryCurrencies.includes(code)
                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                    disabled={code === primaryCurrency}
                  >
                    {CURRENCIES[code].symbol} {CURRENCIES[code].code}
                    {secondaryCurrencies.includes(code) && (
                      <i className="fas fa-check ml-1 text-purple-500"></i>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Options d'affichage */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Options d'affichage</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCurrencySymbol"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="showCurrencySymbol" className="ml-2 block text-sm text-gray-700">
                Afficher le symbole de la devise (ex: FCFA, $, €)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCurrencyCode"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showCurrencyCode" className="ml-2 block text-sm text-gray-700">
                Afficher le code de la devise (ex: XOF, USD, EUR)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showAlternativeCurrency"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="showAlternativeCurrency" className="ml-2 block text-sm text-gray-700">
                Afficher les montants dans une devise alternative
              </label>
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
            Paramètres de devise enregistrés avec succès
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencySettings;
