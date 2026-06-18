# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild portfolio website with modern glassmorphism design, cybersecurity focus, and bilingual support (FR/EN).

**Architecture:** React component-based SPA with custom i18n hook, Framer Motion animations, smooth scroll navigation, and data files for content. Glassmorphism navbar, hero with photo, timeline experiences, categorized skills, project showcase, simple contact.

**Tech Stack:** React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Lucide React

## Global Constraints

- React version: 18.3.1+
- TypeScript strict mode enabled
- All new components use TypeScript with explicit types
- TailwindCSS for all styling (no inline styles or CSS modules)
- Responsive breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Default language: French (FR)
- Color palette: Blue-600 primary, Indigo/Purple accents, Gray scale
- All animations: 60fps target, use GPU-accelerated transforms
- Accessibility: WCAG AA minimum (4.5:1 text contrast)
- Profile photo placeholder: Use lucide-react User icon until user provides image
- Commit message format: `type: description` (feat/fix/refactor/docs/style)

---

### Task 1: Project Cleanup & Dependencies

**Files:**
- Delete: `.bolt/` (entire folder)
- Modify: `package.json`
- Modify: `index.html`
- Delete: `src/components/sections/Volunteer.tsx`
- Delete: `src/components/sections/Interests.tsx`
- Modify: `public/doc/` (rename CV)

**Interfaces:**
- Consumes: Existing project structure
- Produces: Clean project with new dependencies ready

- [ ] **Step 1: Remove Bolt.new traces**

```bash
cd C:/Users/qcolpart/portfolio
rm -rf .bolt
```

- [ ] **Step 2: Install Framer Motion**

```bash
npm install framer-motion@^11.0.0
```

Expected output: `added 1 package`

- [ ] **Step 3: Remove EmailJS**

```bash
npm uninstall emailjs-com
```

Expected output: `removed 1 package`

- [ ] **Step 4: Update package.json name and description**

Modify `package.json`:

```json
{
  "name": "quentin-colpart-portfolio",
  "private": true,
  "version": "1.0.0",
  "description": "Quentin COLPART - Cybersecurity Engineer Portfolio",
  "type": "module",
  ...
}
```

- [ ] **Step 5: Update index.html title**

Modify `index.html`:

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Quentin COLPART - Cybersecurity Engineer Portfolio. Product Definition Analyst transitioning to Cybersecurity with expertise in data engineering and cloud technologies." />
    <title>Quentin COLPART | Cybersecurity Engineer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Rename CV file**

```bash
cd public/doc
mv CV_Quentin_COLPART.pdf CV_old_backup.pdf
# CV_Cybersécurité.pdf already exists from user upload
```

- [ ] **Step 7: Delete unused components**

```bash
rm src/components/sections/Volunteer.tsx
rm src/components/sections/Interests.tsx
```

- [ ] **Step 8: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove Bolt.new traces and add Framer Motion"
```

---

### Task 2: Data Layer - i18n Hook

**Files:**
- Create: `src/hooks/useLanguage.ts`
- Create: `src/types/language.ts`

**Interfaces:**
- Consumes: Nothing (foundational)
- Produces: 
  - `type Language = 'fr' | 'en'`
  - `useLanguage(): { lang: Language, setLang: (lang: Language) => void }`

- [ ] **Step 1: Create language type**

Create `src/types/language.ts`:

```typescript
export type Language = 'fr' | 'en';
```

- [ ] **Step 2: Write test for useLanguage hook**

Create `src/hooks/useLanguage.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useLanguage } from './useLanguage';

describe('useLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should default to French', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.lang).toBe('fr');
  });

  it('should switch language', () => {
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.setLang('en');
    });
    expect(result.current.lang).toBe('en');
  });

  it('should persist language to localStorage', () => {
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.setLang('en');
    });
    expect(localStorage.getItem('preferred-language')).toBe('en');
  });
});
```

Note: Skip test for now (no test setup), implement directly.

- [ ] **Step 3: Implement useLanguage hook**

Create `src/hooks/useLanguage.ts`:

```typescript
import { useState, useEffect } from 'react';
import type { Language } from '../types/language';

const STORAGE_KEY = 'preferred-language';

