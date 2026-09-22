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
    description: "Outil pour charger et gérer des vidéos encryptées sur une interface locale",
    techStack: ["Python", "HTML", "CSS"],
    image: `${import.meta.env.BASE_URL}/images/video-loader-preview.png`,
    links: {
      github: "https://github.com/RAYAXss/VideoLoader"
    }
  },
  {
    id: 5,
    title: "Disk Analyzer",
    description: "Outil pour analyser l'utilisation du disque et identifier les fichiers volumineux",
    techStack: ["Python"],
    image: `${import.meta.env.BASE_URL}/images/disk-analyzer-preview.png`,
    status: "En développement",
    links: {
      github: "https://github.com/RAYAXss/disk_analyzer"
    }
  },
  {
    id: 6,
    title: "Password Manager",
    description: "Gestionnaire de mots de passe : salt, chiffrement SHA-256 et hachage sécurisé",
    techStack: ["Python", "Cryptographie"],
    image: "",
    icon: "🔐",
    links: {}
  },
  {
    id: 7,
    title: "Prothèse de Hanche",
    description: "Étude de faisabilité technico-économique et environnementale d'un stem de prothèse de hanche en titane imprimé 3D : analyse de marché, modélisation CAO, validation mécanique par éléments finis.",
    techStack: ["CAO", "Éléments finis", "Fabrication additive"],
    image: "",
    icon: "🦴",
    links: {}
  },
  {
    id: 8,
    title: "Jeu VR Unity",
    description: "Création d'un jeu en réalité virtuelle sur Unity, codé en C# orienté objet",
    techStack: ["Unity", "C#", "VR"],
    image: "",
    icon: "🥽",
    links: {}
  },
  {
    id: 9,
    title: "Pied Prothétique",
    description: "Conception et impression 3D de deux pieds prothétiques pour enfants et d'un socle de test : modélisation CAO, choix des matériaux, validation mécanique.",
    techStack: ["CAO", "Impression 3D", "Tests mécaniques"],
    image: "",
    icon: "🦶",
    links: {}
  },
  {
    id: 10,
    title: "Robot NAO",
    description: "Programmation d'un robot NAO pour faciliter la vie quotidienne des séniors",
    techStack: ["NAO", "Python"],
    image: "",
    icon: "🤖",
    links: {}
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
    description: "Tool for loading and managing encrypted videos on a local interface",
    techStack: ["Python", "Tkinter"],
    image: `${import.meta.env.BASE_URL}/images/video-loader-preview.png`,
    links: {
      github: "https://github.com/RAYAXss/VideoLoader"
    }
  },
  {
    id: 5,
    title: "Disk Analyzer",
    description: "Tool for analyzing disk usage and identifying large files",
    techStack: ["Python", "Tkinter"],
    image: `${import.meta.env.BASE_URL}/images/disk-analyzer-preview.png`,
    status: "In progress",
    links: {
      github: "https://github.com/RAYAXss/disk_analyzer"
    }
  },
  {
    id: 6,
    title: "Password Manager",
    description: "Password manager: salt, SHA-256 encryption, and secure hashing",
    techStack: ["Python", "Cryptography"],
    image: "",
    icon: "🔐",
    links: {}
  },
  {
    id: 7,
    title: "Hip Prosthesis",
    description: "Technical, economic and environmental feasibility study of a titanium 3D-printed hip stem: market analysis, CAD modeling, finite element validation.",
    techStack: ["CAD", "Finite elements", "Additive manufacturing"],
    image: "",
    icon: "🦴",
    links: {}
  },
  {
    id: 8,
    title: "VR Unity Game",
    description: "Virtual reality game on Unity, coded in object-oriented C#",
    techStack: ["Unity", "C#", "VR"],
    image: "",
    icon: "🥽",
    links: {}
  },
  {
    id: 9,
    title: "Prosthetic Foot",
    description: "Design and 3D printing of two prosthetic feet for children and a test base: CAD modeling, material selection, mechanical validation.",
    techStack: ["CAD", "3D Printing", "Mechanical testing"],
    image: "",
    icon: "🦶",
    links: {}
  },
  {
    id: 10,
    title: "NAO Robot",
    description: "Programming a NAO robot to help seniors in everyday life",
    techStack: ["NAO", "Python"],
    image: "",
    icon: "🤖",
    links: {}
  }
];

export const getProjects = (lang: Language): Project[] => {
  return lang === 'fr' ? projectsFR : projectsEN;
};
