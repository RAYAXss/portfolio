import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Github, Linkedin, ExternalLink, ArrowDown } from 'lucide-react';

import { useLanguage } from '../../hooks/useLanguage';
import Button from '../ui/Button';

import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

/* ─────────────────────────────────────────────
   Magnetic social link
───────────────────────────────────────────── */

const MagneticLink: React.FC<{
  href: string;
  children: React.ReactNode;
  label: string;
}> = ({ href, children, label }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 text-gray-400 text-sm hover:border-blue-400/60 hover:text-blue-300 hover:bg-blue-400/5 transition-colors"
    >
      {children}
    </motion.a>
  );
};

/* ─────────────────────────────────────────────
   Letter wave
───────────────────────────────────────────── */

const WaveText: React.FC<{ children: string }> = ({ children }) => (
  <span className="inline-flex">
    {Array.from(children).map((char, index) => (
      <motion.span
        key={`${char}-${index}`}
        className="inline-block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { delay: 0.15 + index * 0.035, duration: 0.25 },
          y: { delay: 0.4 + index * 0.055, duration: 0.65, ease: 'easeInOut', repeat: Infinity, repeatDelay: 5 },
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </span>
);

/* ─────────────────────────────────────────────
   Hero
───────────────────────────────────────────── */

const Hero: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const socials = [
    { href: 'https://github.com/RAYAXss', icon: Github, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/quentin-colpart/', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://www.root-me.org/RAYAX?lang=fr', icon: ExternalLink, label: 'RootMe' },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };

  const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 22 } },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-20 pointer-events-none">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">
        <motion.div variants={container} initial="hidden" animate="show">

          {/* Welcome badge */}
          <motion.div variants={item} className="mb-7 inline-flex">
            <motion.span
              animate={{
                borderColor: ['rgba(59,130,246,0.3)', 'rgba(168,85,247,0.55)', 'rgba(59,130,246,0.3)'],
                boxShadow: ['0 0 0 rgba(59,130,246,0)', '0 0 24px rgba(59,130,246,0.08)', '0 0 0 rgba(59,130,246,0)'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="px-4 py-1.5 rounded-full border text-xs tracking-widest font-medium text-blue-300 bg-blue-500/5"
            >
              <span className="mr-2">✦</span>
              <WaveText>{translations.hero.welcome}</WaveText>
              <span className="ml-2">✦</span>
            </motion.span>
          </motion.div>

          <motion.div variants={item}>
            <h1
              className="
                text-4xl
                md:text-5xl
                font-bold
                mb-3
                text-blue-400
                bg-gradient-to-r
                from-blue-400
                to-purple-400
                bg-clip-text
                [-webkit-background-clip:text]
                supports-[-webkit-background-clip:text]:[-webkit-text-fill-color:transparent]
                supports-[background-clip:text]:[-webkit-text-fill-color:transparent]
              "
            >
              {translations.hero.name}
            </h1>
          </motion.div>
          {/* Title */}
          <motion.h2 variants={item} className="text-xl md:text-2xl text-gray-200 mb-5 font-light">
            {translations.hero.title}
          </motion.h2>

          {/* Description */}
          <motion.p variants={item} className="text-base text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
            {translations.hero.description}
          </motion.p>

          {/* Social links */}
          <motion.div variants={item} className="flex flex-wrap justify-center gap-3 mb-8">
            {socials.map(({ href, icon: Icon, label }) => (
              <MagneticLink key={label} href={href} label={label}>
                <Icon size={16} />
                {label}
              </MagneticLink>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button variant="primary" size="md" onClick={() => scrollTo('projects')}>
                {translations.hero.viewProjects}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button variant="outline" size="md" onClick={() => scrollTo('contact')}>
                {translations.hero.contactMe}
              </Button>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo('about')}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 hover:text-blue-400 transition-colors group z-10 pointer-events-auto"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
          {translations.hero.scroll}
        </span>
        <ArrowDown size={24} />
      </motion.button>
    </section>
  );
};

export default Hero;