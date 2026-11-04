'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Award, ShieldCheck, Heart, MapPin, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#2B1510] text-[#FFF9F1] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F47735]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFD83D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Story Header: Maison Dorée Style */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-serif italic text-[#FFD83D] tracking-widest uppercase block mb-2">
            How We Bake & Fry
          </span>
          <h2 className="editorial-headline text-4xl sm:text-6xl font-black text-[#FFF9F1] tracking-tight mb-4">
            Every Batch Tells A Story
          </h2>
          <p className="text-sm sm:text-base text-[#EADBCC] max-w-xl mx-auto leading-relaxed">
            From the fertile hills of Vandiperiyar, Idukki to your family table. Prepared fresh each morning following age-old Kerala recipes.
          </p>

          {/* 4 Minimal Craft Steps (Maison Dorée Style) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10">
            {[
              {
                step: '01',
                title: 'Source',
                desc: 'Handpicked premium Nendran raw bananas from local Kerala farms.',
                icon: '🌱',
              },
              {
                step: '02',
                title: '100% Pure Oil',
                desc: 'Slow fried in pure cold-pressed coconut oil with zero palm oil blends.',
                icon: '🥥',
              },
              {
                step: '03',
                title: 'Hand Seasoned',
                desc: 'Tumbled with organic turmeric, sea salt, and aromatic spices.',
                icon: '✨',
              },
              {
                step: '04',
                title: 'Sealed Fresh',
                desc: 'Nitrogen-flushed craft pouch packaging for long-lasting crispness.',
                icon: '📦',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#351C18]/80 border border-[#EADBCC]/15 text-center flex flex-col items-center hover:border-[#FFD83D]/40 transition-colors"
              >
                <span className="text-2xl mb-2">{item.icon}</span>
                <span className="text-[10px] font-mono font-bold text-[#FFD83D] uppercase tracking-widest block">
                  Step {item.step}
                </span>
                <h4 className="font-display font-black text-base text-[#FFF9F1] mt-1 mb-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#EADBCC] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Asymmetric Showcase: Authentic Kraft Packaging & Vandiperiyar Heritage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-8 border-t border-[#EADBCC]/15">
          
          {/* Left Column: Authentic Craft Packaging Card (inspired by Calicut kraft pouch reference) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-[#EADBCC] p-6 text-[#2B1510] border-2 border-[#D4C0A8] shadow-2xl">
              
              {/* Packaging Header */}
              <div className="flex items-center justify-between border-b border-[#2B1510]/20 pb-3 mb-4">
                <span className="font-display font-black text-sm tracking-wider uppercase text-[#2B1510]">
                  OnFresh Vandiperiyar
                </span>
                <span className="text-[10px] font-bold bg-[#2B1510] text-[#FFF9F1] px-2 py-0.5 rounded-full uppercase">
                  Batch #2026
                </span>
              </div>

              {/* Kraft Pouch Label Simulation */}
              <div className="text-center py-4">
                <span className="text-xs font-serif italic text-[#735C57] tracking-wider block">
                  Flavours of Vandiperiyar, Idukki
                </span>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[#2B1510] tracking-tight uppercase mt-1 mb-2">
                  Kerala Banana Chips
                </h3>
                <p className="text-xs text-[#735C57] max-w-xs mx-auto">
                  Discover the authentic taste from the land of spices and backwaters.
                </p>

                {/* Window Image Preview */}
                <div className="my-5 w-full h-44 rounded-2xl overflow-hidden relative border border-[#2B1510]/20 shadow-inner">
                  <Image
                    src="https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=800&q=80"
                    alt="Authentic crisp banana chips window"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-amber-900/10" />
                </div>

                {/* Stamp Seal Badge (From Reference Image) */}
                <div className="inline-flex flex-col items-center justify-center p-3 rounded-full border-2 border-dashed border-[#2B1510] w-28 h-28 my-1 mx-auto bg-[#FFF9F1]">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#2B1510]">PREMIUM</span>
                  <span className="font-display font-black text-xs text-[#F47735] leading-none my-0.5">100%</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#2B1510]">NATURAL</span>
                  <span className="text-[7px] font-bold uppercase tracking-widest text-[#735C57]">QUALITY</span>
                </div>

                {/* Badges Strip */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#2B1510]/20 text-center text-[10px] font-bold">
                  <div className="bg-[#FFF9F1] p-2 rounded-xl border border-[#2B1510]/10">
                    <span className="text-xs font-black text-[#F47735] block">NO</span>
                    <span>Preservatives</span>
                  </div>
                  <div className="bg-[#FFF9F1] p-2 rounded-xl border border-[#2B1510]/10">
                    <span className="text-xs font-black text-[#F47735] block">ZERO</span>
                    <span>Cholesterol</span>
                  </div>
                  <div className="bg-[#FFF9F1] p-2 rounded-xl border border-[#2B1510]/10">
                    <span className="text-xs font-black text-[#287B52] block">100%</span>
                    <span>Coconut Oil</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD83D] text-[#281411] text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#F47735]" />
              Authentic Kerala Craft
            </div>

            <h3 className="editorial-headline text-3xl sm:text-5xl font-black text-[#FFF9F1] leading-tight">
              Rooted In The High Ranges Of Vandiperiyar
            </h3>

            <p className="text-sm sm:text-base text-[#EADBCC] leading-relaxed">
              OnFresh began with a single mission: bring authentic Kerala snacks and freshly baked treats from the hill-country of Vandiperiyar, Idukki to customers and businesses across the nation.
            </p>

            <p className="text-sm sm:text-base text-[#EADBCC] leading-relaxed">
              We never cut corners with hydrogenated oils or synthetic flavours. Every batch of banana chips is cut from fresh Nendran raw bananas, fried in 100% cold-pressed coconut oil, and seasoned with natural sea salt and turmeric.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
              {[
                'Direct Farm Sourced Nendran Bananas',
                'Cold-Pressed 100% Pure Coconut Oil',
                'Certified FSSAI Hygienic Facility',
                'Dual B2C Retail & B2B Wholesale Supply',
                'Nitrogen-Flushed Airtight Packaging',
                'Custom Bulk MOQs for Supermarkets',
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#FFF9F1]">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD83D] shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-6 py-3 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <span>Shop Fresh Snacks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/wholesale"
                className="px-6 py-3 rounded-full bg-[#351C18] hover:bg-[#45241F] text-[#FFD83D] font-display font-black text-xs uppercase tracking-wider border border-[#FFD83D]/40 flex items-center gap-2"
              >
                <span>Wholesale Partnership</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
