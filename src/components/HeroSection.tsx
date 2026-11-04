'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, Star, ShoppingBag } from 'lucide-react';

interface HeroSectionProps {
  onWholesaleClick?: () => void;
}

export default function HeroSection({ onWholesaleClick }: HeroSectionProps) {
  return (
    <div className="relative bg-[#2B1510] text-[#FFF9F1] overflow-hidden">
      {/* Hand-drawn Bakery & Kerala Doodles (SVG Background Elements inspired by Crave Bakery) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 select-none overflow-hidden">
        {/* Bread Doodle (Top Left) */}
        <svg
          className="absolute top-12 left-8 w-20 h-20 text-[#FFD83D]"
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

        {/* Croissant Doodle (Top Right) */}
        <svg
          className="absolute top-16 right-12 w-20 h-20 text-[#F47735]"
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

        {/* Wheat / Sparkle Doodle (Bottom Left) */}
        <svg
          className="absolute bottom-16 left-16 w-16 h-16 text-[#FFD83D]"
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

        {/* Star & Sparkle Accents */}
        <span className="absolute top-28 left-1/3 text-xl text-[#FFD83D]">✦</span>
        <span className="absolute top-1/4 right-1/4 text-sm text-[#FFD83D]">✧</span>
        <span className="absolute bottom-24 right-1/6 text-2xl text-[#F47735]">✦</span>
      </div>

      {/* Main Hero Container */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-20">
        
        {/* Top Header Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#351C18] border border-[#FFD83D]/30 text-xs font-bold text-[#FFD83D] tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#F47735]" />
            <span>Vandiperiyar, Idukki — Traditional Kerala Snacks & Bakery</span>
          </div>
        </div>

        {/* Center Title & Slogan */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="editorial-headline text-4xl sm:text-6xl lg:text-7xl font-black text-[#FFF9F1] tracking-tight leading-[1.05] mb-4">
            Baking Smiles, Frying Traditions <br />
            <span className="text-[#FFD83D] underline decoration-[#F47735] decoration-wavy decoration-2">
              One Batch At A Time
            </span>
          </h1>
          <p className="font-body text-base sm:text-lg text-[#EADBCC] max-w-xl mx-auto font-medium leading-relaxed">
            Taste the authentic warmth, love, and heritage of God&apos;s Own Country in every bite. Prepared fresh in 100% pure cold-pressed coconut oil.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
            <Link
              href="/products"
              className="px-8 py-3.5 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>See Our Menu</span>
            </Link>

            <Link
              href="/wholesale"
              onClick={onWholesaleClick}
              className="px-8 py-3.5 rounded-full bg-[#351C18] hover:bg-[#45241F] text-[#FFD83D] font-display font-black text-sm uppercase tracking-wider border border-[#FFD83D]/40 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-[#FFD83D]" />
              <span>Wholesale Portal</span>
            </Link>
          </div>
        </div>

        {/* 3-Column Asymmetric Display: Left Highlight | Center Big Cutout Photo | Right Customer Proof */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mt-8">
          
          {/* Left Column (3 Cols): Authentic Heritage USP */}
          <div className="lg:col-span-3 text-center lg:text-left order-2 lg:order-1 flex flex-col justify-center space-y-4">
            <div className="p-5 rounded-3xl bg-[#351C18]/90 border border-[#EADBCC]/20 backdrop-blur">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFD83D] block mb-1">
                Heritage Craft
              </span>
              <h2 className="font-display font-black text-xl text-[#FFF9F1] leading-snug">
                Bringing Joy With Fresh, Homemade Delights
              </h2>
              <p className="text-xs text-[#EADBCC] mt-2 leading-relaxed">
                Golden Kerala banana chips, authentic bakery breads, and traditional tea snacks straight from our Vandiperiyar facility.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#351C18]/60 border border-[#EADBCC]/10 flex items-center justify-between">
              <div>
                <span className="font-display font-black text-2xl text-[#FFD83D]">100%</span>
                <p className="text-[11px] text-[#EADBCC]">Pure Coconut Oil</p>
              </div>
              <div className="h-8 w-px bg-[#EADBCC]/20" />
              <div>
                <span className="font-display font-black text-2xl text-[#FFD83D]">Zero</span>
                <p className="text-[11px] text-[#EADBCC]">Preservatives</p>
              </div>
            </div>
          </div>

          {/* Center Column (6 Cols): Big Hero Product Photo (Golden Banana Chips & Croissants) */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center relative">
            <div className="relative w-full max-w-lg aspect-square sm:aspect-[4/3] rounded-[2.5rem] overflow-hidden border-2 border-[#FFD83D]/30 shadow-2xl group">
              {/* Product Showcase Image */}
              <img
                src="https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=1000&q=85"
                alt="Golden Kerala Banana Chips and Bakery Delights"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1510]/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between p-3.5 rounded-2xl bg-[#2B1510]/85 backdrop-blur border border-[#FFD83D]/30">
                <div>
                  <span className="text-[11px] font-bold text-[#FFD83D] uppercase tracking-wider block">
                    Signature Batch
                  </span>
                  <span className="font-display font-bold text-sm text-[#FFF9F1]">
                    Nendran Banana Chips & Fresh Kerala Bakes
                  </span>
                </div>
                <Link
                  href="/products/kerala-banana-chips"
                  className="px-3.5 py-1.5 rounded-full bg-[#F47735] text-[#FFFFFF] text-xs font-bold hover:bg-[#E06322] transition-colors flex items-center gap-1"
                >
                  <span>Order</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (3 Cols): Ratings & Social Proof Card (inspired by Crave Bakery) */}
          <div className="lg:col-span-3 text-center lg:text-left order-3 flex flex-col justify-center space-y-4">
            <div className="p-5 rounded-3xl bg-[#351C18]/90 border border-[#EADBCC]/20 backdrop-blur">
              {/* Rating Stars */}
              <div className="flex items-center gap-1 justify-center lg:justify-start mb-2">
                <span className="font-display font-black text-2xl text-[#FFD83D]">4.9</span>
                <div className="flex text-[#FFD83D] ml-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-[#EADBCC] ml-1">(4,850+ Reviews)</span>
              </div>

              {/* Testimonial Quote */}
              <blockquote className="text-xs text-[#FFF9F1] italic leading-relaxed border-l-2 border-[#FFD83D] pl-3 my-2">
                &ldquo;Amazing snacks and bakery goods every single time! Thin, crisp banana chips with pure coconut oil aroma. Perfect for our retail grocery supply.&rdquo;
              </blockquote>

              <p className="text-[11px] font-bold text-[#FFD83D] mt-2">
                — Manoj K., Calicut Retailer
              </p>
            </div>

            {/* Quick Delivery Badge */}
            <div className="p-4 rounded-2xl bg-[#351C18]/60 border border-[#EADBCC]/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FFD83D] text-[#281411] flex items-center justify-center font-bold text-sm shrink-0">
                📦
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[#FFF9F1] block">Direct Factory Dispatch</span>
                <span className="text-[11px] text-[#EADBCC] block">Retail packets & bulk B2B cartons</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Maison Dorée Running Ticker Bar (Continuous Loop) */}
      <div className="relative bg-[#FFD83D] text-[#281411] py-2.5 overflow-hidden border-y border-[#F47735]/30">
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
