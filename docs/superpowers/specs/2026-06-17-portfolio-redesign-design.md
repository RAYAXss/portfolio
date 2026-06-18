# Portfolio Redesign - Design Specification

**Date:** 2026-06-17  
**Author:** Claude Code + Quentin COLPART  
**Status:** Approved

## Overview

Complete redesign of Quentin COLPART's portfolio website to create a modern, professional showcase targeting recruiters and technical engineers. The portfolio emphasizes the transition from Product Definition Analyst to Cybersecurity Engineer, featuring glassmorphism UI, smooth animations, and bilingual support (FR/EN).

## Goals

1. **Professional Polish**: Modern design that impresses recruiters and hiring managers
2. **Technical Showcase**: Demonstrate frontend development skills to technical peers
3. **Clear Narrative**: Highlight cybersecurity pivot while showcasing data engineering background
4. **Accessibility**: Responsive design, smooth navigation, bilingual support
5. **Clean Codebase**: Remove Bolt.new traces, production-ready code

## Target Audience

- **Primary**: Technical recruiters and hiring managers in cybersecurity/data engineering
- **Secondary**: Technical engineers and potential collaborators
- **Use Cases**: Job applications, networking, professional presence

## Technical Stack

**Keep existing:**
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.2
- TailwindCSS 3.4.1
- Lucide React (icons)

**Add:**
- Framer Motion (animations)
- react-i18next or custom i18n hook (FR/EN toggle)
- React Scroll or native smooth scroll (navigation)

**Remove:**
- `.bolt/` folder and all references
- EmailJS dependency (replace with mailto)

## Architecture

### Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx          # Sticky glassmorphism navbar
│   │   └── Footer.tsx              # Footer with copyright
│   ├── sections/
│   │   ├── Hero.tsx                # Hero with photo + CTA
│   │   ├── About.tsx               # About me + interests
│   │   ├── Experience.tsx          # Timeline with expandable cards
│   │   ├── Skills.tsx              # Categorized skill cards
│   │   ├── Projects.tsx            # Project grid
│   │   └── Contact.tsx             # Simple mailto CTA
│   ├── ui/
│   │   ├── Button.tsx              # Reusable button component
│   │   ├── Card.tsx                # Base card component
│   │   └── LanguageToggle.tsx      # FR/EN switcher
│   └── animations/
│       └── FadeInOnScroll.tsx      # Reusable scroll animation wrapper
├── hooks/
│   ├── useScrollSpy.ts             # Active section detection
│   └── useLanguage.ts              # i18n hook
├── data/
│   ├── experiences.ts              # Experience data (FR/EN)
│   ├── projects.ts                 # Project data (FR/EN)
│   └── skills.ts                   # Skills data
├── App.tsx
└── main.tsx
```

### Data Flow

1. **Language State**: Context or local storage for FR/EN preference
2. **Navigation**: Active section tracked via scroll position
3. **Content**: Static data files with FR/EN translations
4. **Animations**: Trigger on scroll using Intersection Observer

## Detailed Design

### 1. Navigation Bar

**Appearance:**
- **Initial**: Transparent with `backdrop-blur-md`, 80% opacity, subtle border-bottom
- **Scrolled** (>50px): Solid white background, shadow-md
- **Height**: 70px
- **Position**: Fixed top, z-50

**Layout (Desktop):**
```
[Avatar + Name]                [About | Experience | Skills | Projects]                [Resume | GitHub | LinkedIn | FR/EN]
   (left)                                    (center)                                            (right)
