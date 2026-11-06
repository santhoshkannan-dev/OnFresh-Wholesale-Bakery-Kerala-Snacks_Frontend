'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Building2, Flame, Award, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KERALA_SNACKS_MAP_ITEMS = [
  {
    name: 'Nendrakai Chips (Salted)',
    malayalam: 'നേന്ത്രക്കായ ചിപ്സ്',
    slug: 'kerala-nendran-banana-chips',
    group: 'Banana Chips',
    badge: 'Classic Bestseller',
    badgeColor: 'bg-[#FFB928] text-[#542817]',
  },
  {
    name: 'Masala Nendrakai Chips',
    malayalam: 'മസാല നേന്ത്രക്കായ ചിപ്സ്',
    slug: 'masala-nendrakai-chips',
    group: 'Banana Chips',
    badge: 'Spicy',
    badgeColor: 'bg-[#F47735] text-white',
  },
  {
    name: 'Paya Chips (Ripe Banana)',
    malayalam: 'പായ ചിപ്സ് (പഴം)',
    slug: 'paya-chips',
    group: 'Banana Chips',
    badge: 'Naturally Sweet',
    badgeColor: 'bg-[#FFB928]/40 text-[#542817]',
  },
  {
    name: 'Sarkaravarati Upperi',
    malayalam: 'ശർക്കരവരട്ടി ഉപ്പേരി',
    slug: 'sharkkara-varatti',
    group: 'Banana Chips',
    badge: 'Jaggery & Chukku',
    badgeColor: 'bg-[#542817] text-[#FFB928]',
  },
  {
    name: 'Stick Poola (Finger Chips)',
    malayalam: 'സ്റ്റിക്ക് പൂള (കപ്പ)',
    slug: 'stick-poola',
    group: 'Roots & Harvest',
    badge: 'Spicy Tapioca',
    badgeColor: 'bg-[#287B35] text-white',
  },
  {
    name: 'Poola Chips (Round Tapioca)',
    malayalam: 'പൂള ചിപ്സ് (കപ്പ ചിപ്സ്)',
    slug: 'poola-chips',
    group: 'Roots & Harvest',
    badge: 'Crunchy Thin',
    badgeColor: 'bg-[#EADBCC] text-[#542817]',
  },
  {
    name: 'Chakka Chips (Jackfruit)',
    malayalam: 'ചക്ക ചിപ്സ് (വറുത്തത്)',
    slug: 'jackfruit-chips',
    group: 'Roots & Harvest',
    badge: 'High-Range Fresh',
    badgeColor: 'bg-[#FFB928] text-[#542817]',
  },
  {
    name: 'Thenkuzhal Murukku',
    malayalam: 'തേൻകുഴൽ മുറുക്ക്',
    slug: 'thenkuzhal-murukku',
    group: 'Murukku & Crunch',
    badge: 'Hollow Crisp',
    badgeColor: 'bg-[#542817]/10 text-[#542817]',
  },
  {
    name: 'Kai Murukku (Handmade)',
    malayalam: 'കൈ മുറുക്ക്',
    slug: 'kai-murukku',
    group: 'Murukku & Crunch',
    badge: 'Hand-Twisted',
    badgeColor: 'bg-[#FFB928] text-[#542817]',
  },
  {
    name: 'Ring Murukku',
    malayalam: 'റിംഗ് മുറുക്ക്',
    slug: 'ring-murukku',
    group: 'Murukku & Crunch',
    badge: 'Chegodilu Rings',
    badgeColor: 'bg-[#FEECE2] text-[#542817]',
  },
  {
    name: 'Ribbon Pakavada',
    malayalam: 'റിബ്ബൺ പക്കാവട',
    slug: 'ribbon-pakavada',
    group: 'Murukku & Crunch',
    badge: 'Tea Stall Classic',
    badgeColor: 'bg-[#F47735] text-white',
  },
  {
    name: 'Thattai Vada',
    malayalam: 'തട്ട വട',
    slug: 'thattai-vada',
    group: 'Murukku & Crunch',
    badge: 'Chana Dal Discs',
    badgeColor: 'bg-[#287B35]/20 text-[#287B35]',
  },
  {
    name: 'Uppu Seedai',
    malayalam: 'ഉപ്പ് ചീട',
    slug: 'uppu-seedai',
    group: 'Seedai & Sweets',
    badge: 'Salted Balls',
    badgeColor: 'bg-[#EADBCC] text-[#542817]',
  },
  {
    name: 'Vella Seedai (Sweet)',
    malayalam: 'വെള്ള ചീട (ശർക്കര)',
    slug: 'vella-seedai',
    group: 'Seedai & Sweets',
    badge: 'Jaggery Sweet',
    badgeColor: 'bg-[#542817] text-[#FFB928]',
  },
  {
    name: 'Special Kerala Mixture',
    malayalam: 'കേരള മിക്സ്ചർ',
    slug: 'special-spicy-kerala-mixture',
    group: 'Mixture & Nuts',
    badge: 'Spicy Crunchy',
    badgeColor: 'bg-[#F47735] text-white',
  },
  {
    name: 'Masala Kadala',
    malayalam: 'മസാല കടല',
    slug: 'masala-kadala',
    group: 'Mixture & Nuts',
    badge: 'Fried Peanuts',
    badgeColor: 'bg-[#287B35] text-white',
  },
  {
    name: 'Masala Chola (Corn Flakes)',
    malayalam: 'മസാല ചോളം',
    slug: 'masala-chola',
    group: 'Mixture & Nuts',
    badge: 'Chaat Flakes',
    badgeColor: 'bg-[#FFB928] text-[#542817]',
  },
];

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'categories'>('map');

  if (!isOpen) return null;

  const categories = [
    {
      title: 'Banana Chips',
      slug: 'banana-chips',
      malayalam: 'നേന്ത്രക്കായ വറുത്തത്',
      tag: 'Bestseller',
      tagColor: 'bg-[#FFB928] text-[#542817]',
      description: 'Thinly sliced Nendran raw bananas fried in 100% pure coconut oil.',
      sizes: '250 g • 500 g • 1 kg Bulk',
    },
    {
      title: 'Tapioca & Jackfruit Chips',
      slug: 'traditional-snacks',
      malayalam: 'കപ്പ & ചക്ക വറുത്തത്',
      tag: 'Seasonal Fresh',
      tagColor: 'bg-[#287B35] text-white',
      description: 'Golden crunchy sun-ripened jackfruit and spicy tapioca sticks.',
      sizes: '200 g • 250 g • 500 g',
    },
    {
      title: 'Murukku & Traditional Snacks',
      slug: 'traditional-snacks',
      malayalam: 'മുറുക്ക് & നാടൻ പലഹാരങ്ങൾ',
      tag: 'Artisan',
      tagColor: 'bg-[#F5A477] text-[#542817]',
      description: 'Butter murukku, ribbon pakkavada, kai murukku, and seedai.',
      sizes: '200 g • 400 g • 1 kg',
    },
    {
      title: 'Mixture & Savouries',
      slug: 'mixture-savouries',
      malayalam: 'കേരള മിക്സ്ചർ',
      tag: 'Tea-time Classic',
      tagColor: 'bg-[#FFB928] text-[#542817]',
      description: 'Rich savoury blend of sev, masala kadala, chola, peanuts, and spices.',
      sizes: '250 g • 500 g • Bulk Sack',
    },
    {
      title: 'Bakery Products & Rusks',
      slug: 'bakery-products',
      malayalam: 'ബേക്കറി പലഹാരങ്ങൾ',
      tag: 'Oven Fresh',
      tagColor: 'bg-[#287B35] text-white',
      description: 'Twice-baked cardamom tea rusks, artisanal milk loaves, and plum cakes.',
      sizes: 'Single • Family Box',
    },
    {
      title: 'Biscuits & Cookies',
      slug: 'biscuits-cookies',
      malayalam: 'ബിസ്കറ്റുകൾ & കുക്കികൾ',
      tag: 'Daily Favourite',
      tagColor: 'bg-[#F47735] text-white',
      description: 'Crispy coconut biscuits, melt-in-mouth nankhatai, and butter cookies.',
      sizes: '250 g • 500 g Pack',
    },
  ];

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FFF9EF] border-b border-[#EADBCC] shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-[#EADBCC] gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-[#542817] text-[#FFB928] shadow-md scale-105'
                  : 'bg-[#FFFFFF] text-[#542817] hover:bg-[#F7EFE6] border border-[#EADBCC]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#287B35]" />
              <span>Snacks Map of Kerala (17 Iconic Items)</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'categories'
                  ? 'bg-[#542817] text-[#FFB928] shadow-md scale-105'
                  : 'bg-[#FFFFFF] text-[#542817] hover:bg-[#F7EFE6] border border-[#EADBCC]'
              }`}
            >
              <span>Main Bakery Categories</span>
            </button>
          </div>

          <Link
            href="/products"
            onClick={onClose}
            className="text-xs font-black uppercase tracking-wider text-[#F47735] hover:text-[#E06322] flex items-center gap-1.5 group"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tab 1: Snacks Map of Kerala (All 17 Items with Map Showcase Card) */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Visual Snacks Map Banner Card (3 Cols) */}
            <div className="lg:col-span-3 rounded-3xl bg-[#542817] text-[#FFF9EF] p-5 border border-[#FFB928]/30 shadow-xl flex flex-col justify-between">
              <div>
                <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-4 border border-[#FFB928]/25 bg-black/30">
                  <Image
                    src="/images/snacks-map-kerala.jpg"
                    alt="Snacks Map of Kerala"
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#287B35] text-white text-[10px] font-bold uppercase tracking-wider">
                    Authentic Kerala
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFB928] block mb-1">
                  Heritage Collection
                </span>
                <h4 className="font-display font-black text-xl text-[#FFF9EF] leading-snug">
                  Snacks Map of Kerala
                </h4>
                <p className="text-xs text-[#EADBCC] mt-2 leading-relaxed">
                  All 17 time-honoured savoury and sweet delicacies, crafted daily in Vandiperiyar with pure cold-pressed coconut oil.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#FFB928]/20 flex flex-col gap-2">
                <Link
                  href="/products"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-full bg-[#FFB928] hover:bg-[#e0a020] text-[#542817] font-display font-black text-xs uppercase tracking-wider text-center transition-colors shadow-sm"
                >
                  Shop All 17 Items
                </Link>
                <span className="text-[10px] text-center text-[#EADBCC]">
                  Retail Packets & Bulk B2B Cartons
                </span>
              </div>
            </div>

            {/* 17 Kerala Snack Items Grid (9 Cols) */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {KERALA_SNACKS_MAP_ITEMS.map((snack, idx) => (
                <Link
                  key={snack.slug + idx}
                  href={`/products/${snack.slug}`}
                  onClick={onClose}
                  className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] hover:border-[#287B35] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold text-[#A89088] uppercase tracking-wider">
                        {snack.group}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${snack.badgeColor}`}>
                        {snack.badge}
                      </span>
                    </div>

                    <h5 className="font-display font-black text-sm text-[#542817] group-hover:text-[#287B35] transition-colors leading-snug">
                      {snack.name}
                    </h5>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#F7EFE6]">
                    <span className="text-xs font-semibold text-[#287B35]">
                      {snack.malayalam}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A89088] group-hover:translate-x-1 group-hover:text-[#287B35] transition-all" />
                  </div>
                </Link>
              ))}
            </div>

          </div>
        )}

        {/* Tab 2: Main Bakery & Snack Categories */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                onClick={onClose}
                className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] hover:border-[#287B35] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-display font-black text-lg text-[#542817] group-hover:text-[#287B35] transition-colors">
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
                  <span className="text-[#287B35] font-semibold">{cat.malayalam}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Banner: Wholesale & Factory Direct Prompt */}
        <div className="mt-6 p-4 rounded-2xl bg-[#542817] text-[#FFF9EF] border border-[#FFB928]/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3D1C10] text-[#FFB928] flex items-center justify-center shrink-0 border border-[#FFB928]/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FFF9EF]">
                Supermarkets, Retail Stores & Kerala Snack Distributors
              </h4>
              <p className="text-xs text-[#EADBCC]">
                Order all 17 Kerala Snack Map items in bulk master cartons with approved B2B margins and GST input tax credit invoices.
              </p>
            </div>
          </div>

          <Link
            href="/wholesale"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#FFB928] hover:bg-[#e0a020] text-[#542817] font-black text-xs uppercase tracking-wider shrink-0 transition-colors shadow-sm"
          >
            Wholesale B2B Portal &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
