import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency } from '../utils/currencies';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

// Valeur par défaut du contexte
const defaultContext: CurrencyContextType = {
  currency: 'XOF',
  setCurrency: () => {}
};

// Création du contexte
const CurrencyContext = createContext<CurrencyContextType>(defaultContext);

// Hook personnalisé pour utiliser le contexte
export const useCurrency = () => useContext(CurrencyContext);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  // Récupérer la devise depuis le localStorage ou utiliser la valeur par défaut
  const [currency, setCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency');
    return (savedCurrency as Currency) || 'XOF';
  });

  // Sauvegarder la devise dans le localStorage lorsqu'elle change
  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
