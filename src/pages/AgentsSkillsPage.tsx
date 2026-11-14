import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, MessageSquare, Network, Paintbrush } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { getAgentSkills } from '../data/agentSkills';
import FadeInOnScroll from '../components/animations/FadeInOnScroll';
import FlowLine from '../components/ui/FlowLine';
import { Tabs } from '../components/ui/Tabs';
import { InteractiveFlow } from '../components/ui/InteractiveFlow';
import NodeScene from '../components/three/NodeScene';
import type { SceneNode } from '../components/three/NodeScene';

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

const AgentsSkillsPage: React.FC = () => {
  const { lang, t: translations } = useLanguage();
  const skills = getAgentSkills(lang);

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
              {translations.agentSkills.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-content mb-4">
              {translations.agentSkills.title}
            </h1>
            <p className="text-content-muted text-lg mb-6">{translations.agentSkills.subtitle}</p>
            <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-2">
              {translations.agentSkills.flowTitle}
            </p>
            <FlowLine steps={translations.agentSkills.flow} />
          </FadeInOnScroll>
          <NodeScene
            nodes={ORBIT_NODES}
            edges={ORBIT_EDGES}
            spin={0.25}
            distance={8.5}
            className="h-64 sm:h-80 w-full"
          />
        </div>

        {/* Skills à onglets */}
        <div className="mb-16">
          <Tabs
            param="skill"
            ariaLabel={translations.agentSkills.tabsLabel}
            items={skills.map((s) => ({ id: s.id, label: s.name, icon: iconMap[s.icon] || Lightbulb }))}
          >
            {(activeId) => {
              const skill = skills.find((x) => x.id === activeId) ?? skills[0];
              return (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-content mb-2">{skill.name}</h2>
                    <p className="text-content-muted">{skill.description}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-accent mb-1.5">
                      {translations.agentSkills.whyTitle}
                    </h3>
                    <p className="text-content-faint text-sm leading-relaxed">{skill.whyUse}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-accent mb-1.5">
                      {translations.agentSkills.usageTitle}
                    </h3>
                    <p className="text-content-faint text-sm font-mono leading-relaxed">{skill.usage}</p>
                  </div>
                  <div className="bg-surface-2/50 rounded-xl p-4">
                    <h3 className="text-xs font-semibold tracking-wider text-accent mb-1.5">
                      {translations.agentSkills.exampleTitle}
                    </h3>
                    <p className="text-content-faint text-sm leading-relaxed italic">{skill.example}</p>
                  </div>
                  <InteractiveFlow key={skill.id} flow={skill.flow} showLegend={false} />
                </div>
              );
            }}
          </Tabs>
        </div>

        {/* Back link */}
        <FadeInOnScroll>
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-content-muted hover:text-accent transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              {translations.agentSkills.backToPortfolio}
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
};

export default AgentsSkillsPage;
