import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dbService } from '../services/dbService';

const CurrencyContext = createContext();

const SUPPORTED_CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateToBase: 1.0
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    rateToBase: 95.07 // Default fallback if offline
  }
};

export const CurrencyProvider = ({ children }) => {
  // Initialize from localStorage or default to USD
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_currency');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.code && SUPPORTED_CURRENCIES[parsed.code]) {
          return parsed.code;
        }
      }
    } catch (_) {}
    return 'USD';
  });

  const [exchangeRate, setExchangeRate] = useState(95.07);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFetchingRates, setIsFetchingRates] = useState(false);

  // Fetch exchange rate on mount and every 30 minutes
  const fetchRates = useCallback(async () => {
    setIsFetchingRates(true);
    try {
      const data = await dbService.getExchangeRates();
      if (data && data.usdToInr) {
        const rate = Number(data.usdToInr);
        if (!isNaN(rate) && rate > 0) {
          setExchangeRate(rate);
          setLastUpdated(data.timestamp || new Date().toISOString());
        }
      }
    } catch (err) {
      console.warn('Currency rates fetch error, keeping current rate:', err.message);
    } finally {
      setIsFetchingRates(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  // Set currency and persist
  const setCurrency = useCallback((code) => {
    const validCode = SUPPORTED_CURRENCIES[code] ? code : 'USD';
    const currencyObj = SUPPORTED_CURRENCIES[validCode];
    setCurrencyState(validCode);
    try {
      localStorage.setItem('crm_currency', JSON.stringify({
        code: currencyObj.code,
        symbol: currencyObj.symbol
      }));
    } catch (_) {}
  }, []);

  // Toggle between USD and INR
  const toggleCurrency = useCallback(() => {
    setCurrency(currency === 'USD' ? 'INR' : 'USD');
  }, [currency, setCurrency]);

  const currencySymbol = SUPPORTED_CURRENCIES[currency]?.symbol || '$';
  const currencyInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;

  // Format amount with current currency symbol
  const formatAmount = useCallback((amount, options = {}) => {
    const num = Number(amount) || 0;
    const { decimals = 0, targetCurrency = currency } = options;
    const symbol = SUPPORTED_CURRENCIES[targetCurrency]?.symbol || '$';

    if (targetCurrency === 'INR') {
      // Indian number formatting (e.g. 1,00,000)
      return `${symbol}${num.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}`;
    }

    return `${symbol}${num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}`;
  }, [currency]);

  // Convert amount between USD and INR
  const convertAmount = useCallback((amount, fromCurrency = 'USD', toCurrency = 'INR') => {
    const num = Number(amount) || 0;
    if (fromCurrency === toCurrency) return num;
    if (fromCurrency === 'USD' && toCurrency === 'INR') {
      return num * exchangeRate;
    }
    if (fromCurrency === 'INR' && toCurrency === 'USD') {
      return exchangeRate > 0 ? num / exchangeRate : 0;
    }
    return num;
  }, [exchangeRate]);

  const value = {
    currency,
    currencySymbol,
    currencyInfo,
    currencies: SUPPORTED_CURRENCIES,
    exchangeRate,
    lastUpdated,
    isFetchingRates,
    setCurrency,
    toggleCurrency,
    formatAmount,
    convertAmount,
    refetchRates: fetchRates
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Return fallback safe defaults if rendered outside provider
    return {
      currency: 'USD',
      currencySymbol: '$',
      currencyInfo: SUPPORTED_CURRENCIES.USD,
      currencies: SUPPORTED_CURRENCIES,
      exchangeRate: 95.07,
      lastUpdated: null,
      isFetchingRates: false,
      setCurrency: () => {},
      toggleCurrency: () => {},
      formatAmount: (amount) => `$${(Number(amount) || 0).toLocaleString()}`,
      convertAmount: (amount) => Number(amount) || 0,
      refetchRates: () => {}
    };
  }
  return context;
};

export default CurrencyContext;
