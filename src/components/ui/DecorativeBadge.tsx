'use client';

import React from 'react';

interface DecorativeBadgeProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'orange' | 'green' | 'peach' | 'blue' | 'chocolate' | 'cream';
  className?: string;
  icon?: React.ReactNode;
}

export default function DecorativeBadge({
  children,
  variant = 'yellow',
  className = '',
  icon,
}: DecorativeBadgeProps) {
  const variantStyles = {
    yellow: 'bg-[#FFD83D] text-[#281411] border-[#F2C71E]',
    orange: 'bg-[#F47735] text-[#FFFFFF] border-[#E06322]',
    green: 'bg-[#287B52] text-[#FFFFFF] border-[#1E6040]',
    peach: 'bg-[#F5A477] text-[#281411] border-[#E59160]',
    blue: 'bg-[#A5DCE0] text-[#281411] border-[#8ECBD0]',
    chocolate: 'bg-[#351C18] text-[#FFF9F1] border-[#281411]',
    cream: 'bg-[#FFF9F1] text-[#281411] border-[#E8DCCF]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

