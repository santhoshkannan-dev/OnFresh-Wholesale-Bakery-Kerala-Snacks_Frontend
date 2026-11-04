'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Flame,
  Award,
  Leaf,
  Store,
  Truck,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { registerGSAP, isReducedMotion } from '@/lib/animation/gsapUtils';
import { cardHover, fadeUp } from '@/lib/animation/motionVariants';

const FEATURES = [
  {
    id: 'freshly-prepared',
    title: 'Freshly Prepared',
    subtitle: 'Daily Sunrise Batches',
    description:
      'Fried and baked fresh every morning in Vandiperiyar, Idukki. From bubbling vats of pure coconut oil straight into sealed packaging within hours.',
    icon: Flame,
    color: '#F47735',
    bg: 'bg-[#FFF9F1]',
    border: 'border-[#EADBCC]',
    badge: 'Daily Production',
    accentText: 'text-[#F47735]',
    colSpan: 'md:col-span-2',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'authentic-flavours',
    title: 'Authentic Kerala Flavours',
    subtitle: 'High-Range Heritage Recipes',
    description:
      'Handed down through generations: thinly sliced raw Nendran bananas, organic Idukki jaggery, crushed cardamom, and fiery roasted spices.',
    icon: Award,
    color: '#FFB928',
    bg: 'bg-[#542817] text-[#FFF9EF]',
    border: 'border-[#FFB928]/30',
    badge: '100% Traditional',
    accentText: 'text-[#FFB928]',
    colSpan: 'md:col-span-1',
    isDark: true,
  },
  {
    id: 'quality-ingredients',
    title: 'Quality Ingredients',
    subtitle: 'Zero Palm Oil & Zero Preservatives',
    description:
      '100% cold-pressed coconut oil, fresh farm-direct bananas, and certified food-grade natural spices. No artificial colors or harsh preservatives.',
    icon: Leaf,
    color: '#287B35',
    bg: 'bg-[#E8F5E9]/60',
    border: 'border-[#287B35]/20',
    badge: 'FSSAI Certified',
    accentText: 'text-[#287B35]',
    colSpan: 'md:col-span-1',
  },
  {
    id: 'retail-wholesale',
    title: 'Retail & Wholesale',
    subtitle: 'One Unified Platform',
    description:
      'Whether you are an individual customer craving 250g evening tea snacks or a supermarket buyer booking 50-carton recurring deliveries.',
    icon: Store,
    color: '#542817',
    bg: 'bg-[#FEECE2]',
    border: 'border-[#F5A477]/40',
    badge: 'Dual Commerce',
    accentText: 'text-[#542817]',
    colSpan: 'md:col-span-2',
    image:
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'convenient-ordering',
    title: 'Convenient Ordering',
    subtitle: 'Digital Speed & Tracking',
    description:
      'Seamless online checkout, live order tracking, transparent B2B GST tax invoices, and multi-tier payment methods tailored for Kerala businesses.',
    icon: Truck,
    color: '#287B35',
    bg: 'bg-[#FFF9F1]',
    border: 'border-[#EADBCC]',
    badge: 'Express Logistics',
    accentText: 'text-[#287B35]',
    colSpan: 'md:col-span-1',
  },
  {
    id: 'thoughtful-packaging',
    title: 'Thoughtful Packaging',
    subtitle: 'Nitrogen-Flushed Crunch',
    description:
      'Triple-layer moisture barrier pouches and heavy-duty 5-ply corrugated export master cartons guarantee 100% crunch retention across transit.',
    icon: PackageCheck,
    color: '#FFB928',
    bg: 'bg-[#FFFFFF]',
    border: 'border-[#EADBCC]',
    badge: 'Airtight Freshness',
    accentText: 'text-[#D98200]',
    colSpan: 'md:col-span-2',
  },
];

export default function WhyChooseOnFresh() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;
      const { gsap } = registerGSAP();

      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
          y: 30,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      const cards = containerRef.current?.querySelectorAll('.feature-card');
      if (cards && cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-20 sm:py-28 bg-[#FFF9EF] border-b border-[#EADBCC] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFB928]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#287B35]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFB928]/30 border border-[#FFB928] text-[#542817] text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#287B35]" />
            Why Choose OnFresh
          </div>
          <h2 className="editorial-headline text-3xl sm:text-5xl font-black text-[#542817] tracking-tight mb-4">
            BITE INTO OUR BEST.
          </h2>
          <p className="text-sm sm:text-base text-[#735C57] font-medium max-w-xl mx-auto leading-relaxed">
            Crafted with traditional recipes from Vandiperiyar, Idukki. Whether you need individual retail packets or regular bulk wholesale shipments.
          </p>
        </div>

        {/* Asymmetric 6-Card Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className={`feature-card rounded-[2rem] p-6 sm:p-8 ${feat.bg} ${feat.border} border shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden flex flex-col justify-between ${feat.colSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        backgroundColor: feat.isDark ? '#3D1C10' : '#FFFFFF',
                        border: feat.isDark ? '1px solid rgba(255,185,40,0.3)' : '1px solid #EADBCC',
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: feat.color }} />
                    </div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        feat.isDark
                          ? 'bg-[#FFB928]/20 text-[#FFB928] border border-[#FFB928]/40'
                          : 'bg-[#542817]/10 text-[#542817] border border-[#542817]/20'
                      }`}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${feat.accentText}`}>
                    {feat.subtitle}
                  </span>
                  <h3
                    className={`font-display font-black text-2xl mb-3 tracking-tight ${
                      feat.isDark ? 'text-[#FFF9EF]' : 'text-[#542817]'
                    }`}
                  >
                    {feat.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                      feat.isDark ? 'text-[#EADBCC]' : 'text-[#735C57]'
                    }`}
                  >
                    {feat.description}
                  </p>
                </div>

                {feat.image && (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden mt-2 mb-4 border border-[#EADBCC]/60 shadow-inner">
                    <Image
                      src={feat.image}
                      alt={feat.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#287B35]" />
                    <span
                      className={`text-[11px] font-bold ${
                        feat.isDark ? 'text-[#FFB928]' : 'text-[#542817]'
                      }`}
                    >
                      Authentic Kerala Standard Guaranteed
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
              <span className="font-display font-black text-base text-[#542817] block">
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
