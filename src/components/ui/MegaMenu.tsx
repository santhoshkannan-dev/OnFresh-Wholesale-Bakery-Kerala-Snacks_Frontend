'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, Flame, Award } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  const categories = [
    {
      title: 'Banana Chips',
      slug: 'banana-chips',
      malayalam: 'നേന്ത്രക്കായ വറുത്തത്',
      tag: 'Bestseller',
      tagColor: 'bg-[#FFD83D] text-[#281411]',
      description: 'Thinly sliced Nendran raw bananas fried in 100% pure coconut oil.',
      sizes: '250 g • 500 g • 1 kg Bulk',
    },
    {
      title: 'Tapioca & Jackfruit Chips',
      slug: 'tapioca-jackfruit-chips',
      malayalam: 'കപ്പ & ചക്ക വറുത്തത്',
      tag: 'Seasonal Fresh',
      tagColor: 'bg-[#A5DCE0] text-[#281411]',
      description: 'Golden crunchy sun-ripened jackfruit and spicy tapioca sticks.',
      sizes: '250 g • 500 g',
    },
    {
      title: 'Murukku & Traditional Snacks',
      slug: 'murukku-traditional-snacks',
      malayalam: 'മുറുക്ക് & നാടൻ പലഹാരങ്ങൾ',
      tag: 'Artisan',
      tagColor: 'bg-[#F5A477] text-[#281411]',
      description: 'Butter murukku, ribbon pakkavada, and hand-rolled crunchy twists.',
      sizes: '200 g • 400 g • 1 kg',
    },
    {
      title: 'Mixture & Savouries',
      slug: 'mixture-savouries',
      malayalam: 'കേരള മിക്സ്ചർ',
      tag: 'Tea-time Classic',
      tagColor: 'bg-[#FFD83D] text-[#281411]',
      description: 'Rich savoury blend of sev, fried peanuts, roasted curry leaves and spices.',
      sizes: '250 g • 500 g • Bulk Sack',
    },
    {
      title: 'Bakery Products & Rusks',
      slug: 'bakery-products',
      malayalam: 'ബേക്കറി പലഹാരങ്ങൾ',
      tag: 'Oven Fresh',
      tagColor: 'bg-[#287B52] text-[#FFFFFF]',
      description: 'Twice-baked cardamom tea rusks, artisanal milk loaves, and plum cakes.',
      sizes: 'Single • Family Box',
    },
    {
      title: 'Biscuits & Cookies',
      slug: 'biscuits-cookies',
      malayalam: 'ബിസ്കറ്റുകൾ & കുക്കികൾ',
      tag: 'Daily Favourite',
      tagColor: 'bg-[#F47735] text-[#FFFFFF]',
      description: 'Crispy coconut biscuits, melt-in-mouth nankhatai, and butter shortbread.',
      sizes: '250 g • 500 g Pack',
    },
  ];

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FFF9F1] border-b border-[#EADBCC] shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#EADBCC] mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#F47735] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              OnFresh Snack & Bakery Pantry
            </span>
            <h3 className="font-display font-black text-2xl text-[#281411] tracking-tight">
              Explore Traditional Kerala Flavours
            </h3>
          </div>

          <Link
            href="/products"
            onClick={onClose}
            className="text-xs font-bold text-[#F47735] hover:text-[#E06322] flex items-center gap-1 group"
          >
            <span>View All Catalogue (B2C & B2B)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              onClick={onClose}
              className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] hover:border-[#F47735] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-display font-black text-lg text-[#281411] group-hover:text-[#F47735] transition-colors">
                    {cat.title}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cat.tagColor}`}>
                    {cat.tag}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#735C57] line-clamp-2 mb-2">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F7EFE6] text-[11px] text-[#A89088]">
                <span>{cat.sizes}</span>
                <span className="text-[#287B52] font-semibold">{cat.malayalam}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Banner: Wholesale Prompt */}
        <div className="mt-6 p-4 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#351C18] text-[#FFD83D] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#281411]">Are you a Supermarket, Baker, or Distributor?</h4>
              <p className="text-xs text-[#735C57]">Access approved wholesale pricing, custom batch orders, and bulk GST invoicing.</p>
            </div>
          </div>

          <Link
            href="/wholesale"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#351C18] hover:bg-[#281411] text-[#FFD83D] font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
          >
            Wholesale Portal &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