export const useLanguage = () => {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === 'en' || stored === 'fr') ? stored : 'fr';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  return { lang, setLang };
};
```

- [ ] **Step 4: Verify hook compiles**

```bash
npm run typecheck
```

Expected: No errors

- [ ] **Step 5: Commit i18n hook**

```bash
git add src/types/language.ts src/hooks/useLanguage.ts
git commit -m "feat: add useLanguage hook for FR/EN toggle"
```

---

### Task 3: Data Layer - Translation Files

**Files:**
- Create: `src/data/translations/fr.json`
- Create: `src/data/translations/en.json`

**Interfaces:**
- Consumes: Nothing
- Produces: Translation objects keyed by section (nav, hero, about, experience, skills, projects, contact)

- [ ] **Step 1: Create French translations**

Create `src/data/translations/fr.json`:

```json
{
  "nav": {
    "about": "À propos",
    "experience": "Expériences",
    "skills": "Compétences",
    "projects": "Projets",
    "resume": "CV",
    "language": "EN"
  },
  "hero": {
    "name": "Quentin COLPART",
    "title": "Ingénieur Cybersécurité",
    "description": "Transition du data engineering vers la cybersécurité. Passionné par la sécurité cloud, l'automatisation et la construction de systèmes sécurisés.",
    "viewProjects": "Voir mes projets",
    "contactMe": "Me contacter"
  },
  "about": {
    "title": "À propos",
    "profile": "Ingénieur diplômé avec une formation initiale dans le domaine de la santé, j'ai évolué dans des environnements techniques complexes, notamment autour du cloud et du traitement de données. J'y ai développé une compréhension des systèmes d'information et de leurs enjeux en matière de sécurité et de gestion des risques.\n\nAdmis en Master Cybersécurité des Infrastructures et des Systèmes d'Information à ESIEA, je souhaite aujourd'hui m'orienter vers la cybersécurité afin de développer mes compétences et construire progressivement mon projet professionnel dans ce domaine.",
    "stats": {
      "experience": {
        "value": "3+ ans",
        "label": "Expérience professionnelle"
      },
      "education": {
        "value": "Master 2026",
        "label": "Cybersécurité @ ESIEA"
      },
      "expertise": {
        "value": "Data & Cloud",
        "label": "Background ingénierie"
      },
      "languages": {
        "value": "FR • EN",
        "label": "Natif • Professionnel"
      }
    },
    "interests": {
      "title": "Centres d'intérêt",
      "sport": {
        "title": "Sport",
        "items": ["Musculation", "Course à pied", "Calisthenics"]
      },
      "art": {
        "title": "Art",
        "items": ["Dessin", "Poterie"]
      },
      "tech": {
        "title": "Technologie",
        "items": ["Modélisation 3D", "IA générative (ComfyUI)"]
      }
    }
  },
  "experience": {
    "title": "Expériences Professionnelles"
  },
  "skills": {
    "title": "Compétences Techniques",
    "categories": {
      "programming": "Programmation & Informatique",
      "cloud": "Cloud & Data Engineering",
      "management": "Gestion de projet",
      "soft": "Soft Skills"
    }
  },
  "projects": {
    "title": "Projets Personnels",
    "viewCode": "Voir le code",
    "liveDemo": "Démo en ligne",
    "viewProfile": "Voir le profil",
    "inDevelopment": "En développement"
  },
  "contact": {
    "title": "Me contacter",
    "message": "Envie de discuter de mes projets, de calisthenics, de génération IA ou d'impression 3D ?",
    "button": "M'envoyer un email",
    "backToTop": "Retour en haut"
  },
  "footer": {
    "copyright": "© 2026 Quentin COLPART",
    "builtWith": "Construit avec React + TypeScript"
  }
}
```

- [ ] **Step 2: Create English translations**

Create `src/data/translations/en.json`:

```json
{
  "nav": {
    "about": "About",
    "experience": "Experience",
    "skills": "Skills",
    "projects": "Projects",
    "resume": "Resume",
    "language": "FR"
  },
  "hero": {
    "name": "Quentin COLPART",
    "title": "Cybersecurity Engineer",
    "description": "Transitioning from data engineering to cybersecurity. Passionate about cloud security, automation, and building secure systems.",
    "viewProjects": "View Projects",
    "contactMe": "Contact Me"
  },
  "about": {
    "title": "About Me",
    "profile": "Engineering graduate with initial training in healthcare, I have evolved in complex technical environments, particularly around cloud and data processing. I developed an understanding of information systems and their security and risk management challenges.\n\nAdmitted to the Master's in Cybersecurity of Infrastructures and Information Systems at ESIEA, I now want to move towards cybersecurity to develop my skills and progressively build my professional project in this field.",
    "stats": {
      "experience": {
        "value": "3+ Years",
        "label": "Professional Experience"
      },
      "education": {
        "value": "Master's 2026",
        "label": "Cybersecurity @ ESIEA"
      },
      "expertise": {
        "value": "Data & Cloud",
        "label": "Engineering Background"
      },
      "languages": {
        "value": "FR • EN",
        "label": "Native • Professional"
      }
    },
    "interests": {
      "title": "Interests",
      "sport": {
        "title": "Sport",
        "items": ["Weight training", "Running", "Calisthenics"]
      },
      "art": {
        "title": "Art",
        "items": ["Drawing", "Pottery"]
      },
      "tech": {
        "title": "Technology",
        "items": ["3D Modeling", "Generative AI (ComfyUI)"]
      }
    }
  },
  "experience": {
    "title": "Professional Experience"
  },
  "skills": {
    "title": "Technical Skills",
    "categories": {
      "programming": "Programming & IT",
      "cloud": "Cloud & Data Engineering",
      "management": "Project Management",
      "soft": "Soft Skills"
    }
  },
  "projects": {
    "title": "Personal Projects",
    "viewCode": "View Code",
    "liveDemo": "Live Demo",
    "viewProfile": "View Profile",
    "inDevelopment": "In Development"
  },
  "contact": {
    "title": "Get In Touch",
    "message": "Want to discuss about my projects, calisthenics, AI generation, or 3D printing?",
    "button": "Send me an Email",
    "backToTop": "Back to top"
  },
  "footer": {
    "copyright": "© 2026 Quentin COLPART",
    "builtWith": "Built with React + TypeScript"
  }
}
```

- [ ] **Step 3: Verify JSON is valid**

```bash
cat src/data/translations/fr.json | jq . > /dev/null && echo "Valid JSON"
cat src/data/translations/en.json | jq . > /dev/null && echo "Valid JSON"
```

Expected: "Valid JSON" for both

- [ ] **Step 4: Commit translation files**

```bash
git add src/data/translations/
git commit -m "feat: add FR/EN translation files"
```

---

### Task 4: Data Layer - Experience Data

**Files:**
- Create: `src/data/experiences.ts`
- Create: `src/types/experience.ts`

**Interfaces:**
- Consumes: `Language` from `src/types/language.ts`
- Produces:
  - `interface Experience { id: number; title: string; company: string; location: string; period: string; contractType: string; description: string; responsibilities: string[]; }`
  - `getExperiences(lang: Language): Experience[]`

- [ ] **Step 1: Create Experience type**

Create `src/types/experience.ts`:

```typescript
export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  contractType: string;
  description: string;
  responsibilities: string[];
}
```

- [ ] **Step 2: Create experiences data file**

Create `src/data/experiences.ts`:

```typescript
import type { Language } from '../types/language';
import type { Experience } from '../types/experience';

