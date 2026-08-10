import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import SectionHeader from '../ui/SectionHeader';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

/* ─────────────────────────────────────────────
   Skills section with:
   - Magnetic mouse-follow effect on chips
   - Float animation on category cards
   - Stagger reveal on viewport entry
───────────────────────────────────────────── */

/* Single magnetic chip */
const MagneticChip: React.FC<{ skill: string; delay: number }> = ({ skill, delay }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    /* Magnetic pull — max 10px */
    const dist = Math.sqrt(dx * dx + dy * dy);
    const strength = Math.max(0, 1 - dist / 80);
    x.set(dx * strength * 0.5);
    y.set(dy * strength * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 280, damping: 20, delay }}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`px-3 py-1.5 rounded-lg text-sm border cursor-default select-none transition-colors duration-150 ${
        hovered
          ? 'bg-blue-500/10 border-blue-400/60 text-blue-300 shadow-[0_0_16px_rgba(96,165,250,0.2)]'
          : 'bg-gray-800 border-gray-700 text-gray-300'
      }`}
    >
      {skill}
    </motion.span>
  );
};

/* Floating card wrapper */
const FloatCard: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 200, damping: 22, delay }}
      whileHover={{ y: -6 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-400/40 rounded-2xl p-6 transition-colors relative overflow-hidden group"
    >
      {/* Ambient glow on hover */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.08), transparent 60%)' }}
      />
      {children}
    </motion.div>
  );
};


const Skills: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;

  const skillCategories = lang === 'fr'
    ? [
        {
          title: 'Cybersécurité & GRC',
          emoji: '🛡️',
          skills: ['Analyse de risques', 'GRC', 'Sensibilisation', 'Tableaux de bord sécurité', 'Power BI', 'CTF / RootMe', 'Pentesting'],
        },
        {
          title: 'Technologies',
          emoji: '⚙️',
          skills: ['Python', 'SQL', 'Scala', 'Git/GitHub', 'Azure', 'AWS', 'Databricks', 'Jenkins'],
        },
        {
          title: 'Gestion de projet',
          emoji: '📋',
          skills: ['Agile/Scrum', 'Jira/Trello', 'Spécifications', 'Coordination'],
        },
      ]
    : [
        {
          title: 'Cybersecurity & GRC',
          emoji: '🛡️',
          skills: ['Risk analysis', 'GRC', 'Awareness', 'Security dashboards', 'Power BI', 'CTF / RootMe', 'Pentesting'],
        },
        {
          title: 'Technologies',
          emoji: '⚙️',
          skills: ['Python', 'SQL', 'Scala', 'Git/GitHub', 'Azure', 'AWS', 'Databricks', 'Jenkins'],
        },
        {
          title: 'Project Management',
          emoji: '📋',
          skills: ['Agile/Scrum', 'Jira/Trello', 'Specifications', 'Coordination'],
        },
      ];

  return (
    <section id="skills" className="py-20 relative">
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={lang === 'fr' ? 'STACK' : 'STACK'} title={translations.skills.title} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillCategories.map((category, catIdx) => (
            <FloatCard key={catIdx} delay={catIdx * 0.12}>
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <span>{category.emoji}</span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <MagneticChip
                    key={idx}
                    skill={skill}
                    delay={catIdx * 0.1 + idx * 0.04}
                  />
                ))}
              </div>
            </FloatCard>
          ))}
        </div>

        {/* Floating ambient pills belt */}
        <FadeInOnScroll delay={0.4}>
          <div className="mt-8 overflow-hidden relative" style={{ height: 48 }}>
            <motion.div
              className="flex gap-3 absolute"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            >
              {[...skillCategories.flatMap(c => c.skills), ...skillCategories.flatMap(c => c.skills)].map((s, i) => (
                <span
                  key={i}
                  className="shrink-0 px-3 py-1.5 bg-white/5 border border-white/10 text-gray-500 rounded-full text-xs"
                >
                  {s}
                </span>
              ))}
            </motion.div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default Skills;
