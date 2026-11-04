/**
 * SSR-safe GSAP and ScrollTrigger utility helpers for OnFresh.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

export function registerGSAP(): typeof gsap & { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger } {
  if (typeof window !== 'undefined' && !isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
  const anyGsap = gsap as any;
  anyGsap.gsap = gsap;
  anyGsap.ScrollTrigger = ScrollTrigger;
  return anyGsap;
}

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger };
