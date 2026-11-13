import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Image,
  Palette,
  Video,
  Box,
  Shield,
  ExternalLink,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { getComfyUIWorkflows } from '../data/comfyui';
import FadeInOnScroll from '../components/animations/FadeInOnScroll';
import SectionHeader from '../components/ui/SectionHeader';
import { Tabs } from '../components/ui/Tabs';
import { InteractiveFlow } from '../components/ui/InteractiveFlow';
import { OutputScene } from '../components/comfyui/OutputScene';
import FlowLine from '../components/ui/FlowLine';
import NodeScene from '../components/three/NodeScene';
import type { SceneNode } from '../components/three/NodeScene';

const iconMap: Record<string, LucideIcon> = {
  image: Image,
  palette: Palette,
  video: Video,
  box: Box,
};

/* Pipeline en 3D : prompt → image → vidéo → mesh (constantes de module = scène stable) */
const PIPELINE_NODES: SceneNode[] = [
  { pos: [-3.6, 0.3, 0], shape: 'octa', size: 0.9 },
  { pos: [-1.2, -0.3, 0.4], shape: 'box', size: 0.9 },
  { pos: [1.2, 0.3, -0.4], shape: 'box', size: 0.9 },
  { pos: [3.6, -0.2, 0], shape: 'ico', size: 1.3 },
];
const PIPELINE_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
];

const ComfyUIPage: React.FC = () => {
  const { lang, t: translations } = useLanguage();
  const workflows = getComfyUIWorkflows(lang);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero : texte + pipeline 3D */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
          <FadeInOnScroll>
            <p className="text-sm font-semibold tracking-widest text-accent mb-3">
              {translations.comfyui.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-content mb-4">
              {translations.comfyui.title}
            </h1>
            <p className="text-content-muted text-lg">{translations.comfyui.subtitle}</p>
          </FadeInOnScroll>
          <div>
            <NodeScene
              nodes={PIPELINE_NODES}
              edges={PIPELINE_EDGES}
              spin={0.12}
              distance={8.5}
              className="h-64 sm:h-80 w-full"
            />
            <p className="sr-only">{translations.comfyui.pipelineTitle}</p>
            <FlowLine steps={translations.comfyui.pipelineSteps} className="mt-2" />
          </div>
        </div>

        {/* Workflows à onglets */}
        <div className="mb-20">
          <Tabs
            param="wf"
            ariaLabel={translations.comfyui.tabsLabel}
            items={workflows.map((w) => ({ id: w.id, label: w.title, icon: iconMap[w.icon] || Image }))}
          >
            {(activeId) => {
              const w = workflows.find((x) => x.id === activeId) ?? workflows[0];
              return (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-content mb-2">{w.title}</h2>
                    <p className="text-content-muted mb-3">{w.tagline}</p>
                    <span className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-border/10 bg-glass text-content-muted mb-3">
                      {w.io}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {w.techStack.map((tech) => (
                        <span key={tech} className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <OutputScene key={w.id} variant={w.id} />
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-accent mb-2">
                      {translations.comfyui.graphTitle}
                    </h3>
                    <InteractiveFlow flow={w.flow} showLegend />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-accent mb-2">
                      {translations.comfyui.featuresTitle}
                    </h3>
                    <ul className="space-y-1.5">
                      {w.features.map((feature) => (
                        <li key={feature} className="text-sm text-content-faint flex items-start gap-2">
                          <ArrowRight size={14} className="text-accent mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }}
          </Tabs>
        </div>

        {/* How to use a workflow */}
        <div className="mb-20">
          <SectionHeader
            title={translations.comfyui.howToTitle}
            align="center"
          />
          <div className="bg-glass border border-border/10 rounded-2xl p-6 sm:p-8">
            <ol className="space-y-4">
              {translations.comfyui.howToSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-content-muted text-sm leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs text-content-faint italic border-t border-border/10 pt-4">
              {translations.comfyui.howToApiTip}
            </p>
          </div>
        </div>

        {/* Safe sources */}
        <div className="mb-16">
          <SectionHeader
            title={translations.comfyui.safeSourcesTitle}
            align="center"
          />

          <div className="bg-glass border border-border/10 rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-3 mb-6">
              <Shield size={20} className="text-accent shrink-0 mt-0.5" />
              <p className="text-content-muted text-sm leading-relaxed">
                {translations.comfyui.safeSourcesSafetensors}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {translations.comfyui.safeSourcesList.map((source) => (
                <div
                  key={source.name}
                  className="bg-surface-2/50 rounded-xl p-4 border border-border/5"
                >
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent font-semibold text-sm hover:underline mb-2"
                  >
                    {source.name}
                    <ExternalLink size={12} />
                  </a>
                  <p className="text-content-faint text-xs leading-relaxed">{source.tip}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-xs text-content-faint italic border-t border-border/10 pt-4">
              {translations.comfyui.safeSourcesHashTip}
            </p>
          </div>
        </div>

        {/* Back link */}
        <FadeInOnScroll>
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-content-muted hover:text-accent transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              {translations.comfyui.backToPortfolio}
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
};

export default ComfyUIPage;
