import type { Language } from '../types/language';
import type { Project, ProjectCategory, ProjectLink } from '../types/project';

/*
 * Projets : la partie commune (catégorie, liens, captures, outils) est écrite une fois,
 * les textes sont doublés FR / EN.
 * Pour ajouter un rapport ou un mémoire : déposer le PDF dans public/docs/projects/
 * puis ajouter { kind: 'report', url: file('docs/projects/nom.pdf') } dans links.
 */

const file = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const img = (name: string) => file(`images/${name}`);

interface ProjectBase {
  id: string;
  category: ProjectCategory;
  techStack: string[];
  images: string[];
  links: ProjectLink[];
}

type ProjectText = Pick<Project, 'title' | 'summary' | 'description' | 'highlights' | 'context' | 'status'> &
  Partial<Pick<Project, 'techStack'>>; // techStack ici seulement s'il se traduit

const base: ProjectBase[] = [
  {
    id: 'timeup',
    category: 'dev',
    techStack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    images: [img('timesup-preview.png')],
    links: [{ kind: 'code', url: 'https://github.com/RAYAXss/timesup' }],
  },
  {
    id: 'cutclips',
    category: 'dev',
    techStack: ['Python', 'HTML', 'CSS'],
    images: [img('vertical-clips-preview.png')],
    links: [{ kind: 'code', url: 'https://github.com/RAYAXss/CutClips' }],
  },
  {
    id: 'rootme',
    category: 'cyber',
    techStack: ['CTF', 'Pentesting'],
    images: [img('rootme-preview.png')],
    links: [{ kind: 'profile', url: 'https://www.root-me.org/RAYAX' }],
  },
  {
    id: 'password-manager',
    category: 'cyber',
    techStack: ['Python', 'SHA-256'],
    images: [],
    links: [],
  },
  {
    id: 'videoloader',
    category: 'dev',
    techStack: ['Python', 'Tkinter'],
    images: [img('video-loader-preview.png')],
    links: [{ kind: 'code', url: 'https://github.com/RAYAXss/VideoLoader' }],
  },
  {
    id: 'disk-analyzer',
    category: 'dev',
    techStack: ['Python', 'Tkinter'],
    images: [img('disk-analyzer-preview.png')],
    links: [{ kind: 'code', url: 'https://github.com/RAYAXss/disk_analyzer' }],
  },
  {
    id: 'hip-prosthesis',
    category: 'engineering',
    techStack: [],
    images: [],
    links: [],
  },
  {
    id: 'prosthetic-foot',
    category: 'engineering',
    techStack: [],
    images: [],
    links: [],
  },
  {
    id: 'vr-unity',
    category: 'dev',
    techStack: ['Unity', 'C#', 'VR'],
    images: [],
    links: [],
  },
  {
    id: 'nao',
    category: 'engineering',
    techStack: ['NAO', 'Python'],
    images: [],
    links: [],
  },
];

const textFR: Record<string, ProjectText> = {
  timeup: {
    title: 'TimeUp',
    summary: 'Jeu multijoueur dans le navigateur, synchronisé en temps réel.',
    description:
      "Jeu multijoueur jouable depuis le navigateur. Les parties sont synchronisées en temps réel entre les joueurs grâce à Supabase.",
    highlights: ['Interface en React et TypeScript', 'Synchronisation temps réel des parties avec Supabase'],
    context: 'Projet personnel',
  },
  cutclips: {
    title: 'CutClips',
    summary: 'Génère automatiquement des clips verticaux pour les réseaux sociaux.',
    description:
      'Outil qui découpe des vidéos en clips au format vertical, prêts à publier sur TikTok et les réseaux sociaux.',
    highlights: ['Découpage et mise au format vertical automatisés en Python', 'Interface web simple en HTML / CSS'],
    context: 'Projet personnel',
  },
  rootme: {
    title: 'Root-Me',
    summary: 'Challenges de cybersécurité pour pratiquer la sécurité offensive.',
    description:
      "Pratique régulière sur la plateforme Root-Me pour progresser sur les techniques d'attaque et mieux comprendre ce qu'il faut défendre.",
    highlights: ['Challenges CTF', 'Pratique du pentest en environnement contrôlé'],
    context: 'Pratique personnelle',
  },
  'password-manager': {
    title: 'Password Manager',
    summary: 'Gestionnaire de mots de passe avec sel et hachage SHA-256.',
    description:
      'Gestionnaire de mots de passe local écrit en Python, pour mettre en pratique les bases du stockage sécurisé des secrets.',
    highlights: ['Salage des mots de passe', 'Hachage SHA-256'],
    context: 'Projet personnel',
  },
  videoloader: {
    title: 'VideoLoader',
    summary: 'Charge et gère des vidéos chiffrées depuis une interface locale.',
    description: 'Application de bureau pour charger, organiser et lire des vidéos chiffrées en local.',
    highlights: ['Interface de bureau en Tkinter', 'Gestion de vidéos chiffrées en local'],
    context: 'Projet personnel',
  },
  'disk-analyzer': {
    title: 'Disk Analyzer',
    summary: "Analyse l'occupation du disque et repère les fichiers volumineux.",
    description: "Outil de bureau qui parcourt le disque et met en évidence les dossiers et fichiers qui prennent le plus de place.",
    highlights: ['Parcours du système de fichiers en Python', 'Interface Tkinter'],
    context: 'Projet personnel',
    status: 'En développement',
  },
  'hip-prosthesis': {
    title: 'Prothèse de hanche',
    summary: "Faisabilité d'une tige de prothèse de hanche en titane imprimé en 3D.",
    description:
      "Étude de faisabilité technico-économique et environnementale d'une tige de prothèse de hanche en titane produite par fabrication additive.",
    highlights: [
      'Analyse de marché',
      'Modélisation CAO',
      'Validation mécanique par éléments finis',
      "Analyse du cycle de vie et de l'impact environnemental de la fabrication additive",
    ],
    context: 'EPF, M2 (semestre 1)',
    techStack: ['CAO', 'Éléments finis', 'Fabrication additive', 'ACV'],
  },
  'prosthetic-foot': {
    title: 'Pied prothétique',
    summary: 'Deux pieds prothétiques pour enfants et un socle de test, imprimés en 3D.',
    description:
      'Conception et impression 3D de deux pieds prothétiques pour enfants et du socle qui sert à les tester. Les résultats respectent la majorité des exigences fonctionnelles (traction, résistance, connectique).',
    highlights: ['Cahier des charges', 'Modélisation CAO et choix des matériaux', 'Essais mécaniques (Instron) et simulation FEM'],
    context: 'EPF, M1 (semestre 1)',
    techStack: ['CAO', 'Impression 3D', 'Instron', 'FEM'],
  },
  'vr-unity': {
    title: 'Jeu en réalité virtuelle',
    summary: 'Jeu VR développé sur Unity en C#.',
    description: 'Création d’un jeu en réalité virtuelle sur Unity, codé en C# orienté objet.',
    highlights: ['Programmation orientée objet en C#', 'Interactions en réalité virtuelle'],
    context: 'EPF, M1 (semestre 2)',
  },
  nao: {
    title: 'Robot NAO',
    summary: 'Programmer un robot NAO pour aider les seniors au quotidien.',
    description: 'Programmation d’un robot humanoïde NAO pour faciliter la vie quotidienne des personnes âgées.',
    highlights: ['Programmation du robot en Python'],
    context: 'EPF, L3 (semestre 2)',
  },
};