```

**Elements:**
- **Avatar**: Circular 40px, border-2 white, shadow
- **Name**: "Quentin COLPART", font-semibold, text-gray-900
- **Menu Items**: Smooth scroll to sections, active state (text-blue-600, underline-offset-4)
- **Resume Button**: Download icon, "Resume", opens PDF in new tab
- **Social Icons**: GitHub, LinkedIn (20px icons, hover:scale-110)
- **Language Toggle**: "FR | EN", active language bold + text-blue-600

**Mobile (<768px):**
- Hamburger icon right side
- Drawer menu (slide from right)
- Stack all elements vertically in drawer

**Interactions:**
- Smooth scroll to sections (scroll-behavior: smooth or React Scroll)
- Active section highlighted in menu (detect via Intersection Observer)
- Hover effects: menu items scale-105, social icons scale-110

### 2. Hero Section

**Layout:**
- Full viewport height (min-h-screen)
- Two-column grid (60/40 split desktop, stack mobile)

**Left Column:**
- **Name**: "Quentin COLPART" (text-5xl font-bold, gradient text blue-600 to purple-600)
- **Title**: "Cybersecurity Engineer" (text-2xl text-gray-700)
- **Description**: 1-2 lines, text-lg text-gray-600, max-w-xl
  - Example: "Transitioning from data engineering to cybersecurity. Passionate about cloud security, automation, and building secure systems."
- **Social Buttons Row**:
  - GitHub (icon + "GitHub", outlined, hover fill)
  - LinkedIn (icon + "LinkedIn", outlined, hover fill)
  - RootMe (icon + "RootMe", outlined, hover fill)
  - Opens in new tab
- **CTA Buttons Row**:
  - "View Projects" (primary blue-600, scroll to projects)
  - "Contact Me" (outlined, scroll to contact)

**Right Column:**
- Large circular/rounded-2xl photo container (max-w-md)
- Photo with border-4 white, shadow-2xl
- Floating animation (gentle up/down 20px, 3s ease-in-out infinite)
- Gradient border effect (animated gradient rotation)

**Background:**
- Animated gradient: `bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50`
- Optional: Subtle geometric patterns (SVG mesh, 5% opacity)

**Animations:**
- Fade-in on load (0.8s delay stagger)
- Photo float animation (continuous)
- Scroll indicator at bottom (bounce animation)

**Mobile:**
- Stack vertical: photo top (smaller), content below
- Reduce hero height to 80vh

### 3. About Section

**Layout:**
- White background
- Max-w-6xl container, padding py-20
- Section title: "About Me" (text-4xl font-bold, centered, mb-12)

**Content:**
- **Profile Text**: 2-3 paragraphs, text-lg text-gray-700, leading-relaxed, max-w-4xl centered
  - Paragraph 1: Background (engineering degree, specialization)
  - Paragraph 2: Professional evolution (data analyst → PDA → cybersecurity pivot)
  - Paragraph 3: Current focus (Master's in Cybersecurity, interests)

**Stats Cards Grid** (4 cards, grid-cols-4, gap-6, mt-12):
1. **Experience**: "3+ Years" + "Professional Experience"
2. **Education**: "Master's 2026" + "Cybersecurity @ ESIEA"
3. **Expertise**: "Data & Cloud" + "Engineering Background"
4. **Languages**: "FR • EN" + "Native • Professional"

Card design:
- White background, rounded-xl, shadow-md, p-6
- Centered content
- Icon at top (lucide-react)
- Large number/text (text-3xl font-bold text-blue-600)
- Subtitle (text-sm text-gray-600)
- Hover: lift (translate-y-[-4px]), shadow-lg

**Interest Cards Grid** (3 cards, grid-cols-3, gap-6, mt-16):
1. **Sport**: Musculation, running, calisthenics
2. **Art**: Drawing, pottery
3. **Tech**: 3D modeling, Generative AI (ComfyUI)

Card design:
- bg-gray-50, rounded-lg, p-6
- Icon at top (larger, text-blue-600)
- Title (text-xl font-semibold)
- Description list (text-gray-700)
- Hover: bg-gray-100, shadow-md

**Animations:**
- Section fade-in on scroll
- Stats cards stagger (0.1s delay each)
- Interest cards stagger (0.15s delay each)

### 4. Experience Section

**Layout:**
- bg-gray-50
- Max-w-6xl container, padding py-20
- Section title: "Professional Experience" (text-4xl font-bold, centered, mb-16)

**Timeline Design:**
- Vertical line (border-l-2 border-blue-300) on left side (desktop) or center (mobile)
- Timeline dots at each card (w-4 h-4, rounded-full, bg-blue-600, absolute positioning)

**Experience Cards** (4 cards, vertical stack, gap-8):

Each card structure:
```tsx
<Card>
  <Header>
    <Left>
      <CompanyLogo or Icon />
      <Title>Role @ Company</Title>
      <Location + Contract Badge />
    </Left>
    <Right>
      <DateRange />
    </Right>
  </Header>
  <Body>
    <Description (1-2 lines context) />
    <BulletList (3-4 visible by default) />
    {expanded && <BulletList (remaining tasks) />}
  </Body>
  <Footer>
    <ChevronButton (expand/collapse) />
  </Footer>
