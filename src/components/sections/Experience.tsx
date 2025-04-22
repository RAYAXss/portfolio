import React, { useState } from 'react';
import Section from '../ui/Section';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  responsibilities: string[];
}

// Placeholder experiences to be updated later
const experienceData: Experience[] = [
  {
    id: 1,
    title: "Responsable d'application",
    company: "ME3D Graft - Your Anastomosis",
    location: "Pécs, Hongrie",
    period: "Février 2024 - Mars 2025",
    description: "Comment optimiser les simulateurs pour améliorer la précision des résultats et assurer une intégration efficace avec les systèmes existants ?",
    responsibilities: [
      "Conduite du cadrage fonctionnel et recueil des besoins utilisateurs (chirurgiens, ingénieurs 3D)",
      "Développement d’une application Python pour l’analyse d’images et la reconstruction 3D",
      "Mise en place d’une gestion Agile : backlog, user stories, sprints",
      "Accompagnement au changement des parties prenantes",
      "Suivi post-livraison : tests fonctionnels, maintenance corrective et évolutive, coordination technique"
    ]
  },
  {
    id: 2,
    title: "Chef de projet",
    company: "Assistance Publique - Hôpitaux de Paris",
    location: "Garches, France",
    period: "Septembre 2023 - Janvier 2024",
    description: "Exploiter l’IA afin de développer un outil d’aide au diagnostic et au suivi des patients atteints d’AVC sur une base d’IRM.",
    responsibilities: [
      "Recueil des besoins auprès de radiologues et cliniciens, animation d’ateliers",
      "Rédaction de spécifications fonctionnelles, gestion du backlog Agile (Trello)",
      "Formation des utilisateurs finaux, support fonctionnel, documentation",
      "Préparation des jeux de données (anonymisation DICOM, traitement via Python)",
      "Conception et entraînement de modèles de segmentation (TensorFlow)"
    ]
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "Equans",
    location: "Courbevoie, France",
    period: "Septembre 2022 - Janvier 2023",
    description: "Participation à la construction des Dashboard Security et outils de Reporting des risques cyber",
    responsibilities: [
      "Coordination en interne, animation des rituels agiles (daily, sprint review, rétro)",
      "Déploiement de campagnes de sensibilisation cyber: planning, supports, communication interne",
      "Création de tableaux de bord Power BI pour le suivi d’indicateurs de maturité et d’engagement",
      "Automatisation de processus (formulaires, workflows, alertes) avec Power Automate",
      "Élaboration d’analyses de risques en interne via matrices impact/vraisemblance"
    ]
  }
];

const Experience: React.FC = () => {
  const [activeId, setActiveId] = useState<number>(experienceData[0].id);

  return (
    <Section 
      id="expériences" 
      title="Expériences Professionnelles"
      subtitle="Mon parcours professionnel en Ingénierie"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="border-l-2 border-gray-200">
            {experienceData.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setActiveId(exp.id)}
                className={`block w-full text-left pl-6 py-4 relative transition-all hover:bg-gray-50 ${
                  activeId === exp.id ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                <div 
                  className={`absolute w-4 h-4 rounded-full left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                    activeId === exp.id ? 'bg-blue-600 border-4 border-blue-100' : 'bg-gray-300'
                  }`}
                ></div>
                <h3 className="font-medium text-lg">{exp.title}</h3>
                <p className="text-sm text-gray-500">{exp.company}</p>
                <p className="text-xs text-gray-400">{exp.period}</p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="lg:w-2/3">
          {experienceData.map((exp) => (
            <div 
              key={exp.id}
              className={`bg-white rounded-lg p-6 shadow-lg transition-opacity duration-300 ${
                activeId === exp.id ? 'opacity-100' : 'hidden'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800">{exp.title}</h3>
                <h4 className="text-lg text-blue-600 mb-4">{exp.company}</h4>
                
                <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                {exp.description}
              </p>
              
              <div>
                <h5 className="text-lg font-medium mb-3 text-gray-800">Missions:</h5>
                <ul className="space-y-3">
                  {exp.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <ArrowRight size={16} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
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

export default Experience;