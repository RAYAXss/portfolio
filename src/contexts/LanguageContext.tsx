import React, { createContext, useState } from 'react';
import type { Language } from '../types/language';
import translationsFR from '../data/translations/fr.json';
import translationsEN from '../data/translations/en.json';

export type Translations = typeof translationsFR;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  /** Textes UI de la langue active (fr.json / en.json) */
  t: Translations;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'preferred-language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === 'en' || stored === 'fr') ? stored : 'fr';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  const t: Translations = lang === 'fr' ? translationsFR : translationsEN;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
