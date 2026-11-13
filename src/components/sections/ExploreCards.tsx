import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Terminal, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import FadeInOnScroll from '../animations/FadeInOnScroll';

const ExploreCards: React.FC = () => {
  const { t: translations } = useLanguage();
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, i) => (
            <FadeInOnScroll key={card.to} delay={i * 0.1}>
              <Link
                to={card.to}
                className="group block bg-glass border border-border/10 rounded-2xl overflow-hidden hover:border-accent/30 hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Gradient accent bar */}
                <div className="h-1 bg-gradient-to-r from-accent to-accent-2" />

                <div className="p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                      <card.icon size={28} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-xl font-bold text-content">{card.title}</h3>
                        <ArrowRight size={18} className="text-accent opacity-60 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300" />
                      </div>
                      <p className="text-content-muted text-base leading-relaxed">
                        {card.description}
                      </p>
                    </div>
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
