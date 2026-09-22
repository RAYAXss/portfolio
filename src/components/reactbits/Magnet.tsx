import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  padding?: number;
  disabled?: boolean;
}

/**
 * Effet aimant : l'élément suit légèrement le curseur dans son voisinage.
 * Inspiré du pattern reactbits/MagicUI, implémenté en framer-motion pur.
 */
const Magnet: React.FC<MagnetProps> = ({
  children,
  className = '',
  strength = 0.5,
  padding = 64,
  disabled = false,
}) => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > padding) return;
    const pull = (1 - dist / padding) * strength;
    x.set(dx * pull);
    y.set(dy * pull);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;