import type { Language } from '../types/language';
import type { AgentSkill } from '../types/agentSkill';
import type { FlowEdge, FlowNode } from '../types/flow';
import { validateFlow } from '../utils/flow';

/*
 * Skills d'agents : métadonnées et textes doublés FR / EN ; la topologie des flows (ids, positions, arêtes)
 * est écrite une fois. Grille : col 0..4 ; un 6e pas passe en rangée 1 sous le 5e.
 */

type NodeBase = Pick<FlowNode, 'id' | 'kind' | 'col' | 'row'>;
type NodeText = Pick<FlowNode, 'label' | 'summary' | 'detail'>;

interface SkillBase {
  id: string;
  icon: string;
  nodes: NodeBase[];
  edges: FlowEdge[];
}

type SkillText = Pick<AgentSkill, 'name' | 'description' | 'whyUse' | 'usage' | 'example'> & {
  nodes: Record<string, NodeText>;
};

const n = (id: string, kind: FlowNode['kind'], col: number, row = 0): NodeBase => ({ id, kind, col, row });
const chain = (ids: string[]): FlowEdge[] => ids.slice(1).map((to, i) => ({ from: ids[i], to }));

const base: SkillBase[] = [
  {
    id: 'brainstorming',
    icon: 'lightbulb',
    nodes: [
      n('request', 'input', 0),
      n('context', 'loader', 1),
      n('questions', 'text', 2),
      n('approaches', 'latent', 3),
      n('design', 'sampler', 4),
      n('plan', 'output', 4, 1),
    ],
    edges: chain(['request', 'context', 'questions', 'approaches', 'design', 'plan']),
  },
  {
    id: 'caveman',
    icon: 'message-square',
    nodes: [n('draft', 'input', 0), n('strip', 'post', 1), n('keep', 'decode', 2), n('answer', 'output', 3)],
    edges: chain(['draft', 'strip', 'keep', 'answer']),
  },
  {
    id: 'graphify',
    icon: 'network',
    nodes: [
      n('files', 'input', 0),
      n('extract', 'loader', 1),
      n('graph', 'latent', 2),
      n('communities', 'sampler', 3),
      n('queries', 'output', 4),
    ],
    edges: chain(['files', 'extract', 'graph', 'communities', 'queries']),
  },
  {
    id: 'uiux',
    icon: 'paintbrush',
    nodes: [
      n('query', 'input', 0),
      n('search', 'loader', 1),
      n('rules', 'sampler', 2),
      n('system', 'decode', 3),
      n('build', 'output', 4),
    ],
    edges: chain(['query', 'search', 'rules', 'system', 'build']),
  },
];

