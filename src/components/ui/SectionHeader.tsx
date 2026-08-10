import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  /** Small uppercase label above the title (letter-spaced). */
  eyebrow?: string;
  /** Main title, rendered in pure white for contrast. */
  title: string;
  /** Horizontal alignment of the block. */
  align?: 'center' | 'left';
  /** Extra classes on the wrapper. */
  className?: string;
}

/**
 * Shared section header: uppercase eyebrow + white title + animated gradient rule.
 * Used across About / Experience / Skills / Contact for a consistent language.
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`${isCenter ? 'text-center' : 'text-left'} mb-12 ${className}`}
    >
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-blue-400 mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-4 ${
          isCenter ? 'mx-auto' : ''
        }`}
        style={{ transformOrigin: isCenter ? 'center' : 'left' }}
      />
    </motion.div>
  );
};

export default SectionHeader;
