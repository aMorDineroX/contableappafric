import React, { useState, useEffect } from 'react';
import { MobilePaymentProvider, AfricanCountry } from '../../types/payment';
import { MobilePaymentAPI } from '../../services/mobilePaymentApi';

// Logos des fournisseurs de paiement
const providerLogos: Record<MobilePaymentProvider, string> = {
  [MobilePaymentProvider.ORANGE_MONEY]: '/images/payment-providers/orange-money.png',
  [MobilePaymentProvider.MTN_MOBILE_MONEY]: '/images/payment-providers/mtn-mobile-money.png',
  [MobilePaymentProvider.WAVE]: '/images/payment-providers/wave.png',
  [MobilePaymentProvider.MPESA]: '/images/payment-providers/mpesa.png',
  [MobilePaymentProvider.MOOV_MONEY]: '/images/payment-providers/moov-money.png',
  [MobilePaymentProvider.FREE_MONEY]: '/images/payment-providers/free-money.png',
};

// Noms des fournisseurs de paiement
const providerNames: Record<MobilePaymentProvider, string> = {
  [MobilePaymentProvider.ORANGE_MONEY]: 'Orange Money',
  [MobilePaymentProvider.MTN_MOBILE_MONEY]: 'MTN Mobile Money',
  [MobilePaymentProvider.WAVE]: 'Wave',
  [MobilePaymentProvider.MPESA]: 'M-Pesa',
  [MobilePaymentProvider.MOOV_MONEY]: 'Moov Money',
  [MobilePaymentProvider.FREE_MONEY]: 'Free Money',
};

// Couleurs des fournisseurs de paiement
const providerColors: Record<MobilePaymentProvider, string> = {
  [MobilePaymentProvider.ORANGE_MONEY]: 'bg-orange-500',
  [MobilePaymentProvider.MTN_MOBILE_MONEY]: 'bg-yellow-500',
  [MobilePaymentProvider.WAVE]: 'bg-blue-500',
  [MobilePaymentProvider.MPESA]: 'bg-green-500',
  [MobilePaymentProvider.MOOV_MONEY]: 'bg-purple-500',
  [MobilePaymentProvider.FREE_MONEY]: 'bg-red-500',
};

interface PaymentProviderSelectorProps {
  country: AfricanCountry;
  selectedProvider: MobilePaymentProvider | null;
  onSelectProvider: (provider: MobilePaymentProvider) => void;
  className?: string;
}

const PaymentProviderSelector: React.FC<PaymentProviderSelectorProps> = ({
  country,
  selectedProvider,
  onSelectProvider,
  className = '',
}) => {
  const [availableProviders, setAvailableProviders] = useState<MobilePaymentProvider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableProviders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const providers = await MobilePaymentAPI.getAvailableProviders(country);
        setAvailableProviders(providers);
      } catch (err) {
        console.error('Erreur lors de la récupération des fournisseurs de paiement:', err);
        setError('Impossible de récupérer les fournisseurs de paiement. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableProviders();
  }, [country]);

  if (isLoading) {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-16 w-32"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 ${className}`}>
        {error}
      </div>
    );
  }

  if (availableProviders.length === 0) {
    return (
      <div className={`text-gray-500 ${className}`}>
        Aucun fournisseur de paiement disponible pour ce pays.
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {availableProviders.map((provider) => (
        <button
          key={provider}
          onClick={() => onSelectProvider(provider)}
          className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
            selectedProvider === provider
              ? `border-blue-500 ${providerColors[provider]} bg-opacity-10`
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          {/* Placeholder pour le logo (dans une application réelle, utilisez une image) */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${providerColors[provider]} text-white mb-2`}>
            {provider.substring(0, 1)}
          </div>
          <span className="text-xs font-medium">{providerNames[provider]}</span>
          
          {selectedProvider === provider && (
            <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default PaymentProviderSelector;
