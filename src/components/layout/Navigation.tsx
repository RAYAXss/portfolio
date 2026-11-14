import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import LanguageToggle from '../ui/LanguageToggle';
import ThemeToggle from '../ui/ThemeToggle';
import { getCvUrl } from '../../utils/cv';

const Navigation: React.FC = () => {
  const { lang, t: translations } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasProfileImage, setHasProfileImage] = useState(true);

  const cvHref = getCvUrl(lang);
  const isHome = location.pathname === '/';

  const sections = isHome ? ['hero', 'about', 'experience', 'skills', 'projects'] : [];
  const activeSection = useScrollSpy(sections);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const sectionItems = [
    { id: 'about', label: translations.nav.about },
    { id: 'experience', label: translations.nav.experience },
    { id: 'skills', label: translations.nav.skills },
    { id: 'projects', label: translations.nav.projects },
  ];

  const pageItems = [
    { path: '/comfyui', label: translations.nav.comfyui },
    { path: '/agents-skills', label: translations.nav.agentSkills },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/80 backdrop-blur-md border-b border-border/10'
          : 'bg-surface'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Avatar + Name → Home link */}
          <Link to="/" className="flex items-center space-x-3">
            {hasProfileImage ? (
              <img
                src={`${import.meta.env.BASE_URL}images/profile.jpg`}
                alt="Quentin COLPART"
                className="w-10 h-10 rounded-full object-cover shadow-md"
                onError={() => setHasProfileImage(false)}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold shadow-md">
                QC
              </div>
            )}
            <span className="font-semibold text-content text-lg hidden sm:block">
              {translations.hero.name}
            </span>
          </Link>

          {/* Center: Menu items (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {isHome && sectionItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === item.id
                    ? 'text-accent'
                    : 'text-content-muted hover:text-accent'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}

            {/* Separator between sections and pages */}
            {isHome && (
              <span className="w-px h-4 bg-border/20" />
            )}

            {pageItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors relative ${
                  location.pathname === item.path
                    ? 'text-accent'
                    : 'text-content-muted hover:text-accent'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-accent" />
                )}
              </Link>
            ))}
          </div>

          {/* Right: Resume, Theme, Language, Mobile Menu */}
          <div className="flex items-center space-x-4">
            {cvHref && (
              <a
                href={cvHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-2 text-sm font-medium text-content-muted hover:text-accent transition-colors"
              >
                <Download size={18} />
                <span>{translations.nav.resume}</span>
              </a>
            )}

            <ThemeToggle />
            <LanguageToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-content-muted hover:text-accent"
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
          <div className="md:hidden py-4 border-t border-border/10">
            {isHome && sectionItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left py-2 px-4 text-content-muted hover:bg-surface-2 transition-colors"
              >
                {item.label}
              </button>
            ))}

            {pageItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block w-full text-left py-2 px-4 transition-colors ${
                  location.pathname === item.path
                    ? 'text-accent bg-surface-2'
                    : 'text-content-muted hover:bg-surface-2'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {cvHref && (
              <a
                href={cvHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left py-2 px-4 text-content-muted hover:bg-surface-2 transition-colors"
              >
                {translations.nav.resume}
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
