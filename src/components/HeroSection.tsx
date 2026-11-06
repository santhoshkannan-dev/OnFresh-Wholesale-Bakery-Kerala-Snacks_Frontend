'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Sparkles, Building2, Star, ShoppingBag, Award } from 'lucide-react';
import { registerGSAP } from '@/lib/animation/gsapUtils';
import { animationConfig, prefersReducedMotion } from '@/config/animationConfig';

// Dynamic import of 3D Scene with SSR disabled for optimal performance
const Hero3DScene = dynamic(() => import('./three/Hero3DScene'), {
  ssr: false,
  loading: () => null,
});

interface HeroSectionProps {
  onWholesaleClick?: () => void;
}

export default function HeroSection({ onWholesaleClick }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animationConfig.enabled || prefersReducedMotion()) return;

    const gsap = registerGSAP();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: animationConfig.easings.heroEntrance } });

      // 1. Subtle Background Reveal
      tl.from('.hero-bg-glow', {
        opacity: 0,
        scale: 0.8,
        duration: 0.9,
        ease: 'power2.out',
      })
      // 2. Logo Fades and Scales into Position
      .from(
        '.hero-brand-logo',
        {
          opacity: 0,
          scale: 0.85,
          y: -10,
          duration: 0.65,
          ease: 'back.out(1.5)',
        },
        '-=0.5'
      )
      // 3. Small Announcement Label Appears
      .from(
        '.hero-label',
        {
          y: -16,
          opacity: 0,
          duration: 0.55,
        },
        '-=0.35'
      )
      // 4. Hero Headline Reveals Word by Word
      .from(
        '.hero-title-word',
        {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.75,
        },
        '-=0.3'
      )
      // 5. Supporting Text Enters Upward
      .from(
        '.hero-subtext',
        {
          y: 20,
          opacity: 0,
          duration: 0.55,
        },
        '-=0.35'
      )
      // 6. CTA Buttons Animate into Position with Pop
      .from(
        '.hero-cta-btn',
        {
          y: 20,
          opacity: 0,
          scale: 0.95,
          stagger: 0.12,
          duration: 0.6,
          ease: 'back.out(1.6)',
        },
        '-=0.3'
      )
      // 7. Hero Image Card Reveals with Organic Rounded Mask
      .from(
        '.hero-image-card',
        {
          scale: 0.93,
          opacity: 0,
          duration: 1.0,
          ease: 'power3.out',
        },
        '-=0.5'
      )
      // 8. Side Feature Cards Stagger into Place
      .from(
        '.hero-side-card',
        {
          y: 35,
          opacity: 0,
          stagger: 0.15,
          duration: 0.7,
        },
        '-=0.6'
      );

      // Continuous Gentle Floating on Decorative Elements
      gsap.to('.hero-float-item', {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.4,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative bg-[#2B1510] text-[#FFF9F1] overflow-hidden">
      
      {/* 3D Three.js WebGL Scene (Lightweight procedural floating banana chip & gold particles) */}
      <Hero3DScene />

      {/* Hand-drawn Bakery & Kerala SVG Doodles */}
      <div className="absolute inset-0 pointer-events-none opacity-20 select-none overflow-hidden z-0">
        <svg
          className="hero-float-item absolute top-12 left-8 w-20 h-20 text-[#FFB928]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path d="M20,60 C20,35 40,25 50,25 C60,25 80,35 80,60 C80,75 70,80 50,80 C30,80 20,75 20,60 Z" />
          <path d="M35,42 L42,55" />
          <path d="M50,40 L50,55" />
          <path d="M65,42 L58,55" />
        </svg>

        <svg
          className="hero-float-item absolute top-16 right-12 w-20 h-20 text-[#F47735]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path d="M15,65 C25,35 75,35 85,65 C75,55 55,50 50,50 C45,50 25,55 15,65 Z" />
          <path d="M35,45 C40,35 60,35 65,45" />
          <path d="M45,35 C48,28 52,28 55,35" />
        </svg>

        <svg
          className="hero-float-item absolute bottom-16 left-16 w-16 h-16 text-[#FFB928]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="50" y1="90" x2="50" y2="15" />
          <ellipse cx="40" cy="40" rx="8" ry="4" transform="rotate(-30 40 40)" />
          <ellipse cx="60" cy="40" rx="8" ry="4" transform="rotate(30 60 40)" />
          <ellipse cx="40" cy="60" rx="8" ry="4" transform="rotate(-30 40 60)" />
          <ellipse cx="60" cy="60" rx="8" ry="4" transform="rotate(30 60 60)" />
        </svg>

        <span className="hero-float-item absolute top-28 left-1/3 text-xl text-[#FFB928]">✦</span>
        <span className="hero-float-item absolute top-1/4 right-1/4 text-sm text-[#FFB928]">✧</span>
        <span className="hero-float-item absolute bottom-24 right-1/6 text-2xl text-[#F47735]">✦</span>
      </div>

      {/* Subtle Background Glow */}
      <div className="hero-bg-glow absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#FFB928]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Container */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-12 lg:pb-20">
        
        {/* Top Brand Logo & Header Label */}
        <div className="flex flex-col items-center justify-center gap-3 mb-6">
          <div className="hero-brand-logo flex items-center justify-center p-2 rounded-2xl bg-[#FFF9EF]/95 shadow-md">
            <img
              src="/images/logo.png"
              alt="OnFresh"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </div>

          <div className="hero-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#351C18] border border-[#FFB928]/35 text-xs font-sharp font-bold text-[#FFB928] tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F47735]" />
            <span>FRESHLY MADE. FULL OF FLAVOUR.</span>
          </div>
        </div>

        {/* Center Title & Slogan */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="editorial-headline font-monument text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFF9EF] tracking-tight leading-[1.08] mb-4">
            <span className="hero-title-word inline-block mr-3">GOOD</span>
            <span className="hero-title-word inline-block text-[#FFB928] underline decoration-[#F47735] decoration-wavy decoration-2 mr-3">
              FOOD.
            </span>
            <br />
            <span className="hero-title-word inline-block mr-3">FRESH</span>
            <span className="hero-title-word inline-block text-[#FFB928]">MOMENTS.</span>
          </h1>
          <p className="hero-subtext font-body text-base sm:text-lg text-[#EADBCC] max-w-xl mx-auto font-medium leading-relaxed">
            Discover authentic Kerala snacks and freshly baked favourites, made for every table and every business. Prepared fresh in 100% pure cold-pressed coconut oil.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-6">
            <Link
              href="/products"
              className="hero-cta-btn px-8 py-3.5 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-monument font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>

            <Link
              href="/wholesale"
              onClick={onWholesaleClick}
              className="hero-cta-btn px-8 py-3.5 rounded-full bg-[#351C18] hover:bg-[#45241F] text-[#FFB928] font-monument font-black text-xs uppercase tracking-wider border border-[#FFB928]/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#FFB928]" />
              <span>Wholesale Enquiry</span>
            </Link>
          </div>
        </div>

        {/* 3-Column Asymmetric Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mt-8">
          
          {/* Left Column (3 Cols): Authentic Heritage USP */}
          <div className="lg:col-span-3 text-center lg:text-left order-2 lg:order-1 flex flex-col justify-center space-y-4">
            <div className="hero-side-card p-5 rounded-3xl bg-[#351C18]/90 border border-[#EADBCC]/20 backdrop-blur shadow-md">
              <span className="text-[10px] font-sharp font-bold uppercase tracking-widest text-[#FFB928] block mb-1">
                Heritage Craft
              </span>
              <h2 className="font-casta font-bold text-2xl text-[#FFF9EF] leading-snug">
                Bringing Joy With Fresh Kerala Delights
              </h2>
              <p className="text-xs text-[#EADBCC] mt-2 leading-relaxed">
                Golden Kerala banana chips, authentic bakery breads, and traditional tea snacks straight from our Vandiperiyar facility.
              </p>
            </div>

            <div className="hero-side-card p-4 rounded-2xl bg-[#351C18]/60 border border-[#EADBCC]/10 flex items-center justify-between">
              <div>
                <span className="font-monument font-black text-2xl text-[#FFB928]">100%</span>
                <p className="text-[11px] text-[#EADBCC]">Pure Coconut Oil</p>
              </div>
              <div className="h-8 w-px bg-[#EADBCC]/20" />
              <div>
                <span className="font-monument font-black text-2xl text-[#FFB928]">Zero</span>
                <p className="text-[11px] text-[#EADBCC]">Preservatives</p>
              </div>
            </div>
          </div>

          {/* Center Column (6 Cols): Big Hero Product Photo (HDR Golden Banana Chips) */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center relative">
            <div className="hero-image-card relative w-full max-w-xl aspect-[16/10] sm:aspect-[16/9] rounded-[2.5rem] overflow-hidden border-2 border-[#FFB928]/40 shadow-2xl group bg-[#1F0E0A]">
              <img
                src="/images/hero-banana-chips.jpg"
                alt="Kerala Banana Chips — Handcrafted in 100% Pure Coconut Oil"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1510]/85 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#2B1510]/95 backdrop-blur-md border border-[#FFB928]/35 shadow-lg">
                <div>
                  <span className="text-[11px] font-bold text-[#FFB928] uppercase tracking-wider block">
                    Signature Kerala Specialty
                  </span>
                  <span className="font-display font-black text-sm sm:text-base text-[#FFF9EF]">
                    Crispy Nendran Banana Chips
                  </span>
                </div>
                <Link
                  href="/products/kerala-banana-chips"
                  className="px-4 py-2 rounded-full bg-[#F47735] text-[#FFFFFF] text-xs font-black uppercase tracking-wider hover:bg-[#E06322] transition-colors flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (3 Cols): Ratings & Social Proof Card */}
          <div className="lg:col-span-3 text-center lg:text-left order-3 flex flex-col justify-center space-y-4">
            <div className="hero-side-card p-5 rounded-3xl bg-[#351C18]/90 border border-[#EADBCC]/20 backdrop-blur shadow-md">
              <div className="flex items-center gap-1 justify-center lg:justify-start mb-2">
                <span className="font-display font-black text-2xl text-[#FFB928]">4.9</span>
                <div className="flex text-[#FFB928] ml-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-[#EADBCC] ml-1">(4,850+ Reviews)</span>
              </div>

              <blockquote className="text-xs text-[#FFF9EF] italic leading-relaxed border-l-2 border-[#FFB928] pl-3 my-2">
                &ldquo;Amazing snacks and bakery goods every single time! Thin, crisp banana chips with pure coconut oil aroma. Perfect for our retail grocery supply.&rdquo;
              </blockquote>

              <p className="text-[11px] font-bold text-[#FFB928] mt-2">
                — Manoj K., Calicut Retailer
              </p>
            </div>

            <div className="hero-side-card p-4 rounded-2xl bg-[#351C18]/60 border border-[#EADBCC]/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FFB928] text-[#281411] flex items-center justify-center font-bold text-sm shrink-0">
                📦
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[#FFF9EF] block">Direct Factory Dispatch</span>
                <span className="text-[11px] text-[#EADBCC] block">Retail packets & bulk B2B cartons</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Running Marquee Ticker Loop */}
      <div className="relative bg-[#FFB928] text-[#281411] py-2.5 overflow-hidden border-y border-[#F47735]/30">
        <div className="flex whitespace-nowrap animate-marquee text-xs sm:text-sm font-display font-black uppercase tracking-wider">
          <span className="inline-block px-4">✦ Fresh Nendran Banana Chips — Daily Batches</span>
          <span className="inline-block px-4">✦ 100% Pure Cold-Pressed Coconut Oil</span>
          <span className="inline-block px-4">✦ B2C Retail Packets (250g, 500g, 1kg)</span>
          <span className="inline-block px-4">✦ Approved B2B Wholesale Pricing & MOQs</span>
          <span className="inline-block px-4">✦ Direct From Vandiperiyar, Idukki Facility</span>
          <span className="inline-block px-4">✦ Zero Artificial Preservatives</span>
          <span className="inline-block px-4">✦ FSSAI Certified Manufacturing</span>
          <span className="inline-block px-4">✦ Fresh Nendran Banana Chips — Daily Batches</span>
          <span className="inline-block px-4">✦ 100% Pure Cold-Pressed Coconut Oil</span>
          <span className="inline-block px-4">✦ B2C Retail Packets (250g, 500g, 1kg)</span>
          <span className="inline-block px-4">✦ Approved B2B Wholesale Pricing & MOQs</span>
        </div>
      </div>
    </div>
  );
}
