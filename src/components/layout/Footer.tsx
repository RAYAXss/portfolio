import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const socials = [
    { href: 'https://github.com/RAYAXss',                        icon: Github,       label: 'GitHub'   },
    { href: 'https://www.linkedin.com/in/quentin-colpart/',       icon: Linkedin,     label: 'LinkedIn' },
    { href: 'https://www.root-me.org/RAYAX?lang=fr',              icon: ExternalLink, label: 'RootMe'   },
  ];

  return (
    <footer className="relative bg-surface-3 border-t border-border/10 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-content font-bold text-sm">
                {t.footer.name}
              </span>
            </div>
            <p className="text-content-faint text-xs mt-1">
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
                className="w-9 h-9 rounded-full bg-surface-2 border border-border-strong flex items-center justify-center text-content-faint hover:text-accent hover:border-accent/50 transition-colors"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-content-faint text-xs text-center md:text-right">
            © {year} · {t.footer.name}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
