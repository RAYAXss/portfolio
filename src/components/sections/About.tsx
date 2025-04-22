import React from 'react';
import Section from '../ui/Section';
import { Wrench, ShieldCheck, Activity } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Section 
      id="a propos" 
      title="A propos de moi"
      subtitle="Engagé pour une ingénierie exigeante, tournée vers des solutions robustes, sécurisées et interconnectées."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="col-span-1">
          <div className="aspect-square rounded-xl overflow-hidden mb-6 shadow-lg transform transition-transform duration-500 hover:rotate-2">
            <img 
              src="/images/pp_solutec.jpg" 
              alt="Quentin COLPART" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-2">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              🎓 Jeune diplômé de l’EPF, spécialisé en Santé & Ingénierie, j’évolue à l’interface entre les besoins utilisateurs et les solutions techniques.
            Grâce à des projets en lien avec la modélisation de dispositifs médicaux, la data visualisation et l’automatisation de processus métiers, j’ai acquis une réelle expertise fonctionnelle : recueil des besoins, cadrage, spécifications, conduite du changement, dans des environnements réglementés (ISO 13485, RGPD, données de santé).
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              💡 J'interviens également sur la mise en œuvre de solutions techniques, avec des compétences éprouvées en Python (traitement d’image, interfaces, analyse de données), Business Intelligence (Power BI, Power Automate) et conception mécanique (CAO, FEM).
            </p>
            
            <p className="text-lg leading-relaxed">
              Aujourd’hui, je cherche à rejoindre une équipe dynamique dans le secteur de la santé ou numérique, pour contribuer à des projets à fort impact, alliant sens, technologie et collaboration.
            </p>
          </div>
          
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-6">Mes intérêts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <Wrench className="text-indigo-600 mb-4" size={32} />
                <h4 className="font-medium text-lg mb-2">Ingénierie appliquée</h4>
                <p className="text-gray-600">Concevoir des solutions concrètes face à des problématiques terrain à fort enjeu technique et réglementaire.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <ShieldCheck className="text-green-600 mb-4" size={32} />
                <h4 className="font-medium text-lg mb-2">Sécurité et qualité</h4>
                <p className="text-gray-600">Approfondir la maîtrise des environnements normés et contribuer à des systèmes robustes et interopérables.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <Activity className="text-purple-600 mb-4" size={32} />
                <h4 className="font-medium text-lg mb-2">Pilotage de projets</h4>
                <p className="text-gray-600">Travailler en équipe pluridisciplinaire pour transformer des idées en solutions concrètes et impactantes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;