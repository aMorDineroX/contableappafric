
export const africanCurrencies = {
  XOF: { name: 'Franc CFA BCEAO', symbol: 'FCFA', rate: 655.957 },
  XAF: { name: 'Franc CFA BEAC', symbol: 'FCFA', rate: 655.957 },
  MAD: { name: 'Dirham Marocain', symbol: 'DH', rate: 10.34 },
  NGN: { name: 'Naira Nigérian', symbol: '₦', rate: 460.78 },
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const usdAmount = amount / africanCurrencies[fromCurrency].rate;
  return usdAmount * africanCurrencies[toCurrency].rate;
};
