import React from 'react';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import Button from '../ui/Button';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const Contact: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeInOnScroll>
          <h2 className="text-4xl font-bold mb-8">
            {translations.contact.title}
          </h2>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.2}>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            {translations.contact.message}
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.4}>
          <a href="mailto:qcolpart@gmail.com">
            <Button
              variant="primary"
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-500 shadow-xl mb-8"
            >
              <Mail size={20} className="mr-2" />
              {translations.contact.button}
            </Button>
          </a>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.6}>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/quentin-colpart/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://github.com/RAYAXss"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.root-me.org/RAYAX?lang=fr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
              aria-label="RootMe"
            >
              <ExternalLink size={24} />
            </a>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default Contact;
