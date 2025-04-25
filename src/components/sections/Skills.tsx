import React from 'react';
import Section from '../ui/Section';

interface Skill {
  name: string;
  level: number;
  category: 'technical' | 'healthcare' | 'soft' | 'mecanical' | 'langue';
}

const skills: Skill[] = [
  // Technical skills
  { name: 'Python et SQL', level: 90, category: 'technical' },
  { name: 'Microsoft 365 et Power Platform', level: 90, category: 'technical' },
  { name: 'Outils collaboratifs', level: 80, category: 'technical' }, // Trello, Jira, Confluence
  { name: 'Scripting et automatisation', level: 65, category: 'technical' },       // VBA + Batch

  // Healthcare skills
  { name: 'Pilotage de projet', level: 70, category: 'healthcare' }, // Gestion de projet + animation de réunion
  { name: 'Conduite du changement', level: 90, category: 'healthcare' }, 
  { name: 'Communication et coordination', level: 70, category: 'healthcare' }, // interactions + communication
  { name: 'Exploitation des données', level: 80, category: 'healthcare' }, // Capitalisation + Dashboard

  // Mecanical skills
  { name: 'Test de traction', level: 75, category: 'mecanical' },
  { name: 'Eléments finis', level: 80, category: 'mecanical' },
  { name: 'Logiciels CAO: CATIA V5, Fusion 360, Solidworks', level: 80, category: 'mecanical' },
  { name: 'Matlab', level: 60, category: 'mecanical' },
  { name: 'Impression 3D: Slicer 3D', level: 80, category: 'mecanical' },

  // Soft skills
  { name: 'Autonomie', level: 100, category: 'soft' },
  { name: 'Rigueur', level: 80, category: 'soft' },
  { name: 'Capacité d’adaptation', level: 100, category: 'soft' },
  { name: "Esprit d'initiative", level: 90, category: 'soft' },
  { name: "Proactivité", level: 90, category: 'soft' },

  // Langues
  { name: 'Français: Natif', level: 100, category: 'langue' },
  { name: 'Anglais: Professionnel', level: 90, category: 'langue' },
];

const categoryColors: Record<string, string> = {
  technical: 'bg-blue-600',
  healthcare: 'bg-green-600',
  soft: 'bg-purple-600',
  mecanical: 'bg-red-600',
  langue: 'bg-yellow-500',
};

const categoryTitles = {
  technical: 'Informatique et Programmation',
  healthcare: 'Professionnelles',
  soft: 'Soft Skills',
  mecanical: 'Modélisation et Simulation',
  langue: 'Langues',
};

const Skills: React.FC = () => {
  const renderSkillBar = (skill: Skill) => (
    <div key={skill.name} className="mb-4 group">
      <div className="text-gray-800 font-medium group-hover:scale-105 transition-transform mb-2">
        {skill.name}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full ${categoryColors[skill.category]}`}
          style={{ width: `${skill.level}%`, transition: 'width 1s ease-in-out' }}
        ></div>
      </div>
    </div>
  );

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const languageSkills = groupedSkills['langue'] || [];
  delete groupedSkills['langue'];

  return (
    <Section
      id="compétences"
      title="Mes compétences"
      subtitle="Une vue d'ensemble de mes capacités et de mon expertise"
      className="bg-gray-50"
    >
      <div className="max-w-8xl mx-auto flex flex-wrap justify-center gap-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div
            key={category}
            className="w-full sm:w-[48%] lg:w-[22%] bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
              {categoryTitles[category as keyof typeof categoryTitles]}
            </h3>
            {categorySkills.map(renderSkillBar)}
          </div>
        ))}
      </div>
  
      {languageSkills.length > 0 && (
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">Langues</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {languageSkills.map((lang) => {
              const [langName, langLevel] = lang.name.split(':');
              return (
                <div
                  key={lang.name}
                  className="w-[90px] h-[80px] bg-gray-100 rounded-lg shadow hover:shadow-md transition-all flex flex-col justify-center items-center group"
                >
                  <div className="text-gray-800 font-semibold text-center group-hover:scale-105 transition-transform">
                    {langName}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {langLevel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Section>
  );
};

export default Skills;