const textFR: Record<string, SkillText> = {
  brainstorming: {
    name: 'Superpowers Brainstorming',
    description:
      "Skill d'idéation structurée qui explore ce que l'utilisateur veut vraiment avant de construire quoi que ce soit. Pose les bonnes questions, présente les approches possibles, et produit un design doc validé.",
    whyUse:
      'Évite de foncer tête baissée dans le code. Force une réflexion en amont sur le "quoi" et le "pourquoi" avant le "comment".',
    usage: 'Plugin : superpowers · Commande : /superpowers:brainstorming',
    example:
      "Avant de transformer ce portfolio en mini-site multi-pages, Brainstorming a identifié l'architecture HashRouter, le scope des pages, et les contraintes i18n.",
    nodes: {
      request: {
        label: 'Demande',
        summary: 'Le point de départ : une idée ou une demande, même floue.',
        detail:
          "L'utilisateur décrit ce qu'il veut (« une page pour mes skills »). Le skill s'active avant toute ligne de code, pour comprendre le vrai besoin plutôt que d'exécuter à la lettre.",
      },
      context: {
        label: 'Exploration du contexte',
        summary: "L'agent lit le projet existant avant de poser des questions.",
        detail:
          "Il parcourt les fichiers, la documentation et l'historique récent pour savoir ce qui existe déjà. Il évite ainsi de poser des questions dont la réponse est dans le dépôt.",
      },
      questions: {
        label: 'Questions',
        summary: 'Quelques questions ciblées, une à la fois.',
        detail:
          'Objectif, contraintes, public visé, ce qui ne doit surtout pas arriver. Les réponses transforment une demande vague en besoin précis.',
      },
      approaches: {
        label: 'Approches',
        summary: 'Deux ou trois façons de faire, avec leurs compromis.',
        detail:
          "L'agent compare les options (simple mais limitée, complète mais lourde…) et recommande l'une d'elles. L'utilisateur choisit en connaissance de cause.",
      },
      design: {
        label: 'Design doc',
        summary: "Un document de conception relu et validé par l'utilisateur.",
        detail:
          "Il fixe l'architecture, les cas limites et ce qui est hors périmètre. Rien ne se construit tant que ce document n'est pas approuvé.",
      },
      plan: {
        label: 'Plan',
        summary: 'Le chantier découpé en petites tâches vérifiables.',
        detail:
          "À partir du design validé, l'agent écrit un plan d'implémentation étape par étape. C'est ce plan, et non l'idée de départ, qui guide le code.",
      },
    },
  },
  caveman: {
    name: 'Caveman',
    description:
      'Mode de communication concis et efficace en tokens. Chaque mot gagne sa place. Pas de blabla, pas de cérémonie — substance technique pure.',
    whyUse:
      'Réduit le bruit dans les réponses, économise du contexte, et va droit au but. Idéal pour les sessions de travail intenses.',
    usage: 'Plugin : ponytail · Commande : /caveman',
    example:
      'Pendant le développement, les réponses passent de paragraphes à des lignes directes : "Bug dans auth middleware. Token expiry check utilise < au lieu de <=. Fix :"',
    nodes: {
      draft: {
        label: 'Brouillon',
        summary: "L'agent formule d'abord sa réponse normalement.",
        detail:
          "Il rédige ce qu'il aurait dit sans contrainte : introduction, reformulation de la question, politesses, explications détaillées.",
      },
      strip: {
        label: 'Suppression du superflu',
        summary: 'Les formules de politesse et les redites disparaissent.',
        detail:
          'Articles inutiles, préambules, « bien sûr ! », résumé final : tout ce qui n\'apporte aucune information est retiré, et les phrases sont raccourcies.',
      },
      keep: {
        label: 'Conservation du payload',
        summary: 'Ce qui compte reste intact, mot pour mot.',
        detail:
          'Code, commandes, chiffres, noms de fichiers et surtout les négations (« ne pas », « jamais ») sont gardés tels quels : raccourcir ne doit jamais changer le sens technique.',
      },
      answer: {
        label: 'Réponse concise',
        summary: 'Une réponse courte qui dit la même chose.',
        detail:
          'Le visiteur obtient la cause et le correctif en quelques lignes au lieu de plusieurs paragraphes, avec moins de tokens consommés.',
      },
    },
  },
  graphify: {
    name: 'Graphify',
    description:
      "Génère un graphe de connaissances structuré à partir de n'importe quel input : code, documentation, conversations. Produit des nœuds et relations exploitables.",
    whyUse:
      'Transforme de la documentation dense en structure navigable. Permet de visualiser les dépendances et les relations entre concepts.',
    usage: 'Skill custom : ~/.claude/skills/graphify · Commande : /graphify',
    example:
      'Analyse du dossier ComfyUI (workflows, modèles, prompts) pour produire un graphe des relations entre pipelines, modèles et techniques.',
    nodes: {
      files: {
        label: 'Fichiers',
        summary: 'Le dossier à analyser : code, documents, images…',
        detail:
          'Graphify détecte les types de fichiers présents (code, Markdown, PDF, images) pour choisir comment lire chacun.',
      },
      extract: {
        label: 'Extraction',
        summary: 'Chaque fichier est lu pour en tirer les concepts.',
        detail:
          "Le code est analysé structurellement (fonctions, imports, classes) ; les documents sont lus par l'IA pour repérer idées, entités et liens. Le résultat est une liste brute d'éléments.",
      },
      graph: {
        label: 'Nœuds et relations',
        summary: 'Les éléments deviennent un graphe : points et liens.',
        detail:
          'Chaque concept devient un nœud ; chaque lien (« appelle », « dépend de », « explique ») une relation. Les doublons sont fusionnés et chaque lien est marqué comme trouvé ou déduit.',
      },
      communities: {
        label: 'Communautés',
        summary: 'Les nœuds très liés entre eux sont regroupés.',
        detail:
          "Un algorithme de détection de communautés fait ressortir les grands thèmes du projet et ses nœuds centraux, sans qu'on ait à les définir à la main.",
      },
      queries: {
        label: 'Requêtes sur le graphe',
        summary: 'On interroge le graphe au lieu de relire tous les fichiers.',
        detail:
          "On peut demander le chemin entre deux concepts, l'explication d'un nœud ou une question libre. Le graphe est aussi exporté en page interactive.",
      },
    },
  },
  uiux: {
    name: 'UI UX Pro Max',
    description:
      "Intelligence design avec 79 styles, 192 palettes, 74 pairings typographiques, 119 guidelines UX et 17 presets d'animation. Base de données interrogeable pour chaque décision design.",
    whyUse:
      "Remplace l'intuition par des données vérifiées. Chaque choix de couleur, typo ou animation est fondé sur un match recherché dans la base.",
    usage: 'Plugin : ui-ux-pro-max · Commande : /ui-ux-pro-max:design-system',
    example:
      'Pour ce portfolio : recherche "portfolio developer engineer dark modern tech" avec --design-system pour générer les recommandations de style, palette et typographie.',
    nodes: {
      query: {
        label: 'Requête',
        summary: "Le type de produit et l'ambiance voulue, en quelques mots.",
        detail:
          'Par exemple « portfolio développeur sombre moderne ». Ces mots-clés servent à interroger la base de connaissances design.',
      },
      search: {
        label: 'Recherche en base',
        summary: 'Styles, palettes, typographies et règles UX sont consultés.',
        detail:
          "Le skill cherche dans plusieurs jeux de données : styles visuels, palettes de couleurs, associations de polices et bonnes pratiques d'ergonomie, et classe les meilleures correspondances.",
      },
      rules: {
        label: 'Règles de raisonnement',
        summary: 'Des règles métier départagent les candidats.',
        detail:
          'Selon le secteur (santé, finance, créatif…), certaines combinaisons sont recommandées ou écartées. Cela évite par exemple une palette flashy pour un site sérieux.',
      },
      system: {
        label: 'Design system',
        summary: 'Un ensemble cohérent : couleurs, polices, espacements, effets.',
        detail:
          "Les choix sont assemblés en une charte unique, avec ce qu'il faut éviter, qui sert de référence pour tout le reste de l'interface.",
      },
      build: {
        label: 'Implémentation',
        summary: "L'interface est codée en suivant cette charte.",
        detail:
          "L'agent applique le design system au code (composants, thème clair/sombre, contrastes, accessibilité), puis vérifie la cohérence avec une liste de contrôle avant livraison.",
      },
    },
  },
};