</Card>
```

**Card Design:**
- White background, rounded-xl, shadow-md, p-6
- Border-l-4 border-blue-600 (accent)
- Transition: all 0.2s ease

**Interactions:**
- **Hover**: translate-y-[-4px], shadow-xl, cursor-pointer
- **Click anywhere on card**: Toggle expand/collapse
- **Expand animation**: Height transition 0.3s, chevron rotate 180°
- **Default state**: Show 3-4 key bullets
- **Expanded state**: Show all bullets (8-10 bullets)

**Experience Data (4 positions):**

1. **AMADEUS - Product Definition Analyst** (Juillet 2025 - Aujourd'hui) | CDI | Nice
   - Key bullets (visible):
     * Exploitation d'environnements cloud (AWS EMR, Databricks) pour l'analyse et tests de notebooks data
     * Déclenchement et supervision de jobs via Jenkins dans un environnement Big Data
     * Analyse des besoins métiers et rédaction de spécifications fonctionnelles et techniques
     * Pilotage des cérémonies Agile (daily, rétrospectives, revues d'itération) en rôle de Scrum Master
   - Additional bullets (expandable):
     * Réalisation d'études de faisabilité, validation des prérequis techniques
     * Participation aux phases de qualification et validation technique avant mise en production
     * Rédaction et maintien de la documentation fonctionnelle et technique
     * Coordination transverse entre équipes DevOps, Produit et Data dans un contexte international
     * Formalisation des user stories, définition des critères d'acceptation et suivi des livrables sous Jira

2. **ME3D Graft - Développeur Python** (Février 2024 - Mars 2025) | CDD | Pécs, Hongrie
   - Key bullets:
     * Développement d'une application d'automatisation via Python (Tkinter, Pillow)
     * Analyse d'images et reconstruction 3D
     * Gestion Agile (backlog, user stories, sprints)
     * Tests fonctionnels et maintenance corrective

3. **AP-HP de Garches - Mission d'étude EPF** (Septembre 2023 - Janvier 2024) | Projet d'étude
   - Key bullets:
     * Recueil des besoins auprès de radiologues/cliniciens, rédaction de spécifications
     * Animation d'ateliers, formation et support utilisateurs
     * Préparation de données DICOM, développement IA (segmentation TensorFlow)

4. **EQUANS - Analyste Risques Cyber** (Septembre 2022 - Janvier 2023) | Stage | Courbevoie
   - Key bullets:
     * Déploiement de campagnes de sensibilisation cyber (planning, supports, communication interne)
     * Création de tableaux de bord Power BI pour suivi d'indicateurs de maturité sécurité
     * Automatisation de workflows (Power Automate)
     * Analyses de risques inter-BU (matrices impact/vraisemblance)

**Animations:**
- Cards fade-in stagger (0.15s delay each)
- Timeline dots appear with scale animation
- Expand/collapse smooth height transition

**Mobile:**
- Timeline centered, cards full width
- Reduce padding, smaller text

### 5. Skills Section

**Layout:**
- White background
- Max-w-6xl container, padding py-20
- Section title: "Technical Skills" (text-4xl font-bold, centered, mb-16)

**Grid Layout:**
- 2x2 grid (desktop), 1 column (mobile)
- gap-8

**Skill Category Cards** (4 cards):

1. **Programming & Informatics**
   - Icon: Code2 (lucide-react)
   - Skills with progress bars:
     * Python: 90%
     * SQL: 85%
     * Scala: 70%
     * Spark: 75%
     * Git/GitHub: 90%
     * Scripting & Automation: 80%

2. **Cloud & Data Engineering**
   - Icon: Cloud (lucide-react)
   - Skills with progress bars:
     * Azure: 80%
     * Databricks: 85%
     * AWS (EMR): 75%
     * Redshift: 70%
     * Jenkins: 80%
     * Big Data: 75%

3. **Project Management**
   - Icon: Briefcase (lucide-react)
   - Skills with progress bars:
     * Agile/Scrum: 85%
     * Requirements Gathering: 90%
     * Specifications Writing: 85%
     * Coordination: 80%
     * Jira/Trello: 90%

4. **Soft Skills**
   - Icon: Users (lucide-react)
   - Badge pills (no bars):
     * Autonomous
     * Adaptable
     * Proactive
     * Team Player
     * Curious
     * Rigorous

**Card Design:**
- White background, rounded-xl, shadow-lg, p-8
- Border-t-4 (category color: blue/purple/green/orange)
- Icon at top left, large (w-12 h-12), category color
- Category title (text-xl font-bold, mb-6)

**Skill Bar Design:**
- Skill name (text-sm font-medium text-gray-700, mb-2)
- Background bar (w-full h-2 bg-gray-200 rounded-full)
- Fill bar (h-2 rounded-full, category color, transition width 1s ease-out)
- Percentage label optional (text-xs text-gray-500, right side)

**Soft Skills Badge Design:**
- Inline-flex flex-wrap gap-2
- Each badge: px-3 py-1, rounded-full, bg-gray-100, text-sm text-gray-700
- Hover: bg-blue-50, text-blue-700

**Animations:**
- Cards fade-in stagger
- Skill bars animate from 0% to target% on scroll into view (Intersection Observer)
- Stagger skill bar animations within each card (0.1s delay)

**Mobile:**
- Single column, full width cards
- Reduce padding

### 6. Projects Section

**Layout:**
- bg-gray-50
- Max-w-6xl container, padding py-20
- Section title: "Personal Projects" (text-4xl font-bold, centered, mb-16)

**Grid Layout:**
- 3 columns (desktop), 1 column (mobile)
- gap-8

**Project Cards** (3 cards):

1. **TimeUp - Browser Game**
   - Image: Game screenshot or placeholder (aspect-ratio-video, rounded-t-xl)
   - Title: "TimeUp" (text-2xl font-bold)
   - Tech badges: React • TypeScript • Supabase • TailwindCSS
   - Description: "Multiplayer browser-based time's up game with real-time synchronization"
   - Buttons:
     * "View Code" (GitHub icon, outlined)
     * "Live Demo" (ExternalLink icon, primary) [if deployed]

2. **Vertical Clips Automation**
   - Image: Video editing themed image or placeholder
   - Title: "Vertical Clips Generator" (text-2xl font-bold)
   - Tech badges: Python • HTML • CSS
   - Status badge: "In Development" (orange badge)
   - Description: "Automated tool for generating vertical video content for social media"
   - Button:
     * "View Code" (GitHub icon, outlined) [if repo public]

3. **RootMe - Cyber Challenges**
   - Image: Cyber-themed image or RootMe logo
   - Title: "RootMe Profile" (text-2xl font-bold)
   - Tech badges: Security • CTF • Pentesting
   - Description: "Cybersecurity challenges and skill development on RootMe platform"
   - Stats display (if available): Score, Rank, Challenges solved
   - Button:
     * "View Profile" (ExternalLink icon, primary)

**Card Design:**
- White background, rounded-xl, shadow-md, overflow-hidden
- Image section: overflow-hidden, relative
  - Image: object-cover, transition transform 0.3s
  - Overlay gradient on hover (black/50 from bottom)
- Content section: p-6
- Tech badges: flex flex-wrap gap-2, text-xs, bg-blue-100 text-blue-700, rounded-full px-2 py-1
- Description: text-gray-600, text-sm, mb-4
- Buttons: flex gap-2

**Interactions:**
- **Hover**: Card lift (translate-y-[-8px]), shadow-2xl
- **Image zoom**: scale-110 on card hover
- **Button hover**: scale-105, color shift

**Animations:**
- Cards fade-in stagger (0.2s delay each)
- Image zoom on hover (smooth)

**Mobile:**
- Single column, full width
- Reduce image height

### 7. Contact Section

**Layout:**
- Dark background: `bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900`
- White text
- Max-w-4xl container, padding py-20
- Centered content

**Content Structure:**
- Section title: "Get In Touch" (text-4xl font-bold text-white, centered, mb-8)
- Friendly text: "Want to discuss about my projects, calisthenics, AI generation, or 3D printing?" (text-xl text-gray-200, centered, mb-8, max-w-2xl)
- Primary CTA: Large button "Send me an Email" (bg-white text-blue-900, hover:bg-gray-100, rounded-full, px-8 py-4, text-lg font-semibold, shadow-xl)
  - Opens: `mailto:qcolpart@gmail.com`
- Social links row (mt-8, flex gap-4, justify-center):
  - LinkedIn icon button (w-12 h-12, rounded-full, bg-white/10, hover:bg-white/20)
  - GitHub icon button (same style)
  - RootMe icon button (same style)
  - Opens in new tab

**Footer (below, bg-gray-900):**
- Max-w-6xl container, padding py-8
- Flex row: justify-between
- Left: "© 2026 Quentin COLPART" (text-gray-400)
- Center: "Built with React + TypeScript" (text-gray-500, text-sm)
- Right: "Back to top" button (scroll to hero, text-gray-400 hover:text-white)

**Animations:**
- Section fade-in on scroll
- Email button: hover scale-105 + glow effect (shadow-2xl shadow-white/20)
- Social icons: hover scale-110 + rotate-6
- Back to top: smooth scroll + fade-in arrow icon

**Mobile:**
- Stack footer elements vertically
- Full-width email button

## i18n Strategy

**Approach:** Custom hook + JSON files (lightweight, no heavy dependency)

**Structure:**
```typescript
// src/hooks/useLanguage.ts
type Language = 'fr' | 'en';
const useLanguage = () => {
  const [lang, setLang] = useState<Language>('fr'); // default French
  // Save to localStorage
  // Return: { lang, setLang, t: (key) => translations[lang][key] }
}

