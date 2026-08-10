import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Palette, Cpu, GraduationCap, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getExperiences } from '../../data/experiences';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import SectionHeader from '../ui/SectionHeader';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const About: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;
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
    'bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-colors hover:border-blue-400/40';

  return (
    <section id="about" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={about.eyebrow} title={about.title} />

        <FadeInOnScroll delay={0.1}>
          <p className="text-base text-gray-300 leading-relaxed whitespace-pre-line text-center max-w-2xl mx-auto mb-12">
            {about.profile}
          </p>
        </FadeInOnScroll>

        {/* Education — clickable schools */}
        <FadeInOnScroll delay={0.2}>
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
                {about.education.title}
              </p>
              <span className="text-[11px] text-gray-500">{about.education.hint}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
              {about.education.schools.map((school) => {
                const isOpen = openSchool === school.id;
                const linked = experiences.filter((e) => school.experienceIds.includes(e.id));

                return (
                  <motion.div
                    key={school.id}
                    onClick={() => setOpenSchool(isOpen ? null : school.id)}
                    className={`${cardBase} p-5 cursor-pointer ${isOpen ? 'border-blue-400/40' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-base font-bold text-white">{school.name}</h4>
                          {linked.length > 0 && (
                            <motion.span
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                              className="text-blue-400 shrink-0"
                            >
                              <ChevronDown size={16} />
                            </motion.span>
                          )}
                        </div>
                        <p className="text-sm text-blue-300">{school.degree}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{school.detail}</p>
                        {school.note && (
                          <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-200 border border-purple-400/30">
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
                          <ul className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                            {linked.map((e) => (
                              <li key={e.id} className="text-xs">
                                <div className="flex items-start gap-2">
                                  <span className="text-blue-400 mt-0.5 shrink-0">▸</span>
                                  <div>
                                    <span className="text-gray-200 font-medium">{e.title}</span>
                                    <span className="text-gray-500"> · {e.company}</span>
                                    <div className="text-gray-500">{e.period}</div>
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
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-5">
              {about.languages.title}
            </p>
            <div className="space-y-5">
              {about.languages.items.map((l, i) => (
                <div key={l.name}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm font-medium text-gray-200">{l.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-200 border border-blue-400/30">
                      {l.cert}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInOnScroll>

        {/* Interests */}
        <FadeInOnScroll delay={0.3}>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 text-center">
            {about.interests.title}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
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
                  className={`${cardBase} p-5 group`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-semibold text-gray-200">{group.title}</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="text-blue-400/70">▸</span>
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
