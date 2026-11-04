'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Truck,
  Receipt,
  PhoneCall,
  Clock,
  Layers,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import DecorativeBadge from '@/components/ui/DecorativeBadge';
import WholesaleEnquirySection from '@/components/WholesaleEnquirySection';

export default function WholesalePage() {
  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col justify-between text-[#281411]">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Wholesale Banner */}
        <section className="py-16 sm:py-24 bg-[#FFF9F1] border-b border-[#EADBCC] relative overflow-hidden">
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#FFD83D]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#F47735]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <DecorativeBadge variant="yellow" icon={<Building2 className="w-3.5 h-3.5 text-[#F47735]" />}>
                  Direct Factory Wholesale
                </DecorativeBadge>

                <h1 className="editorial-headline text-5xl sm:text-7xl lg:text-8xl font-black text-[#281411] tracking-tight leading-[0.92] mt-4 mb-6">
                  GOOD PRODUCTS.<br />
                  <span className="text-[#F47735] underline decoration-[#FFD83D] decoration-wavy decoration-2">
                    BETTER
                  </span>{' '}
                  BUSINESS.
                </h1>

                <p className="font-body text-lg sm:text-xl text-[#735C57] font-medium leading-relaxed max-w-xl mb-8">
                  Direct commercial snack supply from our Vandiperiyar facility. We supply leading Kerala supermarkets, bakery chains, regional distributors, and export packers.
                </p>

                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/register?type=business"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-2 group"
                  >
                    <span>Apply for Business Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="#enquiry"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#351C18] hover:bg-[#281411] text-[#FFD83D] font-display font-black text-xs uppercase tracking-wider shadow-md transition-colors text-center"
                  >
                    Request Catalogue
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-[#EADBCC] w-full max-w-lg">
                  <div>
                    <span className="font-display font-black text-2xl text-[#281411] block">15-30%</span>
                    <span className="text-xs font-semibold text-[#735C57]">Margin Benefit</span>
                  </div>
                  <div>
                    <span className="font-display font-black text-2xl text-[#F47735] block">24-48h</span>
                    <span className="text-xs font-semibold text-[#735C57]">Dispatch Speed</span>
                  </div>
                  <div>
                    <span className="font-display font-black text-2xl text-[#287B52] block">100%</span>
                    <span className="text-xs font-semibold text-[#735C57]">GST Compliant</span>
                  </div>
                </div>
              </div>

              {/* Right Visual (5 Cols) */}
              <div className="lg:col-span-5 relative">
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] bg-[#F7EFE6] border-2 border-[#EADBCC] shadow-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80"
                    alt="Bulk master cartons and wholesale banana chips in Vandiperiyar factory"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#281411]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#FFF9F1]/95 backdrop-blur-md border border-[#EADBCC] text-center">
                    <span className="text-xs font-bold text-[#F47735] uppercase tracking-wider block">Bulk Master Cartons</span>
                    <span className="font-display font-black text-xl text-[#281411]">Heavy Duty Export-Grade Corrugated</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. 4-Step Wholesale Onboarding Flow */}
        <section className="py-20 sm:py-28 bg-[#F7EFE6] border-b border-[#EADBCC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <SectionHeading
                badge="Simple Partner Workflow"
                badgeVariant="orange"
                title="HOW ONFRESH WHOLESALE"
                highlight="WORKS"
                subtitle="From digital registration to your first master carton delivery, our process is fast, transparent, and built for businesses."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Register Online',
                  desc: 'Provide your business details, store name, GSTIN (optional), and delivery address.',
                },
                {
                  step: '02',
                  title: 'Fast Verification',
                  desc: 'Our wholesale team reviews and activates your wholesale status within 4 hours.',
                },
                {
                  step: '03',
                  title: 'Access Wholesale Tiers',
                  desc: 'Log in to view wholesale rates, bulk quantity discounts, and flexible MOQs.',
                },
                {
                  step: '04',
                  title: 'Direct Dispatch',
                  desc: 'Freshly packed from Vandiperiyar with GST tax invoices and live logistics tracking.',
                },
              ].map((s, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="font-display font-black text-3xl text-[#FFD83D] block mb-2">
                      {s.step}
                    </span>
                    <h3 className="font-display font-black text-lg text-[#281411] mb-2">{s.title}</h3>
                    <p className="text-xs text-[#735C57] leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#F7EFE6] flex items-center gap-1.5 text-[11px] font-bold text-[#287B52]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Guaranteed Support</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Product Supply Categories */}
        <section className="py-20 sm:py-28 bg-[#FFF9F1] border-b border-[#EADBCC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <SectionHeading
                badge="Wholesale Supply Lines"
                badgeVariant="green"
                title="BULK PACKAGING"
                highlight="OPTIONS"
                subtitle="Choose the packaging format that suits your retail display shelves, supermarket gondolas, or repacking lines."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] shadow-sm space-y-4">
                <span className="w-12 h-12 rounded-2xl bg-[#FFF9DC] text-[#F47735] font-display font-black text-2xl flex items-center justify-center">
                  📦
                </span>
                <h3 className="font-display font-black text-2xl text-[#281411]">Master Retail Cartons</h3>
                <p className="text-xs text-[#735C57] leading-relaxed">
                  Boxed cartons containing 20 or 40 individual 250g or 500g pouches. Nitrogen-flushed with tamper-evident tear notches. Ready for immediate retail shelf placement.
                </p>
                <div className="pt-2 text-xs font-bold text-[#287B52]">
                  Ideal for: Supermarkets, Bakeries, Convenience Stores
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] shadow-sm space-y-4">
                <span className="w-12 h-12 rounded-2xl bg-[#E8F4EE] text-[#287B52] font-display font-black text-2xl flex items-center justify-center">
                  🌾
                </span>
                <h3 className="font-display font-black text-2xl text-[#281411]">Heavy Duty Sacks (1 kg / 5 kg)</h3>
                <p className="text-xs text-[#735C57] leading-relaxed">
                  Heavy gauge airtight food-grade poly bags designed for institutional kitchens, traditional catering, tea stalls, and local distributors.
                </p>
                <div className="pt-2 text-xs font-bold text-[#287B52]">
                  Ideal for: Caterers, Tea Stalls, Event Organisers
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] shadow-sm space-y-4">
                <span className="w-12 h-12 rounded-2xl bg-[#FEECE2] text-[#F47735] font-display font-black text-2xl flex items-center justify-center">
                  🏷️
                </span>
                <h3 className="font-display font-black text-2xl text-[#281411]">Custom Batch Runs</h3>
                <p className="text-xs text-[#735C57] leading-relaxed">
                  Tailored seasoning blends (such as Peri-Peri or Low Salt) and scheduled weekly batch deliveries to maintain zero out-of-stock events in high-volume stores.
                </p>
                <div className="pt-2 text-xs font-bold text-[#287B52]">
                  Ideal for: Multi-outlet Retail Chains, Export Houses
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Enquiry Form */}
        <WholesaleEnquirySection />
      </main>

      <Footer />
    </div>
  );
}

