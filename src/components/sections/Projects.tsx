import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getProjects } from '../../data/projects';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import Card from '../ui/Card';
import Button from '../ui/Button';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const Projects: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;
  const projects = getProjects(lang);

  return (
    <section id="projects" className="py-16 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <h2 className="text-3xl font-bold text-center mb-10 text-white">
            {translations.projects.title}
          </h2>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <FadeInOnScroll key={project.id} delay={index * 0.2}>
              <Card hover className="overflow-hidden h-full flex flex-col group bg-gray-800 border border-gray-700">
                {/* Project Image */}
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {project.status && (
                    <div className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {project.status}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold mb-2 text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 flex-grow">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs font-medium border border-blue-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <Github size={14} className="mr-1" />
                          {translations.projects.viewCode}
                        </Button>
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="primary" size="sm" className="w-full text-xs">
                          <ExternalLink size={14} className="mr-1" />
                          {translations.projects.liveDemo}
                        </Button>
                      </a>
                    )}
                    {project.links.external && !project.links.live && (
                      <a
                        href={project.links.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="primary" size="sm" className="w-full text-xs">
                          <ExternalLink size={14} className="mr-1" />
                          {translations.projects.viewProfile}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