// src/data/translations/
fr.json
en.json
```

**Translation Keys:**
- Navigation labels
- Section titles
- All content text (experiences, projects, skills)
- Button labels

**Toggle Component:**
- "FR | EN" in navbar
- Active language: font-bold text-blue-600
- Click switches language, saves to localStorage
- Smooth transition: fade content (0.2s)

## Animations Library

**Framer Motion Usage:**

1. **Fade-in on scroll**: Reusable wrapper component
```tsx
<FadeInOnScroll>
  <SectionContent />
</FadeInOnScroll>
```

2. **Stagger children**: For grids (cards, skills)
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map(item => <motion.div variants={itemVariants} />)}
</motion.div>
```

3. **Hover effects**: Scale, lift, shadow on cards/buttons

4. **Page transitions**: Optional, smooth navigation between sections

**Performance:**
- Use `whileInView` + `viewport={{ once: true }}` to trigger animations once
- Avoid animating on every scroll event
- Use CSS transforms (GPU accelerated) over properties like `top`/`left`

## Assets & Content

### Images Required
- **Profile photo**: Add to `public/images/profile.jpg` (user to provide)
- **Project screenshots**:
  - TimeUp: `public/images/timesup-preview.png`
  - Vertical Clips: `public/images/vertical-clips-preview.png`
  - RootMe: Use RootMe logo or generic cyber image
