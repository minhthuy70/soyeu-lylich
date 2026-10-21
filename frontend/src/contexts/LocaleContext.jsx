import React, { createContext, useContext, useState, useEffect } from 'react';
import { t } from '../i18n/translations';

const LocaleContext = createContext({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  const handleSetLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const translate = (key) => t(key, locale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, t: translate }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
