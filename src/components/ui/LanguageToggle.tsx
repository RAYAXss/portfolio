import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="px-3 py-1 text-sm font-medium bg-gray-800 text-gray-200 hover:bg-blue-600 hover:text-white rounded-md transition-all"
      aria-label="Toggle language"
    >
      {lang === 'fr' ? 'EN' : 'FR'}
    </button>
  );
};

export default LanguageToggle;
