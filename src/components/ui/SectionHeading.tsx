'use client';

import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  badgeVariant?: 'yellow' | 'orange' | 'green' | 'peach' | 'blue' | 'chocolate';
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  inverted?: boolean;
}

export default function SectionHeading({
  badge,
  badgeVariant = 'yellow',
  title,
  highlight,
  subtitle,
  align = 'center',
  className = '',
  inverted = false,
}: SectionHeadingProps) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const badgeStyles = {
    yellow: 'bg-[#FFD83D] text-[#281411]',
    orange: 'bg-[#F47735] text-[#FFFFFF]',
    green: 'bg-[#287B52] text-[#FFFFFF]',
    peach: 'bg-[#F5A477] text-[#281411]',
    blue: 'bg-[#A5DCE0] text-[#281411]',
    chocolate: 'bg-[#351C18] text-[#FFF9F1]',
  };

  return (
    <div className={`flex flex-col ${alignClasses[align]} max-w-3xl ${align === 'center' ? 'mx-auto' : ''} ${className}`}>
      {badge && (
        <span
          className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3.5 shadow-sm ${badgeStyles[badgeVariant]}`}
        >
          {badge}
        </span>
      )}

      <h2
        className={`editorial-headline text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.98] ${
          inverted ? 'text-[#FFF9F1]' : 'text-[#281411]'
        }`}
      >
        {title}{' '}
        {highlight && (
          <span className="text-[#F47735] underline decoration-[#FFD83D] decoration-wavy decoration-2">
            {highlight}
          </span>
        )}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg font-medium leading-relaxed max-w-2xl ${
            inverted ? 'text-[#E8DCCF]/90' : 'text-[#735C57]'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

