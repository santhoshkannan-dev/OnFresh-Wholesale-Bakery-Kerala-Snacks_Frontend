'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Truck, Flame, Award, Building2, PackageCheck, HeartHandshake } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import DecorativeBadge from './ui/DecorativeBadge';

export default function WhyChooseOnFresh() {
  const features = [
    {
      title: 'Daily Fresh Frying',
      description: 'Never stored for weeks. Sliced and fried in daily batches to preserve signature crunch and aromatic freshness.',
      icon: <Flame className="w-6 h-6 text-[#F47735]" />,
      badge: 'Unmatched Crunch',
      badgeColor: 'bg-[#FFD83D] text-[#281411]',
      cardBg: 'bg-[#FFFFFF]',
    },
    {
      title: '100% Pure Coconut Oil',
      description: 'We never blend with palm oil or cheap fats. Only cold-pressed Kerala coconut oil is used for traditional frying.',
      icon: <Sparkles className="w-6 h-6 text-[#287B52]" />,
      badge: 'Zero Palm Oil',
      badgeColor: 'bg-[#E8F4EE] text-[#287B52]',
      cardBg: 'bg-[#FFF9F1]',
    },
    {
      title: 'B2C & B2B Unified Support',
      description: 'Order 1 packet for evening tea or 50 cartons for your supermarket. Tiered wholesale discounts applied automatically on checkout.',
      icon: <Building2 className="w-6 h-6 text-[#351C18]" />,
      badge: 'Retail + Wholesale',
      badgeColor: 'bg-[#FEECE2] text-[#F47735]',
      cardBg: 'bg-[#FFFFFF]',
    },
    {
      title: 'High-Barrier Foil Packaging',
      description: 'Multilayer food-grade pouches with airtight sealing retain crunch and eliminate oil rancidity throughout the shelf life.',
      icon: <PackageCheck className="w-6 h-6 text-[#F47735]" />,
      badge: 'Freshness Locked',
      badgeColor: 'bg-[#FFF9DC] text-[#281411]',
      cardBg: 'bg-[#FFF9F1]',
    },
    {
      title: 'Direct From Vandiperiyar',
      description: 'Located in the heart of Idukki district, close to the finest Nendran plantations and spice gardens of Kerala.',
      icon: <Award className="w-6 h-6 text-[#287B52]" />,
      badge: 'Idukki Grown',
      badgeColor: 'bg-[#EBF7F8] text-[#281411]',
      cardBg: 'bg-[#FFFFFF]',
    },
    {
      title: 'Prompt Regional Dispatch',
      description: 'Dispatched through trusted regional logistics across Kerala, Tamil Nadu, and Karnataka with live order tracking.',
      icon: <Truck className="w-6 h-6 text-[#351C18]" />,
      badge: 'Fast Delivery',
      badgeColor: 'bg-[#F5A477] text-[#281411]',
      cardBg: 'bg-[#FFF9F1]',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F7EFE6] border-b border-[#EADBCC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionHeading
            badge="The OnFresh Standard"
            badgeVariant="green"
            title="WHY FAMILIES & BUSINESSES"
            highlight="CHOOSE ONFRESH"
            subtitle="We blend generations-old Kerala frying methods with modern hygiene, airtight packaging, and flexible bulk supply."
          />
        </div>

        {/* Asymmetric Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl border border-[#EADBCC] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${feat.cardBg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${feat.badgeColor}`}>
                    {feat.badge}
                  </span>
                </div>

                <h3 className="font-display font-black text-xl text-[#281411] mb-2">
                  {feat.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#735C57] leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F7EFE6] flex items-center gap-2 text-[11px] font-bold text-[#287B52]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OnFresh Quality Guarantee</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
