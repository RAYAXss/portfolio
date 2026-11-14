import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Suite d'étapes (verticale sur mobile) reliées par des connecteurs où circule une impulsion :
 * schéma "A → B → C" animé, réutilisé par l'accueil et les sous-pages.
 */
const FlowLine: React.FC<{ steps: string[]; className?: string }> = ({ steps, className = '' }) => {
  const reduced = useReducedMotion();

  return (
    <ol className={`flex flex-col sm:flex-row items-center ${className}`}>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <li className="shrink-0 text-center">
            <motion.span
              initial={{ scale: reduced ? 1 : 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: reduced ? 0 : 0.15 * i, type: 'spring', stiffness: 260, damping: 20 }}
              className="inline-block px-2.5 sm:px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[11px] sm:text-xs font-medium text-content"
            >
              {label}
            </motion.span>
          </li>
          {i < steps.length - 1 && (
            <li aria-hidden="true" className="relative w-px h-4 sm:h-px sm:w-auto sm:flex-1 bg-border/15 sm:mx-1.5 overflow-hidden sm:min-w-[12px]">
              {!reduced && (
                <motion.span
                  className="hidden sm:block absolute top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent"
                  animate={{ left: ['-50%', '100%'] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
                />
              )}
            </li>
          )}
        </React.Fragment>
      ))}
    </ol>
  );
};

export default FlowLine;
