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
    title: "CutClips - Générateur de Clips Verticaux",
    description: "Outil automatisé pour générer du contenu vidéo vertical pour les réseaux sociaux",
    techStack: ["Python", "HTML", "CSS"],
    image: `${import.meta.env.BASE_URL}/images/vertical-clips-preview.png`,
    status: "En développement",
    links: {
      github: "https://github.com/RAYAXss/CutClips"
    }
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
  },
  {
    id: 4,
    title: "VideoLoader - Chargeur de Vidéo",
    description: "Outil pour charger et gérer des vidéos sur une interface locale",
    techStack: ["Python", "HTML", "CSS"],
    image: "/images/video-loader-preview.png",
    links: {
      github: "https://github.com/RAYAXss/VideoLoader"
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
    image: "/images/vertical-clips-preview.png",
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
  },
  {
    id: 4,
    title: "VideoLoader - Video Loader",
    description: "Tool for loading and managing videos on a local interface",
    techStack: ["Python", "HTML", "CSS"],
    image: "/images/video-loader-preview.png",
    links: {
      github: "https://github.com/RAYAXss/VideoLoader"
    }
  }
];

export const getProjects = (lang: Language): Project[] => {
  return lang === 'fr' ? projectsFR : projectsEN;
};
