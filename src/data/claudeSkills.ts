import type { Language } from '../types/language';
import type { ClaudeSkill } from '../types/claudeSkill';

const skillsFR: ClaudeSkill[] = [
  {
    id: 'brainstorming',
    name: 'Superpowers Brainstorming',
    description: 'Skill d\'idéation structurée qui explore ce que l\'utilisateur veut vraiment avant de construire quoi que ce soit. Pose les bonnes questions, présente les approches possibles, et produit un design doc validé.',
    whyUse: 'Évite de foncer tête baissée dans le code. Force une réflexion en amont sur le "quoi" et le "pourquoi" avant le "comment".',
    usage: 'Plugin : superpowers · Commande : /superpowers:brainstorming',
    example: 'Avant de transformer ce portfolio en mini-site multi-pages, Brainstorming a identifié l\'architecture HashRouter, le scope des pages, et les contraintes i18n.',
    icon: 'lightbulb',
  },
  {
    id: 'caveman',
    name: 'Caveman',
    description: 'Mode de communication concis et efficace en tokens. Chaque mot gagne sa place. Pas de blabla, pas de cérémonie — substance technique pure.',
    whyUse: 'Réduit le bruit dans les réponses, économise du contexte, et va droit au but. Idéal pour les sessions de travail intenses.',
    usage: 'Plugin : ponytail · Commande : /caveman',
    example: 'Pendant le développement, les réponses passent de paragraphes à des lignes directes : "Bug dans auth middleware. Token expiry check utilise < au lieu de <=. Fix :"',
    icon: 'message-square',
  },
  {
    id: 'graphify',
    name: 'Graphify',
    description: 'Génère un graphe de connaissances structuré à partir de n\'importe quel input : code, documentation, conversations. Produit des nœuds et relations exploitables.',
    whyUse: 'Transforme de la documentation dense en structure navigable. Permet de visualiser les dépendances et les relations entre concepts.',
    usage: 'Skill custom : ~/.claude/skills/graphify · Commande : /graphify',
    example: 'Analyse du dossier ComfyUI (workflows, modèles, prompts) pour produire un graphe des relations entre pipelines, modèles et techniques.',
    icon: 'network',
  },
  {
    id: 'uiux',
    name: 'UI UX Pro Max',
    description: 'Intelligence design avec 79 styles, 192 palettes, 74 pairings typographiques, 119 guidelines UX et 17 presets d\'animation. Base de données interrogeable pour chaque décision design.',
    whyUse: 'Remplace l\'intuition par des données vérifiées. Chaque choix de couleur, typo ou animation est fondé sur un match recherché dans la base.',
    usage: 'Plugin : ui-ux-pro-max · Commande : /ui-ux-pro-max:design-system',
    example: 'Pour ce portfolio : recherche "portfolio developer engineer dark modern tech" avec --design-system pour générer les recommandations de style, palette et typographie.',
    icon: 'paintbrush',
  },
];

const skillsEN: ClaudeSkill[] = [
  {
    id: 'brainstorming',
    name: 'Superpowers Brainstorming',
    description: 'Structured ideation skill that explores what the user actually wants before building anything. Asks the right questions, presents possible approaches, and produces a validated design doc.',
    whyUse: 'Prevents jumping straight into code. Forces upfront thinking about the "what" and "why" before the "how".',
    usage: 'Plugin: superpowers · Command: /superpowers:brainstorming',
    example: 'Before turning this portfolio into a multi-page mini-site, Brainstorming identified the HashRouter architecture, page scope, and i18n constraints.',
    icon: 'lightbulb',
  },
  {
    id: 'caveman',
    name: 'Caveman',
    description: 'Token-efficient, concise communication mode. Every word earns its place. No fluff, no ceremony — pure technical substance.',
    whyUse: 'Reduces noise in responses, saves context, and gets straight to the point. Ideal for intense work sessions.',
    usage: 'Plugin: ponytail · Command: /caveman',
    example: 'During development, responses go from paragraphs to direct lines: "Bug in auth middleware. Token expiry check uses < instead of <=. Fix:"',
    icon: 'message-square',
  },
  {
    id: 'graphify',
    name: 'Graphify',
    description: 'Generates a structured knowledge graph from any input: code, documentation, conversations. Produces explorable nodes and relationships.',
    whyUse: 'Turns dense documentation into navigable structure. Visualizes dependencies and relationships between concepts.',
    usage: 'Custom skill: ~/.claude/skills/graphify · Command: /graphify',
    example: 'Analysis of the ComfyUI folder (workflows, models, prompts) to produce a graph of relationships between pipelines, models and techniques.',
    icon: 'network',
  },
  {
    id: 'uiux',
    name: 'UI UX Pro Max',
    description: 'Design intelligence with 79 styles, 192 palettes, 74 typography pairings, 119 UX guidelines and 17 animation presets. Searchable database for every design decision.',
    whyUse: 'Replaces intuition with verified data. Every color, typography or animation choice is grounded in a searched match from the database.',
    usage: 'Plugin: ui-ux-pro-max · Command: /ui-ux-pro-max:design-system',
    example: 'For this portfolio: searched "portfolio developer engineer dark modern tech" with --design-system to generate style, palette and typography recommendations.',
    icon: 'paintbrush',
  },
];

export const getClaudeSkills = (lang: Language): ClaudeSkill[] =>
  lang === 'fr' ? skillsFR : skillsEN;
