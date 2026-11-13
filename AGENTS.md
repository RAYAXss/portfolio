# AGENTS.md — Guide de référence du repo

Portfolio personnel de **Quentin COLPART** (React 18 + TypeScript + Vite + Tailwind 3.4 + Framer Motion + Lucide + three.js + React Router (HashRouter)), déployé sur GitHub Pages.

## Commandes

```bash
npm run dev        # serveur de développement (http://localhost:5173)
npm run build      # build production dans dist/
npm run preview    # prévisualisation du build
npm run lint       # ESLint (doit rester à 0 erreur)
npm run typecheck  # tsc --noEmit -p tsconfig.app.json (vérifie src/)
```

## Structure

```
src/
├── App.tsx                          # Routes (sous-pages en React.lazy)
├── main.tsx                         # Providers : ThemeProvider > LanguageProvider > HashRouter
├── index.css                        # ✏️ TOKENS DE THÈME (variables CSS clair/sombre) + body
├── contexts/
│   ├── ThemeContext.tsx             # useTheme : theme light/dark + localStorage + système
│   └── LanguageContext.tsx          # useLanguage : { lang, setLang, t } — t = textes UI de la langue active
├── hooks/                           # useScrollSpy · useLanguage · useTheme · useReducedMotion
├── data/                            # ✏️ TOUTES les données métier (doublées FR/EN)
│   ├── experiences.ts               # getExperiences(lang)
│   ├── projects.ts                  # getProjects(lang) — base commune + textes FR/EN ; rapports PDF publics dans public/docs/projects/
│   ├── comfyui.ts                   # getComfyUIWorkflows(lang)
│   ├── agentSkills.ts               # getAgentSkills(lang) — flows des skills (FR/EN)
│   └── translations/fr.json · en.json   # textes UI (compétences et section Expertise incluses)
├── types/                           # interfaces (project, experience, comfyui, claudeSkill, language)
├── utils/cv.ts                      # auto-détection CV src/assets/cv/*.pdf (fr/en dans le nom)
├── pages/                           # HomePage · ComfyUIPage (#/comfyui) · AgentsSkillsPage (#/agents-skills)
└── components/
    ├── layout/      Navigation.tsx · Footer.tsx
    ├── sections/    Hero · About · Experience · Skills · Projects · ExploreCards · Contact
    ├── ui/          Button · SectionHeader · FlowLine (schéma A → B animé) · InteractiveFlow (graphe cliquable) · Tabs (onglets ?param=) · LanguageToggle · ThemeToggle
    ├── three/       NodeScene.tsx (graphe 3D décoratif, couleurs = tokens CSS, pause hors écran)
    ├── comfyui/     OutputScene.tsx (+ scenes/ : visualisations three.js)
    ├── reactbits/   Counter · SplitText · SpotlightCard
    └── animations/  FadeInOnScroll.tsx
```

## Règles non négociables

1. **I18N** : tout nouveau texte doit exister en FR **et** EN (`fr.json` + `en.json`). Les données métier sont doublées dans `src/data/*.ts` via `xxxFR` / `xxxEN` + `getXxx(lang)`.
2. **Thème** : jamais de couleur hardcodée (`bg-gray-900`, `text-white`…). Utiliser les **tokens sémantiques** de `tailwind.config.js` :
   - `surface`/`surface-2`/`surface-3` (fond page / cartes / footer)
   - `content`/`content-muted`/`content-faint` (textes)
   - `border`/`border-strong` (bordures — avec `/10`, `/40`… pour l'opacité)
   - `accent`/`accent-2` (bleu/violet · dégradés) · `action` (boutons primaires)
   - `glass`/`glass-hover` (cartes translucides — équivalent de `bg-white/5`)
   - Modifier une palette = ne toucher que `src/index.css` (variables :root/[data-theme]).
3. **ThemeContext** : le thème est au niveau du `<html data-theme=...>` ; défaut = système, ensuite mémorisé dans `localStorage['preferred-theme']`. Ne pas dupliquer cette logique.
4. **Rajouter une section** : créer `src/components/sections/X.tsx` → l'ajouter dans `App.tsx` → textes dans les 2 fichiers de traductions.
5. **Langues** : `const { t } = useLanguage()` partout. Seul `LanguageContext.tsx` importe les JSON.
6. **Schémas animés** : préférer un schéma animé (Framer Motion / SVG, `FlowLine`, `NodeScene`) à un pavé de texte. Toujours respecter `useReducedMotion`, utiliser de vrais `<button>` pour les éléments cliquables, vérifier à 375 px sans scroll horizontal.
7. **.gitignore** : git est insensible à la casse sous Windows, donc ancrer les motifs de dossiers racine (`/COMFYUI/`, sinon `src/components/comfyui/` est ignoré).

## Fichiers à ne JAMAIS commiter

- `Portfolio Projets de Quentin.txt` (notes source du profil — les infos sont intégrées dans `profil.md`)
- `public/doc/*` (CV/photos) et tout contenu privé sous `public/`
- `node_modules/`, `dist/`

Toujours vérifier avec `git status` avant tout commit.

## Profil utilisateur

Informations complètes (projets perso/scolaires, expériences, skills, centres d'intérêt, FR + EN) : **`profil.md`** à la racine. C'est la source de vérité pour tout contenu biographique — le mettre à jour en même temps que les données du site.