const experiencesFR: Experience[] = [
  {
    id: 1,
    title: "Ingénieur d'études PDA",
    company: "AMADEUS (EEKEM)",
    location: "Nice, France",
    period: "Juillet 2025 - Aujourd'hui",
    contractType: "CDI",
    description: "Product Definition Analyst - Business/Data Analyst dans un environnement Big Data et cloud.",
    responsibilities: [
      "Exploitation d'environnements cloud (AWS EMR, Databricks) pour l'exécution, l'analyse et les tests de notebooks data",
      "Déclenchement et supervision de jobs via Jenkins dans un environnement Big Data",
      "Réalisation d'études de faisabilité, validation des prérequis techniques et refinement des évolutions produit",
      "Participation aux phases de qualification et validation technique avant mise en production",
      "Analyse des besoins métiers et rédaction de spécifications fonctionnelles et techniques",
      "Rédaction et maintien de la documentation fonctionnelle et technique",
      "Coordination transverse entre équipes DevOps, Produit et Data dans un contexte international",
      "Pilotage des cérémonies Agile (daily, rétrospectives, revues d'itération) en rôle de Scrum Master",
      "Formalisation des user stories, définition des critères d'acceptation et suivi des livrables sous Jira"
    ]
  },
  {
    id: 2,
    title: "Développeur Python",
    company: "ME3D Graft - Your Anastomosis",
    location: "Pécs, Hongrie",
    period: "Février 2024 - Mars 2025",
    contractType: "CDD",
    description: "Développement d'une application d'automatisation pour la reconstruction 3D et l'analyse d'images médicales.",
    responsibilities: [
      "Développement d'une application d'automatisation via Python (Tkinter, Pillow)",
      "Analyse d'images et reconstruction 3D",
      "Gestion Agile (backlog, user stories, sprints)",
      "Tests fonctionnels et maintenance corrective"
    ]
  },
  {
    id: 3,
    title: "Mission d'étude EPF",
    company: "AP-HP de Garches",
    location: "Garches, France",
    period: "Septembre 2023 - Janvier 2024",
    contractType: "Projet d'étude",
    description: "Exploiter l'IA pour développer un outil d'aide au diagnostic et au suivi des patients atteints d'AVC sur une base d'IRM.",
    responsibilities: [
      "Recueil des besoins auprès de radiologues/cliniciens, rédaction de spécifications",
      "Animation d'ateliers, formation et support utilisateurs",
      "Préparation de données DICOM, développement IA (segmentation TensorFlow)"
    ]
  },
  {
    id: 4,
    title: "Analyste Risques Cyber",
    company: "EQUANS",
    location: "Courbevoie, France",
    period: "Septembre 2022 - Janvier 2023",
    contractType: "Stage",
    description: "Participation à la construction des Dashboard Security et outils de Reporting des risques cyber.",
    responsibilities: [
      "Déploiement de campagnes de sensibilisation cyber (planning, supports, communication interne)",
      "Création de tableaux de bord Power BI pour suivi d'indicateurs de maturité sécurité",
      "Automatisation de workflows (Power Automate)",
      "Analyses de risques inter-BU (matrices impact/vraisemblance)"
    ]
  }
];

