import React, { useState } from 'react';
import Section from '../ui/Section';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';

interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
}

const educationData: Education[] = [
  {
    id: 1,
    degree: "Diplôme d'ingénieur",
    institution: "EPF école d'ingénieurs",
    location: "Cachan, France",
    period: "2019 - 2024",
    description: "Spécialisé dans le domaine de la Santé et de l'Ingénierie.",
    achievements: [
      "Projets orientés SI & santé : gestion de projet (Agile, cycle en V), qualité, conduite du changement, analyse fonctionnelle, rédaction de spécifications",
      "Projets effectués dans le développement de dispositifs médicaux normés au Medical Device Regulation (MDR)",
      "Compétences en conception et validation : modélisation 3D (CATIA V5, SolidWorks, Fusion 360), simulation, tests fonctionnels et conformité réglementaire"
    ]
  },
  {
    id: 2,
    degree: "Baccalauréat",
    institution: "Lycée Saint Erembert",
    location: "Saint Germain-en-Laye, France",
    period: "2016 - 2019",
    description: "Bac Scientifique Option SVT - Spécialisation Physique ",
    achievements: [
      "Diplômé avec Mention BIEN",
      "Spécialité en Physique",
      "Participé à la création d'une pièce de théatre ODYSSEUS, puis Option Théâtre"
      
    ]
  }
];

const Education: React.FC = () => {
  const [activeId, setActiveId] = useState<number>(educationData[0].id);

  return (
    <Section 
      id="education" 
      title="Education"
      subtitle="Mon parcours académique et mes qualifications"
      dark
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {educationData.map((edu) => (
              <button
                key={edu.id}
                onClick={() => setActiveId(edu.id)}
                className={`w-full text-left p-4 border-l-4 transition-all ${
                  activeId === edu.id 
                    ? 'border-blue-500 bg-gray-700' 
                    : 'border-transparent hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <GraduationCap 
                    size={20} 
                    className={`mr-3 ${activeId === edu.id ? 'text-blue-400' : 'text-gray-400'}`} 
                  />
                  <div>
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-sm text-gray-400">{edu.institution}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {educationData.map((edu) => (
            <div 
              key={edu.id}
              className={`bg-gray-800 rounded-lg p-6 shadow-lg transition-opacity duration-300 ${
                activeId === edu.id ? 'opacity-100' : 'hidden'
              }`}
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-400">{edu.degree}</h3>
              <h4 className="text-xl mb-6">{edu.institution}</h4>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <Calendar size={18} className="mr-2 text-blue-400" />
                  <span>{edu.period}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin size={18} className="mr-2 text-blue-400" />
                  <span>{edu.location}</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {edu.description}
              </p>
              
              <div>
                <h5 className="text-lg font-medium mb-3 flex items-center">
                  <Award size={18} className="mr-2 text-blue-400" />
                  <span>Principales réalisations</span>
                </h5>
                <ul className="list-disc list-inside text-gray-300 space-y-2 pl-6">
                  {edu.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Education;