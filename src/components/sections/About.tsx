import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Palette, Cpu, GraduationCap, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getExperiences } from '../../data/experiences';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import SectionHeader from '../ui/SectionHeader';
import SpotlightCard from '../reactbits/SpotlightCard';
import Counter from '../reactbits/Counter';

const About: React.FC = () => {
  const { lang, t: translations } = useLanguage();
  const about = translations.about;
  const experiences = getExperiences(lang);
  const [openSchool, setOpenSchool] = useState<string | null>(null);

  const interestIcons: Record<string, LucideIcon> = {
    sport: Dumbbell,
    art: Palette,
    tech: Cpu,
  };
  const interestKeys = ['sport', 'art', 'tech'] as const;

  const cardBase =
    'bg-glass backdrop-blur-md border border-border/10 rounded-2xl transition-colors hover:border-accent/40';

  /* Split "3 ans" → number 3 + suffix " ans" (sinon valeur brute) */
  const splitStat = (value: string): { number: number | null; suffix: string } => {
    const match = value.match(/^(\d+)\s*(.*)$/);
    if (!match) return { number: null, suffix: value };
    return { number: parseInt(match[1], 10), suffix: match[2] };
  };

  return (
    <section id="about" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={about.title} align="center" />

        <FadeInOnScroll delay={0.1}>
          <SpotlightCard className="mb-12 p-6 sm:p-8">
            <p className="text-base text-content-muted leading-relaxed whitespace-pre-line text-center max-w-2xl mx-auto">
              {about.profile}
            </p>
          </SpotlightCard>
        </FadeInOnScroll>

        {/* Stats — résumé scannable */}
        <FadeInOnScroll delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            {Object.values(about.stats).map((stat) => {
              const { number, suffix } = splitStat(stat.value);
              return (
                <SpotlightCard key={stat.label} className="p-4 text-center">
                  {number !== null ? (
                    <p className="inline-flex items-baseline gap-1 text-2xl font-bold text-accent">
                      <Counter value={number} fontSize={32} textColor="inherit" />
                      <span>{suffix}</span>
                    </p>
                  ) : (
                    <p className="text-2xl font-bold text-accent">{stat.value}</p>
                  )}
                  <p className="text-xs text-content-muted mt-1">{stat.label}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </FadeInOnScroll>

        {/* Education — clickable schools */}
        <FadeInOnScroll delay={0.2}>
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-xs font-semibold text-accent uppercase tracking-widest">
                {about.education.title}
              </p>
              <span className="text-[11px] text-content-faint">{about.education.hint}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {about.education.schools.map((school) => {
                const isOpen = openSchool === school.id;
                const linked = experiences.filter((e) => school.experienceIds.includes(e.id));

                return (
                  <motion.div
                    key={school.id}
                    onClick={() => setOpenSchool(isOpen ? null : school.id)}
                    className={`${cardBase} p-6 cursor-pointer ${isOpen ? 'border-accent/40' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-lg font-bold text-content">{school.name}</h4>
                          {linked.length > 0 && (
                            <motion.span
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                              className="text-accent shrink-0"
                            >
                              <ChevronDown size={16} />
                            </motion.span>
                          )}
                        </div>
                        <p className="text-sm text-accent">{school.degree}</p>
                        <p className="text-xs text-content-faint mt-0.5">{school.detail}</p>
                        {school.note && (
                          <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-accent-2/15 text-accent-2 border border-accent-2/30">
                            {school.note}
                          </span>
                        )}
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && linked.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-4 pt-4 border-t border-border/10 space-y-2.5">
                            {linked.map((e) => (
                              <li key={e.id} className="text-xs">
                                <div className="flex items-start gap-2">
                                  <span className="text-accent mt-0.5 shrink-0">▸</span>
                                  <div>
                                    <span className="text-content font-medium">{e.title}</span>
                                    <span className="text-content-faint"> · {e.company}</span>
                                    <div className="text-content-faint">{e.period}</div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </FadeInOnScroll>

        {/* Languages */}
        <FadeInOnScroll delay={0.25}>
          <div className={`${cardBase} p-6 max-w-3xl mx-auto mb-8`}>
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-5">
              {about.languages.title}
            </p>
            <div className="space-y-5">
              {about.languages.items.map((l, i) => (
                <div key={l.name}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm font-medium text-content">{l.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                      {l.cert}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInOnScroll>

        {/* Interests */}
        <FadeInOnScroll delay={0.3}>
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-4 text-center">
            {about.interests.title}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {interestKeys.map((key, i) => {
              const group = about.interests[key];
              const Icon = interestIcons[key];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`${cardBase} p-6 group`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h4 className="text-base font-semibold text-content">{group.title}</h4>
                  </div>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-content-muted">
                        <span className="text-accent/70">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default About;
