import React, { useState } from 'react';
import { MobilePaymentProvider, AfricanCountry } from '../../types/payment';

const PaymentSettings: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<MobilePaymentProvider | ''>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [merchantId, setMerchantId] = useState<string>('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');
  const [callbackUrl, setCallbackUrl] = useState<string>('');
  const [enabledCountries, setEnabledCountries] = useState<AfricanCountry[]>([
    AfricanCountry.SENEGAL,
    AfricanCountry.COTE_DIVOIRE
  ]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Données des fournisseurs de paiement mobile
  const paymentProviders: Record<MobilePaymentProvider, {
    name: string;
    logo: string;
    supportedCountries: AfricanCountry[];
    requiresApiKey: boolean;
    requiresApiSecret: boolean;
    requiresMerchantId: boolean;
  }> = {
    [MobilePaymentProvider.ORANGE_MONEY]: {
      name: 'Orange Money',
      logo: 'orange-money.png',
      supportedCountries: [
        AfricanCountry.SENEGAL,
        AfricanCountry.COTE_DIVOIRE,
        AfricanCountry.MALI,
        AfricanCountry.BURKINA_FASO,
        AfricanCountry.CAMEROUN
      ],
      requiresApiKey: true,
      requiresApiSecret: true,
      requiresMerchantId: true
    },
    [MobilePaymentProvider.MTN_MOBILE_MONEY]: {
      name: 'MTN Mobile Money',
      logo: 'mtn-money.png',
      supportedCountries: [
        AfricanCountry.COTE_DIVOIRE,
        AfricanCountry.GHANA,
        AfricanCountry.CAMEROUN,
        AfricanCountry.NIGERIA
      ],
      requiresApiKey: true,
      requiresApiSecret: true,
      requiresMerchantId: false
    },
    [MobilePaymentProvider.WAVE]: {
      name: 'Wave',
      logo: 'wave.png',
      supportedCountries: [
        AfricanCountry.SENEGAL,
        AfricanCountry.COTE_DIVOIRE
      ],
      requiresApiKey: true,
      requiresApiSecret: false,
      requiresMerchantId: true
    },
    [MobilePaymentProvider.MPESA]: {
      name: 'M-Pesa',
      logo: 'mpesa.png',
      supportedCountries: [
        AfricanCountry.KENYA
      ],
      requiresApiKey: true,
      requiresApiSecret: true,
      requiresMerchantId: true
    },
    [MobilePaymentProvider.MOOV_MONEY]: {
      name: 'Moov Money',
      logo: 'moov-money.png',
      supportedCountries: [
        AfricanCountry.BENIN,
        AfricanCountry.TOGO,
        AfricanCountry.NIGER
      ],
      requiresApiKey: true,
      requiresApiSecret: true,
      requiresMerchantId: false
    },
    [MobilePaymentProvider.FREE_MONEY]: {
      name: 'Free Money',
      logo: 'free-money.png',
      supportedCountries: [
        AfricanCountry.SENEGAL
      ],
      requiresApiKey: true,
      requiresApiSecret: true,
      requiresMerchantId: true
    }
  };

  // Noms des pays
  const countryNames: Record<AfricanCountry, string> = {
    [AfricanCountry.SENEGAL]: 'Sénégal',
    [AfricanCountry.COTE_DIVOIRE]: 'Côte d\'Ivoire',
    [AfricanCountry.CAMEROUN]: 'Cameroun',
    [AfricanCountry.MALI]: 'Mali',
    [AfricanCountry.BURKINA_FASO]: 'Burkina Faso',
    [AfricanCountry.BENIN]: 'Bénin',
    [AfricanCountry.TOGO]: 'Togo',
    [AfricanCountry.NIGER]: 'Niger',
    [AfricanCountry.GUINEE]: 'Guinée',
    [AfricanCountry.KENYA]: 'Kenya',
    [AfricanCountry.GHANA]: 'Ghana',
    [AfricanCountry.NIGERIA]: 'Nigeria'
  };

  // Fonction pour gérer le changement de fournisseur
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as MobilePaymentProvider;
    setSelectedProvider(provider);
    
    // Réinitialiser les champs
    setApiKey('');
    setApiSecret('');
    setMerchantId('');
    setCallbackUrl('');
    
    // Définir les pays par défaut pour ce fournisseur
    if (provider && paymentProviders[provider]) {
      setEnabledCountries(paymentProviders[provider].supportedCountries);
    } else {
      setEnabledCountries([]);
    }
  };

  // Fonction pour gérer la sélection/désélection des pays
  const toggleCountry = (country: AfricanCountry) => {
    if (enabledCountries.includes(country)) {
      setEnabledCountries(enabledCountries.filter(c => c !== country));
    } else {
      setEnabledCountries([...enabledCountries, country]);
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres de Paiement</h2>
      
      <div className="space-y-6">
        {/* Sélection du fournisseur de paiement */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Fournisseur de Paiement Mobile</h3>
          <p className="text-sm text-gray-600 mb-4">
            Configurez les paramètres d'intégration pour les paiements mobiles africains.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="paymentProvider" className="block text-sm font-medium text-gray-700 mb-1">
                Fournisseur
              </label>
              <select
                id="paymentProvider"
                value={selectedProvider}
                onChange={handleProviderChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un fournisseur</option>
                {Object.entries(paymentProviders).map(([code, data]) => (
                  <option key={code} value={code}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-1">
                Environnement
              </label>
              <select
                id="environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as 'sandbox' | 'production')}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="sandbox">Sandbox (Test)</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>
        </div>

        {selectedProvider && (
          <>
            {/* Informations d'API */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Informations d'API</h3>
              
              <div className="space-y-4">
                {paymentProviders[selectedProvider as MobilePaymentProvider].requiresApiKey && (
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                      Clé API
                    </label>
                    <input
                      type="text"
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez votre clé API"
                    />
                  </div>
                )}
                
                {paymentProviders[selectedProvider as MobilePaymentProvider].requiresApiSecret && (
                  <div>
                    <label htmlFor="apiSecret" className="block text-sm font-medium text-gray-700 mb-1">
                      Secret API
                    </label>
                    <input
                      type="password"
                      id="apiSecret"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez votre secret API"
                    />
                  </div>
                )}
                
                {paymentProviders[selectedProvider as MobilePaymentProvider].requiresMerchantId && (
                  <div>
                    <label htmlFor="merchantId" className="block text-sm font-medium text-gray-700 mb-1">
                      ID Marchand
                    </label>
                    <input
                      type="text"
                      id="merchantId"
                      value={merchantId}
                      onChange={(e) => setMerchantId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez votre ID marchand"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="callbackUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Callback
                  </label>
                  <input
                    type="text"
                    id="callbackUrl"
                    value={callbackUrl}
                    onChange={(e) => setCallbackUrl(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://votre-domaine.com/api/payment-callback"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cette URL recevra les notifications de paiement du fournisseur.
                  </p>
                </div>
              </div>
            </div>

            {/* Pays supportés */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Pays Supportés</h3>
              <p className="text-sm text-gray-600 mb-4">
                Sélectionnez les pays dans lesquels vous souhaitez activer ce mode de paiement.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {paymentProviders[selectedProvider as MobilePaymentProvider].supportedCountries.map(country => (
                  <div
                    key={country}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      enabledCountries.includes(country)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleCountry(country)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{countryNames[country]}</span>
                      {enabledCountries.includes(country) && (
                        <i className="fas fa-check-circle text-blue-500"></i>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Options avancées */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Options Avancées</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoCapture"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="autoCapture" className="ml-2 block text-sm text-gray-700">
                    Capture automatique des paiements
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="savePaymentInfo"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="savePaymentInfo" className="ml-2 block text-sm text-gray-700">
                    Enregistrer les informations de paiement pour les transactions futures
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableWebhooks"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="enableWebhooks" className="ml-2 block text-sm text-gray-700">
                    Activer les webhooks pour les notifications en temps réel
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving || !selectedProvider}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isSaving || !selectedProvider
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
            Paramètres de paiement enregistrés avec succès
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSettings;
