import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Image, Palette, Video, Box } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { getComfyUIWorkflows } from '../data/comfyui';
import type { ComfyUIWorkflow } from '../types/comfyui';
import FadeInOnScroll from '../components/animations/FadeInOnScroll';
import translationsFR from '../data/translations/fr.json';
import translationsEN from '../data/translations/en.json';

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  image: Image,
  palette: Palette,
  video: Video,
  box: Box,
};

const pipelineSteps = [
  { key: 'prompt', labelFR: 'Prompt', labelEN: 'Prompt' },
  { key: 'image', labelFR: 'Image', labelEN: 'Image' },
  { key: 'video', labelFR: 'Vidéo', labelEN: 'Video' },
  { key: '3d', labelFR: 'Mesh 3D', labelEN: '3D Mesh' },
];

const WorkflowCard: React.FC<{ workflow: ComfyUIWorkflow; index: number }> = ({ workflow, index }) => {
  const Icon = iconMap[workflow.icon] || Image;

  return (
    <FadeInOnScroll delay={index * 0.1}>
      <div className="bg-glass border border-border/10 rounded-2xl p-6 hover:bg-glass-hover transition-all duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Icon size={20} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-content">{workflow.title}</h3>
        </div>

        <p className="text-content-muted text-sm leading-relaxed mb-4">
          {workflow.description}
        </p>

        <ul className="space-y-1.5 mb-4">
          {workflow.features.map((feature) => (
            <li key={feature} className="text-sm text-content-faint flex items-start gap-2">
              <ArrowRight size={14} className="text-accent mt-0.5 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {workflow.techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </FadeInOnScroll>
  );
};

const ComfyUIPage: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;
  const workflows = getComfyUIWorkflows(lang);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <FadeInOnScroll>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-accent mb-3">
              {translations.comfyui.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent mb-4">
              {translations.comfyui.title}
            </h1>
            <p className="text-content-muted text-lg max-w-2xl mx-auto">
              {translations.comfyui.subtitle}
            </p>
          </div>
        </FadeInOnScroll>

        {/* Pipeline Diagram */}
        <FadeInOnScroll delay={0.1}>
          <div className="mb-16">
            <h2 className="text-sm font-semibold tracking-widest text-accent mb-6 text-center">
              {translations.comfyui.pipelineTitle}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0">
              {pipelineSteps.map((step, i) => (
                <React.Fragment key={step.key}>
                  <div className="bg-glass border border-border/10 rounded-xl px-6 py-3 text-center min-w-[100px]">
                    <span className="text-sm font-medium text-content">
                      {lang === 'fr' ? step.labelFR : step.labelEN}
                    </span>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <ArrowRight size={20} className="text-accent shrink-0 rotate-90 sm:rotate-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </FadeInOnScroll>

        {/* Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {workflows.map((workflow, i) => (
            <WorkflowCard key={workflow.id} workflow={workflow} index={i} />
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
              {translations.comfyui.backToPortfolio}
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
};

export default ComfyUIPage;
