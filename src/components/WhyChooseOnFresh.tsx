'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Building2, Flame, Award, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function WhyChooseOnFresh() {
  return (
    <section className="py-20 sm:py-28 bg-[#FFF9F1] border-b border-[#EADBCC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD83D]/30 border border-[#FFD83D] text-[#281411] text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F47735]" />
            Why Choose OnFresh
          </div>
          <h2 className="editorial-headline text-3xl sm:text-5xl font-black text-[#281411] tracking-tight mb-4">
            Bite Into Our Best
          </h2>
          <p className="text-sm sm:text-base text-[#735C57] font-medium max-w-xl mx-auto leading-relaxed">
            Crafted with traditional recipes from Vandiperiyar, Idukki. Whether you need individual retail packets or regular bulk wholesale shipments.
          </p>
        </div>

        {/* 3 Crave Bakery Style Promo Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          
          {/* Box 1: Retail Cravings (Cream Box) */}
          <div className="p-6 sm:p-8 rounded-[2rem] bg-[#FFFFFF] border border-[#EADBCC] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#F47735] uppercase tracking-wider block mb-1">
                For Your Home
              </span>
              <h3 className="font-display font-black text-2xl text-[#281411] mb-2">
                Sweet & Savoury Cravings
              </h3>
              <p className="text-xs text-[#735C57] leading-relaxed mb-4">
                Freshly sealed 250g, 500g, and 1kg snack packets. Perfect for family evening tea or festive gifting.
              </p>
            </div>

            <div className="relative w-full h-40 rounded-2xl overflow-hidden my-4 border border-[#EADBCC]">
              <Image
                src="https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=600&q=80"
                alt="Kerala banana chips retail packet"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <Link
              href="/products"
              className="w-full py-2.5 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Shop Retail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Box 2: Fresh Bakes Daily (Dark Cocoa with Line Doodles - Exact Crave Bakery Style) */}
          <div className="p-6 sm:p-8 rounded-[2rem] bg-[#2B1510] text-[#FFF9F1] border border-[#FFD83D]/30 shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col justify-between">
            {/* SVG Background Doodles */}
            <div className="absolute inset-0 pointer-events-none opacity-15">
              <svg className="absolute top-4 right-4 w-16 h-16 text-[#FFD83D]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15,65 C25,35 75,35 85,65 C75,55 55,50 50,50 C45,50 25,55 15,65 Z" />
              </svg>
              <svg className="absolute bottom-4 left-4 w-16 h-16 text-[#F47735]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20,60 C20,35 40,25 50,25 C60,25 80,35 80,60 C80,75 70,80 50,80 C30,80 20,75 20,60 Z" />
              </svg>
            </div>

            <div className="relative z-10">
              <span className="text-[11px] font-bold text-[#FFD83D] uppercase tracking-wider block mb-1">
                Authentic Craft
              </span>
              <h3 className="font-display font-black text-2xl text-[#FFF9F1] mb-2">
                Fresh Bakes & Chips Daily!
              </h3>
              <p className="text-xs text-[#EADBCC] leading-relaxed mb-4">
                Fried and baked each sunrise in Vandiperiyar, Idukki. 100% pure cold-pressed coconut oil, zero palm oil.
              </p>
            </div>

            <div className="relative z-10 p-4 rounded-2xl bg-[#351C18]/80 border border-[#FFD83D]/20 my-4 text-center">
              <span className="font-display font-black text-2xl text-[#FFD83D] block">
                FSSAI Certified
              </span>
              <span className="text-[11px] text-[#EADBCC] block mt-0.5">
                Highest food safety & hygienic standards
              </span>
            </div>

            <Link
              href="/products"
              className="relative z-10 w-full py-2.5 rounded-full bg-[#FFD83D] hover:bg-[#F2C71E] text-[#281411] font-display font-black text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Explore All Bakes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Box 3: Wholesale Supply (Warm Peach Box) */}
          <div className="p-6 sm:p-8 rounded-[2rem] bg-[#FEECE2] border border-[#F5A477]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#F47735] uppercase tracking-wider block mb-1">
                For Retailers & Supermarkets
              </span>
              <h3 className="font-display font-black text-2xl text-[#281411] mb-2">
                Wholesale Business Partner
              </h3>
              <p className="text-xs text-[#735C57] leading-relaxed mb-4">
                Approved business pricing, volume tiers, GST credit invoices, and regular scheduled delivery.
              </p>
            </div>

            <div className="relative w-full h-40 rounded-2xl overflow-hidden my-4 border border-[#F5A477]/40">
              <Image
                src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
                alt="Kerala snack wholesale supply"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <Link
              href="/wholesale"
              className="w-full py-2.5 rounded-full bg-[#2B1510] hover:bg-[#351C18] text-[#FFD83D] font-display font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Wholesale Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFD83D]" />
            </Link>
          </div>

        </div>

        {/* 4 Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] shadow-sm">
          {[
            { label: '100% Coconut Oil', desc: 'No palm oil or adulteration' },
            { label: 'Zero Preservatives', desc: 'Naturally preserved crunch' },
            { label: 'Daily Fresh Batches', desc: 'Direct factory freshness' },
            { label: 'Nationwide Delivery', desc: 'Tracked reliable shipping' },
          ].map((item, i) => (
            <div key={i} className="text-center sm:text-left border-r last:border-r-0 border-[#EADBCC]/60 pr-2">
              <span className="font-display font-black text-base text-[#281411] block">
                {item.label}
              </span>
              <span className="text-[11px] text-[#735C57] block mt-0.5">
                {item.desc}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