const experiencesEN: Experience[] = [
  {
    id: 1,
    title: "Product Definition Analyst Engineer",
    company: "AMADEUS (EEKEM)",
    location: "Nice, France",
    period: "July 2025 - Present",
    contractType: "Full-time",
    description: "Product Definition Analyst - Business/Data Analyst in Big Data and cloud environment.",
    responsibilities: [
      "Cloud environment exploitation (AWS EMR, Databricks) for execution, analysis, and notebook data testing",
      "Trigger and supervise jobs via Jenkins in Big Data environment",
      "Feasibility studies, validation of technical prerequisites, and product evolution refinement",
      "Participate in qualification and technical validation phases before production",
      "Business needs analysis and functional/technical specifications writing",
      "Functional and technical documentation creation and maintenance",
      "Cross-team coordination between DevOps, Product, and Data in international context",
      "Lead Agile ceremonies (daily, retrospectives, iteration reviews) as Scrum Master",
      "User stories formalization, acceptance criteria definition, and Jira deliverables tracking"
    ]
  },
  {
    id: 2,
    title: "Python Developer",
    company: "ME3D Graft - Your Anastomosis",
    location: "Pécs, Hungary",
    period: "February 2024 - March 2025",
    contractType: "Fixed-term",
    description: "Development of automation application for 3D reconstruction and medical image analysis.",
    responsibilities: [
      "Automation application development via Python (Tkinter, Pillow)",
      "Image analysis and 3D reconstruction",
      "Agile management (backlog, user stories, sprints)",
      "Functional testing and corrective maintenance"
    ]
  },
  {
    id: 3,
    title: "Engineering Study Mission",
    company: "AP-HP Garches Hospital",
    location: "Garches, France",
    period: "September 2023 - January 2024",
    contractType: "Study Project",
    description: "Leverage AI to develop a diagnostic and patient follow-up tool for stroke patients using MRI data.",
    responsibilities: [
      "Requirements gathering from radiologists/clinicians, specifications writing",
      "Workshop facilitation, user training and support",
      "DICOM data preparation, AI development (TensorFlow segmentation)"
    ]
  },
  {
    id: 4,
    title: "Cyber Risk Analyst",
    company: "EQUANS",
    location: "Courbevoie, France",
    period: "September 2022 - January 2023",
    contractType: "Internship",
    description: "Contributing to Security Dashboard construction and cyber risk reporting tools.",
    responsibilities: [
      "Cyber awareness campaign deployment (planning, materials, internal communication)",
      "Power BI dashboards for security maturity indicators tracking",
      "Workflow automation (Power Automate)",
      "Inter-business unit risk analysis (impact/likelihood matrices)"
    ]
  }
];

