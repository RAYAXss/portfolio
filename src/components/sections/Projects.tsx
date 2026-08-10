import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import { Github, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';

import { useLanguage } from '../../hooks/useLanguage';
import { getProjects } from '../../data/projects';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';

import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const CARD_W = 280;
const CARD_GAP = 24;
const STEP = CARD_W + CARD_GAP;

const Projects: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;
  const projects = getProjects(lang);
  const count = projects.length;

  const carouselProjects = useMemo(() => [...projects, ...projects, ...projects], [projects]);

  const [activeIndex, setActiveIndex] = useState(count);
  const [expanded, setExpanded] = useState<number | null>(null);

  const x = useMotionValue(-(count * STEP + CARD_W / 2));

  useEffect(() => {
    const unsubscribe = x.on('change', (latestX) => {
      const index = Math.round(-(latestX + CARD_W / 2) / STEP);
      const clamped = Math.max(0, Math.min(count * 3 - 1, index));
      setActiveIndex((prev) => (prev !== clamped ? clamped : prev));
    });
    return () => unsubscribe();
  }, [x, count]);

  const normalizeInfiniteLoop = useCallback((currentIndex: number) => {
    if (currentIndex < count || currentIndex >= count * 2) {
      const normalizedIndex = (currentIndex % count) + count;
      x.set(-(normalizedIndex * STEP + CARD_W / 2));
    }
  }, [count, x]);

  const moveTo = useCallback((targetIndex: number) => {
    const targetX = -(targetIndex * STEP + CARD_W / 2);
    animate(x, targetX, {
      type: 'spring',
      stiffness: 280,
      damping: 30,
      mass: 0.8,
      onComplete: () => normalizeInfiniteLoop(targetIndex),
    });
  }, [x, normalizeInfiniteLoop]);

  const move = useCallback((direction: 1 | -1) => {
    moveTo(activeIndex + direction);
  }, [activeIndex, moveTo]);

  const handleDragEnd = (_: any, { velocity }: { velocity: { x: number } }) => {
    const currentX = x.get();
    const predictedX = currentX + velocity.x * 0.15;
    let nearestIndex = Math.round(-(predictedX + CARD_W / 2) / STEP);
    nearestIndex = Math.max(0, Math.min(carouselProjects.length - 1, nearestIndex));
    moveTo(nearestIndex);
  };

  const goToProject = (targetRealIndex: number) => {
    const currentRealIndex = activeIndex % count;
    let diff = targetRealIndex - currentRealIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    moveTo(activeIndex + diff);
  };

  // FIX: clic sur carte adjacente → naviguer; clic sur centrale → ouvrir modal
  const handleCardClick = (index: number, realIndex: number) => {
    if (index !== activeIndex) {
      moveTo(index);
    } else {
      setExpanded(realIndex);
    }
  };

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={lang === 'fr' ? 'RÉALISATIONS' : 'WORK'}
          title={translations.projects.title}
          className="mb-16"
        />

        <div className="relative" style={{ height: 480, perspective: 1000 }}>
          {/* Side navigation zones — sit above side cards (z-0) but below the
              centered card (z-20), so a click anywhere on a neighbour navigates
              to it while the centered card still opens the modal. */}
          <button
            type="button"
            aria-label={lang === 'fr' ? 'Projet précédent' : 'Previous project'}
            onClick={() => move(-1)}
            className="absolute left-0 top-0 bottom-0 z-10 cursor-pointer"
            style={{ width: 'calc(50% - 160px)' }}
          />
          <button
            type="button"
            aria-label={lang === 'fr' ? 'Projet suivant' : 'Next project'}
            onClick={() => move(1)}
            className="absolute right-0 top-0 bottom-0 z-10 cursor-pointer"
            style={{ width: 'calc(50% - 160px)' }}
          />

          <button
            type="button"
            onClick={() => move(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={() => move(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/2 left-1/2 flex items-center"
              style={{ x, y: '-50%', gap: CARD_GAP, transformStyle: 'preserve-3d' }}
              drag="x"
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
            >
              {carouselProjects.map((project, index) => {
                const realIndex = index % count;
                const isCenter = index === activeIndex;
                const isAdjacent = Math.abs(index - activeIndex) === 1;

                const cardCenterOffset = -(index * STEP + CARD_W / 2);
                const inputRange = [cardCenterOffset - STEP, cardCenterOffset, cardCenterOffset + STEP];

                const scale = useTransform(x, inputRange, [0.82, 1, 0.82]);
                const opacity = useTransform(x, inputRange, [0.7, 1, 0.7]);
                const rotateY = useTransform(x, inputRange, [12, 0, -12]);
                const brightness = useTransform(x, inputRange, [0.75, 1, 0.75]);
                const filter = useMotionTemplate`brightness(${brightness})`;
                const zIndex = useTransform(x, inputRange, [0, 20, 0]);

                return (
                  <motion.div
                    key={`${index}-${project.title}`}
                    style={{
                      width: CARD_W,
                      minWidth: CARD_W,
                      scale,
                      opacity,
                      rotateY,
                      filter,
                      zIndex,
                      transformStyle: 'preserve-3d',
                    }}
                    className={`relative rounded-2xl overflow-hidden bg-gray-900 border ${
                      isCenter
                        ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                        : 'border-gray-700'
                    }`}
                  >
                    {/* FIX: hover + cursor pointer sur toutes les cartes */}
                    <motion.div
                      whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCardClick(index, realIndex)}
                      className="w-full h-full cursor-pointer"
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{ height: 200, background: '#0f172a' }}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-contain p-2"
                          draggable={false}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-900 to-transparent" />
                        {project.status && (
                          <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10">
                            {project.status}
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-base font-bold text-white mb-3 truncate">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-blue-900/30 text-blue-300 border border-blue-800/50 rounded text-[10px] font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <motion.div
                          animate={{ opacity: isCenter ? 1 : 0 }}
                          transition={{ duration: 0.12 }}
                          className="mt-4 text-center"
                        >
                          {isCenter && (
                            <span className="inline-block px-4 py-1 bg-white/5 rounded-full text-blue-400 text-[10px] font-semibold tracking-widest uppercase">
                              {lang === 'fr' ? 'Explorer' : 'Explore'}
                            </span>
                          )}
                          {isAdjacent && (
                            <span className="inline-block text-gray-600 text-[10px] tracking-widest uppercase">
                              {lang === 'fr' ? '← Voir' : '← View'}
                            </span>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToProject(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                (activeIndex % count) === index
                  ? 'w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                  : 'w-2 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal — FIX: fermeture rapide */}
      <AnimatePresence mode="wait">
        {expanded !== null && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute inset-0 bg-gray-950/80 backdrop-blur-md"
              onClick={() => setExpanded(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.7 }}
              className="relative z-50 bg-gray-900 border border-white/10 overflow-hidden shadow-2xl"
              style={{ borderRadius: 24, width: 'min(600px, 92vw)', maxHeight: '90vh' }}
            >
              <div
                className="relative w-full"
                style={{ height: 250, background: '#0f172a' }}
              >
                <img
                  src={projects[expanded].image}
                  alt={projects[expanded].title}
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-gray-900 to-transparent" />
                <button
                  onClick={() => setExpanded(null)}
                  className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
                <motion.h3
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03, duration: 0.18 }}
                  className="text-2xl font-bold text-white mb-4"
                >
                  {projects[expanded].title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04, duration: 0.18 }}
                  className="text-gray-300 text-sm md:text-base leading-relaxed mb-6"
                >
                  {projects[expanded].description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.18 }}
                  className="flex flex-wrap gap-2 mb-8"
                >
                  {projects[expanded].techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.18 }}
                  className="flex gap-4"
                >
                  {projects[expanded].links.github && (
                    <a
                      href={projects[expanded].links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full py-3">
                        <Github size={18} className="mr-2" />
                        {translations.projects.viewCode}
                      </Button>
                    </a>
                  )}
                  {(projects[expanded].links.live || projects[expanded].links.external) && (
                    <a
                      href={projects[expanded].links.live || projects[expanded].links.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="primary" className="w-full py-3">
                        <ExternalLink size={18} className="mr-2" />
                        {projects[expanded].links.live
                          ? translations.projects.liveDemo
                          : translations.projects.viewProfile}
                      </Button>
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;