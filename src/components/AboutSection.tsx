'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Award, ShieldCheck, Heart, MapPin } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import DecorativeBadge from './ui/DecorativeBadge';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#351C18] text-[#FFF9F1] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F47735]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFD83D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Photography (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-[#EADBCC]/20 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
                alt="Artisanal bakery and snack preparation in Vandiperiyar, Idukki"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#281411]/90 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#281411]/90 backdrop-blur-md border border-[#EADBCC]/20 text-center">
                <span className="font-display font-black text-xl text-[#FFD83D] block">
                  Vandiperiyar, Idukki District
                </span>
                <span className="text-xs text-[#E8DCCF]/80 block mt-0.5">
                  High-Range Traditional Snack & Bakery Works
                </span>
              </div>
            </div>

            {/* Floating Trust Card */}
            <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-[#FFD83D] text-[#281411] border border-[#F2C71E] shadow-2xl badge-float">
              <Award className="w-6 h-6 text-[#F47735]" />
              <div>
                <span className="font-display font-black text-base block leading-none">FSSAI Certified</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#735C57]">Quality & Safety Standard</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <DecorativeBadge variant="yellow" icon={<Sparkles className="w-3.5 h-3.5 text-[#F47735]" />}>
              Our Heritage & Craft
            </DecorativeBadge>

            <h2 className="editorial-headline text-4xl sm:text-6xl lg:text-7xl font-black text-[#FFF9F1] tracking-tight leading-[0.95] mt-4 mb-6">
              MORE THAN SNACKS.<br />
              <span className="text-[#FFD83D] underline decoration-[#F47735] decoration-wavy decoration-2">
                A TASTE OF
              </span>{' '}
              TRADITION.
            </h2>

            <p className="text-base sm:text-lg text-[#E8DCCF]/90 font-medium leading-relaxed mb-6">
              Founded in Vandiperiyar, Kerala, OnFresh began with a single promise: to honour the time-honoured taste of authentic Kerala snacks and bakery creations without shortcuts.
            </p>

            <p className="text-sm sm:text-base text-[#E8DCCF]/75 font-normal leading-relaxed mb-8">
              We source choice raw Nendran bananas and tapioca directly from local cultivators across the high ranges. Every batch is sliced fresh and slow-fried in pure coconut oil with natural spices. No artificial preservatives, no chemical additives—just crisp golden flavour delivered fresh to retail tables and wholesale supermarket shelves.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8 pt-6 border-t border-[#EADBCC]/20">
              <div className="p-4 rounded-2xl bg-[#281411]/80 border border-[#EADBCC]/10">
                <div className="w-8 h-8 rounded-xl bg-[#F47735] text-white flex items-center justify-center font-bold text-sm mb-2">
                  1
                </div>
                <h4 className="font-display font-black text-sm text-[#FFF9F1]">Direct Farm Produce</h4>
                <p className="text-xs text-[#E8DCCF]/70 mt-1">First-grade Nendran bananas picked at optimal starch maturity.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#281411]/80 border border-[#EADBCC]/10">
                <div className="w-8 h-8 rounded-xl bg-[#FFD83D] text-[#281411] flex items-center justify-center font-bold text-sm mb-2">
                  2
                </div>
                <h4 className="font-display font-black text-sm text-[#FFF9F1]">Pure Coconut Oil</h4>
                <p className="text-xs text-[#E8DCCF]/70 mt-1">100% cold-pressed coconut oil gives our chips their signature aroma.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#281411]/80 border border-[#EADBCC]/10">
                <div className="w-8 h-8 rounded-xl bg-[#287B52] text-white flex items-center justify-center font-bold text-sm mb-2">
                  3
                </div>
                <h4 className="font-display font-black text-sm text-[#FFF9F1]">Dual Commerce</h4>
                <p className="text-xs text-[#E8DCCF]/70 mt-1">Single packets for home lovers, master cartons for commercial buyers.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-8 py-3.5 rounded-full bg-[#FFD83D] hover:bg-[#F2C71E] text-[#281411] font-display font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
              >
                <span>Taste Our Snacks</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#281411]" />
              </Link>

              <Link
                href="/wholesale"
                className="px-8 py-3.5 rounded-full bg-transparent hover:bg-[#FFFFFF]/10 text-[#FFF9F1] font-display font-black text-xs uppercase tracking-wider border border-[#EADBCC]/40 transition-colors flex items-center gap-2"
              >
                <span>Wholesale Terms</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
