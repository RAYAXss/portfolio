import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Languages } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const About: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;

  const stats = [
    { icon: Briefcase,      value: translations.about.stats.experience.value, label: translations.about.stats.experience.label },
    { icon: GraduationCap, value: translations.about.stats.education.value,   label: translations.about.stats.education.label   },
    { icon: Languages,      value: translations.about.stats.languages.value,  label: translations.about.stats.languages.label  },
  ];

  const stackItems = [
    { label: 'Python',  color: 'blue'   },
    { label: 'Bash',    color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    blue:   'bg-blue-600/10 border-blue-500/40 text-blue-300',
    purple: 'bg-purple-600/10 border-purple-500/40 text-purple-300',
  };

  return (
    <section id="about" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <h2 className="text-3xl font-bold text-center mb-3 text-white">
            {translations.about.title}
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-10 rounded-full" />
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.15}>
          <p className="text-base text-gray-400 leading-relaxed whitespace-pre-line text-center max-w-2xl mx-auto mb-10">
            {translations.about.profile}
          </p>
        </FadeInOnScroll>

        {/* Stack */}
        <FadeInOnScroll delay={0.25}>
          <div className="mb-10 text-center">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-3">
              Stack principale
            </p>
            <div className="flex justify-center gap-3">
              {stackItems.map(({ label, color }) => (
                <motion.span
                  key={label}
                  whileHover={{ y: -3, scale: 1.06 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`px-5 py-2 border rounded-md text-sm font-medium cursor-default ${colorMap[color]}`}
                >
                  {label}
                </motion.span>
              ))}
            </div>
          </div>
        </FadeInOnScroll>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <FadeInOnScroll key={i} delay={0.3 + i * 0.1}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="bg-gray-900 rounded-xl p-6 text-center border border-gray-800 hover:border-blue-500/40 transition-colors group"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-blue-400 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </motion.div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