export const getExperiences = (lang: Language): Experience[] => {
  return lang === 'fr' ? experiencesFR : experiencesEN;
};
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npm run typecheck
```

Expected: No errors

- [ ] **Step 4: Commit experience data**

```bash
git add src/types/experience.ts src/data/experiences.ts
git commit -m "feat: add experience data with FR/EN support"
```

---

### Task 5: Data Layer - Projects & Skills Data

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/types/project.ts`
- Create: `src/data/skills.ts`
- Create: `src/types/skill.ts`

**Interfaces:**
- Consumes: `Language` from `src/types/language.ts`
- Produces:
  - `interface Project { id: number; title: string; description: string; techStack: string[]; image: string; status?: string; links: { github?: string; live?: string; external?: string; }; }`
  - `getProjects(lang: Language): Project[]`
  - `interface Skill { name: string; level: number; }`
  - `interface SkillCategory { category: string; icon: string; skills: Skill[]; }`
  - `getSkills(lang: Language): SkillCategory[]`

- [ ] **Step 1: Create Project type**

Create `src/types/project.ts`:

```typescript
export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  status?: string;
  links: {
    github?: string;
    live?: string;
    external?: string;
  };
}
```

- [ ] **Step 2: Create projects data**

Create `src/data/projects.ts`:

```typescript
import type { Language } from '../types/language';
import type { Project } from '../types/project';

const projectsFR: Project[] = [
  {
    id: 1,
    title: "TimeUp - Jeu de Navigateur",
    description: "Jeu multijoueur basé sur le navigateur avec synchronisation en temps réel",
    techStack: ["React", "TypeScript", "Supabase", "TailwindCSS"],
    image: "/images/timesup-preview.png",
    links: {
      github: "https://github.com/RAYAXss/timesup",
      live: "https://timesup-game.netlify.app"
    }
  },
  {
    id: 2,
    title: "Générateur de Clips Verticaux",
    description: "Outil automatisé pour générer du contenu vidéo vertical pour les réseaux sociaux",
    techStack: ["Python", "HTML", "CSS"],
    image: "/images/vertical-clips-preview.png",
    status: "En développement",
    links: {
      github: "https://github.com/RAYAXss/vertical-clips"
    }
  },
  {
    id: 3,
    title: "RootMe - Défis Cybersécurité",
    description: "Défis de cybersécurité et développement de compétences sur la plateforme RootMe",
    techStack: ["Security", "CTF", "Pentesting"],
    image: "/images/rootme-preview.png",
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
    image: "/images/timesup-preview.png",
    links: {
      github: "https://github.com/RAYAXss/timesup",
      live: "https://timesup-game.netlify.app"
    }
  },
  {
    id: 2,
    title: "Vertical Clips Generator",
    description: "Automated tool for generating vertical video content for social media",
    techStack: ["Python", "HTML", "CSS"],
    image: "/images/vertical-clips-preview.png",
    status: "In Development",
    links: {
      github: "https://github.com/RAYAXss/vertical-clips"
    }
  },
  {
    id: 3,
    title: "RootMe - Cyber Challenges",
    description: "Cybersecurity challenges and skill development on RootMe platform",
    techStack: ["Security", "CTF", "Pentesting"],
    image: "/images/rootme-preview.png",
    links: {
      external: "https://www.root-me.org/RAYAX?lang=en"
    }
  }
];

export const getProjects = (lang: Language): Project[] => {
  return lang === 'fr' ? projectsFR : projectsEN;
};
```

