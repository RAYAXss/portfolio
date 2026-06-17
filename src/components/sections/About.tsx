import React from 'react';
import { Briefcase, GraduationCap, Globe, Languages, Dumbbell, Palette, Cpu } from 'lucide-react';
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
      icon: Globe,
      value: translations.about.stats.expertise.value,
      label: translations.about.stats.expertise.label
    },
    {
      icon: Languages,
      value: translations.about.stats.languages.value,
      label: translations.about.stats.languages.label
    }
  ];

  const interests = [
    {
      icon: Dumbbell,
      title: translations.about.interests.sport.title,
      items: translations.about.interests.sport.items
    },
    {
      icon: Palette,
      title: translations.about.interests.art.title,
      items: translations.about.interests.art.items
    },
    {
      icon: Cpu,
      title: translations.about.interests.tech.title,
      items: translations.about.interests.tech.items
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <h2 className="text-4xl font-bold text-center mb-12">
            {translations.about.title}
          </h2>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.2}>
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line text-center">
              {translations.about.profile}
            </p>
          </div>
        </FadeInOnScroll>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <FadeInOnScroll key={index} delay={0.3 + index * 0.1}>
              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>

        {/* Interests */}
        <FadeInOnScroll delay={0.7}>
          <h3 className="text-2xl font-bold text-center mb-8">
            {translations.about.interests.title}
          </h3>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interests.map((interest, index) => (
            <FadeInOnScroll key={index} delay={0.8 + index * 0.15}>
              <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 hover:shadow-md transition-all">
                <interest.icon className="w-8 h-8 mb-4 text-blue-600" />
                <h4 className="text-xl font-semibold mb-3">{interest.title}</h4>
                <ul className="space-y-2 text-gray-700">
                  {interest.items.map((item, idx) => (
                    <li key={idx} className="text-sm">• {item}</li>
                  ))}
                </ul>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
