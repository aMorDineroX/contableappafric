import React from 'react';
import { Currency, CURRENCIES } from '../utils/currencies';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  className = ''
}) => {
  // Grouper les devises par type
  const africanCurrencies = Object.entries(CURRENCIES)
    .filter(([_, config]) => !config.isInternational && !config.isCrypto)
    .map(([code]) => code as Currency);
  
  const internationalCurrencies = Object.entries(CURRENCIES)
    .filter(([_, config]) => config.isInternational)
    .map(([code]) => code as Currency);
  
  const cryptoCurrencies = Object.entries(CURRENCIES)
    .filter(([_, config]) => config.isCrypto)
    .map(([code]) => code as Currency);

  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor="currency-selector" className="mr-2 text-sm font-medium text-gray-700">
        Devise:
      </label>
      <select
        id="currency-selector"
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value as Currency)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        {/* Devises africaines */}
        <optgroup label="Devises africaines">
          {africanCurrencies.map(code => (
            <option key={code} value={code}>
              {CURRENCIES[code].name} ({CURRENCIES[code].symbol})
            </option>
          ))}
        </optgroup>
        
        {/* Devises internationales */}
        <optgroup label="Devises internationales">
          {internationalCurrencies.map(code => (
            <option key={code} value={code}>
              {CURRENCIES[code].name} ({CURRENCIES[code].symbol})
            </option>
          ))}
        </optgroup>
        
        {/* Crypto-monnaies */}
        <optgroup label="Crypto-monnaies">
          {cryptoCurrencies.map(code => (
            <option key={code} value={code}>
              {CURRENCIES[code].name} ({CURRENCIES[code].symbol})
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};

export default CurrencySelector;
