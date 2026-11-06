'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverY?: number;
  hoverScale?: number;
}

export default function AnimatedCard({
  children,
  className = '',
  hoverY = -6,
  hoverScale = 1.015,
}: AnimatedCardProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={`rounded-3xl border border-[#EADBCC] bg-[#FFFFFF] ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ y: 0, scale: 1 }}
      whileHover={{
        y: hoverY,
        scale: hoverScale,
        boxShadow: '0 20px 30px -10px rgba(84, 40, 23, 0.12)',
      }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`rounded-3xl border border-[#EADBCC] bg-[#FFFFFF] transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}
