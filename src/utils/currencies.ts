export type Currency = 'XOF' | 'XAF' | 'NGN' | 'GHS' | 'KES' | 'MAD' | 'ZAR' | 'USD' | 'EUR' | 'BTC';

// Pour la rétrocompatibilité
export type AfricanCurrency = Currency;

interface CurrencyConfig {
  symbol: string;
  name: string;
  code: Currency;
  decimals: number;
  isInternational?: boolean;
  isCrypto?: boolean;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  XOF: {
    symbol: 'FCFA',
    name: 'Franc CFA BCEAO',
    code: 'XOF',
    decimals: 0
  },
  XAF: {
    symbol: 'FCFA',
    name: 'Franc CFA BEAC',
    code: 'XAF',
    decimals: 0
  },
  NGN: {
    symbol: '₦',
    name: 'Nigerian Naira',
    code: 'NGN',
    decimals: 2
  },
  GHS: {
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    code: 'GHS',
    decimals: 2
  },
  KES: {
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    code: 'KES',
    decimals: 2
  },
  MAD: {
    symbol: 'DH',
    name: 'Dirham Marocain',
    code: 'MAD',
    decimals: 2
  },
  ZAR: {
    symbol: 'R',
    name: 'Rand Sud-Africain',
    code: 'ZAR',
    decimals: 2
  },

  // Devises internationales
  USD: {
    symbol: '$',
    name: 'Dollar Américain',
    code: 'USD',
    decimals: 2,
    isInternational: true
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    code: 'EUR',
    decimals: 2,
    isInternational: true
  },

  // Crypto-monnaie
  BTC: {
    symbol: '₿',
    name: 'Bitcoin',
    code: 'BTC',
    decimals: 8,
    isCrypto: true
  }
};

// Pour la rétrocompatibilité
export const AFRICAN_CURRENCIES = CURRENCIES;

export const formatCurrency = (amount: number, currency: Currency): string => {
  // Vérifier si la devise existe dans notre configuration
  const config = CURRENCIES[currency];

  // Si la devise n'est pas définie, utiliser XOF par défaut
  if (!config) {
    console.warn(`Devise non reconnue: ${currency}, utilisation de XOF par défaut`);
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' FCFA';
  }

  // Format spécial pour le Bitcoin
  if (config.isCrypto) {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals
    }).format(amount) + ' ' + config.symbol;
  }

  // Format pour les devises internationales (symbole avant le montant)
  if (config.isInternational && config.code === 'USD') {
    return config.symbol + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals
    }).format(amount);
  }

  // Format pour l'Euro (symbole après le montant avec espace)
  if (config.code === 'EUR') {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals
    }).format(amount) + ' ' + config.symbol;
  }

  // Format standard pour les devises africaines
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals
  }).format(amount) + ' ' + config.symbol;
};

export const parseCurrency = (value: string, currency: Currency): number => {
  // Nettoyer la valeur en fonction de la devise
  let cleanValue = value;

  // Enlever le symbole de la devise
  const config = CURRENCIES[currency];
  if (config) {
    cleanValue = cleanValue.replace(config.symbol, '');
  }

  // Convertir en format numérique standard
  cleanValue = cleanValue.replace(/[^0-9,-\.]/g, '').trim();

  // Gérer les formats avec virgule comme séparateur décimal
  if (cleanValue.includes(',') && !cleanValue.includes('.')) {
    cleanValue = cleanValue.replace(',', '.');
  }

  // Gérer les formats avec des espaces comme séparateurs de milliers
  cleanValue = cleanValue.replace(/\s/g, '');
  const result = Number(cleanValue);
  return isNaN(result) ? 0 : result;
};
