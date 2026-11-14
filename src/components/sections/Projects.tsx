import React, { useMemo, useState } from 'react';
import { Github, ExternalLink, FileText, Play, Plus, Minus, Shield, Code2, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getProjects } from '../../data/projects';
import type { Project, ProjectCategory, ProjectLinkKind } from '../../types/project';
import SectionHeader from '../ui/SectionHeader';

/* ─────────────────────────────────────────────
   Projets : une ligne par projet (miniature, titre, résumé).
   Un clic ouvre le détail sous la ligne : captures, ce que j'ai fait,
   outils et liens (code, application à tester, rapport, profil).
───────────────────────────────────────────── */

type Filter = 'all' | ProjectCategory;

const categoryIcon: Record<ProjectCategory, LucideIcon> = {
  cyber: Shield,
  dev: Code2,
  engineering: Wrench,
};

const linkIcon: Record<ProjectLinkKind, LucideIcon> = {
  code: Github,
  demo: Play,
  report: FileText,
  profile: ExternalLink,
};

const Thumb: React.FC<{ project: Project; className?: string }> = ({ project, className = '' }) => {
  const Icon = categoryIcon[project.category];
  return project.images[0] ? (
    <img
      src={project.images[0]}
      alt=""
      loading="lazy"
      className={`object-cover bg-surface-2 border border-border/10 ${className}`}
    />
  ) : (
    <span className={`flex items-center justify-center bg-surface-2 border border-border/10 text-content-faint ${className}`}>
      <Icon className="w-5 h-5" aria-hidden="true" />
    </span>
  );
};

const ProjectDetail: React.FC<{ project: Project }> = ({ project }) => {
  const { t } = useLanguage();
  const [shown, setShown] = useState(0);
  const image = project.images[shown];

  return (
    <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 pt-2 pb-8">
      {/* Captures */}
      {project.images.length > 0 && (
        <div>
          <a href={image} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-border/10 bg-surface-2">
            <img
              src={image}
              alt={t.projects.screenshot.replace('{title}', project.title)}
              className="w-full aspect-video object-contain"
            />
          </a>
          {project.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {project.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setShown(i)}
                  aria-pressed={i === shown}
                  className={`w-16 h-11 rounded-md overflow-hidden border ${i === shown ? 'border-accent' : 'border-border/10 opacity-70 hover:opacity-100'}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Texte */}
      <div className={project.images.length === 0 ? 'md:col-span-2 max-w-3xl' : ''}>
        <p className="text-content-muted leading-relaxed">{project.description}</p>

        {project.highlights.length > 0 && (
          <>
            <h4 className="mt-6 mb-2 text-sm font-semibold text-content">{t.projects.highlights}</h4>
            <ul className="space-y-1.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm text-content-muted">
                  <span className="mt-2 w-1 h-1 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          </>
        )}

        {project.techStack.length > 0 && (
          <>
            <h4 className="mt-6 mb-2 text-sm font-semibold text-content">{t.projects.stack}</h4>
            <p className="text-sm text-content-muted">{project.techStack.join(', ')}</p>
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {project.links.length === 0 && <p className="text-sm text-content-faint">{t.projects.noLinks}</p>}
          {project.links.map((link) => {
            const Icon = linkIcon[link.kind];
            const primary = link.kind === 'demo';
            return (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 min-h-[40px] px-4 rounded-md text-sm font-medium transition-colors ${
                  primary
                    ? 'bg-action text-white hover:opacity-90'
                    : 'border border-border-strong text-content hover:border-accent hover:text-accent'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {t.projects.links[link.kind]}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const { lang, t } = useLanguage();
  const projects = useMemo(() => getProjects(lang), [lang]);
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const filters: Filter[] = ['all', 'cyber', 'dev', 'engineering'];
  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t.projects.title}
          lead={t.projects.lead}
          aside={
            <div role="group" aria-label={t.projects.title} className="flex flex-wrap gap-1 p-1 rounded-lg border border-border/10 bg-surface-2/60 self-start md:self-auto">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`px-3 min-h-[36px] rounded-md text-sm transition-colors ${
                    filter === f ? 'bg-surface text-content shadow-sm' : 'text-content-muted hover:text-content'
                  }`}
                >
                  {t.projects.filters[f]}
                </button>
              ))}
            </div>
          }
        />

        <ul className="border-t border-border/10">
          {visible.map((project) => {
            const isOpen = openId === project.id;
            const panelId = `project-panel-${project.id}`;
            return (
              <li key={project.id} id={`project-${project.id}`} className="border-b border-border/10">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : project.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group w-full flex items-center gap-4 sm:gap-5 py-5 text-left"
                  >
                    <Thumb project={project} className="w-16 h-12 sm:w-24 sm:h-16 rounded-md shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-lg font-semibold text-content group-hover:text-accent transition-colors">
                          {project.title}
                        </span>
                        <span className="text-sm text-content-faint">{project.context}</span>
                        {project.status && (
                          <span className="text-xs px-2 py-0.5 rounded border border-accent/40 text-accent">{project.status}</span>
                        )}
                      </span>
                      <span className="block mt-1 text-sm text-content-muted">{project.summary}</span>
                    </span>
                    <span className="sr-only">{isOpen ? t.projects.close : t.projects.open}</span>
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-full border border-border-strong flex items-center justify-center text-content-muted group-hover:border-accent group-hover:text-accent shrink-0"
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div id={panelId} role="region" aria-label={project.title}>
                    <ProjectDetail project={project} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Projects;
