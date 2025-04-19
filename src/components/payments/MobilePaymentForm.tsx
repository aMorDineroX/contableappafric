import React, { useState, useEffect } from 'react';
import { MobilePaymentProvider, AfricanCountry, MobilePaymentInfo } from '../../types/payment';
import { MobilePaymentAPI } from '../../services/mobilePaymentApi';
import PaymentProviderSelector from './PaymentProviderSelector';

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
  [AfricanCountry.NIGERIA]: 'Nigeria',
};

interface MobilePaymentFormProps {
  onSubmit: (paymentInfo: MobilePaymentInfo) => void;
  initialCountry?: AfricanCountry;
  initialProvider?: MobilePaymentProvider;
  initialPhoneNumber?: string;
  isSubmitting?: boolean;
  className?: string;
}

const MobilePaymentForm: React.FC<MobilePaymentFormProps> = ({
  onSubmit,
  initialCountry = AfricanCountry.SENEGAL,
  initialProvider,
  initialPhoneNumber = '',
  isSubmitting = false,
  className = '',
}) => {
  const [country, setCountry] = useState<AfricanCountry>(initialCountry);
  const [provider, setProvider] = useState<MobilePaymentProvider | null>(initialProvider || null);
  const [phoneNumber, setPhoneNumber] = useState<string>(initialPhoneNumber);
  const [accountName, setAccountName] = useState<string>('');
  const [supportedCountries, setSupportedCountries] = useState<AfricanCountry[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(true);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isValidatingPhone, setIsValidatingPhone] = useState<boolean>(false);

  // Charger les pays supportés
  useEffect(() => {
    const fetchSupportedCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const countries = await MobilePaymentAPI.getSupportedCountries();
        setSupportedCountries(countries);
      } catch (error) {
        console.error('Erreur lors du chargement des pays:', error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchSupportedCountries();
  }, []);

  // Valider le numéro de téléphone
  const validatePhoneNumber = async () => {
    if (!phoneNumber || !provider) return;

    setIsValidatingPhone(true);
    setPhoneError(null);

    try {
      const result = await MobilePaymentAPI.validatePhoneNumber(phoneNumber, provider, country);
      if (!result.isValid) {
        setPhoneError(result.message || 'Numéro de téléphone invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la validation du numéro de téléphone:', error);
      setPhoneError('Erreur lors de la validation du numéro');
    } finally {
      setIsValidatingPhone(false);
    }
  };

  // Valider le numéro de téléphone lorsqu'il change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phoneNumber && provider) {
        validatePhoneNumber();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [phoneNumber, provider, country]);

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!provider) {
      return;
    }

    if (phoneError) {
      return;
    }

    const paymentInfo: MobilePaymentInfo = {
      provider,
      phoneNumber,
      country,
      accountName: accountName || undefined,
    };

    onSubmit(paymentInfo);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Sélection du pays */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Pays
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value as AfricanCountry);
            setProvider(null); // Réinitialiser le fournisseur lors du changement de pays
          }}
          disabled={isLoadingCountries || isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoadingCountries ? (
            <option value="">Chargement des pays...</option>
          ) : (
            supportedCountries.map((c) => (
              <option key={c} value={c}>
                {countryNames[c]}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Sélection du fournisseur de paiement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fournisseur de paiement
        </label>
        <PaymentProviderSelector
          country={country}
          selectedProvider={provider}
          onSelectProvider={setProvider}
        />
      </div>

      {/* Numéro de téléphone */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Numéro de téléphone
        </label>
        <div className="relative">
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ex: +221771234567"
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              phoneError
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {isValidatingPhone && (
            <div className="absolute right-3 top-2">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        {phoneError && (
          <p className="mt-1 text-sm text-red-600">{phoneError}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Entrez le numéro de téléphone associé à votre compte de paiement mobile, avec l'indicatif du pays.
        </p>
      </div>

      {/* Nom du compte (optionnel) */}
      <div>
        <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
          Nom du compte (optionnel)
        </label>
        <input
          type="text"
          id="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Ex: John Doe"
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Bouton de soumission */}
      <div>
        <button
          type="submit"
          disabled={!provider || !!phoneError || isSubmitting}
          className={`w-full px-4 py-2 text-white font-medium rounded-md ${
            !provider || !!phoneError || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </div>
          ) : (
            'Continuer'
          )}
        </button>
      </div>
    </form>
  );
};

export default MobilePaymentForm;
