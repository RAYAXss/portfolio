import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, MessageSquare, Network, Paintbrush } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { getClaudeSkills } from '../data/claudeSkills';
import type { ClaudeSkill } from '../types/claudeSkill';
import FadeInOnScroll from '../components/animations/FadeInOnScroll';
import FlowLine from '../components/ui/FlowLine';
import NodeScene from '../components/three/NodeScene';
import type { SceneNode } from '../components/three/NodeScene';
import type { Translations } from '../contexts/LanguageContext';

/* Noyau Claude + 4 skills en orbite, reliés au noyau et entre voisins */
const ORBIT_NODES: SceneNode[] = [
  { pos: [0, 0, 0], shape: 'sphere', size: 1.8 },
  ...[0, 1, 2, 3].map((i): SceneNode => {
    const a = (i * Math.PI) / 2;
    return { pos: [Math.cos(a) * 3, i % 2 ? 0.7 : -0.7, Math.sin(a) * 3], shape: 'ico', size: 0.8 };
  }),
];
const ORBIT_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 2], [2, 3], [3, 4], [4, 1],
];

const iconMap: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  'message-square': MessageSquare,
  network: Network,
  paintbrush: Paintbrush,
};

const SkillCard: React.FC<{ skill: ClaudeSkill; index: number; translations: Translations }> = ({ skill, index, translations }) => {
  const Icon = iconMap[skill.icon] || Lightbulb;

  return (
    <FadeInOnScroll delay={index * 0.1}>
      <div className="bg-glass border border-border/10 rounded-2xl p-6 hover:bg-glass-hover hover:border-accent/30 hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Icon size={20} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-content">{skill.name}</h3>
        </div>

        <p className="text-content-muted text-sm leading-relaxed mb-4">
          {skill.description}
        </p>

        <div className="mb-4">
          <h4 className="text-xs font-semibold tracking-wider text-accent mb-1.5">
            {translations.claudeSkills.whyTitle}
          </h4>
          <p className="text-content-faint text-sm leading-relaxed">
            {skill.whyUse}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="text-xs font-semibold tracking-wider text-accent mb-1.5">
            {translations.claudeSkills.usageTitle}
          </h4>
          <p className="text-content-faint text-sm font-mono leading-relaxed">
            {skill.usage}
          </p>
        </div>

        <div className="bg-surface-2/50 rounded-xl p-4">
          <h4 className="text-xs font-semibold tracking-wider text-accent mb-1.5">
            {translations.claudeSkills.exampleTitle}
          </h4>
          <p className="text-content-faint text-sm leading-relaxed italic">
            {skill.example}
          </p>
        </div>
      </div>
    </FadeInOnScroll>
  );
};

const ClaudeSkillsPage: React.FC = () => {
  const { lang, t: translations } = useLanguage();
  const skills = getClaudeSkills(lang);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero : texte + orbite 3D */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
          <FadeInOnScroll>
            <p className="text-sm font-semibold tracking-widest text-accent mb-3">
              {translations.claudeSkills.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-content mb-4">
              {translations.claudeSkills.title}
            </h1>
            <p className="text-content-muted text-lg mb-6">{translations.claudeSkills.subtitle}</p>
            <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-2">
              {translations.claudeSkills.flowTitle}
            </p>
            <FlowLine steps={translations.claudeSkills.flow} />
          </FadeInOnScroll>
          <NodeScene
            nodes={ORBIT_NODES}
            edges={ORBIT_EDGES}
            spin={0.25}
            distance={8.5}
            className="h-64 sm:h-80 w-full"
          />
        </div>

        {/* Skills Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {skills.map((skill, i) => (
            <SkillCard key={skill.id} skill={skill} index={i} translations={translations} />
          ))}
        </div>

        {/* Back link */}
        <FadeInOnScroll>
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-content-muted hover:text-accent transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              {translations.claudeSkills.backToPortfolio}
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
};

export default ClaudeSkillsPage;
