import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Terminal, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import translationsFR from '../../data/translations/fr.json';
import translationsEN from '../../data/translations/en.json';

const ExploreCards: React.FC = () => {
  const { lang } = useLanguage();
  const translations = lang === 'fr' ? translationsFR : translationsEN;

  const cards = [
    {
      to: '/comfyui',
      icon: Cpu,
      title: 'ComfyUI',
      description: translations.home.comfyuiCard,
    },
    {
      to: '/claude-skills',
      icon: Terminal,
      title: 'Claude Code Skills',
      description: translations.home.claudeSkillsCard,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeInOnScroll>
          <p className="text-sm font-semibold tracking-widest text-accent text-center mb-8">
            {translations.home.explore}
          </p>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <FadeInOnScroll key={card.to} delay={i * 0.1}>
              <Link
                to={card.to}
                className="group block bg-glass border border-border/10 rounded-2xl p-6 hover:bg-glass-hover transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <card.icon size={20} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-content">{card.title}</h3>
                      <ArrowRight size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-content-muted text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCards;
