# AGENTS.md — Guide de référence du repo

Portfolio personnel de **Quentin COLPART** (React 18 + TypeScript + Vite + Tailwind 3.4 + Framer Motion + Lucide + Recharts), déployé sur GitHub Pages.

## Commandes

```bash
npm run dev        # serveur de développement (http://localhost:5173)
npm run build      # build production dans dist/
npm run preview    # prévisualisation du build
npm run lint       # ESLint (⚠️ 6 erreurs pré-existantes dans Projects.tsx — pas les corriger sauf demande explicte)
npm run typecheck  # tsc --noEmit
```

## Structure

```
src/
├── App.tsx                          # Composition, props du fond KineticGrid (thème)
├── main.tsx                         # Providers : ThemeProvider > LanguageProvider
├── index.css                        # ✏️ TOKENS DE THÈME (variables CSS clair/sombre) + body
├── contexts/
│   ├── ThemeContext.tsx             # useTheme : theme light/dark + localStorage + système
│   └── LanguageContext.tsx          # useLanguage : fr/en + localStorage
├── hooks/
│   ├── useScrollSpy.ts              # section active dans la nav
│   └── useLanguage.ts               # re-export du contexte de langue
├── data/                            # ✏️ TOUTES les données métier (doublées FR/EN)
│   ├── projects.ts                  # getProjects(lang)
│   ├── experiences.ts               # getExperiences(lang)
│   ├── skills.ts                    # getSkills(lang)
│   └── translations/fr.json         # textes UI FR
│   └── translations/en.json         # textes UI EN
├── types/                           # interfaces (project, experience, skill, language)
├── utils/cv.ts                      # auto-détection CV src/assets/cv/*.pdf (fr/en dans le nom)
└── components/
    ├── layout/      Navigation.tsx · Footer.tsx
    ├── sections/    Hero · About · Experience · Skills · Projects · Contact
    ├── ui/          Button · Card · Section · SectionHeader · LanguageToggle · ThemeToggle
    ├── background/  InteractiveBackground.tsx (canvas KineticGrid : points/lignes magnétiques)
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
5. **Langues** : `useLanguage()` partout (jamais un import direct des json quand ce n'est pas le composant racine).

## Fichiers à ne JAMAIS commiter

- `Portfolio Projets de Quentin.txt` (notes source du profil — les infos sont intégrées dans `profil.md`)
- `public/doc/*` (CV/photos) et tout contenu privé sous `public/`
- `node_modules/`, `dist/`

Toujours vérifier avec `git status` avant tout commit.

## Profil utilisateur

Informations complètes (projets perso/scolaires, expériences, skills, centres d'intérêt, FR + EN) : **`profil.md`** à la racine. C'est la source de vérité pour tout contenu biographique — le mettre à jour en même temps que les données du site.