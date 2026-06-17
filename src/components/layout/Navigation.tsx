import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Download } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import LanguageToggle from '../ui/LanguageToggle';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const Navigation: React.FC = () => {
  const { lang } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const translations = lang === 'fr' ? translationsFR : translationsEN;
  const sections = ['hero', 'about', 'experience', 'skills', 'projects'];
  const activeSection = useScrollSpy(sections);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'about', label: translations.nav.about },
    { id: 'experience', label: translations.nav.experience },
    { id: 'skills', label: translations.nav.skills },
    { id: 'projects', label: translations.nav.projects }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900 shadow-lg'
          : 'bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Avatar + Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              QC
            </div>
            <span className="font-semibold text-gray-100 text-lg hidden sm:block">
              Quentin COLPART
            </span>
          </div>

          {/* Center: Menu items (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === item.id
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-blue-400" />
                )}
              </button>
            ))}
          </div>

          {/* Right: Resume, Social, Language */}
          <div className="flex items-center space-x-4">
            {/* Resume Download */}
            <a
              href="/doc/CV_Cybersécurité.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
            >
              <Download size={18} />
              <span>{translations.nav.resume}</span>
            </a>

            {/* Social Icons */}
            <a
              href="https://github.com/RAYAXss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/quentin-colpart/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-blue-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left py-2 px-4 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <a
              href="/doc/CV_Cybersécurité.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left py-2 px-4 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              {translations.nav.resume}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
