import type React from 'react';
import { useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
  disabled?: boolean;
}

/**
 * Texte avec reflet lumineux qui balaye le contenu en boucle
 * (port framer-motion du ShinyText reactbits).
 */
const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  className = '',
  speed = 3,
  color = 'rgb(var(--content-muted))',
  shineColor = 'rgb(var(--accent))',
  spread = 120,
  disabled = false,
}) => {
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastRef = useRef<number | null>(null);

  useAnimationFrame(time => {
    if (disabled || reducedMotion) return;
    if (lastRef.current === null) {
      lastRef.current = time;
      return;
    }
    const delta = time - lastRef.current;
    lastRef.current = time;
    elapsedRef.current += delta;
    progress.set((elapsedRef.current % (speed * 1000)) / (speed * 1000));
  });

  const backgroundPosition = useTransform(progress, p => `${150 - p * 200}% center`);

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    backgroundPosition,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  };

  return (
    <motion.span className={`inline-block ${className}`} style={gradientStyle}>
      {text}
    </motion.span>
  );
};

export default ShinyText;