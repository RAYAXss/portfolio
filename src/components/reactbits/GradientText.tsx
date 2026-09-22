import type React from 'react';
import { useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
}

/**
 * Texte à dégradé animé (port framer-motion du GradientText reactbits).
 * Les couleurs passent par des variables CSS du thème par défaut.
 */
const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  colors = ['var(--accent)', 'var(--accent-2)', 'var(--accent)'],
  animationSpeed = 0.4,
}) => {
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const animationDuration = 1000 / animationSpeed;

  useAnimationFrame(time => {
    if (lastRef.current === null) {
      lastRef.current = time;
      return;
    }
    const delta = time - lastRef.current;
    lastRef.current = time;
    elapsedRef.current += delta;
    progress.set((elapsedRef.current % animationDuration) / animationDuration);
  });

  const backgroundPosition = useTransform(progress, p => `${p * 100}% 50%`);

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(', ')})`,
    backgroundSize: '300% 100%',
    backgroundPosition,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  };

  return (
    <motion.span className={`inline-block ${className}`} style={gradientStyle}>
      {children}
    </motion.span>
  );
};

export default GradientText;