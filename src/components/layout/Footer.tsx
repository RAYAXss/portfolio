import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const Footer: React.FC = () => {
  const { lang } = useLanguage();
  const t = lang === 'fr' ? translationsFR : translationsEN;
  const year = new Date().getFullYear();

  const socials = [
    { href: 'https://github.com/RAYAXss',                        icon: Github,       label: 'GitHub'   },
    { href: 'https://www.linkedin.com/in/quentin-colpart/',       icon: Linkedin,     label: 'LinkedIn' },
    { href: 'https://www.root-me.org/RAYAX?lang=fr',              icon: ExternalLink, label: 'RootMe'   },
  ];

  return (
    <footer className="relative bg-gray-950 border-t border-white/5 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <img
                src={`${import.meta.env.BASE_URL}images/profile.jpg`}
                alt="Quentin COLPART"
                className="w-7 h-7 rounded-full object-cover shadow-md"
              />
              <span className="text-white font-bold text-sm">
                {t.footer.name}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              {t.footer.role}
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center justify-center gap-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/50 transition-colors"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-gray-600 text-xs text-center md:text-right">
            © {year} · {t.footer.name}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
