import { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}

/**
 * Réimplémentation framer-motion (zéro gsap) du SplitText reactbits :
 * les caractères se révèlent un à un, masqués par un léger offset vertical.
 */
const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  duration = 0.6,
}) => {
  const reducedMotion = useReducedMotion();
  const chars = useMemo(() => Array.from(text), [text]);

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const charVariants: Variants = {
    hidden: { opacity: 0, y: '0.7em' },
    visible: {
      opacity: 1,
      y: '0em',
      transition: { duration, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={charVariants}
          className="inline-block"
          style={{ whiteSpace: 'pre' }}
          aria-hidden="true"
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default SplitText;