import React, { useState } from 'react';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getExperiences } from '../../data/experiences';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import Card from '../ui/Card';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const Experience: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;
  const experiences = getExperiences(lang);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <section id="experience" className="py-16 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <h2 className="text-3xl font-bold text-center mb-10">
            {translations.experience.title}
          </h2>
        </FadeInOnScroll>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-blue-300" />

          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const isExpanded = expandedIds.includes(exp.id);
              const visibleResponsibilities = isExpanded
                ? exp.responsibilities
                : exp.responsibilities.slice(0, 4);

              return (
                <FadeInOnScroll key={exp.id} delay={index * 0.15}>
                  <div className="relative">
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-8 top-4 w-4 h-4 -translate-x-1/2 rounded-full bg-blue-600 border-4 border-blue-100" />

                    <Card
                      hover
                      className="md:ml-20 border-l-4 border-blue-500 overflow-hidden cursor-pointer"
                      onClick={() => toggleExpand(exp.id)}
                    >
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {exp.title}
                            </h3>
                            <h4 className="text-base text-blue-400 mb-3">
                              {exp.company}
                            </h4>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{exp.period}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{exp.location}</span>
                              </div>
                              <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-xs font-medium">
                                {exp.contractType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Responsibilities */}
                        <div className="mb-4">
                          <h5 className="text-base font-medium mb-3 text-gray-200">
                            {lang === 'fr' ? 'Missions :' : 'Responsibilities:'}
                          </h5>
                          <ul className="space-y-2">
                            {visibleResponsibilities.map((resp, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-300">
                                <span className="text-blue-400 mt-1">•</span>
                                <span className="text-sm">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Expand/Collapse Button */}
                        {exp.responsibilities.length > 4 && (
                          <button
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm mt-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(exp.id);
                            }}
                          >
                            <span>
                              {isExpanded
                                ? lang === 'fr' ? 'Voir moins' : 'View less'
                                : lang === 'fr' ? 'Voir plus' : 'View more'}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}
                      </div>
                    </Card>
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
