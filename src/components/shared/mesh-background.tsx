'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MeshBackgroundProps {
  className?: string;
  variant?: 'full' | 'subtle';
}

/**
 * Premium animated mesh background — gradient blobs + floating connected nodes.
 * Lightweight: only 5 nodes, GPU-accelerated transforms, respects reduced motion.
 */
export function MeshBackground({ className = '', variant = 'subtle' }: MeshBackgroundProps) {
  const prefersReduced = useReducedMotion();

  const nodes = React.useMemo(
    () => [
      { x: 15, y: 25, delay: 0 },
      { x: 85, y: 20, delay: 1.2 },
      { x: 70, y: 75, delay: 2.1 },
      { x: 25, y: 80, delay: 0.7 },
      { x: 50, y: 50, delay: 1.6 },
    ],
    []
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Gradient blobs */}
      <div
        className={`absolute inset-0 bg-mesh-gradient ${variant === 'full' ? 'opacity-100' : 'opacity-60'}`}
      />

      {/* Floating nodes + connecting lines */}
      {!prefersReduced && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* connecting lines */}
          {nodes.map((n, i) => {
            const next = nodes[(i + 1) % nodes.length];
            return (
              <motion.line
                key={`line-${i}`}
                x1={n.x}
                y1={n.y}
                x2={next.x}
                y2={next.y}
                stroke="url(#meshLine)"
                strokeWidth={0.08}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, delay: n.delay }}
              />
            );
          })}

          {/* floating nodes */}
          {nodes.map((n, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={n.x}
              cy={n.y}
              r={0.5}
              fill="url(#meshNode)"
              animate={{
                cy: [n.y, n.y - 4, n.y],
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 6,
                delay: n.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          <defs>
            <linearGradient id="meshLine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#175bea" />
              <stop offset="100%" stopColor="#00c5fb" />
            </linearGradient>
            <radialGradient id="meshNode">
              <stop offset="0%" stopColor="#00c5fb" />
              <stop offset="100%" stopColor="#175bea" />
            </radialGradient>
          </defs>
        </svg>
      )}
    </div>
  );
}
