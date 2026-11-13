import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, ExternalLink, ArrowDown } from 'lucide-react';

import { useLanguage } from '../../hooks/useLanguage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Button from '../ui/Button';
import SplitText from '../reactbits/SplitText';


/* ─────────────────────────────────────────────
   Hero
───────────────────────────────────────────── */

const Hero: React.FC = () => {
  const { t: translations } = useLanguage();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Parallax doux du contenu au scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 pointer-events-none"
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">
        <motion.div
          style={reducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Welcome badge */}
          <motion.div variants={item} className="mb-7 inline-flex">
            <motion.span
              animate={
                reducedMotion
                  ? undefined
                  : { boxShadow: ['0 0 0 var(--glow)', '0 0 26px var(--glow)', '0 0 0 var(--glow)'] }
              }
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="px-4 py-1.5 rounded-full border border-accent/30 text-xs tracking-widest font-medium bg-accent/5"
            >
              <span className="relative mr-2 inline-flex w-2 h-2 align-middle">
                {!reducedMotion && <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />}
                <span className="relative w-2 h-2 rounded-full bg-accent" />
              </span>
              <span className="text-accent">{translations.hero.welcome}</span>
            </motion.span>
          </motion.div>

          <motion.div variants={item}>
            <h1 className="text-4xl md:text-6xl font-bold mb-3 text-content">
              <SplitText text={translations.hero.name} className="justify-center" />
            </h1>
          </motion.div>
          {/* Title */}
          <motion.h2 variants={item} className="text-xl md:text-2xl mb-5 font-light">
            <span className="text-content-muted">{translations.hero.title}</span>
          </motion.h2>

          {/* Description */}
          <motion.p variants={item} className="text-base text-content-muted mb-8 max-w-xl mx-auto leading-relaxed">
            {translations.hero.description}
          </motion.p>

          {/* Domaines */}
          <motion.ul variants={item} className="flex flex-wrap justify-center gap-2 mb-8" aria-label={translations.hero.title}>
            {translations.hero.focus.map((f) => (
              <li key={f} className="px-3 py-1 rounded-md text-xs font-medium border border-accent/30 bg-accent/5 text-content-muted">
                {f}
              </li>
            ))}
          </motion.ul>

          {/* Social links */}
          <motion.div variants={item} className="flex flex-wrap justify-center gap-3 mb-8">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-strong text-content-faint text-sm hover:border-accent/60 hover:text-accent hover:bg-accent/5 transition-colors"
                >
                  <Icon size={16} />
                  {label}
                </a>
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-content-faint hover:text-accent transition-colors group z-10 pointer-events-auto"
        animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
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