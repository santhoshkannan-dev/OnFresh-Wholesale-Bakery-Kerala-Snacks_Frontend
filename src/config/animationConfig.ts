/**
 * OnFresh Central Animation Configuration
 * Controls performance, reduced-motion preferences, GSAP easings, and Three.js 3D parameters.
 */

export const animationConfig = {
  // Global animation toggle
  enabled: true,

  // Device-specific intensity multipliers
  desktopIntensity: 1.0,
  mobileIntensity: 0.6,

  // Three.js 3D WebGL scene toggle
  threeJsEnabled: true,

  // Standard durations in seconds
  duration: {
    instant: 0.15,
    fast: 0.3,
    normal: 0.6,
    slow: 0.9,
    cinematic: 1.2,
  },

  // GSAP Curated Easings
  easings: {
    heroEntrance: 'power4.out',
    smoothOut: 'power3.out',
    elastic: 'elastic.out(1, 0.75)',
    cardHover: 'power2.out',
    float: 'sine.inOut',
  },

  // ScrollTrigger Standard Breakpoints
  scrollTriggerDefaults: {
    start: 'top 85%',
    toggleActions: 'play none none none',
    once: true,
  },
};

/**
 * Checks if the user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

