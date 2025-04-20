import React, { useState } from 'react';
import { 
  AfricanCountry, 
  TaxType, 
  FilingFrequency, 
  ComplianceStatus,
  EconomicRegion
} from '../../types/tax';

const TaxSettings: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<AfricanCountry | ''>('');
  const [vatEnabled, setVatEnabled] = useState<boolean>(true);
  const [vatRate, setVatRate] = useState<number>(18);
  const [vatFilingFrequency, setVatFilingFrequency] = useState<FilingFrequency>(FilingFrequency.MONTHLY);
  const [corporateTaxEnabled, setCorporateTaxEnabled] = useState<boolean>(true);
  const [corporateTaxRate, setCorporateTaxRate] = useState<number>(30);
  const [withholdingTaxEnabled, setWithholdingTaxEnabled] = useState<boolean>(false);
  const [withholdingTaxRate, setWithholdingTaxRate] = useState<number>(10);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Données des pays africains avec leurs régimes fiscaux
  const countryTaxData: Record<AfricanCountry, {
    name: string;
    currency: string;
    vatRate: number;
    corporateTaxRate: number;
    withholdingTaxRate: number;
    economicRegions: EconomicRegion[];
  }> = {
    [AfricanCountry.SENEGAL]: {
      name: 'Sénégal',
      currency: 'XOF',
      vatRate: 18,
      corporateTaxRate: 30,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.UEMOA, EconomicRegion.ECOWAS, EconomicRegion.OHADA]
    },
    [AfricanCountry.COTE_DIVOIRE]: {
      name: 'Côte d\'Ivoire',
      currency: 'XOF',
      vatRate: 18,
      corporateTaxRate: 25,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.UEMOA, EconomicRegion.ECOWAS, EconomicRegion.OHADA]
    },
    [AfricanCountry.CAMEROUN]: {
      name: 'Cameroun',
      currency: 'XAF',
      vatRate: 19.25,
      corporateTaxRate: 30,
      withholdingTaxRate: 15,
      economicRegions: [EconomicRegion.CEMAC, EconomicRegion.OHADA]
    },
    [AfricanCountry.MALI]: {
      name: 'Mali',
      currency: 'XOF',
      vatRate: 18,
      corporateTaxRate: 30,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.UEMOA, EconomicRegion.ECOWAS, EconomicRegion.OHADA]
    },
    [AfricanCountry.BURKINA_FASO]: {
      name: 'Burkina Faso',
      currency: 'XOF',
      vatRate: 18,
      corporateTaxRate: 27.5,
      withholdingTaxRate: 12.5,
      economicRegions: [EconomicRegion.UEMOA, EconomicRegion.ECOWAS, EconomicRegion.OHADA]
    },
    [AfricanCountry.BENIN]: {
      name: 'Bénin',
      currency: 'XOF',
      vatRate: 18,
      corporateTaxRate: 30,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.UEMOA, EconomicRegion.ECOWAS, EconomicRegion.OHADA]
    },
    [AfricanCountry.TOGO]: {
      name: 'Togo',
      currency: 'XOF',
      vatRate: 18,
      corporateTaxRate: 27,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.UEMOA, EconomicRegion.ECOWAS, EconomicRegion.OHADA]
    },
    [AfricanCountry.NIGER]: {
      name: 'Niger',
      currency: 'XOF',
      vatRate: 19,
      corporateTaxRate: 30,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.UEMOA, EconomicRegion.ECOWAS, EconomicRegion.OHADA]
    },
    [AfricanCountry.GUINEE]: {
      name: 'Guinée',
      currency: 'GNF',
      vatRate: 18,
      corporateTaxRate: 35,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.ECOWAS, EconomicRegion.OHADA]
    },
    [AfricanCountry.KENYA]: {
      name: 'Kenya',
      currency: 'KES',
      vatRate: 16,
      corporateTaxRate: 30,
      withholdingTaxRate: 15,
      economicRegions: [EconomicRegion.EAC, EconomicRegion.COMESA]
    },
    [AfricanCountry.GHANA]: {
      name: 'Ghana',
      currency: 'GHS',
      vatRate: 12.5,
      corporateTaxRate: 25,
      withholdingTaxRate: 8,
      economicRegions: [EconomicRegion.ECOWAS]
    },
    [AfricanCountry.NIGERIA]: {
      name: 'Nigeria',
      currency: 'NGN',
      vatRate: 7.5,
      corporateTaxRate: 30,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.ECOWAS]
    },
    [AfricanCountry.SOUTH_AFRICA]: {
      name: 'Afrique du Sud',
      currency: 'ZAR',
      vatRate: 15,
      corporateTaxRate: 28,
      withholdingTaxRate: 15,
      economicRegions: [EconomicRegion.SADC]
    },
    [AfricanCountry.MOROCCO]: {
      name: 'Maroc',
      currency: 'MAD',
      vatRate: 20,
      corporateTaxRate: 31,
      withholdingTaxRate: 15,
      economicRegions: [EconomicRegion.AMU]
    },
    [AfricanCountry.TUNISIA]: {
      name: 'Tunisie',
      currency: 'TND',
      vatRate: 19,
      corporateTaxRate: 25,
      withholdingTaxRate: 15,
      economicRegions: [EconomicRegion.AMU]
    },
    [AfricanCountry.EGYPT]: {
      name: 'Égypte',
      currency: 'EGP',
      vatRate: 14,
      corporateTaxRate: 22.5,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.COMESA]
    },
    [AfricanCountry.ALGERIA]: {
      name: 'Algérie',
      currency: 'DZD',
      vatRate: 19,
      corporateTaxRate: 26,
      withholdingTaxRate: 15,
      economicRegions: [EconomicRegion.AMU]
    },
    [AfricanCountry.TANZANIA]: {
      name: 'Tanzanie',
      currency: 'TZS',
      vatRate: 18,
      corporateTaxRate: 30,
      withholdingTaxRate: 15,
      economicRegions: [EconomicRegion.EAC, EconomicRegion.SADC]
    },
    [AfricanCountry.UGANDA]: {
      name: 'Ouganda',
      currency: 'UGX',
      vatRate: 18,
      corporateTaxRate: 30,
      withholdingTaxRate: 15,
      economicRegions: [EconomicRegion.EAC, EconomicRegion.COMESA]
    },
    [AfricanCountry.RWANDA]: {
      name: 'Rwanda',
      currency: 'RWF',
      vatRate: 18,
      corporateTaxRate: 30,
      withholdingTaxRate: 15,
      economicRegions: [EconomicRegion.EAC, EconomicRegion.COMESA]
    },
    [AfricanCountry.ETHIOPIA]: {
      name: 'Éthiopie',
      currency: 'ETB',
      vatRate: 15,
      corporateTaxRate: 30,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.COMESA]
    },
    [AfricanCountry.GABON]: {
      name: 'Gabon',
      currency: 'XAF',
      vatRate: 18,
      corporateTaxRate: 30,
      withholdingTaxRate: 10,
      economicRegions: [EconomicRegion.CEMAC, EconomicRegion.OHADA]
    },
    [AfricanCountry.CONGO]: {
      name: 'Congo',
      currency: 'XAF',
      vatRate: 18,
      corporateTaxRate: 30,
      withholdingTaxRate: 15,
      economicRegions: [EconomicRegion.CEMAC, EconomicRegion.OHADA]
    },
    [AfricanCountry.DR_CONGO]: {
      name: 'RD Congo',
      currency: 'CDF',
      vatRate: 16,
      corporateTaxRate: 30,
      withholdingTaxRate: 14,
      economicRegions: [EconomicRegion.SADC, EconomicRegion.COMESA]
    }
  };

  // Fonction pour charger les paramètres fiscaux d'un pays
  const loadCountryTaxSettings = (country: AfricanCountry) => {
    if (country && countryTaxData[country]) {
      const data = countryTaxData[country];
      setVatRate(data.vatRate);
      setCorporateTaxRate(data.corporateTaxRate);
      setWithholdingTaxRate(data.withholdingTaxRate);
    }
  };

  // Gérer le changement de pays
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value as AfricanCountry;
    setSelectedCountry(country);
    if (country) {
      loadCountryTaxSettings(country);
    }
  };

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

  // Obtenir les noms des régions économiques
  const getEconomicRegionName = (region: EconomicRegion): string => {
    const regionNames: Record<EconomicRegion, string> = {
      [EconomicRegion.UEMOA]: 'UEMOA (Union Économique et Monétaire Ouest-Africaine)',
      [EconomicRegion.CEMAC]: 'CEMAC (Communauté Économique et Monétaire de l\'Afrique Centrale)',
      [EconomicRegion.ECOWAS]: 'CEDEAO (Communauté Économique des États de l\'Afrique de l\'Ouest)',
      [EconomicRegion.EAC]: 'CAE (Communauté d\'Afrique de l\'Est)',
      [EconomicRegion.SADC]: 'SADC (Communauté de Développement d\'Afrique Australe)',
      [EconomicRegion.AMU]: 'UMA (Union du Maghreb Arabe)',
      [EconomicRegion.COMESA]: 'COMESA (Marché Commun de l\'Afrique Orientale et Australe)',
      [EconomicRegion.OHADA]: 'OHADA (Organisation pour l\'Harmonisation en Afrique du Droit des Affaires)'
    };
    return regionNames[region] || region;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres Fiscaux</h2>
      
      <div className="space-y-6">
        {/* Sélection du pays */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Pays de conformité fiscale</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sélectionnez le pays pour lequel vous souhaitez configurer les paramètres fiscaux.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <select
                id="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un pays</option>
                {Object.entries(countryTaxData).map(([code, data]) => (
                  <option key={code} value={code}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {selectedCountry && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Informations sur {countryTaxData[selectedCountry as AfricanCountry].name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Devise:</span> {countryTaxData[selectedCountry as AfricanCountry].currency}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Régions économiques:</span>
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-2">
                    {countryTaxData[selectedCountry as AfricanCountry].economicRegions.map(region => (
                      <li key={region}>{getEconomicRegionName(region)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedCountry && (
          <>
            {/* TVA */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">Taxe sur la Valeur Ajoutée (TVA)</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Activer</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={vatEnabled}
                      onChange={() => setVatEnabled(!vatEnabled)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              
              {vatEnabled && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="vatRate" className="block text-sm font-medium text-gray-700 mb-1">
                        Taux de TVA (%)
                      </label>
                      <input
                        type="number"
                        id="vatRate"
                        value={vatRate}
                        onChange={(e) => setVatRate(parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="vatFilingFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Fréquence de déclaration
                      </label>
                      <select
                        id="vatFilingFrequency"
                        value={vatFilingFrequency}
                        onChange={(e) => setVatFilingFrequency(e.target.value as FilingFrequency)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={FilingFrequency.MONTHLY}>Mensuelle</option>
                        <option value={FilingFrequency.QUARTERLY}>Trimestrielle</option>
                        <option value={FilingFrequency.SEMI_ANNUAL}>Semestrielle</option>
                        <option value={FilingFrequency.ANNUAL}>Annuelle</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="vatAutoCalculate"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="vatAutoCalculate" className="ml-2 block text-sm text-gray-700">
                      Calculer automatiquement la TVA sur les transactions
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Impôt sur les sociétés */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">Impôt sur les Sociétés</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Activer</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={corporateTaxEnabled}
                      onChange={() => setCorporateTaxEnabled(!corporateTaxEnabled)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              
              {corporateTaxEnabled && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="corporateTaxRate" className="block text-sm font-medium text-gray-700 mb-1">
                        Taux d'impôt sur les sociétés (%)
                      </label>
                      <input
                        type="number"
                        id="corporateTaxRate"
                        value={corporateTaxRate}
                        onChange={(e) => setCorporateTaxRate(parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="corporateTaxFilingFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Fréquence de déclaration
                      </label>
                      <select
                        id="corporateTaxFilingFrequency"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={FilingFrequency.ANNUAL}
                      >
                        <option value={FilingFrequency.QUARTERLY}>Trimestrielle</option>
                        <option value={FilingFrequency.SEMI_ANNUAL}>Semestrielle</option>
                        <option value={FilingFrequency.ANNUAL}>Annuelle</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Retenue à la source */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">Retenue à la Source</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Activer</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={withholdingTaxEnabled}
                      onChange={() => setWithholdingTaxEnabled(!withholdingTaxEnabled)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              
              {withholdingTaxEnabled && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="withholdingTaxRate" className="block text-sm font-medium text-gray-700 mb-1">
                        Taux de retenue à la source (%)
                      </label>
                      <input
                        type="number"
                        id="withholdingTaxRate"
                        value={withholdingTaxRate}
                        onChange={(e) => setWithholdingTaxRate(parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="withholdingTaxType" className="block text-sm font-medium text-gray-700 mb-1">
                        Type de retenue
                      </label>
                      <select
                        id="withholdingTaxType"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="DIVIDEND"
                      >
                        <option value="DIVIDEND">Dividendes</option>
                        <option value="INTEREST">Intérêts</option>
                        <option value="ROYALTY">Redevances</option>
                        <option value="SERVICE">Services</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="withholdingTaxAutoCalculate"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="withholdingTaxAutoCalculate" className="ml-2 block text-sm text-gray-700">
                      Appliquer automatiquement la retenue à la source sur les paiements concernés
                    </label>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving || !selectedCountry}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isSaving || !selectedCountry
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
            Paramètres fiscaux enregistrés avec succès
          </div>
        )}
      </div>

      {/* Styles pour les interrupteurs */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #3b82f6;
        }
        
        input:focus + .slider {
          box-shadow: 0 0 1px #3b82f6;
        }
        
        input:checked + .slider:before {
          transform: translateX(24px);
        }
        
        .slider.round {
          border-radius: 24px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default TaxSettings;
