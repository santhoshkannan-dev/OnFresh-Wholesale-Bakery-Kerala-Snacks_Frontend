'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  el?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  stagger?: number;
  delay?: number;
  variant?: 'words' | 'chars';
}

export default function AnimatedText({
  text,
  className = '',
  el = 'h2',
  stagger = 0.06,
  delay = 0,
  variant = 'words',
}: AnimatedTextProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    const Component = el as any;
    return <Component className={className}>{text}</Component>;
  }

  const items = variant === 'words' ? text.split(' ') : text.split('');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const Component = motion[el] as any;

  return (
    <Component
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
    >
      {items.map((item: string, index: number) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block whitespace-pre"
        >
          {item}
          {variant === 'words' && index < items.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Component>
  );
}
