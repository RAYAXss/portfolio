import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { getExperiences } from '../../data/experiences';
import SectionHeader from '../ui/SectionHeader';

/* ─────────────────────────────────────────────
   Expériences : frise chronologique.
   Colonne de gauche = période et lieu, droite = poste et missions.
   Les 3 premières missions sont visibles, le reste s'ouvre à la demande.
───────────────────────────────────────────── */

const VISIBLE = 3;

// Mois inclus aux deux bouts : juillet 2025 → septembre 2026 = 15 mois = 1 an 3 mois
const duration = (start: string, end: string | undefined, lang: 'fr' | 'en') => {
  const [sy, sm] = start.split('-').map(Number);
  const now = new Date();
  const [ey, em] = end ? end.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const total = Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
  const y = Math.floor(total / 12);
  const m = total % 12;
  const parts =
    lang === 'fr'
      ? [y && `${y} an${y > 1 ? 's' : ''}`, m && `${m} mois`]
      : [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`];
  return parts.filter(Boolean).join(' ');
};

const Experience: React.FC = () => {
  const { lang, t } = useLanguage();
  const experiences = getExperiences(lang);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggle = (id: number) =>
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  return (
    <section id="experience" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.experience.title} lead={t.experience.lead} />

        <ol className="relative">
          {experiences.map((exp, index) => {
            const isExpanded = expandedIds.includes(exp.id);
            const isCurrent = index === 0;
            const extra = exp.responsibilities.slice(VISIBLE);
            const listId = `exp-more-${exp.id}`;

            return (
              <li key={exp.id} className="grid md:grid-cols-[13rem_1fr] gap-x-10 gap-y-2">
                {/* Période */}
                <div className="md:text-right md:pt-1">
                  <p className="text-sm font-medium text-content">{exp.period}</p>
                  <p className="text-sm text-accent">{duration(exp.start, exp.end, lang)}</p>
                  <p className="text-sm text-content-faint">{exp.location}</p>
                </div>

                {/* Contenu, avec la ligne de la frise */}
                <div className={`relative pl-6 border-l border-border/15 ${index < experiences.length - 1 ? 'pb-12' : ''}`}>
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full border-2 ${
                      isCurrent ? 'bg-accent border-accent' : 'bg-surface border-border-strong'
                    }`}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold text-content">{exp.company}</h3>
                    <span className="text-xs px-2 py-0.5 rounded border border-border-strong text-content-muted">
                      {exp.contractType}
                    </span>
                    {isCurrent && <span className="text-xs text-accent">{t.experience.now}</span>}
                  </div>
                  <p className="text-content-muted">{exp.title}</p>
                  <p className="mt-3 text-sm text-content-muted leading-relaxed max-w-2xl">{exp.description}</p>

                  <ul className="mt-3 space-y-1.5 max-w-2xl">
                    {exp.responsibilities.slice(0, VISIBLE).map((r) => (
                      <li key={r} className="flex gap-2.5 text-sm text-content-muted">
                        <span className="mt-2 w-1 h-1 rounded-full bg-content-faint shrink-0" aria-hidden="true" />
                        {r}
                      </li>
                    ))}
                  </ul>

                  {isExpanded && (
                      <ul id={listId} className="space-y-1.5 max-w-2xl">
                        {extra.map((r, i) => (
                          <li key={r} className={`flex gap-2.5 text-sm text-content-muted ${i === 0 ? 'mt-1.5' : ''}`}>
                            <span className="mt-2 w-1 h-1 rounded-full bg-content-faint shrink-0" aria-hidden="true" />
                            {r}
                          </li>
                        ))}
                      </ul>
                  )}

                  {extra.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggle(exp.id)}
                      aria-expanded={isExpanded}
                      aria-controls={listId}
                      className="mt-3 min-h-[36px] text-sm font-medium text-accent hover:underline underline-offset-4"
                    >
                      {isExpanded ? t.experience.viewLess : `${t.experience.viewMore} (+${extra.length})`}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
