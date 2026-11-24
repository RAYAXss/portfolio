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
    id: 'guilty-species',
    category: 'dev',
    techStack: ['React', 'TypeScript', 'three.js', 'Vite', 'Vitest'],
    images: [img('guilty-species-preview.png')],
    links: [
      { kind: 'demo', url: 'https://guilty-species.vercel.app' },
      { kind: 'code', url: 'https://github.com/RAYAXss/guilty_species' },
    ],
  },
  {
    id: 'timeup',
    category: 'dev',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'three.js', 'dnd-kit', 'Vitest'],
    images: [img('timesup-preview.png')],
    links: [
      { kind: 'demo', url: 'https://timesup-dusky.vercel.app' },
      { kind: 'code', url: 'https://github.com/RAYAXss/timesup' },
    ],
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
    techStack: ['Python', 'Argon2', 'PBKDF2', 'Fernet (AES)', 'ttkbootstrap'],
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
  'guilty-species': {
    title: 'Guilty Species',
    summary: 'Jeu de logique et de déduction : trouver le coupable parmi des créatures fantastiques.',
    description:
      "Chaque énigme réunit des créatures de Fantolia (elfes, orcs, dragons…), leurs déclarations et une règle globale, par exemple « exactement deux personnages disent la vérité ». Le joueur croise les indices pour démasquer le coupable : aucune part de hasard, chaque énigme a une seule solution logique.",
    highlights: [
      'Moteur de puzzles indépendant de l’interface : génération, solveur et vérification de l’unicité de la solution',
      'Trois modes : jeu libre à difficulté croissante, tutoriel guidé et campagne de 18 niveaux',
      'Fond 3D de cartes flottantes en three.js, audio réglable, interface React responsive',
    ],
    context: 'Projet personnel',
  },
  timeup: {
    title: "Time's Up",
    summary: "Le jeu d'ambiance Time's Up en version web : 2 à 4 équipes, 3 manches, plus de 500 cartes.",
    description:
      "Adaptation web du jeu de société : les équipes font deviner les mêmes cartes en trois manches (description libre, un seul mot, mime). Pensé pour se jouer à plusieurs autour d'un même téléphone ou ordinateur.",
    highlights: [
      'Plus de 500 cartes en 3 niveaux de difficulté, timer de 30, 45 ou 60 s',
      'Équipes par glisser-déposer, rotation des joueurs par équipe, scores par manche',
      'Swipe sur mobile, raccourcis clavier, sons Web Audio et fond animé en three.js',
      'Réglages sauvegardés en local, logique testée avec Vitest',
    ],
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
    summary: 'Coffre-fort de mots de passe local, chiffré et protégé par un mot de passe maître.',
    description:
      "Application de bureau « Secure Vault » en Python : les identifiants sont stockés dans un coffre chiffré sur le disque, déverrouillé uniquement par le mot de passe maître. Le projet met en pratique les bonnes pratiques de stockage des secrets : hachage lent, sel aléatoire et chiffrement authentifié.",
    highlights: [
      'Mot de passe maître haché avec Argon2 (jamais stocké en clair)',
      'Clé dérivée par PBKDF2-HMAC-SHA256 (600 000 itérations, sel aléatoire de 16 octets)',
      'Coffre chiffré avec Fernet (AES + HMAC), rechiffré lors du changement de mot de passe maître',
      'Interface ttkbootstrap : ajout, modification, suppression des entrées, thèmes',
    ],
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
  'guilty-species': {
    title: 'Guilty Species',
    summary: 'Logic and deduction game: find the culprit among fantasy creatures.',
    description:
      'Each puzzle brings together creatures of Fantolia (elves, orcs, dragons…), their statements and a global rule such as "exactly two characters tell the truth". The player cross-checks the clues to unmask the culprit: no luck involved, every puzzle has exactly one logical solution.',
    highlights: [
      'Puzzle engine independent from the UI: generation, solver and uniqueness check',
      'Three modes: free play with rising difficulty, guided tutorial and an 18-level campaign',
      'three.js floating-card 3D background, adjustable audio, responsive React interface',
    ],
    context: 'Side project',
  },
  timeup: {
    title: "Time's Up",
    summary: "The Time's Up party game on the web: 2 to 4 teams, 3 rounds, 500+ cards.",
    description:
      "Web adaptation of the board game: teams make others guess the same cards over three rounds (free description, one word, mime). Built to be played together around a single phone or computer.",
    highlights: [
      '500+ cards in 3 difficulty levels, 30, 45 or 60 s timer',
      'Drag-and-drop teams, per-team player rotation, scores per round',
      'Mobile swipe, keyboard shortcuts, Web Audio sounds and a three.js animated background',
      'Settings saved locally, game logic tested with Vitest',
    ],
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
    summary: 'Local encrypted password vault, protected by a master password.',
    description:
      'A Python desktop app, "Secure Vault": credentials are stored in an encrypted vault on disk, unlocked only by the master password. The project applies good practice for storing secrets: slow hashing, random salt and authenticated encryption.',
    highlights: [
      'Master password hashed with Argon2 (never stored in clear)',
      'Key derived with PBKDF2-HMAC-SHA256 (600,000 iterations, random 16-byte salt)',
      'Vault encrypted with Fernet (AES + HMAC), re-encrypted when the master password changes',
      'ttkbootstrap interface: add, edit and delete entries, themes',
    ],
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