const textEN: Record<string, ProjectText> = {
  timeup: {
    title: 'TimeUp',
    summary: 'Multiplayer browser game, synchronised in real time.',
    description: 'A multiplayer game played from the browser. Games are kept in sync between players in real time with Supabase.',
    highlights: ['React and TypeScript interface', 'Real-time game sync with Supabase'],
    context: 'Side project',
  },
  cutclips: {
    title: 'CutClips',
    summary: 'Automatically generates vertical clips for social media.',
    description: 'A tool that cuts videos into vertical clips, ready to post on TikTok and other social networks.',
    highlights: ['Automated cutting and vertical formatting in Python', 'Simple HTML / CSS web interface'],
    context: 'Side project',
  },
  rootme: {
    title: 'Root-Me',
    summary: 'Cybersecurity challenges to practise offensive security.',
    description: 'Regular practice on Root-Me to improve on attack techniques and better understand what needs defending.',
    highlights: ['CTF challenges', 'Pentesting practice in a controlled environment'],
    context: 'Personal practice',
  },
  'password-manager': {
    title: 'Password Manager',
    summary: 'Password manager with salting and SHA-256 hashing.',
    description: 'A local password manager written in Python, to practise the basics of storing secrets securely.',
    highlights: ['Password salting', 'SHA-256 hashing'],
    context: 'Side project',
  },
  videoloader: {
    title: 'VideoLoader',
    summary: 'Loads and manages encrypted videos from a local interface.',
    description: 'A desktop app to load, organise and play encrypted videos locally.',
    highlights: ['Tkinter desktop interface', 'Local handling of encrypted videos'],
    context: 'Side project',
  },
  'disk-analyzer': {
    title: 'Disk Analyzer',
    summary: 'Analyses disk usage and finds large files.',
    description: 'A desktop tool that scans the disk and highlights the folders and files taking the most space.',
    highlights: ['File system scan in Python', 'Tkinter interface'],
    context: 'Side project',
    status: 'In progress',
  },
  'hip-prosthesis': {
    title: 'Hip prosthesis',
    summary: 'Feasibility of a 3D-printed titanium hip prosthesis stem.',
    description: 'Technical, economic and environmental feasibility study of a titanium hip prosthesis stem made by additive manufacturing.',
    highlights: ['Market analysis', 'CAD modelling', 'Finite element mechanical validation', 'Life-cycle and environmental impact assessment of additive manufacturing'],
    context: 'EPF, MSc year 2 (semester 1)',
    techStack: ['CAD', 'Finite elements', 'Additive manufacturing', 'LCA'],
  },
  'prosthetic-foot': {
    title: 'Prosthetic foot',
    summary: 'Two 3D-printed prosthetic feet for children and a test stand.',
    description: 'Design and 3D printing of two prosthetic feet for children and the stand used to test them. Results met most functional requirements (traction, resistance, connection).',
    highlights: ['Specifications', 'CAD modelling and material selection', 'Mechanical testing (Instron) and FEM simulation'],
    context: 'EPF, MSc year 1 (semester 1)',
    techStack: ['CAD', '3D printing', 'Instron', 'FEM'],
  },
  'vr-unity': {
    title: 'Virtual reality game',
    summary: 'VR game built with Unity in C#.',
    description: 'A virtual reality game made with Unity, written in object-oriented C#.',
    highlights: ['Object-oriented programming in C#', 'Virtual reality interactions'],
    context: 'EPF, MSc year 1 (semester 2)',
  },
  nao: {
    title: 'NAO robot',
    summary: 'Programming a NAO robot to help seniors day to day.',
    description: 'Programming a NAO humanoid robot to make daily life easier for elderly people.',
    highlights: ['Robot programming in Python'],
    context: 'EPF, BSc year 3 (semester 2)',
  },
};

export const getProjects = (lang: Language): Project[] => {
  const text = lang === 'fr' ? textFR : textEN;
  return base.map((b) => ({ ...b, ...text[b.id] }));
};