const textEN: Record<string, SkillText> = {
  brainstorming: {
    name: 'Superpowers Brainstorming',
    description:
      'Structured ideation skill that explores what the user actually wants before building anything. Asks the right questions, presents possible approaches, and produces a validated design doc.',
    whyUse: 'Prevents jumping straight into code. Forces upfront thinking about the "what" and "why" before the "how".',
    usage: 'Plugin: superpowers · Command: /superpowers:brainstorming',
    example:
      'Before turning this portfolio into a multi-page mini-site, Brainstorming identified the HashRouter architecture, page scope, and i18n constraints.',
    nodes: {
      request: {
        label: 'Request',
        summary: 'The starting point: an idea or request, even a vague one.',
        detail:
          'The user describes what they want ("a page for my skills"). The skill kicks in before any code is written, to understand the real need instead of executing the words literally.',
      },
      context: {
        label: 'Context exploration',
        summary: 'The agent reads the existing project before asking questions.',
        detail:
          'It browses files, documentation and recent history to learn what already exists, so it does not ask questions whose answer is already in the repository.',
      },
      questions: {
        label: 'Questions',
        summary: 'A few targeted questions, one at a time.',
        detail:
          'Goal, constraints, audience, what must never happen. The answers turn a vague request into a precise need.',
      },
      approaches: {
        label: 'Approaches',
        summary: 'Two or three ways to do it, with their trade-offs.',
        detail:
          'The agent compares the options (simple but limited, complete but heavy...) and recommends one. The user chooses with full information.',
      },
      design: {
        label: 'Design doc',
        summary: 'A design document reviewed and approved by the user.',
        detail:
          'It fixes the architecture, edge cases and what is out of scope. Nothing gets built until this document is approved.',
      },
      plan: {
        label: 'Plan',
        summary: 'The work split into small, checkable tasks.',
        detail:
          'From the approved design, the agent writes a step-by-step implementation plan. That plan, not the initial idea, drives the code.',
      },
    },
  },
  caveman: {
    name: 'Caveman',
    description:
      'Token-efficient, concise communication mode. Every word earns its place. No fluff, no ceremony — pure technical substance.',
    whyUse:
      'Reduces noise in responses, saves context, and gets straight to the point. Ideal for intense work sessions.',
    usage: 'Plugin: ponytail · Command: /caveman',
    example:
      'During development, responses go from paragraphs to direct lines: "Bug in auth middleware. Token expiry check uses < instead of <=. Fix:"',
    nodes: {
      draft: {
        label: 'Draft',
        summary: 'The agent first words its answer normally.',
        detail:
          'It writes what it would have said without constraints: introduction, restating the question, pleasantries, detailed explanations.',
      },
      strip: {
        label: 'Strip the fluff',
        summary: 'Pleasantries and repetition disappear.',
        detail:
          'Needless articles, preambles, "sure!", closing summaries: everything that carries no information is removed and sentences are shortened.',
      },
      keep: {
        label: 'Keep the payload',
        summary: 'What matters stays intact, word for word.',
        detail:
          'Code, commands, numbers, file names and above all negations ("do not", "never") are kept as is: shortening must never change the technical meaning.',
      },
      answer: {
        label: 'Terse answer',
        summary: 'A short answer that says the same thing.',
        detail:
          'The reader gets the cause and the fix in a few lines instead of several paragraphs, with fewer tokens used.',
      },
    },
  },
  graphify: {
    name: 'Graphify',
    description:
      'Generates a structured knowledge graph from any input: code, documentation, conversations. Produces explorable nodes and relationships.',
    whyUse:
      'Turns dense documentation into navigable structure. Visualizes dependencies and relationships between concepts.',
    usage: 'Custom skill: ~/.claude/skills/graphify · Command: /graphify',
    example:
      'Analysis of the ComfyUI folder (workflows, models, prompts) to produce a graph of relationships between pipelines, models and techniques.',
    nodes: {
      files: {
        label: 'Files',
        summary: 'The folder to analyse: code, documents, images...',
        detail:
          'Graphify detects the file types present (code, Markdown, PDF, images) to choose how to read each one.',
      },
      extract: {
        label: 'Extraction',
        summary: 'Each file is read to pull out its concepts.',
        detail:
          'Code is analysed structurally (functions, imports, classes); documents are read by the AI to spot ideas, entities and links. The result is a raw list of elements.',
      },
      graph: {
        label: 'Nodes and relations',
        summary: 'The elements become a graph: points and links.',
        detail:
          'Each concept becomes a node; each link ("calls", "depends on", "explains") a relation. Duplicates are merged and each link is tagged as found or inferred.',
      },
      communities: {
        label: 'Communities',
        summary: 'Tightly connected nodes are grouped together.',
        detail:
          "A community-detection algorithm brings out the project's main themes and central nodes, without having to define them by hand.",
      },
      queries: {
        label: 'Graph queries',
        summary: 'You query the graph instead of rereading every file.',
        detail:
          'You can ask for the path between two concepts, the explanation of a node, or a free-form question. The graph is also exported as an interactive page.',
      },
    },
  },
  uiux: {
    name: 'UI UX Pro Max',
    description:
      'Design intelligence with 79 styles, 192 palettes, 74 typography pairings, 119 UX guidelines and 17 animation presets. Searchable database for every design decision.',
    whyUse:
      'Replaces intuition with verified data. Every color, typography or animation choice is grounded in a searched match from the database.',
    usage: 'Plugin: ui-ux-pro-max · Command: /ui-ux-pro-max:design-system',
    example:
      'For this portfolio: searched "portfolio developer engineer dark modern tech" with --design-system to generate style, palette and typography recommendations.',
    nodes: {
      query: {
        label: 'Query',
        summary: 'The product type and desired mood, in a few words.',
        detail:
          'For example "dark modern developer portfolio". These keywords are used to query the design knowledge base.',
      },
      search: {
        label: 'Database search',
        summary: 'Styles, palettes, typography and UX rules are consulted.',
        detail:
          'The skill searches several datasets: visual styles, colour palettes, font pairings and usability best practices, and ranks the best matches.',
      },
      rules: {
        label: 'Reasoning rules',
        summary: 'Domain rules arbitrate between candidates.',
        detail:
          'Depending on the sector (health, finance, creative...), some combinations are recommended or ruled out. This avoids, for instance, a flashy palette for a serious site.',
      },
      system: {
        label: 'Design system',
        summary: 'A coherent set: colours, fonts, spacing, effects.',
        detail:
          'The choices are assembled into a single style guide, including what to avoid, which becomes the reference for the rest of the interface.',
      },
      build: {
        label: 'Implementation',
        summary: 'The interface is coded following that guide.',
        detail:
          'The agent applies the design system to the code (components, light/dark theme, contrast, accessibility), then checks consistency against a checklist before delivery.',
      },
    },
  },
};

const cache: Partial<Record<Language, AgentSkill[]>> = {};

export const getAgentSkills = (lang: Language): AgentSkill[] => {
  const cached = cache[lang];
  if (cached) return cached;
  const text = lang === 'fr' ? textFR : textEN;
  const list = base.map(({ nodes, edges, icon, id }) => {
    const { nodes: nodeText, ...meta } = text[id];
    return {
      id,
      icon,
      ...meta,
      flow: { nodes: nodes.map((node) => ({ ...node, ...nodeText[node.id] })), edges },
    };
  });
  if (import.meta.env.DEV) {
    for (const s of list) {
      const errors = validateFlow(s.flow);
      if (errors.length) console.error(`[flow ${s.id}]`, errors);
    }
  }
  return (cache[lang] = list);
};
