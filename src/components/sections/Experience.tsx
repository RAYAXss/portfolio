import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getExperiences } from '../../data/experiences';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import SectionHeader from '../ui/SectionHeader';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const Experience: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;
  const experiences = getExperiences(lang);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggle = (id: number) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  return (
    <section id="experience" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={lang === 'fr' ? 'PARCOURS' : 'CAREER'}
          title={translations.experience.title}
        />

        <div className="relative">
          {/* Timeline spine */}
          <div className="hidden md:block absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/60 via-purple-500/40 to-transparent" />

          <div className="space-y-6">
            {experiences.map((exp, index) => {
              const isExpanded = expandedIds.includes(exp.id);
              const visible = isExpanded ? exp.responsibilities : exp.responsibilities.slice(0, 3);

              return (
                <FadeInOnScroll key={exp.id} delay={index * 0.1} direction="left">
                  <div className="relative flex gap-8">
                    {/* Timeline dot */}
                    <div className="hidden md:flex flex-col items-center">
                      <motion.div
                        animate={isExpanded ? { scale: 1.3 } : { scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="w-10 h-10 rounded-full bg-gray-950 border-2 border-blue-500 flex items-center justify-center mt-1 flex-shrink-0 z-10 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      </motion.div>
                    </div>

                    {/* Card */}
                    <motion.div
                      layout
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-400/40 rounded-xl overflow-hidden transition-colors cursor-pointer"
                      onClick={() => toggle(exp.id)}
                    >
                      <div className="p-5">
                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-white mb-1">{exp.title}</h3>
                          <h4 className="text-sm text-blue-300 mb-3">{exp.company}</h4>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={13} /> {exp.period}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin size={13} /> {exp.location}
                            </span>
                            <span className="px-2.5 py-0.5 bg-blue-500/15 text-blue-200 border border-blue-400/30 rounded-full font-medium">
                              {exp.contractType}
                            </span>
                          </div>
                        </div>

                        {/* Responsibilities with AnimatePresence */}
                        <ul className="space-y-1.5 mb-3">
                          {visible.map((resp, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              className="flex items-start gap-2 text-xs text-gray-300"
                            >
                              <span className="text-blue-400 mt-0.5 shrink-0">▸</span>
                              {resp}
                            </motion.li>
                          ))}
                        </ul>

                        {exp.responsibilities.length > 3 && (
                          <button
                            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-medium mt-2 transition-colors"
                            onClick={(e) => { e.stopPropagation(); toggle(exp.id); }}
                          >
                            {isExpanded
                              ? (lang === 'fr' ? 'Voir moins' : 'View less')
                              : (lang === 'fr' ? 'Voir plus'  : 'View more')}
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                            >
                              <ChevronDown size={14} />
                            </motion.span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
