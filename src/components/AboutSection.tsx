'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { registerGSAP } from '@/lib/animation/gsapUtils';
import { animationConfig, prefersReducedMotion } from '@/config/animationConfig';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!animationConfig.enabled || prefersReducedMotion()) return;

    const gsap = registerGSAP();
    const ctx = gsap.context(() => {
      // 1. Text Staged Reveal
      gsap.from('.story-text-anim', {
        scrollTrigger: {
          trigger: '.story-header',
          start: 'top 85%',
        },
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
      });

      // 2. Image Clipping Reveal
      gsap.from('.story-image-wrap', {
        scrollTrigger: {
          trigger: '.story-image-wrap',
          start: 'top 85%',
        },
        scale: 0.94,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
      });

      // 3. Subtle Parallax on Floating Leaves / Wheat SVGs
      gsap.to('.story-wheat-float', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: -50,
        rotate: 15,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-20 sm:py-28 bg-[#2B1510] text-[#FFF9EF] relative overflow-hidden">
      
      {/* Decorative Parallax Wheat & Leaves SVG */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-15">
        <svg
          className="story-wheat-float absolute top-12 left-10 w-28 h-28 text-[#FFB928]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="50" y1="90" x2="50" y2="10" />
          <ellipse cx="40" cy="30" rx="9" ry="5" transform="rotate(-30 40 30)" />
          <ellipse cx="60" cy="30" rx="9" ry="5" transform="rotate(30 60 30)" />
          <ellipse cx="40" cy="50" rx="9" ry="5" transform="rotate(-30 40 50)" />
          <ellipse cx="60" cy="50" rx="9" ry="5" transform="rotate(30 60 50)" />
        </svg>

        <svg
          className="story-wheat-float absolute bottom-16 right-12 w-32 h-32 text-[#287B35]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M20,80 Q50,20 80,40 Q50,70 20,80 Z" />
          <line x1="20" y1="80" x2="70" y2="45" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Story Header */}
        <div className="story-header text-center max-w-3xl mx-auto mb-16">
          <span className="story-text-anim text-xs font-serif italic text-[#FFB928] tracking-widest uppercase block mb-2">
            Heritage Bakery & Snacks
          </span>
          <h2 className="story-text-anim editorial-headline text-4xl sm:text-6xl font-black text-[#FFF9EF] tracking-tight mb-4">
            ROOTED IN TRADITION. <br />
            <span className="text-[#FFB928] underline decoration-[#F47735] decoration-wavy decoration-2">
              MADE FOR TODAY.
            </span>
          </h2>
          <p className="story-text-anim text-sm sm:text-base text-[#EADBCC] max-w-xl mx-auto leading-relaxed">
            From the mist-clad hills of Vandiperiyar, Idukki to homes and supermarkets across India. Fresh batches prepared daily using pure cold-pressed coconut oil.
          </p>

          {/* 4 Minimal Craft Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10">
            {[
              { step: '01', title: 'Source', desc: 'Handpicked Nendran plantains from Kerala farmers.', icon: '🌱' },
              { step: '02', title: 'Pure Oil', desc: '100% cold-pressed coconut oil, zero palm oil.', icon: '🥥' },
              { step: '03', title: 'Hand Seasoned', desc: 'Tumbled with turmeric, rock salt, and spices.', icon: '✨' },
              { step: '04', title: 'Sealed Fresh', desc: 'Nitrogen-flushed high barrier craft pouches.', icon: '📦' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="story-text-anim p-5 rounded-2xl bg-[#351C18]/80 border border-[#EADBCC]/15 text-center flex flex-col items-center hover:border-[#FFB928]/40 transition-colors"
              >
                <span className="text-2xl mb-2">{item.icon}</span>
                <span className="text-[10px] font-mono font-bold text-[#FFB928] uppercase tracking-widest block">
                  Step {item.step}
                </span>
                <h4 className="font-display font-black text-base text-[#FFF9EF] mt-1 mb-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#EADBCC] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Asymmetric Showcase: Authentic Kraft Packaging & Vandiperiyar Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-8 border-t border-[#EADBCC]/15">
          
          {/* Left Column: Authentic Craft Packaging Card */}
          <div className="lg:col-span-5 story-image-wrap relative">
            <div className="relative rounded-3xl bg-[#EADBCC] p-6 text-[#2B1510] border-2 border-[#D4C0A8] shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-[#2B1510]/20 pb-3 mb-4">
                <span className="font-display font-black text-sm tracking-wider uppercase text-[#2B1510]">
                  OnFresh Vandiperiyar
                </span>
                <span className="text-[10px] font-bold bg-[#2B1510] text-[#FFF9EF] px-2 py-0.5 rounded-full uppercase">
                  Batch #2026
                </span>
              </div>

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
                    src="https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=1200&q=85"
                    alt="Authentic crisp banana chips window"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-amber-900/10" />
                </div>

                {/* Stamp Seal Badge */}
                <div className="inline-flex flex-col items-center justify-center p-3 rounded-full border-2 border-dashed border-[#2B1510] w-28 h-28 my-1 mx-auto bg-[#FFF9EF]">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#2B1510]">PREMIUM</span>
                  <span className="font-display font-black text-xs text-[#F47735] leading-none my-0.5">100%</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#2B1510]">NATURAL</span>
                  <span className="text-[7px] font-bold uppercase tracking-widest text-[#735C57]">QUALITY</span>
                </div>

                {/* Badges Strip */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#2B1510]/20 text-center text-[10px] font-bold">
                  <div className="bg-[#FFF9EF] p-2 rounded-xl border border-[#2B1510]/10">
                    <span className="text-xs font-black text-[#F47735] block">NO</span>
                    <span>Preservatives</span>
                  </div>
                  <div className="bg-[#FFF9EF] p-2 rounded-xl border border-[#2B1510]/10">
                    <span className="text-xs font-black text-[#F47735] block">ZERO</span>
                    <span>Cholesterol</span>
                  </div>
                  <div className="bg-[#FFF9EF] p-2 rounded-xl border border-[#2B1510]/10">
                    <span className="text-xs font-black text-[#287B35] block">100%</span>
                    <span>Coconut Oil</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="story-text-anim inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFB928] text-[#281411] text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#F47735]" />
              Authentic Kerala Craft
            </div>

            <h3 className="story-text-anim editorial-headline text-3xl sm:text-5xl font-black text-[#FFF9EF] leading-tight">
              Rooted In The High Ranges Of Vandiperiyar
            </h3>

            <p className="story-text-anim text-sm sm:text-base text-[#EADBCC] leading-relaxed">
              OnFresh began with a single mission: bring authentic Kerala snacks and freshly baked treats from the hill-country of Vandiperiyar, Idukki to customers and businesses across the nation.
            </p>

            <p className="story-text-anim text-sm sm:text-base text-[#EADBCC] leading-relaxed">
              We never cut corners with hydrogenated oils or synthetic flavours. Every batch of banana chips is cut from fresh Nendran raw bananas, fried in 100% cold-pressed coconut oil, and seasoned with natural sea salt and turmeric.
            </p>

            {/* Checklist */}
            <div className="story-text-anim grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
              {[
                'Direct Farm Sourced Nendran Bananas',
                'Cold-Pressed 100% Pure Coconut Oil',
                'Certified FSSAI Hygienic Facility',
                'Dual B2C Retail & B2B Wholesale Supply',
                'Nitrogen-Flushed Airtight Packaging',
                'Custom Bulk MOQs for Supermarkets',
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#FFF9EF]">
                  <CheckCircle2 className="w-4 h-4 text-[#FFB928] shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="story-text-anim pt-4 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-6 py-3 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/wholesale"
                className="px-6 py-3 rounded-full bg-[#351C18] hover:bg-[#45241F] text-[#FFB928] font-display font-black text-xs uppercase tracking-wider border border-[#FFB928]/40 flex items-center gap-2 hover:scale-105 transition-transform"
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
