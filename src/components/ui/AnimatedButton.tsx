'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isLoading?: boolean;
}

export default function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const prefersReduced = useReducedMotion();

  const variantStyles = {
    primary: 'bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] shadow-md',
    secondary: 'bg-[#FFB928] hover:bg-[#e0a020] text-[#542817] shadow-md',
    dark: 'bg-[#542817] hover:bg-[#3D1C10] text-[#FFB928] shadow-md',
    outline: 'bg-transparent border border-[#EADBCC] hover:bg-[#F7EFE6] text-[#542817]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-3.5 text-sm',
  };

  const baseStyles =
    'rounded-full font-monument font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  if (prefersReduced) {
    return (
      <button
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? <span className="animate-pulse">Loading...</span> : children}
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...(props as any)}
    >
      {isLoading ? <span className="animate-pulse">Loading...</span> : children}
    </motion.button>
  );
}
