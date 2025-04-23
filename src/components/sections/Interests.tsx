import React from 'react';
import Section from '../ui/Section';
import {
    Dumbbell,
    Sparkles,
    Activity,
    Globe,
    Palette,
    Pencil
  } from 'lucide-react';

interface Interest {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const interests: Interest[] = [
    {
        id: 1,
        title: "Calisthenics",
        description: "Entraînements au poids du corps, pratiqués 2 à 3 fois par semaine pour le plaisir du dépassement.",
        icon: <Dumbbell className="text-purple-500" size={32} />,
        image: "./images/street.png"
    },
    {
        id: 2,
        title: "Univers Star Wars",
        description: "Fan de l’univers étendu (Légendes), je dévore romans et séries, et garde une tendresse pour les Lego Star Wars.",
        icon: <Sparkles className="text-blue-500" size={32} />,
        image: "./images/starwars.jpg"
    },
    {
        id: 3,
        title: "Course à pied",
        description: "Sorties de 10 à 12 km, avec l’objectif de courir un semi-marathon prochainement.",
        icon: <Activity className="text-green-500" size={32} />,
        image: "https://images.pexels.com/photos/2168292/pexels-photo-2168292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        id: 4,
        title: "Poterie",
        description: "Modelage de figurines inspirées de la culture pop avec de l’argile autodurcissante. Une vraie bulle créative.",
        icon: <Palette className="text-amber-500" size={32} />,
        image: "./images/crocmou.jpg"
    },
    {
        id: 5,
        title: "Dessin",
        description: "Croquis sur carnet de personnages issus des univers japonais et pop culture. Une pratique régulière et relaxante.",
        icon: <Pencil className="text-red-500" size={32} />,
        image: "./images/dessin.jpg"
    },
    {
        id: 6,
        title: "Japon",
        description: "Voyage initiatique et passion durable pour la culture japonaise, son animation, sa langue et son esthétique.",
        icon: <Globe className="text-teal-500" size={32} />,
        image: "./images/japon.jpg"
    }
];

const Interests: React.FC = () => {
  return (
    <Section
      id="interests"
      title="Activités et Intérêts"
      subtitle="Explorateur passionné : Harmoniser la pratique sportive avec l'expression créative."
      dark
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {interests.map((interest) => (
          <div
            key={interest.id}
            className="group relative overflow-hidden rounded-xl bg-gray-800 hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={interest.image}
                alt={interest.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90">
              <div className="absolute bottom-0 p-6 flex flex-col h-full justify-end">
                <div className="mb-4">{interest.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{interest.title}</h3>
                <p className="text-gray-300 text-sm">{interest.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Interests;