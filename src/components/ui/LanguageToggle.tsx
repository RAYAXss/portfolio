import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
      aria-label="Toggle language"
    >
      {lang === 'fr' ? 'EN' : 'FR'}
    </button>
  );
};

export default LanguageToggle;
