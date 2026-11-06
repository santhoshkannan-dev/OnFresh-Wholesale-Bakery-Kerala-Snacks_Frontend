'use client';

import { useEffect, useRef, RefObject } from 'react';
import { registerGSAP, isReducedMotion } from '@/lib/animation/gsapUtils';

type AnimationCallback = (context: gsap.Context, gsapInstance: typeof import('gsap').default) => void;

/**
 * Custom React hook for safely orchestrating GSAP ScrollTrigger animations.
 * Ensures SSR safety, automatic cleanup on component unmount, and respect for reduced motion.
 */
export function useScrollAnimation(
  callback: AnimationCallback,
  targetRef?: RefObject<HTMLElement | null>,
  deps: any[] = []
) {
  const internalRef = useRef<HTMLElement>(null);
  const scopeRef = targetRef || internalRef;

  useEffect(() => {
    if (isReducedMotion()) return;

    const { gsap, ScrollTrigger } = registerGSAP();
    const ctx = gsap.context(() => {
      callback(ctx, gsap);
    }, scopeRef);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
