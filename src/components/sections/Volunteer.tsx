import React from 'react';
import Section from '../ui/Section';
import { Heart, Users, Calendar } from 'lucide-react';

interface VolunteerExperience {
  id: number;
  organization: string;
  role: string;
  period: string;
  description: string;
  impact: string;
}

const volunteerExperiences: VolunteerExperience[] = [
  {
    id: 1,
    organization: "EPF Rotaract",
    role: "Vice-Président",
    period: "2022 - 2023",
    description: "Devéloppement des relations entre l'EPF et le Rotary club Porte-d'Orléans.",
    impact: "Aider les étudiants EPF dans leurs recherches de stages - Sensibilisation des règles menstruelles avec des ateliers avec un simulateur de règles."
  },
  {
    id: 2,
    organization: "EPF Boutique",
    role: "Trésorier",
    period: "2021 - 2022",
    description: "Gestion du budget.",
    impact: "Suivi des ventes des accessoires à l'effigie de l'école EPF."
  },
  {
    id: 3,
    organization: "EPF Tutorat",
    role: "Enseignement Maths/Physique",
    period: "2021 - 2022",
    description: "Tutorat en Ecole d'ingénieur.",
    impact: "Animation de cours particulier en Mathématique appliquée et Physique."
  }
];

const Volunteer: React.FC = () => {
  return (
    <Section
      id="volunteer"
      title="Expériences Associatives"
      subtitle="Contribution à la vie associative de l'école."
      className="bg-gray-50"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {volunteerExperiences.map((experience) => (
          <div
            key={experience.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <Heart className="text-red-500 mr-3" size={24} />
              <h3 className="text-xl font-bold text-gray-800">{experience.organization}</h3>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center text-gray-600 mb-2">
                <Users className="mr-2" size={16} />
                <span className="font-medium">{experience.role}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="mr-2" size={14} />
                <span>{experience.period}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              {experience.description}
            </p>
            
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Impact:</h4>
              <p className="text-gray-600 text-sm">
                {experience.impact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Volunteer;