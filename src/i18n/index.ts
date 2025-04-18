type Locale = 'fr' | 'en';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  fr: {
    welcome: 'Bienvenue sur ContAfricaX',
    dashboard: 'Tableau de bord',
    transactions: 'Transactions',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    revenue: 'Revenus',
    expenses: 'Dépenses',
    balance: 'Solde',
    // Ajouter d'autres traductions...
  },
  en: {
    welcome: 'Welcome to ContAfricaX',
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    settings: 'Settings',
    logout: 'Logout',
    revenue: 'Revenue',
    expenses: 'Expenses',
    balance: 'Balance',
    // Add more translations...
  }
};

export const useTranslation = (locale: Locale = 'fr') => {
  const t = (key: string, params?: Record<string, string>) => {
    let translation = translations[locale][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation.replace(`{{${key}}}`, value);
      });
    }
    
    return translation;
  };

  return { t };
};

export const formatDate = (date: Date | string, locale: Locale = 'fr'): string => {
  return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatNumber = (number: number, locale: Locale = 'fr'): string => {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US').format(number);
};
