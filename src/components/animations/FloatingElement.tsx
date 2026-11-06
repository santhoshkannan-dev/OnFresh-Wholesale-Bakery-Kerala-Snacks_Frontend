'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  yOffset?: number;
  delay?: number;
  rotateOffset?: number;
}

export default function FloatingElement({
  children,
  className = '',
  duration = 3.5,
  yOffset = 10,
  delay = 0,
  rotateOffset = 4,
}: FloatingElementProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        y: [-yOffset, yOffset, -yOffset],
        rotate: [-rotateOffset, rotateOffset, -rotateOffset],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
