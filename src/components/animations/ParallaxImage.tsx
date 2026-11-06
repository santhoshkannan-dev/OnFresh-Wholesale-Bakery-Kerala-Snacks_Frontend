'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  speed?: number;
}

export default function ParallaxImage({
  src,
  alt,
  aspectRatio = 'aspect-[4/3]',
  className = '',
  speed = 0.15,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-25 * speed * 10, 25 * speed * 10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.0, 1.08]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-[2rem] border border-[#EADBCC] ${aspectRatio} ${className}`}
    >
      <motion.div
        style={{
          y: prefersReduced ? 0 : y,
          scale: prefersReduced ? 1 : scale,
        }}
        className="w-full h-[120%] -top-[10%] relative"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
