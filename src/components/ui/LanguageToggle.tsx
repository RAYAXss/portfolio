import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const isFR = lang === 'fr';

  return (
    <button
      onClick={() => setLang(isFR ? 'en' : 'fr')}
      aria-label="Toggle language"
      role="switch"
      aria-checked={isFR}
      className="relative flex items-center gap-0 rounded-full p-0.5 bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors"
      style={{ width: 72, height: 28 }}
    >
      {/* Labels FR / EN */}
      <span
        className="absolute left-0 w-1/2 text-center text-xs font-semibold transition-colors duration-200 z-10"
        style={{ color: isFR ? '#fff' : '#6b7280' }}
      >
        FR
      </span>
      <span
        className="absolute right-0 w-1/2 text-center text-xs font-semibold transition-colors duration-200 z-10"
        style={{ color: !isFR ? '#fff' : '#6b7280' }}
      >
        EN
      </span>

      {/* Pill glissante */}
      <span
        className="absolute top-0.5 bottom-0.5 rounded-full bg-blue-600 transition-all duration-200 ease-in-out"
        style={{
          width: 'calc(50% - 2px)',
          left: isFR ? 2 : 'calc(50% + 0px)',
        }}
      />
    </button>
  );
};

export default LanguageToggle;