- **Background patterns**: Optional SVG for hero section

### Content Files
Create data files in `src/data/`:

**experiences.ts**:
```typescript
export const experiences = {
  fr: [ /* 4 experiences with all fields */ ],
  en: [ /* 4 experiences translated */ ]
}
```

**projects.ts**:
```typescript
export const projects = {
  fr: [ /* 3 projects */ ],
  en: [ /* 3 projects translated */ ]
}
```

**skills.ts**:
```typescript
export const skills = [
  {
    category: 'programming',
    skills: [
      { name: 'Python', level: 90 },
      // ...
    ]
  },
  // ...
]
```

### Resume PDF
- Replace `public/doc/CV_Quentin_COLPART.pdf` with `public/doc/CV_Cybersécurité.pdf`
- Update resume download link in navbar

## Cleanup Tasks

**Remove:**
1. Delete `.bolt/` folder entirely
2. Remove EmailJS dependency from `package.json`
3. Remove old project sections (Interests if commented out)
4. Remove any Bolt.new references in code
5. Clean up unused images in `public/images/` (keep: IRM.png, hanche.png, pieds.png optional for archive)

**Update:**
1. `package.json` name: "quentin-colpart-portfolio"
2. `index.html` title: "Quentin COLPART | Cybersecurity Engineer"
3. Favicon: Update if desired
4. README.md: Add project description, setup instructions

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (breakpoints: 640px, 768px, 1024px, 1280px)
- Smooth scroll support (fallback for older browsers)
- CSS backdrop-filter support (glassmorphism)

## Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90 (Performance, Accessibility, Best Practices, SEO)
- Bundle size: < 500KB (gzipped)

**Optimization:**
- Lazy load images (native `loading="lazy"`)
- Code splitting (React.lazy for heavy sections)
- Optimize images (WebP format, responsive sizes)
- Minimize animation JavaScript (use CSS where possible)

## Accessibility

- Semantic HTML (nav, section, article, header, footer)
- ARIA labels for icon buttons
- Keyboard navigation support (tab order, focus states)
- Alt text for all images
- Color contrast: WCAG AA minimum (4.5:1 text, 3:1 UI)
- Skip to content link (optional)
- Reduced motion media query respect

## Testing Checklist

**Visual:**
- [ ] All sections render correctly
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1920px)
- [ ] Glassmorphism effect works on navbar scroll
- [ ] Images load and display properly
- [ ] Animations smooth (60fps)

**Functional:**
- [ ] Navigation scrolls to correct sections
- [ ] Active section highlights in navbar
- [ ] Language toggle switches content
- [ ] Experience cards expand/collapse
- [ ] Resume PDF downloads correctly
- [ ] Social links open in new tabs
- [ ] Email button opens mail client
- [ ] Mobile menu opens/closes

**Content:**
- [ ] All text in French by default
- [ ] English translations complete
- [ ] No placeholder text remaining
- [ ] Technical details accurate
- [ ] Links valid (GitHub, LinkedIn, RootMe)

**Performance:**
- [ ] Page loads < 3s on 3G
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Smooth scroll performance

## Success Metrics

**User Experience:**
- Average session duration > 2 minutes
- Bounce rate < 40%
- Mobile traffic > 50% handled well

**Professional Impact:**
- Used in job applications
- Shared on LinkedIn
- Positive feedback from recruiters/engineers

## Future Enhancements (Out of Scope)

- Dark mode toggle
- Blog section for articles
- Animated code snippets
- Real-time GitHub stats integration
- RootMe API integration for live stats
- Project detail pages
- Testimonials section
- Analytics integration (Google Analytics / Plausible)

## Notes

- Keep existing EmailJS config if needed later, but don't use for MVP
- Profile photo: User will provide, use placeholder initially
- RootMe profile link: https://www.root-me.org/RAYAX?lang=fr
- GitHub: https://github.com/RAYAXss
- LinkedIn: https://www.linkedin.com/in/quentin-colpart/
- Email: qcolpart@gmail.com
- Location: Paris, Île-de-France
- Rootme profile text label TBD (use "Rootme" or custom)

## Design References

**Style inspiration:**
- Glassmorphism: macOS Big Sur, Windows 11 Fluent Design
- Portfolio examples: brittanychiang.com, caferati.me
- Color palette: Blue (primary), Indigo, Purple (accents), Gray scale

**Typography:**
- Font family: System font stack or Inter (import from Google Fonts)
- Headings: Bold, larger sizes (text-4xl, text-5xl)
- Body: Regular, readable (text-base, text-lg)
- Line height: Generous (leading-relaxed)

## Conclusion

This design specification provides a complete blueprint for rebuilding the portfolio website. The focus is on modern aesthetics, professional presentation, and clear narrative around the cybersecurity transition. All sections are designed to be responsive, accessible, and performant while showcasing technical skills through both content and implementation quality.

Next step: Create detailed implementation plan breaking down this design into executable tasks.
