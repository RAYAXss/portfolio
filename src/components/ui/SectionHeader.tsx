import React from 'react';

interface SectionHeaderProps {
  title: string;
  /** Une phrase qui dit ce que contient la section. */
  lead?: string;
  align?: 'center' | 'left';
  className?: string;
  /** Contenu aligné à droite du titre (filtres, actions). */
  aside?: React.ReactNode;
}

/** En-tête de section : titre + phrase d'introduction, sans décoration. */
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, lead, align = 'left', className = '', aside }) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`mb-10 flex flex-col gap-4 ${
        isCenter ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={isCenter ? 'max-w-2xl' : 'max-w-2xl'}>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-content">{title}</h2>
        {lead && <p className="mt-3 text-base text-content-muted leading-relaxed">{lead}</p>}
      </div>
      {aside}
    </div>
  );
};

export default SectionHeader;
