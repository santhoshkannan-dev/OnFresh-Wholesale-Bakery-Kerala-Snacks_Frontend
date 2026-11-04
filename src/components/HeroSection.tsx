'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Building2, Flame, Award, Heart, CheckCircle2 } from 'lucide-react';
import DecorativeBadge from './ui/DecorativeBadge';

interface HeroSectionProps {
  onWholesaleClick?: () => void;
}

export default function HeroSection({ onWholesaleClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#FFF9F1] pt-6 pb-16 lg:pt-12 lg:pb-24 border-b border-[#EADBCC]">
      {/* Background organic blur spots */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#FFD83D]/15 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#F47735]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Editorial Typography & CTAs (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Top Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
              <DecorativeBadge variant="yellow" icon={<Sparkles className="w-3.5 h-3.5 text-[#F47735]" />}>
                Authentic Kerala Bakery
              </DecorativeBadge>
              <DecorativeBadge variant="cream" className="hidden sm:inline-flex">
                Vandiperiyar • Idukki
              </DecorativeBadge>
            </div>

            {/* Oversized Headline */}
            <h1 className="editorial-headline text-5xl sm:text-7xl lg:text-8xl font-black text-[#281411] tracking-tight leading-[0.92] mb-6">
              BAKED FRESH.<br />
              <span className="text-[#F47735] underline decoration-[#FFD83D] decoration-wavy decoration-2">
                LOVED EVERY
              </span>{' '}
              DAY.
            </h1>

            {/* Subtext */}
            <p className="font-body text-lg sm:text-xl text-[#735C57] font-medium leading-relaxed max-w-xl mb-8">
              Authentic Kerala flavours, freshly prepared with 100% pure coconut oil for every dining table and every wholesale business. Direct from our Vandiperiyar facility.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2 group"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/wholesale"
                onClick={onWholesaleClick}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#351C18] hover:bg-[#281411] text-[#FFD83D] font-display font-black text-sm uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2 group"
              >
                <Building2 className="w-4 h-4 text-[#FFD83D]" />
                <span>Wholesale Enquiry</span>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 pt-8 border-t border-[#EADBCC] w-full max-w-lg">
              <div>
                <span className="font-display font-black text-2xl sm:text-3xl text-[#281411] block">
                  100%
                </span>
                <span className="text-xs font-semibold text-[#735C57] block mt-0.5">
                  Pure Coconut Oil
                </span>
              </div>

              <div>
                <span className="font-display font-black text-2xl sm:text-3xl text-[#F47735] block">
                  Daily
                </span>
                <span className="text-xs font-semibold text-[#735C57] block mt-0.5">
                  Fresh Batch Frying
                </span>
              </div>

              <div>
                <span className="font-display font-black text-2xl sm:text-3xl text-[#287B52] block">
                  B2C & B2B
                </span>
                <span className="text-xs font-semibold text-[#735C57] block mt-0.5">
                  Retail & Wholesale
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Large Rounded Food Photography & Floating Badges (5 Cols) */}
          <div className="lg:col-span-5 relative">
            {/* Main Rounded Image Container */}
            <div className="relative w-full aspect-square sm:aspect-[4/5] rounded-[2.5rem] bg-[#F7EFE6] border-2 border-[#EADBCC] shadow-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=1200&q=80"
                alt="Golden crispy Kerala banana chips made with pure coconut oil"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />

              {/* Gradient overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#281411]/80 via-transparent to-transparent opacity-80" />

              {/* Bottom Card Inside Image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#FFF9F1]/95 backdrop-blur-md border border-[#EADBCC] shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#F47735] block">
                      Kerala Specialty
                    </span>
                    <h3 className="font-display font-black text-lg text-[#281411]">
                      Crispy Nendran Chips
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FFD83D] text-[#281411] font-display font-black text-sm">
                    From ₹80
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Badge 1: Top Right */}
            <div className="absolute -top-4 -right-4 sm:top-6 sm:-right-6 bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#EADBCC] shadow-xl badge-float flex items-center gap-3 animate-bounce [animation-duration:3s]">
              <div className="w-10 h-10 rounded-xl bg-[#FFD83D] flex items-center justify-center text-[#281411] shrink-0 font-bold">
                <Flame className="w-5 h-5 text-[#F47735]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#735C57] block">Crisp & Golden</span>
                <span className="font-display font-black text-sm text-[#281411]">Traditional Wood Fired</span>
              </div>
            </div>

            {/* Floating Badge 2: Left Middle */}
            <div className="absolute -bottom-4 -left-4 sm:bottom-16 sm:-left-8 bg-[#351C18] text-[#FFF9F1] p-3.5 rounded-2xl border border-[#281411] shadow-xl badge-float flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#287B52] flex items-center justify-center text-white shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD83D] block">Vandiperiyar, Idukki</span>
                <span className="font-display font-black text-sm text-white">Direct Farm Banana</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
