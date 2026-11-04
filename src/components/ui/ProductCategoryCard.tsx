'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Category } from '@/types/api';

interface ProductCategoryCardProps {
  category: Category;
  colorScheme?: 'peach' | 'blue' | 'yellow' | 'green' | 'cream';
  className?: string;
}

export default function ProductCategoryCard({
  category,
  colorScheme = 'cream',
  className = '',
}: ProductCategoryCardProps) {
  const colorStyles = {
    peach: {
      cardBg: 'bg-[#FEECE2] hover:bg-[#FDD8C7] border-[#F5A477]/50',
      badgeBg: 'bg-[#F5A477] text-[#281411]',
      btnBg: 'bg-[#F47735] text-[#FFFFFF]',
      textColor: 'text-[#281411]',
    },
    blue: {
      cardBg: 'bg-[#EBF7F8] hover:bg-[#D5EFF1] border-[#A5DCE0]/50',
      badgeBg: 'bg-[#A5DCE0] text-[#281411]',
      btnBg: 'bg-[#351C18] text-[#FFF9F1]',
      textColor: 'text-[#281411]',
    },
    yellow: {
      cardBg: 'bg-[#FFF9DC] hover:bg-[#FFF3B8] border-[#FFD83D]/60',
      badgeBg: 'bg-[#FFD83D] text-[#281411]',
      btnBg: 'bg-[#F47735] text-[#FFFFFF]',
      textColor: 'text-[#281411]',
    },
    green: {
      cardBg: 'bg-[#E8F4EE] hover:bg-[#D4EBDD] border-[#287B52]/40',
      badgeBg: 'bg-[#287B52] text-[#FFFFFF]',
      btnBg: 'bg-[#287B52] text-[#FFFFFF]',
      textColor: 'text-[#281411]',
    },
    cream: {
      cardBg: 'bg-[#FFF9F1] hover:bg-[#F7EFE6] border-[#EADBCC]',
      badgeBg: 'bg-[#351C18] text-[#FFF9F1]',
      btnBg: 'bg-[#F47735] text-[#FFFFFF]',
      textColor: 'text-[#281411]',
    },
  };

  const scheme = colorStyles[colorScheme];

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${scheme.cardBg} ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 z-10">
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2.5 shadow-sm ${scheme.badgeBg}`}
          >
            {category.product_count !== undefined
              ? `${category.product_count} Snack Varieties`
              : 'Traditional Specialty'}
          </span>
          <h3 className={`font-display font-black text-2xl lg:text-3xl leading-tight ${scheme.textColor}`}>
            {category.name}
          </h3>
        </div>

        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45 duration-300 shrink-0 shadow-sm ${scheme.btnBg}`}
        >
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm font-medium text-[#735C57] mt-3 mb-6 line-clamp-2 z-10">
        {category.description || 'Authentic traditional recipe prepared with fresh ingredients.'}
      </p>

      {/* Visual Container */}
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#FFFFFF]/70 border border-[#FFFFFF]/80 shadow-inner flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="text-center p-4">
            <span className="font-display font-black text-4xl text-[#351C18]/15 tracking-tighter block">
              ONFRESH
            </span>
            <span className="text-[10px] font-bold text-[#F47735] uppercase tracking-widest mt-1 block">
              Vandiperiyar, Kerala
            </span>
          </div>
        )}

        <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-[#FFFFFF]/90 backdrop-blur-sm text-[10px] font-bold text-[#281411] border border-[#EADBCC] flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-[#F47735]" />
          <span>Explore</span>
        </div>
      </div>
    </Link>
  );
}
