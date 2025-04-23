import React, { useState } from 'react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Clock, Users, ChevronRight } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  summary: string;
  period: string;
  team: string;
  description: string;
  outcomes: string[];
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "IA dans le traitement d'AVC ischémique",
    category: "Associé à l'AP-HP",
    image: "./images/IRM.png",
    summary: "Déploiement d'outils d'intelligence artificielle sur le base d'IRM pour l'aide au diagnostic et le suivi des patients post AVC.",
    period: "Septembre 2023 - Janvier 2024",
    team: "5 ingénieurs, 2 professionnels de santé",
    description: "Faciliter le diagnostic rapide et précis des AVC ischémiques grâce à l’utilisation de l'IA pour segmenter les images d'IRM.",
    outcomes: [
      "Outil d’anonymisation automatique des données DICOM.",
      "Traitement avancé des IRM pour extraction de caractéristiques.",
      "IA prédictive pour la segmentation des lésions d'AVC de l'encaphale."
    ]
  },
  {
    id: 2,
    title: "Prothèse de Hanche",
    category: "Associé à l'EPF",
    image: "./images/hanche.png",
    summary: "Étude de faisabilité technico-économique et environnementale d’un stem de prothèse de hanche en titane imprimé en 3D.",
    period: "Septembre 2023 - Décembre 2023",
    team: "2 ingénieurs",
    description: "Étude de faisabilité technico-économique et environnementale d’un stem de prothèse de hanche en titane imprimé en 3D : analyse de marché, modélisation CAO, validation mécanique par éléments finis, étude du cycle de vie et évaluation de l’impact environnemental de la fabrication additive.",
    outcomes: [
      "Modèle CAO paramétrique imprimable en titane.",
      "Simulation par éléments finis (FEM) pour validation mécanique.",
      "Analyse de cycle de vie (ACV) de la fabrication."
    ]
  },
  {
    id: 3,
    title: "Pied Prothétique",
    category: "Associé à l'EPF",
    image: "./images/pieds.png",
    summary: "Conception d’un produit adapté à la croissance et aux besoins biomécaniques spécifiques des enfants.",
    period: "Janvier 2023 - Juin 2023",
    team: "6 étudiants ingénieurs",
    description: "Fournir une solution prothétique légère, robuste et évolutive. Respecter les contraintes fonctionnelles du client (résistance, ergonomie).",
    outcomes: [
      "Deux versions de pieds avec connectiques normalisées.",
      "Socle de test pour validation mécanique par traction et fatigue.",
      "Modèle CAO personnalisable selon la morphologie."
    ]
  }
];

const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(project => project.category === filter);

  const categories = ['all', ...new Set(projectsData.map(project => project.category))];

  return (
    <Section 
      id="projets" 
      title="Projets scolaires"
      subtitle="Solutions innovantes développées au cours de mon parcours académique"
      className="bg-gray-50"
    >
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'Tous les projets' : category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <Card key={project.id} hover className="h-full flex flex-col">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1">
                {project.category}
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{project.summary}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>{project.period}</span>
                </div>
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  <span>{project.team.split(',')[0]}</span>
                </div>
              </div>
              <Button
                onClick={() => setActiveProject(project)}
                className="w-full flex justify-center items-center"
              >
                Voir les détails
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Project Details Modal */}
      {activeProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="aspect-video w-full relative">
              <img 
                src={activeProject.image} 
                alt={activeProject.title} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{activeProject.title}</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mt-2">
                    {activeProject.category}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6 my-4 text-gray-600 text-sm">
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-blue-600" />
                  <span>{activeProject.period}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-2 text-blue-600" />
                  <span>{activeProject.team}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Description</h4>
                <p className="text-gray-700 mb-6">{activeProject.description}</p>
                
                <h4 className="text-lg font-semibold mb-2">Etapes clés</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  {activeProject.outcomes.map((outcome, idx) => (
                    <li key={idx}>{outcome}</li>
                  ))}
                </ul>
                
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setActiveProject(null)}
                  >
                    Fermer
                  </Button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default Projects;