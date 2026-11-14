import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';

const Contact: React.FC = () => {
  const { t: translations } = useLanguage();
  const socials = [
    { href: 'https://www.linkedin.com/in/quentin-colpart/', icon: Linkedin,     label: 'LinkedIn' },
    { href: 'https://github.com/RAYAXss',                   icon: Github,       label: 'GitHub'   },
    { href: 'https://www.root-me.org/RAYAX?lang=fr',         icon: ExternalLink, label: 'RootMe'   },
  ];

  return (
    <section
      id="contact"
      className="relative py-24 overflow-hidden"
    >
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeader title={translations.contact.title} align="center" />

        <FadeInOnScroll delay={0.15}>
          <p className="text-lg text-content-muted mb-10 leading-relaxed">
            {translations.contact.message}
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.25}>
          <motion.a
            href="mailto:qcolpart@gmail.com"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-block mb-10"
          >
            <Button variant="primary" size="lg" className="shadow-lg shadow-accent/20">
              <Mail size={18} className="mr-2" />
              {translations.contact.button}
            </Button>
          </motion.a>
        </FadeInOnScroll>

        {/* Social icons */}
        <FadeInOnScroll delay={0.35}>
          <div className="flex justify-center gap-4">
            {socials.map(({ href, icon: Icon, label }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
                whileHover={{ y: -5, scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                className="w-12 h-12 rounded-full bg-glass border border-border/10 flex items-center justify-center text-content-faint hover:text-accent hover:bg-glass-hover hover:border-accent/40 transition-colors"
              >
                <Icon size={22} />
              </motion.a>
            ))}
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default Contact;