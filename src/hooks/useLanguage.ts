import { useState, useEffect } from 'react';
import type { Language } from '../types/language';

const STORAGE_KEY = 'preferred-language';

export const useLanguage = () => {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === 'en' || stored === 'fr') ? stored : 'fr';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  return { lang, setLang };
};