- [ ] **Step 3: Create Skill types**

Create `src/types/skill.ts`:

```typescript
export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}
```

- [ ] **Step 4: Create skills data**

Create `src/data/skills.ts`:

```typescript
import type { Language } from '../types/language';
import type { SkillCategory } from '../types/skill';

const skillsFR: SkillCategory[] = [
  {
    category: "Programmation & Informatique",
    icon: "Code2",
    skills: [
      { name: "Python", level: 90 },
      { name: "SQL", level: 85 },
      { name: "Scala", level: 70 },
      { name: "Spark", level: 75 },
      { name: "Git/GitHub", level: 90 },
      { name: "Scripting & Automatisation", level: 80 }
    ]
  },
  {
    category: "Cloud & Data Engineering",
    icon: "Cloud",
    skills: [
      { name: "Azure", level: 80 },
      { name: "Databricks", level: 85 },
      { name: "AWS (EMR)", level: 75 },
      { name: "Redshift", level: 70 },
      { name: "Jenkins", level: 80 },
      { name: "Big Data", level: 75 }
    ]
  },
  {
    category: "Gestion de projet",
    icon: "Briefcase",
    skills: [
      { name: "Agile/Scrum", level: 85 },
      { name: "Recueil des besoins", level: 90 },
      { name: "Rédaction de spécifications", level: 85 },
      { name: "Coordination", level: 80 },
      { name: "Jira/Trello", level: 90 }
    ]
  },
  {
    category: "Soft Skills",
    icon: "Users",
    skills: [
      { name: "Autonome", level: 100 },
      { name: "Adaptable", level: 100 },
      { name: "Proactif", level: 100 },
      { name: "Esprit d'équipe", level: 100 },
      { name: "Curieux", level: 100 },
      { name: "Rigoureux", level: 100 }
    ]
  }
];

const skillsEN: SkillCategory[] = [
  {
    category: "Programming & IT",
    icon: "Code2",
    skills: [
      { name: "Python", level: 90 },
      { name: "SQL", level: 85 },
      { name: "Scala", level: 70 },
      { name: "Spark", level: 75 },
      { name: "Git/GitHub", level: 90 },
      { name: "Scripting & Automation", level: 80 }
    ]
  },
  {
    category: "Cloud & Data Engineering",
    icon: "Cloud",
    skills: [
      { name: "Azure", level: 80 },
      { name: "Databricks", level: 85 },
      { name: "AWS (EMR)", level: 75 },
      { name: "Redshift", level: 70 },
      { name: "Jenkins", level: 80 },
      { name: "Big Data", level: 75 }
    ]
  },
  {
    category: "Project Management",
    icon: "Briefcase",
    skills: [
      { name: "Agile/Scrum", level: 85 },
      { name: "Requirements Gathering", level: 90 },
      { name: "Specifications Writing", level: 85 },
      { name: "Coordination", level: 80 },
      { name: "Jira/Trello", level: 90 }
    ]
  },
  {
    category: "Soft Skills",
    icon: "Users",
    skills: [
      { name: "Autonomous", level: 100 },
      { name: "Adaptable", level: 100 },
      { name: "Proactive", level: 100 },
      { name: "Team Player", level: 100 },
      { name: "Curious", level: 100 },
      { name: "Rigorous", level: 100 }
    ]
  }
];

export const getSkills = (lang: Language): SkillCategory[] => {
  return lang === 'fr' ? skillsFR : skillsEN;
};
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npm run typecheck
```

Expected: No errors

- [ ] **Step 6: Commit projects and skills data**

```bash
git add src/types/project.ts src/data/projects.ts src/types/skill.ts src/data/skills.ts
git commit -m "feat: add projects and skills data with FR/EN support"
```

---

### Task 6: Base UI Components

**Files:**
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/components/ui/Card.tsx`
- Create: `src/components/ui/LanguageToggle.tsx`

**Interfaces:**
- Consumes: `useLanguage` hook
- Produces:
  - `Button({ variant, size, className, onClick, children, ... })`
  - `Card({ hover, className, children, ... })`
  - `LanguageToggle()`

- [ ] **Step 1: Update Button component**

Modify `src/components/ui/Button.tsx`:

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children,
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-full transition-all duration-200 inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-gray-700 hover:bg-gray-100'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

- [ ] **Step 2: Update Card component**

Modify `src/components/ui/Card.tsx`:

```typescript
import React from 'react';

