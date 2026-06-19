import type { Language } from '../types/language';
import type { Project } from '../types/project';

const projectsFR: Project[] = [
  {
    id: 1,
    title: "TimeUp - Jeu de Navigateur",
    description: "Jeu multijoueur basé sur le navigateur avec synchronisation en temps réel",
    techStack: ["React", "TypeScript", "Supabase", "TailwindCSS"],
    image: `${import.meta.env.BASE_URL}/images/timesup-preview.png`,
    links: {
      github: "https://github.com/RAYAXss/timesup"
    }
  },
  {
    id: 2,
    title: "Générateur de Clips Verticaux",
    description: "Outil automatisé pour générer du contenu vidéo vertical pour les réseaux sociaux",
    techStack: ["Python", "HTML", "CSS"],
    image: `${import.meta.env.BASE_URL}/images/vertical-clips-preview.png`,
    status: "En développement",
    links: {}
  },
  {
    id: 3,
    title: "RootMe - Défis Cybersécurité",
    description: "Défis de cybersécurité et développement de compétences sur la plateforme RootMe",
    techStack: ["Security", "CTF", "Pentesting"],
    image: `${import.meta.env.BASE_URL}/images/rootme-preview.png`,
    links: {
      external: "https://www.root-me.org/RAYAX?lang=fr"
    }
  }
];

const projectsEN: Project[] = [
  {
    id: 1,
    title: "TimeUp - Browser Game",
    description: "Multiplayer browser-based game with real-time synchronization",
    techStack: ["React", "TypeScript", "Supabase", "TailwindCSS"],
    image: `${import.meta.env.BASE_URL}/images/timesup-preview.png`,
    links: {
      github: "https://github.com/RAYAXss/timesup"
    }
  },
  {
    id: 2,
    title: "Vertical Clips Generator",
    description: "Automated tool for generating vertical video content for social media",
    techStack: ["Python", "HTML", "CSS"],
    image: `${import.meta.env.BASE_URL}/images/vertical-clips-preview.png`,
    status: "In Development",
    links: {}
  },
  {
    id: 3,
    title: "RootMe - Cyber Challenges",
    description: "Cybersecurity challenges and skill development on RootMe platform",
    techStack: ["Security", "CTF", "Pentesting"],
    image: `${import.meta.env.BASE_URL}/images/rootme-preview.png`,
    links: {
      external: "https://www.root-me.org/RAYAX?lang=en"
    }
  }
];

export const getProjects = (lang: Language): Project[] => {
  return lang === 'fr' ? projectsFR : projectsEN;
};
