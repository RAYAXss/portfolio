import React from 'react';
import { ShieldCheck, Bug, Database, ClipboardList } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import SectionHeader from '../ui/SectionHeader';

/* ─────────────────────────────────────────────
   Compétences : une ligne par domaine.
   Gauche = domaine + où je l'ai pratiqué, droite = outils et sujets.
───────────────────────────────────────────── */

const groupIcons: Record<string, LucideIcon> = {
  grc: ShieldCheck,
  tech: Bug,
  data: Database,
  pm: ClipboardList,
};

const Skills: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.skills.title} lead={t.skills.lead} />

        <dl className="border-t border-border/10">
          {t.skills.groups.map((group) => {
            const Icon = groupIcons[group.id] ?? ShieldCheck;
            return (
              <div
                key={group.id}
                className="grid md:grid-cols-[16rem_1fr] gap-x-10 gap-y-3 py-6 border-b border-border/10"
              >
                <dt className="flex gap-3">
                  <Icon className="w-5 h-5 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-content">{group.title}</span>
                    <span className="block text-sm text-content-faint">{group.context}</span>
                  </span>
                </dt>
                <dd className="flex flex-wrap gap-2 content-start">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-md text-sm text-content-muted bg-surface-2/70 border border-border/10"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};

export default Skills;
