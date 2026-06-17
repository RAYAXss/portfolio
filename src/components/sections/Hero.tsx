import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, ExternalLink, ArrowDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import Button from '../ui/Button';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const Hero: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gray-900 pt-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Animated Welcome Card */}
        <motion.div
          className="mb-8 inline-block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 shadow-2xl">
            <div className="px-6 py-2 rounded-full bg-gray-900">
              <span className="text-sm text-gray-300">
                {lang === 'fr' ? 'Bienvenue sur mon portfolio' : 'Welcome to my portfolio'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {translations.hero.name}
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-300 mb-6">
            {translations.hero.title}
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {translations.hero.description}
          </p>

          {/* Stack badges */}
          <div className="flex justify-center gap-3 mb-8">
            <span className="px-4 py-2 bg-blue-600/20 border border-blue-500 text-blue-300 rounded-full text-sm font-medium">
              Python
            </span>
            <span className="px-4 py-2 bg-purple-600/20 border border-purple-500 text-purple-300 rounded-full text-sm font-medium">
              Bash
            </span>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="https://github.com/RAYAXss"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-600 rounded-full text-gray-300 hover:border-blue-400 hover:text-blue-400 transition-all"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/quentin-colpart/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-600 rounded-full text-gray-300 hover:border-blue-400 hover:text-blue-400 transition-all"
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://www.root-me.org/RAYAX?lang=fr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-600 rounded-full text-gray-300 hover:border-blue-400 hover:text-blue-400 transition-all"
            >
              <ExternalLink size={20} />
              <span>RootMe</span>
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => scrollToSection('projects')}
            >
              {translations.hero.viewProjects}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('contact')}
            >
              {translations.hero.contactMe}
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <button
            onClick={() => scrollToSection('about')}
            className="text-gray-400 hover:text-blue-400 transition-colors"
            aria-label="Scroll to about section"
          >
            <ArrowDown size={32} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
