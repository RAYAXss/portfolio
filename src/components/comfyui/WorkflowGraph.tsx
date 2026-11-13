import React from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { WorkflowGraph as GraphType } from '../../types/comfyui';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Props {
  graph: GraphType;
  ariaLabel: string;
}

const WorkflowGraph: React.FC<Props> = ({ graph, ariaLabel }) => {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-40px' });

  const count = graph.nodes.length;
  const loopDuration = count * 0.6;
  const shouldAnimate = !reduced && inView;

  return (
    <div
      ref={ref}
      className="flex flex-wrap items-center gap-2"
      role="img"
      aria-label={ariaLabel}
    >
      {graph.nodes.map((node, i) => (
        <React.Fragment key={node.id}>
          <div className="relative">
            <span className="relative z-10 inline-block text-xs font-medium text-content px-3 py-1.5 rounded-lg bg-surface-2 border border-border/10">
              {node.label}
            </span>
            {shouldAnimate && (
              <motion.span
                className="absolute inset-0 rounded-lg border-2 border-accent pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.6,
                  repeat: Infinity,
                  repeatDelay: loopDuration - 0.6,
                }}
              />
            )}
          </div>
          {i < count - 1 && (
            <div className="relative flex items-center">
              <ArrowRight size={14} className="text-border/30" />
              {shouldAnimate && (
                <motion.span
                  className="absolute left-0 w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ x: [0, 14], opacity: [1, 1, 0] }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.6 + 0.4,
                    repeat: Infinity,
                    repeatDelay: loopDuration - 0.3,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WorkflowGraph;
