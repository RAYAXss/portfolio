import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Cloud, Briefcase, Users } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getSkills } from '../../data/skills';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Code2,
  Cloud,
  Briefcase,
  Users
};

const Skills: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;
  const skills = getSkills(lang);

  return (
    <section id="skills" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <h2 className="text-4xl font-bold text-center mb-16">
            {translations.skills.title}
          </h2>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((category, index) => {
            const Icon = iconMap[category.icon] || Code2;
            const isSoftSkills = category.category.toLowerCase().includes('soft');

            return (
              <FadeInOnScroll key={index} delay={index * 0.15}>
                <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border-t-4 border-blue-600 hover:-translate-y-1 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <Icon className="w-12 h-12 text-blue-400" />
                    <h3 className="text-xl font-bold">{category.category}</h3>
                  </div>

                  {isSoftSkills ? (
                    // Soft skills as badges
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-blue-50 hover:text-blue-300 transition-colors"
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    // Technical skills as progress bars
                    <div className="space-y-4">
                      {category.skills.map((skill, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-300">
                              {skill.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeInOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