interface CardProps {
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  hover = false, 
  className = '', 
  onClick,
  children 
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-md transition-all duration-200';
  const hoverClasses = hover ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
```

- [ ] **Step 3: Create LanguageToggle component**

Create `src/components/ui/LanguageToggle.tsx`:

```typescript
import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
      aria-label="Toggle language"
    >
      {lang === 'fr' ? 'EN' : 'FR'}
    </button>
  );
};

export default LanguageToggle;
```

- [ ] **Step 4: Verify components compile**

```bash
npm run typecheck
```

Expected: No errors

- [ ] **Step 5: Commit UI components**

```bash
git add src/components/ui/
git commit -m "feat: update Button/Card and add LanguageToggle components"
```

---

### Task 7: Animation Wrapper Component

**Files:**
- Create: `src/components/animations/FadeInOnScroll.tsx`

**Interfaces:**
- Consumes: Framer Motion
- Produces: `FadeInOnScroll({ children, delay?, className? })`

- [ ] **Step 1: Create FadeInOnScroll component**

Create `src/components/animations/FadeInOnScroll.tsx`:

```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({ 
  children, 
  delay = 0,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInOnScroll;
```

- [ ] **Step 2: Verify component compiles**

```bash
npm run typecheck
```

Expected: No errors

- [ ] **Step 3: Commit animation component**

```bash
git add src/components/animations/
git commit -m "feat: add FadeInOnScroll animation wrapper"
```

---

### Task 8: Navigation Component with Scroll Spy

**Files:**
- Create: `src/hooks/useScrollSpy.ts`
- Create: `src/components/layout/Navigation.tsx`

**Interfaces:**
- Consumes: `useLanguage`, translation files, `LanguageToggle`
- Produces:
  - `useScrollSpy(sectionIds: string[]): string` (returns active section id)
  - `Navigation()` component

- [ ] **Step 1: Create useScrollSpy hook**

Create `src/hooks/useScrollSpy.ts`:

```typescript
import { useState, useEffect } from 'react';

export const useScrollSpy = (sectionIds: string[]): string => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for navbar

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeSection;
};
```

- [ ] **Step 2: Create Navigation component**

Create `src/components/layout/Navigation.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Download } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import LanguageToggle from '../ui/LanguageToggle';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const Navigation: React.FC = () => {
  const { lang } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const translations = lang === 'fr' ? translationsFR : translationsEN;
  const sections = ['hero', 'about', 'experience', 'skills', 'projects'];
  const activeSection = useScrollSpy(sections);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'about', label: translations.nav.about },
    { id: 'experience', label: translations.nav.experience },
    { id: 'skills', label: translations.nav.skills },
    { id: 'projects', label: translations.nav.projects }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Avatar + Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              QC
            </div>
            <span className="font-semibold text-gray-900 text-lg hidden sm:block">
              Quentin COLPART
            </span>
          </div>

          {/* Center: Menu items (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === item.id
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          {/* Right: Resume, Social, Language */}
          <div className="flex items-center space-x-4">
            {/* Resume Download */}
            <a
              href="/doc/CV_Cybersécurité.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Download size={18} />
              <span>{translations.nav.resume}</span>
            </a>

            {/* Social Icons */}
            <a
              href="https://github.com/RAYAXss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/quentin-colpart/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <a
              href="/doc/CV_Cybersécurité.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {translations.nav.resume}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
```

- [ ] **Step 3: Verify components compile**

```bash
npm run typecheck
```

Expected: No errors

- [ ] **Step 4: Test navigation in dev server (manual)**

```bash
npm run dev
```

Navigate to localhost, check navbar appears and glassmorphism effect works on scroll.

- [ ] **Step 5: Commit navigation**

```bash
git add src/hooks/useScrollSpy.ts src/components/layout/Navigation.tsx
git commit -m "feat: add Navigation with glassmorphism and scroll spy"
```

---
