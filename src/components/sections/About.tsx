import React from 'react';
import { Briefcase, GraduationCap, Languages } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const About: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;

  const stats = [
    {
      icon: Briefcase,
      value: translations.about.stats.experience.value,
      label: translations.about.stats.experience.label
    },
    {
      icon: GraduationCap,
      value: translations.about.stats.education.value,
      label: translations.about.stats.education.label
    },
    {
      icon: Languages,
      value: translations.about.stats.languages.value,
      label: translations.about.stats.languages.label
    }
  ];

  return (
    <section id="about" className="py-16 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <h2 className="text-3xl font-bold text-center mb-10 text-white">
            {translations.about.title}
          </h2>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.2}>
          <div className="max-w-3xl mx-auto mb-10">
            <p className="text-base text-gray-300 leading-relaxed whitespace-pre-line text-center">
              {translations.about.profile}
            </p>
          </div>
        </FadeInOnScroll>

        {/* Stack */}
        <FadeInOnScroll delay={0.3}>
          <div className="mb-10">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 text-center">Stack principale</p>
            <div className="flex justify-center gap-3">
              <span className="px-4 py-2 bg-blue-600/10 border border-blue-500/50 text-blue-300 rounded-md text-sm font-medium">
                Python
              </span>
              <span className="px-4 py-2 bg-purple-600/10 border border-purple-500/50 text-purple-300 rounded-md text-sm font-medium">
                Bash
              </span>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <FadeInOnScroll key={index} delay={0.3 + index * 0.1}>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 text-center border border-gray-800 hover:border-blue-500 transition-all">
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-blue-400" />
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
