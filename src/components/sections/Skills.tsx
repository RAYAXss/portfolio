import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const Skills: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;

  const skillCategories = lang === 'fr' ? [
    {
      title: 'Technologies',
      skills: ['Python', 'SQL', 'Scala', 'Git/GitHub', 'Azure', 'AWS', 'Databricks', 'Jenkins']
    },
    {
      title: 'Gestion de projet',
      skills: ['Agile/Scrum', 'Jira/Trello', 'Spécifications', 'Coordination']
    }
  ] : [
    {
      title: 'Technologies',
      skills: ['Python', 'SQL', 'Scala', 'Git/GitHub', 'Azure', 'AWS', 'Databricks', 'Jenkins']
    },
    {
      title: 'Project Management',
      skills: ['Agile/Scrum', 'Jira/Trello', 'Specifications', 'Coordination']
    }
  ];

  return (
    <section id="skills" className="py-16 bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <h2 className="text-3xl font-bold text-center mb-10 text-white">
            {translations.skills.title}
          </h2>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <FadeInOnScroll key={index} delay={index * 0.2}>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-md text-sm border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
