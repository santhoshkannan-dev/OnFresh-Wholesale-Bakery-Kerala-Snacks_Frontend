'use client';

import React from 'react';

/**
 * High-performance lightweight fallback for the 3D scene.
 * Renders when WebGL is unavailable or when user prefers reduced motion.
 */
export default function SceneFallback() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
      {/* Subtle organic radial glows */}
      <div className="absolute top-1/4 right-1/6 w-72 h-72 rounded-full bg-[#FFB928]/15 blur-3xl" />
      <div className="absolute bottom-1/3 left-1/5 w-80 h-80 rounded-full bg-[#F47735]/10 blur-3xl" />

      {/* Decorative SVG chips */}
      <svg
        className="absolute top-20 right-20 w-32 h-32 text-[#FFB928]/25"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <ellipse cx="50" cy="50" rx="42" ry="38" transform="rotate(-15 50 50)" />
      </svg>
      <svg
        className="absolute bottom-24 left-16 w-24 h-24 text-[#FFB928]/20"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <ellipse cx="50" cy="50" rx="40" ry="36" transform="rotate(25 50 50)" />
      </svg>
    </div>
  );
}
